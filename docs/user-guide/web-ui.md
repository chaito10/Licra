# Web UI

The GLG web UI provides a guided wizard for creating licenses through the 314-question questionnaire.

## Starting the Server

```sh
glg web                          # default: 127.0.0.1:8080
glg web --address 0.0.0.0:3000  # custom address
```

## Interface Overview

The web UI has three main areas:

1. **Sidebar** -- Navigation steps with progress indicators
2. **Main Content** -- Question form for the current step
3. **Preview Panel** -- Live license preview (toggle via Preview tab)

## The Wizard

The questionnaire is organized into 13 steps:

| Step | Category | Question Count | Description |
|------|----------|----------------|-------------|
| 1 | Ownership | ~8 | Who owns the code, entity type |
| 2 | Copyright | ~8 | Copyright holder, notice format |
| 3 | Commercial Use | ~12 | Commercial use, resale, OEM |
| 4 | Research & Academic | ~14 | Research, academic, education |
| 5 | Patent | ~16 | Patent grants, retaliation |
| 6 | Trademark | ~8 | Trademark usage rights |
| 7 | Source & Distribution | ~32 | Source disclosure, linking, distribution |
| 8 | Modification & Forks | ~22 | Derivative works, contributions, CLAs |
| 9 | AI & Data | ~32 | AI training, inference, datasets |
| 10 | Compliance | ~38 | Jurisdiction, export, healthcare, defense |
| 11 | Special Terms | ~35 | DRM, watermarking, dual licensing |
| 12 | Review | -- | Review all answers |
| 13 | Export | -- | Choose output formats |

Questions adapt based on your previous answers. For example, patent questions only appear if you selected patent grant options.

## Navigation

- **Next** / **Previous** buttons move between steps
- The sidebar shows progress in each category
- **Ctrl+K** opens the search bar to find specific questions
- Answers are saved automatically in browser localStorage

## Question Types

| Type | UI Element | Description |
|------|------------|-------------|
| Boolean | Toggle / Radio | Yes/No questions |
| Choice | Dropdown / Radio group | Single selection from options |
| Multi-Choice | Checkbox group | Multiple selections |
| Text | Text input | Free-form text |
| Number | Number input | Numeric values |
| Date | Date picker | Date values |

## Generating the License

After completing the questionnaire:

1. Click **Generate License** on the final step
2. The server compiles your answers into a license
3. The result appears with:
   - Full license text
   - Metadata (hash, fingerprint, SPDX expression)
   - Validation status
   - Warnings (if any)

## Post-Generation Actions

From the result panel you can:

- **Export** -- download in any format
- **Validate** -- run the validation engine
- **Explain** -- get a plain-language summary
- **Compare** -- check compatibility with other licenses

## Theme Switching

Click the sun/moon icon in the header to toggle between dark and light themes. The theme preference is saved in localStorage.

## API Endpoints

The web UI communicates with these API endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/questionnaire` | GET | Fetch all questions |
| `/api/compile` | POST | Compile a license |
| `/api/validate` | POST | Validate a license |
| `/api/export` | POST | Export to a format |
| `/api/compatibility` | GET | Check license compatibility |
| `/api/search` | GET | Search the database |
| `/api/explain` | POST | AI explanation |
| `/api/export_all` | POST | Export all formats |
