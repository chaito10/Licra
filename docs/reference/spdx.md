# SPDX Support

GLG has full support for SPDX license identifiers and expressions.

## SPDX License Database

GLG embeds 86 SPDX licenses from the [SPDX License List](https://spdx.org/licenses/).

### Querying the Database

```sh
# Via CLI
glg compare MIT Apache-2.0

# Via API
curl http://localhost:8080/api/search?q=apache

# Via Rust API
let db = SpdxDatabase::load();
let license = db.get_license("MIT");
let results = db.search("general public");
```

### License Properties

Each SPDX license in the database has:

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | SPDX identifier (e.g., `MIT`) |
| `name` | String | Full name |
| `osi_approved` | bool | OSI approved |
| `fsf_free_software` | bool | FSF free software |
| `category` | String | License category |

### Categories

| Category | Example Licenses |
|----------|-----------------|
| Permissive | MIT, BSD-2-Clause, ISC, Apache-2.0 |
| Weak Copyleft | MPL-2.0, LGPL-2.1, EPL-2.0 |
| Strong Copyleft | GPL-2.0, GPL-3.0 |
| Network Copyleft | AGPL-3.0, SSPL-1.0 |
| Public Domain | CC0-1.0, Unlicense |

## SPDX Expressions

GLG includes a recursive-descent parser for SPDX expressions.

### Syntax

| Operator | Meaning | Example |
|----------|---------|---------|
| `AND` | Both licenses apply | `MIT AND Apache-2.0` |
| `OR` | Either license applies | `MIT OR Apache-2.0` |
| `WITH` | License with exception | `GPL-2.0-only WITH Classpath-exception-2.0` |
| `+` | Or later versions | `GPL-2.0-or-later` |

### LicenseRef

For custom or non-SPDX licenses:

```
LicenseRef-custom-license
LicenseRef-my-company-internal
```

### Validation

```sh
# Validate an SPDX expression
glg validate LICENSE.spdx.json
```

The validator checks:

- Syntax validity
- All referenced licenses exist in the SPDX database
- Expression semantics (AND/OR/WITH precedence)

## Generating SPDX Output

```sh
# Export as SPDX document
glg export --input LICENSE.json --format spdx
```

The output is a valid SPDX 3.0 JSON document with:

- Document metadata
- License declarations
- Package information
- Creator information
