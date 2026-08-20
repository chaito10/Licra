# Changelog

All notable changes to GLG.

## [1.0.0] - 2026-08-14

### Added

- **314-question granular questionnaire** covering 80+ categories
  - Ownership, Copyright, Commercial Use, Research, Academic
  - Patent Grant, Patent Retaliation, Trademark
  - Source Disclosure, Static/Dynamic Linking, Network Use
  - Distribution, Modification, Private Use
  - Government, Military, Defense
  - AI Training, AI Inference, Model Weights, Dataset Usage
  - Redistribution, Resale, Hosting, Cloud, SaaS, PaaS, Containers, OEM
  - Attribution, Notice, Warranty, Liability
  - Termination, Revocation, Expiration
  - Jurisdiction, Export Control, Cryptography
  - DRM, Watermarking, Derivative Works, Forks
  - Contributions, Pull Requests, CLA
  - Dual Licensing, Royalty, Subscription
  - Per Seat, Per User, Per Device, Per CPU, Per Company
  - Open Core, Enterprise Features, Feature Flags
  - Telemetry, Privacy, Children, Healthcare, Finance
  - Government Use, Defense, Biotechnology, Nuclear
  - Robotics, IoT, Embedded
  - Education, Research Institutions, Nonprofit, Foundation
  - Commercial Exceptions, Special Permissions

- **License Compiler** with clause template engine
  - 50 clause templates with UUIDs
  - Dependency resolution and conflict detection
  - Variable substitution
  - Deterministic output

- **SPDX License Database**
  - 86 embedded SPDX licenses
  - Recursive-descent expression parser
  - AND, OR, WITH operators
  - LicenseRef custom identifiers

- **Compatibility Engine**
  - 21-license pairwise compatibility matrix
  - Upgrade path detection
  - Batch compatibility checking
  - Detailed explanations

- **9 Export Formats**
  - Plain Text, Markdown, HTML, JSON, YAML, TOML, XML
  - SPDX 3.0 JSON document
  - CycloneDX 1.5 SBOM

- **Cryptographic Operations**
  - BLAKE3, SHA-256, SHA3-256 hashing
  - File and folder hashing
  - Ed25519 digital signatures (with ECDSA/RSA simulation)
  - Deterministic license IDs (UUID v5)
  - Privacy-preserving licensee hashing

- **QR Code Generation**
  - SVG QR codes for license verification

- **Validation Engine**
  - Structural validation
  - SPDX expression validation
  - Clause conflict detection
  - Completeness scoring (0-100)
  - Template variable verification

- **AI Integration**
  - 7 LLM providers: Ollama, OpenAI-compatible, Claude, Gemini, DeepSeek, OpenRouter, llama.cpp
  - Tasks: explain, suggest, summarize, conflicts, recommend
  - AI used only for explanation, never for legal clause generation

- **Web UI**
  - 13-step wizard interface
  - Dark and light themes
  - Live license preview
  - Search functionality (Ctrl+K)
  - Progress tracking with localStorage
  - Responsive design
  - CORS-enabled REST API
  - Static single-file PWA build (`build-pwa.py`) — works offline with no server

- **CLI** with 14 commands
  - web, new, open, generate, export, import
  - validate, compare, explain
  - sign, verify, hash
  - ai, doctor

- **Documentation**
  - MkDocs Material documentation site
  - GitHub Pages deployment
  - Architecture documentation
  - User guide
  - CLI reference
  - API reference

- **Testing**
  - 156 tests (111 unit + 45 integration)
  - Test coverage for all modules
