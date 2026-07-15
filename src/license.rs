use blake3::Hasher as Blake3Hasher;
use chrono::{DateTime, Datelike, Utc};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use sha3::Sha3_256;
use uuid::Uuid;

// ── License Metadata ─────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct LicenseMetadata {
    pub id: LicenseId,
    pub name: String,
    pub description: String,
    pub version: String,
    pub created_at: DateTime<Utc>,
    pub modified_at: DateTime<Utc>,
    pub authors: Vec<Author>,
    pub tags: Vec<String>,
    pub category: LicenseCategory,
    pub spdx_id: Option<String>,
    pub custom_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Author {
    pub name: String,
    pub email: Option<String>,
    pub organization: Option<String>,
    pub url: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum LicenseCategory {
    PublicDomain,
    Permissive,
    WeakCopyleft,
    StrongCopyleft,
    NetworkCopyleft,
    Proprietary,
    Commercial,
    Custom,
    Dual,
    Multi,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct LicenseId {
    pub uuid: Uuid,
    pub fingerprint: String,
    pub spdx_identifier: Option<String>,
}

impl LicenseMetadata {
    pub fn validate(&self) -> Result<(), String> {
        if self.name.trim().is_empty() {
            return Err("License name must not be empty".into());
        }
        if self.version.trim().is_empty() {
            return Err("License version must not be empty".into());
        }
        if self.authors.is_empty() {
            return Err("At least one author is required".into());
        }
        for author in &self.authors {
            if author.name.trim().is_empty() {
                return Err("Author name must not be empty".into());
            }
            if let Some(ref email) = author.email {
                if email.contains('@') {
                    let parts: Vec<&str> = email.split('@').collect();
                    if parts.len() != 2
                        || parts[0].trim().is_empty()
                        || parts[1].trim().is_empty()
                        || !parts[1].contains('.')
                    {
                        return Err(format!("Invalid email address: {}", email));
                    }
                } else {
                    return Err(format!("Invalid email address: {}", email));
                }
            }
        }
        if self.modified_at < self.created_at {
            return Err("modified_at must not be before created_at".into());
        }
        Ok(())
    }
}

// ── License Content ──────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct License {
    pub metadata: LicenseMetadata,
    pub preamble: String,
    pub clauses: Vec<CompiledClause>,
    pub conditions: Vec<String>,
    pub permissions: Vec<String>,
    pub restrictions: Vec<String>,
    pub patent_grant: Option<String>,
    pub warranty_disclaimer: String,
    pub full_text: String,
    pub hash: LicenseHash,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct LicenseHash {
    pub blake3: String,
    pub sha256: String,
    pub sha3_256: String,
}

impl License {
    pub fn new(
        metadata: LicenseMetadata,
        preamble: String,
        clauses: Vec<CompiledClause>,
        conditions: Vec<String>,
        permissions: Vec<String>,
        restrictions: Vec<String>,
        patent_grant: Option<String>,
        warranty_disclaimer: String,
    ) -> Self {
        let full_text = Self::assemble_full_text(
            &metadata,
            &preamble,
            &clauses,
            &conditions,
            &permissions,
            &restrictions,
            &patent_grant,
            &warranty_disclaimer,
        );
        let hash = LicenseHash::compute(&full_text);
        Self {
            metadata,
            preamble,
            clauses,
            conditions,
            permissions,
            restrictions,
            patent_grant,
            warranty_disclaimer,
            full_text,
            hash,
        }
    }

    pub fn hash(&mut self) {
        self.hash = LicenseHash::compute(&self.full_text);
    }

    pub fn to_spdx(&self) -> String {
        let mut spdx = String::new();
        spdx.push_str("SPDX-License-Identifier: ");
        if let Some(ref spdx_id) = self.metadata.spdx_id {
            spdx.push_str(spdx_id);
        } else if let Some(ref id) = self.metadata.id.spdx_identifier {
            spdx.push_str(id);
        } else {
            spdx.push_str(&format!("LicenseRef-{}", self.metadata.id.uuid));
        }
        spdx.push('\n');
        spdx.push_str("SPDX-FileCopyrightText: ");
        for (i, author) in self.metadata.authors.iter().enumerate() {
            if i > 0 {
                spdx.push_str(", ");
            }
            spdx.push_str(&author.name);
            if let Some(ref org) = author.organization {
                spdx.push_str(&format!(" ({})", org));
            }
        }
        spdx.push('\n');
        spdx.push_str("SPDX-Version: SPDX-3.0\n");
        spdx.push_str("SPDX-DataLicense: CC0-1.0\n");
        if let Some(ref id) = self.metadata.id.spdx_identifier {
            spdx.push_str(&format!("SPDX-LicenseID: {}\n", id));
        }
        spdx.push_str(&format!(
            "SPDX-Comment: {}\n",
            self.metadata.description
        ));
        if !self.conditions.is_empty() {
            spdx.push_str("# Conditions:\n");
            for cond in &self.conditions {
                spdx.push_str(&format!("#   - {}\n", cond));
            }
        }
        if !self.permissions.is_empty() {
            spdx.push_str("# Permissions:\n");
            for perm in &self.permissions {
                spdx.push_str(&format!("#   - {}\n", perm));
            }
        }
        if !self.restrictions.is_empty() {
            spdx.push_str("# Restrictions:\n");
            for r in &self.restrictions {
                spdx.push_str(&format!("#   - {}\n", r));
            }
        }
        spdx
    }

    fn assemble_full_text(
        metadata: &LicenseMetadata,
        preamble: &str,
        clauses: &[CompiledClause],
        conditions: &[String],
        permissions: &[String],
        restrictions: &[String],
        patent_grant: &Option<String>,
        warranty_disclaimer: &str,
    ) -> String {
        let mut text = String::new();
        text.push_str(&format!("{}\n\n", metadata.name));
        if !preamble.is_empty() {
            text.push_str(preamble);
            text.push_str("\n\n");
        }
        let mut sorted_clauses = clauses.to_vec();
        sorted_clauses.sort_by(|a, b| a.priority.cmp(&b.priority));
        for clause in &sorted_clauses {
            text.push_str(&format!("{}\n\n", clause.content));
        }
        if !permissions.is_empty() {
            text.push_str("Permissions:\n");
            for perm in permissions {
                text.push_str(&format!("- {}\n", perm));
            }
            text.push('\n');
        }
        if !conditions.is_empty() {
            text.push_str("Conditions:\n");
            for cond in conditions {
                text.push_str(&format!("- {}\n", cond));
            }
            text.push('\n');
        }
        if !restrictions.is_empty() {
            text.push_str("Restrictions:\n");
            for r in restrictions {
                text.push_str(&format!("- {}\n", r));
            }
            text.push('\n');
        }
        if let Some(ref patent) = patent_grant {
            text.push_str("Patent Grant:\n");
            text.push_str(patent);
            text.push_str("\n\n");
        }
        if !warranty_disclaimer.is_empty() {
            text.push_str(warranty_disclaimer);
            text.push('\n');
        }
        text
    }
}

impl LicenseHash {
    pub fn compute(text: &str) -> Self {
        let mut blake3_hasher = Blake3Hasher::new();
        blake3_hasher.update(text.as_bytes());
        let blake3 = blake3_hasher.finalize().to_hex().to_string();

        let mut sha256_hasher = Sha256::new();
        sha256_hasher.update(text.as_bytes());
        let sha256 = format!("{:x}", sha256_hasher.finalize());

        let mut sha3_hasher = Sha3_256::new();
        sha3_hasher.update(text.as_bytes());
        let sha3_256 = format!("{:x}", sha3_hasher.finalize());

        Self {
            blake3,
            sha256,
            sha3_256,
        }
    }
}

// ── Compiled Clause ──────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CompiledClause {
    pub clause_uuid: Uuid,
    pub name: String,
    pub content: String,
    pub category: ClauseCategory,
    pub priority: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
#[serde(rename_all = "snake_case")]
pub enum ClauseCategory {
    Permission,
    Condition,
    Restriction,
    Patent,
    Trademark,
    Warranty,
    Liability,
    Termination,
    Privacy,
    Compliance,
    Commercial,
    Meta,
}

// ── Questionnaire Answer ─────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct QuestionnaireAnswer {
    pub question_id: String,
    pub value: AnswerValue,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum AnswerValue {
    Boolean(bool),
    Text(String),
    Choice(String),
    MultiChoice(Vec<String>),
    Number(i64),
    Date(String),
}

// ── License Request ──────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct LicenseRequest {
    pub project_name: String,
    pub copyright_holders: Vec<Author>,
    pub year: i32,
    pub answers: Vec<QuestionnaireAnswer>,
    pub custom_clauses: Vec<String>,
    pub spdx_override: Option<String>,
    pub dual_license: Option<(String, String)>,
}

// ── License Output ───────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct LicenseOutput {
    pub plain_text: String,
    pub markdown: String,
    pub html: String,
    pub json: serde_json::Value,
    pub yaml: String,
    pub toml: String,
    pub spdx: String,
    pub notice: String,
    pub copying: String,
    pub summary: String,
    pub ai_summary: String,
}

impl LicenseOutput {
    pub fn generate_all(license: &License) -> Result<Self, String> {
        let plain_text = license.full_text.clone();

        let markdown = Self::generate_markdown(license)?;
        let html = Self::generate_html(license)?;
        let json = Self::generate_json(license)?;
        let yaml = Self::generate_yaml(license)?;
        let toml = Self::generate_toml(license)?;
        let spdx = license.to_spdx();
        let notice = Self::generate_notice(license)?;
        let copying = Self::generate_copying(license)?;
        let summary = Self::generate_summary(license)?;
        let ai_summary = Self::generate_ai_summary(license)?;

        Ok(Self {
            plain_text,
            markdown,
            html,
            json,
            yaml,
            toml,
            spdx,
            notice,
            copying,
            summary,
            ai_summary,
        })
    }

    fn generate_markdown(license: &License) -> Result<String, String> {
        let mut md = String::new();
        md.push_str(&format!("# {}\n\n", license.metadata.name));
        md.push_str(&format!(
            "**Version:** {}\n\n",
            license.metadata.version
        ));
        md.push_str(&format!(
            "**Category:** {:?}\n\n",
            license.metadata.category
        ));
        if !license.metadata.authors.is_empty() {
            md.push_str("**Authors:**\n");
            for author in &license.metadata.authors {
                md.push_str(&format!(
                    "- {} {}\n",
                    author.name,
                    author
                        .email
                        .as_ref()
                        .map(|e| format!("<{}>", e))
                        .unwrap_or_default()
                ));
            }
            md.push('\n');
        }
        md.push_str(&format!(
            "**Created:** {}\n\n",
            license.metadata.created_at.format("%Y-%m-%d %H:%M:%S UTC")
        ));
        md.push_str(&format!(
            "**Modified:** {}\n\n",
            license.metadata.modified_at.format("%Y-%m-%d %H:%M:%S UTC")
        ));
        if !license.metadata.tags.is_empty() {
            md.push_str(&format!("**Tags:** {}\n\n", license.metadata.tags.join(", ")));
        }
        if !license.preamble.is_empty() {
            md.push_str(&format!("## Preamble\n\n{}\n\n", license.preamble));
        }
        let mut sorted_clauses = license.clauses.clone();
        sorted_clauses.sort_by(|a, b| a.priority.cmp(&b.priority));
        if !sorted_clauses.is_empty() {
            md.push_str("## Clauses\n\n");
            for clause in &sorted_clauses {
                md.push_str(&format!("### {}\n\n{}\n\n", clause.name, clause.content));
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
            md.push_str(&format!("## Patent Grant\n\n{}\n\n", patent));
        }
        if !license.warranty_disclaimer.is_empty() {
            md.push_str(&format!(
                "## Warranty Disclaimer\n\n{}\n\n",
                license.warranty_disclaimer
            ));
        }
        md.push_str(&format!(
            "---\n\n*Blake3: `{}`*\n*SHA-256: `{}`*\n*SHA3-256: `{}`*\n",
            license.hash.blake3, license.hash.sha256, license.hash.sha3_256
        ));
        Ok(md)
    }

    fn generate_html(license: &License) -> Result<String, String> {
        let mut html = String::new();
        html.push_str("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n");
        html.push_str("  <meta charset=\"UTF-8\">\n");
        html.push_str(&format!(
            "  <title>{}</title>\n",
            escape_html(&license.metadata.name)
        ));
        html.push_str(
            "  <style>\n    body { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }\n",
        );
        html.push_str(
            "    h1 { border-bottom: 2px solid #333; padding-bottom: 0.5rem; }\n",
        );
        html.push_str(
            "    .meta { color: #666; margin-bottom: 2rem; }\n    pre { background: #f5f5f5; padding: 1rem; overflow-x: auto; }\n",
        );
        html.push_str("  </style>\n</head>\n<body>\n");
        html.push_str(&format!(
            "  <h1>{}</h1>\n",
            escape_html(&license.metadata.name)
        ));
        html.push_str(&format!(
            "  <div class=\"meta\">\n    <p><strong>Version:</strong> {}</p>\n",
            escape_html(&license.metadata.version)
        ));
        html.push_str(&format!(
            "    <p><strong>Category:</strong> {:?}</p>\n",
            license.metadata.category
        ));
        html.push_str(&format!(
            "    <p><strong>Created:</strong> {}</p>\n",
            license
                .metadata
                .created_at
                .format("%Y-%m-%d %H:%M:%S UTC")
        ));
        html.push_str("  </div>\n");
        if !license.preamble.is_empty() {
            html.push_str(&format!(
                "  <section>\n    <h2>Preamble</h2>\n    <p>{}</p>\n  </section>\n",
                escape_html(&license.preamble).replace('\n', "<br>")
            ));
        }
        let mut sorted_clauses = license.clauses.clone();
        sorted_clauses.sort_by(|a, b| a.priority.cmp(&b.priority));
        if !sorted_clauses.is_empty() {
            html.push_str("  <section>\n    <h2>Clauses</h2>\n");
            for clause in &sorted_clauses {
                html.push_str(&format!(
                    "    <h3>{}</h3>\n    <p>{}</p>\n",
                    escape_html(&clause.name),
                    escape_html(&clause.content).replace('\n', "<br>")
                ));
            }
            html.push_str("  </section>\n");
        }
        if !license.permissions.is_empty() {
            html.push_str("  <section>\n    <h2>Permissions</h2>\n    <ul>\n");
            for perm in &license.permissions {
                html.push_str(&format!(
                    "      <li>{}</li>\n",
                    escape_html(perm)
                ));
            }
            html.push_str("    </ul>\n  </section>\n");
        }
        if !license.conditions.is_empty() {
            html.push_str("  <section>\n    <h2>Conditions</h2>\n    <ul>\n");
            for cond in &license.conditions {
                html.push_str(&format!(
                    "      <li>{}</li>\n",
                    escape_html(cond)
                ));
            }
            html.push_str("    </ul>\n  </section>\n");
        }
        if !license.restrictions.is_empty() {
            html.push_str("  <section>\n    <h2>Restrictions</h2>\n    <ul>\n");
            for r in &license.restrictions {
                html.push_str(&format!(
                    "      <li>{}</li>\n",
                    escape_html(r)
                ));
            }
            html.push_str("    </ul>\n  </section>\n");
        }
        if let Some(ref patent) = license.patent_grant {
            html.push_str(&format!(
                "  <section>\n    <h2>Patent Grant</h2>\n    <p>{}</p>\n  </section>\n",
                escape_html(patent).replace('\n', "<br>")
            ));
        }
        if !license.warranty_disclaimer.is_empty() {
            html.push_str(&format!(
                "  <section>\n    <h2>Warranty Disclaimer</h2>\n    <p>{}</p>\n  </section>\n",
                escape_html(&license.warranty_disclaimer).replace('\n', "<br>")
            ));
        }
        html.push_str(&format!(
            "  <footer>\n    <p>Blake3: <code>{}</code></p>\n",
            escape_html(&license.hash.blake3)
        ));
        html.push_str(&format!(
            "    <p>SHA-256: <code>{}</code></p>\n",
            escape_html(&license.hash.sha256)
        ));
        html.push_str(&format!(
            "    <p>SHA3-256: <code>{}</code></p>\n",
            escape_html(&license.hash.sha3_256)
        ));
        html.push_str("  </footer>\n</body>\n</html>");
        Ok(html)
    }

    fn generate_json(license: &License) -> Result<serde_json::Value, String> {
        let value = serde_json::to_value(license)
            .map_err(|e| format!("JSON serialization error: {}", e))?;
        Ok(value)
    }

    fn generate_yaml(license: &License) -> Result<String, String> {
        let mut yaml = String::new();
        yaml.push_str(&format!("name: \"{}\"\n", license.metadata.name));
        yaml.push_str(&format!("version: \"{}\"\n", license.metadata.version));
        yaml.push_str(&format!(
            "category: \"{}\"\n",
            format!("{:?}", license.metadata.category)
        ));
        yaml.push_str(&format!(
            "description: \"{}\"\n",
            escape_yaml(&license.metadata.description)
        ));
        yaml.push_str(&format!(
            "created_at: \"{}\"\n",
            license.metadata.created_at.format("%Y-%m-%dT%H:%M:%SZ")
        ));
        yaml.push_str(&format!(
            "modified_at: \"{}\"\n",
            license.metadata.modified_at.format("%Y-%m-%dT%H:%M:%SZ")
        ));
        yaml.push_str(&format!("uuid: \"{}\"\n", license.metadata.id.uuid));
        yaml.push_str(&format!(
            "fingerprint: \"{}\"\n",
            license.metadata.id.fingerprint
        ));
        if let Some(ref spdx) = license.metadata.spdx_id {
            yaml.push_str(&format!("spdx_id: \"{}\"\n", spdx));
        }
        if !license.metadata.authors.is_empty() {
            yaml.push_str("authors:\n");
            for author in &license.metadata.authors {
                yaml.push_str(&format!("  - name: \"{}\"\n", author.name));
                if let Some(ref email) = author.email {
                    yaml.push_str(&format!("    email: \"{}\"\n", email));
                }
                if let Some(ref org) = author.organization {
                    yaml.push_str(&format!("    organization: \"{}\"\n", org));
                }
                if let Some(ref url) = author.url {
                    yaml.push_str(&format!("    url: \"{}\"\n", url));
                }
            }
        }
        if !license.metadata.tags.is_empty() {
            yaml.push_str("tags:\n");
            for tag in &license.metadata.tags {
                yaml.push_str(&format!("  - \"{}\"\n", tag));
            }
        }
        if !license.preamble.is_empty() {
            yaml.push_str(&format!(
                "preamble: |\n  {}\n",
                escape_yaml(&license.preamble).replace('\n', "\n  ")
            ));
        }
        let mut sorted_clauses = license.clauses.clone();
        sorted_clauses.sort_by(|a, b| a.priority.cmp(&b.priority));
        if !sorted_clauses.is_empty() {
            yaml.push_str("clauses:\n");
            for clause in &sorted_clauses {
                yaml.push_str(&format!("  - name: \"{}\"\n", clause.name));
                yaml.push_str(&format!("    uuid: \"{}\"\n", clause.clause_uuid));
                yaml.push_str(&format!(
                    "    category: \"{}\"\n",
                    format!("{:?}", clause.category)
                ));
                yaml.push_str(&format!("    priority: {}\n", clause.priority));
                yaml.push_str(&format!(
                    "    content: |\n      {}\n",
                    escape_yaml(&clause.content).replace('\n', "\n      ")
                ));
            }
        }
        if !license.permissions.is_empty() {
            yaml.push_str("permissions:\n");
            for perm in &license.permissions {
                yaml.push_str(&format!("  - \"{}\"\n", perm));
            }
        }
        if !license.conditions.is_empty() {
            yaml.push_str("conditions:\n");
            for cond in &license.conditions {
                yaml.push_str(&format!("  - \"{}\"\n", cond));
            }
        }
        if !license.restrictions.is_empty() {
            yaml.push_str("restrictions:\n");
            for r in &license.restrictions {
                yaml.push_str(&format!("  - \"{}\"\n", r));
            }
        }
        if let Some(ref patent) = license.patent_grant {
            yaml.push_str(&format!(
                "patent_grant: |\n  {}\n",
                escape_yaml(patent).replace('\n', "\n  ")
            ));
        }
        yaml.push_str(&format!(
            "warranty_disclaimer: |\n  {}\n",
            escape_yaml(&license.warranty_disclaimer).replace('\n', "\n  ")
        ));
        yaml.push_str(&format!("blake3: \"{}\"\n", license.hash.blake3));
        yaml.push_str(&format!("sha256: \"{}\"\n", license.hash.sha256));
        yaml.push_str(&format!("sha3_256: \"{}\"\n", license.hash.sha3_256));
        Ok(yaml)
    }

    fn generate_toml(license: &License) -> Result<String, String> {
        let mut toml = String::new();
        toml.push_str("[metadata]\n");
        toml.push_str(&format!("name = \"{}\"\n", license.metadata.name));
        toml.push_str(&format!("version = \"{}\"\n", license.metadata.version));
        toml.push_str(&format!(
            "category = \"{}\"\n",
            format!("{:?}", license.metadata.category)
        ));
        toml.push_str(&format!(
            "description = \"{}\"\n",
            escape_toml(&license.metadata.description)
        ));
        toml.push_str(&format!(
            "created_at = \"{}\"\n",
            license.metadata.created_at.format("%Y-%m-%dT%H:%M:%SZ")
        ));
        toml.push_str(&format!(
            "modified_at = \"{}\"\n",
            license.metadata.modified_at.format("%Y-%m-%dT%H:%M:%SZ")
        ));
        toml.push_str(&format!(
            "uuid = \"{}\"\n",
            license.metadata.id.uuid
        ));
        toml.push_str(&format!(
            "fingerprint = \"{}\"\n",
            license.metadata.id.fingerprint
        ));
        if let Some(ref spdx) = license.metadata.spdx_id {
            toml.push_str(&format!("spdx_id = \"{}\"\n", spdx));
        }
        if !license.metadata.authors.is_empty() {
            toml.push_str("\n[authors]\n");
            for author in &license.metadata.authors {
                toml.push_str(&format!("[[authors.list]]\n"));
                toml.push_str(&format!("name = \"{}\"\n", author.name));
                if let Some(ref email) = author.email {
                    toml.push_str(&format!("email = \"{}\"\n", email));
                }
                if let Some(ref org) = author.organization {
                    toml.push_str(&format!("organization = \"{}\"\n", org));
                }
                if let Some(ref url) = author.url {
                    toml.push_str(&format!("url = \"{}\"\n", url));
                }
            }
        }
        if !license.metadata.tags.is_empty() {
            toml.push_str("tags = [");
            for (i, tag) in license.metadata.tags.iter().enumerate() {
                if i > 0 {
                    toml.push_str(", ");
                }
                toml.push_str(&format!("\"{}\"", tag));
            }
            toml.push_str("]\n");
        }
        toml.push('\n');
        toml.push_str("[hash]\n");
        toml.push_str(&format!("blake3 = \"{}\"\n", license.hash.blake3));
        toml.push_str(&format!("sha256 = \"{}\"\n", license.hash.sha256));
        toml.push_str(&format!("sha3_256 = \"{}\"\n", license.hash.sha3_256));
        Ok(toml)
    }

    fn generate_notice(license: &License) -> Result<String, String> {
        let mut notice = String::new();
        notice.push_str(&format!("{} {}\n", license.metadata.name, license.metadata.version));
        notice.push_str(&format!(
            "Copyright (c) {}\n",
            license.metadata.year_line()
        ));
        notice.push_str("\n");
        notice.push_str("This software and associated documentation files (the \"Software\") are\n");
        notice.push_str("provided under the terms of the following license:\n\n");
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
        Ok(notice)
    }

    fn generate_copying(license: &License) -> Result<String, String> {
        let mut copying = String::new();
        copying.push_str(&format!(
            "                    {}                    \n",
            license.metadata.name
        ));
        copying.push_str(&format!(
            "{}\n",
            "=".repeat(20 + license.metadata.name.len())
        ));
        copying.push('\n');
        copying.push_str(&format!(
            "Version: {}\n",
            license.metadata.version
        ));
        copying.push_str(&format!(
            "Category: {:?}\n",
            license.metadata.category
        ));
        copying.push('\n');
        if !license.metadata.authors.is_empty() {
            copying.push_str("Copyright holders:\n");
            for author in &license.metadata.authors {
                let org = author
                    .organization
                    .as_ref()
                    .map(|o| format!(" ({})", o))
                    .unwrap_or_default();
                let email = author
                    .email
                    .as_ref()
                    .map(|e| format!(" <{}>", e))
                    .unwrap_or_default();
                copying.push_str(&format!("  {}{}{}\n", author.name, org, email));
            }
            copying.push('\n');
        }
        copying.push_str("This license governs the use, copying, distribution, and modification\n");
        copying.push_str("of the software.\n\n");
        if !license.preamble.is_empty() {
            copying.push_str("PREAMBLE\n");
            copying.push_str(&format!("{}\n\n", "-".repeat(40)));
            copying.push_str(&format!("{}\n\n", license.preamble));
        }
        let mut sorted_clauses = license.clauses.clone();
        sorted_clauses.sort_by(|a, b| a.priority.cmp(&b.priority));
        for clause in &sorted_clauses {
            copying.push_str(&format!("{}\n", clause.name.to_uppercase()));
            copying.push_str(&format!("{}\n", "-".repeat(clause.name.len())));
            copying.push_str(&format!("{}\n\n", clause.content));
        }
        if !license.permissions.is_empty() {
            copying.push_str("PERMISSIONS\n");
            copying.push_str(&format!("{}\n", "-".repeat(10)));
            for perm in &license.permissions {
                copying.push_str(&format!("  * {}\n", perm));
            }
            copying.push('\n');
        }
        if !license.conditions.is_empty() {
            copying.push_str("CONDITIONS\n");
            copying.push_str(&format!("{}\n", "-".repeat(10)));
            for cond in &license.conditions {
                copying.push_str(&format!("  * {}\n", cond));
            }
            copying.push('\n');
        }
        if !license.restrictions.is_empty() {
            copying.push_str("RESTRICTIONS\n");
            copying.push_str(&format!("{}\n", "-".repeat(11)));
            for r in &license.restrictions {
                copying.push_str(&format!("  * {}\n", r));
            }
            copying.push('\n');
        }
        if let Some(ref patent) = license.patent_grant {
            copying.push_str("PATENT GRANT\n");
            copying.push_str(&format!("{}\n", "-".repeat(12)));
            copying.push_str(&format!("{}\n\n", patent));
        }
        if !license.warranty_disclaimer.is_empty() {
            copying.push_str("DISCLAIMER\n");
            copying.push_str(&format!("{}\n", "-".repeat(10)));
            copying.push_str(&format!("{}\n\n", license.warranty_disclaimer));
        }
        copying.push_str("END OF LICENSE\n");
        Ok(copying)
    }

    fn generate_summary(license: &License) -> Result<String, String> {
        let mut summary = String::new();
        summary.push_str(&format!(
            "License: {} v{}\n",
            license.metadata.name, license.metadata.version
        ));
        summary.push_str(&format!("Category: {:?}\n", license.metadata.category));
        if let Some(ref spdx) = license.metadata.spdx_id {
            summary.push_str(&format!("SPDX: {}\n", spdx));
        }
        summary.push_str(&format!(
            "Authors: {}\n",
            license
                .metadata
                .authors
                .iter()
                .map(|a| a.name.clone())
                .collect::<Vec<_>>()
                .join(", ")
        ));
        summary.push_str(&format!("Clauses: {}\n", license.clauses.len()));
        summary.push_str(&format!(
            "Permissions: {}\n",
            license.permissions.len()
        ));
        summary.push_str(&format!(
            "Conditions: {}\n",
            license.conditions.len()
        ));
        summary.push_str(&format!(
            "Restrictions: {}\n",
            license.restrictions.len()
        ));
        summary.push_str(&format!(
            "Has patent grant: {}\n",
            license.patent_grant.is_some()
        ));
        summary.push_str(&format!(
            "Has warranty disclaimer: {}\n",
            !license.warranty_disclaimer.is_empty()
        ));
        summary.push_str(&format!("Blake3: {}\n", license.hash.blake3));
        summary.push_str(&format!(
            "Full text length: {} chars\n",
            license.full_text.len()
        ));
        Ok(summary)
    }

    fn generate_ai_summary(license: &License) -> Result<String, String> {
        let mut ai = String::new();
        ai.push_str(&format!(
            "# AI Summary: {} v{}\n\n",
            license.metadata.name, license.metadata.version
        ));
        ai.push_str(&format!(
            "**Category:** {:?}\n\n",
            license.metadata.category
        ));
        if let Some(ref desc) = Some(&license.metadata.description) {
            if !desc.is_empty() {
                ai.push_str(&format!("**Description:** {}\n\n", desc));
            }
        }
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
        let _total_clauses = license.clauses.len();
        let mut clause_counts = std::collections::HashMap::new();
        for clause in &license.clauses {
            *clause_counts
                .entry(format!("{:?}", clause.category))
                .or_insert(0u32) += 1;
        }
        ai.push_str("**Clause breakdown:**\n");
        for (cat, count) in &clause_counts {
            ai.push_str(&format!("- {}: {}\n", cat, count));
        }
        ai.push_str(&format!(
            "\n**License hash (Blake3):** `{}`\n",
            license.hash.blake3
        ));
        Ok(ai)
    }
}

// ── Digital Signature ────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct DigitalSignature {
    pub algorithm: SignatureAlgorithm,
    pub issuer: String,
    pub signature: String,
    pub public_key: String,
    pub timestamp: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum SignatureAlgorithm {
    Ed25519,
    Ecdsa,
    Rsa,
}

// ── Licensee Info (hashed) ───────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Licensee {
    pub name_hash: String,
    pub org_hash: Option<String>,
    pub email_hash: Option<String>,
    pub public_key: Option<String>,
}

impl Licensee {
    pub fn new(name: &str, organization: Option<&str>, email: Option<&str>, public_key: Option<String>) -> Self {
        Self {
            name_hash: hash_string(name),
            org_hash: organization.map(hash_string),
            email_hash: email.map(hash_string),
            public_key,
        }
    }

    pub fn verify_name(&self, name: &str) -> bool {
        self.name_hash == hash_string(name)
    }

    pub fn verify_organization(&self, org: &str) -> bool {
        match self.org_hash {
            Some(ref hash) => *hash == hash_string(org),
            None => false,
        }
    }

    pub fn verify_email(&self, email: &str) -> bool {
        match self.email_hash {
            Some(ref hash) => *hash == hash_string(email),
            None => false,
        }
    }
}

// ── Helper Functions ─────────────────────────────────────────────────────────

fn hash_string(input: &str) -> String {
    let mut hasher = Blake3Hasher::new();
    hasher.update(input.as_bytes());
    hasher.finalize().to_hex().to_string()
}

fn escape_html(s: &str) -> String {
    s.replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
        .replace('\'', "&#39;")
}

fn escape_yaml(s: &str) -> String {
    s.replace('"', "\\\"")
        .replace('\\', "\\\\")
        .replace('\n', "\\n")
        .replace('\r', "\\r")
        .replace('\t', "\\t")
}

fn escape_toml(s: &str) -> String {
    s.replace('"', "\\\"")
        .replace('\\', "\\\\")
        .replace('\n', "\\n")
        .replace('\r', "\\r")
        .replace('\t', "\\t")
}

// ── LicenseMetadata Helper ───────────────────────────────────────────────────

impl LicenseMetadata {
    fn year_line(&self) -> String {
        let years: Vec<i32> = self
            .authors
            .iter()
            .filter_map(|_| Some(self.created_at.year()))
            .collect();
        if years.is_empty() {
            self.created_at.format("%Y").to_string()
        } else {
            let min_year = years.iter().min().copied().unwrap_or_else(|| self.created_at.year());
            let max_year = years.iter().max().copied().unwrap_or_else(|| self.modified_at.year());
            if min_year == max_year {
                min_year.to_string()
            } else {
                format!("{}-{}", min_year, max_year)
            }
        }
    }
}
