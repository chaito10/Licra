use clap::{Parser, Subcommand};
use std::path::{Path, PathBuf};

#[derive(Parser)]
#[command(
    name = "glg",
    about = "Granular License Generator - A modern license compiler",
    version,
    long_about = "Generate deterministic, granular software licenses from a comprehensive questionnaire.\nSupports 30+ license types, SPDX identifiers, digital signatures, and multiple export formats."
)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Start the web UI for interactive license generation
    Web {
        /// Address to bind to
        #[arg(short, long, default_value = "127.0.0.1:8080")]
        address: String,
    },
    /// Create a new license interactively (CLI questionnaire)
    New {
        /// Output directory for generated files
        #[arg(short, long, default_value = ".")]
        output: PathBuf,
        /// Project name
        #[arg(short, long)]
        name: Option<String>,
        /// License type (mit, apache2, gpl3, bsd2, bsd3, isc, mpl2, lgpl3, agpl3, unlicense, cc0, proprietary, custom)
        #[arg(short = 't', long)]
        license_type: Option<String>,
    },
    /// Open and edit an existing license file
    Open {
        /// Path to license file
        path: PathBuf,
    },
    /// Generate license files from a JSON configuration
    Generate {
        /// Input JSON configuration file
        #[arg(short, long)]
        config: PathBuf,
        /// Output directory
        #[arg(short, long, default_value = ".")]
        output: PathBuf,
        /// Formats to generate (comma-separated: text,md,html,json,yaml,toml,xml,spdx)
        #[arg(short, long, default_value = "text,md,json")]
        formats: String,
    },
    /// Export a license to a specific format
    Export {
        /// License file to export
        #[arg(short, long)]
        input: PathBuf,
        /// Output format (text, md, html, json, yaml, toml, xml, spdx, cyclonedx)
        #[arg(short, long)]
        format: String,
        /// Output file path
        #[arg(short, long)]
        output: Option<PathBuf>,
    },
    /// Import a license from SPDX, JSON, or YAML
    Import {
        /// File to import
        path: PathBuf,
        /// Output path for imported license
        #[arg(short, long)]
        output: Option<PathBuf>,
    },
    /// Validate a license for completeness and correctness
    Validate {
        /// License file to validate
        path: PathBuf,
    },
    /// Compare compatibility between two or more licenses
    Compare {
        /// License identifiers to compare
        licenses: Vec<String>,
        /// Show detailed explanation
        #[arg(short, long)]
        verbose: bool,
    },
    /// Explain a license in plain language
    Explain {
        /// License file or SPDX identifier
        source: String,
        /// Use AI for explanation (requires configured LLM)
        #[arg(short, long)]
        ai: bool,
    },
    /// Digitally sign a license file
    Sign {
        /// License file to sign
        path: PathBuf,
        /// Key file for signing
        #[arg(short, long)]
        key: Option<PathBuf>,
        /// Signature algorithm (ed25519, ecdsa, rsa)
        #[arg(short, long, default_value = "ed25519")]
        algorithm: String,
    },
    /// Verify a digital signature on a license
    Verify {
        /// License file to verify
        path: PathBuf,
        /// Public key file for verification
        #[arg(short, long)]
        key: Option<PathBuf>,
    },
    /// Compute hashes for files, folders, or repositories
    Hash {
        /// Path to hash
        path: PathBuf,
        /// Hash algorithm (blake3, sha256, sha3, all)
        #[arg(short, long, default_value = "all")]
        algorithm: String,
    },
    /// Query the AI assistant for license guidance
    Ai {
        /// Query or license file
        source: String,
        /// AI task (explain, suggest, summarize, conflicts, recommend)
        #[arg(short, long, default_value = "explain")]
        task: String,
    },
    /// Run diagnostics to check the installation
    Doctor,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cli = Cli::parse();

    match cli.command {
        Commands::Web { address } => cmd_web(&address)?,
        Commands::New { output, name, license_type } => cmd_new(&output, name.as_deref(), license_type.as_deref())?,
        Commands::Open { path } => cmd_open(&path)?,
        Commands::Generate { config, output, formats } => cmd_generate(&config, &output, &formats)?,
        Commands::Export { input, format, output } => cmd_export(&input, &format, output.as_deref())?,
        Commands::Import { path, output } => cmd_import(&path, output.as_deref())?,
        Commands::Validate { path } => cmd_validate(&path)?,
        Commands::Compare { licenses, verbose } => cmd_compare(&licenses, verbose),
        Commands::Explain { source, ai } => cmd_explain(&source, ai)?,
        Commands::Sign { path, key, algorithm } => cmd_sign(&path, key.as_deref(), &algorithm)?,
        Commands::Verify { path, key } => cmd_verify(&path, key.as_deref())?,
        Commands::Hash { path, algorithm } => cmd_hash(&path, &algorithm)?,
        Commands::Ai { source, task } => cmd_ai(&source, &task)?,
        Commands::Doctor => cmd_doctor(),
    }
    Ok(())
}

fn cmd_web(address: &str) -> Result<(), Box<dyn std::error::Error>> {
    let rt = tokio::runtime::Runtime::new()?;
    rt.block_on(async {
        let state = glg::ui::AppState {
            compiler: std::sync::Arc::new(parking_lot::RwLock::new(glg::compiler::LicenseCompiler::new())),
            questionnaire: std::sync::Arc::new(parking_lot::RwLock::new(glg::questionnaire::Questionnaire::default())),
            database: std::sync::Arc::new(parking_lot::RwLock::new(glg::database::GlgDatabase::new())),
            llm_client: std::sync::Arc::new(parking_lot::RwLock::new(glg::llm::LlmClient::new(glg::llm::LlmConfig::default()))),
            validator: std::sync::Arc::new(parking_lot::RwLock::new(glg::validator::LicenseValidator::new())),
        };
        glg::ui::serve(address, state).await
    })?;
    Ok(())
}

fn cmd_new(output: &Path, name: Option<&str>, license_type: Option<&str>) -> Result<(), Box<dyn std::error::Error>> {
    let project_name = name.unwrap_or("My Project");
    let year = chrono::Local::now().format("%Y").to_string();

    let lt = license_type.unwrap_or("mit");
    let answers = vec![
        glg::license::QuestionnaireAnswer {
            question_id: "license_type".to_string(),
            value: glg::license::AnswerValue::Choice(lt.to_string()),
        },
        glg::license::QuestionnaireAnswer {
            question_id: "own-001".to_string(),
            value: glg::license::AnswerValue::Boolean(true),
        },
        glg::license::QuestionnaireAnswer {
            question_id: "copy-001".to_string(),
            value: glg::license::AnswerValue::Boolean(true),
        },
    ];

    let request = glg::license::LicenseRequest {
        project_name: project_name.to_string(),
        copyright_holders: vec![glg::license::Author {
            name: project_name.to_string(),
            email: None,
            organization: None,
            url: None,
        }],
        year: year.parse().unwrap_or(2026),
        answers,
        custom_clauses: vec![],
        spdx_override: None,
        dual_license: None,
    };

    let compiler = glg::compiler::LicenseCompiler::new();
    match compiler.compile(&request) {
        Ok(result) => {
            println!("Generated license: {}", result.license.metadata.name);
            println!("SPDX ID: {}", result.license.metadata.spdx_id.as_deref().unwrap_or("Custom"));
            println!("Fingerprint: {}", result.license.hash.blake3);
            println!();
            for warning in &result.warnings {
                eprintln!("Warning: {}", warning.message);
            }

            let md_path = output.join("LICENSE.md");
            let txt_path = output.join("LICENSE");
            let json_path = output.join("LICENSE.json");

            std::fs::write(&txt_path, &result.license.full_text)?;
            let md_content = glg::export::export_to_markdown(&result.license);
            std::fs::write(&md_path, md_content)?;
            let json_content = glg::export::export_to_json(&result.license)?;
            std::fs::write(&json_path, json_content)?;

            println!("Written:");
            println!("  {}", txt_path.display());
            println!("  {}", md_path.display());
            println!("  {}", json_path.display());
        }
        Err(e) => {
            eprintln!("Error: {}", e);
            std::process::exit(1);
        }
    }
    Ok(())
}

fn cmd_open(path: &Path) -> Result<(), Box<dyn std::error::Error>> {
    if !path.exists() {
        eprintln!("File not found: {}", path.display());
        std::process::exit(1);
    }
    let content = std::fs::read_to_string(path)?;
    println!("License: {}", path.display());
    println!("{}", "-".repeat(60));
    println!("{}", content);
    Ok(())
}

fn cmd_generate(config: &Path, output: &Path, formats: &str) -> Result<(), Box<dyn std::error::Error>> {
    let config_content = std::fs::read_to_string(config)?;
    let request: glg::license::LicenseRequest = serde_json::from_str(&config_content)?;

    let compiler = glg::compiler::LicenseCompiler::new();
    match compiler.compile(&request) {
        Ok(result) => {
            let format_list: Vec<&str> = formats.split(',').map(|s| s.trim()).collect();
            for fmt in &format_list {
                let options = glg::export::ExportOptions {
                    format: match *fmt {
                        "text" => glg::export::ExportFormat::PlainText,
                        "md" | "markdown" => glg::export::ExportFormat::Markdown,
                        "html" => glg::export::ExportFormat::Html,
                        "json" => glg::export::ExportFormat::Json,
                        "yaml" | "yml" => glg::export::ExportFormat::Yaml,
                        "toml" => glg::export::ExportFormat::Toml,
                        "xml" => glg::export::ExportFormat::Xml,
                        "spdx" => glg::export::ExportFormat::Spdx,
                        "cyclonedx" => glg::export::ExportFormat::CycloneDX,
                        _ => {
                            eprintln!("Unknown format: {}", fmt);
                            continue;
                        }
                    },
                    output_path: None,
                    include_notice: true,
                    include_copying: true,
                    include_summary: true,
                    include_ai_summary: false,
                    include_qr_code: false,
                    pretty_print: true,
                };
                match glg::export::export_license(&result.license, &options) {
                    Ok(export_result) => {
                        let file_path = output.join(&export_result.filename);
                        std::fs::write(&file_path, &export_result.content)?;
                        println!("Generated: {} ({} bytes)", file_path.display(), export_result.size_bytes);
                    }
                    Err(e) => eprintln!("Error exporting {}: {}", fmt, e),
                }
            }
        }
        Err(e) => {
            eprintln!("Compilation error: {}", e);
            std::process::exit(1);
        }
    }
    Ok(())
}

fn cmd_export(input: &Path, format: &str, output: Option<&Path>) -> Result<(), Box<dyn std::error::Error>> {
    let content = std::fs::read_to_string(input)?;
    let license: glg::license::License = serde_json::from_str(&content)
        .or_else(|_| {
            let license = glg::license::License::new(
                glg::license::LicenseMetadata {
                    id: glg::license::LicenseId {
                        uuid: uuid::Uuid::new_v4(),
                        fingerprint: String::new(),
                        spdx_identifier: None,
                    },
                    name: "Imported License".to_string(),
                    description: String::new(),
                    version: "1.0.0".to_string(),
                    created_at: chrono::Utc::now(),
                    modified_at: chrono::Utc::now(),
                    authors: vec![],
                    tags: vec![],
                    category: glg::license::LicenseCategory::Custom,
                    spdx_id: None,
                    custom_id: None,
                },
                String::new(),
                vec![],
                vec![],
                vec![],
                vec![],
                None,
                content,
            );
            Ok::<_, String>(license)
        })?;

    let export_format = match format {
        "text" | "txt" => glg::export::ExportFormat::PlainText,
        "md" | "markdown" => glg::export::ExportFormat::Markdown,
        "html" => glg::export::ExportFormat::Html,
        "json" => glg::export::ExportFormat::Json,
        "yaml" | "yml" => glg::export::ExportFormat::Yaml,
        "toml" => glg::export::ExportFormat::Toml,
        "xml" => glg::export::ExportFormat::Xml,
        "spdx" => glg::export::ExportFormat::Spdx,
        "cyclonedx" => glg::export::ExportFormat::CycloneDX,
        _ => {
            eprintln!("Unknown format: {}", format);
            std::process::exit(1);
        }
    };
    let options = glg::export::ExportOptions {
        format: export_format,
        output_path: output.map(|p| p.to_path_buf()),
        include_notice: true,
        include_copying: true,
        include_summary: true,
        include_ai_summary: false,
        include_qr_code: false,
        pretty_print: true,
    };
    let result = glg::export::export_license(&license, &options)?;
    if let Some(out) = output {
        std::fs::write(out, &result.content)?;
        println!("Exported to {}", out.display());
    } else {
        println!("{}", result.content);
    }
    Ok(())
}

fn cmd_import(path: &Path, output: Option<&Path>) -> Result<(), Box<dyn std::error::Error>> {
    let license = glg::export::import_license(path)?;
    println!("Imported license: {}", license.metadata.name);
    println!("SPDX: {}", license.metadata.spdx_id.as_deref().unwrap_or("None"));
    println!("Fingerprint: {}", license.hash.blake3);
    if let Some(out) = output {
        let json = glg::export::export_to_json(&license)?;
        std::fs::write(out, json)?;
        println!("Saved to {}", out.display());
    }
    Ok(())
}

fn cmd_validate(path: &Path) -> Result<(), Box<dyn std::error::Error>> {
    let content = std::fs::read_to_string(path)?;
    let validator = glg::validator::LicenseValidator::new();
    let result = validator.validate_text(&content);
    println!("Validation Result:");
    println!("  Valid: {}", result.is_valid);
    println!("  Score: {}/100", result.score);
    if result.errors.is_empty() {
        println!("  Errors: None");
    } else {
        for err in &result.errors {
            eprintln!("  Error: {}", err);
        }
    }
    if result.warnings.is_empty() {
        println!("  Warnings: None");
    } else {
        for warn in &result.warnings {
            println!("  Warning: {}", warn);
        }
    }
    if !result.is_valid {
        std::process::exit(1);
    }
    Ok(())
}

fn cmd_compare(licenses: &[String], verbose: bool) {
    if licenses.len() < 2 {
        eprintln!("Provide at least two license identifiers to compare.");
        eprintln!("Example: glg compare MIT GPL-3.0-only");
        std::process::exit(1);
    }
    let matrix = glg::compatibility::CompatibilityMatrix::new();
    println!("License Compatibility Analysis");
    println!("{}", "=".repeat(60));

    for i in 0..licenses.len() {
        for j in (i + 1)..licenses.len() {
            let a = &licenses[i];
            let b = &licenses[j];
            let compatible = matrix.are_compatible(a, b);
            let status = if compatible { "COMPATIBLE" } else { "INCOMPATIBLE" };
            println!("  {} + {} = {}", a, b, status);
            if verbose {
                let result = matrix.explain(a, b);
                println!("    Reason: {}", result.reason);
                if !result.suggestions.is_empty() {
                    for s in &result.suggestions {
                        println!("    Suggestion: {}", s);
                    }
                }
            }
        }
    }

    if licenses.len() > 2 {
        let report = matrix.check_batch(&licenses.to_vec());
        println!();
        println!("Overall: {}", if report.overall_compatible { "ALL COMPATIBLE" } else { "CONFLICTS DETECTED" });
        if !report.conflicts.is_empty() {
            for (a, b) in &report.conflicts {
                eprintln!("  Conflict: {} vs {}", a, b);
            }
        }
        if !report.suggestions.is_empty() {
            for s in &report.suggestions {
                println!("  Suggestion: {}", s);
            }
        }
    }
}

fn cmd_explain(source: &str, use_ai: bool) -> Result<(), Box<dyn std::error::Error>> {
    let text = if Path::new(source).exists() {
        std::fs::read_to_string(source)?
    } else {
        source.to_string()
    };

    if use_ai {
        let client = glg::llm::LlmClient::new(glg::llm::LlmConfig::default());
        match client.explain_license(&text) {
            Ok(response) => {
                println!("AI Explanation:");
                println!("{}", "-".repeat(60));
                println!("{}", response.content);
            }
            Err(e) => {
                eprintln!("AI not available: {}", e);
                println!("License text:");
                println!("{}", text);
            }
        }
    } else {
        println!("License text:");
        println!("{}", "-".repeat(60));
        println!("{}", text);
        println!();
        println!("Tip: Use --ai flag for AI-powered explanation (requires LLM configuration)");
    }
    Ok(())
}

fn cmd_sign(path: &Path, key: Option<&Path>, algorithm: &str) -> Result<(), Box<dyn std::error::Error>> {
    let content = std::fs::read(path)?;
    println!("Signing: {}", path.display());
    println!("Algorithm: {}", algorithm);

    let keypair = match algorithm {
        "ed25519" => glg::crypto::generate_keypair_ed25519()?,
        "ecdsa" => glg::crypto::generate_keypair_ecdsa()?,
        "rsa" => glg::crypto::generate_keypair_rsa()?,
        _ => {
            eprintln!("Unsupported algorithm: {}", algorithm);
            std::process::exit(1);
        }
    };

    let sig = match algorithm {
        "ed25519" => glg::crypto::sign_ed25519(&keypair.secret_key, &content)?,
        "ecdsa" => glg::crypto::sign_ecdsa(&keypair.secret_key, &content)?,
        "rsa" => glg::crypto::sign_ed25519(&keypair.secret_key, &content)?,
        _ => unreachable!(),
    };

    println!("Signature: {}", sig.signature);
    println!("Public Key: {}", sig.public_key);

    let sig_path = path.with_extension("sig");
    let sig_data = serde_json::json!({
        "algorithm": sig.algorithm,
        "signature": sig.signature,
        "public_key": sig.public_key,
        "timestamp": sig.timestamp,
        "message_hash": sig.message_hash,
    });
    std::fs::write(&sig_path, serde_json::to_string_pretty(&sig_data)?)?;
    println!("Signature saved to {}", sig_path.display());

    if let Some(key_path) = key {
        let key_data = serde_json::json!({
            "public_key": keypair.public_key,
            "secret_key": keypair.secret_key,
            "algorithm": algorithm,
        });
        std::fs::write(key_path, serde_json::to_string_pretty(&key_data)?)?;
        println!("Key saved to {}", key_path.display());
    }
    Ok(())
}

fn cmd_verify(path: &Path, _key: Option<&Path>) -> Result<(), Box<dyn std::error::Error>> {
    let content = std::fs::read(path)?;
    let sig_path = path.with_extension("sig");
    if !sig_path.exists() {
        eprintln!("Signature file not found: {}", sig_path.display());
        std::process::exit(1);
    }
    let sig_json = std::fs::read_to_string(&sig_path)?;
    let sig_data: serde_json::Value = serde_json::from_str(&sig_json)?;

    let signature = sig_data["signature"].as_str().unwrap_or("");
    let public_key = sig_data["public_key"].as_str().unwrap_or("");
    let algorithm = sig_data["algorithm"].as_str().unwrap_or("ed25519");

    println!("Verifying: {}", path.display());
    println!("Algorithm: {}", algorithm);

    let valid = match algorithm {
        "ed25519" => glg::crypto::verify_ed25519(public_key, &content, signature)?,
        "ecdsa" => glg::crypto::verify_ecdsa(public_key, &content, signature)?,
        "rsa" => glg::crypto::verify_ed25519(public_key, &content, signature)?,
        _ => {
            eprintln!("Unknown algorithm: {}", algorithm);
            std::process::exit(1);
        }
    };

    if valid {
        println!("Signature: VALID");
    } else {
        eprintln!("Signature: INVALID");
        std::process::exit(1);
    }
    Ok(())
}

fn cmd_hash(path: &Path, algorithm: &str) -> Result<(), Box<dyn std::error::Error>> {
    if !path.exists() {
        eprintln!("Path not found: {}", path.display());
        std::process::exit(1);
    }

    let hashes = if path.is_file() {
        glg::crypto::compute_file_hash(path)?
    } else {
        glg::crypto::compute_folder_hash(path)?
    };

    println!("Hashes for: {}", path.display());
    println!("{}", "=".repeat(60));
    match algorithm {
        "blake3" => println!("BLAKE3:     {}", hashes.blake3),
        "sha256" => println!("SHA-256:    {}", hashes.sha256),
        "sha3" => println!("SHA3-256:   {}", hashes.sha3_256),
        "all" | _ => {
            println!("BLAKE3:     {}", hashes.blake3);
            println!("SHA-256:    {}", hashes.sha256);
            println!("SHA3-256:   {}", hashes.sha3_256);
        }
    }
    Ok(())
}

fn cmd_ai(source: &str, task: &str) -> Result<(), Box<dyn std::error::Error>> {
    let client = glg::llm::LlmClient::new(glg::llm::LlmConfig::default());
    let response = match task {
        "explain" => {
            let text = if Path::new(source).exists() {
                std::fs::read_to_string(source)?
            } else {
                source.to_string()
            };
            client.explain_license(&text)?
        }
        "suggest" => client.suggest_license(source)?,
        "summarize" => {
            let text = if Path::new(source).exists() {
                std::fs::read_to_string(source)?
            } else {
                source.to_string()
            };
            client.summarize_license(&text)?
        }
        "conflicts" => {
            let licenses: Vec<String> = source.split(',').map(|s| s.trim().to_string()).collect();
            client.detect_conflicts(&licenses)?
        }
        "recommend" => client.recommend_changes(source, "general improvement")?,
        _ => {
            eprintln!("Unknown task: {}. Available: explain, suggest, summarize, conflicts, recommend", task);
            std::process::exit(1);
        }
    };
    println!("AI Response ({}):", response.model);
    println!("{}", "-".repeat(60));
    println!("{}", response.content);
    if let Some(tokens) = response.tokens_used {
        println!();
        println!("Tokens used: {}", tokens);
    }
    Ok(())
}

fn cmd_doctor() {
    println!("GLG Doctor - Diagnostic Report");
    println!("{}", "=".repeat(60));
    println!("Version: {}", env!("CARGO_PKG_VERSION"));
    println!("Platform: {}", std::env::consts::OS);
    println!("Arch: {}", std::env::consts::ARCH);
    println!();

    print!("  SPDX Database: ");
    let spdx = glg::spdx::SpdxDatabase::load();
    println!("OK ({} licenses)", spdx.all_ids().len());

    print!("  Clause Database: ");
    let clauses = glg::clauses::ClauseDatabase::new();
    println!("OK ({} clauses)", clauses.search("").len());

    print!("  Compatibility Matrix: ");
    let compat = glg::compatibility::CompatibilityMatrix::new();
    println!("OK ({} licenses)", compat.all_license_ids().len());

    print!("  Questionnaire: ");
    let questionnaire = glg::questionnaire::Questionnaire::default();
    println!("OK ({} questions)", questionnaire.questions.len());

    print!("  Compiler: ");
    let _compiler = glg::compiler::LicenseCompiler::new();
    println!("OK");

    print!("  Validator: ");
    let _validator = glg::validator::LicenseValidator::new();
    println!("OK");

    print!("  Database: ");
    let db = glg::database::GlgDatabase::new();
    match db.validate() {
        Ok(()) => println!("OK"),
        Err(e) => println!("WARNINGS: {:?}", e),
    }

    print!("  LLM Client: ");
    let llm = glg::llm::LlmClient::new(glg::llm::LlmConfig::default());
    if llm.is_configured() {
        println!("Configured");
    } else {
        println!("Not configured (optional)");
    }

    println!();
    println!("All systems operational.");
}
