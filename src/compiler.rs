use std::collections::HashMap;

use chrono::Utc;
use serde::{Deserialize, Serialize};
use thiserror::Error;
use uuid::Uuid;

use super::clauses::{ClauseDatabase, CompiledSection};
use super::license::*;
use super::spdx::SpdxDatabase;

// ── Error ────────────────────────────────────────────────────────────────────

#[derive(Debug, Error)]
pub enum CompilerError {
    #[error("invalid request: {0}")]
    InvalidRequest(String),

    #[error("clause selection error: {0}")]
    ClauseSelectionError(String),

    #[error("render error: {0}")]
    RenderError(String),

    #[error("hash error: {0}")]
    HashError(String),

    #[error("serialization error: {0}")]
    SerializationError(String),
}

// ── Compiler ─────────────────────────────────────────────────────────────────

#[derive(Debug, Clone)]
pub struct LicenseCompiler {
    clause_db: ClauseDatabase,
    spdx_db: SpdxDatabase,
}

// ── Result ───────────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CompilationResult {
    pub license: License,
    pub warnings: Vec<CompilationWarning>,
    pub suggestions: Vec<String>,
    pub applied_clauses: Vec<String>,
    pub skipped_clauses: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CompilationWarning {
    pub code: WarningCode,
    pub message: String,
    pub clause: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum WarningCode {
    ConflictingClauses,
    MissingRecommended,
    NonStandardSpdx,
    CustomLicenseGenerated,
    PatentRisk,
    NetworkCopyleftDetected,
    AiRestrictionPresent,
    CommercialRestrictionPresent,
}

// ── Implementation ───────────────────────────────────────────────────────────

impl LicenseCompiler {
    pub fn new() -> Self {
        Self {
            clause_db: ClauseDatabase::new(),
            spdx_db: SpdxDatabase::load(),
        }
    }

    pub fn compile(
        &self,
        request: &LicenseRequest,
    ) -> Result<CompilationResult, CompilerError> {
        // 1. Validate the request
        self.validate_request(request)?;

        // 2. Select appropriate clauses based on answers
        let selected_clause_names = self.select_clauses(&request.answers)?;

        // 3. Build variable map from request data
        let variables = self.build_variables(request);

        // 4. Render each clause template with variables
        let mut compiled_clauses: Vec<CompiledClause> = Vec::new();
        let mut warnings: Vec<CompilationWarning> = Vec::new();
        let mut skipped: Vec<String> = Vec::new();

        for name in &selected_clause_names {
            match self.clause_db.get_by_name(name) {
                Some(clause) => match clause.render(&variables) {
                    Ok(rendered_content) => {
                        compiled_clauses.push(CompiledClause {
                            clause_uuid: clause.uuid,
                            name: clause.name.clone(),
                            content: rendered_content,
                            category: clause.category.clone(),
                            priority: clause.priority,
                        });
                    }
                    Err(e) => {
                        warnings.push(CompilationWarning {
                            code: WarningCode::MissingRecommended,
                            message: format!(
                                "Failed to render clause '{}': {}",
                                name, e
                            ),
                            clause: Some(name.clone()),
                        });
                        skipped.push(name.clone());
                    }
                },
                None => {
                    warnings.push(CompilationWarning {
                        code: WarningCode::CustomLicenseGenerated,
                        message: format!("Clause '{}' not found in database", name),
                        clause: Some(name.clone()),
                    });
                    skipped.push(name.clone());
                }
            }
        }

        // 5. Check for conflicts between selected clauses
        let compat_warnings =
            self.check_compatibility(&selected_clause_names);
        warnings.extend(compat_warnings);

        // 6. Determine SPDX identifier
        let spdx_id = self.determine_spdx(&request.answers);
        let final_spdx = request.spdx_override.clone().or(spdx_id);

        // Validate the spdx if present
        if let Some(ref id) = final_spdx {
            if !self.spdx_db.validate_id(id) {
                warnings.push(CompilationWarning {
                    code: WarningCode::NonStandardSpdx,
                    message: format!(
                        "SPDX identifier '{}' is not in the standard SPDX database",
                        id
                    ),
                    clause: None,
                });
            }
        }

        // 7. Determine license category
        let category = self.determine_license_type(&request.answers);

        // 8. Categorize compiled clauses into permissions/conditions/restrictions/etc.
        compiled_clauses.sort_by_key(|c| c.priority);

        let mut conditions: Vec<String> = Vec::new();
        let mut permissions: Vec<String> = Vec::new();
        let mut restrictions: Vec<String> = Vec::new();
        let mut patent_grant: Option<String> = None;
        let mut warranty_disclaimer = String::new();

        for clause in &compiled_clauses {
            match clause.category {
                ClauseCategory::Permission => {
                    permissions.push(clause.content.clone());
                }
                ClauseCategory::Condition => {
                    conditions.push(clause.content.clone());
                }
                ClauseCategory::Restriction => {
                    restrictions.push(clause.content.clone());
                }
                ClauseCategory::Patent => {
                    if let Some(ref existing) = patent_grant {
                        let combined =
                            format!("{}\n\n{}", existing, clause.content);
                        patent_grant = Some(combined);
                    } else {
                        patent_grant = Some(clause.content.clone());
                    }
                }
                ClauseCategory::Warranty => {
                    if !warranty_disclaimer.is_empty() {
                        warranty_disclaimer.push_str("\n\n");
                    }
                    warranty_disclaimer.push_str(&clause.content);
                }
                _ => {}
            }
        }

        // 9. Build header, preamble, sections, footer for full text assembly
        let header = self.build_header(request);
        let preamble = self.build_preamble(request);

        let sections: Vec<CompiledSection> = compiled_clauses
            .iter()
            .map(|c| CompiledSection {
                title: c.name.clone(),
                content: c.content.clone(),
                category: c.category.clone(),
                clause_uuid: c.clause_uuid,
                priority: c.priority,
            })
            .collect();

        let footer = warranty_disclaimer.clone();

        let full_text =
            self.render_full_text(&header, &preamble, &sections, &footer);

        // 10. Compute hashes
        let hash = LicenseHash::compute(&full_text);
        let fingerprint = hash.blake3.clone();

        // Build metadata
        let now = Utc::now();
        let metadata = LicenseMetadata {
            id: LicenseId {
                uuid: Uuid::new_v4(),
                fingerprint,
                spdx_identifier: final_spdx.clone(),
            },
            name: request.project_name.clone(),
            description: format!(
                "Granular license for {}",
                request.project_name
            ),
            version: "1.0.0".to_string(),
            created_at: now,
            modified_at: now,
            authors: request.copyright_holders.clone(),
            tags: vec![format!("{:?}", category)],
            category: category.clone(),
            spdx_id: final_spdx,
            custom_id: None,
        };

        // 11. Create the License object
        let license = License {
            metadata,
            preamble,
            clauses: compiled_clauses,
            conditions,
            permissions,
            restrictions,
            patent_grant,
            warranty_disclaimer,
            full_text,
            hash,
        };

        // 12. Generate suggestions
        let suggestions = self.generate_suggestions(&request.answers);

        let applied: Vec<String> = selected_clause_names
            .iter()
            .filter(|n| !skipped.contains(n))
            .cloned()
            .collect();

        Ok(CompilationResult {
            license,
            warnings,
            suggestions,
            applied_clauses: applied,
            skipped_clauses: skipped,
        })
    }

    pub fn select_clauses(
        &self,
        answers: &[QuestionnaireAnswer],
    ) -> Result<Vec<String>, CompilerError> {
        let mut desired: Vec<String> = Vec::new();

        // ── Base license type ────────────────────────────────────────────
        let license_type = Self::get_answer_choice(answers, "license_type")
            .unwrap_or_else(|| "permissive".to_string());

        match license_type.as_str() {
            "permissive" => {
                desired.push("MIT-PERMISSION".to_string());
                desired.push("MIT-CONDITION".to_string());
                desired.push("MIT-WARRANTY".to_string());
            }
            "copyleft" => {
                desired.push("GPL-COPYLEFT".to_string());
            }
            "public_domain" => {
                let variant = Self::get_answer_choice(
                    answers,
                    "public_domain_variant",
                );
                match variant.as_deref() {
                    Some("cc0") => {
                        desired.push("CC0-PERMISSION".to_string());
                    }
                    _ => {
                        desired.push("UNLICENSE".to_string());
                    }
                }
            }
            "bsd" => {
                let variant =
                    Self::get_answer_choice(answers, "bsd_variant");
                match variant.as_deref() {
                    Some("bsd-3") => {
                        desired.push("BSD-2-PERMISSION".to_string());
                        desired.push("BSD-2-DISCLAIMER".to_string());
                        desired.push("BSD-3-ADVERTISING".to_string());
                    }
                    _ => {
                        desired.push("BSD-2-PERMISSION".to_string());
                        desired.push("BSD-2-DISCLAIMER".to_string());
                    }
                }
            }
            "apache" => {
                desired.push("APACHE-PERMISSION".to_string());
                desired.push("APACHE-PATENT".to_string());
            }
            "isc" => {
                desired.push("ISC-PERMISSION".to_string());
                desired.push("ISC-DISCLAIMER".to_string());
            }
            "mpl" => {
                desired.push("MPL-CONDITION".to_string());
            }
            "lgpl" => {
                desired.push("LGPL-STATIC".to_string());
                desired.push("GPL-COPYLEFT".to_string());
            }
            "network_copyleft" => {
                desired.push("GPL-COPYLEFT".to_string());
                desired.push("NETWORK-COPYLEFT".to_string());
            }
            "proprietary" => {
                desired.push("COPYRIGHT-NOTICE".to_string());
            }
            "commercial" => {
                desired.push("COPYRIGHT-NOTICE".to_string());
            }
            other => {
                return Err(CompilerError::ClauseSelectionError(format!(
                    "unknown license type '{}'",
                    other
                )));
            }
        }

        // ── Optional structural clauses ──────────────────────────────────
        if Self::get_answer_boolean(answers, "require_attribution") {
            desired.push("ATTRIBUTION".to_string());
        }
        if Self::get_answer_boolean(answers, "copyright_notice") {
            desired.push("COPYRIGHT-NOTICE".to_string());
        }
        if Self::get_answer_boolean(answers, "require_patent_grant")
            && !desired.contains(&"APACHE-PATENT".to_string())
        {
            desired.push("PATENT-RETALIATION".to_string());
        }
        if Self::get_answer_boolean(answers, "include_termination") {
            desired.push("TERMINATION".to_string());
        }
        if Self::get_answer_boolean(answers, "include_revision") {
            desired.push("REVISION".to_string());
        }
        if Self::get_answer_boolean(answers, "include_liability_capped") {
            desired.push("LIABILITY-CAPPED".to_string());
        }
        if Self::get_answer_boolean(answers, "allow_derivative_works") {
            desired.push("DERIVATIVE-WORKS-ALLOW".to_string());
        }
        if Self::get_answer_boolean(answers, "require_source_disclosure") {
            desired.push("SOURCE-DISCLOSURE".to_string());
        }
        if Self::get_answer_boolean(answers, "include_government_use") {
            desired.push("GOVERNMENT-USE".to_string());
        }
        if Self::get_answer_boolean(answers, "include_education_exception") {
            desired.push("EDUCATION-EXCEPTION".to_string());
        }
        if Self::get_answer_boolean(answers, "include_nonprofit_exception") {
            desired.push("NONPROFIT-EXCEPTION".to_string());
        }
        if Self::get_answer_boolean(answers, "include_cloud_hosting") {
            desired.push("CLOUD-HOSTING".to_string());
        }
        if Self::get_answer_boolean(answers, "include_container_rights") {
            desired.push("CONTAINER-RIGHTS".to_string());
        }

        // ── Restriction clauses ──────────────────────────────────────────
        if Self::get_answer_boolean(answers, "ai_training_restricted") {
            desired.push("AI-TRAINING-RESTRICTION".to_string());
        }
        if Self::get_answer_boolean(answers, "military_restricted") {
            desired.push("MILITARY-RESTRICTION".to_string());
        }
        if Self::get_answer_boolean(answers, "nuclear_restricted") {
            desired.push("NUCLEAR-RESTRICTION".to_string());
        }
        if Self::get_answer_boolean(answers, "healthcare_restricted") {
            desired.push("HEALTHCARE-RESTRICTION".to_string());
        }
        if Self::get_answer_boolean(answers, "export_control") {
            desired.push("EXPORT-CONTROL".to_string());
        }
        if Self::get_answer_boolean(answers, "no_commercial") {
            desired.push("NO-COMMERCIAL".to_string());
        }
        if Self::get_answer_boolean(answers, "no_trademark") {
            desired.push("NO-TRADemark".to_string());
        }
        if Self::get_answer_boolean(answers, "network_copyleft_restriction") {
            desired.push("NETWORK-COPYLEFT".to_string());
        }
        if Self::get_answer_boolean(answers, "no_derivatives") {
            desired.push("NO-DERIVATIVES".to_string());
        }
        if Self::get_answer_boolean(answers, "drm_restriction") {
            desired.push("DRM-RESTRICTION".to_string());
        }
        if Self::get_answer_boolean(answers, "privacy_no_telemetry") {
            desired.push("PRIVACY-NO-TELEMETRY".to_string());
        }
        if Self::get_answer_boolean(answers, "telemetry_notice") {
            desired.push("TELEMETRY-NOTICE".to_string());
        }
        if Self::get_answer_boolean(answers, "resale_restriction") {
            desired.push("RESALE-RESTRICTION".to_string());
        }

        // ── Commercial model clauses ─────────────────────────────────────
        let commercial_model =
            Self::get_answer_choice(answers, "commercial_model");
        match commercial_model.as_deref() {
            Some("subscription") => {
                desired.push("SUBSCRIPTION-LICENSE".to_string());
            }
            Some("evaluation") => {
                desired.push("EVALUATION-LICENSE".to_string());
            }
            Some("open_core") => {
                desired.push("OPEN-CORE".to_string());
            }
            Some("per_seat") => {
                desired.push("PER-SEAT-LICENSE".to_string());
            }
            Some("per_company") => {
                desired.push("PER-COMPANY-LICENSE".to_string());
            }
            Some("oem") => {
                desired.push("OEM-LICENSE".to_string());
            }
            _ => {}
        }

        // ── Warranty provision ───────────────────────────────────────────
        if Self::get_answer_boolean(answers, "provide_warranty") {
            desired.push("WARRANTY-PROVIDED".to_string());
        }

        // ── Additional restrictions from multichoice ─────────────────────
        let extra_restrictions =
            Self::get_answer_multichoice(answers, "additional_restrictions");
        for restriction in &extra_restrictions {
            match restriction.as_str() {
                "no_commercial" => {
                    if !desired.contains(&"NO-COMMERCIAL".to_string()) {
                        desired.push("NO-COMMERCIAL".to_string());
                    }
                }
                "no_derivatives" => {
                    if !desired.contains(&"NO-DERIVATIVES".to_string()) {
                        desired.push("NO-DERIVATIVES".to_string());
                    }
                }
                "ai_training" => {
                    if !desired
                        .contains(&"AI-TRAINING-RESTRICTION".to_string())
                    {
                        desired.push("AI-TRAINING-RESTRICTION".to_string());
                    }
                }
                "military" => {
                    if !desired
                        .contains(&"MILITARY-RESTRICTION".to_string())
                    {
                        desired.push("MILITARY-RESTRICTION".to_string());
                    }
                }
                "network_copyleft" => {
                    if !desired
                        .contains(&"NETWORK-COPYLEFT".to_string())
                    {
                        desired.push("NETWORK-COPYLEFT".to_string());
                    }
                }
                _ => {}
            }
        }

        // ── Dual license clause ──────────────────────────────────────────
        if request_dual_license(answers).is_some() {
            desired.push("DUAL-LICENSE".to_string());
        }

        // ── Remove duplicates while preserving order ─────────────────────
        let mut seen = std::collections::HashSet::new();
        desired.retain(|name| seen.insert(name.clone()));

        // ── Filter to clauses that exist in the database ──────────────────
        let valid: Vec<String> = desired
            .iter()
            .filter(|name| self.clause_db.get_by_name(name).is_some())
            .cloned()
            .collect();

        // ── Resolve missing dependencies ──────────────────────────────────
        let resolved = self.resolve_dependencies(&valid);

        // ── Validate: ensure every clause is in the database ──────────────
        for name in &resolved {
            if self.clause_db.get_by_name(name).is_none() {
                return Err(CompilerError::ClauseSelectionError(format!(
                    "resolved clause '{}' not found in database",
                    name
                )));
            }
        }

        // ── Validate dependencies via the clause database ─────────────────
        if let Err(e) = self.clause_db.validate_dependencies(&resolved) {
            return Err(CompilerError::ClauseSelectionError(format!(
                "dependency validation failed: {}",
                e
            )));
        }

        Ok(resolved)
    }

    pub fn determine_license_type(
        &self,
        answers: &[QuestionnaireAnswer],
    ) -> LicenseCategory {
        let license_type = Self::get_answer_choice(answers, "license_type")
            .unwrap_or_else(|| "permissive".to_string());

        match license_type.as_str() {
            "permissive" | "bsd" | "apache" | "isc" => LicenseCategory::Permissive,
            "copyleft" => LicenseCategory::StrongCopyleft,
            "public_domain" => LicenseCategory::PublicDomain,
            "mpl" | "lgpl" => LicenseCategory::WeakCopyleft,
            "network_copyleft" => LicenseCategory::NetworkCopyleft,
            "proprietary" => LicenseCategory::Proprietary,
            "commercial" => LicenseCategory::Commercial,
            _ => LicenseCategory::Custom,
        }
    }

    pub fn determine_spdx(
        &self,
        answers: &[QuestionnaireAnswer],
    ) -> Option<String> {
        let license_type = Self::get_answer_choice(answers, "license_type")?;

        let base_spdx = match license_type.as_str() {
            "permissive" => Some("MIT".to_string()),
            "copyleft" => {
                let version = Self::get_answer_choice(answers, "gpl_version");
                match version.as_deref() {
                    Some("2.0-only") => Some("GPL-2.0-only".to_string()),
                    Some("2.0-or-later") => {
                        Some("GPL-2.0-or-later".to_string())
                    }
                    Some("3.0-only") => Some("GPL-3.0-only".to_string()),
                    _ => Some("GPL-3.0-or-later".to_string()),
                }
            }
            "public_domain" => {
                let variant = Self::get_answer_choice(
                    answers,
                    "public_domain_variant",
                );
                match variant.as_deref() {
                    Some("cc0") => Some("CC0-1.0".to_string()),
                    _ => Some("Unlicense".to_string()),
                }
            }
            "bsd" => {
                let variant =
                    Self::get_answer_choice(answers, "bsd_variant");
                match variant.as_deref() {
                    Some("bsd-3") => Some("BSD-3-Clause".to_string()),
                    Some("bsd-4") => Some("BSD-4-Clause".to_string()),
                    _ => Some("BSD-2-Clause".to_string()),
                }
            }
            "apache" => Some("Apache-2.0".to_string()),
            "isc" => Some("ISC".to_string()),
            "mpl" => Some("MPL-2.0".to_string()),
            "lgpl" => {
                let version = Self::get_answer_choice(answers, "lgpl_version");
                match version.as_deref() {
                    Some("2.1-only") => Some("LGPL-2.1-only".to_string()),
                    Some("2.1-or-later") => {
                        Some("LGPL-2.1-or-later".to_string())
                    }
                    Some("3.0-only") => Some("LGPL-3.0-only".to_string()),
                    _ => Some("LGPL-3.0-or-later".to_string()),
                }
            }
            "network_copyleft" => {
                let version = Self::get_answer_choice(answers, "agpl_version");
                match version.as_deref() {
                    Some("3.0-only") => Some("AGPL-3.0-only".to_string()),
                    _ => Some("AGPL-3.0-or-later".to_string()),
                }
            }
            _ => None,
        };

        // If the user added non-standard restrictions, the base SPDX no
        // longer fully describes the license.  Return None so the caller
        // falls back to a custom LicenseRef.
        let has_custom_restrictions = Self::get_answer_boolean(
            answers,
            "ai_training_restricted",
        ) || Self::get_answer_boolean(answers, "military_restricted")
            || Self::get_answer_boolean(answers, "nuclear_restricted")
            || Self::get_answer_boolean(answers, "healthcare_restricted")
            || Self::get_answer_boolean(answers, "export_control")
            || Self::get_answer_boolean(answers, "no_commercial")
            || Self::get_answer_boolean(answers, "drm_restriction")
            || Self::get_answer_boolean(answers, "resale_restriction")
            || Self::get_answer_boolean(
                answers,
                "privacy_no_telemetry",
            );

        if has_custom_restrictions && base_spdx.is_some() {
            None
        } else {
            base_spdx
        }
    }

    pub fn build_variables(
        &self,
        request: &LicenseRequest,
    ) -> HashMap<String, String> {
        let mut vars: HashMap<String, String> = HashMap::new();

        // ── Core variables from the request ───────────────────────────────
        vars.insert(
            "project_name".to_string(),
            request.project_name.clone(),
        );
        vars.insert("year".to_string(), request.year.to_string());

        if let Some(first_author) = request.copyright_holders.first() {
            vars.insert(
                "copyright_holder".to_string(),
                first_author.name.clone(),
            );
            if let Some(ref email) = first_author.email {
                vars.insert("commercial_contact".to_string(), email.clone());
            }
            if let Some(ref org) = first_author.organization {
                vars.insert(
                    "company_name".to_string(),
                    org.clone(),
                );
            }
        } else {
            vars.insert(
                "copyright_holder".to_string(),
                "Copyright Holder".to_string(),
            );
        }

        // ── Dual license variables ────────────────────────────────────────
        if let Some((ref a, ref b)) = request.dual_license {
            vars.insert("license_a".to_string(), a.clone());
            vars.insert("license_b".to_string(), b.clone());
        }

        // ── Extract variables from answers ────────────────────────────────
        for answer in &request.answers {
            let key = answer.question_id.clone();
            match &answer.value {
                AnswerValue::Text(t) => {
                    vars.entry(key).or_insert_with(|| t.clone());
                }
                AnswerValue::Choice(c) => {
                    vars.entry(key).or_insert_with(|| c.clone());
                }
                AnswerValue::Number(n) => {
                    vars.entry(key)
                        .or_insert_with(|| n.to_string());
                }
                AnswerValue::Boolean(b) => {
                    vars.entry(key)
                        .or_insert_with(|| b.to_string());
                }
                _ => {}
            }
        }

        // ── Defaults for commonly required clause variables ───────────────
        vars.entry("cla_url".to_string())
            .or_insert_with(|| "https://example.com/cla".to_string());
        vars.entry("features_url".to_string())
            .or_insert_with(|| "https://example.com/features".to_string());
        vars.entry("oem_contact".to_string())
            .or_insert_with(|| "oem@example.com".to_string());
        vars.entry("warranty_days".to_string())
            .or_insert_with(|| "30".to_string());
        vars.entry("evaluation_days".to_string())
            .or_insert_with(|| "30".to_string());
        vars.entry("max_seats".to_string())
            .or_insert_with(|| "5".to_string());
        vars.entry("subscription_period".to_string())
            .or_insert_with(|| "1 month".to_string());
        vars.entry("pricing".to_string())
            .or_insert_with(|| "see pricing page".to_string());
        vars.entry("expiration_date".to_string())
            .or_insert_with(|| "2027-01-01".to_string());
        vars.entry("change_date".to_string())
            .or_insert_with(|| "2027-01-01".to_string());
        vars.entry("change_license".to_string())
            .or_insert_with(|| "Apache-2.0".to_string());
        vars.entry("allowed_uses".to_string())
            .or_insert_with(|| "non-production use".to_string());
        vars.entry("core_license".to_string())
            .or_insert_with(|| "MIT".to_string());
        vars.entry("commercial_conditions".to_string())
            .or_insert_with(|| {
                "you have obtained a commercial license".to_string()
            });

        vars
    }

    pub fn check_compatibility(
        &self,
        selected: &[String],
    ) -> Vec<CompilationWarning> {
        let mut warnings: Vec<CompilationWarning> = Vec::new();

        // ── Pairwise conflict check ───────────────────────────────────────
        for name in selected {
            if let Some(clause) = self.clause_db.get_by_name(name) {
                for conflict_name in &clause.conflicts {
                    if selected.iter().any(|n| n == conflict_name) {
                        warnings.push(CompilationWarning {
                            code: WarningCode::ConflictingClauses,
                            message: format!(
                                "Clauses '{}' and '{}' have conflicting terms",
                                name, conflict_name
                            ),
                            clause: Some(name.clone()),
                        });
                    }
                }
            }
        }

        // ── Missing dependency warnings ───────────────────────────────────
        for name in selected {
            if let Some(clause) = self.clause_db.get_by_name(name) {
                for dep in &clause.dependencies {
                    if !selected.iter().any(|n| n == dep) {
                        warnings.push(CompilationWarning {
                            code: WarningCode::MissingRecommended,
                            message: format!(
                                "Clause '{}' depends on '{}' which is not included",
                                name, dep
                            ),
                            clause: Some(name.clone()),
                        });
                    }
                }
            }
        }

        // ── Semantic warnings ─────────────────────────────────────────────
        let has_network_copyleft =
            selected.iter().any(|n| n == "NETWORK-COPYLEFT");
        if has_network_copyleft {
            warnings.push(CompilationWarning {
                code: WarningCode::NetworkCopyleftDetected,
                message: "Network copyleft (AGPL-style) clause detected. \
                         Modified versions used over a network must \
                         disclose source code."
                    .to_string(),
                clause: Some("NETWORK-COPYLEFT".to_string()),
            });
        }

        let has_ai_restriction =
            selected.iter().any(|n| n == "AI-TRAINING-RESTRICTION");
        if has_ai_restriction {
            warnings.push(CompilationWarning {
                code: WarningCode::AiRestrictionPresent,
                message: "AI/ML training restriction clause present. \
                         This may limit downstream use in AI pipelines."
                    .to_string(),
                clause: Some("AI-TRAINING-RESTRICTION".to_string()),
            });
        }

        let has_commercial_restriction =
            selected.iter().any(|n| n == "NO-COMMERCIAL");
        if has_commercial_restriction {
            warnings.push(CompilationWarning {
                code: WarningCode::CommercialRestrictionPresent,
                message: "Non-commercial restriction clause present. \
                         This restricts commercial use of the software."
                    .to_string(),
                clause: Some("NO-COMMERCIAL".to_string()),
            });
        }

        let has_patent_clause =
            selected.iter().any(|n| n == "APACHE-PATENT")
                || selected.iter().any(|n| n == "PATENT-RETALIATION");
        if !has_patent_clause {
            let has_copyleft =
                selected.iter().any(|n| n == "GPL-COPYLEFT")
                    || selected.iter().any(|n| n == "MPL-CONDITION");
            if has_copyleft {
                warnings.push(CompilationWarning {
                    code: WarningCode::PatentRisk,
                    message: "No explicit patent grant or retaliation \
                             clause in a copyleft license. Consider \
                             adding patent protection."
                        .to_string(),
                    clause: None,
                });
            }
        }

        warnings
    }

    pub fn generate_suggestions(
        &self,
        answers: &[QuestionnaireAnswer],
    ) -> Vec<String> {
        let mut suggestions: Vec<String> = Vec::new();

        let license_type =
            Self::get_answer_choice(answers, "license_type")
                .unwrap_or_else(|| "permissive".to_string());

        let has_attribution =
            Self::get_answer_boolean(answers, "require_attribution");
        let has_commercial =
            Self::get_answer_boolean(answers, "allow_commercial");
        let has_derivatives =
            Self::get_answer_boolean(answers, "allow_derivative_works");
        let has_source =
            Self::get_answer_boolean(answers, "require_source_disclosure");
        let has_ai = Self::get_answer_boolean(
            answers,
            "ai_training_restricted",
        );
        let has_patent =
            Self::get_answer_boolean(answers, "require_patent_grant");

        // ── Permissive license suggestions ────────────────────────────────
        if license_type == "permissive" || license_type == "bsd"
            || license_type == "isc"
        {
            if !has_attribution {
                suggestions.push(
                    "Consider requiring attribution to ensure \
                     credit is preserved across redistributions."
                        .to_string(),
                );
            }
            if !has_commercial {
                suggestions.push(
                    "This permissive license allows commercial use. \
                     If you want to restrict commercial use, consider \
                     adding the NO-COMMERCIAL restriction."
                        .to_string(),
                );
            }
        }

        // ── Copyleft suggestions ──────────────────────────────────────────
        if license_type == "copyleft" || license_type == "network_copyleft"
        {
            if !has_source {
                suggestions.push(
                    "Consider requiring source code disclosure to \
                     ensure derivative works remain open."
                        .to_string(),
                );
            }
            if license_type == "copyleft" && !has_ai {
                suggestions.push(
                    "If you want to prevent AI training on your \
                     code, consider adding the AI-TRAINING-RESTRICTION \
                     clause."
                        .to_string(),
                );
            }
        }

        // ── Public domain suggestions ─────────────────────────────────────
        if license_type == "public_domain" {
            suggestions.push(
                "Public domain dedications cannot be revoked. \
                 Ensure all copyright holders consent to the \
                 dedication."
                    .to_string(),
            );
            suggestions.push(
                "Consider patent implications. A public domain \
                 dedication covers copyright but may not cover \
                 patent rights."
                    .to_string(),
            );
        }

        // ── Patent suggestions ────────────────────────────────────────────
        if !has_patent
            && (license_type == "apache" || license_type == "permissive")
        {
            suggestions.push(
                "Consider including a patent grant clause to \
                 protect users from patent litigation related to \
                 the software."
                    .to_string(),
            );
        }

        // ── Derivative works suggestion ───────────────────────────────────
        if !has_derivatives
            && (license_type == "permissive" || license_type == "bsd")
        {
            suggestions.push(
                "If you want to allow derivative works, consider \
                 adding the DERIVATIVE-WORKS-ALLOW clause."
                    .to_string(),
            );
        }

        // ── Dual license suggestion ───────────────────────────────────────
        if license_type == "permissive" || license_type == "bsd" {
            suggestions.push(
                "Consider offering a dual license (open source + \
                 commercial) to allow commercial entities to \
                 purchase a proprietary license."
                    .to_string(),
            );
        }

        // ── GPL-specific suggestions ──────────────────────────────────────
        if license_type == "copyleft" {
            suggestions.push(
                "Ensure all linked libraries are GPL-compatible. \
                 GPL copyleft requires that combined works also \
                 be GPL-licensed."
                    .to_string(),
            );
        }

        // ── LGPL-specific suggestions ─────────────────────────────────────
        if license_type == "lgpl" {
            suggestions.push(
                "LGPL allows linking from proprietary software \
                 under certain conditions. Ensure the static \
                 linking exception matches your intended use."
                    .to_string(),
            );
        }

        // ── MPL-specific suggestions ──────────────────────────────────────
        if license_type == "mpl" {
            suggestions.push(
                "MPL applies at the file level. Modified MPL files \
                 must remain under MPL, but combining with other \
                 files is permitted."
                    .to_string(),
            );
        }

        // ── Network copyleft suggestion ───────────────────────────────────
        if license_type == "network_copyleft" {
            suggestions.push(
                "Network copyleft (AGPL-style) requires source \
                 disclosure for SaaS use. This may deter some \
                 commercial adoption."
                    .to_string(),
            );
        }

        // ── General suggestions ───────────────────────────────────────────
        suggestions.push(
            "Review the generated license with a legal \
             professional before distribution."
                .to_string(),
        );
        if has_ai {
            suggestions.push(
                "AI training restrictions may be difficult to \
                 enforce in some jurisdictions. Consider \
                 consulting legal counsel."
                    .to_string(),
            );
        }

        suggestions
    }

    pub fn render_full_text(
        &self,
        header: &str,
        preamble: &str,
        sections: &[CompiledSection],
        footer: &str,
    ) -> String {
        let mut text = String::new();

        if !header.is_empty() {
            text.push_str(header);
            text.push_str("\n\n");
        }

        if !preamble.is_empty() {
            text.push_str(preamble);
            text.push_str("\n\n");
        }

        let mut sorted = sections.to_vec();
        sorted.sort_by_key(|s| s.priority);

        for section in &sorted {
            text.push_str(&section.content);
            text.push_str("\n\n");
        }

        if !footer.is_empty() {
            text.push_str(footer);
            text.push('\n');
        }

        text
    }
}

// ── Private helpers ──────────────────────────────────────────────────────────

impl LicenseCompiler {
    fn validate_request(
        &self,
        request: &LicenseRequest,
    ) -> Result<(), CompilerError> {
        if request.project_name.trim().is_empty() {
            return Err(CompilerError::InvalidRequest(
                "project_name must not be empty".to_string(),
            ));
        }
        if request.year < 1970 || request.year > 2100 {
            return Err(CompilerError::InvalidRequest(format!(
                "year {} is out of reasonable range (1970-2100)",
                request.year
            )));
        }
        if request.copyright_holders.is_empty() {
            return Err(CompilerError::InvalidRequest(
                "at least one copyright holder is required"
                    .to_string(),
            ));
        }
        for (i, author) in request.copyright_holders.iter().enumerate() {
            if author.name.trim().is_empty() {
                return Err(CompilerError::InvalidRequest(format!(
                    "copyright holder at index {} has an empty name",
                    i
                )));
            }
        }
        if let Some((ref a, ref b)) = request.dual_license {
            if a.trim().is_empty() || b.trim().is_empty() {
                return Err(CompilerError::InvalidRequest(
                    "dual_license identifiers must not be empty"
                        .to_string(),
                ));
            }
        }
        Ok(())
    }

    fn resolve_dependencies(&self, names: &[String]) -> Vec<String> {
        let mut resolved: Vec<String> = names.to_vec();
        let mut visited: std::collections::HashSet<String> =
            names.iter().cloned().collect();
        let mut stack: Vec<String> = names.to_vec();

        while let Some(name) = stack.pop() {
            if let Some(clause) = self.clause_db.get_by_name(&name) {
                for dep in &clause.dependencies {
                    if !visited.contains(dep) {
                        visited.insert(dep.clone());
                        resolved.push(dep.clone());
                        stack.push(dep.clone());
                    }
                }
            }
        }

        resolved
    }

    fn build_header(&self, request: &LicenseRequest) -> String {
        let holder_names: Vec<&str> = request
            .copyright_holders
            .iter()
            .map(|a| a.name.as_str())
            .collect();
        let holders = holder_names.join(", ");
        format!(
            "Copyright (c) {} {}\n\n{}",
            request.year, holders, request.project_name
        )
    }

    fn build_preamble(&self, request: &LicenseRequest) -> String {
        let license_type = Self::get_answer_choice(
            &request.answers,
            "license_type",
        )
        .unwrap_or_else(|| "permissive".to_string());

        let type_description = match license_type.as_str() {
            "permissive" => "a permissive license",
            "copyleft" => "a strong copyleft license",
            "public_domain" => "a public domain dedication",
            "bsd" => "a BSD license",
            "apache" => "the Apache License",
            "isc" => "an ISC license",
            "mpl" => "the Mozilla Public License",
            "lgpl" => "the GNU Lesser General Public License",
            "network_copolit" => {
                "a network copyleft license"
            }
            "proprietary" => "a proprietary license",
            "commercial" => "a commercial license",
            _ => "the following license",
        };

        format!(
            "This software is made available under {}. \
             By using, copying, modifying, or distributing this \
             software, you agree to be bound by the terms and \
             conditions set forth below.",
            type_description
        )
    }

    fn get_answer_boolean(
        answers: &[QuestionnaireAnswer],
        id: &str,
    ) -> bool {
        answers
            .iter()
            .find(|a| a.question_id == id)
            .and_then(|a| match &a.value {
                AnswerValue::Boolean(b) => Some(*b),
                AnswerValue::Choice(c) => {
                    Some(c == "true" || c == "yes" || c == "1")
                }
                _ => None,
            })
            .unwrap_or(false)
    }

    fn get_answer_choice(
        answers: &[QuestionnaireAnswer],
        id: &str,
    ) -> Option<String> {
        answers
            .iter()
            .find(|a| a.question_id == id)
            .and_then(|a| match &a.value {
                AnswerValue::Choice(c) => Some(c.clone()),
                AnswerValue::Text(t) => Some(t.clone()),
                _ => None,
            })
    }

    fn get_answer_multichoice(
        answers: &[QuestionnaireAnswer],
        id: &str,
    ) -> Vec<String> {
        answers
            .iter()
            .find(|a| a.question_id == id)
            .and_then(|a| match &a.value {
                AnswerValue::MultiChoice(m) => Some(m.clone()),
                AnswerValue::Text(t) => {
                    Some(t.split(',').map(|s| s.trim().to_string()).collect())
                }
                _ => None,
            })
            .unwrap_or_default()
    }

    fn get_answer_text(
        answers: &[QuestionnaireAnswer],
        id: &str,
    ) -> Option<String> {
        answers
            .iter()
            .find(|a| a.question_id == id)
            .and_then(|a| match &a.value {
                AnswerValue::Text(t) => Some(t.clone()),
                AnswerValue::Choice(c) => Some(c.clone()),
                _ => None,
            })
    }

    #[allow(dead_code)]
    fn get_answer_number(
        answers: &[QuestionnaireAnswer],
        id: &str,
    ) -> Option<i64> {
        answers
            .iter()
            .find(|a| a.question_id == id)
            .and_then(|a| match &a.value {
                AnswerValue::Number(n) => Some(*n),
                AnswerValue::Text(t) => t.parse().ok(),
                AnswerValue::Choice(c) => c.parse().ok(),
                _ => None,
            })
    }
}

fn request_dual_license(
    answers: &[QuestionnaireAnswer],
) -> Option<(String, String)> {
    let a = LicenseCompiler::get_answer_text(answers, "dual_license_a")?;
    let b = LicenseCompiler::get_answer_text(answers, "dual_license_b")?;
    if a.is_empty() || b.is_empty() {
        None
    } else {
        Some((a, b))
    }
}
