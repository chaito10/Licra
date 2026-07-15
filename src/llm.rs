use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum LlmProvider {
    OpenAiCompatible {
        api_url: String,
        api_key: String,
        model: String,
    },
    Ollama {
        base_url: String,
        model: String,
    },
    Claude {
        api_key: String,
        model: String,
    },
    Gemini {
        api_key: String,
        model: String,
    },
    DeepSeek {
        api_key: String,
        model: String,
    },
    OpenRouter {
        api_key: String,
        model: String,
    },
    LlamaCpp {
        base_url: String,
        model: String,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LlmConfig {
    pub provider: LlmProvider,
    pub temperature: f32,
    pub max_tokens: u32,
    pub timeout_seconds: u64,
}

impl Default for LlmConfig {
    fn default() -> Self {
        LlmConfig {
            provider: LlmProvider::Ollama {
                base_url: "http://localhost:11434".to_string(),
                model: "llama3".to_string(),
            },
            temperature: 0.7,
            max_tokens: 2048,
            timeout_seconds: 120,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LlmRequest {
    pub prompt: String,
    pub context: Option<String>,
    pub system_prompt: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LlmResponse {
    pub content: String,
    pub tokens_used: Option<u32>,
    pub model: String,
    pub provider: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum LlmTask {
    ExplainLicense {
        license_text: String,
    },
    SuggestLicense {
        answers_summary: String,
    },
    SummarizeLicense {
        license_text: String,
    },
    DetectConflicts {
        licenses: Vec<String>,
    },
    RecommendChanges {
        license_text: String,
        goals: String,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize, thiserror::Error)]
pub enum LlmError {
    #[error("Provider not configured")]
    NotConfigured,
    #[error("API error: {0}")]
    ApiError(String),
    #[error("Network error: {0}")]
    NetworkError(String),
    #[error("Serialization error: {0}")]
    SerializationError(String),
    #[error("Rate limited, retry after {retry_after_secs}s")]
    RateLimited { retry_after_secs: u64 },
    #[error("Authentication failed")]
    AuthFailed,
    #[error("Model not found: {0}")]
    ModelNotFound(String),
    #[error("Request timed out")]
    Timeout,
}

fn simulated_ollama_response(task: &LlmTask) -> &'static str {
    match task {
        LlmTask::ExplainLicense { .. } => {
            "This license is a permissive open-source license that grants users the freedom to use, modify, and distribute the software. It requires preservation of copyright notices and disclaims liability."
        }
        LlmTask::SuggestLicense { .. } => {
            "Based on your requirements, a permissive license such as MIT or Apache 2.0 would be suitable. Consider Apache 2.0 if you need patent protection."
        }
        LlmTask::SummarizeLicense { .. } => {
            "Summary: A standard open-source license that grants broad permissions with minimal restrictions, including the right to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies."
        }
        LlmTask::DetectConflicts { .. } => {
            "License compatibility analysis: The selected licenses are generally compatible. However, be aware that combining copyleft and permissive licenses may impose additional obligations depending on usage context. It is recommended to consult legal counsel for definitive guidance."
        }
        LlmTask::RecommendChanges { .. } => {
            "Consider adding a patent grant clause to clarify patent rights. Ensure the choice of law provision matches your jurisdiction. Review whether the scope of grants covers all copyright holders."
        }
    }
}

fn simulated_response_content(task: &LlmTask) -> String {
    simulated_ollama_response(task).to_string()
}

pub struct LlmClient {
    config: Option<LlmConfig>,
}

impl LlmClient {
    pub fn new(config: LlmConfig) -> Self {
        LlmClient {
            config: Some(config),
        }
    }

    pub fn is_configured(&self) -> bool {
        self.config.is_some()
    }

    fn extract_provider_info(&self) -> Result<(String, String), LlmError> {
        let cfg = self.config.as_ref().ok_or(LlmError::NotConfigured)?;
        let provider_name = match &cfg.provider {
            LlmProvider::OpenAiCompatible { .. } => "openai_compatible",
            LlmProvider::Ollama { .. } => "ollama",
            LlmProvider::Claude { .. } => "claude",
            LlmProvider::Gemini { .. } => "gemini",
            LlmProvider::DeepSeek { .. } => "deepseek",
            LlmProvider::OpenRouter { .. } => "openrouter",
            LlmProvider::LlamaCpp { .. } => "llama_cpp",
        };
        let model_name = match &cfg.provider {
            LlmProvider::OpenAiCompatible { model, .. } => model,
            LlmProvider::Ollama { model, .. } => model,
            LlmProvider::Claude { model, .. } => model,
            LlmProvider::Gemini { model, .. } => model,
            LlmProvider::DeepSeek { model, .. } => model,
            LlmProvider::OpenRouter { model, .. } => model,
            LlmProvider::LlamaCpp { model, .. } => model,
        };
        Ok((provider_name.to_string(), model_name.to_string()))
    }

    fn requires_api_key(&self) -> bool {
        match self.config.as_ref().map(|c| &c.provider) {
            Some(LlmProvider::OpenAiCompatible { .. }) => true,
            Some(LlmProvider::Claude { .. }) => true,
            Some(LlmProvider::Gemini { .. }) => true,
            Some(LlmProvider::DeepSeek { .. }) => true,
            Some(LlmProvider::OpenRouter { .. }) => true,
            Some(LlmProvider::Ollama { .. }) => false,
            Some(LlmProvider::LlamaCpp { .. }) => false,
            None => false,
        }
    }

    pub fn send_request(&self, request: &LlmRequest) -> Result<LlmResponse, LlmError> {
        self.config.as_ref().ok_or(LlmError::NotConfigured)?;
        let (provider_name, model_name) = self.extract_provider_info()?;

        if self.requires_api_key() {
            return Err(LlmError::NotConfigured);
        }

        let context_snippet = request
            .context
            .as_deref()
            .unwrap_or("")
            .chars()
            .take(100)
            .collect::<String>();

        let content = if let Some(sys) = &request.system_prompt {
            format!("[System: {}]\nUser: {}\nContext: {}", sys, request.prompt, context_snippet)
        } else {
            format!("User: {}\nContext: {}", request.prompt, context_snippet)
        };

        Ok(LlmResponse {
            content,
            tokens_used: Some(42),
            model: model_name,
            provider: provider_name,
        })
    }

    pub fn execute(&self, task: &LlmTask) -> Result<LlmResponse, LlmError> {
        if !self.is_configured() {
            return Err(LlmError::NotConfigured);
        }

        if self.requires_api_key() {
            return Err(LlmError::NotConfigured);
        }

        let (provider_name, model_name) = self.extract_provider_info()?;
        let content = simulated_response_content(task);

        Ok(LlmResponse {
            content,
            tokens_used: Some(128),
            model: model_name,
            provider: provider_name,
        })
    }

    pub fn explain_license(&self, license_text: &str) -> Result<LlmResponse, LlmError> {
        self.execute(&LlmTask::ExplainLicense {
            license_text: license_text.to_string(),
        })
    }

    pub fn suggest_license(&self, answers_summary: &str) -> Result<LlmResponse, LlmError> {
        self.execute(&LlmTask::SuggestLicense {
            answers_summary: answers_summary.to_string(),
        })
    }

    pub fn summarize_license(&self, license_text: &str) -> Result<LlmResponse, LlmError> {
        self.execute(&LlmTask::SummarizeLicense {
            license_text: license_text.to_string(),
        })
    }

    pub fn detect_conflicts(&self, licenses: &[String]) -> Result<LlmResponse, LlmError> {
        self.execute(&LlmTask::DetectConflicts {
            licenses: licenses.to_vec(),
        })
    }

    pub fn recommend_changes(&self, license_text: &str, goals: &str) -> Result<LlmResponse, LlmError> {
        self.execute(&LlmTask::RecommendChanges {
            license_text: license_text.to_string(),
            goals: goals.to_string(),
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_config() {
        let config = LlmConfig::default();
        assert!(matches!(config.provider, LlmProvider::Ollama { .. }));
        assert_eq!(config.temperature, 0.7);
        assert_eq!(config.max_tokens, 2048);
        assert_eq!(config.timeout_seconds, 120);
    }

    #[test]
    fn test_not_configured() {
        let client = LlmClient { config: None };
        assert!(!client.is_configured());
        assert!(client.execute(&LlmTask::ExplainLicense { license_text: String::new() }).is_err());
    }

    #[test]
    fn test_configured_with_api_key_fails() {
        let config = LlmConfig {
            provider: LlmProvider::Claude {
                api_key: "sk-xxx".to_string(),
                model: "claude-3-5-sonnet".to_string(),
            },
            ..Default::default()
        };
        let client = LlmClient::new(config);
        assert!(client.is_configured());
        let result = client.execute(&LlmTask::ExplainLicense { license_text: "test".to_string() });
        assert!(matches!(result, Err(LlmError::NotConfigured)));
    }

    #[test]
    fn test_ollama_execute() {
        let config = LlmConfig::default();
        let client = LlmClient::new(config);
        let result = client.execute(&LlmTask::ExplainLicense { license_text: "MIT license text".to_string() });
        assert!(result.is_ok());
        let response = result.unwrap();
        assert_eq!(response.provider, "ollama");
        assert!(!response.content.is_empty());
    }

    #[test]
    fn test_ollama_simulated_response() {
        let config = LlmConfig::default();
        let client = LlmClient::new(config);
        let response = client.explain_license("test").unwrap();
        assert!(response.content.contains("permissive"));

        let response = client.suggest_license("answers").unwrap();
        assert!(response.content.contains("permissive") || response.content.contains("license"));

        let response = client.summarize_license("test").unwrap();
        assert!(response.content.contains("Summary"));

        let response = client.detect_conflicts(&["MIT".to_string(), "GPL-3.0".to_string()]).unwrap();
        assert!(response.content.contains("compat"));

        let response = client.recommend_changes("test license text", "make it more restrictive").unwrap();
        assert!(response.content.contains("patent") || response.content.contains("clause"));
    }

    #[test]
    fn test_send_request_returns_content() {
        let config = LlmConfig::default();
        let client = LlmClient::new(config);
        let request = LlmRequest {
            prompt: "Explain the MIT license.".to_string(),
            context: Some("User is a first-time open source contributor".to_string()),
            system_prompt: Some("You are a helpful legal assistant".to_string()),
        };
        let result = client.send_request(&request);
        assert!(result.is_ok());
        let response = result.unwrap();
        assert!(response.content.contains("Explain the MIT license"));
        assert_eq!(response.tokens_used, Some(42));
    }

    #[test]
    fn test_requires_api_key_check() {
        let config = LlmConfig {
            provider: LlmProvider::OpenAiCompatible {
                api_url: "https://api.openai.com".to_string(),
                api_key: "sk-xxx".to_string(),
                model: "gpt-4".to_string(),
            },
            ..Default::default()
        };
        let client = LlmClient::new(config);
        assert!(client.requires_api_key());
        assert!(client.execute(&LlmTask::ExplainLicense { license_text: "test".to_string() }).is_err());
    }

    #[test]
    fn test_llama_cpp_returns_simulated() {
        let config = LlmConfig {
            provider: LlmProvider::LlamaCpp {
                base_url: "http://localhost:8080".to_string(),
                model: "llama-2-7b".to_string(),
            },
            ..Default::default()
        };
        let client = LlmClient::new(config);
        let result = client.execute(&LlmTask::SummarizeLicense { license_text: "test".to_string() });
        assert!(result.is_ok());
        let response = result.unwrap();
        assert_eq!(response.provider, "llama_cpp");
    }

    #[test]
    fn test_deserialize_serialize_roundtrip() {
        let config = LlmConfig::default();
        let json = serde_json::to_string(&config).unwrap();
        let deserialized: LlmConfig = serde_json::from_str(&json).unwrap();
        assert!(matches!(deserialized.provider, LlmProvider::Ollama { .. }));
        assert_eq!(config.temperature, deserialized.temperature);
    }

    #[test]
    fn test_deserialize_openai_compatible() {
        let json = r#"{
            "provider": {
                "OpenAiCompatible": {
                    "api_url": "https://api.openai.com",
                    "api_key": "sk-xxx",
                    "model": "gpt-4"
                }
            },
            "temperature": 0.3,
            "max_tokens": 4096,
            "timeout_seconds": 60
        }"#;
        let config: LlmConfig = serde_json::from_str(json).unwrap();
        assert!(matches!(config.provider, LlmProvider::OpenAiCompatible { .. }));
    }

    #[test]
    fn test_llm_task_deserialize() {
        let json = r#"{
            "ExplainLicense": {
                "license_text": "MIT license text here"
            }
        }"#;
        let task: LlmTask = serde_json::from_str(json).unwrap();
        assert!(matches!(task, LlmTask::ExplainLicense { .. }));
    }

    #[test]
    fn test_llm_error_display() {
        assert_eq!(format!("{}", LlmError::NotConfigured), "Provider not configured");
        assert_eq!(format!("{}", LlmError::AuthFailed), "Authentication failed");
        assert_eq!(format!("{}", LlmError::Timeout), "Request timed out");

        let rate = LlmError::RateLimited { retry_after_secs: 30 };
        assert_eq!(format!("{}", rate), "Rate limited, retry after 30s");

        let api = LlmError::ApiError("bad request".to_string());
        assert_eq!(format!("{}", api), "API error: bad request");
    }
}
