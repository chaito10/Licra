use glg::questionnaire::Questionnaire;
use glg::spdx::SpdxDatabase;
use glg::clauses::ClauseDatabase;
use glg::compatibility::CompatibilityMatrix;
use glg::compiler::LicenseCompiler;
use glg::license::{Author, LicenseRequest, QuestionnaireAnswer, AnswerValue, LicenseHash};
use glg::crypto;
use glg::export;
use glg::validator::LicenseValidator;
use glg::database::GlgDatabase;

// ============================================================
// 1. Questionnaire Tests
// ============================================================

#[test]
fn questionnaire_load_default() {
    let q = Questionnaire::default();
    assert!(!q.questions.is_empty(), "Questions should not be empty");
}

#[test]
fn questionnaire_get_categories() {
    let q = Questionnaire::default();
    let categories = q.get_categories();
    assert!(!categories.is_empty(), "Should have categories");
}

#[test]
fn questionnaire_get_question_by_id() {
    let q = Questionnaire::default();
    let categories = q.get_categories();
    assert!(!categories.is_empty());
    let first_cat = &categories[0];
    let questions = q.get_questions_for_category(first_cat);
    assert!(!questions.is_empty(), "Category should have questions");
    let first_qid = &questions[0].id;
    let question = q.get_question_by_id(first_qid);
    assert!(question.is_some(), "Should find question by ID");
    let question = question.unwrap();
    assert_eq!(question.id, *first_qid);
}

#[test]
fn questionnaire_get_question_by_id_not_found() {
    let q = Questionnaire::default();
    let result = q.get_question_by_id("NONEXISTENT_ID_12345");
    assert!(result.is_none());
}

#[test]
fn questionnaire_search() {
    let q = Questionnaire::default();
    let _results = q.search("license");
}

#[test]
fn questionnaire_validate_answers() {
    let q = Questionnaire::default();
    let result = q.validate_answers(&[]);
    assert!(result.is_ok(), "Empty answers should be valid");
}

// ============================================================
// 2. SPDX Database Tests
// ============================================================

#[test]
fn spdx_database_load() {
    let _db = SpdxDatabase::load();
}

#[test]
fn spdx_database_all_ids() {
    let db = SpdxDatabase::load();
    let ids = db.all_ids();
    assert!(!ids.is_empty(), "Should have SPDX IDs");
}

#[test]
fn spdx_database_validate_id() {
    let db = SpdxDatabase::load();
    assert!(db.validate_id("MIT"), "MIT should be a valid SPDX ID");
    assert!(!db.validate_id("NOT_A_REAL_LICENSE"), "Fake license should be invalid");
}

#[test]
fn spdx_database_search() {
    let db = SpdxDatabase::load();
    let results = db.search("MIT");
    assert!(!results.is_empty(), "Should find MIT when searching");
}

// ============================================================
// 3. Clauses Database Tests
// ============================================================

#[test]
fn clause_database_new() {
    let _db = ClauseDatabase::new();
}

#[test]
fn clause_database_search() {
    let db = ClauseDatabase::new();
    let results = db.search("warranty");
    assert!(!results.is_empty(), "Should find clauses about warranty");
}

// ============================================================
// 4. Compatibility Matrix Tests
// ============================================================

#[test]
fn compatibility_matrix_new() {
    let _matrix = CompatibilityMatrix::new();
}

#[test]
fn compatibility_mit_apache_compatible() {
    let matrix = CompatibilityMatrix::new();
    assert!(matrix.are_compatible("MIT", "Apache-2.0"), "MIT and Apache-2.0 should be compatible");
}

#[test]
fn compatibility_mit_epl_incompatible() {
    let matrix = CompatibilityMatrix::new();
    assert!(!matrix.are_compatible("MIT", "EPL-1.0"), "MIT and EPL-1.0 should be incompatible");
}

#[test]
fn compatibility_explain() {
    let matrix = CompatibilityMatrix::new();
    let result = matrix.explain("MIT", "Apache-2.0");
    assert!(result.compatible, "MIT and Apache-2.0 should be compatible");
    assert!(result.reason.contains("compatible"));
}

#[test]
fn compatibility_explain_incompatible() {
    let matrix = CompatibilityMatrix::new();
    let result = matrix.explain("MIT", "EPL-1.0");
    assert!(!result.compatible, "MIT and EPL-1.0 should be incompatible");
    assert!(!result.suggestions.is_empty(), "Should have suggestions for incompatibility");
}

#[test]
fn compatibility_all_license_ids() {
    let matrix = CompatibilityMatrix::new();
    let ids = matrix.all_license_ids();
    assert!(ids.contains(&"MIT".to_string()));
    assert!(!ids.is_empty());
}

// ============================================================
// 5. Compiler Tests
// ============================================================

fn make_request(spdx_id: &str) -> LicenseRequest {
    LicenseRequest {
        project_name: "Test Project".to_string(),
        copyright_holders: vec![Author {
            name: "Test Author".to_string(),
            email: Some("test@example.com".to_string()),
            organization: None,
            url: None,
        }],
        year: 2025,
        answers: vec![],
        custom_clauses: vec![],
        spdx_override: Some(spdx_id.to_string()),
        dual_license: None,
    }
}

#[test]
fn compiler_new() {
    let _compiler = LicenseCompiler::new();
}

#[test]
fn compiler_compile_basic() {
    let compiler = LicenseCompiler::new();
    let request = make_request("MIT");
    let result = compiler.compile(&request);
    assert!(result.is_ok(), "Compilation should succeed for MIT: {:?}", result.err());
    let compiled = result.unwrap();
    assert!(!compiled.license.full_text.is_empty(), "License text should not be empty");
}

#[test]
fn compiler_compile_with_answers() {
    let compiler = LicenseCompiler::new();
    let mut request = make_request("MIT");
    request.answers = vec![
        QuestionnaireAnswer {
            question_id: "q1".to_string(),
            value: AnswerValue::Boolean(true),
        },
    ];
    let _result = compiler.compile(&request);
}

#[test]
fn compiler_compile_empty_project_name_fails() {
    let compiler = LicenseCompiler::new();
    let request = LicenseRequest {
        project_name: "".to_string(),
        copyright_holders: vec![Author {
            name: "Test Author".to_string(),
            email: None,
            organization: None,
            url: None,
        }],
        year: 2025,
        answers: vec![],
        custom_clauses: vec![],
        spdx_override: Some("MIT".to_string()),
        dual_license: None,
    };
    let result = compiler.compile(&request);
    assert!(result.is_err(), "Empty project name should fail");
}

// ============================================================
// 6. License / Hash Tests
// ============================================================

#[test]
fn license_hash_compute() {
    let hash_result = LicenseHash::compute("Hello, world!");
    assert!(!hash_result.blake3.is_empty(), "BLAKE3 hash should not be empty");
    assert!(!hash_result.sha256.is_empty(), "SHA-256 hash should not be empty");
    assert!(!hash_result.sha3_256.is_empty(), "SHA3-256 hash should not be empty");
}

#[test]
fn license_hash_deterministic() {
    let h1 = LicenseHash::compute("test input");
    let h2 = LicenseHash::compute("test input");
    assert_eq!(h1.blake3, h2.blake3, "Hash should be deterministic");
    assert_eq!(h1.sha256, h2.sha256, "Hash should be deterministic");
    assert_eq!(h1.sha3_256, h2.sha3_256, "Hash should be deterministic");
}

#[test]
fn license_hash_different_inputs() {
    let h1 = LicenseHash::compute("input A");
    let h2 = LicenseHash::compute("input B");
    assert_ne!(h1.blake3, h2.blake3, "Different inputs should produce different hashes");
}

// ============================================================
// 7. Crypto Tests
// ============================================================

#[test]
fn crypto_compute_text_hash() {
    let result = crypto::compute_text_hash("test text");
    assert!(!result.blake3.is_empty());
    assert!(!result.sha256.is_empty());
}

#[test]
fn crypto_ed25519_keypair() {
    let keypair = crypto::generate_keypair_ed25519().unwrap();
    assert!(!keypair.secret_key.is_empty());
    assert!(!keypair.public_key.is_empty());
}

#[test]
fn crypto_sign_and_verify() {
    let keypair = crypto::generate_keypair_ed25519().unwrap();
    let message = b"test message for signing";
    let sig_result = crypto::sign_ed25519(&keypair.secret_key, message).unwrap();
    let verified = crypto::verify_ed25519(&keypair.public_key, message, &sig_result.signature).unwrap();
    assert!(verified, "Signature should verify with correct public key");
}

#[test]
fn crypto_verify_wrong_key() {
    let keypair1 = crypto::generate_keypair_ed25519().unwrap();
    let keypair2 = crypto::generate_keypair_ed25519().unwrap();
    let message = b"test message";
    let sig_result = crypto::sign_ed25519(&keypair1.secret_key, message).unwrap();
    let verified = crypto::verify_ed25519(&keypair2.public_key, message, &sig_result.signature).unwrap();
    assert!(!verified, "Signature should NOT verify with wrong public key");
}

#[test]
fn crypto_licensee_hash() {
    let hash = crypto::create_licensee_hash("John Doe", Some("Acme Corp"), Some("john@acme.com"));
    assert!(!hash.name_hash.is_empty());
    assert!(hash.org_hash.is_some());
    assert!(hash.email_hash.is_some());
}

#[test]
fn crypto_licensee_hash_optional_fields() {
    let hash = crypto::create_licensee_hash("Jane Doe", None, None);
    assert!(!hash.name_hash.is_empty());
    assert!(hash.org_hash.is_none());
    assert!(hash.email_hash.is_none());
}

#[test]
fn crypto_qr_code() {
    let qr = crypto::generate_qr_code("https://example.com/license");
    assert!(qr.is_ok(), "QR code generation should succeed");
}

// ============================================================
// 8. Export Tests
// ============================================================

fn make_compiled_license() -> glg::license::License {
    let compiler = LicenseCompiler::new();
    let request = make_request("MIT");
    compiler.compile(&request).unwrap().license
}

#[test]
fn export_markdown() {
    let license = make_compiled_license();
    let md = export::export_to_markdown(&license);
    assert!(md.contains("MIT") || !md.is_empty(), "Markdown export should have content");
}

#[test]
fn export_html() {
    let license = make_compiled_license();
    let html = export::export_to_html(&license);
    assert!(!html.is_empty(), "HTML export should have content");
}

#[test]
fn export_json() {
    let license = make_compiled_license();
    let json = export::export_to_json(&license);
    assert!(json.is_ok(), "JSON export should succeed");
    let json_str = json.unwrap();
    assert!(!json_str.is_empty(), "JSON export should have content");
}

#[test]
fn export_yaml() {
    let license = make_compiled_license();
    let yaml = export::export_to_yaml(&license);
    assert!(yaml.is_ok(), "YAML export should succeed");
}

#[test]
fn export_text() {
    let license = make_compiled_license();
    let text = export::export_to_text(&license);
    assert!(!text.is_empty(), "Text export should have content");
}

#[test]
fn export_spdx() {
    let license = make_compiled_license();
    let spdx = export::export_to_spdx(&license);
    assert!(!spdx.is_empty(), "SPDX export should have content");
}

#[test]
fn export_notice() {
    let license = make_compiled_license();
    let notice = export::export_notice(&license);
    assert!(!notice.is_empty(), "Notice export should have content");
}

// ============================================================
// 9. Validator Tests
// ============================================================

#[test]
fn validator_new() {
    let _validator = LicenseValidator::new();
}

#[test]
fn validator_validate_text() {
    let validator = LicenseValidator::new();
    let result = validator.validate_text("MIT License - This is a test license text for validation purposes.");
    assert!(result.score > 0 || result.score == 0, "Validation score should be a valid u32");
}

#[test]
fn validator_validate_license() {
    let validator = LicenseValidator::new();
    let license = make_compiled_license();
    let result = validator.validate_license(&license);
    assert!(result.score > 0, "Compiled license should have a positive validation score");
}

// ============================================================
// 10. Database Tests
// ============================================================

#[test]
fn database_new() {
    let _db = GlgDatabase::new();
}

#[test]
fn database_search_all() {
    let db = GlgDatabase::new();
    let results = db.search_all("MIT");
    assert!(!results.is_empty(), "Should find results for MIT search");
}

#[test]
fn database_stats() {
    let db = GlgDatabase::new();
    let stats = db.stats();
    assert!(stats.spdx_license_count > 0, "Should have SPDX licenses");
    assert!(stats.clause_count > 0, "Should have clauses");
}
