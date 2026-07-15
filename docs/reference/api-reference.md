# API Reference

REST API endpoints for the GLG web server.

The API is served when running `glg web`. All endpoints accept and return JSON.

## Base URL

```
http://127.0.0.1:8080
```

## CORS

The API allows all origins, methods, and headers for local development.

---

## Health Check

```
GET /api/health
```

**Response:**

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "service": "glg-web-ui"
}
```

---

## Get Questionnaire

```
GET /api/questionnaire
```

Returns the complete questionnaire with all 314 questions.

**Response:**

```json
{
  "questions": [
    {
      "id": "own-001",
      "category": "Ownership",
      "title": "Entity Type",
      "description": "What type of entity owns this software?",
      "tooltip": "The entity type affects which license clauses apply",
      "help_text": "Select the option that best describes your organization",
      "recommended_answer": { "Choice": "individual" },
      "legal_implications": "Different entity types have different legal obligations",
      "question_type": "Choice",
      "options": [
        { "label": "Individual", "value": "individual", "description": "Single person" },
        { "label": "Company", "value": "company", "description": "Registered business" }
      ],
      "visible_if": null,
      "weight": 10
    }
  ],
  "version": "1.0.0",
  "title": "GLG License Questionnaire",
  "description": "..."
}
```

---

## Compile License

```
POST /api/compile
```

Compiles a license from questionnaire answers.

**Request Body:**

```json
{
  "project_name": "My Project",
  "copyright_holders": [
    {
      "name": "John Doe",
      "email": "john@example.com",
      "organization": "Acme Corp",
      "url": "https://example.com"
    }
  ],
  "year": 2026,
  "answers": [
    {
      "question_id": "license_type",
      "value": { "Choice": "mit" }
    },
    {
      "question_id": "own-001",
      "value": { "Boolean": true }
    }
  ],
  "custom_clauses": [],
  "spdx_override": null,
  "dual_license": null
}
```

**Response (200):**

```json
{
  "license": {
    "metadata": { ... },
    "full_text": "MIT License\n\nCopyright (c) 2026 My Project\n\n...",
    "hash": {
      "blake3": "abc123...",
      "sha256": "def456...",
      "sha3_256": "ghi789..."
    }
  },
  "warnings": [],
  "suggestions": [],
  "applied_clauses": ["MIT-PERMISSION", "MIT-CONDITION", "MIT-WARRANTY"],
  "skipped_clauses": []
}
```

**Error (422):**

```json
{
  "error": "compilation_failed",
  "message": "Missing required answer for question: license_type"
}
```

---

## Validate License

```
POST /api/validate
```

Validates a license for completeness and correctness.

**Request Body:**

```json
{
  "metadata": { ... },
  "full_text": "...",
  "hash": { ... }
}
```

**Response:**

```json
{
  "is_valid": true,
  "errors": [],
  "warnings": [],
  "score": 85
}
```

---

## Export License

```
POST /api/export
```

Exports a license to a specific format.

**Request Body:**

```json
{
  "license": { ... },
  "format": "markdown"
}
```

Supported format values: `plain_text`, `markdown`, `html`, `json`, `yaml`, `toml`, `xml`, `spdx`, `cyclonedx`, `pdf`

**Response:**

```json
{
  "format": "Markdown",
  "content": "# MIT License\n\n...",
  "filename": "LICENSE.md",
  "size_bytes": 1234
}
```

---

## Check Compatibility

```
GET /api/compatibility?license_a=MIT&license_b=GPL-3.0-only
```

**Query Parameters:**

| Parameter | Required | Description |
|-----------|----------|-------------|
| `license_a` | Yes | First license identifier |
| `license_b` | Yes | Second license identifier |

**Response:**

```json
{
  "license_a": "MIT",
  "license_b": "GPL-3.0-only",
  "compatible": false,
  "reason": "MIT is permissive but GPL-3.0-only requires copyleft. Combining MIT code into a GPL project is allowed, but not the reverse.",
  "suggestions": ["Consider using LGPL-3.0 for library code"]
}
```

---

## Search Database

```
GET /api/search?q=apache
```

**Query Parameters:**

| Parameter | Required | Description |
|-----------|----------|-------------|
| `q` | Yes | Search query |

**Response:**

```json
[
  {
    "source": "spdx",
    "id": "Apache-2.0",
    "name": "Apache License 2.0",
    "description": "A permissive license...",
    "relevance": 100
  }
]
```

---

## AI Explanation

```
POST /api/explain
```

Requests an AI explanation of a license.

**Request Body:**

```json
{
  "license_text": "MIT License\n\nCopyright..."
}
```

**Response (200):**

```json
{
  "content": "This is the MIT License, a permissive open source license...",
  "tokens_used": 256,
  "model": "llama3",
  "provider": "ollama"
}
```

**Response (503):** AI not configured or unavailable.

---

## Export All Formats

```
POST /api/export_all
```

Compiles a license and generates all output formats.

**Request Body:** Same as `/api/compile`.

**Response:**

```json
{
  "plain_text": "...",
  "markdown": "...",
  "html": "...",
  "json": "...",
  "yaml": "...",
  "toml": "...",
  "spdx": "...",
  "notice": "...",
  "copying": "...",
  "summary": "...",
  "ai_summary": "..."
}
```
