# CLI Usage

GLG provides 14 CLI commands for license management.

## Command Overview

```
glg <COMMAND>

Commands:
  web       Start the web UI for interactive license generation
  new       Create a new license interactively (CLI questionnaire)
  open      Open and edit an existing license file
  generate  Generate license files from a JSON configuration
  export    Export a license to a specific format
  import    Import a license from SPDX, JSON, or YAML
  validate  Validate a license for completeness and correctness
  compare   Compare compatibility between two or more licenses
  explain   Explain a license in plain language
  sign      Digitally sign a license file
  verify    Verify a digital signature on a license
  hash      Compute cryptographic hashes for files, folders, or repositories
  ai        Query the AI assistant for license guidance
  doctor    Run diagnostics to check the installation
```

## glg web

Start the interactive web UI.

```sh
glg web                          # default: 127.0.0.1:8080
glg web --address 0.0.0.0:3000  # custom address
```

## glg new

Create a new license.

```sh
glg new                                          # interactive prompts
glg new --name "My Project" --license-type mit   # direct generation
glg new --name "Backend" --license-type apache2 --output ./licenses
```

| Flag | Description | Default |
|------|-------------|---------|
| `-n, --name` | Project name | prompt |
| `-t, --license-type` | License type identifier | `mit` |
| `-o, --output` | Output directory | `.` |

## glg open

Display an existing license file.

```sh
glg open LICENSE
glg open LICENSE.json
```

## glg generate

Generate from a JSON configuration file.

```sh
glg generate --config license-request.json --output ./out
glg generate --config request.json --formats text,md,html,json --output .
```

## glg export

Export a license to a specific format.

```sh
glg export --input LICENSE.json --format md
glg export --input LICENSE.json --format html --output LICENSE.html
glg export --input LICENSE.json --format spdx
glg export --input LICENSE.json --format cyclonedx
```

Supported formats: `text`, `md`, `html`, `json`, `yaml`, `toml`, `xml`, `spdx`, `cyclonedx`

## glg import

Import a license from SPDX, JSON, or YAML.

```sh
glg import LICENSE.spdx.json
glg import existing-license.json --output imported.json
```

## glg validate

Validate a license for completeness and correctness.

```sh
glg validate LICENSE
glg validate LICENSE.json
```

Validation checks:

- Structural integrity
- SPDX expression validity
- Clause dependency resolution
- No unresolved template variables
- No clause conflicts
- Completeness score (0-100)

## glg compare

Check compatibility between two or more licenses.

```sh
glg compare MIT Apache-2.0
glg compare MIT GPL-3.0-only --verbose
glg compare MIT BSD-2-Clause ISC
```

## glg explain

Explain a license in plain language.

```sh
glg explain LICENSE
glg explain MIT
glg explain LICENSE --ai    # uses LLM if configured
```

## glg sign

Digitally sign a license file (Ed25519).

```sh
glg sign LICENSE
glg sign LICENSE --algorithm ed25519 --key my-key.json
```

## glg verify

Verify a digital signature.

```sh
glg verify LICENSE
glg verify LICENSE --key public-key.json
```

## glg hash

Compute cryptographic hashes.

```sh
glg hash LICENSE
glg hash ./src --algorithm blake3
glg hash LICENSE --algorithm all    # blake3 + sha256 + sha3-256
```

## glg ai

Query an LLM for license guidance.

```sh
glg ai LICENSE --task explain
glg ai "MIT, Apache-2.0" --task conflicts
glg ai LICENSE --task summarize
glg ai LICENSE --task recommend
glg ai "permissive with patent grant" --task suggest
```

Tasks: `explain`, `suggest`, `summarize`, `conflicts`, `recommend`

## glg doctor

Run diagnostics.

```sh
glg doctor
```
