# Output Formats

GLG supports 9 export formats for generated licenses.

## Format Reference

| Format | Extension | MIME Type | Description |
|--------|-----------|-----------|-------------|
| Plain Text | `.txt` | `text/plain` | Human-readable, suitable for `LICENSE` files |
| Markdown | `.md` | `text/markdown` | GitHub-flavored Markdown with metadata |
| HTML | `.html` | `text/html` | Styled HTML with dark mode CSS |
| JSON | `.json` | `application/json` | Full structured representation |
| YAML | `.yaml` | `application/x-yaml` | Human-readable structured format |
| TOML | `.toml` | `application/toml` | Configuration file format |
| XML | `.xml` | `application/xml` | Valid XML with proper escaping |
| SPDX | `.spdx.json` | `application/spdx+json` | SPDX 3.0 document |
| CycloneDX | `.bom.json` | `application/vnd.cyclonedx` | SBOM format |

## Plain Text

Standard license file format for repositories:

```
MIT License

Copyright (c) 2026 My Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

## Markdown

Formatted with headings and a metadata table:

```markdown
# MIT License

## Copyright

Copyright (c) 2026 My Project

## License

Permission is hereby granted, free of charge...

---

### License Metadata

| Property | Value |
|----------|-------|
| License ID | abc123... |
| BLAKE3 | def456... |
| SPDX | MIT |
```

## HTML

Rendered HTML with syntax highlighting and dark mode support. Generated via `pulldown-cmark` from the Markdown output.

## JSON

Full structured representation:

```json
{
  "metadata": {
    "id": { "uuid": "...", "fingerprint": "...", "spdx_id": "MIT" },
    "name": "MIT License",
    "version": "1.0.0",
    "category": "Permissive",
    "authors": [...]
  },
  "full_text": "...",
  "hash": { "blake3": "...", "sha256": "...", "sha3_256": "..." },
  "clauses": [...],
  "conditions": [...],
  "permissions": [...],
  "restrictions": [...]
}
```

## SPDX Document

Valid SPDX 3.0 JSON document:

```json
{
  "spdxVersion": "SPDX-3.0",
  "spdxId": "SPDXRef-DOCUMENT",
  "name": "MIT License",
  "documentNamespace": "...",
  "creationInfo": { ... },
  "licenses": [...],
  "licenseDeclared": { "licenseId": "MIT" }
}
```

## CycloneDX SBOM

Valid CycloneDX 1.5 BOM with license metadata:

```json
{
  "bomFormat": "CycloneDX",
  "specVersion": "1.5",
  "version": 1,
  "components": [{
    "name": "My Project",
    "licenses": [{ "license": { "id": "MIT" } }]
  }]
}
```

## Generating Multiple Formats

```sh
# CLI: export to specific format
glg export --input LICENSE.json --format md
glg export --input LICENSE.json --format spdx

# Generate all formats at once
glg generate --config request.json --formats text,md,html,json,yaml,toml,xml,spdx,cyclonedx --output ./out
```

## Generating Output Files

The `glg new` command creates these files by default:

| File | Format |
|------|--------|
| `LICENSE` | Plain text |
| `LICENSE.md` | Markdown |
| `LICENSE.json` | JSON |
