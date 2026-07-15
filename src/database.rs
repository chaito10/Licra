use super::clauses::ClauseDatabase;
use super::compatibility::CompatibilityMatrix;
use super::spdx::SpdxDatabase;

#[derive(Debug, Clone)]
pub struct GlgDatabase {
    pub spdx: SpdxDatabase,
    pub compatibility: CompatibilityMatrix,
    pub clauses: ClauseDatabase,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct DatabaseStats {
    pub spdx_license_count: usize,
    pub clause_count: usize,
    pub compatibility_pairs: usize,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct SearchResult {
    pub source: String,
    pub id: String,
    pub name: String,
    pub description: String,
    pub relevance: u32,
}

impl GlgDatabase {
    pub fn new() -> Self {
        GlgDatabase {
            spdx: SpdxDatabase::load(),
            compatibility: CompatibilityMatrix::new(),
            clauses: ClauseDatabase::new(),
        }
    }

    pub fn stats(&self) -> DatabaseStats {
        let spdx_license_count = self.spdx.all_ids().len();
        let clause_count = self.clauses.search("").len();
        let compatibility_pairs = self.compatibility.all_license_ids().len();

        DatabaseStats {
            spdx_license_count,
            clause_count,
            compatibility_pairs,
        }
    }

    pub fn search_all(&self, query: &str) -> Vec<SearchResult> {
        let mut results = Vec::new();
        let lower = query.to_lowercase();

        for license in self.spdx.search(query) {
            let relevance = compute_relevance(&lower, &license.id, &license.name);
            results.push(SearchResult {
                source: "spdx".to_string(),
                id: license.id.clone(),
                name: license.name.clone(),
                description: format!(
                    "Category: {}, OSI Approved: {}, FSF Free: {}",
                    license.category, license.osi_approved, license.fsf_free_software
                ),
                relevance,
            });
        }

        for id in self.compatibility.all_license_ids() {
            if id.to_lowercase().contains(&lower) {
                let compatible = self.compatibility.get_compatible_licenses(&id);
                let relevance = compute_relevance(&lower, &id, &id);
                results.push(SearchResult {
                    source: "compatibility".to_string(),
                    id: id.clone(),
                    name: id.clone(),
                    description: format!(
                        "Compatible with {} license(s)",
                        compatible.len()
                    ),
                    relevance,
                });
            }
        }

        for clause in self.clauses.search(query) {
            let relevance = compute_relevance(&lower, &clause.name, &clause.name);
            results.push(SearchResult {
                source: "clauses".to_string(),
                id: clause.uuid.to_string(),
                name: clause.name.clone(),
                description: clause.description.clone(),
                relevance,
            });
        }

        results.sort_by(|a, b| b.relevance.cmp(&a.relevance));
        results
    }

    pub fn validate(&self) -> Result<(), Vec<String>> {
        let mut errors = Vec::new();

        if self.spdx.all_ids().is_empty() {
            errors.push("SPDX database contains no licenses".to_string());
        }

        let matrix_ids = self.compatibility.all_license_ids();
        if matrix_ids.is_empty() {
            errors.push("Compatibility matrix contains no entries".to_string());
        }

        let all_clause_names: Vec<String> = self
            .clauses
            .search("")
            .iter()
            .map(|c| c.name.clone())
            .collect();

        if all_clause_names.is_empty() {
            errors.push("Clause database contains no clauses".to_string());
        }

        for clause in self.clauses.search("") {
            for dep in &clause.dependencies {
                if !all_clause_names.contains(dep) {
                    errors.push(format!(
                        "Clause '{}' depends on '{}' which does not exist",
                        clause.name, dep
                    ));
                }
            }
            for conflict in &clause.conflicts {
                if !all_clause_names.contains(conflict) {
                    errors.push(format!(
                        "Clause '{}' conflicts with '{}' which does not exist",
                        clause.name, conflict
                    ));
                }
            }
        }

        if errors.is_empty() {
            Ok(())
        } else {
            Err(errors)
        }
    }
}

fn compute_relevance(query_lower: &str, id: &str, name: &str) -> u32 {
    let id_lower = id.to_lowercase();
    let name_lower = name.to_lowercase();

    if id_lower == query_lower {
        return 100;
    }
    if name_lower == query_lower {
        return 95;
    }
    if id_lower.starts_with(query_lower) {
        return 80;
    }
    if name_lower.starts_with(query_lower) {
        return 75;
    }
    if id_lower.contains(query_lower) {
        return 50;
    }
    if name_lower.contains(query_lower) {
        return 40;
    }
    10
}
