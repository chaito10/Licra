# Quick Start

Generate your first license in 60 seconds.

## Option 1: Web UI (Recommended)

Start the interactive web server:

```sh
glg web
```

Open [http://127.0.0.1:8080](http://127.0.0.1:8080) in your browser.

1. Walk through the 13-step wizard
2. Answer the questions that apply to your project
3. Click **Generate License**
4. Download in your preferred format

## Option 2: CLI

Generate a license directly from the command line:

```sh
glg new --name "My Project" --license-type mit --output .
```

This creates three files:

| File | Format | Description |
|------|--------|-------------|
| `LICENSE` | Plain text | Standard license file for repositories |
| `LICENSE.md` | Markdown | Formatted with headings and metadata |
| `LICENSE.json` | JSON | Full structured representation with hashes |

### Available License Types

```sh
glg new --name "My App" --license-type mit        # MIT License
glg new --name "My App" --license-type apache2     # Apache 2.0
glg new --name "My App" --license-type gpl3        # GPL 3.0
glg new --name "My App" --license-type bsd2        # BSD 2-Clause
glg new --name "My App" --license-type bsd3        # BSD 3-Clause
glg new --name "My App" --license-type isc         # ISC License
glg new --name "My App" --license-type mpl2        # MPL 2.0
glg new --name "My App" --license-type lgpl3       # LGPL 3.0
glg new --name "My App" --license-type agpl3       # AGPL 3.0
glg new --name "My App" --license-type unlicense   # Unlicense
glg new --name "My App" --license-type cc0         # CC0 1.0
glg new --name "My App" --license-type proprietary # Proprietary
```

## Option 3: Generate from JSON Configuration

Create a `license-request.json` file:

```json
{
  "project_name": "My Project",
  "copyright_holders": [
    {
      "name": "Your Name",
      "email": "you@example.com",
      "organization": "Your Org"
    }
  ],
  "year": 2026,
  "answers": [
    {
      "question_id": "license_type",
      "value": { "Choice": "mit" }
    }
  ],
  "custom_clauses": [],
  "spdx_override": null,
  "dual_license": null
}
```

Then generate:

```sh
glg generate --config license-request.json --output ./out --formats text,md,json
```

## What's Next

- [Web UI Guide](../user-guide/web-ui.md) -- Detailed web UI walkthrough
- [CLI Usage](../user-guide/cli-usage.md) -- Complete CLI documentation
- [Output Formats](../user-guide/output-formats.md) -- All 9 export formats
