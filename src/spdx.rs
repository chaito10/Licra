use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use thiserror::Error;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SpdxLicense {
    pub id: String,
    pub name: String,
    pub osi_approved: bool,
    pub fsf_free_software: bool,
    pub category: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SpdxExpression {
    pub operator: SpdxOperator,
    pub operands: Vec<SpdxOperand>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum SpdxOperator {
    And,
    Or,
    With,
    Plus,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum SpdxOperand {
    LicenseId(String),
    LicenseRef(String),
    Expression(Box<SpdxExpression>),
}

#[derive(Debug, Clone)]
pub struct SpdxDatabase {
    licenses: HashMap<String, SpdxLicense>,
    compatibility: HashMap<String, Vec<String>>,
}

#[derive(Debug, Clone, Error)]
pub enum SpdxError {
    #[error("invalid SPDX expression syntax: {0}")]
    InvalidSyntax(String),

    #[error("unknown license identifier: {0}")]
    UnknownLicense(String),

    #[error("incompatible license combination: {0} and {1}")]
    IncompatibleCombination(String, String),

    #[error("parse error: {0}")]
    ParseError(String),
}

pub const EMBEDDED_SPDX_JSON: &str = r#"[
  {
    "id": "MIT",
    "name": "MIT License",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "Apache-2.0",
    "name": "Apache License 2.0",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "GPL-2.0-only",
    "name": "GNU General Public License v2.0 only",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Copyleft"
  },
  {
    "id": "GPL-2.0-or-later",
    "name": "GNU General Public License v2.0 or later",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Copyleft"
  },
  {
    "id": "GPL-3.0-only",
    "name": "GNU General Public License v3.0 only",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Copyleft"
  },
  {
    "id": "GPL-3.0-or-later",
    "name": "GNU General Public License v3.0 or later",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Copyleft"
  },
  {
    "id": "LGPL-2.1-only",
    "name": "GNU Lesser General Public License v2.1 only",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Copyleft"
  },
  {
    "id": "LGPL-2.1-or-later",
    "name": "GNU Lesser General Public License v2.1 or later",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Copyleft"
  },
  {
    "id": "LGPL-3.0-only",
    "name": "GNU Lesser General Public License v3.0 only",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Copyleft"
  },
  {
    "id": "LGPL-3.0-or-later",
    "name": "GNU Lesser General Public License v3.0 or later",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Copyleft"
  },
  {
    "id": "BSD-2-Clause",
    "name": "BSD 2-Clause 'Simplified' License",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "BSD-3-Clause",
    "name": "BSD 3-Clause 'New' or 'Revised' License",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "BSD-4-Clause",
    "name": "BSD 4-Clause 'Original' or 'Old' License",
    "osi_approved": false,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "ISC",
    "name": "ISC License",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "MPL-2.0",
    "name": "Mozilla Public License 2.0",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Weakly Copyleft"
  },
  {
    "id": "AGPL-3.0-only",
    "name": "GNU Affero General Public License v3.0 only",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Copyleft"
  },
  {
    "id": "AGPL-3.0-or-later",
    "name": "GNU Affero General Public License v3.0 or later",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Copyleft"
  },
  {
    "id": "Unlicense",
    "name": "The Unlicense",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Public Domain"
  },
  {
    "id": "0BSD",
    "name": "Zero-Clause BSD License",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "CC0-1.0",
    "name": "Creative Commons Zero v1.0 Universal",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Public Domain"
  },
  {
    "id": "CC-BY-4.0",
    "name": "Creative Commons Attribution 4.0 International",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "CC-BY-SA-4.0",
    "name": "Creative Commons Attribution Share Alike 4.0 International",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Copyleft"
  },
  {
    "id": "Zlib",
    "name": "zlib License",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "Artistic-2.0",
    "name": "Artistic License 2.0",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "BSL-1.0",
    "name": "Boost Software License 1.0",
    "osi_approved": true,
    "fsf_free_software": false,
    "category": "Permissive"
  },
  {
    "id": "EPL-1.0",
    "name": "Eclipse Public License 1.0",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Weakly Copyleft"
  },
  {
    "id": "EPL-2.0",
    "name": "Eclipse Public License 2.0",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Weakly Copyleft"
  },
  {
    "id": "EUPL-1.1",
    "name": "European Union Public License 1.1",
    "osi_approved": true,
    "fsf_free_software": false,
    "category": "Copyleft"
  },
  {
    "id": "EUPL-1.2",
    "name": "European Union Public License 1.2",
    "osi_approved": true,
    "fsf_free_software": false,
    "category": "Copyleft"
  },
  {
    "id": "IPA",
    "name": "IPA Font License",
    "osi_approved": true,
    "fsf_free_software": false,
    "category": "Copyleft"
  },
  {
    "id": "LATEX2e",
    "name": "LaTeX Project Public License v1.3c",
    "osi_approved": true,
    "fsf_free_software": false,
    "category": "Copyleft"
  },
  {
    "id": "LiliQ-R-1.1",
    "name": "LiliQ-R License v1.1",
    "osi_approved": true,
    "fsf_free_software": false,
    "category": "Weakly Copyleft"
  },
  {
    "id": "LiliQ-Rplus-1.1",
    "name": "LiliQ-R+ License v1.1",
    "osi_approved": true,
    "fsf_free_software": false,
    "category": "Weakly Copyleft"
  },
  {
    "id": "LiliQ-R-Spec-1.1",
    "name": "LiliQ-R Software Licence Agreement v1.1",
    "osi_approved": true,
    "fsf_free_software": false,
    "category": "Weakly Copyleft"
  },
  {
    "id": "LiliQ-Rplus-Spec-1.1",
    "name": "LiliQ-R+ Software Licence Agreement v1.1",
    "osi_approved": true,
    "fsf_free_software": false,
    "category": "Weakly Copyleft"
  },
  {
    "id": "MS-PL",
    "name": "Microsoft Public License",
    "osi_approved": true,
    "fsf_free_software": false,
    "category": "Permissive"
  },
  {
    "id": "MS-RL",
    "name": "Microsoft Reciprocal License",
    "osi_approved": true,
    "fsf_free_software": false,
    "category": "Weakly Copyleft"
  },
  {
    "id": "NCSA",
    "name": "University of Illinois/NCSA Open Source License",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "OFL-1.1",
    "name": "SIL Open Font License 1.1",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "OSL-3.0",
    "name": "Open Software License 3.0",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Copyleft"
  },
  {
    "id": "PostgreSQL",
    "name": "PostgreSQL License",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "Python-2.0",
    "name": "Python Software License 2.0",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "QPL-1.0",
    "name": "Qt Public License v1.0",
    "osi_approved": true,
    "fsf_free_software": false,
    "category": "Weakly Copyleft"
  },
  {
    "id": "Ruby",
    "name": "Ruby License",
    "osi_approved": false,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "SGI-B-1.0",
    "name": "SGI Free Software License B v1.0",
    "osi_approved": false,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "SSH-OpenSSH",
    "name": "SSH OpenSSH license",
    "osi_approved": false,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "Unicode-DFS-2016",
    "name": "Unicode License Agreement - DFS-2016",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "UPL-1.0",
    "name": "Universal Permissive License v1.0",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "VCL-1.0",
    "name": "VistaCE License",
    "osi_approved": false,
    "fsf_free_software": false,
    "category": "Proprietary"
  },
  {
    "id": "W3C",
    "name": "W3C Software License",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "WTFPL",
    "name": "Do What The F*ck You Want To Public License",
    "osi_approved": false,
    "fsf_free_software": true,
    "category": "Public Domain"
  },
  {
    "id": "X11",
    "name": "X11 License",
    "osi_approved": false,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "Xnet",
    "name": "X.Net License",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "ZPL-2.1",
    "name": "Zope Public License 2.1",
    "osi_approved": false,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "CC-PDDC",
    "name": "Creative Commons Public Domain Dedication and Certification",
    "osi_approved": false,
    "fsf_free_software": true,
    "category": "Public Domain"
  },
  {
    "id": "CC-BY-1.0",
    "name": "Creative Commons Attribution 1.0 Generic",
    "osi_approved": false,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "CC-BY-2.0",
    "name": "Creative Commons Attribution 2.0 Generic",
    "osi_approved": false,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "CC-BY-2.5",
    "name": "Creative Commons Attribution 2.5 Generic",
    "osi_approved": false,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "CC-BY-3.0",
    "name": "Creative Commons Attribution 3.0 Unported",
    "osi_approved": false,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "CC-BY-SA-1.0",
    "name": "Creative Commons Attribution-ShareAlike 1.0 Generic",
    "osi_approved": false,
    "fsf_free_software": true,
    "category": "Copyleft"
  },
  {
    "id": "CC-BY-SA-2.0",
    "name": "Creative Commons Attribution-ShareAlike 2.0 Generic",
    "osi_approved": false,
    "fsf_free_software": true,
    "category": "Copyleft"
  },
  {
    "id": "CC-BY-SA-2.5",
    "name": "Creative Commons Attribution-ShareAlike 2.5 Generic",
    "osi_approved": false,
    "fsf_free_software": true,
    "category": "Copyleft"
  },
  {
    "id": "CC-BY-SA-3.0",
    "name": "Creative Commons Attribution-ShareAlike 3.0 Unported",
    "osi_approved": false,
    "fsf_free_software": true,
    "category": "Copyleft"
  },
  {
    "id": "CC-BY-NC-1.0",
    "name": "Creative Commons Attribution Non Commercial 1.0 Generic",
    "osi_approved": false,
    "fsf_free_software": false,
    "category": "Non Commercial"
  },
  {
    "id": "CC-BY-NC-2.0",
    "name": "Creative Commons Attribution Non Commercial 2.0 Generic",
    "osi_approved": false,
    "fsf_free_software": false,
    "category": "Non Commercial"
  },
  {
    "id": "CC-BY-NC-2.5",
    "name": "Creative Commons Attribution Non Commercial 2.5 Generic",
    "osi_approved": false,
    "fsf_free_software": false,
    "category": "Non Commercial"
  },
  {
    "id": "CC-BY-NC-3.0",
    "name": "Creative Commons Attribution Non Commercial 3.0 Unported",
    "osi_approved": false,
    "fsf_free_software": false,
    "category": "Non Commercial"
  },
  {
    "id": "CC-BY-NC-4.0",
    "name": "Creative Commons Attribution Non Commercial 4.0 International",
    "osi_approved": false,
    "fsf_free_software": false,
    "category": "Non Commercial"
  },
  {
    "id": "CC-BY-NC-SA-1.0",
    "name": "Creative Commons Attribution Non Commercial Share Alike 1.0 Generic",
    "osi_approved": false,
    "fsf_free_software": false,
    "category": "Non Commercial"
  },
  {
    "id": "CC-BY-NC-SA-2.0",
    "name": "Creative Commons Attribution Non Commercial Share Alike 2.0 Generic",
    "osi_approved": false,
    "fsf_free_software": false,
    "category": "Non Commercial"
  },
  {
    "id": "CC-BY-NC-SA-2.5",
    "name": "Creative Commons Attribution Non Commercial Share Alike 2.5 Generic",
    "osi_approved": false,
    "fsf_free_software": false,
    "category": "Non Commercial"
  },
  {
    "id": "CC-BY-NC-SA-3.0",
    "name": "Creative Commons Attribution Non Commercial Share Alike 3.0 Unported",
    "osi_approved": false,
    "fsf_free_software": false,
    "category": "Non Commercial"
  },
  {
    "id": "CC-BY-NC-SA-4.0",
    "name": "Creative Commons Attribution Non Commercial Share Alike 4.0 International",
    "osi_approved": false,
    "fsf_free_software": false,
    "category": "Non Commercial"
  },
  {
    "id": "CC-BY-ND-1.0",
    "name": "Creative Commons Attribution No Derivatives 1.0 Generic",
    "osi_approved": false,
    "fsf_free_software": false,
    "category": "Non Commercial"
  },
  {
    "id": "CC-BY-ND-2.0",
    "name": "Creative Commons Attribution No Derivatives 2.0 Generic",
    "osi_approved": false,
    "fsf_free_software": false,
    "category": "Non Commercial"
  },
  {
    "id": "CC-BY-ND-2.5",
    "name": "Creative Commons Attribution No Derivatives 2.5 Generic",
    "osi_approved": false,
    "fsf_free_software": false,
    "category": "Non Commercial"
  },
  {
    "id": "CC-BY-ND-3.0",
    "name": "Creative Commons Attribution No Derivatives 3.0 Unported",
    "osi_approved": false,
    "fsf_free_software": false,
    "category": "Non Commercial"
  },
  {
    "id": "CC-BY-ND-4.0",
    "name": "Creative Commons Attribution No Derivatives 4.0 International",
    "osi_approved": false,
    "fsf_free_software": false,
    "category": "Non Commercial"
  },
  {
    "id": "OLDAP-2.7",
    "name": "Open LDAP Public License v2.7",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Weakly Copyleft"
  },
  {
    "id": "OLDAP-2.8",
    "name": "Open LDAP Public License v2.8",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Weakly Copyleft"
  },
  {
    "id": "PHP-3.0",
    "name": "PHP License v3.0",
    "osi_approved": true,
    "fsf_free_software": false,
    "category": "Permissive"
  },
  {
    "id": "OFL-1.1-no-rfn",
    "name": "SIL Open Font License 1.1 with no RFN restriction",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "OFL-1.1-rfn",
    "name": "SIL Open Font License 1.1 with RFN",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Permissive"
  },
  {
    "id": "CDDL-1.0",
    "name": "Common Development and Distribution License 1.0",
    "osi_approved": true,
    "fsf_free_software": false,
    "category": "Weakly Copyleft"
  },
  {
    "id": "CDDL-1.1",
    "name": "Common Development and Distribution License 1.1",
    "osi_approved": true,
    "fsf_free_software": false,
    "category": "Weakly Copyleft"
  },
  {
    "id": "CPL-1.0",
    "name": "Common Public License 1.0",
    "osi_approved": true,
    "fsf_free_software": true,
    "category": "Weakly Copyleft"
  }
]"#;

impl SpdxDatabase {
    pub fn load() -> Self {
        Self::new_from_json(EMBEDDED_SPDX_JSON)
    }

    pub fn new_from_json(json_str: &str) -> Self {
        let licenses: Vec<SpdxLicense> =
            serde_json::from_str(json_str).unwrap_or_default();

        let mut license_map = HashMap::new();
        let mut compatibility = HashMap::new();

        for license in &licenses {
            let compatible_ids = Self::compute_compatibility(license, &licenses);
            license_map.insert(license.id.clone(), license.clone());
            compatibility.insert(license.id.clone(), compatible_ids);
        }

        SpdxDatabase {
            licenses: license_map,
            compatibility,
        }
    }

    fn compute_compatibility(
        license: &SpdxLicense,
        all: &[SpdxLicense],
    ) -> Vec<String> {
        let mut compatible = Vec::new();
        for other in all {
            if other.id == license.id {
                continue;
            }
            if Self::are_compatible(license, other) {
                compatible.push(other.id.clone());
            }
        }
        compatible
    }

    fn are_compatible(a: &SpdxLicense, b: &SpdxLicense) -> bool {
        if a.category == "Public Domain" || b.category == "Public Domain" {
            return true;
        }
        if a.category == "Permissive" && b.category == "Permissive" {
            return true;
        }
        if a.category == "Permissive"
            && (b.category == "Weakly Copyleft" || b.category == "Copyleft")
        {
            return true;
        }
        if b.category == "Permissive"
            && (a.category == "Weakly Copyleft" || a.category == "Copyleft")
        {
            return true;
        }
        if a.category == "Weakly Copyleft" && b.category == "Weakly Copyleft" {
            return true;
        }
        if a.category == "Copyleft" && b.category == "Permissive" {
            return true;
        }
        if a.category == "Permissive" && b.category == "Copyleft" {
            return true;
        }
        if a.category == b.category {
            return true;
        }
        if a.category == "Non Commercial" || b.category == "Non Commercial" {
            return false;
        }
        false
    }

    pub fn get_license(&self, id: &str) -> Option<&SpdxLicense> {
        self.licenses.get(id)
    }

    pub fn search(&self, query: &str) -> Vec<&SpdxLicense> {
        let lower_query = query.to_lowercase();
        self.licenses
            .values()
            .filter(|l| {
                l.id.to_lowercase().contains(&lower_query)
                    || l.name.to_lowercase().contains(&lower_query)
            })
            .collect()
    }

    pub fn all_ids(&self) -> Vec<&String> {
        self.licenses.keys().collect()
    }

    pub fn validate_id(&self, id: &str) -> bool {
        self.licenses.contains_key(id)
    }

    pub fn get_compatible(&self, id: &str) -> Vec<String> {
        self.compatibility
            .get(id)
            .cloned()
            .unwrap_or_default()
    }
}

struct Parser<'a> {
    input: &'a str,
    pos: usize,
}

impl<'a> Parser<'a> {
    fn new(input: &'a str) -> Self {
        Parser { input, pos: 0 }
    }

    fn skip_whitespace(&mut self) {
        while self.pos < self.input.len() {
            let ch = self.input.as_bytes()[self.pos];
            if ch == b' ' || ch == b'\t' || ch == b'\n' || ch == b'\r' {
                self.pos += 1;
            } else {
                break;
            }
        }
    }

    fn peek_word(&self) -> Option<&'a str> {
        let saved = self.pos;
        let mut p = self.pos;
        let bytes = self.input.as_bytes();
        while p < bytes.len() {
            let ch = bytes[p];
            if ch == b' '
                || ch == b'\t'
                || ch == b'\n'
                || ch == b'\r'
                || ch == b'('
                || ch == b')'
            {
                break;
            }
            p += 1;
        }
        if p == saved {
            None
        } else {
            Some(&self.input[saved..p])
        }
    }

    fn consume_word(&mut self) -> Option<&'a str> {
        let word = self.peek_word()?;
        self.pos += word.len();
        Some(word)
    }

    fn expect(&mut self, expected: &str) -> Result<(), SpdxError> {
        self.skip_whitespace();
        let remaining = &self.input[self.pos..];
        if remaining.starts_with(expected) {
            self.pos += expected.len();
            Ok(())
        } else {
            Err(SpdxError::InvalidSyntax(format!(
                "expected '{}' at position {}, found '{}'",
                expected,
                self.pos,
                &remaining[..remaining.len().min(expected.len() + 10)]
            )))
        }
    }

    fn parse_operand(&mut self) -> Result<SpdxOperand, SpdxError> {
        self.skip_whitespace();

        if self.pos >= self.input.len() {
            return Err(SpdxError::ParseError(
                "unexpected end of expression".to_string(),
            ));
        }

        let ch = self.input.as_bytes()[self.pos];
        if ch == b'(' {
            self.pos += 1;
            let expr = self.parse_expression(None)?;
            self.expect(")")?;
            return Ok(SpdxOperand::Expression(Box::new(expr)));
        }

        let word = self
            .consume_word()
            .ok_or_else(|| {
                SpdxError::ParseError(format!(
                    "expected license identifier at position {}",
                    self.pos
                ))
            })?;

        if let Some(rest) = word.strip_prefix("LicenseRef-") {
            return Ok(SpdxOperand::LicenseRef(rest.to_string()));
        }

        if let Some(rest) = word.strip_prefix("LicenseRef:") {
            return Ok(SpdxOperand::LicenseRef(rest.to_string()));
        }

        if word.contains('(') || word.contains(')') {
            return Err(SpdxError::InvalidSyntax(format!(
                "unexpected character in license id: '{}'",
                word
            )));
        }

        Ok(SpdxOperand::LicenseId(word.to_string()))
    }

    fn parse_with_exception(
        &mut self,
        left: SpdxOperand,
    ) -> Result<SpdxExpression, SpdxError> {
        self.skip_whitespace();
        let current = &self.input[self.pos..];
        if current.starts_with("WITH") {
            let next_chars = &self.input[self.pos + 4..];
            if next_chars.is_empty()
                || next_chars.as_bytes()[0] == b' '
                || next_chars.as_bytes()[0] == b'\t'
            {
                self.pos += 4;
                let right = self.parse_operand()?;
                return Ok(SpdxExpression {
                    operator: SpdxOperator::With,
                    operands: vec![left, right],
                });
            }
        }
        Ok(SpdxExpression {
            operator: SpdxOperator::Plus,
            operands: vec![left],
        })
    }

    fn parse_expression(
        &mut self,
        min_precedence: Option<u8>,
    ) -> Result<SpdxExpression, SpdxError> {
        let precedence = min_precedence.unwrap_or(0);

        let mut left = {
            let mut operand = self.parse_operand()?;

            self.skip_whitespace();
            let current = &self.input[self.pos..];
            if current.starts_with('+') {
                let next = &self.input[self.pos + 1..];
                let at_end = next.is_empty()
                    || next.as_bytes()[0] == b' '
                    || next.as_bytes()[0] == b'\t'
                    || next.as_bytes()[0] == b'\n'
                    || next.as_bytes()[0] == b'\r'
                    || next.as_bytes()[0] == b')';
                if at_end {
                    self.pos += 1;
                    operand = SpdxOperand::Expression(Box::new(SpdxExpression {
                        operator: SpdxOperator::Plus,
                        operands: vec![operand],
                    }));
                }
            }

            self.parse_with_exception(operand)?
        };

        loop {
            self.skip_whitespace();
            let op = self.detect_operator();
            let op_prec = match op {
                Some(SpdxOperator::And) => 2,
                Some(SpdxOperator::Or) => 1,
                _ => break,
            };

            if op_prec < precedence {
                break;
            }

            let operator = op.unwrap();
            self.pos += match operator {
                SpdxOperator::And => 3,
                SpdxOperator::Or => 2,
                _ => 0,
            };

            let right = self.parse_expression(Some(op_prec + 1))?;

            left = SpdxExpression {
                operator,
                operands: vec![
                    SpdxOperand::Expression(Box::new(left)),
                    SpdxOperand::Expression(Box::new(right)),
                ],
            };
        }

        Ok(left)
    }

    fn detect_operator(&self) -> Option<SpdxOperator> {
        let remaining = &self.input[self.pos..];
        if remaining.starts_with("AND ") || remaining.starts_with("AND\0") {
            return Some(SpdxOperator::And);
        }
        if remaining.starts_with("OR ") || remaining.starts_with("OR\0") {
            return Some(SpdxOperator::Or);
        }
        None
    }
}

impl SpdxExpression {
    pub fn parse(expression: &str) -> Result<Self, SpdxError> {
        let trimmed = expression.trim();
        if trimmed.is_empty() {
            return Err(SpdxError::InvalidSyntax(
                "empty expression".to_string(),
            ));
        }

        let mut parser = Parser::new(trimmed);
        let expr = parser.parse_expression(None)?;
        parser.skip_whitespace();

        if parser.pos < parser.input.len() {
            return Err(SpdxError::InvalidSyntax(format!(
                "unexpected trailing content: '{}'",
                &parser.input[parser.pos..]
            )));
        }

        Ok(expr)
    }

    pub fn validate(&self, db: &SpdxDatabase) -> Result<(), SpdxError> {
        for operand in &self.operands {
            match operand {
                SpdxOperand::LicenseId(id) => {
                    if !db.validate_id(id) {
                        return Err(SpdxError::UnknownLicense(id.clone()));
                    }
                }
                SpdxOperand::LicenseRef(_) => {}
                SpdxOperand::Expression(expr) => {
                    expr.validate(db)?;
                }
            }
        }

        if self.operator == SpdxOperator::And {
            for i in 0..self.operands.len() {
                for j in (i + 1)..self.operands.len() {
                    let a_id = self.operand_license_id(&self.operands[i]);
                    let b_id = self.operand_license_id(&self.operands[j]);
                    if let (Some(a), Some(b)) = (&a_id, &b_id) {
                        if !db.get_compatible(a).contains(b) {
                            return Err(
                                SpdxError::IncompatibleCombination(
                                    a.clone(),
                                    b.clone(),
                                ),
                            );
                        }
                    }
                }
            }
        }

        Ok(())
    }

    fn operand_license_id(&self, operand: &SpdxOperand) -> Option<String> {
        match operand {
            SpdxOperand::LicenseId(id) => Some(id.clone()),
            SpdxOperand::Expression(expr) => {
                expr.operands
                    .first()
                    .and_then(|o| self.operand_license_id(o))
            }
            SpdxOperand::LicenseRef(_) => None,
        }
    }

    pub fn to_string(&self) -> String {
        match self.operator {
            SpdxOperator::Plus => {
                if let Some(op) = self.operands.first() {
                    format!("{}+", self.operand_to_string(op))
                } else {
                    "+".to_string()
                }
            }
            SpdxOperator::With => {
                let left = self
                    .operands
                    .get(0)
                    .map(|o| self.operand_to_string(o))
                    .unwrap_or_default();
                let right = self
                    .operands
                    .get(1)
                    .map(|o| self.operand_to_string(o))
                    .unwrap_or_default();
                format!("{} WITH {}", left, right)
            }
            SpdxOperator::And => {
                let parts: Vec<String> = self
                    .operands
                    .iter()
                    .map(|o| self.operand_to_string(o))
                    .collect();
                parts.join(" AND ")
            }
            SpdxOperator::Or => {
                let parts: Vec<String> = self
                    .operands
                    .iter()
                    .map(|o| self.operand_to_string(o))
                    .collect();
                parts.join(" OR ")
            }
        }
    }

    fn operand_to_string(&self, operand: &SpdxOperand) -> String {
        match operand {
            SpdxOperand::LicenseId(id) => id.clone(),
            SpdxOperand::LicenseRef(name) => format!("LicenseRef-{}", name),
            SpdxOperand::Expression(expr) => {
                let inner = expr.to_string();
                if self.operator == SpdxOperator::Plus
                    || self.operator == SpdxOperator::With
                {
                    if expr.operator == SpdxOperator::And
                        || expr.operator == SpdxOperator::Or
                    {
                        format!("({})", inner)
                    } else {
                        inner
                    }
                } else {
                    inner
                }
            }
        }
    }

    pub fn to_license_ref(custom_name: &str) -> String {
        let sanitized: String = custom_name
            .chars()
            .map(|c| {
                if c.is_alphanumeric() || c == '-' || c == '_' || c == '.' {
                    c
                } else {
                    '-'
                }
            })
            .collect();

        let namespace = Uuid::NAMESPACE_URL;
        let unique_id = Uuid::new_v5(&namespace, custom_name.as_bytes());
        let short_id = &unique_id.to_string()[..8];

        format!("LicenseRef-{}-{}", sanitized, short_id)
    }

    pub fn generate_unique_id() -> String {
        let id = Uuid::new_v4();
        id.to_string()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn test_db() -> SpdxDatabase {
        SpdxDatabase::new_from_json(EMBEDDED_SPDX_JSON)
    }

    #[test]
    fn test_database_load() {
        let db = test_db();
        assert!(db.get_license("MIT").is_some());
        assert!(db.get_license("Apache-2.0").is_some());
        assert!(db.get_license("GPL-3.0-or-later").is_some());
    }

    #[test]
    fn test_search() {
        let db = test_db();
        let results = db.search("GNU");
        assert!(results.len() >= 6);
        let results = db.search("MIT");
        assert!(!results.is_empty());
        assert!(results.iter().any(|l| l.id == "MIT"));
    }

    #[test]
    fn test_validate_id() {
        let db = test_db();
        assert!(db.validate_id("MIT"));
        assert!(db.validate_id("Apache-2.0"));
        assert!(!db.validate_id("NONEXISTENT-1.0"));
    }

    #[test]
    fn test_all_ids() {
        let db = test_db();
        let ids = db.all_ids();
        assert!(ids.len() > 50);
        assert!(ids.iter().any(|id| id.as_str() == "MIT"));
    }

    #[test]
    fn test_compatible() {
        let db = test_db();
        let compat = db.get_compatible("MIT");
        assert!(compat.contains(&"Apache-2.0".to_string()));
    }

    #[test]
    fn test_parse_simple() {
        let expr = SpdxExpression::parse("MIT").unwrap();
        assert_eq!(expr.operator, SpdxOperator::Plus);
    }

    #[test]
    fn test_parse_and() {
        let expr = SpdxExpression::parse("MIT AND Apache-2.0").unwrap();
        assert_eq!(expr.operator, SpdxOperator::And);
        assert_eq!(expr.operands.len(), 2);
    }

    #[test]
    fn test_parse_or() {
        let expr = SpdxExpression::parse("MIT OR Apache-2.0").unwrap();
        assert_eq!(expr.operator, SpdxOperator::Or);
        assert_eq!(expr.operands.len(), 2);
    }

    #[test]
    fn test_parse_with() {
        let expr = SpdxExpression::parse("GPL-2.0-only WITH Classpath-exception-2.0").unwrap();
        assert_eq!(expr.operator, SpdxOperator::With);
        assert_eq!(expr.operands.len(), 2);
    }

    #[test]
    fn test_parse_complex() {
        let expr = SpdxExpression::parse("MIT AND (Apache-2.0 OR GPL-2.0-only)").unwrap();
        assert_eq!(expr.operator, SpdxOperator::And);
    }

    #[test]
    fn test_parse_license_ref() {
        let expr = SpdxExpression::parse("LicenseRef-custom-mypackage").unwrap();
        assert_eq!(expr.operator, SpdxOperator::Plus);
        match &expr.operands[0] {
            SpdxOperand::LicenseRef(name) => assert_eq!(name, "custom-mypackage"),
            _ => panic!("expected LicenseRef"),
        }
    }

    #[test]
    fn test_parse_error_empty() {
        assert!(SpdxExpression::parse("").is_err());
    }

    #[test]
    fn test_parse_error_trailing() {
        assert!(SpdxExpression::parse("MIT extra").is_err());
    }

    #[test]
    fn test_to_string_simple() {
        let expr = SpdxExpression::parse("MIT").unwrap();
        assert_eq!(expr.to_string(), "MIT+");
    }

    #[test]
    fn test_to_string_and() {
        let expr = SpdxExpression::parse("MIT AND Apache-2.0").unwrap();
        assert_eq!(expr.to_string(), "MIT+ AND Apache-2.0+");
    }

    #[test]
    fn test_to_string_or() {
        let expr = SpdxExpression::parse("MIT OR Apache-2.0").unwrap();
        assert_eq!(expr.to_string(), "MIT+ OR Apache-2.0+");
    }

    #[test]
    fn test_validate_valid() {
        let db = test_db();
        let expr = SpdxExpression::parse("MIT AND Apache-2.0").unwrap();
        assert!(expr.validate(&db).is_ok());
    }

    #[test]
    fn test_validate_unknown() {
        let db = test_db();
        let expr = SpdxExpression::parse("NONEXISTENT-1.0").unwrap();
        assert!(expr.validate(&db).is_err());
    }

    #[test]
    fn test_to_license_ref() {
        let reference = SpdxExpression::to_license_ref("my-custom-package");
        assert!(reference.starts_with("LicenseRef-"));
        assert!(reference.contains("my-custom-package"));
    }

    #[test]
    fn test_to_license_ref_special_chars() {
        let reference = SpdxExpression::to_license_ref("my/special package!");
        assert!(reference.starts_with("LicenseRef-"));
        assert!(reference.contains("my-special-package-"));
    }

    #[test]
    fn test_new_from_json_invalid() {
        let db = SpdxDatabase::new_from_json("not valid json");
        assert!(db.licenses.is_empty());
    }

    #[test]
    fn test_generate_unique_id() {
        let id1 = SpdxExpression::generate_unique_id();
        let id2 = SpdxExpression::generate_unique_id();
        assert_ne!(id1, id2);
    }

    #[test]
    fn test_to_license_ref_deterministic() {
        let r1 = SpdxExpression::to_license_ref("same-name");
        let r2 = SpdxExpression::to_license_ref("same-name");
        assert_eq!(r1, r2);
    }
}
