# CLI Reference

Complete reference for all GLG CLI commands.

## glg

```
glg [OPTIONS] <COMMAND>
```

| Option | Description |
|--------|-------------|
| `-h, --help` | Print help |
| `-V, --version` | Print version |

---

## glg web

Start the web UI server.

```
glg web [OPTIONS]
```

| Flag | Description | Default |
|------|-------------|---------|
| `-a, --address` | Bind address | `127.0.0.1:8080` |

**Examples:**

```sh
glg web
glg web --address 0.0.0.0:3000
```

---

## glg new

Create a new license.

```
glg new [OPTIONS]
```

| Flag | Description | Default |
|------|-------------|---------|
| `-o, --output` | Output directory | `.` |
| `-n, --name` | Project name | prompt |
| `-t, --license-type` | License type | `mit` |

**License Types:**

| Type | SPDX ID | Description |
|------|---------|-------------|
| `mit` | MIT | MIT License |
| `apache2` | Apache-2.0 | Apache License 2.0 |
| `gpl2` | GPL-2.0-only | GNU GPL v2.0 |
| `gpl3` | GPL-3.0-only | GNU GPL v3.0 |
| `lgpl3` | LGPL-3.0-only | GNU LGPL v3.0 |
| `agpl3` | AGPL-3.0-only | GNU AGPL v3.0 |
| `bsd2` | BSD-2-Clause | BSD 2-Clause |
| `bsd3` | BSD-3-Clause | BSD 3-Clause |
| `isc` | ISC | ISC License |
| `mpl2` | MPL-2.0 | Mozilla Public License 2.0 |
| `unlicense` | Unlicense | The Unlicense |
| `cc0` | CC0-1.0 | CC0 1.0 Universal |
| `proprietary` | LicenseRef-custom | Proprietary |

**Examples:**

```sh
glg new --name "My Project" --license-type mit
glg new --name "Backend" --license-type apache2 --output ./licenses
```

---

## glg open

Display an existing license file.

```
glg open <PATH>
```

| Argument | Description |
|----------|-------------|
| `PATH` | Path to license file |

---

## glg generate

Generate license files from a JSON configuration.

```
glg generate [OPTIONS]
```

| Flag | Description | Default |
|------|-------------|---------|
| `-c, --config` | Input JSON config | required |
| `-o, --output` | Output directory | `.` |
| `-f, --formats` | Comma-separated formats | `text,md,json` |

**Formats:** `text`, `md`, `html`, `json`, `yaml`, `toml`, `xml`, `spdx`, `cyclonedx`

---

## glg export

Export a license to a specific format.

```
glg export [OPTIONS]
```

| Flag | Description | Default |
|------|-------------|---------|
| `-i, --input` | License file | required |
| `-f, --format` | Output format | required |
| `-o, --output` | Output file | stdout |

---

## glg import

Import a license from SPDX, JSON, or YAML.

```
glg import <PATH> [OPTIONS]
```

| Flag | Description | Default |
|------|-------------|---------|
| `-o, --output` | Output file | stdout |

---

## glg validate

Validate a license for completeness and correctness.

```
glg validate <PATH>
```

**Exit codes:**

| Code | Meaning |
|------|---------|
| 0 | Valid |
| 1 | Invalid or errors found |

---

## glg compare

Compare compatibility between licenses.

```
glg compare <LICENSES>... [OPTIONS]
```

| Flag | Description | Default |
|------|-------------|---------|
| `-v, --verbose` | Show detailed explanations | false |

**Examples:**

```sh
glg compare MIT Apache-2.0
glg compare MIT GPL-3.0-only --verbose
```

---

## glg explain

Explain a license in plain language.

```
glg explain <SOURCE> [OPTIONS]
```

| Flag | Description | Default |
|------|-------------|---------|
| `--ai` | Use AI for explanation | false |

---

## glg sign

Digitally sign a license file.

```
glg sign <PATH> [OPTIONS]
```

| Flag | Description | Default |
|------|-------------|---------|
| `-k, --key` | Key file path | generated |
| `-a, --algorithm` | Algorithm | `ed25519` |

**Algorithms:** `ed25519`, `ecdsa`, `rsa`

---

## glg verify

Verify a digital signature.

```
glg verify <PATH> [OPTIONS]
```

| Flag | Description | Default |
|------|-------------|---------|
| `-k, --key` | Public key file | from `.sig` file |

---

## glg hash

Compute cryptographic hashes.

```
glg hash <PATH> [OPTIONS]
```

| Flag | Description | Default |
|------|-------------|---------|
| `-a, --algorithm` | Algorithm | `all` |

**Algorithms:** `blake3`, `sha256`, `sha3`, `all`

---

## glg ai

Query an AI assistant for license guidance.

```
glg ai <SOURCE> [OPTIONS]
```

| Flag | Description | Default |
|------|-------------|---------|
| `-t, --task` | Task type | `explain` |

**Tasks:** `explain`, `suggest`, `summarize`, `conflicts`, `recommend`

---

## glg doctor

Run diagnostics to verify the installation.

```
glg doctor
```

No flags. Checks all embedded databases and system configuration.
