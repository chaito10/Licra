# GLG User Guide

This guide walks you through using GLG (Granular License Generator) to create, validate, export, and manage software licenses.

## Prerequisites

- Rust 1.75 or later (for building from source)
- A modern web browser (for the web UI)
- Optionally: an LLM API key (for AI features)

## Getting Started

### Build and Verify

```sh
git clone https://github.com/glg-project/glg.git
cd glg
cargo build --release
./target/release/glg doctor
```

`glg doctor` checks that all embedded databases load correctly and the binary is functional.

### First License

The fastest way to create a license is the web UI:

```sh
glg web
# Open http://127.0.0.1:8080
```

Follow the 13-step wizard. Each step covers a category of questions. Answer the questions that apply to your project, skip the rest. When you reach the end, the tool generates your license.

Alternatively, from the CLI:

```sh
glg new --name "My Project" --license-type mit --output .
```

This creates three files in the current directory:
- `LICENSE` -- plain text
- `LICENSE.md` -- Markdown
- `LICENSE.json` -- full structured representation

## Web UI Workflow

### Starting the Server

```sh
glg web                          # default: 127.0.0.1:8080
glg web --address 0.0.0.0:3000  # custom address
```

### The Questionnaire

The wizard presents 300+ questions organized into 13 steps:

| Step | Category | Examples |
|------|----------|----------|
| 1 | Ownership and Copyright | Who owns the code? Who holds copyright? |
| 2 | Rights | Patent grants, commercial use, research use |
| 3 | Dependencies | License compatibility, linking obligations |
| 4 | Distribution | Source disclosure, binary distribution |
| 5 | Modification | Derivative works, modification terms |
| 6 | Security and Liability | Warranty disclaimer, liability limitation |
| 7 | Special Terms | Trademark, AI/ML usage, privacy |
| 8 | Review | Final review of all answers |
| 9 | Export | Choose output formats |

Questions adapt based on your previous answers. For example, patent-related questions only appear if you selected patent grant options.

### Navigation

- Use the **Next** and **Previous** buttons to move between steps
- The sidebar shows your progress in each category
- **Ctrl+K** opens the search bar to find specific questions
- Your answers are saved automatically in the browser (localStorage)

### Generating the License

After completing the questionnaire:

1. Click **Generate License** on the final step
2. The server compiles your answers into a license
3. The result appears in the preview panel with:
   - Full license text
   - JSON metadata (hash, fingerprint, SPDX expression)
   - Validation status
   - Warnings (if any)

### Post-Generation Actions

From the result panel you can:

- **Export** -- download in any of 9 formats (Plain Text, Markdown, HTML, JSON, YAML, TOML, XML, SPDX JSON, CycloneDX)
- **Validate** -- run the validation engine to check completeness
- **Explain** -- get a plain-language summary of what the license means
- **Compare** -- check compatibility with other licenses

## CLI Workflow

### Creating a License

```sh
# Interactive (guided prompts)
glg new

# With flags
glg new --name "My Project" --license-type apache2 --output ./licenses
```

### Generating from Configuration

Create a JSON configuration file describing your license, then:

```sh
glg generate --config license-request.json --output ./out
glg generate --config request.json --formats text,md,html,json
```

### Exporting

Convert an existing license to another format:

```sh
glg export --input LICENSE.json --format md
glg export --input LICENSE.json --format html --output LICENSE.html
glg export --input LICENSE.json --format spdx
glg export --input LICENSE.json --format cyclonedx
glg export --input LICENSE.json --format yaml
```

### Importing

Read an existing license into GLG format:

```sh
glg import LICENSE.spdx.json
glg import existing-license.json --output imported.json
```

### Validation

Check a license for issues:

```sh
glg validate LICENSE
glg validate LICENSE.json
```

Validation checks:
- Structural integrity (metadata, sections present)
- SPDX expression validity
- Clause dependency resolution
- No unresolved template variables
- No clause conflicts
- Completeness score

### Comparing Licenses

Check if two or more licenses are compatible:

```sh
glg compare MIT Apache-2.0
glg compare MIT GPL-3.0-only --verbose
glg compare MIT BSD-2-Clause ISC
```

The compatibility engine uses a directional matrix. A compatible with B does not imply B compatible with A.

### Explaining Licenses

Get a plain-language explanation:

```sh
glg explain LICENSE
glg explain MIT
glg explain LICENSE --ai    # uses LLM if configured
```

### Digital Signatures

Sign a license to prove authenticity:

```sh
glg sign LICENSE
glg sign LICENSE --algorithm ed25519 --key my-key.json
```

Verify a signature:

```sh
glg verify LICENSE
glg verify LICENSE --key public-key.json
```

### Hashing

Compute cryptographic hashes:

```sh
glg hash LICENSE
glg hash ./src --algorithm blake3
glg hash LICENSE --algorithm all    # blake3 + sha256 + sha3-256
```

Directory hashing produces a deterministic hash by sorting files and merging individual hashes.

### AI Features

Query an LLM for license guidance:

```sh
glg ai LICENSE --task explain
glg ai "MIT, Apache-2.0" --task conflicts
glg ai LICENSE --task summarize
glg ai LICENSE --task recommend
glg ai "permissive with patent grant" --task suggest
```

Configure your LLM provider via environment variables:

```sh
export OPENAI_API_KEY=sk-...         # OpenAI
export ANTHROPIC_API_KEY=sk-ant-...  # Claude
export GEMINI_API_KEY=...            # Gemini
export DEEPSEEK_API_KEY=...          # DeepSeek
export OPENROUTER_API_KEY=...        # OpenRouter
```

Ollama and llama.cpp run locally and require no API key.

## Understanding the Output

### License Object (JSON)

A compiled license in JSON format contains:

- **metadata**: name, version, license type, SPDX expression, copyright holder, timestamps, hash, fingerprint
- **sections**: ordered list of sections, each with title, content (rendered template), priority, category
- **answers**: full questionnaire answers (question ID, value, timestamp)
- **warnings**: any warnings produced during compilation (missing sections, unresolved dependencies, etc.)
- **warnings_summary**: array of warning code strings

### Hash and Fingerprint

- **hash**: cryptographic hash of the license text (algorithm depends on context)
- **fingerprint**: hash of the canonical JSON representation of the license, used for tamper detection

### SPDX Expression

The SPDX expression represents the license in standard format:
- Simple: `MIT`
- Compound: `MIT AND Apache-2.0`
- OR: `MIT OR Apache-2.0`
- With exception: `GPL-2.0-only WITH Classpath-exception-2.0`
- Custom: `LicenseRef-custom`

## Troubleshooting

### glg doctor fails

Run `glg doctor` to check your installation. If it fails, ensure you built with `cargo build --release` from the project root.

### Web UI does not load

Ensure port 8080 is not in use, or specify a different port:

```sh
glg web --address 127.0.0.1:9090
```

### LLM features return errors

Check that your API key environment variable is set and the provider is reachable:

```sh
echo $OPENAI_API_KEY    # should print your key (or a portion of it)
```

For local providers (Ollama, llama.cpp), ensure the server is running before calling `glg ai`.

### Compilation warnings

Warnings during compilation indicate potential issues. Review them before exporting:
- Missing required sections (e.g., no warranty disclaimer)
- Unresolved template variables
- Clause conflicts (rare, usually from contradictory answers)
