use serde::{Deserialize, Serialize};
use sha2::Digest;
use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};

use pulldown_cmark::{html, Options, Parser};

// ── Types ────────────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum ExportFormat {
    PlainText,
    Markdown,
    Html,
    Json,
    Yaml,
    Toml,
    Xml,
    Spdx,
    CycloneDX,
    Pdf,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExportOptions {
    pub format: ExportFormat,
    pub output_path: Option<PathBuf>,
    pub include_notice: bool,
    pub include_copying: bool,
    pub include_summary: bool,
    pub include_ai_summary: bool,
    pub include_qr_code: bool,
    pub pretty_print: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExportResult {
    pub format: ExportFormat,
    pub content: String,
    pub filename: String,
    pub size_bytes: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ImportSource {
    pub format: ImportFormat,
    pub path: PathBuf,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum ImportFormat {
    Json,
    Yaml,
    Spdx,
    Toml,
    PlainText,
}

#[derive(Debug, Clone, Serialize, Deserialize, thiserror::Error)]
pub enum ExportError {
    #[error("IO error: {0}")]
    IoError(String),
    #[error("Serialization error: {0}")]
    SerializationError(String),
    #[error("Unsupported format: {0}")]
    UnsupportedFormat(String),
    #[error("PDF generation error: {0}")]
    PdfError(String),
    #[error("Template error: {0}")]
    TemplateError(String),
}

// ── Default ──────────────────────────────────────────────────────────────────

impl Default for ExportOptions {
    fn default() -> Self {
        Self {
            format: ExportFormat::PlainText,
            output_path: None,
            include_notice: true,
            include_copying: true,
            include_summary: false,
            include_ai_summary: false,
            include_qr_code: false,
            pretty_print: true,
        }
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

fn escape_xml(s: &str) -> String {
    s.replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
        .replace('\'', "&apos;")
}

fn xml_indent(depth: usize) -> String {
    "  ".repeat(depth)
}

fn format_filename(license: &super::license::License, ext: &str) -> String {
    let safe_name: String = license
        .metadata
        .name
        .chars()
        .map(|c| {
            if c.is_alphanumeric() || c == '-' || c == '_' {
                c
            } else {
                '_'
            }
        })
        .collect();
    let slug = safe_name
        .chars()
        .collect::<Vec<_>>()
        .chunks(40)
        .map(|chunk| chunk.iter().collect::<String>())
        .next()
        .unwrap_or_default();
    format!("{}.{}", slug, ext)
}

fn render_markdown_to_html(md: &str) -> String {
    let mut options = Options::empty();
    options.insert(Options::ENABLE_STRIKETHROUGH);
    let parser = Parser::new_ext(md, options);
    let mut html_output = String::new();
    html::push_html(&mut html_output, parser);
    html_output
}

fn author_line(license: &super::license::License) -> String {
    license
        .metadata
        .authors
        .iter()
        .map(|a| {
            let mut line = a.name.clone();
            if let Some(ref org) = a.organization {
                line.push_str(&format!(" ({})", org));
            }
            if let Some(ref email) = a.email {
                line.push_str(&format!(" <{}>", email));
            }
            line
        })
        .collect::<Vec<_>>()
        .join(", ")
}

fn spdx_license_id(license: &super::license::License) -> String {
    if let Some(ref spdx_id) = license.metadata.spdx_id {
        spdx_id.clone()
    } else if let Some(ref spdx_id) = license.metadata.id.spdx_identifier {
        spdx_id.clone()
    } else {
        format!("LicenseRef-{}", license.metadata.id.uuid)
    }
}

// ── Core Export ──────────────────────────────────────────────────────────────

pub fn export_license(
    license: &super::license::License,
    options: &ExportOptions,
) -> Result<ExportResult, ExportError> {
    let size_bytes: usize;
    let content = match options.format {
        ExportFormat::PlainText => export_to_text(license),
        ExportFormat::Markdown => export_to_markdown(license),
        ExportFormat::Html => export_to_html(license),
        ExportFormat::Json => export_to_json(license)?,
        ExportFormat::Yaml => export_to_yaml(license)?,
        ExportFormat::Toml => export_to_toml(license)?,
        ExportFormat::Xml => export_to_xml(license),
        ExportFormat::Spdx => export_to_spdx(license),
        ExportFormat::CycloneDX => export_to_cyclonedx(license),
        ExportFormat::Pdf => {
            return Err(ExportError::PdfError(
                "PDF export requires the `printpdf` feature. \
                 Rebuild with `cargo build --features printpdf` or choose another format."
                    .to_string(),
            ));
        }
    };

    let ext = match options.format {
        ExportFormat::PlainText => "txt",
        ExportFormat::Markdown => "md",
        ExportFormat::Html => "html",
        ExportFormat::Json => "json",
        ExportFormat::Yaml => "yaml",
        ExportFormat::Toml => "toml",
        ExportFormat::Xml => "xml",
        ExportFormat::Spdx => "spdx.json",
        ExportFormat::CycloneDX => "cdx.json",
        ExportFormat::Pdf => "pdf",
    };

    let filename = if let Some(ref path) = options.output_path {
        path.file_name()
            .map(|n| n.to_string_lossy().to_string())
            .unwrap_or_else(|| format_filename(license, ext))
    } else {
        format_filename(license, ext)
    };

    size_bytes = content.len();

    Ok(ExportResult {
        format: options.format.clone(),
        content,
        filename,
        size_bytes,
    })
}

pub fn export_all_formats(
    license: &super::license::License,
    output_dir: &Path,
) -> Result<Vec<ExportResult>, ExportError> {
    let formats = [
        ExportFormat::PlainText,
        ExportFormat::Markdown,
        ExportFormat::Html,
        ExportFormat::Json,
        ExportFormat::Yaml,
        ExportFormat::Toml,
        ExportFormat::Xml,
        ExportFormat::Spdx,
        ExportFormat::CycloneDX,
    ];

    let mut results = Vec::new();
    for format in formats {
        let ext = match format {
            ExportFormat::PlainText => "txt",
            ExportFormat::Markdown => "md",
            ExportFormat::Html => "html",
            ExportFormat::Json => "json",
            ExportFormat::Yaml => "yaml",
            ExportFormat::Toml => "toml",
            ExportFormat::Xml => "xml",
            ExportFormat::Spdx => "spdx.json",
            ExportFormat::CycloneDX => "cdx.json",
            ExportFormat::Pdf => "pdf",
        };

        let filename = format_filename(license, ext);
        let output_path = output_dir.join(&filename);

        let options = ExportOptions {
            format: format.clone(),
            output_path: Some(output_path),
            include_notice: true,
            include_copying: true,
            include_summary: true,
            include_ai_summary: true,
            include_qr_code: false,
            pretty_print: true,
        };

        let result = export_license(license, &options)?;
        results.push(result);
    }

    Ok(results)
}

// ── Plain Text ───────────────────────────────────────────────────────────────

pub fn export_to_text(license: &super::license::License) -> String {
    let mut text = String::new();

    text.push_str(&format!("{}\n", "=".repeat(60)));
    text.push_str(&format!("{}\n", license.metadata.name));
    text.push_str(&format!("{}\n", "=".repeat(60)));
    text.push('\n');

    text.push_str(&format!("Version:      {}\n", license.metadata.version));
    text.push_str(&format!("Category:     {:?}\n", license.metadata.category));
    text.push_str(&format!(
        "Created:      {}\n",
        license.metadata.created_at.format("%Y-%m-%d %H:%M:%S UTC")
    ));
    text.push_str(&format!(
        "Modified:     {}\n",
        license.metadata.modified_at.format("%Y-%m-%d %H:%M:%S UTC")
    ));
    text.push_str(&format!("UUID:         {}\n", license.metadata.id.uuid));
    text.push_str(&format!("Fingerprint:  {}\n", license.metadata.id.fingerprint));
    if let Some(ref spdx) = license.metadata.spdx_id {
        text.push_str(&format!("SPDX ID:      {}\n", spdx));
    }
    if !license.metadata.authors.is_empty() {
        text.push_str(&format!("Authors:      {}\n", author_line(license)));
    }
    if !license.metadata.tags.is_empty() {
        text.push_str(&format!("Tags:         {}\n", license.metadata.tags.join(", ")));
    }

    text.push('\n');
    text.push_str(&format!("{}\n", "-".repeat(60)));
    text.push('\n');

    if !license.preamble.is_empty() {
        text.push_str("PREAMBLE\n");
        text.push_str(&format!("{}\n\n", "-".repeat(40)));
        text.push_str(&format!("{}\n\n", license.preamble));
    }

    let mut sorted_clauses = license.clauses.clone();
    sorted_clauses.sort_by(|a, b| a.priority.cmp(&b.priority));

    for clause in &sorted_clauses {
        text.push_str(&format!("{} (Section {})\n", clause.name.to_uppercase(), clause.priority));
        text.push_str(&format!("{}\n", "-".repeat(clause.name.len() + 20)));
        text.push_str(&format!("{}\n\n", clause.content));
    }

    if !license.permissions.is_empty() {
        text.push_str("PERMISSIONS\n");
        text.push_str(&format!("{}\n", "-".repeat(40)));
        for perm in &license.permissions {
            text.push_str(&format!("  * {}\n", perm));
        }
        text.push('\n');
    }

    if !license.conditions.is_empty() {
        text.push_str("CONDITIONS\n");
        text.push_str(&format!("{}\n", "-".repeat(40)));
        for cond in &license.conditions {
            text.push_str(&format!("  * {}\n", cond));
        }
        text.push('\n');
    }

    if !license.restrictions.is_empty() {
        text.push_str("RESTRICTIONS\n");
        text.push_str(&format!("{}\n", "-".repeat(40)));
        for r in &license.restrictions {
            text.push_str(&format!("  * {}\n", r));
        }
        text.push('\n');
    }

    if let Some(ref patent) = license.patent_grant {
        text.push_str("PATENT GRANT\n");
        text.push_str(&format!("{}\n", "-".repeat(40)));
        text.push_str(&format!("{}\n\n", patent));
    }

    if !license.warranty_disclaimer.is_empty() {
        text.push_str("WARRANTY DISCLAIMER\n");
        text.push_str(&format!("{}\n", "-".repeat(40)));
        text.push_str(&format!("{}\n\n", license.warranty_disclaimer));
    }

    text.push_str(&format!("{}\n", "-".repeat(60)));
    text.push_str(&format!("Blake3:    {}\n", license.hash.blake3));
    text.push_str(&format!("SHA-256:   {}\n", license.hash.sha256));
    text.push_str(&format!("SHA3-256:  {}\n", license.hash.sha3_256));
    text.push_str(&format!("{}\n", "-".repeat(60)));

    text
}

// ── Markdown ─────────────────────────────────────────────────────────────────

pub fn export_to_markdown(license: &super::license::License) -> String {
    let mut md = String::new();

    md.push_str(&format!("# {}\n\n", license.metadata.name));
    md.push_str(&format!(
        "**Version:** `{}` &nbsp;&nbsp; **Category:** `{:?}`\n\n",
        license.metadata.version, license.metadata.category
    ));

    if !license.metadata.authors.is_empty() {
        md.push_str("**Authors:** ");
        let names: Vec<String> = license
            .metadata
            .authors
            .iter()
            .map(|a| {
                let email = a
                    .email
                    .as_ref()
                    .map(|e| format!(" <{}>", e))
                    .unwrap_or_default();
                format!("{}{}", a.name, email)
            })
            .collect();
        md.push_str(&names.join(", "));
        md.push_str("\n\n");
    }

    md.push_str(&format!(
        "**Created:** `{}` &nbsp;&nbsp; **Modified:** `{}`\n\n",
        license.metadata.created_at.format("%Y-%m-%d %H:%M:%S UTC"),
        license.metadata.modified_at.format("%Y-%m-%d %H:%M:%S UTC"),
    ));

    md.push_str(&format!("**UUID:** `{}`\n\n", license.metadata.id.uuid));
    md.push_str(&format!(
        "**Fingerprint:** `{}`\n\n",
        license.metadata.id.fingerprint
    ));

    if let Some(ref spdx) = license.metadata.spdx_id {
        md.push_str(&format!("**SPDX ID:** `{}`\n\n", spdx));
    }

    if !license.metadata.tags.is_empty() {
        md.push_str(&format!(
            "**Tags:** {}\n\n",
            license
                .metadata
                .tags
                .iter()
                .map(|t| format!("`{}`", t))
                .collect::<Vec<_>>()
                .join(", ")
        ));
    }

    md.push_str("---\n\n");

    if !license.preamble.is_empty() {
        md.push_str("## Preamble\n\n");
        md.push_str(&format!("{}\n\n", license.preamble));
    }

    let mut sorted_clauses = license.clauses.clone();
    sorted_clauses.sort_by(|a, b| a.priority.cmp(&b.priority));

    if !sorted_clauses.is_empty() {
        md.push_str("## Clauses\n\n");
        for clause in &sorted_clauses {
            md.push_str(&format!(
                "### {} `({:?})`\n\n{}\n\n",
                clause.name, clause.category, clause.content
            ));
        }
    }

    if !license.permissions.is_empty() {
        md.push_str("## Permissions\n\n");
        for perm in &license.permissions {
            md.push_str(&format!("- {}\n", perm));
        }
        md.push('\n');
    }

    if !license.conditions.is_empty() {
        md.push_str("## Conditions\n\n");
        for cond in &license.conditions {
            md.push_str(&format!("- {}\n", cond));
        }
        md.push('\n');
    }

    if !license.restrictions.is_empty() {
        md.push_str("## Restrictions\n\n");
        for r in &license.restrictions {
            md.push_str(&format!("- {}\n", r));
        }
        md.push('\n');
    }

    if let Some(ref patent) = license.patent_grant {
        md.push_str("## Patent Grant\n\n");
        md.push_str(&format!("{}\n\n", patent));
    }

    if !license.warranty_disclaimer.is_empty() {
        md.push_str("## Warranty Disclaimer\n\n");
        md.push_str(&format!("{}\n\n", license.warranty_disclaimer));
    }

    md.push_str("---\n\n");
    md.push_str("### Hashes\n\n");
    md.push_str(&format!("| Algorithm | Hash |\n"));
    md.push_str(&format!("|-----------|------|\n"));
    md.push_str(&format!("| Blake3 | `{}` |\n", license.hash.blake3));
    md.push_str(&format!("| SHA-256 | `{}` |\n", license.hash.sha256));
    md.push_str(&format!("| SHA3-256 | `{}` |\n", license.hash.sha3_256));

    md
}

// ── HTML ─────────────────────────────────────────────────────────────────────

pub fn export_to_html(license: &super::license::License) -> String {
    let md = export_to_markdown(license);
    let body_html = render_markdown_to_html(&md);

    let mut html_doc = String::new();
    html_doc.push_str("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n");
    html_doc.push_str("  <meta charset=\"UTF-8\">\n");
    html_doc.push_str("  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n");
    html_doc.push_str(&format!(
        "  <title>{}</title>\n",
        escape_xml(&license.metadata.name)
    ));
    html_doc.push_str("  <style>\n");
    html_doc.push_str("    :root { --bg: #ffffff; --fg: #1a1a1a; --accent: #2563eb; --border: #e5e7eb; --code-bg: #f3f4f6; }\n");
    html_doc.push_str("    @media (prefers-color-scheme: dark) {\n");
    html_doc.push_str("      :root { --bg: #1a1a2e; --fg: #e0e0e0; --accent: #60a5fa; --border: #374151; --code-bg: #1f2937; }\n");
    html_doc.push_str("    }\n");
    html_doc.push_str("    * { box-sizing: border-box; margin: 0; padding: 0; }\n");
    html_doc.push_str("    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--fg); line-height: 1.7; padding: 2rem; max-width: 900px; margin: 0 auto; }\n");
    html_doc.push_str("    h1 { font-size: 2rem; border-bottom: 3px solid var(--accent); padding-bottom: 0.5rem; margin-bottom: 1.5rem; }\n");
    html_doc.push_str("    h2 { font-size: 1.4rem; margin-top: 2rem; margin-bottom: 0.8rem; color: var(--accent); }\n");
    html_doc.push_str("    h3 { font-size: 1.1rem; margin-top: 1.2rem; margin-bottom: 0.5rem; }\n");
    html_doc.push_str("    p { margin-bottom: 1rem; }\n");
    html_doc.push_str("    ul, ol { margin-left: 1.5rem; margin-bottom: 1rem; }\n");
    html_doc.push_str("    li { margin-bottom: 0.3rem; }\n");
    html_doc.push_str("    code { background: var(--code-bg); padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.9em; }\n");
    html_doc.push_str("    pre { background: var(--code-bg); padding: 1rem; border-radius: 8px; overflow-x: auto; margin-bottom: 1rem; }\n");
    html_doc.push_str("    pre code { background: none; padding: 0; }\n");
    html_doc.push_str("    table { border-collapse: collapse; width: 100%%; margin-bottom: 1rem; }\n");
    html_doc.push_str("    th, td { border: 1px solid var(--border); padding: 0.5rem 1rem; text-align: left; }\n");
    html_doc.push_str("    th { background: var(--code-bg); font-weight: 600; }\n");
    html_doc.push_str("    hr { border: none; border-top: 1px solid var(--border); margin: 2rem 0; }\n");
    html_doc.push_str("    strong { font-weight: 600; }\n");
    html_doc.push_str("    .meta-badge { display: inline-block; background: var(--code-bg); border: 1px solid var(--border); border-radius: 6px; padding: 0.25rem 0.75rem; margin: 0.25rem 0.25rem 0.25rem 0; font-size: 0.85rem; }\n");
    html_doc.push_str("    .hash-section { font-family: monospace; font-size: 0.85rem; }\n");
    html_doc.push_str("  </style>\n");
    html_doc.push_str("</head>\n<body>\n");
    html_doc.push_str(&body_html);
    html_doc.push_str("\n</body>\n</html>");

    html_doc
}

// ── JSON ─────────────────────────────────────────────────────────────────────

pub fn export_to_json(license: &super::license::License) -> Result<String, ExportError> {
    let value = serde_json::to_value(license)
        .map_err(|e| ExportError::SerializationError(format!("JSON serialization failed: {}", e)))?;
    let json = serde_json::to_string_pretty(&value)
        .map_err(|e| ExportError::SerializationError(format!("JSON formatting failed: {}", e)))?;
    Ok(json)
}

// ── YAML ─────────────────────────────────────────────────────────────────────

pub fn export_to_yaml(license: &super::license::License) -> Result<String, ExportError> {
    serde_yaml::to_string(license)
        .map_err(|e| ExportError::SerializationError(format!("YAML serialization failed: {}", e)))
}

// ── TOML ─────────────────────────────────────────────────────────────────────

pub fn export_to_toml(license: &super::license::License) -> Result<String, ExportError> {
    toml::to_string_pretty(license)
        .map_err(|e| ExportError::SerializationError(format!("TOML serialization failed: {}", e)))
}

// ── XML ──────────────────────────────────────────────────────────────────────

pub fn export_to_xml(license: &super::license::License) -> String {
    let mut xml = String::new();
    xml.push_str("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
    xml.push_str("<license>\n");

    let d = 1;
    xml.push_str(&format!("{}<metadata>\n", xml_indent(d)));
    xml.push_str(&format!(
        "{}<name>{}</name>\n",
        xml_indent(d + 1),
        escape_xml(&license.metadata.name)
    ));
    xml.push_str(&format!(
        "{}<version>{}</version>\n",
        xml_indent(d + 1),
        escape_xml(&license.metadata.version)
    ));
    xml.push_str(&format!(
        "{}<description>{}</description>\n",
        xml_indent(d + 1),
        escape_xml(&license.metadata.description)
    ));
    xml.push_str(&format!(
        "{}<category>{:?}</category>\n",
        xml_indent(d + 1),
        license.metadata.category
    ));
    xml.push_str(&format!(
        "{}<created_at>{}</created_at>\n",
        xml_indent(d + 1),
        license
            .metadata
            .created_at
            .to_rfc3339()
    ));
    xml.push_str(&format!(
        "{}<modified_at>{}</modified_at>\n",
        xml_indent(d + 1),
        license
            .metadata
            .modified_at
            .to_rfc3339()
    ));
    xml.push_str(&format!(
        "{}<uuid>{}</uuid>\n",
        xml_indent(d + 1),
        license.metadata.id.uuid
    ));
    xml.push_str(&format!(
        "{}<fingerprint>{}</fingerprint>\n",
        xml_indent(d + 1),
        escape_xml(&license.metadata.id.fingerprint)
    ));
    if let Some(ref spdx) = license.metadata.spdx_id {
        xml.push_str(&format!(
            "{}<spdx_id>{}</spdx_id>\n",
            xml_indent(d + 1),
            escape_xml(spdx)
        ));
    }
    if let Some(ref custom) = license.metadata.custom_id {
        xml.push_str(&format!(
            "{}<custom_id>{}</custom_id>\n",
            xml_indent(d + 1),
            escape_xml(custom)
        ));
    }

    xml.push_str(&format!("{}<authors>\n", xml_indent(d + 1)));
    for author in &license.metadata.authors {
        xml.push_str(&format!("{}<author>\n", xml_indent(d + 2)));
        xml.push_str(&format!(
            "{}<name>{}</name>\n",
            xml_indent(d + 3),
            escape_xml(&author.name)
        ));
        if let Some(ref email) = author.email {
            xml.push_str(&format!(
                "{}<email>{}</email>\n",
                xml_indent(d + 3),
                escape_xml(email)
            ));
        }
        if let Some(ref org) = author.organization {
            xml.push_str(&format!(
                "{}<organization>{}</organization>\n",
                xml_indent(d + 3),
                escape_xml(org)
            ));
        }
        if let Some(ref url) = author.url {
            xml.push_str(&format!(
                "{}<url>{}</url>\n",
                xml_indent(d + 3),
                escape_xml(url)
            ));
        }
        xml.push_str(&format!("{}</author>\n", xml_indent(d + 2)));
    }
    xml.push_str(&format!("{}</authors>\n", xml_indent(d + 1)));

    if !license.metadata.tags.is_empty() {
        xml.push_str(&format!("{}<tags>\n", xml_indent(d + 1)));
        for tag in &license.metadata.tags {
            xml.push_str(&format!(
                "{}<tag>{}</tag>\n",
                xml_indent(d + 2),
                escape_xml(tag)
            ));
        }
        xml.push_str(&format!("{}</tags>\n", xml_indent(d + 1)));
    }

    xml.push_str(&format!("{}</metadata>\n", xml_indent(d)));

    if !license.preamble.is_empty() {
        xml.push_str(&format!(
            "{}<preamble>{}</preamble>\n",
            xml_indent(d),
            escape_xml(&license.preamble)
        ));
    }

    let mut sorted_clauses = license.clauses.clone();
    sorted_clauses.sort_by(|a, b| a.priority.cmp(&b.priority));

    if !sorted_clauses.is_empty() {
        xml.push_str(&format!("{}<clauses>\n", xml_indent(d)));
        for clause in &sorted_clauses {
            xml.push_str(&format!("{}<clause>\n", xml_indent(d + 1)));
            xml.push_str(&format!(
                "{}<name>{}</name>\n",
                xml_indent(d + 2),
                escape_xml(&clause.name)
            ));
            xml.push_str(&format!(
                "{}<uuid>{}</uuid>\n",
                xml_indent(d + 2),
                clause.clause_uuid
            ));
            xml.push_str(&format!(
                "{}<category>{:?}</category>\n",
                xml_indent(d + 2),
                clause.category
            ));
            xml.push_str(&format!(
                "{}<priority>{}</priority>\n",
                xml_indent(d + 2),
                clause.priority
            ));
            xml.push_str(&format!(
                "{}<content>{}</content>\n",
                xml_indent(d + 2),
                escape_xml(&clause.content)
            ));
            xml.push_str(&format!("{}</clause>\n", xml_indent(d + 1)));
        }
        xml.push_str(&format!("{}</clauses>\n", xml_indent(d)));
    }

    if !license.permissions.is_empty() {
        xml.push_str(&format!("{}<permissions>\n", xml_indent(d)));
        for perm in &license.permissions {
            xml.push_str(&format!(
                "{}<permission>{}</permission>\n",
                xml_indent(d + 1),
                escape_xml(perm)
            ));
        }
        xml.push_str(&format!("{}</permissions>\n", xml_indent(d)));
    }

    if !license.conditions.is_empty() {
        xml.push_str(&format!("{}<conditions>\n", xml_indent(d)));
        for cond in &license.conditions {
            xml.push_str(&format!(
                "{}<condition>{}</condition>\n",
                xml_indent(d + 1),
                escape_xml(cond)
            ));
        }
        xml.push_str(&format!("{}</conditions>\n", xml_indent(d)));
    }

    if !license.restrictions.is_empty() {
        xml.push_str(&format!("{}<restrictions>\n", xml_indent(d)));
        for r in &license.restrictions {
            xml.push_str(&format!(
                "{}<restriction>{}</restriction>\n",
                xml_indent(d + 1),
                escape_xml(r)
            ));
        }
        xml.push_str(&format!("{}</restrictions>\n", xml_indent(d)));
    }

    if let Some(ref patent) = license.patent_grant {
        xml.push_str(&format!(
            "{}<patent_grant>{}</patent_grant>\n",
            xml_indent(d),
            escape_xml(patent)
        ));
    }

    if !license.warranty_disclaimer.is_empty() {
        xml.push_str(&format!(
            "{}<warranty_disclaimer>{}</warranty_disclaimer>\n",
            xml_indent(d),
            escape_xml(&license.warranty_disclaimer)
        ));
    }

    xml.push_str(&format!("{}<hashes>\n", xml_indent(d)));
    xml.push_str(&format!(
        "{}<blake3>{}</blake3>\n",
        xml_indent(d + 1),
        escape_xml(&license.hash.blake3)
    ));
    xml.push_str(&format!(
        "{}<sha256>{}</sha256>\n",
        xml_indent(d + 1),
        escape_xml(&license.hash.sha256)
    ));
    xml.push_str(&format!(
        "{}<sha3_256>{}</sha3_256>\n",
        xml_indent(d + 1),
        escape_xml(&license.hash.sha3_256)
    ));
    xml.push_str(&format!("{}</hashes>\n", xml_indent(d)));

    xml.push_str("</license>\n");
    xml
}

// ── SPDX (JSON) ─────────────────────────────────────────────────────────────

pub fn export_to_spdx(license: &super::license::License) -> String {
    let spdx_id = spdx_license_id(license);
    let author_text = author_line(license);

    let mut ext_refs = Vec::new();
    ext_refs.push(format!(
        r#"    {{"referenceType": "SPDXReference-DOCUMENT", "referenceCategory": "SECURITY", "referenceLocator": "https://spdx.org/licenses/{}"}}"#,
        escape_xml(&spdx_id)
    ));

    let mut spdx = String::new();
    spdx.push_str("{\n");
    spdx.push_str("  \"spdxVersion\": \"SPDX-3.0\",\n");
    spdx.push_str("  \"dataLicense\": \"CC0-1.0\",\n");
    spdx.push_str(&format!(
        "  \"SPDXID\": \"SPDXRef-DOCUMENT\",\n"
    ));
    spdx.push_str(&format!(
        "  \"name\": \"{}\",\n",
        escape_xml(&license.metadata.name)
    ));
    spdx.push_str(&format!(
        "  \"documentNamespace\": \"https://glg-project.org/licenses/{}\",\n",
        license.metadata.id.uuid
    ));
    spdx.push_str(&format!(
        "  \"creationInfo\": {{\n    \"created\": \"{}\",\n    \"creators\": [\"Tool: glg-{}\"]\n  }},\n",
        license
            .metadata
            .created_at
            .format("%Y-%m-%dT%H:%M:%SZ"),
        license.metadata.version
    ));
    spdx.push_str(&format!(
        "  \"externalDocumentRefs\": [\n    {}\n  ],\n",
        ext_refs.join(",\n    ")
    ));
    spdx.push_str("  \"packages\": [\n");
    spdx.push_str("    {\n");
    spdx.push_str(&format!(
        "      \"name\": \"{}\",\n",
        escape_xml(&license.metadata.name)
    ));
    spdx.push_str(&format!(
        "      \"SPDXID\": \"SPDXRef-Package\",\n"
    ));
    spdx.push_str(&format!(
        "      \"downloadLocation\": \"NOASSERTION\",\n"
    ));
    spdx.push_str(&format!(
        "      \"copyrightText\": \"{}\",\n",
        escape_xml(&author_text)
    ));
    spdx.push_str(&format!(
        "      \"licenseConcluded\": \"{}\",\n",
        escape_xml(&spdx_id)
    ));
    spdx.push_str(&format!(
        "      \"licenseDeclared\": \"{}\",\n",
        escape_xml(&spdx_id)
    ));
    spdx.push_str(&format!(
        "      \"description\": \"{}\",\n",
        escape_xml(&license.metadata.description)
    ));
    spdx.push_str(&format!(
        "      \"externalRefs\": []\n"
    ));
    spdx.push_str("    }\n");
    spdx.push_str("  ],\n");

    spdx.push_str("  \"relationships\": [\n");
    spdx.push_str("    {\n");
    spdx.push_str("      \"spdxElementId\": \"SPDXRef-DOCUMENT\",\n");
    spdx.push_str("      \"relationshipType\": \"DESCRIBES\",\n");
    spdx.push_str("      \"relatedSpdxElement\": \"SPDXRef-Package\"\n");
    spdx.push_str("    }\n");
    spdx.push_str("  ],\n");

    spdx.push_str("  \"annotations\": [\n");
    spdx.push_str("    {\n");
    spdx.push_str("      \"annotationDate\": \"");
    spdx.push_str(&license.metadata.modified_at.format("%Y-%m-%dT%H:%M:%SZ").to_string());
    spdx.push_str("\",\n");
    spdx.push_str("      \"annotationType\": \"OTHER\",\n");
    spdx.push_str("      \"spdxElementId\": \"SPDXRef-DOCUMENT\",\n");
    spdx.push_str(&format!(
        "      \"comment\": \"BLAKE3: {} | SHA-256: {} | SHA3-256: {}\"\n",
        license.hash.blake3, license.hash.sha256, license.hash.sha3_256
    ));
    spdx.push_str("    }\n");
    spdx.push_str("  ],\n");

    spdx.push_str("  \"snippets\": [\n");
    spdx.push_str("    {\n");
    spdx.push_str("      \"name\": \"License-Summary\",\n");
    spdx.push_str("      \"SPDXID\": \"SPDXRef-Snippet-Summary\",\n");
    spdx.push_str("      \"copyrightText\": \"");
    spdx.push_str(&escape_xml(&author_text));
    spdx.push_str("\",\n");
    spdx.push_str("      \"licenseConcluded\": \"NOASSERTION\",\n");
    spdx.push_str(&format!(
        "      \"comment\": \"Category: {:?} | Clauses: {} | Permissions: {} | Conditions: {} | Restrictions: {}\"\n",
        license.metadata.category,
        license.clauses.len(),
        license.permissions.len(),
        license.conditions.len(),
        license.restrictions.len()
    ));
    spdx.push_str("    }\n");
    spdx.push_str("  ]\n");

    spdx.push_str("}\n");
    spdx
}

// ── CycloneDX SBOM (JSON) ───────────────────────────────────────────────────

pub fn export_to_cyclonedx(license: &super::license::License) -> String {
    generate_cyclonedx_sbom(license)
}

pub fn generate_cyclonedx_sbom(license: &super::license::License) -> String {
    let spdx_id = spdx_license_id(license);
    let author_text = author_line(license);

    let mut cdx = String::new();
    cdx.push_str("{\n");
    cdx.push_str("  \"bomFormat\": \"CycloneDX\",\n");
    cdx.push_str("  \"specVersion\": \"1.5\",\n");
    cdx.push_str("  \"version\": 1,\n");
    cdx.push_str("  \"metadata\": {\n");
    cdx.push_str("    \"tools\": [\n");
    cdx.push_str("      {\n");
    cdx.push_str("        \"vendor\": \"glg-project\",\n");
    cdx.push_str("        \"name\": \"glg\",\n");
    cdx.push_str(&format!(
        "        \"version\": \"{}\"\n",
        escape_xml(&license.metadata.version)
    ));
    cdx.push_str("      }\n");
    cdx.push_str("    ],\n");
    cdx.push_str("    \"licenses\": [\n");
    cdx.push_str("      {\n");
    cdx.push_str("        \"license\": {\n");
    cdx.push_str(&format!(
        "          \"id\": \"{}\",\n",
        escape_xml(&spdx_id)
    ));
    cdx.push_str(&format!(
        "          \"name\": \"{}\"\n",
        escape_xml(&license.metadata.name)
    ));
    cdx.push_str("        }\n");
    cdx.push_str("      }\n");
    cdx.push_str("    ],\n");
    cdx.push_str(&format!(
        "    \"supplier\": {{\n      \"name\": \"{}\"\n    }},\n",
        escape_xml(&author_text)
    ));
    cdx.push_str(&format!(
        "    \"timestamp\": \"{}\"\n",
        license
            .metadata
            .created_at
            .format("%Y-%m-%dT%H:%M:%SZ")
    ));
    cdx.push_str("  },\n");

    cdx.push_str("  \"components\": [\n");
    cdx.push_str("    {\n");
    cdx.push_str("      \"type\": \"library\",\n");
    cdx.push_str(&format!(
        "      \"name\": \"{}\",\n",
        escape_xml(&license.metadata.name)
    ));
    cdx.push_str(&format!(
        "      \"version\": \"{}\",\n",
        escape_xml(&license.metadata.version)
    ));
    cdx.push_str("      \"licenses\": [\n");
    cdx.push_str("        {\n");
    cdx.push_str("          \"license\": {\n");
    cdx.push_str(&format!(
        "            \"id\": \"{}\",\n",
        escape_xml(&spdx_id)
    ));
    cdx.push_str(&format!(
        "            \"name\": \"{}\"\n",
        escape_xml(&license.metadata.name)
    ));
    cdx.push_str("          }\n");
    cdx.push_str("        }\n");
    cdx.push_str("      ],\n");
    cdx.push_str("      \"properties\": [\n");

    cdx.push_str(&format!(
        "        {{ \"name\": \"glg.category\", \"value\": \"{:?}\" }},\n",
        license.metadata.category
    ));
    cdx.push_str(&format!(
        "        {{ \"name\": \"glg.clauses.count\", \"value\": \"{}\" }},\n",
        license.clauses.len()
    ));
    cdx.push_str(&format!(
        "        {{ \"name\": \"glg.permissions.count\", \"value\": \"{}\" }},\n",
        license.permissions.len()
    ));
    cdx.push_str(&format!(
        "        {{ \"name\": \"glg.conditions.count\", \"value\": \"{}\" }},\n",
        license.conditions.len()
    ));
    cdx.push_str(&format!(
        "        {{ \"name\": \"glg.restrictions.count\", \"value\": \"{}\" }},\n",
        license.restrictions.len()
    ));
    cdx.push_str(&format!(
        "        {{ \"name\": \"glg.hash.blake3\", \"value\": \"{}\" }},\n",
        escape_xml(&license.hash.blake3)
    ));
    cdx.push_str(&format!(
        "        {{ \"name\": \"glg.hash.sha256\", \"value\": \"{}\" }},\n",
        escape_xml(&license.hash.sha256)
    ));
    cdx.push_str(&format!(
        "        {{ \"name\": \"glg.hash.sha3_256\", \"value\": \"{}\" }}\n",
        escape_xml(&license.hash.sha3_256)
    ));

    cdx.push_str("      ]\n");
    cdx.push_str("    }\n");
    cdx.push_str("  ],\n");

    cdx.push_str("  \"externalReferences\": [\n");
    cdx.push_str(&format!(
        "    {{\n      \"type\": \"license\",\n      \"url\": \"https://spdx.org/licenses/{}\"\n    }}\n",
        escape_xml(&spdx_id)
    ));
    cdx.push_str("  ],\n");

    cdx.push_str("  \"dependencies\": []\n");
    cdx.push_str("}\n");

    cdx
}

// ── Notice ───────────────────────────────────────────────────────────────────

pub fn export_notice(license: &super::license::License) -> String {
    let mut notice = String::new();
    let year = license
        .metadata
        .created_at
        .format("%Y")
        .to_string();
    let modified_year = license
        .metadata
        .modified_at
        .format("%Y")
        .to_string();

    notice.push_str(&format!(
        "{} {}  -  License Notice\n",
        license.metadata.name, license.metadata.version
    ));
    notice.push_str(&format!("{}\n", "=".repeat(50)));
    notice.push('\n');

    notice.push_str("Copyright (c) ");
    if year == modified_year {
        notice.push_str(&year);
    } else {
        notice.push_str(&format!("{}-{}", year, modified_year));
    }
    notice.push_str("  ");
    notice.push_str(&author_line(license));
    notice.push('\n');
    notice.push('\n');

    notice.push_str("This software and associated documentation files (the \"Software\") are\n");
    notice.push_str("provided under the terms of the following license:\n\n");

    if let Some(ref spdx) = license.metadata.spdx_id {
        notice.push_str(&format!("SPDX License Identifier: {}\n\n", spdx));
    }

    if !license.permissions.is_empty() {
        notice.push_str("PERMISSIONS:\n");
        for perm in &license.permissions {
            notice.push_str(&format!("  - {}\n", perm));
        }
        notice.push('\n');
    }

    if !license.conditions.is_empty() {
        notice.push_str("CONDITIONS:\n");
        for cond in &license.conditions {
            notice.push_str(&format!("  - {}\n", cond));
        }
        notice.push('\n');
    }

    if !license.restrictions.is_empty() {
        notice.push_str("RESTRICTIONS:\n");
        for r in &license.restrictions {
            notice.push_str(&format!("  - {}\n", r));
        }
        notice.push('\n');
    }

    if !license.warranty_disclaimer.is_empty() {
        notice.push_str(&license.warranty_disclaimer);
        notice.push('\n');
    }

    notice
}

// ── Copying ──────────────────────────────────────────────────────────────────

pub fn export_copying(license: &super::license::License) -> String {
    let mut copying = String::new();
    let sep = "=".repeat(60);
    let thin_sep = "-".repeat(60);

    copying.push_str(&sep);
    copying.push('\n');
    copying.push_str(&format!(
        "  {}\n",
        license.metadata.name
    ));
    copying.push_str(&format!(
        "  Version {}\n",
        license.metadata.version
    ));
    copying.push_str(&sep);
    copying.push('\n');
    copying.push('\n');

    copying.push_str(&format!("Category: {:?}\n", license.metadata.category));
    if let Some(ref spdx) = license.metadata.spdx_id {
        copying.push_str(&format!("SPDX ID: {}\n", spdx));
    }
    copying.push('\n');

    copying.push_str("Copyright holders:\n");
    for author in &license.metadata.authors {
        let mut entry = format!("  {}", author.name);
        if let Some(ref org) = author.organization {
            entry.push_str(&format!(" ({})", org));
        }
        if let Some(ref email) = author.email {
            entry.push_str(&format!(" <{}>", email));
        }
        if let Some(ref url) = author.url {
            entry.push_str(&format!(" [{}]", url));
        }
        copying.push_str(&format!("{}\n", entry));
    }
    copying.push('\n');

    copying.push_str("This license governs the use, copying, distribution, and modification\n");
    copying.push_str("of the software.\n\n");

    if !license.preamble.is_empty() {
        copying.push_str("PREAMBLE\n");
        copying.push_str(&format!("{}\n", thin_sep));
        copying.push_str(&format!("{}\n\n", license.preamble));
    }

    let mut sorted_clauses = license.clauses.clone();
    sorted_clauses.sort_by(|a, b| a.priority.cmp(&b.priority));

    for clause in &sorted_clauses {
        let title = format!(
            "{} (Section {})",
            clause.name.to_uppercase(),
            clause.priority
        );
        copying.push_str(&format!("{}\n", title));
        copying.push_str(&format!(
            "{}\n",
            "-".repeat(title.len())
        ));
        copying.push_str(&format!("{}\n\n", clause.content));
    }

    if !license.permissions.is_empty() {
        copying.push_str("PERMISSIONS\n");
        copying.push_str(&thin_sep);
        copying.push('\n');
        for perm in &license.permissions {
            copying.push_str(&format!("  {}\n", perm));
        }
        copying.push('\n');
    }

    if !license.conditions.is_empty() {
        copying.push_str("CONDITIONS\n");
        copying.push_str(&thin_sep);
        copying.push('\n');
        for cond in &license.conditions {
            copying.push_str(&format!("  {}\n", cond));
        }
        copying.push('\n');
    }

    if !license.restrictions.is_empty() {
        copying.push_str("RESTRICTIONS\n");
        copying.push_str(&thin_sep);
        copying.push('\n');
        for r in &license.restrictions {
            copying.push_str(&format!("  {}\n", r));
        }
        copying.push('\n');
    }

    if let Some(ref patent) = license.patent_grant {
        copying.push_str("PATENT GRANT\n");
        copying.push_str(&thin_sep);
        copying.push('\n');
        copying.push_str(&format!("{}\n\n", patent));
    }

    if !license.warranty_disclaimer.is_empty() {
        copying.push_str("WARRANTY DISCLAIMER\n");
        copying.push_str(&thin_sep);
        copying.push('\n');
        copying.push_str(&format!("{}\n\n", license.warranty_disclaimer));
    }

    copying.push_str(&thin_sep);
    copying.push('\n');
    copying.push_str(&format!(
        "Blake3:    {}\n",
        license.hash.blake3
    ));
    copying.push_str(&format!(
        "SHA-256:   {}\n",
        license.hash.sha256
    ));
    copying.push_str(&format!(
        "SHA3-256:  {}\n",
        license.hash.sha3_256
    ));
    copying.push_str(&thin_sep);
    copying.push('\n');
    copying.push_str("END OF LICENSE\n");

    copying
}

// ── Summary ──────────────────────────────────────────────────────────────────

pub fn export_summary(license: &super::license::License) -> String {
    let mut summary = String::new();

    summary.push_str(&format!(
        "License:      {} v{}\n",
        license.metadata.name, license.metadata.version
    ));
    summary.push_str(&format!(
        "Category:     {:?}\n",
        license.metadata.category
    ));
    if let Some(ref spdx) = license.metadata.spdx_id {
        summary.push_str(&format!("SPDX ID:      {}\n", spdx));
    }
    summary.push_str(&format!(
        "Authors:      {}\n",
        author_line(license)
    ));
    summary.push_str(&format!(
        "Created:      {}\n",
        license
            .metadata
            .created_at
            .format("%Y-%m-%d %H:%M:%S UTC")
    ));
    summary.push_str(&format!(
        "Modified:     {}\n",
        license
            .metadata
            .modified_at
            .format("%Y-%m-%d %H:%M:%S UTC")
    ));
    summary.push_str(&format!("UUID:         {}\n", license.metadata.id.uuid));
    summary.push_str(&format!(
        "Fingerprint:  {}\n",
        license.metadata.id.fingerprint
    ));
    summary.push('\n');

    summary.push_str(&format!("Clauses:      {}\n", license.clauses.len()));
    summary.push_str(&format!(
        "Permissions:  {}\n",
        license.permissions.len()
    ));
    summary.push_str(&format!(
        "Conditions:   {}\n",
        license.conditions.len()
    ));
    summary.push_str(&format!(
        "Restrictions: {}\n",
        license.restrictions.len()
    ));
    summary.push_str(&format!(
        "Patent grant: {}\n",
        if license.patent_grant.is_some() {
            "Yes"
        } else {
            "No"
        }
    ));
    summary.push_str(&format!(
        "Warranty:     {}\n",
        if license.warranty_disclaimer.is_empty() {
            "None"
        } else {
            "Disclaimer included"
        }
    ));
    summary.push('\n');

    let mut cat_counts: HashMap<String, u32> = HashMap::new();
    for clause in &license.clauses {
        let key = format!("{:?}", clause.category);
        *cat_counts.entry(key).or_insert(0) += 1;
    }
    summary.push_str("Clause breakdown:\n");
    for (cat, count) in &cat_counts {
        summary.push_str(&format!("  {:<20} {}\n", cat, count));
    }
    summary.push('\n');

    summary.push_str("Hashes:\n");
    summary.push_str(&format!("  Blake3:    {}\n", license.hash.blake3));
    summary.push_str(&format!("  SHA-256:   {}\n", license.hash.sha256));
    summary.push_str(&format!("  SHA3-256:  {}\n", license.hash.sha3_256));
    summary.push('\n');

    summary.push_str(&format!(
        "Full text length:  {} chars\n",
        license.full_text.len()
    ));

    summary
}

// ── AI Summary ───────────────────────────────────────────────────────────────

pub fn export_ai_summary(license: &super::license::License) -> String {
    let mut ai = String::new();

    ai.push_str(&format!(
        "# AI Summary: {} v{}\n\n",
        license.metadata.name, license.metadata.version
    ));

    ai.push_str(&format!(
        "**Category:** {:?}\n\n",
        license.metadata.category
    ));

    if !license.metadata.description.is_empty() {
        ai.push_str(&format!(
            "**Description:** {}\n\n",
            license.metadata.description
        ));
    }

    ai.push_str(&format!(
        "**SPDX License Identifier:** `{}`\n\n",
        spdx_license_id(license)
    ));

    if !license.permissions.is_empty() {
        ai.push_str("**This license permits:**\n");
        for perm in &license.permissions {
            ai.push_str(&format!("- {}\n", perm));
        }
        ai.push('\n');
    }

    if !license.conditions.is_empty() {
        ai.push_str("**This license requires:**\n");
        for cond in &license.conditions {
            ai.push_str(&format!("- {}\n", cond));
        }
        ai.push('\n');
    }

    if !license.restrictions.is_empty() {
        ai.push_str("**This license restricts:**\n");
        for r in &license.restrictions {
            ai.push_str(&format!("- {}\n", r));
        }
        ai.push('\n');
    }

    if let Some(ref patent) = license.patent_grant {
        ai.push_str(&format!("**Patent grant:** {}\n\n", patent));
    }

    if !license.warranty_disclaimer.is_empty() {
        ai.push_str(&format!(
            "**Warranty disclaimer:** {}\n\n",
            license.warranty_disclaimer
        ));
    }

    let mut cat_counts: HashMap<String, u32> = HashMap::new();
    for clause in &license.clauses {
        let key = format!("{:?}", clause.category);
        *cat_counts.entry(key).or_insert(0) += 1;
    }
    ai.push_str("**Clause breakdown:**\n");
    for (cat, count) in &cat_counts {
        ai.push_str(&format!("- {}: {}\n", cat, count));
    }
    ai.push('\n');

    ai.push_str(&format!(
        "**Total clauses:** {}\n\n",
        license.clauses.len()
    ));

    if license.patent_grant.is_some() {
        ai.push_str("**Contains explicit patent grant:** Yes\n\n");
    } else {
        ai.push_str("**Contains explicit patent grant:** No\n\n");
    }

    let has_copyleft = license
        .conditions
        .iter()
        .any(|c| c.to_lowercase().contains("copyleft") || c.to_lowercase().contains("same license"));
    let has_commercial = license
        .restrictions
        .iter()
        .any(|r| {
            r.to_lowercase().contains("commercial")
                || r.to_lowercase().contains("non-commercial")
        });
    let has_ai_restriction = license
        .restrictions
        .iter()
        .any(|r| {
            r.to_lowercase().contains("machine learning")
                || r.to_lowercase().contains("artificial intelligence")
                || r.to_lowercase().contains("ai training")
        });

    ai.push_str("**License characteristics:**\n");
    ai.push_str(&format!(
        "- Copyleft: {}\n",
        if has_copyleft { "Yes" } else { "No" }
    ));
    ai.push_str(&format!(
        "- Commercial use restricted: {}\n",
        if has_commercial { "Yes" } else { "No" }
    ));
    ai.push_str(&format!(
        "- AI training restricted: {}\n",
        if has_ai_restriction { "Yes" } else { "No" }
    ));
    ai.push_str(&format!(
        "- Public domain: {}\n",
        if matches!(
            license.metadata.category,
            super::license::LicenseCategory::PublicDomain
        ) {
            "Yes"
        } else {
            "No"
        }
    ));

    ai.push('\n');
    ai.push_str(&format!(
        "**License hash (Blake3):** `{}`\n",
        license.hash.blake3
    ));

    ai
}

// ── File I/O ─────────────────────────────────────────────────────────────────

pub fn write_file(path: &Path, content: &str) -> Result<(), ExportError> {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| {
            ExportError::IoError(format!(
                "Failed to create directory {}: {}",
                parent.display(),
                e
            ))
        })?;
    }
    fs::write(path, content).map_err(|e| {
        ExportError::IoError(format!("Failed to write {}: {}", path.display(), e))
    })?;
    Ok(())
}

// ── Import ───────────────────────────────────────────────────────────────────

pub fn import_license(path: &Path) -> Result<super::license::License, ExportError> {
    let content = fs::read_to_string(path).map_err(|e| {
        ExportError::IoError(format!(
            "Failed to read {}: {}",
            path.display(),
            e
        ))
    })?;

    let ext = path
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("");

    match ext.to_lowercase().as_str() {
        "json" => {
            if content.contains("\"spdxVersion\"") {
                import_from_spdx(&content)
            } else if content.contains("\"bomFormat\"") && content.contains("CycloneDX") {
                Err(ExportError::UnsupportedFormat(
                    "CycloneDX import is not supported; use JSON license import instead".to_string(),
                ))
            } else {
                import_from_json(&content)
            }
        }
        "yaml" | "yml" => import_from_yaml(&content),
        "toml" => import_from_toml(&content),
        "spdx" => import_from_spdx(&content),
        "txt" | "md" => import_from_plaintext(&content),
        _ => Err(ExportError::UnsupportedFormat(format!(
            "Unknown file extension '{}'. Supported: json, yaml, toml, spdx, txt, md",
            ext
        ))),
    }
}

pub fn import_from_json(content: &str) -> Result<super::license::License, ExportError> {
    serde_json::from_str(content).map_err(|e| {
        ExportError::SerializationError(format!("Failed to parse JSON license: {}", e))
    })
}

pub fn import_from_yaml(content: &str) -> Result<super::license::License, ExportError> {
    serde_yaml::from_str(content).map_err(|e| {
        ExportError::SerializationError(format!("Failed to parse YAML license: {}", e))
    })
}

pub fn import_from_spdx(content: &str) -> Result<super::license::License, ExportError> {
    let value: serde_json::Value = serde_json::from_str(content).map_err(|e| {
        ExportError::SerializationError(format!("Failed to parse SPDX JSON: {}", e))
    })?;

    let doc_name = value
        .get("name")
        .and_then(|v| v.as_str())
        .unwrap_or("Untitled License")
        .to_string();

    let doc_namespace = value
        .get("documentNamespace")
        .and_then(|v| v.as_str())
        .unwrap_or("")
        .to_string();

    let creation_info = value.get("creationInfo").and_then(|v| v.as_object());
    let created_at_str = creation_info
        .and_then(|ci| ci.get("created"))
        .and_then(|v| v.as_str())
        .and_then(|s| chrono::DateTime::parse_from_rfc3339(s).ok())
        .map(|dt| dt.with_timezone(&chrono::Utc))
        .unwrap_or_else(|| chrono::Utc::now());

    let packages = value.get("packages").and_then(|v| v.as_array());
    let first_package = packages.and_then(|p| p.first());

    let description = first_package
        .and_then(|p| p.get("description"))
        .and_then(|v| v.as_str())
        .unwrap_or("")
        .to_string();

    let copyright_text = first_package
        .and_then(|p| p.get("copyrightText"))
        .and_then(|v| v.as_str())
        .unwrap_or("")
        .to_string();

    let spdx_id = first_package
        .and_then(|p| p.get("licenseConcluded"))
        .and_then(|v| v.as_str())
        .map(|s| s.to_string())
        .or_else(|| {
            value
                .get("name")
                .and_then(|v| v.as_str())
                .map(|s| format!("LicenseRef-{}", s))
        });

    let mut authors = Vec::new();
    if !copyright_text.is_empty() && copyright_text != "NOASSERTION" {
        let parts: Vec<&str> = copyright_text.split(", ").collect();
        for part in parts {
            let trimmed = part.trim();
            if !trimmed.is_empty() && trimmed != "NOASSERTION" {
                authors.push(super::license::Author {
                    name: trimmed.to_string(),
                    email: None,
                    organization: None,
                    url: None,
                });
            }
        }
    }
    if authors.is_empty() {
        authors.push(super::license::Author {
            name: "Unknown Author".to_string(),
            email: None,
            organization: None,
            url: None,
        });
    }

    let category = match spdx_id.as_deref() {
        Some(id) if id.starts_with("MIT") || id.starts_with("Apache-2.0") => {
            super::license::LicenseCategory::Permissive
        }
        Some(id) if id.contains("GPL") || id.contains("LGPL") => {
            super::license::LicenseCategory::StrongCopyleft
        }
        Some(id) if id.contains("MPL") => super::license::LicenseCategory::WeakCopyleft,
        Some(id) if id.contains("AGPL") || id.contains("SSPL") => {
            super::license::LicenseCategory::NetworkCopyleft
        }
        Some(id) if id.starts_with("CC0") || id.starts_with("Unlicense") => {
            super::license::LicenseCategory::PublicDomain
        }
        _ => super::license::LicenseCategory::Custom,
    };

    let mut tags = Vec::new();
    if let Some(array) = value.get("externalDocumentRefs").and_then(|v| v.as_array()) {
        for item in array {
            if let Some(loc) = item.get("referenceLocator").and_then(|v| v.as_str()) {
                tags.push(loc.to_string());
            }
        }
    }

    let uuid = if let Some(ns) = doc_namespace.rsplit('/').next() {
        uuid::Uuid::parse_str(ns).unwrap_or_else(|_| uuid::Uuid::new_v4())
    } else {
        uuid::Uuid::new_v4()
    };

    let fingerprint = format!(
        "{:x}",
        sha2::Sha256::digest(doc_namespace.as_bytes())
    );

    let metadata = super::license::LicenseMetadata {
        id: super::license::LicenseId {
            uuid,
            fingerprint,
            spdx_identifier: spdx_id.clone(),
        },
        name: doc_name,
        description,
        version: "1.0.0".to_string(),
        created_at: created_at_str,
        modified_at: chrono::Utc::now(),
        authors,
        tags,
        category,
        spdx_id,
        custom_id: None,
    };

    let conditions = first_package
        .and_then(|p| p.get("licenseDeclared"))
        .and_then(|v| v.as_str())
        .map(|s| vec![format!("License declared: {}", s)])
        .unwrap_or_default();

    let full_text = value
        .get("annotations")
        .and_then(|v| v.as_array())
        .and_then(|a| a.first())
        .and_then(|a| a.get("comment"))
        .and_then(|v| v.as_str())
        .unwrap_or("")
        .to_string();

    let license = super::license::License {
        metadata,
        preamble: String::new(),
        clauses: Vec::new(),
        conditions,
        permissions: Vec::new(),
        restrictions: Vec::new(),
        patent_grant: None,
        warranty_disclaimer: String::new(),
        full_text,
        hash: super::license::LicenseHash {
            blake3: String::new(),
            sha256: String::new(),
            sha3_256: String::new(),
        },
    };

    Ok(license)
}

pub fn import_from_toml(content: &str) -> Result<super::license::License, ExportError> {
    let toml_value: toml::Value = toml::from_str(content).map_err(|e| {
        ExportError::SerializationError(format!("Failed to parse TOML license: {}", e))
    })?;

    let get_str = |table: &toml::value::Table, key: &str| -> String {
        table
            .get(key)
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .to_string()
    };

    let metadata_table = toml_value
        .as_table()
        .and_then(|t| t.get("metadata"))
        .and_then(|v| v.as_table());

    let hash_table = toml_value
        .as_table()
        .and_then(|t| t.get("hash"))
        .and_then(|v| v.as_table());

    let (name, version, description, category_str, uuid_str, fingerprint_str, spdx_str) =
        if let Some(mt) = metadata_table {
            (
                get_str(mt, "name"),
                get_str(mt, "version"),
                get_str(mt, "description"),
                get_str(mt, "category"),
                get_str(mt, "uuid"),
                get_str(mt, "fingerprint"),
                get_str(mt, "spdx_id"),
            )
        } else {
            (
                get_str(
                    toml_value.as_table().unwrap_or(&toml::value::Table::new()),
                    "name",
                ),
                get_str(
                    toml_value.as_table().unwrap_or(&toml::value::Table::new()),
                    "version",
                ),
                get_str(
                    toml_value.as_table().unwrap_or(&toml::value::Table::new()),
                    "description",
                ),
                get_str(
                    toml_value.as_table().unwrap_or(&toml::value::Table::new()),
                    "category",
                ),
                get_str(
                    toml_value.as_table().unwrap_or(&toml::value::Table::new()),
                    "uuid",
                ),
                get_str(
                    toml_value.as_table().unwrap_or(&toml::value::Table::new()),
                    "fingerprint",
                ),
                get_str(
                    toml_value.as_table().unwrap_or(&toml::value::Table::new()),
                    "spdx_id",
                ),
            )
        };

    let uuid = uuid::Uuid::parse_str(&uuid_str).unwrap_or_else(|_| uuid::Uuid::new_v4());

    let category = match category_str.as_str() {
        "PublicDomain" => super::license::LicenseCategory::PublicDomain,
        "Permissive" => super::license::LicenseCategory::Permissive,
        "WeakCopyleft" => super::license::LicenseCategory::WeakCopyleft,
        "StrongCopyleft" => super::license::LicenseCategory::StrongCopyleft,
        "NetworkCopyleft" => super::license::LicenseCategory::NetworkCopyleft,
        "Proprietary" => super::license::LicenseCategory::Proprietary,
        "Commercial" => super::license::LicenseCategory::Commercial,
        "Dual" => super::license::LicenseCategory::Dual,
        "Multi" => super::license::LicenseCategory::Multi,
        _ => super::license::LicenseCategory::Custom,
    };

    let mut authors = Vec::new();
    if let Some(authors_val) = toml_value
        .as_table()
        .and_then(|t| t.get("authors"))
        .and_then(|v| v.get("list"))
        .and_then(|v| v.as_array())
    {
        for a in authors_val {
            if let Some(at) = a.as_table() {
                let email = at
                    .get("email")
                    .and_then(|v| v.as_str())
                    .map(|s| s.to_string());
                let org = at
                    .get("organization")
                    .and_then(|v| v.as_str())
                    .map(|s| s.to_string());
                let url = at
                    .get("url")
                    .and_then(|v| v.as_str())
                    .map(|s| s.to_string());
                authors.push(super::license::Author {
                    name: at
                        .get("name")
                        .and_then(|v| v.as_str())
                        .unwrap_or("Unknown")
                        .to_string(),
                    email,
                    organization: org,
                    url,
                });
            }
        }
    }
    if authors.is_empty() {
        authors.push(super::license::Author {
            name: "Unknown Author".to_string(),
            email: None,
            organization: None,
            url: None,
        });
    }

    let tags = toml_value
        .as_table()
        .and_then(|t| t.get("tags"))
        .and_then(|v| v.as_array())
        .map(|arr| {
            arr.iter()
                .filter_map(|v| v.as_str().map(|s| s.to_string()))
                .collect()
        })
        .unwrap_or_default();

    let fingerprint = if fingerprint_str.is_empty() {
        format!("{:x}", sha2::Sha256::digest(uuid.to_string().as_bytes()))
    } else {
        fingerprint_str
    };

    let spdx_id = if spdx_str.is_empty() {
        None
    } else {
        Some(spdx_str)
    };

    let hash = if let Some(ht) = hash_table {
        super::license::LicenseHash {
            blake3: get_str(ht, "blake3"),
            sha256: get_str(ht, "sha256"),
            sha3_256: get_str(ht, "sha3_256"),
        }
    } else {
        super::license::LicenseHash {
            blake3: String::new(),
            sha256: String::new(),
            sha3_256: String::new(),
        }
    };

    let created_at = chrono::Utc::now();
    let modified_at = chrono::Utc::now();

    let metadata = super::license::LicenseMetadata {
        id: super::license::LicenseId {
            uuid,
            fingerprint,
            spdx_identifier: spdx_id.clone(),
        },
        name: if name.is_empty() {
            "Untitled License".to_string()
        } else {
            name
        },
        description,
        version: if version.is_empty() {
            "1.0.0".to_string()
        } else {
            version
        },
        created_at,
        modified_at,
        authors,
        tags,
        category,
        spdx_id,
        custom_id: None,
    };

    let full_text = toml_value
        .as_table()
        .and_then(|t| t.get("full_text"))
        .and_then(|v| v.as_str())
        .unwrap_or("")
        .to_string();

    Ok(super::license::License {
        metadata,
        preamble: String::new(),
        clauses: Vec::new(),
        conditions: Vec::new(),
        permissions: Vec::new(),
        restrictions: Vec::new(),
        patent_grant: None,
        warranty_disclaimer: String::new(),
        full_text,
        hash,
    })
}

fn import_from_plaintext(content: &str) -> Result<super::license::License, ExportError> {
    let mut name = "Untitled License".to_string();
    let mut version = "1.0.0".to_string();
    let mut spdx_id: Option<String> = None;
    let mut permissions = Vec::new();
    let mut conditions = Vec::new();
    let mut restrictions = Vec::new();
    let mut warranty_disclaimer = String::new();
    let mut preamble = String::new();
    let mut patent_grant: Option<String> = None;
    let mut current_section: Option<String> = None;
    let full_text = content.to_string();

    for line in content.lines() {
        let trimmed = line.trim();

        if trimmed.starts_with("Version:") {
            version = trimmed
                .trim_start_matches("Version:")
                .trim()
                .to_string();
        } else if trimmed.starts_with("SPDX License Identifier:") {
            spdx_id = Some(
                trimmed
                    .trim_start_matches("SPDX License Identifier:")
                    .trim()
                    .to_string(),
            );
        } else if trimmed.starts_with("PERMISSIONS:") || trimmed.eq_ignore_ascii_case("PERMISSIONS") {
            current_section = Some("permissions".to_string());
        } else if trimmed.starts_with("CONDITIONS:") || trimmed.eq_ignore_ascii_case("CONDITIONS") {
            current_section = Some("conditions".to_string());
        } else if trimmed.starts_with("RESTRICTIONS:") || trimmed.eq_ignore_ascii_case("RESTRICTIONS") {
            current_section = Some("restrictions".to_string());
        } else if trimmed.starts_with("PATENT GRANT") || trimmed.eq_ignore_ascii_case("PATENT GRANT") {
            current_section = Some("patent_grant".to_string());
        } else if trimmed.starts_with("WARRANTY DISCLAIMER") || trimmed.eq_ignore_ascii_case("WARRANTY DISCLAIMER") {
            current_section = Some("warranty".to_string());
        } else if trimmed.starts_with("PREAMBLE") {
            current_section = Some("preamble".to_string());
        } else if !trimmed.is_empty() {
            let item = trimmed.trim_start_matches("- ").trim_start_matches("* ").trim_start_matches("  ");
            match current_section.as_deref() {
                Some("permissions") => {
                    if !item.is_empty() {
                        permissions.push(item.to_string());
                    }
                }
                Some("conditions") => {
                    if !item.is_empty() {
                        conditions.push(item.to_string());
                    }
                }
                Some("restrictions") => {
                    if !item.is_empty() {
                        restrictions.push(item.to_string());
                    }
                }
                Some("patent_grant") => {
                    let grant = patent_grant.get_or_insert_with(String::new);
                    if !grant.is_empty() {
                        grant.push('\n');
                    }
                    grant.push_str(line);
                }
                Some("warranty") => {
                    if !warranty_disclaimer.is_empty() {
                        warranty_disclaimer.push('\n');
                    }
                    warranty_disclaimer.push_str(trimmed);
                }
                Some("preamble") => {
                    if !preamble.is_empty() {
                        preamble.push('\n');
                    }
                    preamble.push_str(trimmed);
                }
                None => {
                    if name == "Untitled License" && !trimmed.is_empty() {
                        name = trimmed.to_string();
                    }
                }
                _ => {}
            }
        } else {
            if let Some(ref section) = current_section {
                match section.as_str() {
                    "preamble" | "patent_grant" | "warranty" => {}
                    _ => {
                        current_section = None;
                    }
                }
            }
        }
    }

    let name_for_fingerprint = name.clone();
    let fingerprint = format!(
        "{:x}",
        sha2::Sha256::digest(name_for_fingerprint.as_bytes())
    );

    let category = if !permissions.is_empty() && restrictions.is_empty() {
        super::license::LicenseCategory::Permissive
    } else if !restrictions.is_empty() && permissions.is_empty() {
        super::license::LicenseCategory::Custom
    } else if !conditions.is_empty() && !permissions.is_empty() {
        super::license::LicenseCategory::Permissive
    } else {
        super::license::LicenseCategory::Custom
    };

    let metadata = super::license::LicenseMetadata {
        id: super::license::LicenseId {
            uuid: uuid::Uuid::new_v4(),
            fingerprint,
            spdx_identifier: spdx_id.clone(),
        },
        name,
        description: String::new(),
        version,
        created_at: chrono::Utc::now(),
        modified_at: chrono::Utc::now(),
        authors: vec![super::license::Author {
            name: "Unknown Author".to_string(),
            email: None,
            organization: None,
            url: None,
        }],
        tags: Vec::new(),
        category,
        spdx_id,
        custom_id: None,
    };

    Ok(super::license::License {
        metadata,
        preamble,
        clauses: Vec::new(),
        conditions,
        permissions,
        restrictions,
        patent_grant,
        warranty_disclaimer,
        full_text,
        hash: super::license::LicenseHash {
            blake3: String::new(),
            sha256: String::new(),
            sha3_256: String::new(),
        },
    })
}
