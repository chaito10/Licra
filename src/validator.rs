use regex::Regex;
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::panic;

use super::clauses::ClauseDatabase;
use super::license::{CompiledClause, License};
use super::spdx::SpdxDatabase;

// ── Validation Result ────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ValidationResult {
    pub is_valid: bool,
    pub errors: Vec<ValidationError>,
    pub warnings: Vec<ValidationWarning>,
    pub score: u32,
}

// ── Validation Error ─────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize, thiserror::Error)]
pub enum ValidationError {
    #[error("Missing required clause: {clause}")]
    MissingClause { clause: String },
    #[error("Conflicting clauses: {clause_a} and {clause_b}")]
    ConflictingClauses { clause_a: String, clause_b: String },
    #[error("Invalid SPDX identifier: {identifier}")]
    InvalidSpdx { identifier: String },
    #[error("Broken reference: {reference}")]
    BrokenReference { reference: String },
    #[error("Missing copyright notice")]
    MissingCopyrightNotice,
    #[error("Missing warranty disclaimer")]
    MissingWarrantyDisclaimer,
    #[error("Invalid template variable: {variable} in clause {clause}")]
    InvalidTemplateVariable { variable: String, clause: String },
    #[error("License text too short: {length} characters")]
    TooShort { length: usize },
    #[error("License text too long: {length} characters")]
    TooLong { length: usize },
}

// ── Validation Warning ───────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize, thiserror::Error)]
pub enum ValidationWarning {
    #[error("Non-standard SPDX identifier: {identifier}")]
    NonStandardSpdx { identifier: String },
    #[error("Potentially conflicting clause combination: {clause_a}, {clause_b}")]
    PotentiallyConflicting { clause_a: String, clause_b: String },
    #[error("Missing recommended clause: {clause}")]
    MissingRecommended { clause: String },
    #[error("Unusual clause ordering")]
    UnusualOrdering,
    #[error("License may not be OSI approved")]
    MayNotBeOsiApproved,
}

// ── License Validator ────────────────────────────────────────────────────────

pub struct LicenseValidator {
    clause_db: ClauseDatabase,
    spdx_db: SpdxDatabase,
}

const MIN_TEXT_LENGTH: usize = 50;
const MAX_TEXT_LENGTH: usize = 100_000;

const COMMON_COPYRIGHT_KEYWORDS: &[&str] = &[
    "copyright",
    "(c)",
    "(C)",
    "all rights reserved",
];

const COMMON_WARRANTY_KEYWORDS: &[&str] = &[
    "warranty",
    "disclaim",
    "as is",
    "as-is",
    "without warranty",
    "no warranty",
    "provided \"as is\"",
];

impl LicenseValidator {
    pub fn new() -> Self {
        let clause_db = match panic::catch_unwind(|| ClauseDatabase::new()) {
            Ok(db) => db,
            Err(_) => match panic::catch_unwind(|| {
                ClauseDatabase::new_from_json("[]")
            }) {
                Ok(db) => db,
                Err(_) => ClauseDatabase::new_from_json("[]"),
            },
        };
        let spdx_db = SpdxDatabase::load();
        Self { clause_db, spdx_db }
    }

    pub fn validate_license(&self, license: &License) -> ValidationResult {
        let mut errors: Vec<ValidationError> = Vec::new();
        let mut warnings: Vec<ValidationWarning> = Vec::new();

        let text_errors = self.validate_structure(&license.full_text);
        errors.extend(text_errors);

        let clause_errors = self.validate_clauses(&license.clauses);
        errors.extend(clause_errors);

        if let Some(ref spdx_id) = license.metadata.spdx_id {
            if !self.validate_spdx(spdx_id) {
                errors.push(ValidationError::InvalidSpdx {
                    identifier: spdx_id.clone(),
                });
            } else if !self.spdx_db.validate_id(spdx_id) {
                warnings.push(ValidationWarning::NonStandardSpdx {
                    identifier: spdx_id.clone(),
                });
                let spdx_license = self.spdx_db.get_license(spdx_id);
                if let Some(lic) = spdx_license {
                    if !lic.osi_approved {
                        warnings.push(ValidationWarning::MayNotBeOsiApproved);
                    }
                }
            }
        }

        if license.warranty_disclaimer.trim().is_empty() {
            errors.push(ValidationError::MissingWarrantyDisclaimer);
        }

        let text_lower = license.full_text.to_lowercase();
        let has_copyright = COMMON_COPYRIGHT_KEYWORDS
            .iter()
            .any(|kw| text_lower.contains(kw));
        if !has_copyright {
            errors.push(ValidationError::MissingCopyrightNotice);
        }

        let template_errors = self.validate_template_variables(&license.full_text);
        errors.extend(template_errors);

        let has_warranty_disclaimer = COMMON_WARRANTY_KEYWORDS
            .iter()
            .any(|kw| text_lower.contains(kw));
        if !has_warranty_disclaimer && license.warranty_disclaimer.trim().is_empty() {
            warnings.push(ValidationWarning::MissingRecommended {
                clause: "Warranty disclaimer".to_string(),
            });
        }

        let clause_names: Vec<String> = license
            .clauses
            .iter()
            .map(|c| c.name.clone())
            .collect();
        let has_permission = license
            .clauses
            .iter()
            .any(|c| c.category == super::license::ClauseCategory::Permission);
        let has_condition = license
            .clauses
            .iter()
            .any(|c| c.category == super::license::ClauseCategory::Condition);

        if !has_permission {
            warnings.push(ValidationWarning::MissingRecommended {
                clause: "Permission grant".to_string(),
            });
        }
        if !has_condition {
            warnings.push(ValidationWarning::MissingRecommended {
                clause: "Condition clause".to_string(),
            });
        }

        self.check_potential_conflicts(&clause_names, &mut warnings);

        if license.clauses.len() >= 2 {
            let priorities: Vec<u32> = license.clauses.iter().map(|c| c.priority).collect();
            let mut sorted = priorities.clone();
            sorted.sort();
            if priorities != sorted {
                warnings.push(ValidationWarning::UnusualOrdering);
            }
        }

        let score = self.check_completeness(license);
        let is_valid = errors.is_empty();

        ValidationResult {
            is_valid,
            errors,
            warnings,
            score,
        }
    }

    pub fn validate_text(&self, text: &str) -> ValidationResult {
        let mut errors: Vec<ValidationError> = Vec::new();
        let mut warnings: Vec<ValidationWarning> = Vec::new();

        let text_errors = self.validate_structure(text);
        errors.extend(text_errors);

        let template_errors = self.validate_template_variables(text);
        errors.extend(template_errors);

        let text_lower = text.to_lowercase();
        let has_copyright = COMMON_COPYRIGHT_KEYWORDS
            .iter()
            .any(|kw| text_lower.contains(kw));
        if !has_copyright {
            errors.push(ValidationError::MissingCopyrightNotice);
        }

        let has_warranty = COMMON_WARRANTY_KEYWORDS
            .iter()
            .any(|kw| text_lower.contains(kw));
        if !has_warranty {
            errors.push(ValidationError::MissingWarrantyDisclaimer);
        }

        if errors.is_empty() && text.len() < 200 {
            warnings.push(ValidationWarning::MissingRecommended {
                clause: "More detailed permission grant".to_string(),
            });
        }

        let is_valid = errors.is_empty();
        let score = if is_valid {
            if text.len() >= 200 { 70 } else { 50 }
        } else {
            let base = 30u32.saturating_sub(errors.len() as u32 * 10);
            base
        };

        ValidationResult {
            is_valid,
            errors,
            warnings,
            score,
        }
    }

    pub fn validate_spdx(&self, spdx_id: &str) -> bool {
        self.spdx_db.validate_id(spdx_id)
    }

    pub fn validate_clauses(&self, clauses: &[CompiledClause]) -> Vec<ValidationError> {
        let mut errors: Vec<ValidationError> = Vec::new();

        let clause_names: Vec<String> = clauses.iter().map(|c| c.name.clone()).collect();

        match self.clause_db.check_conflicts(&clause_names) {
            Ok(()) => {}
            Err(super::clauses::ClauseError::ConflictingClauses { a, b }) => {
                errors.push(ValidationError::ConflictingClauses {
                    clause_a: a,
                    clause_b: b,
                });
            }
            Err(_) => {}
        }

        match self.clause_db.validate_dependencies(&clause_names) {
            Ok(_) => {}
            Err(super::clauses::ClauseError::MissingDependency {
                clause,
                dependency,
            }) => {
                errors.push(ValidationError::MissingClause {
                    clause: dependency.clone(),
                });
                warnings_from_dependency_error(&clause, &dependency, &mut errors);
            }
            Err(super::clauses::ClauseError::NotFound(name)) => {
                errors.push(ValidationError::BrokenReference { reference: name });
            }
            Err(_) => {}
        }

        for clause in clauses {
            let template_errors = self.validate_template_variables(&clause.content);
            for err in template_errors {
                if let ValidationError::InvalidTemplateVariable { variable, .. } = err {
                    errors.push(ValidationError::InvalidTemplateVariable {
                        variable,
                        clause: clause.name.clone(),
                    });
                }
            }
        }

        errors
    }

    pub fn validate_structure(&self, text: &str) -> Vec<ValidationError> {
        let mut errors: Vec<ValidationError> = Vec::new();

        let length = text.len();
        if length < MIN_TEXT_LENGTH {
            errors.push(ValidationError::TooShort { length });
        }
        if length > MAX_TEXT_LENGTH {
            errors.push(ValidationError::TooLong { length });
        }

        errors
    }

    pub fn check_completeness(&self, license: &License) -> u32 {
        let mut score: u32 = 0;
        let total_checks = 12u32;

        if !license.metadata.name.trim().is_empty() {
            score += 1;
        }
        if !license.metadata.description.trim().is_empty() {
            score += 1;
        }
        if !license.metadata.authors.is_empty() {
            score += 1;
        }
        if !license.preamble.trim().is_empty() {
            score += 1;
        }
        if !license.clauses.is_empty() {
            score += 1;
        }
        if !license.warranty_disclaimer.trim().is_empty() {
            score += 1;
        }

        let text_lower = license.full_text.to_lowercase();
        let has_copyright = COMMON_COPYRIGHT_KEYWORDS
            .iter()
            .any(|kw| text_lower.contains(kw));
        if has_copyright {
            score += 1;
        }

        let has_warranty = COMMON_WARRANTY_KEYWORDS
            .iter()
            .any(|kw| text_lower.contains(kw));
        if has_warranty {
            score += 1;
        }

        if license.metadata.spdx_id.is_some() {
            score += 1;
        }
        if !license.conditions.is_empty() {
            score += 1;
        }
        if !license.permissions.is_empty() {
            score += 1;
        }
        if license.patent_grant.is_some() {
            score += 1;
        }

        let percentage = (score * 100) / total_checks;
        percentage.min(100)
    }

    pub fn validate_template_variables(&self, text: &str) -> Vec<ValidationError> {
        let mut errors: Vec<ValidationError> = Vec::new();

        let re = match Regex::new(r"\{([a-zA-Z_][a-zA-Z0-9_]*)\}") {
            Ok(re) => re,
            Err(_) => return errors,
        };

        let known_variables: HashSet<&str> = [
            "year",
            "copyright_holder",
            "project_name",
            "commercial_contact",
            "license_a",
            "license_b",
            "change_date",
            "change_license",
            "allowed_uses",
            "cla_url",
            "company_name",
            "core_license",
            "features_url",
            "oem_contact",
            "warranty_days",
            "expiration_date",
            "subscription_period",
            "pricing",
            "evaluation_days",
            "max_seats",
            "commercial_conditions",
        ]
        .iter()
        .copied()
        .collect();

        for cap in re.captures_iter(text) {
            if let Some(matched) = cap.get(1) {
                let var_name = matched.as_str();
                if !known_variables.contains(var_name) {
                    errors.push(ValidationError::InvalidTemplateVariable {
                        variable: var_name.to_string(),
                        clause: String::new(),
                    });
                }
            }
        }

        errors
    }

    fn check_potential_conflicts(
        &self,
        clause_names: &[String],
        warnings: &mut Vec<ValidationWarning>,
    ) {
        let restriction_clauses: Vec<&str> = clause_names
            .iter()
            .filter_map(|name| {
                self.clause_db
                    .get_by_name(name)
                    .filter(|c| c.category == super::license::ClauseCategory::Restriction)
                    .map(|_| name.as_str())
            })
            .collect();

        let permission_clauses: Vec<&str> = clause_names
            .iter()
            .filter_map(|name| {
                self.clause_db
                    .get_by_name(name)
                    .filter(|c| c.category == super::license::ClauseCategory::Permission)
                    .map(|_| name.as_str())
            })
            .collect();

        if restriction_clauses.len() > 2 && permission_clauses.len() < 2 {
            for i in 0..restriction_clauses.len() {
                for j in (i + 1)..restriction_clauses.len() {
                    let a = self.clause_db.get_by_name(restriction_clauses[i]);
                    let b = self.clause_db.get_by_name(restriction_clauses[j]);
                    if let (Some(ca), Some(cb)) = (a, b) {
                        if !ca.conflicts.contains(&cb.name)
                            && !cb.conflicts.contains(&ca.name)
                        {
                            warnings.push(ValidationWarning::PotentiallyConflicting {
                                clause_a: ca.name.clone(),
                                clause_b: cb.name.clone(),
                            });
                        }
                    }
                }
            }
        }

        for name in clause_names {
            if let Some(clause) = self.clause_db.get_by_name(name) {
                if clause.category == super::license::ClauseCategory::Warranty {
                    let has_other_warranty = clause_names.iter().any(|other| {
                        other != name
                            && self
                                .clause_db
                                .get_by_name(other)
                                .map_or(false, |c| {
                                    c.category == super::license::ClauseCategory::Warranty
                                })
                    });
                    if has_other_warranty {
                        warnings.push(ValidationWarning::PotentiallyConflicting {
                            clause_a: name.clone(),
                            clause_b: "multiple warranty clauses present".to_string(),
                        });
                    }
                }
            }
        }
    }
}

fn warnings_from_dependency_error(
    _clause: &str,
    dependency: &str,
    errors: &mut Vec<ValidationError>,
) {
    errors.push(ValidationError::MissingClause {
        clause: dependency.to_string(),
    });
}

#[cfg(test)]
mod tests {
    use super::*;
    use super::super::license::*;
    use chrono::Utc;

    fn make_test_license() -> License {
        let metadata = LicenseMetadata {
            id: LicenseId {
                uuid: uuid::Uuid::new_v4(),
                fingerprint: "test-fingerprint".to_string(),
                spdx_identifier: Some("MIT".to_string()),
            },
            name: "Test License".to_string(),
            description: "A test license".to_string(),
            version: "1.0.0".to_string(),
            created_at: Utc::now(),
            modified_at: Utc::now(),
            authors: vec![Author {
                name: "Test Author".to_string(),
                email: Some("test@example.com".to_string()),
                organization: None,
                url: None,
            }],
            tags: vec!["test".to_string()],
            category: LicenseCategory::Permissive,
            spdx_id: Some("MIT".to_string()),
            custom_id: None,
        };

        let clauses = vec![
            CompiledClause {
                clause_uuid: uuid::Uuid::new_v4(),
                name: "MIT-PERMISSION".to_string(),
                content: "Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \"Software\"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:".to_string(),
                category: ClauseCategory::Permission,
                priority: 100,
            },
            CompiledClause {
                clause_uuid: uuid::Uuid::new_v4(),
                name: "MIT-CONDITION".to_string(),
                content: "The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.".to_string(),
                category: ClauseCategory::Condition,
                priority: 100,
            },
            CompiledClause {
                clause_uuid: uuid::Uuid::new_v4(),
                name: "MIT-WARRANTY".to_string(),
                content: "THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.".to_string(),
                category: ClauseCategory::Warranty,
                priority: 100,
            },
        ];

        License::new(
            metadata,
            "This is the preamble.".to_string(),
            clauses,
            vec!["Include copyright notice".to_string()],
            vec!["Use, copy, modify, distribute".to_string()],
            vec![],
            None,
            "THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND.".to_string(),
        )
    }

    #[test]
    fn test_validator_new() {
        let validator = LicenseValidator::new();
        assert!(validator.clause_db.get_by_name("MIT-PERMISSION").is_some());
        assert!(validator.spdx_db.validate_id("MIT"));
    }

    #[test]
    fn test_validate_license_valid() {
        let validator = LicenseValidator::new();
        let license = make_test_license();
        let result = validator.validate_license(&license);
        assert!(result.is_valid);
        assert!(result.score > 70);
    }

    #[test]
    fn test_validate_license_no_spdx() {
        let validator = LicenseValidator::new();
        let mut license = make_test_license();
        license.metadata.spdx_id = None;
        let result = validator.validate_license(&license);
        assert!(!result.errors.iter().any(|e| matches!(e, ValidationError::InvalidSpdx { .. })));
    }

    #[test]
    fn test_validate_license_invalid_spdx() {
        let validator = LicenseValidator::new();
        let mut license = make_test_license();
        license.metadata.spdx_id = Some("TOTALLY-INVALID-ID".to_string());
        let result = validator.validate_license(&license);
        assert!(result.errors.iter().any(|e| matches!(e, ValidationError::InvalidSpdx { .. })));
    }

    #[test]
    fn test_validate_text_valid() {
        let validator = LicenseValidator::new();
        let text = "Copyright (c) 2026 Test Author. Permission is hereby granted, free of charge, to any person obtaining a copy of this software. THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.";
        let result = validator.validate_text(text);
        assert!(result.is_valid);
        assert!(result.score > 50);
    }

    #[test]
    fn test_validate_text_too_short() {
        let validator = LicenseValidator::new();
        let result = validator.validate_text("short");
        assert!(!result.is_valid);
        assert!(result.errors.iter().any(|e| matches!(e, ValidationError::TooShort { .. })));
    }

    #[test]
    fn test_validate_text_missing_copyright() {
        let validator = LicenseValidator::new();
        let text = "Permission is hereby granted. THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND.";
        let result = validator.validate_text(text);
        assert!(!result.is_valid);
        assert!(result.errors.iter().any(|e| matches!(e, ValidationError::MissingCopyrightNotice)));
    }

    #[test]
    fn test_validate_text_missing_warranty() {
        let validator = LicenseValidator::new();
        let text = "Copyright (c) 2026 Test Author. Permission is hereby granted, free of charge, to any person obtaining a copy of this software for any purpose.";
        let result = validator.validate_text(text);
        assert!(!result.is_valid);
        assert!(result.errors.iter().any(|e| matches!(e, ValidationError::MissingWarrantyDisclaimer)));
    }

    #[test]
    fn test_validate_spdx_valid() {
        let validator = LicenseValidator::new();
        assert!(validator.validate_spdx("MIT"));
        assert!(validator.validate_spdx("Apache-2.0"));
        assert!(validator.validate_spdx("GPL-3.0-or-later"));
    }

    #[test]
    fn test_validate_spdx_invalid() {
        let validator = LicenseValidator::new();
        assert!(!validator.validate_spdx("NONEXISTENT"));
        assert!(!validator.validate_spdx(""));
    }

    #[test]
    fn test_validate_clauses_no_conflicts() {
        let validator = LicenseValidator::new();
        let clauses = vec![
            CompiledClause {
                clause_uuid: uuid::Uuid::new_v4(),
                name: "MIT-PERMISSION".to_string(),
                content: "test".to_string(),
                category: ClauseCategory::Permission,
                priority: 100,
            },
            CompiledClause {
                clause_uuid: uuid::Uuid::new_v4(),
                name: "MIT-CONDITION".to_string(),
                content: "test".to_string(),
                category: ClauseCategory::Condition,
                priority: 100,
            },
        ];
        let errors = validator.validate_clauses(&clauses);
        assert!(errors.is_empty());
    }

    #[test]
    fn test_validate_clauses_conflicts() {
        let validator = LicenseValidator::new();
        let clauses = vec![
            CompiledClause {
                clause_uuid: uuid::Uuid::new_v4(),
                name: "MIT-PERMISSION".to_string(),
                content: "test".to_string(),
                category: ClauseCategory::Permission,
                priority: 100,
            },
            CompiledClause {
                clause_uuid: uuid::Uuid::new_v4(),
                name: "NO-COMMERCIAL".to_string(),
                content: "test".to_string(),
                category: ClauseCategory::Restriction,
                priority: 200,
            },
        ];
        let errors = validator.validate_clauses(&clauses);
        assert!(errors.iter().any(|e| matches!(e, ValidationError::ConflictingClauses { .. })));
    }

    #[test]
    fn test_validate_clauses_missing_dependency() {
        let validator = LicenseValidator::new();
        let clauses = vec![CompiledClause {
            clause_uuid: uuid::Uuid::new_v4(),
            name: "MIT-CONDITION".to_string(),
            content: "test".to_string(),
            category: ClauseCategory::Condition,
            priority: 100,
        }];
        let errors = validator.validate_clauses(&clauses);
        assert!(errors.iter().any(|e| matches!(e, ValidationError::MissingClause { .. })));
    }

    #[test]
    fn test_validate_clauses_unknown() {
        let validator = LicenseValidator::new();
        let clauses = vec![CompiledClause {
            clause_uuid: uuid::Uuid::new_v4(),
            name: "NONEXISTENT-CLAUSE".to_string(),
            content: "test".to_string(),
            category: ClauseCategory::Permission,
            priority: 100,
        }];
        let errors = validator.validate_clauses(&clauses);
        assert!(errors.iter().any(|e| matches!(e, ValidationError::BrokenReference { .. })));
    }

    #[test]
    fn test_validate_structure_ok() {
        let validator = LicenseValidator::new();
        let text = "a".repeat(100);
        let errors = validator.validate_structure(&text);
        assert!(errors.is_empty());
    }

    #[test]
    fn test_validate_structure_too_short() {
        let validator = LicenseValidator::new();
        let errors = validator.validate_structure("hi");
        assert_eq!(errors.len(), 1);
        assert!(matches!(errors[0], ValidationError::TooShort { length: 2 }));
    }

    #[test]
    fn test_validate_structure_too_long() {
        let validator = LicenseValidator::new();
        let text = "x".repeat(MAX_TEXT_LENGTH + 1);
        let errors = validator.validate_structure(&text);
        assert_eq!(errors.len(), 1);
        assert!(matches!(errors[0], ValidationError::TooLong { .. }));
    }

    #[test]
    fn test_check_completeness_full() {
        let validator = LicenseValidator::new();
        let license = make_test_license();
        let score = validator.check_completeness(&license);
        assert!(score >= 80);
    }

    #[test]
    fn test_check_completeness_minimal() {
        let validator = LicenseValidator::new();
        let metadata = LicenseMetadata {
            id: LicenseId {
                uuid: uuid::Uuid::new_v4(),
                fingerprint: String::new(),
                spdx_identifier: None,
            },
            name: String::new(),
            description: String::new(),
            version: "1.0.0".to_string(),
            created_at: Utc::now(),
            modified_at: Utc::now(),
            authors: vec![],
            tags: vec![],
            category: LicenseCategory::Custom,
            spdx_id: None,
            custom_id: None,
        };
        let license = License::new(
            metadata,
            String::new(),
            vec![],
            vec![],
            vec![],
            vec![],
            None,
            String::new(),
        );
        let score = validator.check_completeness(&license);
        assert!(score < 50);
    }

    #[test]
    fn test_validate_template_variables_clean() {
        let validator = LicenseValidator::new();
        let text = "Permission is hereby granted without any variables.";
        let errors = validator.validate_template_variables(text);
        assert!(errors.is_empty());
    }

    #[test]
    fn test_validate_template_variables_unresolved() {
        let validator = LicenseValidator::new();
        let text = "Copyright (c) {year} {copyright_holder}. Licensed under {unknown_var}.";
        let errors = validator.validate_template_variables(text);
        assert_eq!(errors.len(), 1);
        if let ValidationError::InvalidTemplateVariable { variable, .. } = &errors[0] {
            assert_eq!(variable, "unknown_var");
        } else {
            panic!("expected InvalidTemplateVariable error");
        }
    }

    #[test]
    fn test_validate_template_variables_known() {
        let validator = LicenseValidator::new();
        let text = "Copyright (c) {year} {copyright_holder}. Contact {commercial_contact}.";
        let errors = validator.validate_template_variables(text);
        assert!(errors.is_empty());
    }

    #[test]
    fn test_validate_license_empty_warranty() {
        let validator = LicenseValidator::new();
        let mut license = make_test_license();
        license.warranty_disclaimer = String::new();
        let result = validator.validate_license(&license);
        assert!(result
            .errors
            .iter()
            .any(|e| matches!(e, ValidationError::MissingWarrantyDisclaimer)));
    }

    #[test]
    fn test_result_serialization() {
        let result = ValidationResult {
            is_valid: true,
            errors: vec![],
            warnings: vec![ValidationWarning::UnusualOrdering],
            score: 95,
        };
        let json = serde_json::to_string(&result).expect("serialization failed");
        let deserialized: ValidationResult =
            serde_json::from_str(&json).expect("deserialization failed");
        assert!(deserialized.is_valid);
        assert_eq!(deserialized.score, 95);
        assert_eq!(deserialized.warnings.len(), 1);
    }
}
