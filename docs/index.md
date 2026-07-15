# GLG - Granular License Generator

A modern, Rust-based license compiler that generates deterministic, granular software licenses from a comprehensive questionnaire.

---

<div class="grid cards" markdown>

-   :material-license:{ .lg .middle } **30+ License Types**

    ---

    MIT, Apache-2.0, GPL, AGPL, BSD, ISC, MPL, LGPL, Unlicense, CC0, EUPL, SSPL, BUSL, and more.

    [:octicons-arrow-right-24: Getting Started](getting-started/index.md)

-   :material-file-document:{ .lg .middle } **314 Questions**

    ---

    Granular questionnaire covering ownership, copyright, commercial use, patents, AI/ML, compliance, and 70+ categories.

    [:octicons-arrow-right-24: User Guide](user-guide/index.md)

-   :material-export:{ .lg .middle } **9 Export Formats**

    ---

    Plain Text, Markdown, HTML, JSON, YAML, TOML, XML, SPDX, CycloneDX SBOM.

    [:octicons-arrow-right-24: Output Formats](user-guide/output-formats.md)

-   :material-lock:{ .lg .middle } **Deterministic & Offline**

    ---

    Same inputs always produce identical output. Single binary, no cloud dependency.

    [:octicons-arrow-right-24: Architecture](architecture.md)

</div>

---

## Quick Start

=== "Web UI"

    ```sh
    glg web
    # Open http://127.0.0.1:8080
    ```

    The web UI provides a 13-step wizard with 314 questions, live license preview, dark/light themes, and one-click export.

=== "CLI"

    ```sh
    glg new --name "My Project" --license-type mit --output .
    ```

    Generates `LICENSE`, `LICENSE.md`, and `LICENSE.json` in the current directory.

=== "Build from Source"

    ```sh
    git clone https://github.com/glg-project/glg.git
    cd glg
    cargo build --release
    ./target/release/glg doctor
    ```

---

## Features

| Feature | Description |
|---------|-------------|
| **Clause Compiler** | 50+ clause templates with dependency resolution and conflict detection |
| **SPDX Support** | 86 SPDX licenses, expression parser, LicenseRef for custom licenses |
| **Compatibility Engine** | Pairwise analysis for 21+ licenses with upgrade path detection |
| **Digital Signatures** | Ed25519 signing, verification, and key generation |
| **Cryptographic Hashing** | BLAKE3, SHA-256, SHA3-256 for files, folders, and text |
| **QR Codes** | SVG QR codes for license verification links |
| **Validation** | Structural, SPDX, clause conflict, and completeness scoring |
| **AI Integration** | Optional LLM support (Ollama, OpenAI, Claude, Gemini, DeepSeek, OpenRouter) |
| **Web UI** | Responsive wizard with dark/light themes and live preview |

---

## Supported License Types

| Category | Licenses |
|----------|----------|
| **Public Domain** | CC0-1.0, Unlicense, WTFPL |
| **Permissive** | MIT, ISC, BSD-2-Clause, BSD-3-Clause, Apache-2.0, 0BSD |
| **Weak Copyleft** | MPL-2.0, LGPL-2.1, LGPL-3.0, EPL-2.0 |
| **Strong Copyleft** | GPL-2.0, GPL-3.0, AGPL-3.0 |
| **Network Copyleft** | SSPL-1.0, AGPL-3.0 |
| **European** | EUPL-1.2 |
| **Commercial** | BUSL-1.1, PolyForm, Commons Clause, Proprietary |
| **Custom** | Any combination via the clause compiler |

---

## Next Steps

- [Installation](getting-started/installation.md) -- Install GLG on your system
- [Quick Start](getting-started/quickstart.md) -- Generate your first license in 60 seconds
- [User Guide](user-guide/index.md) -- Complete guide to using GLG
- [CLI Reference](reference/cli-reference.md) -- All CLI commands documented
- [Architecture](architecture.md) -- How GLG works internally
