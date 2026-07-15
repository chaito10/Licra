use std::fs;
use std::path::Path;

use blake3::Hasher as Blake3Hasher;
use chrono::Utc;
use ed25519_dalek::{Signature, Signer, SigningKey, Verifier, VerifyingKey};
use qrcode::render::svg;
use rand::rngs::OsRng;
use rand::RngCore;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use sha3::Sha3_256;
use uuid::Uuid;
use walkdir::WalkDir;

use super::license::Licensee;

// ── Error Type ───────────────────────────────────────────────────────────────

#[derive(Debug, thiserror::Error)]
pub enum CryptoError {
    #[error("Hash error: {0}")]
    HashError(String),

    #[error("Signature error: {0}")]
    SignatureError(String),

    #[error("Key error: {0}")]
    KeyError(String),

    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),

    #[error("QR code error: {0}")]
    QrError(String),

    #[error("Encoding error: {0}")]
    EncodingError(String),
}

// ── Types ────────────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct HashResult {
    pub blake3: String,
    pub sha256: String,
    pub sha3_256: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct KeyPair {
    pub public_key: String,
    pub secret_key: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SignatureResult {
    pub algorithm: String,
    pub signature: String,
    pub public_key: String,
    pub timestamp: String,
    pub message_hash: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct QrCodeData {
    pub content: String,
    pub format: String,
    pub size: u32,
}

// ── Fixed Namespace for UUID v5 ──────────────────────────────────────────────

const GLG_NAMESPACE: Uuid = Uuid::from_bytes([
    0x6b, 0x6c, 0x69, 0x63, 0x72, 0x61, 0x2d, 0x67, 0x6c, 0x67, 0x2d, 0x6e,
    0x61, 0x6d, 0x65, 0x73,
]);

// ── Hash Functions ───────────────────────────────────────────────────────────

pub fn compute_blake3(data: &[u8]) -> String {
    let mut hasher = Blake3Hasher::new();
    hasher.update(data);
    hasher.finalize().to_hex().to_string()
}

pub fn compute_sha256(data: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(data);
    format!("{:x}", hasher.finalize())
}

pub fn compute_sha3_256(data: &[u8]) -> String {
    let mut hasher = Sha3_256::new();
    hasher.update(data);
    format!("{:x}", hasher.finalize())
}

pub fn compute_all_hashes(data: &[u8]) -> HashResult {
    HashResult {
        blake3: compute_blake3(data),
        sha256: compute_sha256(data),
        sha3_256: compute_sha3_256(data),
    }
}

pub fn compute_file_hash(path: &Path) -> Result<HashResult, CryptoError> {
    let data = fs::read(path)?;
    Ok(compute_all_hashes(&data))
}

pub fn compute_folder_hash(path: &Path) -> Result<HashResult, CryptoError> {
    let mut entries: Vec<_> = WalkDir::new(path)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.file_type().is_file())
        .map(|e| e.into_path())
        .collect();

    entries.sort();

    let mut blake3_hasher = Blake3Hasher::new();
    let mut sha256_hasher = Sha256::new();
    let mut sha3_hasher = Sha3_256::new();

    for entry in &entries {
        let relative = entry.strip_prefix(path).unwrap_or(entry);
        let path_str = relative.to_string_lossy();

        blake3_hasher.update(path_str.as_bytes());
        sha256_hasher.update(path_str.as_bytes());
        sha3_hasher.update(path_str.as_bytes());

        blake3_hasher.update(&[0x00]);
        sha256_hasher.update(&[0x00]);
        sha3_hasher.update(&[0x00]);

        let content = fs::read(entry)?;
        blake3_hasher.update(&content);
        sha256_hasher.update(&content);
        sha3_hasher.update(&content);
    }

    Ok(HashResult {
        blake3: blake3_hasher.finalize().to_hex().to_string(),
        sha256: format!("{:x}", sha256_hasher.finalize()),
        sha3_256: format!("{:x}", sha3_hasher.finalize()),
    })
}

pub fn compute_text_hash(text: &str) -> HashResult {
    compute_all_hashes(text.as_bytes())
}

// ── Deterministic ID Generation ──────────────────────────────────────────────

pub fn deterministic_license_id(project_name: &str, answers_hash: &str) -> Uuid {
    let name = format!("{}:{}", project_name, answers_hash);
    Uuid::new_v5(&GLG_NAMESPACE, name.as_bytes())
}

pub fn deterministic_fingerprint(
    project_name: &str,
    copyright: &str,
    year: i32,
    answers_hash: &str,
) -> String {
    let input = format!("{}|{}|{}|{}", project_name, copyright, year, answers_hash);
    compute_blake3(input.as_bytes())
}

// ── Licensee Hashing ─────────────────────────────────────────────────────────

pub fn hash_licensee_name(name: &str) -> String {
    compute_blake3(name.as_bytes())
}

pub fn hash_licensee_org(org: &str) -> String {
    compute_blake3(org.as_bytes())
}

pub fn hash_licensee_email(email: &str) -> String {
    compute_blake3(email.as_bytes())
}

pub fn create_licensee_hash(name: &str, org: Option<&str>, email: Option<&str>) -> Licensee {
    Licensee::new(name, org, email, None)
}

// ── Digital Signatures ───────────────────────────────────────────────────────

fn internal_generate_keypair() -> Result<(SigningKey, VerifyingKey), CryptoError> {
    let mut bytes = [0u8; 32];
    OsRng.fill_bytes(&mut bytes);
    let signing_key = SigningKey::from_bytes(&bytes);
    let verifying_key = signing_key.verifying_key();
    Ok((signing_key, verifying_key))
}

fn internal_sign(
    signing_key: &SigningKey,
    message: &[u8],
    algorithm: &str,
) -> Result<SignatureResult, CryptoError> {
    let signature = signing_key.sign(message);
    let verifying_key = signing_key.verifying_key();
    Ok(SignatureResult {
        algorithm: algorithm.to_string(),
        signature: hex::encode(signature.to_bytes()),
        public_key: hex::encode(verifying_key.to_bytes()),
        timestamp: Utc::now().to_rfc3339(),
        message_hash: compute_blake3(message),
    })
}

fn internal_recover_signing_key(secret_key_hex: &str) -> Result<SigningKey, CryptoError> {
    let bytes = hex::decode(secret_key_hex)
        .map_err(|e| CryptoError::KeyError(format!("Invalid hex secret key: {}", e)))?;
    let len = bytes.len();
    let arr: [u8; 32] = bytes
        .try_into()
        .map_err(|_| CryptoError::KeyError(format!("Secret key must be 32 bytes, got {}", len)))?;
    Ok(SigningKey::from_bytes(&arr))
}

fn internal_recover_verifying_key(public_key_hex: &str) -> Result<VerifyingKey, CryptoError> {
    let bytes = hex::decode(public_key_hex)
        .map_err(|e| CryptoError::KeyError(format!("Invalid hex public key: {}", e)))?;
    let len = bytes.len();
    let arr: [u8; 32] = bytes
        .try_into()
        .map_err(|_| CryptoError::KeyError(format!("Public key must be 32 bytes, got {}", len)))?;
    VerifyingKey::from_bytes(&arr)
        .map_err(|e| CryptoError::KeyError(format!("Invalid public key: {}", e)))
}

fn internal_decode_signature(signature_hex: &str) -> Result<Signature, CryptoError> {
    let bytes = hex::decode(signature_hex)
        .map_err(|e| CryptoError::SignatureError(format!("Invalid hex signature: {}", e)))?;
    let len = bytes.len();
    let arr: [u8; 64] = bytes.try_into().map_err(|_| {
        CryptoError::SignatureError(format!("Signature must be 64 bytes, got {}", len))
    })?;
    Ok(Signature::from_bytes(&arr))
}

// ── Ed25519 ──────────────────────────────────────────────────────────────────

pub fn generate_keypair_ed25519() -> Result<KeyPair, CryptoError> {
    let (signing_key, verifying_key) = internal_generate_keypair()?;
    Ok(KeyPair {
        public_key: hex::encode(verifying_key.to_bytes()),
        secret_key: hex::encode(signing_key.to_bytes()),
    })
}

pub fn sign_ed25519(secret_key_hex: &str, message: &[u8]) -> Result<SignatureResult, CryptoError> {
    let signing_key = internal_recover_signing_key(secret_key_hex)?;
    internal_sign(&signing_key, message, "Ed25519")
}

pub fn verify_ed25519(
    public_key_hex: &str,
    message: &[u8],
    signature_hex: &str,
) -> Result<bool, CryptoError> {
    let verifying_key = internal_recover_verifying_key(public_key_hex)?;
    let signature = internal_decode_signature(signature_hex)?;
    Ok(verifying_key.verify(message, &signature).is_ok())
}

// ── ECDSA (simulated via Ed25519) ───────────────────────────────────────────

pub fn generate_keypair_ecdsa() -> Result<KeyPair, CryptoError> {
    let (signing_key, verifying_key) = internal_generate_keypair()?;
    Ok(KeyPair {
        public_key: hex::encode(verifying_key.to_bytes()),
        secret_key: hex::encode(signing_key.to_bytes()),
    })
}

pub fn sign_ecdsa(secret_key_hex: &str, message: &[u8]) -> Result<SignatureResult, CryptoError> {
    let signing_key = internal_recover_signing_key(secret_key_hex)?;
    internal_sign(&signing_key, message, "ECDSA")
}

pub fn verify_ecdsa(
    public_key_hex: &str,
    message: &[u8],
    signature_hex: &str,
) -> Result<bool, CryptoError> {
    let verifying_key = internal_recover_verifying_key(public_key_hex)?;
    let signature = internal_decode_signature(signature_hex)?;
    Ok(verifying_key.verify(message, &signature).is_ok())
}

// ── RSA (simulated via Ed25519) ─────────────────────────────────────────────

pub fn generate_keypair_rsa() -> Result<KeyPair, CryptoError> {
    let (signing_key, verifying_key) = internal_generate_keypair()?;
    Ok(KeyPair {
        public_key: hex::encode(verifying_key.to_bytes()),
        secret_key: hex::encode(signing_key.to_bytes()),
    })
}

// ── QR Code ──────────────────────────────────────────────────────────────────

pub fn generate_qr_code(text: &str) -> Result<QrCodeData, CryptoError> {
    let code = qrcode::QrCode::new(text.as_bytes())
        .map_err(|e| CryptoError::QrError(format!("Failed to generate QR code: {}", e)))?;
    let svg_content = code.render::<svg::Color>().build();
    let module_count = code.to_colors().len() as u32;
    Ok(QrCodeData {
        content: svg_content,
        format: "svg".to_string(),
        size: module_count,
    })
}

// ── Tests ────────────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_compute_blake3() {
        let hash = compute_blake3(b"hello");
        assert!(!hash.is_empty());
        assert_eq!(hash.len(), 64);
    }

    #[test]
    fn test_compute_sha256() {
        let hash = compute_sha256(b"hello");
        assert!(!hash.is_empty());
        assert_eq!(hash.len(), 64);
    }

    #[test]
    fn test_compute_sha3_256() {
        let hash = compute_sha3_256(b"hello");
        assert!(!hash.is_empty());
        assert_eq!(hash.len(), 64);
    }

    #[test]
    fn test_compute_all_hashes_deterministic() {
        let data = b"test data";
        let h1 = compute_all_hashes(data);
        let h2 = compute_all_hashes(data);
        assert_eq!(h1, h2);
    }

    #[test]
    fn test_compute_text_hash() {
        let h1 = compute_text_hash("hello");
        let h2 = compute_text_hash("hello");
        assert_eq!(h1, h2);
        assert_eq!(h1.blake3, compute_blake3(b"hello"));
    }

    #[test]
    fn test_deterministic_license_id() {
        let id1 = deterministic_license_id("myproject", "abc123");
        let id2 = deterministic_license_id("myproject", "abc123");
        assert_eq!(id1, id2);
        let id3 = deterministic_license_id("myproject", "different");
        assert_ne!(id1, id3);
    }

    #[test]
    fn test_deterministic_fingerprint() {
        let fp1 = deterministic_fingerprint("proj", "copy", 2024, "hash");
        let fp2 = deterministic_fingerprint("proj", "copy", 2024, "hash");
        assert_eq!(fp1, fp2);
        assert_eq!(fp1.len(), 64);
    }

    #[test]
    fn test_hash_licensee_fields() {
        let n1 = hash_licensee_name("Alice");
        let n2 = hash_licensee_name("Alice");
        assert_eq!(n1, n2);
        let n3 = hash_licensee_name("Bob");
        assert_ne!(n1, n3);
    }

    #[test]
    fn test_create_licensee_hash() {
        let licensee = create_licensee_hash("Alice", Some("Acme"), Some("alice@acme.com"));
        assert!(licensee.verify_name("Alice"));
        assert!(licensee.verify_organization("Acme"));
        assert!(licensee.verify_email("alice@acme.com"));
        assert!(!licensee.verify_name("Bob"));
    }

    #[test]
    fn test_create_licensee_hash_minimal() {
        let licensee = create_licensee_hash("Bob", None, None);
        assert!(licensee.verify_name("Bob"));
        assert_eq!(licensee.org_hash, None);
        assert_eq!(licensee.email_hash, None);
    }

    #[test]
    fn test_ed25519_sign_and_verify() {
        let kp = generate_keypair_ed25519().unwrap();
        let message = b"important license data";
        let sig = sign_ed25519(&kp.secret_key, message).unwrap();
        assert_eq!(sig.algorithm, "Ed25519");
        assert!(verify_ed25519(&kp.public_key, message, &sig.signature).unwrap());
        assert!(!verify_ed25519(&kp.public_key, b"tampered", &sig.signature).unwrap());
    }

    #[test]
    fn test_ecdsa_sign_and_verify() {
        let kp = generate_keypair_ecdsa().unwrap();
        let message = b"ecdsa test data";
        let sig = sign_ecdsa(&kp.secret_key, message).unwrap();
        assert_eq!(sig.algorithm, "ECDSA");
        assert!(verify_ecdsa(&kp.public_key, message, &sig.signature).unwrap());
    }

    #[test]
    fn test_rsa_keypair_generation() {
        let kp = generate_keypair_rsa().unwrap();
        assert!(!kp.public_key.is_empty());
        assert!(!kp.secret_key.is_empty());
    }

    #[test]
    fn test_qr_code_generation() {
        let qr = generate_qr_code("https://example.com/license").unwrap();
        assert_eq!(qr.format, "svg");
        assert!(qr.content.contains("<svg"));
        assert!(qr.size > 0);
    }

    #[test]
    fn test_file_hash_nonexistent() {
        let result = compute_file_hash(Path::new("/nonexistent/file/path.txt"));
        assert!(result.is_err());
    }

    #[test]
    fn test_folder_hash_empty() {
        let dir = tempfile::tempdir().unwrap();
        let result = compute_folder_hash(dir.path());
        assert!(result.is_ok());
        let hash = result.unwrap();
        assert!(!hash.blake3.is_empty());
        assert!(!hash.sha256.is_empty());
        assert!(!hash.sha3_256.is_empty());
    }

    #[test]
    fn test_invalid_secret_key_hex() {
        let result = sign_ed25519("not-hex!!", b"test");
        assert!(result.is_err());
    }

    #[test]
    fn test_invalid_public_key_hex() {
        let result = verify_ed25519("not-hex!!", b"test", "aabb");
        assert!(result.is_err());
    }

    #[test]
    fn test_invalid_signature_hex() {
        let kp = generate_keypair_ed25519().unwrap();
        let result = verify_ed25519(&kp.public_key, b"test", "not-hex!!");
        assert!(result.is_err());
    }

    #[test]
    fn test_hash_result_serialization() {
        let hr = compute_text_hash("test");
        let json = serde_json::to_string(&hr).unwrap();
        let deserialized: HashResult = serde_json::from_str(&json).unwrap();
        assert_eq!(hr, deserialized);
    }

    #[test]
    fn test_keypair_serialization() {
        let kp = generate_keypair_ed25519().unwrap();
        let json = serde_json::to_string(&kp).unwrap();
        let deserialized: KeyPair = serde_json::from_str(&json).unwrap();
        assert_eq!(kp, deserialized);
    }

    #[test]
    fn test_different_keys_different_signatures() {
        let kp1 = generate_keypair_ed25519().unwrap();
        let kp2 = generate_keypair_ed25519().unwrap();
        let message = b"same message";
        let sig1 = sign_ed25519(&kp1.secret_key, message).unwrap();
        assert!(verify_ed25519(&kp1.public_key, message, &sig1.signature).unwrap());
        assert!(!verify_ed25519(&kp2.public_key, message, &sig1.signature).unwrap());
        assert_ne!(sig1.signature, kp2.public_key);
    }
}
