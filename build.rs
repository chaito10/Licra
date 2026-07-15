use std::env;
use std::fs;
use std::path::Path;

fn main() {
    let out_dir = env::var("OUT_DIR").unwrap();
    let dest_path = Path::new(&out_dir).join("built.rs");

    let spdx_json = include_str!("licenses/spdx_licenses.json");
    let compat_json = include_str!("licenses/compatibility.json");
    let clauses_json = include_str!("licenses/clauses.json");

    fs::write(
        &dest_path,
        format!(
            "pub const SPDX_LICENSES_JSON: &str = r#\"{spdx_json}\"#;\n\
             pub const COMPATIBILITY_JSON: &str = r#\"{compat_json}\"#;\n\
             pub const CLAUSES_JSON: &str = r#\"{clauses_json}\"#;\n"
        ),
    )
    .unwrap();

    println!("cargo:rerun-if-changed=licenses/");
    println!("cargo:rerun-if-changed=templates/");
    println!("cargo:rerun-if-changed=static/");
}
