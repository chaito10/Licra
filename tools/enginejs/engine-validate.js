// Ported from src/validator.rs (GLG Rust -> JS)
(function(){
  if (typeof window !== 'undefined') window.GLGEngine = window.GLGEngine || {};
  var NS = (typeof window !== 'undefined') ? window.GLGEngine :
           (typeof self !== 'undefined' ? self : globalThis).GLGEngine = (typeof self !== 'undefined' ? self : globalThis).GLGEngine || {};

  var MIN_TEXT_LENGTH = 50;
  var MAX_TEXT_LENGTH = 100000;

  var COMMON_COPYRIGHT_KEYWORDS = ["copyright", "(c)", "(C)", "all rights reserved"];
  var COMMON_WARRANTY_KEYWORDS = ["warranty", "disclaim", "as is", "as-is", "without warranty", "no warranty", "provided \"as is\""];

  var KNOWN_TEMPLATE_VARIABLES = {
    "year": true, "copyright_holder": true, "project_name": true,
    "commercial_contact": true, "license_a": true, "license_b": true,
    "change_date": true, "change_license": true, "allowed_uses": true,
    "cla_url": true, "company_name": true, "core_license": true,
    "features_url": true, "oem_contact": true, "warranty_days": true,
    "expiration_date": true, "subscription_period": true, "pricing": true,
    "evaluation_days": true, "max_seats": true, "commercial_conditions": true
  };

  var SPDX_DB_JSON = '{"MIT":1,"Apache-2.0":1,"GPL-2.0-only":1,"GPL-2.0-or-later":1,"GPL-3.0-only":1,"GPL-3.0-or-later":1,"LGPL-2.1-only":1,"LGPL-2.1-or-later":1,"LGPL-3.0-only":1,"LGPL-3.0-or-later":1,"BSD-2-Clause":1,"BSD-3-Clause":1,"BSD-4-Clause":0,"ISC":1,"MPL-2.0":1,"AGPL-3.0-only":1,"AGPL-3.0-or-later":1,"Unlicense":1,"0BSD":1,"CC0-1.0":1,"CC-BY-4.0":1,"CC-BY-SA-4.0":1,"Zlib":1,"Artistic-2.0":1,"BSL-1.0":1,"EPL-1.0":1,"EPL-2.0":1,"EUPL-1.1":1,"EUPL-1.2":1,"IPA":1,"LATEX2e":1,"LiliQ-R-1.1":1,"LiliQ-Rplus-1.1":1,"LiliQ-R-Spec-1.1":1,"LiliQ-Rplus-Spec-1.1":1,"MS-PL":1,"MS-RL":1,"NCSA":1,"OFL-1.1":1,"OSL-3.0":1,"PostgreSQL":1,"Python-2.0":1,"QPL-1.0":1,"Ruby":0,"SGI-B-1.0":0,"SSH-OpenSSH":0,"Unicode-DFS-2016":1,"UPL-1.0":1,"VCL-1.0":0,"W3C":1,"WTFPL":0,"X11":0,"Xnet":1,"ZPL-2.1":0,"CC-PDDC":0,"CC-BY-1.0":0,"CC-BY-2.0":0,"CC-BY-2.5":0,"CC-BY-3.0":0,"CC-BY-SA-1.0":0,"CC-BY-SA-2.0":0,"CC-BY-SA-2.5":0,"CC-BY-SA-3.0":0,"CC-BY-NC-1.0":0,"CC-BY-NC-2.0":0,"CC-BY-NC-2.5":0,"CC-BY-NC-3.0":0,"CC-BY-NC-4.0":0,"CC-BY-NC-SA-1.0":0,"CC-BY-NC-SA-2.0":0,"CC-BY-NC-SA-2.5":0,"CC-BY-NC-SA-3.0":0,"CC-BY-NC-SA-4.0":0,"CC-BY-ND-1.0":0,"CC-BY-ND-2.0":0,"CC-BY-ND-2.5":0,"CC-BY-ND-3.0":0,"CC-BY-ND-4.0":0,"OLDAP-2.7":1,"OLDAP-2.8":1,"PHP-3.0":1,"OFL-1.1-no-rfn":1,"OFL-1.1-rfn":1,"CDDL-1.0":1,"CDDL-1.1":1,"CPL-1.0":1}';
  var CLAUSE_DB_JSON = '[["MIT-PERMISSION","permission",[],["NO-COMMERCIAL","RESTRICTED-USE"]],["MIT-CONDITION","condition",["MIT-PERMISSION"],[]],["MIT-WARRANTY","warranty",[],[]],["APACHE-PERMISSION","permission",[],["NO-COMMERCIAL"]],["APACHE-PATENT","patent",["APACHE-PERMISSION"],["NO-PATENT-GRANT"]],["GPL-COPYLEFT","condition",[],["NO-COPYLEFT","PROPRIETARY"]],["BSD-2-PERMISSION","permission",[],["NO-COMMERCIAL"]],["BSD-2-DISCLAIMER","warranty",[],[]],["BSD-3-ADVERTISING","condition",["BSD-2-PERMISSION"],[]],["ISC-PERMISSION","permission",[],["NO-COMMERCIAL"]],["ISC-DISCLAIMER","warranty",[],[]],["UNLICENSE","permission",[],["COPYRIGHT-ONLY","PROPRIETARY","COMMERCIAL-EXCEPTION"]],["CC0-PERMISSION","permission",[],["COPYRIGHT-ONLY","PROPRIETARY"]],["MPL-CONDITION","condition",[],["PROPRIETARY"]],["LGPL-STATIC","condition",[],["PROPRIETARY"]],["PATENT-RETALIATION","patent",[],[]],["NO-COMMERCIAL","restriction",[],["MIT-PERMISSION","BSD-2-PERMISSION","ISC-PERMISSION","APACHE-PERMISSION"]],["ATTRIBUTION","condition",[],[]],["NO-TRADemark","restriction",[],[]],["SOURCE-DISCLOSURE","condition",[],["PROPRIETARY"]],["NETWORK-COPYLEFT","condition",[],["PROPRIETARY","NO-COPYLEFT"]],["COPYRIGHT-NOTICE","condition",[],[]],["DUAL-LICENSE","meta",[],["SINGLE-LICENSE"]],["BUSL-RESTRICTION","restriction",[],[]],["SSPL-CONDITION","condition",[],["PROPRIETARY"]],["POLYFORM-RESTRICTION","restriction",[],[]],["AI-TRAINING-RESTRICTION","restriction",[],[]],["EXPORT-CONTROL","compliance",[],[]],["TERMINATION","termination",[],[]],["REVISION","meta",[],[]],["GOVERNMENT-USE","permission",[],[]],["CONTRIBUTION-CLA","meta",[],[]],["DRM-RESTRICTION","restriction",[],[]],["SUBSCRIPTION-LICENSE","commercial",[],[]],["EVALUATION-LICENSE","commercial",[],[]],["OPEN-CORE","commercial",[],[]],["TELEMETRY-NOTICE","privacy",[],["PRIVACY-NO-TELEMETRY"]],["HEALTHCARE-RESTRICTION","compliance",[],[]],["NUCLEAR-RESTRICTION","compliance",[],[]],["MILITARY-RESTRICTION","compliance",[],[]],["DERIVATIVE-WORKS-ALLOW","permission",[],["NO-DERIVATIVES"]],["NO-DERIVATIVES","restriction",[],["DERIVATIVE-WORKS-ALLOW","GPL-COPYLEFT","MIT-PERMISSION","BSD-2-PERMISSION","ISC-PERMISSION"]],["PER-SEAT-LICENSE","commercial",[],[]],["PER-COMPANY-LICENSE","commercial",[],[]],["RESALE-RESTRICTION","restriction",[],[]],["CLOUD-HOSTING","permission",[],[]],["CONTAINER-RIGHTS","permission",[],[]],["OEM-LICENSE","commercial",[],[]],["WARRANTY-PROVIDED","warranty",[],["MIT-WARRANTY","BSD-2-DISCLAIMER","ISC-DISCLAIMER"]],["LIABILITY-CAPPED","liability",[],[]],["EXPIRATION","termination",[],[]],["PRIVACY-NO-TELEMETRY","privacy",[],["TELEMETRY-NOTICE"]],["EDUCATION-EXCEPTION","permission",[],[]],["NONPROFIT-EXCEPTION","permission",[],[]],["COMMERICAL-EXCEPTION","commercial",[],[]]]';

  function buildSpdxDb() {
    var map = JSON.parse(SPDX_DB_JSON);
    var out = {};
    for (var k in map) {
      if (Object.prototype.hasOwnProperty.call(map, k)) out[k] = !!map[k];
    }
    return out;
  }

  function buildClauseDb() {
    var rows = JSON.parse(CLAUSE_DB_JSON);
    var out = [];
    for (var i = 0; i < rows.length; i++) {
      out.push({ name: rows[i][0], category: rows[i][1], dependencies: rows[i][2], conflicts: rows[i][3] });
    }
    return out;
  }

  var SPDX_DB = buildSpdxDb();
  var CLAUSE_DB = buildClauseDb();

  function utf8ByteLength(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      if (c < 128) {
        len += 1;
      } else if (c < 2048) {
        len += 2;
      } else if (c >= 55296 && c <= 56319 && i + 1 < str.length) {
        var c2 = str.charCodeAt(i + 1);
        if (c2 >= 56320 && c2 <= 57343) {
          len += 4;
          i++;
        } else {
          len += 3;
        }
      } else {
        len += 3;
      }
    }
    return len;
  }

  function coerceText(text) {
    if (text == null) return "";
    return String(text);
  }

  function hasAnyKeyword(lowerText, keywords) {
    for (var i = 0; i < keywords.length; i++) {
      if (lowerText.indexOf(keywords[i]) !== -1) return true;
    }
    return false;
  }

  function errorMissingClause(clause) {
    return { type: "MissingClause", clause: clause, message: "Missing required clause: " + clause };
  }

  function errorConflictingClauses(clauseA, clauseB) {
    return { type: "ConflictingClauses", clause_a: clauseA, clause_b: clauseB, message: "Conflicting clauses: " + clauseA + " and " + clauseB };
  }

  function errorInvalidSpdx(identifier) {
    return { type: "InvalidSpdx", identifier: identifier, message: "Invalid SPDX identifier: " + identifier };
  }

  function errorBrokenReference(reference) {
    return { type: "BrokenReference", reference: reference, message: "Broken reference: " + reference };
  }

  function errorMissingCopyrightNotice() {
    return { type: "MissingCopyrightNotice", message: "Missing copyright notice" };
  }

  function errorMissingWarrantyDisclaimer() {
    return { type: "MissingWarrantyDisclaimer", message: "Missing warranty disclaimer" };
  }

  function errorInvalidTemplateVariable(variable, clause) {
    return { type: "InvalidTemplateVariable", variable: variable, clause: clause, message: "Invalid template variable: " + variable + " in clause " + clause };
  }

  function errorTooShort(length) {
    return { type: "TooShort", length: length, message: "License text too short: " + length + " characters" };
  }

  function errorTooLong(length) {
    return { type: "TooLong", length: length, message: "License text too long: " + length + " characters" };
  }

  function warnNonStandardSpdx(identifier) {
    return { type: "NonStandardSpdx", identifier: identifier, message: "Non-standard SPDX identifier: " + identifier };
  }

  function warnPotentiallyConflicting(clauseA, clauseB) {
    return { type: "PotentiallyConflicting", clause_a: clauseA, clause_b: clauseB, message: "Potentially conflicting clause combination: " + clauseA + ", " + clauseB };
  }

  function warnMissingRecommended(clause) {
    return { type: "MissingRecommended", clause: clause, message: "Missing recommended clause: " + clause };
  }

  function warnUnusualOrdering() {
    return { type: "UnusualOrdering", message: "Unusual clause ordering" };
  }

  function warnMayNotBeOsiApproved() {
    return { type: "MayNotBeOsiApproved", message: "License may not be OSI approved" };
  }

  function spdxHas(id) {
    return Object.prototype.hasOwnProperty.call(SPDX_DB, id);
  }

  function getClauseByName(name) {
    for (var i = 0; i < CLAUSE_DB.length; i++) {
      if (CLAUSE_DB[i].name === name) return CLAUSE_DB[i];
    }
    return null;
  }

  function checkConflicts(names) {
    var included = [];
    var i, j, k;
    for (i = 0; i < names.length; i++) {
      var found = getClauseByName(names[i]);
      if (found) included.push(found);
    }
    for (i = 0; i < included.length; i++) {
      var conflicts = included[i].conflicts;
      for (j = 0; j < conflicts.length; j++) {
        var conflictName = conflicts[j];
        for (k = 0; k < names.length; k++) {
          if (names[k] === conflictName) {
            return { kind: "ConflictingClauses", a: included[i].name, b: conflictName };
          }
        }
      }
    }
    return null;
  }

  function validateDependencies(names) {
    var resolved = [];
    var i, j, k;
    for (i = 0; i < names.length; i++) {
      var name = names[i];
      var clause = getClauseByName(name);
      if (!clause) return { kind: "NotFound", name: name };
      resolved.push(clause);
      for (j = 0; j < clause.dependencies.length; j++) {
        var dep = clause.dependencies[j];
        var depInNames = false;
        for (k = 0; k < names.length; k++) {
          if (names[k] === dep) {
            depInNames = true;
            break;
          }
        }
        if (!depInNames) {
          return { kind: "MissingDependency", clause: name, dependency: dep };
        }
        var depResolved = false;
        for (k = 0; k < resolved.length; k++) {
          if (resolved[k].name === dep) {
            depResolved = true;
            break;
          }
        }
        if (!depResolved) {
          var depClause = getClauseByName(dep);
          if (!depClause) return { kind: "NotFound", name: dep };
          resolved.push(depClause);
        }
      }
    }
    return { kind: "Ok", resolved: resolved };
  }

  function warningsFromDependencyError(dependency, errors) {
    errors.push(errorMissingClause(dependency));
  }

  function normalizedClauseCategory(clause) {
    if (!clause || clause.category == null) return "";
    return String(clause.category).toLowerCase();
  }

  function LicenseValidator() {
    this.clause_db = CLAUSE_DB;
    this.spdx_db = SPDX_DB;
  }

  LicenseValidator.prototype.validateStructure = function(text) {
    text = coerceText(text);
    var errors = [];
    var length = utf8ByteLength(text);
    if (length < MIN_TEXT_LENGTH) {
      errors.push(errorTooShort(length));
    }
    if (length > MAX_TEXT_LENGTH) {
      errors.push(errorTooLong(length));
    }
    return errors;
  };

  LicenseValidator.prototype.validateTemplateVariables = function(text) {
    text = coerceText(text);
    var errors = [];
    var re = /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g;
    var match;
    while ((match = re.exec(text)) !== null) {
      var varName = match[1];
      if (!Object.prototype.hasOwnProperty.call(KNOWN_TEMPLATE_VARIABLES, varName)) {
        errors.push(errorInvalidTemplateVariable(varName, ""));
      }
    }
    return errors;
  };

  LicenseValidator.prototype.validateSpdx = function(spdxId) {
    if (typeof spdxId !== "string") spdxId = (spdxId == null) ? "" : String(spdxId);
    return spdxHas(spdxId);
  };

  LicenseValidator.prototype.validateClauses = function(clauses) {
    var errors = [];
    clauses = clauses || [];
    var i, j;
    var clauseNames = [];
    for (i = 0; i < clauses.length; i++) {
      clauseNames.push(clauses[i].name);
    }

    var conflict = checkConflicts(clauseNames);
    if (conflict) {
      errors.push(errorConflictingClauses(conflict.a, conflict.b));
    }

    var depResult = validateDependencies(clauseNames);
    if (depResult.kind === "MissingDependency") {
      errors.push(errorMissingClause(depResult.dependency));
      warningsFromDependencyError(depResult.dependency, errors);
    } else if (depResult.kind === "NotFound") {
      errors.push(errorBrokenReference(depResult.name));
    }

    for (i = 0; i < clauses.length; i++) {
      var templateErrors = this.validateTemplateVariables(clauses[i].content);
      for (j = 0; j < templateErrors.length; j++) {
        var err = templateErrors[j];
        if (err.type === "InvalidTemplateVariable") {
          errors.push(errorInvalidTemplateVariable(err.variable, clauses[i].name));
        }
      }
    }

    return errors;
  };

  LicenseValidator.prototype.checkCompleteness = function(license) {
    license = license || {};
    var metadata = license.metadata || {};
    var score = 0;
    var totalChecks = 12;

    if ((metadata.name || "").trim() !== "") score += 1;
    if ((metadata.description || "").trim() !== "") score += 1;
    if ((metadata.authors || []).length > 0) score += 1;
    if ((license.preamble || "").trim() !== "") score += 1;
    if ((license.clauses || []).length > 0) score += 1;
    if ((license.warranty_disclaimer || "").trim() !== "") score += 1;

    var textLower = (license.full_text || "").toLowerCase();
    if (hasAnyKeyword(textLower, COMMON_COPYRIGHT_KEYWORDS)) score += 1;
    if (hasAnyKeyword(textLower, COMMON_WARRANTY_KEYWORDS)) score += 1;

    if (metadata.spdx_id != null) score += 1;
    if ((license.conditions || []).length > 0) score += 1;
    if ((license.permissions || []).length > 0) score += 1;
    if (license.patent_grant != null) score += 1;

    var percentage = Math.floor((score * 100) / totalChecks);
    return percentage < 100 ? percentage : 100;
  };

  LicenseValidator.prototype.checkPotentialConflicts = function(clauseNames, warnings) {
    var restrictionClauses = [];
    var permissionClauses = [];
    var i, j, name, clause;
    for (i = 0; i < clauseNames.length; i++) {
      name = clauseNames[i];
      clause = getClauseByName(name);
      if (clause) {
        if (clause.category === "restriction") restrictionClauses.push(name);
        if (clause.category === "permission") permissionClauses.push(name);
      }
    }

    if (restrictionClauses.length > 2 && permissionClauses.length < 2) {
      for (i = 0; i < restrictionClauses.length; i++) {
        for (j = i + 1; j < restrictionClauses.length; j++) {
          var a = getClauseByName(restrictionClauses[i]);
          var b = getClauseByName(restrictionClauses[j]);
          if (a && b) {
            if (a.conflicts.indexOf(b.name) === -1 && b.conflicts.indexOf(a.name) === -1) {
              warnings.push(warnPotentiallyConflicting(a.name, b.name));
            }
          }
        }
      }
    }

    for (i = 0; i < clauseNames.length; i++) {
      name = clauseNames[i];
      clause = getClauseByName(name);
      if (clause && clause.category === "warranty") {
        var hasOtherWarranty = false;
        for (j = 0; j < clauseNames.length; j++) {
          var other = clauseNames[j];
          if (other !== name) {
            var oc = getClauseByName(other);
            if (oc && oc.category === "warranty") {
              hasOtherWarranty = true;
              break;
            }
          }
        }
        if (hasOtherWarranty) {
          warnings.push(warnPotentiallyConflicting(name, "multiple warranty clauses present"));
        }
      }
    }
  };

  LicenseValidator.prototype.validateText = function(text) {
    text = coerceText(text);
    var errors = [];
    var warnings = [];
    var i;

    var textErrors = this.validateStructure(text);
    for (i = 0; i < textErrors.length; i++) errors.push(textErrors[i]);

    var templateErrors = this.validateTemplateVariables(text);
    for (i = 0; i < templateErrors.length; i++) errors.push(templateErrors[i]);

    var textLower = text.toLowerCase();
    if (!hasAnyKeyword(textLower, COMMON_COPYRIGHT_KEYWORDS)) {
      errors.push(errorMissingCopyrightNotice());
    }

    if (!hasAnyKeyword(textLower, COMMON_WARRANTY_KEYWORDS)) {
      errors.push(errorMissingWarrantyDisclaimer());
    }

    var length = utf8ByteLength(text);
    if (errors.length === 0 && length < 200) {
      warnings.push(warnMissingRecommended("More detailed permission grant"));
    }

    var isValid = errors.length === 0;
    var score;
    if (isValid) {
      score = length >= 200 ? 70 : 50;
    } else {
      var base = 30 - errors.length * 10;
      score = base < 0 ? 0 : base;
    }

    return { is_valid: isValid, errors: errors, warnings: warnings, score: score };
  };

  LicenseValidator.prototype.validateLicense = function(license) {
    license = license || {};
    var metadata = license.metadata || {};
    var fullText = license.full_text == null ? "" : String(license.full_text);
    var clauses = license.clauses || [];
    var warrantyDisclaimer = license.warranty_disclaimer == null ? "" : String(license.warranty_disclaimer);

    var errors = [];
    var warnings = [];
    var i;

    var textErrors = this.validateStructure(fullText);
    for (i = 0; i < textErrors.length; i++) errors.push(textErrors[i]);

    var clauseErrors = this.validateClauses(clauses);
    for (i = 0; i < clauseErrors.length; i++) errors.push(clauseErrors[i]);

    if (metadata.spdx_id != null) {
      var spdxId = String(metadata.spdx_id);
      if (!this.validateSpdx(spdxId)) {
        errors.push(errorInvalidSpdx(spdxId));
      } else if (!this.validateSpdx(spdxId)) {
        warnings.push(warnNonStandardSpdx(spdxId));
        if (spdxHas(spdxId)) {
          if (!SPDX_DB[spdxId]) {
            warnings.push(warnMayNotBeOsiApproved());
          }
        }
      }
    }

    if (warrantyDisclaimer.trim() === "") {
      errors.push(errorMissingWarrantyDisclaimer());
    }

    var textLower = fullText.toLowerCase();
    if (!hasAnyKeyword(textLower, COMMON_COPYRIGHT_KEYWORDS)) {
      errors.push(errorMissingCopyrightNotice());
    }

    var templateErrors = this.validateTemplateVariables(fullText);
    for (i = 0; i < templateErrors.length; i++) errors.push(templateErrors[i]);

    if (!hasAnyKeyword(textLower, COMMON_WARRANTY_KEYWORDS) && warrantyDisclaimer.trim() === "") {
      warnings.push(warnMissingRecommended("Warranty disclaimer"));
    }

    var clauseNames = [];
    var hasPermission = false;
    var hasCondition = false;
    for (i = 0; i < clauses.length; i++) {
      var c = clauses[i];
      clauseNames.push(c.name);
      var cat = normalizedClauseCategory(c);
      if (cat === "permission") hasPermission = true;
      if (cat === "condition") hasCondition = true;
    }

    if (!hasPermission) {
      warnings.push(warnMissingRecommended("Permission grant"));
    }
    if (!hasCondition) {
      warnings.push(warnMissingRecommended("Condition clause"));
    }

    this.checkPotentialConflicts(clauseNames, warnings);

    if (clauses.length >= 2) {
      var priorities = [];
      for (i = 0; i < clauses.length; i++) priorities.push(clauses[i].priority);
      var sorted = priorities.slice(0);
      sorted.sort(function (a, b) { return a - b; });
      var inOrder = true;
      for (i = 0; i < priorities.length; i++) {
        if (priorities[i] !== sorted[i]) {
          inOrder = false;
          break;
        }
      }
      if (!inOrder) {
        warnings.push(warnUnusualOrdering());
      }
    }

    var score = this.checkCompleteness(license);
    var isValid = errors.length === 0;

    return { is_valid: isValid, errors: errors, warnings: warnings, score: score };
  };

  var defaultValidator = new LicenseValidator();

  NS.Validate = {
    validateLicense: function (license) { return defaultValidator.validateLicense(license); },
    validateText: function (text) { return defaultValidator.validateText(text); },
    validateSpdx: function (spdxId) { return defaultValidator.validateSpdx(spdxId); },
    validateClauses: function (clauses) { return defaultValidator.validateClauses(clauses); },
    validateStructure: function (text) { return defaultValidator.validateStructure(text); },
    checkCompleteness: function (license) { return defaultValidator.checkCompleteness(license); },
    validateTemplateVariables: function (text) { return defaultValidator.validateTemplateVariables(text); },
    LicenseValidator: LicenseValidator
  };
})();