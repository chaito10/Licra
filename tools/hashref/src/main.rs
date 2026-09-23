use sha2::{Digest, Sha256};
use sha3::Sha3_256;
use glg::license::{Author, AnswerValue, LicenseRequest, QuestionnaireAnswer};
use glg::compiler::LicenseCompiler;

fn main() {
    for s in ["", "abc", "hello"] {
        let b3 = blake3::hash(s.as_bytes()).to_hex().to_string();
        let mut h = Sha256::new();
        h.update(s.as_bytes());
        let s256 = format!("{:x}", h.finalize());
        let mut h3 = Sha3_256::new();
        h3.update(s.as_bytes());
        let s3 = format!("{:x}", h3.finalize());
        println!("{}\t{}\t{}\t{}", s, b3, s256, s3);
    }

    let year = 2026u32;
    let answers = vec![
        QuestionnaireAnswer { question_id: "license_type".to_string(), value: AnswerValue::Choice("permissive".to_string()) },
        QuestionnaireAnswer { question_id: "own-001".to_string(), value: AnswerValue::Boolean(true) },
        QuestionnaireAnswer { question_id: "copy-001".to_string(), value: AnswerValue::Boolean(true) },
    ];
    let request = glg::license::LicenseRequest {
        project_name: "DemoProject".to_string(),
        copyright_holders: vec![Author { name: "DemoProject".to_string(), email: None, organization: None, url: None }],
        year,
        answers,
        custom_clauses: vec![],
        spdx_override: None,
        dual_license: None,
    };
    let compiler = LicenseCompiler::new();
    match compiler.compile(&request) {
        Ok(result) => {
            let license = &result.license;
            let yaml = glg::export::export_to_yaml(license).unwrap();
            let toml = glg::export::export_to_toml(license).unwrap();
            std::fs::write("ref.yaml", &yaml).unwrap();
            std::fs::write("ref.toml", &toml).unwrap();
            println!("wrote ref.yaml ({} bytes), ref.toml ({} bytes)", yaml.len(), toml.len());
        }
        Err(e) => eprintln!("compile error: {}", e),
    }
}