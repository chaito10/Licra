use std::collections::HashMap;
use serde::{Serialize, Deserialize};

const COMPATIBILITY_JSON: &str = r#"
{
  "matrix": {
    "MIT": {
      "MIT": true,
      "BSD-2-Clause": true,
      "ISC": true,
      "Apache-2.0": true,
      "0BSD": true,
      "Unlicense": true,
      "CC0-1.0": true,
      "LGPL-2.0-only": true,
      "LGPL-2.1-only": true,
      "LGPL-3.0-only": true,
      "MPL-2.0": true,
      "GPL-2.0-only": true,
      "GPL-2.0-or-later": true,
      "GPL-3.0-only": true,
      "GPL-3.0-or-later": true,
      "AGPL-3.0-only": true,
      "AGPL-3.0-or-later": true,
      "EPL-1.0": false,
      "EPL-2.0": true,
      "EUPL-1.1": false,
      "EUPL-1.2": true
    },
    "BSD-2-Clause": {
      "MIT": true,
      "BSD-2-Clause": true,
      "ISC": true,
      "Apache-2.0": true,
      "0BSD": true,
      "Unlicense": true,
      "CC0-1.0": true,
      "LGPL-2.0-only": true,
      "LGPL-2.1-only": true,
      "LGPL-3.0-only": true,
      "MPL-2.0": true,
      "GPL-2.0-only": true,
      "GPL-2.0-or-later": true,
      "GPL-3.0-only": true,
      "GPL-3.0-or-later": true,
      "AGPL-3.0-only": true,
      "AGPL-3.0-or-later": true,
      "EPL-1.0": false,
      "EPL-2.0": true,
      "EUPL-1.1": false,
      "EUPL-1.2": true
    },
    "ISC": {
      "MIT": true,
      "BSD-2-Clause": true,
      "ISC": true,
      "Apache-2.0": true,
      "0BSD": true,
      "Unlicense": true,
      "CC0-1.0": true,
      "LGPL-2.0-only": true,
      "LGPL-2.1-only": true,
      "LGPL-3.0-only": true,
      "MPL-2.0": true,
      "GPL-2.0-only": true,
      "GPL-2.0-or-later": true,
      "GPL-3.0-only": true,
      "GPL-3.0-or-later": true,
      "AGPL-3.0-only": true,
      "AGPL-3.0-or-later": true,
      "EPL-1.0": false,
      "EPL-2.0": true,
      "EUPL-1.1": false,
      "EUPL-1.2": true
    },
    "Apache-2.0": {
      "MIT": true,
      "BSD-2-Clause": true,
      "ISC": true,
      "Apache-2.0": true,
      "0BSD": true,
      "Unlicense": true,
      "CC0-1.0": true,
      "LGPL-2.0-only": false,
      "LGPL-2.1-only": false,
      "LGPL-3.0-only": true,
      "MPL-2.0": true,
      "GPL-2.0-only": false,
      "GPL-2.0-or-later": false,
      "GPL-3.0-only": true,
      "GPL-3.0-or-later": true,
      "AGPL-3.0-only": true,
      "AGPL-3.0-or-later": true,
      "EPL-1.0": false,
      "EPL-2.0": true,
      "EUPL-1.1": false,
      "EUPL-1.2": true
    },
    "0BSD": {
      "MIT": true,
      "BSD-2-Clause": true,
      "ISC": true,
      "Apache-2.0": true,
      "0BSD": true,
      "Unlicense": true,
      "CC0-1.0": true,
      "LGPL-2.0-only": true,
      "LGPL-2.1-only": true,
      "LGPL-3.0-only": true,
      "MPL-2.0": true,
      "GPL-2.0-only": true,
      "GPL-2.0-or-later": true,
      "GPL-3.0-only": true,
      "GPL-3.0-or-later": true,
      "AGPL-3.0-only": true,
      "AGPL-3.0-or-later": true,
      "EPL-1.0": true,
      "EPL-2.0": true,
      "EUPL-1.1": true,
      "EUPL-1.2": true
    },
    "Unlicense": {
      "MIT": true,
      "BSD-2-Clause": true,
      "ISC": true,
      "Apache-2.0": true,
      "0BSD": true,
      "Unlicense": true,
      "CC0-1.0": true,
      "LGPL-2.0-only": true,
      "LGPL-2.1-only": true,
      "LGPL-3.0-only": true,
      "MPL-2.0": true,
      "GPL-2.0-only": true,
      "GPL-2.0-or-later": true,
      "GPL-3.0-only": true,
      "GPL-3.0-or-later": true,
      "AGPL-3.0-only": true,
      "AGPL-3.0-or-later": true,
      "EPL-1.0": true,
      "EPL-2.0": true,
      "EUPL-1.1": true,
      "EUPL-1.2": true
    },
    "CC0-1.0": {
      "MIT": true,
      "BSD-2-Clause": true,
      "ISC": true,
      "Apache-2.0": true,
      "0BSD": true,
      "Unlicense": true,
      "CC0-1.0": true,
      "LGPL-2.0-only": true,
      "LGPL-2.1-only": true,
      "LGPL-3.0-only": true,
      "MPL-2.0": true,
      "GPL-2.0-only": true,
      "GPL-2.0-or-later": true,
      "GPL-3.0-only": true,
      "GPL-3.0-or-later": true,
      "AGPL-3.0-only": true,
      "AGPL-3.0-or-later": true,
      "EPL-1.0": true,
      "EPL-2.0": true,
      "EUPL-1.1": true,
      "EUPL-1.2": true
    },
    "LGPL-2.0-only": {
      "MIT": true,
      "BSD-2-Clause": true,
      "ISC": true,
      "Apache-2.0": false,
      "0BSD": true,
      "Unlicense": true,
      "CC0-1.0": true,
      "LGPL-2.0-only": true,
      "LGPL-2.1-only": true,
      "LGPL-3.0-only": true,
      "MPL-2.0": false,
      "GPL-2.0-only": true,
      "GPL-2.0-or-later": true,
      "GPL-3.0-only": true,
      "GPL-3.0-or-later": true,
      "AGPL-3.0-only": true,
      "AGPL-3.0-or-later": true,
      "EPL-1.0": false,
      "EPL-2.0": false,
      "EUPL-1.1": false,
      "EUPL-1.2": false
    },
    "LGPL-2.1-only": {
      "MIT": true,
      "BSD-2-Clause": true,
      "ISC": true,
      "Apache-2.0": false,
      "0BSD": true,
      "Unlicense": true,
      "CC0-1.0": true,
      "LGPL-2.0-only": false,
      "LGPL-2.1-only": true,
      "LGPL-3.0-only": true,
      "MPL-2.0": false,
      "GPL-2.0-only": true,
      "GPL-2.0-or-later": true,
      "GPL-3.0-only": true,
      "GPL-3.0-or-later": true,
      "AGPL-3.0-only": true,
      "AGPL-3.0-or-later": true,
      "EPL-1.0": false,
      "EPL-2.0": false,
      "EUPL-1.1": false,
      "EUPL-1.2": false
    },
    "LGPL-3.0-only": {
      "MIT": true,
      "BSD-2-Clause": true,
      "ISC": true,
      "Apache-2.0": true,
      "0BSD": true,
      "Unlicense": true,
      "CC0-1.0": true,
      "LGPL-2.0-only": false,
      "LGPL-2.1-only": false,
      "LGPL-3.0-only": true,
      "MPL-2.0": false,
      "GPL-2.0-only": false,
      "GPL-2.0-or-later": true,
      "GPL-3.0-only": true,
      "GPL-3.0-or-later": true,
      "AGPL-3.0-only": true,
      "AGPL-3.0-or-later": true,
      "EPL-1.0": false,
      "EPL-2.0": false,
      "EUPL-1.1": false,
      "EUPL-1.2": false
    },
    "MPL-2.0": {
      "MIT": true,
      "BSD-2-Clause": true,
      "ISC": true,
      "Apache-2.0": true,
      "0BSD": true,
      "Unlicense": true,
      "CC0-1.0": true,
      "LGPL-2.0-only": false,
      "LGPL-2.1-only": false,
      "LGPL-3.0-only": false,
      "MPL-2.0": true,
      "GPL-2.0-only": true,
      "GPL-2.0-or-later": true,
      "GPL-3.0-only": true,
      "GPL-3.0-or-later": true,
      "AGPL-3.0-only": true,
      "AGPL-3.0-or-later": true,
      "EPL-1.0": false,
      "EPL-2.0": true,
      "EUPL-1.1": false,
      "EUPL-1.2": true
    },
    "GPL-2.0-only": {
      "MIT": true,
      "BSD-2-Clause": true,
      "ISC": true,
      "Apache-2.0": false,
      "0BSD": true,
      "Unlicense": true,
      "CC0-1.0": true,
      "LGPL-2.0-only": false,
      "LGPL-2.1-only": false,
      "LGPL-3.0-only": false,
      "MPL-2.0": true,
      "GPL-2.0-only": true,
      "GPL-2.0-or-later": true,
      "GPL-3.0-only": false,
      "GPL-3.0-or-later": true,
      "AGPL-3.0-only": true,
      "AGPL-3.0-or-later": true,
      "EPL-1.0": false,
      "EPL-2.0": false,
      "EUPL-1.1": false,
      "EUPL-1.2": false
    },
    "GPL-2.0-or-later": {
      "MIT": true,
      "BSD-2-Clause": true,
      "ISC": true,
      "Apache-2.0": false,
      "0BSD": true,
      "Unlicense": true,
      "CC0-1.0": true,
      "LGPL-2.0-only": false,
      "LGPL-2.1-only": false,
      "LGPL-3.0-only": false,
      "MPL-2.0": true,
      "GPL-2.0-only": false,
      "GPL-2.0-or-later": true,
      "GPL-3.0-only": true,
      "GPL-3.0-or-later": true,
      "AGPL-3.0-only": true,
      "AGPL-3.0-or-later": true,
      "EPL-1.0": false,
      "EPL-2.0": false,
      "EUPL-1.1": false,
      "EUPL-1.2": false
    },
    "GPL-3.0-only": {
      "MIT": true,
      "BSD-2-Clause": true,
      "ISC": true,
      "Apache-2.0": true,
      "0BSD": true,
      "Unlicense": true,
      "CC0-1.0": true,
      "LGPL-2.0-only": false,
      "LGPL-2.1-only": false,
      "LGPL-3.0-only": false,
      "MPL-2.0": true,
      "GPL-2.0-only": false,
      "GPL-2.0-or-later": false,
      "GPL-3.0-only": true,
      "GPL-3.0-or-later": true,
      "AGPL-3.0-only": true,
      "AGPL-3.0-or-later": true,
      "EPL-1.0": false,
      "EPL-2.0": false,
      "EUPL-1.1": false,
      "EUPL-1.2": false
    },
    "GPL-3.0-or-later": {
      "MIT": true,
      "BSD-2-Clause": true,
      "ISC": true,
      "Apache-2.0": true,
      "0BSD": true,
      "Unlicense": true,
      "CC0-1.0": true,
      "LGPL-2.0-only": false,
      "LGPL-2.1-only": false,
      "LGPL-3.0-only": false,
      "MPL-2.0": true,
      "GPL-2.0-only": false,
      "GPL-2.0-or-later": false,
      "GPL-3.0-only": false,
      "GPL-3.0-or-later": true,
      "AGPL-3.0-only": true,
      "AGPL-3.0-or-later": true,
      "EPL-1.0": false,
      "EPL-2.0": false,
      "EUPL-1.1": false,
      "EUPL-1.2": false
    },
    "AGPL-3.0-only": {
      "MIT": true,
      "BSD-2-Clause": true,
      "ISC": true,
      "Apache-2.0": true,
      "0BSD": true,
      "Unlicense": true,
      "CC0-1.0": true,
      "LGPL-2.0-only": false,
      "LGPL-2.1-only": false,
      "LGPL-3.0-only": false,
      "MPL-2.0": false,
      "GPL-2.0-only": false,
      "GPL-2.0-or-later": false,
      "GPL-3.0-only": false,
      "GPL-3.0-or-later": false,
      "AGPL-3.0-only": true,
      "AGPL-3.0-or-later": true,
      "EPL-1.0": false,
      "EPL-2.0": false,
      "EUPL-1.1": false,
      "EUPL-1.2": false
    },
    "AGPL-3.0-or-later": {
      "MIT": true,
      "BSD-2-Clause": true,
      "ISC": true,
      "Apache-2.0": true,
      "0BSD": true,
      "Unlicense": true,
      "CC0-1.0": true,
      "LGPL-2.0-only": false,
      "LGPL-2.1-only": false,
      "LGPL-3.0-only": false,
      "MPL-2.0": false,
      "GPL-2.0-only": false,
      "GPL-2.0-or-later": false,
      "GPL-3.0-only": false,
      "GPL-3.0-or-later": false,
      "AGPL-3.0-only": false,
      "AGPL-3.0-or-later": true,
      "EPL-1.0": false,
      "EPL-2.0": false,
      "EUPL-1.1": false,
      "EUPL-1.2": false
    },
    "EPL-1.0": {
      "MIT": false,
      "BSD-2-Clause": false,
      "ISC": false,
      "Apache-2.0": false,
      "0BSD": true,
      "Unlicense": true,
      "CC0-1.0": true,
      "LGPL-2.0-only": false,
      "LGPL-2.1-only": false,
      "LGPL-3.0-only": false,
      "MPL-2.0": false,
      "GPL-2.0-only": false,
      "GPL-2.0-or-later": false,
      "GPL-3.0-only": false,
      "GPL-3.0-or-later": false,
      "AGPL-3.0-only": false,
      "AGPL-3.0-or-later": false,
      "EPL-1.0": true,
      "EPL-2.0": false,
      "EUPL-1.1": false,
      "EUPL-1.2": false
    },
    "EPL-2.0": {
      "MIT": true,
      "BSD-2-Clause": true,
      "ISC": true,
      "Apache-2.0": true,
      "0BSD": true,
      "Unlicense": true,
      "CC0-1.0": true,
      "LGPL-2.0-only": false,
      "LGPL-2.1-only": false,
      "LGPL-3.0-only": false,
      "MPL-2.0": true,
      "GPL-2.0-only": false,
      "GPL-2.0-or-later": false,
      "GPL-3.0-only": false,
      "GPL-3.0-or-later": false,
      "AGPL-3.0-only": false,
      "AGPL-3.0-or-later": false,
      "EPL-1.0": false,
      "EPL-2.0": true,
      "EUPL-1.1": false,
      "EUPL-1.2": false
    },
    "EUPL-1.1": {
      "MIT": false,
      "BSD-2-Clause": false,
      "ISC": false,
      "Apache-2.0": false,
      "0BSD": true,
      "Unlicense": true,
      "CC0-1.0": true,
      "LGPL-2.0-only": false,
      "LGPL-2.1-only": false,
      "LGPL-3.0-only": false,
      "MPL-2.0": false,
      "GPL-2.0-only": false,
      "GPL-2.0-or-later": false,
      "GPL-3.0-only": false,
      "GPL-3.0-or-later": false,
      "AGPL-3.0-only": false,
      "AGPL-3.0-or-later": false,
      "EPL-1.0": false,
      "EPL-2.0": false,
      "EUPL-1.1": true,
      "EUPL-1.2": true
    },
    "EUPL-1.2": {
      "MIT": true,
      "BSD-2-Clause": true,
      "ISC": true,
      "Apache-2.0": true,
      "0BSD": true,
      "Unlicense": true,
      "CC0-1.0": true,
      "LGPL-2.0-only": false,
      "LGPL-2.1-only": false,
      "LGPL-3.0-only": false,
      "MPL-2.0": true,
      "GPL-2.0-only": false,
      "GPL-2.0-or-later": false,
      "GPL-3.0-only": false,
      "GPL-3.0-or-later": false,
      "AGPL-3.0-only": false,
      "AGPL-3.0-or-later": false,
      "EPL-1.0": false,
      "EPL-2.0": false,
      "EUPL-1.1": true,
      "EUPL-1.2": true
    }
  },
  "upgrade_paths": {
    "GPL-2.0-only": ["GPL-2.0-or-later", "GPL-3.0-or-later"],
    "GPL-2.0-or-later": ["GPL-3.0-or-later"],
    "LGPL-2.0-only": ["LGPL-2.1-only", "LGPL-3.0-only"],
    "LGPL-2.1-only": ["LGPL-3.0-only"],
    "AGPL-3.0-only": ["AGPL-3.0-or-later"]
  }
}
"#;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CompatibilityMatrix {
    matrix: HashMap<String, HashMap<String, bool>>,
    upgrade_paths: HashMap<String, Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CompatibilityResult {
    pub license_a: String,
    pub license_b: String,
    pub compatible: bool,
    pub reason: String,
    pub suggestions: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CompatibilityReport {
    pub licenses: Vec<String>,
    pub pairwise_results: Vec<CompatibilityResult>,
    pub overall_compatible: bool,
    pub conflicts: Vec<(String, String)>,
    pub suggestions: Vec<String>,
}

impl CompatibilityMatrix {
    pub fn new() -> Self {
        Self::new_from_json(COMPATIBILITY_JSON)
    }

    pub fn new_from_json(json: &str) -> Self {
        let parsed: Self = serde_json::from_str(json).expect("invalid compatibility JSON");
        parsed
    }

    pub fn are_compatible(&self, a: &str, b: &str) -> bool {
        if let Some(row) = self.matrix.get(a) {
            if let Some(&val) = row.get(b) {
                return val;
            }
        }
        if let Some(row) = self.matrix.get(b) {
            if let Some(&val) = row.get(a) {
                return val;
            }
        }
        false
    }

    pub fn get_compatible_licenses(&self, license: &str) -> Vec<String> {
        match self.matrix.get(license) {
            Some(row) => row.iter()
                .filter_map(|(k, &v)| if v { Some(k.clone()) } else { None })
                .collect(),
            None => Vec::new(),
        }
    }

    pub fn get_incompatible_licenses(&self, license: &str) -> Vec<String> {
        match self.matrix.get(license) {
            Some(row) => row.iter()
                .filter_map(|(k, &v)| if !v { Some(k.clone()) } else { None })
                .collect(),
            None => Vec::new(),
        }
    }

    pub fn find_upgrade(&self, license: &str) -> Vec<String> {
        self.upgrade_paths
            .get(license)
            .cloned()
            .unwrap_or_default()
    }

    pub fn check_batch(&self, licenses: &[String]) -> CompatibilityReport {
        let mut pairwise_results = Vec::new();
        let mut conflicts = Vec::new();
        let mut all_suggestions = Vec::new();
        let overall_compatible;

        for i in 0..licenses.len() {
            for j in (i + 1)..licenses.len() {
                let result = self.explain(&licenses[i], &licenses[j]);
                if !result.compatible {
                    conflicts.push((licenses[i].clone(), licenses[j].clone()));
                    for s in &result.suggestions {
                        if !all_suggestions.contains(s) {
                            all_suggestions.push(s.clone());
                        }
                    }
                }
                pairwise_results.push(result);
            }
        }

        overall_compatible = conflicts.is_empty();

        if !overall_compatible {
            let conflict_desc = conflicts.iter()
                .map(|(a, b)| format!("{} <-> {}", a, b))
                .collect::<Vec<_>>()
                .join(", ");
            let msg = format!(
                "Found {} incompatible pair(s): {}",
                conflicts.len(),
                conflict_desc
            );
            if !all_suggestions.contains(&msg) {
                all_suggestions.push(msg);
            }
        }

        CompatibilityReport {
            licenses: licenses.to_vec(),
            pairwise_results,
            overall_compatible,
            conflicts,
            suggestions: all_suggestions,
        }
    }

    pub fn explain(&self, a: &str, b: &str) -> CompatibilityResult {
        let compatible = self.are_compatible(a, b);

        let reason = if compatible {
            format!("{} and {} are compatible", a, b)
        } else {
            format!("{} and {} are incompatible", a, b)
        };

        let mut suggestions = Vec::new();

        if !compatible {
            if let Some(upgrades_a) = self.upgrade_paths.get(a) {
                for upgraded in upgrades_a {
                    if self.are_compatible(upgraded, b) {
                        suggestions.push(format!(
                            "Upgrade {} to {} for compatibility with {}",
                            a, upgraded, b
                        ));
                    }
                }
            }

            if let Some(upgrades_b) = self.upgrade_paths.get(b) {
                for upgraded in upgrades_b {
                    if self.are_compatible(a, upgraded) {
                        suggestions.push(format!(
                            "Upgrade {} to {} for compatibility with {}",
                            b, upgraded, a
                        ));
                    }
                }
            }

            let compatible_with_a = self.get_compatible_licenses(a);
            let compatible_with_b = self.get_compatible_licenses(b);
            let common: Vec<&String> = compatible_with_a.iter()
                .filter(|c| compatible_with_b.contains(c))
                .collect();

            if !common.is_empty() {
                let alternatives: Vec<&str> = common.iter().map(|s| s.as_str()).collect();
                suggestions.push(format!(
                    "Consider using one of these mutually compatible licenses: {}",
                    alternatives.join(", ")
                ));
            }
        }

        CompatibilityResult {
            license_a: a.to_string(),
            license_b: b.to_string(),
            compatible,
            reason,
            suggestions,
        }
    }

    pub fn all_license_ids(&self) -> Vec<String> {
        let mut ids: Vec<String> = self.matrix.keys().cloned().collect();
        ids.sort();
        ids
    }

    pub fn get_matrix_display(&self) -> Vec<Vec<String>> {
        let ids = self.all_license_ids();
        let mut display = Vec::new();

        let mut header = vec![String::new()];
        header.extend(ids.iter().cloned());
        display.push(header);

        for id in &ids {
            let mut row = vec![id.clone()];
            for other in &ids {
                let val = self.are_compatible(id, other);
                row.push(if val { "Y".to_string() } else { "N".to_string() });
            }
            display.push(row);
        }

        display
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_are_compatible() {
        let matrix = CompatibilityMatrix::new();
        assert!(matrix.are_compatible("MIT", "Apache-2.0"));
        assert!(matrix.are_compatible("Apache-2.0", "MIT"));
        assert!(!matrix.are_compatible("MIT", "EPL-1.0"));
        assert!(!matrix.are_compatible("EPL-1.0", "MIT"));
    }

    #[test]
    fn test_same_license_compatible() {
        let matrix = CompatibilityMatrix::new();
        assert!(matrix.are_compatible("MIT", "MIT"));
        assert!(matrix.are_compatible("GPL-3.0-only", "GPL-3.0-only"));
    }

    #[test]
    fn test_get_compatible_licenses() {
        let matrix = CompatibilityMatrix::new();
        let compatible = matrix.get_compatible_licenses("MIT");
        assert!(compatible.contains(&"Apache-2.0".to_string()));
        assert!(compatible.contains(&"BSD-2-Clause".to_string()));
        assert!(!compatible.contains(&"EPL-1.0".to_string()));
    }

    #[test]
    fn test_get_incompatible_licenses() {
        let matrix = CompatibilityMatrix::new();
        let incompatible = matrix.get_incompatible_licenses("MIT");
        assert!(incompatible.contains(&"EPL-1.0".to_string()));
        assert!(!incompatible.contains(&"Apache-2.0".to_string()));
    }

    #[test]
    fn test_find_upgrade() {
        let matrix = CompatibilityMatrix::new();
        let upgrades = matrix.find_upgrade("GPL-2.0-only");
        assert!(upgrades.contains(&"GPL-2.0-or-later".to_string()));
        assert!(upgrades.contains(&"GPL-3.0-or-later".to_string()));

        let no_upgrades = matrix.find_upgrade("MIT");
        assert!(no_upgrades.is_empty());
    }

    #[test]
    fn test_explain_compatible() {
        let matrix = CompatibilityMatrix::new();
        let result = matrix.explain("MIT", "BSD-2-Clause");
        assert!(result.compatible);
        assert!(result.suggestions.is_empty());
    }

    #[test]
    fn test_explain_incompatible() {
        let matrix = CompatibilityMatrix::new();
        let result = matrix.explain("MIT", "EPL-1.0");
        assert!(!result.compatible);
        assert!(!result.suggestions.is_empty());
    }

    #[test]
    fn test_check_batch_compatible() {
        let matrix = CompatibilityMatrix::new();
        let licenses = vec![
            "MIT".to_string(),
            "BSD-2-Clause".to_string(),
            "ISC".to_string(),
        ];
        let report = matrix.check_batch(&licenses);
        assert!(report.overall_compatible);
        assert!(report.conflicts.is_empty());
    }

    #[test]
    fn test_check_batch_incompatible() {
        let matrix = CompatibilityMatrix::new();
        let licenses = vec![
            "MIT".to_string(),
            "EPL-1.0".to_string(),
        ];
        let report = matrix.check_batch(&licenses);
        assert!(!report.overall_compatible);
        assert_eq!(report.conflicts.len(), 1);
    }

    #[test]
    fn test_all_license_ids() {
        let matrix = CompatibilityMatrix::new();
        let ids = matrix.all_license_ids();
        assert!(ids.contains(&"MIT".to_string()));
        assert!(ids.contains(&"AGPL-3.0-or-later".to_string()));
        assert_eq!(ids.len(), 21);
    }

    #[test]
    fn test_get_matrix_display() {
        let matrix = CompatibilityMatrix::new();
        let display = matrix.get_matrix_display();
        assert_eq!(display.len(), 22);
        assert_eq!(display[0].len(), 22);
    }

    #[test]
    fn test_new_from_json() {
        let json = r#"{
            "matrix": {
                "X": { "X": true, "Y": false },
                "Y": { "X": false, "Y": true }
            },
            "upgrade_paths": {}
        }"#;
        let matrix = CompatibilityMatrix::new_from_json(json);
        assert!(matrix.are_compatible("X", "X"));
        assert!(!matrix.are_compatible("X", "Y"));
    }

    #[test]
    fn test_unknown_license() {
        let matrix = CompatibilityMatrix::new();
        assert!(!matrix.are_compatible("MIT", "UNKNOWN"));
        assert!(!matrix.are_compatible("UNKNOWN", "MIT"));
        assert!(matrix.get_compatible_licenses("UNKNOWN").is_empty());
        assert!(matrix.get_incompatible_licenses("UNKNOWN").is_empty());
    }
}
