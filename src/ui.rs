use axum::{
    Json,
    Router,
    extract::{Query, State},
    http::{Method, StatusCode},
    routing::{get, post},
};
use parking_lot::RwLock;
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};

#[derive(Debug, Clone, serde::Deserialize)]
pub struct ExportRequest {
    pub license: super::license::License,
    pub format: String,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct CompatibilityQuery {
    pub license_a: String,
    pub license_b: String,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct SearchQuery {
    pub q: String,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct ExplainRequest {
    pub license_text: String,
}

#[derive(Clone)]
pub struct AppState {
    pub compiler: Arc<RwLock<super::compiler::LicenseCompiler>>,
    pub questionnaire: Arc<RwLock<super::questionnaire::Questionnaire>>,
    pub database: Arc<RwLock<super::database::GlgDatabase>>,
    pub llm_client: Arc<RwLock<super::llm::LlmClient>>,
    pub validator: Arc<RwLock<super::validator::LicenseValidator>>,
}

async fn serve_index() -> (StatusCode, [(&'static str, &'static str); 2], &'static str) {
    (StatusCode::OK, [("content-type", "text/html; charset=utf-8"), ("cache-control", "no-cache")], super::html::get_index_html())
}

async fn serve_css() -> (StatusCode, [(&'static str, &'static str); 2], &'static str) {
    (StatusCode::OK, [("content-type", "text/css; charset=utf-8"), ("cache-control", "public, max-age=3600")], super::html::get_style_css())
}

async fn serve_js() -> (StatusCode, [(&'static str, &'static str); 2], &'static str) {
    (StatusCode::OK, [("content-type", "application/javascript; charset=utf-8"), ("cache-control", "public, max-age=3600")], super::html::get_app_js())
}

async fn not_found() -> (StatusCode, Json<serde_json::Value>) {
    (StatusCode::NOT_FOUND, Json(serde_json::json!({"error": "not_found", "message": "The requested resource was not found"})))
}

async fn health_handler() -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "status": "healthy",
        "version": env!("CARGO_PKG_VERSION"),
        "service": "glg-web-ui"
    }))
}

async fn get_questionnaire_handler(State(state): State<AppState>) -> Json<serde_json::Value> {
    let questionnaire = state.questionnaire.read();
    match serde_json::to_value(&*questionnaire) {
        Ok(val) => Json(val),
        Err(e) => Json(serde_json::json!({"error": "serialization_error", "message": format!("Failed to serialize questionnaire: {}", e)})),
    }
}

async fn compile_handler(
    State(state): State<AppState>,
    Json(request): Json<super::license::LicenseRequest>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let compiler = state.compiler.read();
    match compiler.compile(&request) {
        Ok(result) => match serde_json::to_value(&result) {
            Ok(val) => Ok(Json(val)),
            Err(e) => {
                eprintln!("Serialization error during compile: {}", e);
                Err(StatusCode::INTERNAL_SERVER_ERROR)
            }
        },
        Err(e) => {
            eprintln!("Compilation failed: {}", e);
            Err(StatusCode::UNPROCESSABLE_ENTITY)
        }
    }
}

async fn validate_handler(
    State(state): State<AppState>,
    Json(license): Json<super::license::License>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let validator = state.validator.read();
    let result = validator.validate_license(&license);
    match serde_json::to_value(&result) {
        Ok(val) => Ok(Json(val)),
        Err(e) => {
            eprintln!("Serialization error during validation: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

async fn export_handler(
    State(_state): State<AppState>,
    Json(req): Json<ExportRequest>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let format = match req.format.as_str() {
        "plain_text" => super::export::ExportFormat::PlainText,
        "markdown" => super::export::ExportFormat::Markdown,
        "html" => super::export::ExportFormat::Html,
        "json" => super::export::ExportFormat::Json,
        "yaml" => super::export::ExportFormat::Yaml,
        "toml" => super::export::ExportFormat::Toml,
        "xml" => super::export::ExportFormat::Xml,
        "spdx" => super::export::ExportFormat::Spdx,
        "cyclonedx" => super::export::ExportFormat::CycloneDX,
        "pdf" => super::export::ExportFormat::Pdf,
        _ => super::export::ExportFormat::PlainText,
    };
    let options = super::export::ExportOptions {
        format,
        output_path: None,
        include_notice: true,
        include_copying: true,
        include_summary: true,
        include_ai_summary: false,
        include_qr_code: false,
        pretty_print: true,
    };
    match super::export::export_license(&req.license, &options) {
        Ok(result) => match serde_json::to_value(&result) {
            Ok(val) => Ok(Json(val)),
            Err(e) => {
                eprintln!("Serialization error during export: {}", e);
                Err(StatusCode::INTERNAL_SERVER_ERROR)
            }
        },
        Err(e) => {
            eprintln!("Export error: {}", e);
            Err(StatusCode::UNPROCESSABLE_ENTITY)
        }
    }
}

async fn compatibility_handler(Query(params): Query<CompatibilityQuery>) -> Json<serde_json::Value> {
    let db = super::database::GlgDatabase::new();
    let result = db.compatibility.explain(&params.license_a, &params.license_b);
    match serde_json::to_value(&result) {
        Ok(val) => Json(val),
        Err(e) => Json(serde_json::json!({"error": "serialization_error", "message": format!("Failed to serialize: {}", e)})),
    }
}

async fn search_handler(Query(params): Query<SearchQuery>) -> Json<serde_json::Value> {
    let db = super::database::GlgDatabase::new();
    let results = db.search_all(&params.q);
    match serde_json::to_value(&results) {
        Ok(val) => Json(val),
        Err(e) => Json(serde_json::json!({"error": "serialization_error", "message": format!("Failed to serialize: {}", e)})),
    }
}

async fn explain_handler(
    State(state): State<AppState>,
    Json(req): Json<ExplainRequest>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let llm = state.llm_client.read();
    match llm.explain_license(&req.license_text) {
        Ok(response) => match serde_json::to_value(&response) {
            Ok(val) => Ok(Json(val)),
            Err(e) => {
                eprintln!("Serialization error during explain: {}", e);
                Err(StatusCode::INTERNAL_SERVER_ERROR)
            }
        },
        Err(e) => {
            eprintln!("LLM error: {}", e);
            Err(StatusCode::SERVICE_UNAVAILABLE)
        }
    }
}

async fn export_all_handler(
    State(_state): State<AppState>,
    Json(request): Json<super::license::LicenseRequest>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let compiler = super::compiler::LicenseCompiler::new();
    let license = match compiler.compile(&request) {
        Ok(result) => result.license,
        Err(e) => {
            eprintln!("Compilation failed for export_all: {}", e);
            return Err(StatusCode::UNPROCESSABLE_ENTITY);
        }
    };
    let output = match super::license::LicenseOutput::generate_all(&license) {
        Ok(o) => o,
        Err(e) => {
            eprintln!("Failed to generate all outputs: {}", e);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };
    match serde_json::to_value(&output) {
        Ok(val) => Ok(Json(val)),
        Err(e) => {
            eprintln!("Serialization error during export_all: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub fn build_router(state: AppState) -> Router {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers(Any);
    let api_routes = Router::new()
        .route("/health", get(health_handler))
        .route("/questionnaire", get(get_questionnaire_handler))
        .route("/compile", post(compile_handler))
        .route("/validate", post(validate_handler))
        .route("/export", post(export_handler))
        .route("/compatibility", get(compatibility_handler))
        .route("/search", get(search_handler))
        .route("/explain", post(explain_handler))
        .route("/export_all", post(export_all_handler))
        .with_state(state);
    Router::new()
        .route("/", get(serve_index))
        .route("/style.css", get(serve_css))
        .route("/app.js", get(serve_js))
        .nest("/api", api_routes)
        .fallback(not_found)
        .layer(cors)
}

pub async fn serve(addr: &str, state: AppState) -> Result<(), Box<dyn std::error::Error>> {
    let listener = tokio::net::TcpListener::bind(addr).await?;
    let router = build_router(state);
    eprintln!("GLG Web UI serving on http://{}", addr);
    axum::serve(listener, router).await?;
    Ok(())
}
