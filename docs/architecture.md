# GLG Architecture

This document describes the internal architecture of the GLG (Granular License Generator) system, written in Rust.

## System Overview

GLG is a single-binary license compiler that transforms structured questionnaire answers into deterministic, clause-based software licenses. It combines a domain-specific compiler, embedded databases, a crypto layer, and an interactive web UI.

```
+------------------+     +-----------------+     +------------------+
| Questionnaire    | --> | Clause Database | --> | Compiler         |
| (300+ questions) |     | (50+ templates) |     | (select + render)|
+------------------+     +-----------------+     +------------------+
                                                          |
                                                          v
+------------------+     +-----------------+     +------------------+
| Export           | <-- | Validation      | <-- | License Output   |
| (9 formats)      |     | (structural,    |     | (deterministic)  |
+------------------+     |  SPDX, clause)  |     +------------------+
                         +-----------------+
```

## Module Map

| Module | File | Responsibility |
|--------|------|----------------|
| `license` | `src/license.rs` | Core data types: `License`, `LicenseMetadata`, `QuestionnaireAnswer`, enums, error types |
| `questionnaire` | `src/questionnaire.rs` | Question definitions, categories, types, conditional visibility rules |
| `clauses` | `src/clauses.rs` | Clause templates, variable substitution, dependency/conflict resolution, embedded JSON database |
| `compiler` | `src/compiler.rs` | `LicenseCompiler`: orchestrates question-to-clause selection, template rendering, section assembly |
| `spdx` | `src/spdx.rs` | SPDX license database, expression parser, compatibility data, license text storage |
| `compatibility` | `src/compatibility.rs` | Pairwise license compatibility matrix, upgrade path detection |
| `validator` | `src/validator.rs` | Structural, SPDX, clause, and completeness validation with scoring |
| `export` | `src/export.rs` | Multi-format export (9 formats), SPDX and CycloneDX SBOM generation |
| `crypto` | `src/crypto.rs` | Hashing (Blake3, SHA-256, SHA3-256), digital signatures (Ed25519, ECDSA, RSA), QR codes |
| `database` | `src/database.rs` | `GlgDatabase`: unified facade over SPDX, compatibility, and clause databases |
| `llm` | `src/llm.rs` | LLM provider abstraction (7 providers) for AI-assisted license explanation and suggestion |
| `ui` | `src/ui.rs` | axum web server, REST API routes, session state |
| `html` | `src/html.rs` | Embedded HTML/CSS/JS for the web UI |
| `main` | `src/main.rs` | CLI entry point (clap), subcommand dispatch |

## Core Data Flow

### 1. Questionnaire Phase

The `Questionnaire` struct holds a vector of `Question` objects. Each question has:

- **id**: unique identifier (e.g., `"ownership_entity_type"`)
- **category**: one of 20 categories (`Ownership`, `Copyright`, `CommercialUse`, `Research`, `Academic`, `PatentGrant`, `PatentRetaliation`, `Trademark`, `SourceDisclosure`, `StaticLinking`, `DynamicLinking`, `NetworkUse`, `Distribution`, `Modification`, `PrivateUse`, `Liability`, `Warranty`, `TrademarkUse`, `AiTraining`, `AiOutput`, `Compatibility`)
- **question_text**: the prompt shown to the user
- **question_type**: `YesNo`, `SingleChoice`, `MultiChoice`, `FreeText`
- **options**: for choice questions, a list of `QuestionOption` values
- **variables**: list of variable names this question populates
- **description**: help text
- **dependencies**: other question IDs that must be answered first
- **required**: whether the question is mandatory
- **visibility**: `VisibilityCondition` that controls when the question is shown (depends on another question's answer)

Questions are organized into 13 wizard steps in the web UI:
Ownership and Copyright, Rights, Dependencies, Distribution, Modification, Security and Liability, Special Terms, Review, Export.

### 2. Compilation Phase

`LicenseCompiler::compile(answers)` executes:

1. **Answer validation** -- checks required questions are answered, dependency chains are satisfied
2. **Clause selection** -- for each answered question, selects applicable clauses from the `ClauseDatabase` based on question ID, answer value, and variable bindings
3. **Dependency resolution** -- activates clauses that other selected clauses depend on (topological sort)
4. **Conflict resolution** -- detects and reports clause conflicts (A depends on B, B conflicts with C, etc.)
5. **Template rendering** -- for each selected clause, substitutes `{{variable}}` placeholders with answer values using Handlebars-like syntax
6. **Priority sorting** -- sections are sorted by clause priority to ensure deterministic output ordering
7. **Section assembly** -- rendered sections are concatenated with proper headings and separators
8. **License construction** -- produces a `License` object with full metadata (hash, fingerprint, timestamps, SPDX expression, sections, warnings)

The output is deterministic: given the same input answers, the same license text, hash, and fingerprint are always produced.

### 3. Clause Database

The clause database is embedded as JSON at compile time via `include_str!`. Each clause has:

- **id**: UUID string (e.g., `"930aa299-..."`)
- **name**: human-readable name
- **template**: Handlebars-style template string
- **variables**: list of variable names used in the template
- **category**: clause category
- **dependencies**: other clause IDs that must be present
- **conflicts**: clause IDs that cannot coexist
- **priority**: integer for ordering (lower = earlier in output)
- **tags**: searchable tags
- **applicable_licenses**: list of SPDX license IDs this clause applies to

The database supports variable substitution with conditional sections (`{{#if variable}}...{{/if}}`) and default values (`{{variable | default: "value"}}`).

### 4. SPDX Database

Also embedded via `include_str!`. Contains 80+ license definitions with:

- **id**: SPDX identifier (e.g., `"MIT"`)
- **name**: full name
- **spdx_id**: canonical SPDX expression
- **osi_approved**: whether the OSI has approved this license
- **fsf_free**: whether the FSF considers this a free license
- **text**: full license text
- **url**: official license URL
- **compatibility**: list of compatible license IDs (directional -- A compatible with B does not imply B compatible with A)

The `SpdxExpression` parser supports:
- Simple identifiers: `MIT`
- Conjunctions: `MIT AND Apache-2.0`
- Disjunctions: `MIT OR Apache-2.0`
- Exceptions: `GPL-2.0-only WITH Classpath-exception-2.0`
- LicenseRef: `LicenseRef-custom-id`

### 5. Compatibility Engine

`CompatibilityMatrix` stores directional compatibility pairs. Key design decisions:

- **Directional**: A compatible with B does not imply B compatible with A (e.g., GPL-3.0 compatible with Apache-2.0, but not vice versa)
- **Upgrade paths**: detected when one license is a superset of another's permissions
- **Batch checking**: `check_batch` evaluates multiple license pairs in one call
- **Conflict detection**: identifies license pairs that cannot be combined in a single project

### 6. Validation Engine

`LicenseValidator` performs four types of checks:

1. **Structural validation**: license must have metadata, at least one clause section, valid JSON
2. **SPDX validation**: validates SPDX expression syntax, checks all referenced licenses exist in the database
3. **Clause validation**: no unresolved variables, no unresolved dependencies, no unmet conflict constraints
4. **Completeness scoring**: based on presence of metadata fields (name, version, copyright holder, SPDX expression, timestamps, sections) and absence of warnings

### 7. Export Pipeline

`LicenseExporter` handles 9 output formats:

| Format | MIME | Extension | Notes |
|--------|------|-----------|-------|
| PlainText | text/plain | `.txt` | Human-readable |
| Markdown | text/markdown | `.md` | GFM compatible |
| Html | text/html | `.html` | Includes CSS styling |
| Json | application/json | `.json` | Full structured output |
| Yaml | application/x-yaml | `.yaml` | Human-readable structured |
| Toml | application/toml | `.toml` | Configuration format |
| Xml | application/xml | `.xml` | Custom license XML |
| Spdx | application/spdx+json | `.spdx.json` | SPDX 2.3 document |
| CycloneDX | application/vnd.cyclonedx | `.bom.json` | SBOM format |

### 8. Cryptographic Layer

Three independent subsystems:

- **Hashing**: `hash_file` and `hash_directory` using Blake3 (default), SHA-256, SHA3-256, or all three. Directory hashing produces a sorted merge of file hashes for determinism.
- **Digital signatures**: `generate_key_pair`, `sign`, `verify` using Ed25519 via ed25519-dalek. ECDSA and RSA are simulated. Private keys are never embedded in output.
- **QR codes**: `generate_qr_code` produces SVG QR codes encoding license verification URLs.

### 9. LLM Integration

`LlmClient` provides a unified interface across 7 providers. Each provider implements `send_request` with format-specific request/response serialization.

| Provider | Environment Variable | Default Base URL |
|----------|---------------------|------------------|
| OpenAI-compatible | `OPENAI_API_KEY` | `https://api.openai.com/v1` |
| Ollama | -- | `http://127.0.0.1:11434/v1` |
| Claude | `ANTHROPIC_API_KEY` | `https://api.anthropic.com/v1` |
| Gemini | `GEMINI_API_KEY` | `https://generativelanguage.googleapis.com/v1beta/openai` |
| DeepSeek | `DEEPSEEK_API_KEY` | `https://api.deepseek.com/v1` |
| OpenRouter | `OPENROUTER_API_KEY` | `https://openrouter.ai/api/v1` |
| llama.cpp | -- | `http://127.0.0.1:1234/v1` |

Tasks: `Explain`, `Suggest`, `Conflicts`, `Summarize`, `Recommend`.

### 10. Web Server

axum-based server with:

- **Routes**: `GET /` (HTML), `GET /api/questions`, `POST /api/compile`, `POST /api/validate`, `POST /api/compare`, `POST /api/export`, `POST /api/search`, `POST /api/explain`
- **Static assets**: HTML/CSS/JS embedded via `include_str!`
- **CORS**: permissive (any origin, any header, any method) for local development
- **State**: `AppState` holds `Arc<GlgDatabase>`, `Arc<LlmClient>`, and a `CompilationSession` (answers, progress, last result)
- **Session state**: answers persisted in-memory per server process; web UI persists to localStorage

### 11. CLI

Uses clap for argument parsing. Subcommands dispatch to library functions in `glg`:

- `web` -- starts axum server
- `new` -- interactive or flag-driven license creation
- `open` -- displays license file
- `generate` -- compiles from JSON config
- `export` -- converts between formats
- `import` -- reads SPDX/JSON/YAML
- `validate` -- runs validation pipeline
- `compare` -- checks compatibility matrix
- `explain` -- plain-language explanation
- `sign` -- Ed25519 digital signature
- `verify` -- signature verification
- `hash` -- file/directory hashing
- `ai` -- LLM-powered tasks
- `doctor` -- installation diagnostics

## Design Principles

- **Deterministic output**: same inputs always produce identical text, hash, and fingerprint
- **Offline-first**: all databases embedded in the binary, no cloud dependency required
- **Modular**: each subsystem is independently testable
- **Type-safe**: Rust's type system prevents invalid license states at compile time
- **Composable**: export formats, crypto algorithms, and LLM providers are pluggable
