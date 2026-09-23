(function () {
  if (typeof window !== 'undefined') window.GLGEngine = window.GLGEngine || {};
  var ROOT = (typeof window !== 'undefined') ? window : (typeof self !== 'undefined' ? self : globalThis);
  ROOT.GLGEngine = ROOT.GLGEngine || {};
  var NS = ROOT.GLGEngine;

  // Ported from src/clauses.rs + src/compiler.rs (GLG Rust -> JS)

  function data() { return GLG_DATA; }

  // ── AnswerValue helpers (serde external-tag shape) ─────────────────────────
  function getAnswerBoolean(answers, id) {
    for (var i = 0; i < answers.length; i++) {
      var a = answers[i];
      if (a.question_id === id) {
        var v = a.value;
        if (v && v.Boolean !== undefined) return v.Boolean;
        if (v && v.Choice !== undefined) return v.Choice === 'true' || v.Choice === 'yes' || v.Choice === '1';
        return false;
      }
    }
    return false;
  }
  function getAnswerChoice(answers, id) {
    for (var i = 0; i < answers.length; i++) {
      var a = answers[i];
      if (a.question_id === id) {
        var v = a.value;
        if (v && v.Choice !== undefined) return v.Choice;
        if (v && v.Text !== undefined) return v.Text;
        return null;
      }
    }
    return null;
  }
  function getAnswerMultiChoice(answers, id) {
    for (var i = 0; i < answers.length; i++) {
      var a = answers[i];
      if (a.question_id === id) {
        var v = a.value;
        if (v && v.MultiChoice !== undefined) return v.MultiChoice.slice();
        if (v && v.Text !== undefined) return v.Text.split(',').map(function (s) { return s.trim(); });
        return [];
      }
    }
    return [];
  }
  function getAnswerText(answers, id) {
    for (var i = 0; i < answers.length; i++) {
      var a = answers[i];
      if (a.question_id === id) {
        var v = a.value;
        if (v && v.Text !== undefined) return v.Text;
        if (v && v.Choice !== undefined) return v.Choice;
        return null;
      }
    }
    return null;
  }
  function getAnswerNumber(answers, id) {
    for (var i = 0; i < answers.length; i++) {
      var a = answers[i];
      if (a.question_id === id) {
        var v = a.value;
        if (v && v.Number !== undefined) return v.Number;
        if (v && v.Text !== undefined) { var n = parseInt(v.Text, 10); return isNaN(n) ? null : n; }
        if (v && v.Choice !== undefined) { var n2 = parseInt(v.Choice, 10); return isNaN(n2) ? null : n2; }
        return null;
      }
    }
    return null;
  }
  function requestDualLicense(answers) {
    var a = getAnswerText(answers, 'dual_license_a');
    var b = getAnswerText(answers, 'dual_license_b');
    if (a == null || b == null) return null;
    if (a === '' || b === '') return null;
    return [a, b];
  }

  // ── ClauseDatabase ─────────────────────────────────────────────────────────
  function ClauseDatabase(clauses) {
    this.clauses = clauses || [];
  }
  ClauseDatabase.prototype.getByUuid = function (uuid) {
    for (var i = 0; i < this.clauses.length; i++) if (this.clauses[i].uuid === uuid) return this.clauses[i];
    return null;
  };
  ClauseDatabase.prototype.getByName = function (name) {
    for (var i = 0; i < this.clauses.length; i++) if (this.clauses[i].name === name) return this.clauses[i];
    return null;
  };
  ClauseDatabase.prototype.validateDependencies = function (names) {
    var resolved = [];
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      var clause = this.getByName(name);
      if (!clause) throw { name: 'ClauseError', kind: 'NotFound', clause: name };
      resolved.push(clause);
      for (var d = 0; d < clause.dependencies.length; d++) {
        var depName = clause.dependencies[d];
        if (names.indexOf(depName) === -1) {
          throw { name: 'ClauseError', kind: 'MissingDependency', clause: name, dependency: depName };
        }
        var has = false;
        for (var r = 0; r < resolved.length; r++) if (resolved[r].name === depName) { has = true; break; }
        if (!has) {
          var depClause = this.getByName(depName);
          if (!depClause) throw { name: 'ClauseError', kind: 'NotFound', clause: depName };
          resolved.push(depClause);
        }
      }
    }
    return resolved;
  };

  var PERMISSION = 'permission', CONDITION = 'condition', RESTRICTION = 'restriction',
      PATENT = 'patent', TRADEMARK = 'trademark', WARRANTY = 'warranty', LIABILITY = 'liability',
      TERMINATION = 'termination', PRIVACY = 'privacy', COMPLIANCE = 'compliance',
      COMMERCIAL = 'commercial', META = 'meta';

  // ── LicenseCompiler ────────────────────────────────────────────────────────
  function LicenseCompiler() {
    this.clauseDb = new ClauseDatabase(data().clauses);
  }

  LicenseCompiler.prototype.compile = function (request) {
    var self = this;
    // 1. validate
    this.validateRequest(request);

    // 2. select clauses
    var selectedNames = this.selectClauses(request.answers);

    // 3. variables
    var variables = this.buildVariables(request);

    // 4. compile each clause
    var compiledClauses = [];
    var warnings = [];
    var skipped = [];
    for (var i = 0; i < selectedNames.length; i++) {
      var name = selectedNames[i];
      var clause = this.clauseDb.getByName(name);
      if (clause) {
        try {
          var rendered = renderClause(clause, variables);
          compiledClauses.push({
            clause_uuid: clause.uuid,
            name: clause.name,
            content: rendered,
            category: clause.category,
            priority: clause.priority
          });
        } catch (e) {
          warnings.push({
            code: 'MissingRecommended',
            message: "Failed to render clause '" + name + "': " + (e.description || e.message || e),
            clause: name
          });
          skipped.push(name);
        }
      } else {
        warnings.push({
          code: 'CustomLicenseGenerated',
          message: "Clause '" + name + "' not found in database",
          clause: name
        });
        skipped.push(name);
      }
    }

    // 5. compatibility warnings
    warnings = warnings.concat(this.checkCompatibility(selectedNames));

    // 6. SPDX identifier
    var spdxId = this.determineSpdx(request.answers);
    var finalSpdx = request.spdx_override || spdxId;
    if (finalSpdx) {
      var ok = NS.Spdx && NS.Spdx.validateId ? NS.Spdx.validateId(finalSpdx) : true;
      if (!ok) {
        warnings.push({
          code: 'NonStandardSpdx',
          message: "SPDX identifier '" + finalSpdx + "' is not in the standard SPDX database",
          clause: null
        });
      }
    }

    // 7. category
    var category = this.determineLicenseType(request.answers);

    // 8. categorize
    compiledClauses.sort(function (a, b) { return a.priority - b.priority; });
    var conditions = [], permissions = [], restrictions = [];
    var patentGrant = null, warranty = '';
    for (i = 0; i < compiledClauses.length; i++) {
      var c = compiledClauses[i];
      switch (c.category) {
        case PERMISSION: permissions.push(c.content); break;
        case CONDITION: conditions.push(c.content); break;
        case RESTRICTION: restrictions.push(c.content); break;
        case PATENT:
          if (patentGrant) patentGrant = patentGrant + '\n\n' + c.content;
          else patentGrant = c.content;
          break;
        case WARRANTY:
          if (warranty) warranty += '\n\n';
          warranty += c.content;
          break;
        default: break;
      }
    }

    // 9. full text
    var header = this.buildHeader(request);
    var preamble = this.buildPreamble(request);
    var sections = compiledClauses.map(function (c) {
      return { title: c.name, content: c.content, category: c.category, clause_uuid: c.clause_uuid, priority: c.priority };
    });
    var footer = warranty;
    var fullText = this.renderFullText(header, preamble, sections, footer);

    // 10. hashes + metadata
    var hash = NS.Hashing.compute(fullText);
    var fingerprint = hash.blake3;
    var now = new Date().toISOString();
    var uuid = uuidV4();
    var metadata = {
      id: { uuid: uuid, fingerprint: fingerprint, spdx_identifier: finalSpdx || null },
      name: request.project_name,
      description: 'Granular license for ' + request.project_name,
      version: '1.0.0',
      created_at: now,
      modified_at: now,
      authors: request.copyright_holders,
      tags: [category],
      category: category,
      spdx_id: finalSpdx || null,
      custom_id: null
    };
    var license = {
      metadata: metadata,
      preamble: preamble,
      clauses: compiledClauses,
      conditions: conditions,
      permissions: permissions,
      restrictions: restrictions,
      patent_grant: patentGrant,
      warranty_disclaimer: warranty,
      full_text: fullText,
      hash: hash
    };

    // 11. suggestions
    var suggestions = this.generateSuggestions(request.answers);

    var applied = selectedNames.filter(function (n) { return skipped.indexOf(n) === -1; });

    return {
      license: license,
      warnings: warnings,
      suggestions: suggestions,
      applied_clauses: applied,
      skipped_clauses: skipped
    };
  };

  function renderClause(clause, variables) {
    var output = clause.template;
    for (var i = 0; i < clause.variables.length; i++) {
      var varName = clause.variables[i];
      if (variables[varName] !== undefined && variables[varName] !== null) {
        output = output.split('{' + varName + '}').join(variables[varName]);
      } else {
        var err = new Error("clause '" + clause.name + "' requires variable '" + varName + "' which was not provided");
        err.clause = clause.name;
        err.variable = varName;
        err.description = "variable '" + varName + "' is required but was not provided";
        throw err;
      }
    }
    return output;
  }

  LicenseCompiler.prototype.validateRequest = function (request) {
    function invalid(msg) { throw { name: 'CompilerError', kind: 'InvalidRequest', message: msg }; }
    if (!request.project_name || request.project_name.trim() === '') invalid('project_name must not be empty');
    if (request.year < 1970 || request.year > 2100) invalid('year ' + request.year + ' is out of reasonable range (1970-2100)');
    if (!request.copyright_holders || request.copyright_holders.length === 0) invalid('at least one copyright holder is required');
    for (var i = 0; i < request.copyright_holders.length; i++) {
      var author = request.copyright_holders[i];
      if ((author.name || '').trim() === '') invalid('copyright holder at index ' + i + ' has an empty name');
    }
    if (request.dual_license) {
      if (!request.dual_license[0].trim() || !request.dual_license[1].trim()) invalid('dual_license identifiers must not be empty');
    }
  };

  LicenseCompiler.prototype.selectClauses = function (answers) {
    var desired = [];
    var Self = LicenseCompiler;
    var db = this.clauseDb;

    var licenseType = Self.getAnswerChoice(answers, 'license_type') || 'permissive';

    switch (licenseType) {
      case 'permissive':
        desired.push('MIT-PERMISSION', 'MIT-CONDITION', 'MIT-WARRANTY');
        break;
      case 'copyleft':
        desired.push('GPL-COPYLEFT');
        break;
      case 'public_domain': {
        var variant = Self.getAnswerChoice(answers, 'public_domain_variant');
        if (variant === 'cc0') desired.push('CC0-PERMISSION');
        else desired.push('UNLICENSE');
        break;
      }
      case 'bsd': {
        var bsdVariant = Self.getAnswerChoice(answers, 'bsd_variant');
        if (bsdVariant === 'bsd-3') {
          desired.push('BSD-2-PERMISSION', 'BSD-2-DISCLAIMER', 'BSD-3-ADVERTISING');
        } else {
          desired.push('BSD-2-PERMISSION', 'BSD-2-DISCLAIMER');
        }
        break;
      }
      case 'apache':
        desired.push('APACHE-PERMISSION', 'APACHE-PATENT');
        break;
      case 'isc':
        desired.push('ISC-PERMISSION', 'ISC-DISCLAIMER');
        break;
      case 'mpl':
        desired.push('MPL-CONDITION');
        break;
      case 'lgpl':
        desired.push('LGPL-STATIC', 'GPL-COPYLEFT');
        break;
      case 'network_copyleft':
        desired.push('GPL-COPYLEFT', 'NETWORK-COPYLEFT');
        break;
      case 'proprietary':
        desired.push('COPYRIGHT-NOTICE');
        break;
      case 'commercial':
        desired.push('COPYRIGHT-NOTICE');
        break;
      default:
        throw { name: 'CompilerError', kind: 'ClauseSelectionError', message: "unknown license type '" + licenseType + "'" };
    }

    function pushBool(id, name) { if (Self.getAnswerBoolean(answers, id)) desired.push(name); }
    pushBool('require_attribution', 'ATTRIBUTION');
    pushBool('copyright_notice', 'COPYRIGHT-NOTICE');
    if (Self.getAnswerBoolean(answers, 'require_patent_grant') && desired.indexOf('APACHE-PATENT') === -1) {
      desired.push('PATENT-RETALIATION');
    }
    pushBool('include_termination', 'TERMINATION');
    pushBool('include_revision', 'REVISION');
    pushBool('include_liability_capped', 'LIABILITY-CAPPED');
    pushBool('allow_derivative_works', 'DERIVATIVE-WORKS-ALLOW');
    pushBool('require_source_disclosure', 'SOURCE-DISCLOSURE');
    pushBool('include_government_use', 'GOVERNMENT-USE');
    pushBool('include_education_exception', 'EDUCATION-EXCEPTION');
    pushBool('include_nonprofit_exception', 'NONPROFIT-EXCEPTION');
    pushBool('include_cloud_hosting', 'CLOUD-HOSTING');
    pushBool('include_container_rights', 'CONTAINER-RIGHTS');
    pushBool('ai_training_restricted', 'AI-TRAINING-RESTRICTION');
    pushBool('military_restricted', 'MILITARY-RESTRICTION');
    pushBool('nuclear_restricted', 'NUCLEAR-RESTRICTION');
    pushBool('healthcare_restricted', 'HEALTHCARE-RESTRICTION');
    pushBool('export_control', 'EXPORT-CONTROL');
    pushBool('no_commercial', 'NO-COMMERCIAL');
    pushBool('no_trademark', 'NO-TRADEmark');
    pushBool('network_copyleft_restriction', 'NETWORK-COPYLEFT');
    pushBool('no_derivatives', 'NO-DERIVATIVES');
    pushBool('drm_restriction', 'DRM-RESTRICTION');
    pushBool('privacy_no_telemetry', 'PRIVACY-NO-TELEMETRY');
    pushBool('telemetry_notice', 'TELEMETRY-NOTICE');
    pushBool('resale_restriction', 'RESALE-RESTRICTION');

    var commercialModel = Self.getAnswerChoice(answers, 'commercial_model');
    switch (commercialModel) {
      case 'subscription': desired.push('SUBSCRIPTION-LICENSE'); break;
      case 'evaluation': desired.push('EVALUATION-LICENSE'); break;
      case 'open_core': desired.push('OPEN-CORE'); break;
      case 'per_seat': desired.push('PER-SEAT-LICENSE'); break;
      case 'per_company': desired.push('PER-COMPANY-LICENSE'); break;
      case 'oem': desired.push('OEM-LICENSE'); break;
      default: break;
    }

    if (Self.getAnswerBoolean(answers, 'provide_warranty')) desired.push('WARRANTY-PROVIDED');

    var extra = Self.getAnswerMultiChoice(answers, 'additional_restrictions');
    var map = {
      'no_commercial': 'NO-COMMERCIAL',
      'no_derivatives': 'NO-DERIVATIVES',
      'ai_training': 'AI-TRAINING-RESTRICTION',
      'military': 'MILITARY-RESTRICTION',
      'network_copyleft': 'NETWORK-COPYLEFT'
    };
    for (var i = 0; i < extra.length; i++) {
      var clauseName = map[extra[i]];
      if (clauseName && desired.indexOf(clauseName) === -1) desired.push(clauseName);
    }

    if (requestDualLicense(answers)) desired.push('DUAL-LICENSE');

    // dedupe preserving order
    var seen = {};
    desired = desired.filter(function (name) {
      if (seen[name]) return false;
      seen[name] = true;
      return true;
    });

    // filter to existing clauses
    desired = desired.filter(function (name) { return db.getByName(name); });

    // resolve dependencies
    var resolved = this.resolveDependencies(desired);

    // validate all resolved exist + deps satisfied
    for (i = 0; i < resolved.length; i++) {
      if (!db.getByName(resolved[i])) {
        throw { name: 'CompilerError', kind: 'ClauseSelectionError', message: "resolved clause '" + resolved[i] + "' not found in database" };
      }
    }
    try {
      db.validateDependencies(resolved);
    } catch (e) {
      throw { name: 'CompilerError', kind: 'ClauseSelectionError', message: 'dependency validation failed: ' + (e.message || JSON.stringify(e)) };
    }

    return resolved;
  };

  LicenseCompiler.prototype.resolveDependencies = function (names) {
    var resolved = names.slice();
    var visited = {};
    for (var i = 0; i < names.length; i++) visited[names[i]] = true;
    var stack = names.slice();
    while (stack.length) {
      var name = stack.pop();
      var clause = this.clauseDb.getByName(name);
      if (clause) {
        for (var d = 0; d < clause.dependencies.length; d++) {
          var dep = clause.dependencies[d];
          if (!visited[dep]) {
            visited[dep] = true;
            resolved.push(dep);
            stack.push(dep);
          }
        }
      }
    }
    return resolved;
  };

  LicenseCompiler.prototype.determineLicenseType = function (answers) {
    var lt = LicenseCompiler.getAnswerChoice(answers, 'license_type') || 'permissive';
    switch (lt) {
      case 'permissive': case 'bsd': case 'apache': case 'isc': return 'Permissive';
      case 'copyleft': return 'StrongCopyleft';
      case 'public_domain': return 'PublicDomain';
      case 'mpl': case 'lgpl': return 'WeakCopyleft';
      case 'network_copyleft': return 'NetworkCopyleft';
      case 'proprietary': return 'Proprietary';
      case 'commercial': return 'Commercial';
      default: return 'Custom';
    }
  };

  LicenseCompiler.prototype.determineSpdx = function (answers) {
    var Self = LicenseCompiler;
    var lictype = Self.getAnswerChoice(answers, 'license_type');
    if (!lictype) return null;
    var base;
    switch (lictype) {
      case 'permissive': base = 'MIT'; break;
      case 'copyleft': {
        var g = Self.getAnswerChoice(answers, 'gpl_version');
        if (g === '2.0-only') base = 'GPL-2.0-only';
        else if (g === '2.0-or-later') base = 'GPL-2.0-or-later';
        else if (g === '3.0-only') base = 'GPL-3.0-only';
        else base = 'GPL-3.0-or-later';
        break;
      }
      case 'public_domain': {
        var pd = Self.getAnswerChoice(answers, 'public_domain_variant');
        base = pd === 'cc0' ? 'CC0-1.0' : 'Unlicense';
        break;
      }
      case 'bsd': {
        var bsd = Self.getAnswerChoice(answers, 'bsd_variant');
        if (bsd === 'bsd-3') base = 'BSD-3-Clause';
        else if (bsd === 'bsd-4') base = 'BSD-4-Clause';
        else base = 'BSD-2-Clause';
        break;
      }
      case 'apache': base = 'Apache-2.0'; break;
      case 'isc': base = 'ISC'; break;
      case 'mpl': base = 'MPL-2.0'; break;
      case 'lgpl': {
        var l = Self.getAnswerChoice(answers, 'lgpl_version');
        if (l === '2.1-only') base = 'LGPL-2.1-only';
        else if (l === '2.1-or-later') base = 'LGPL-2.1-or-later';
        else if (l === '3.0-only') base = 'LGPL-3.0-only';
        else base = 'LGPL-3.0-or-later';
        break;
      }
      case 'network_copyleft': {
        var agpl = Self.getAnswerChoice(answers, 'agpl_version');
        base = agpl === '3.0-only' ? 'AGPL-3.0-only' : 'AGPL-3.0-or-later';
        break;
      }
      default: base = null;
    }

    var hasCustom =
      Self.getAnswerBoolean(answers, 'ai_training_restricted') ||
      Self.getAnswerBoolean(answers, 'military_restricted') ||
      Self.getAnswerBoolean(answers, 'nuclear_restricted') ||
      Self.getAnswerBoolean(answers, 'healthcare_restricted') ||
      Self.getAnswerBoolean(answers, 'export_control') ||
      Self.getAnswerBoolean(answers, 'no_commercial') ||
      Self.getAnswerBoolean(answers, 'drm_restriction') ||
      Self.getAnswerBoolean(answers, 'resale_restriction') ||
      Self.getAnswerBoolean(answers, 'privacy_no_telemetry');

    if (hasCustom && base) return null;
    return base;
  };

  LicenseCompiler.prototype.buildVariables = function (request) {
    var vars = {};
    vars.project_name = request.project_name;
    vars.year = String(request.year);
    if (request.copyright_holders && request.copyright_holders.length) {
      var first = request.copyright_holders[0];
      vars.copyright_holder = first.name;
      if (first.email) vars.commercial_contact = first.email;
      if (first.organization) vars.company_name = first.organization;
    } else {
      vars.copyright_holder = 'Copyright Holder';
    }
    if (request.dual_license) {
      vars.license_a = request.dual_license[0];
      vars.license_b = request.dual_license[1];
    }
    for (var i = 0; i < request.answers.length; i++) {
      var a = request.answers[i];
      var v = a.value;
      if (v && v.Text !== undefined && vars[a.question_id] === undefined) vars[a.question_id] = v.Text;
      else if (v && v.Choice !== undefined && vars[a.question_id] === undefined) vars[a.question_id] = v.Choice;
      else if (v && v.Number !== undefined && vars[a.question_id] === undefined) vars[a.question_id] = String(v.Number);
      else if (v && v.Boolean !== undefined && vars[a.question_id] === undefined) vars[a.question_id] = String(v.Boolean);
    }
    var defaults = {
      cla_url: 'https://example.com/cla',
      features_url: 'https://example.com/features',
      oem_contact: 'oem@example.com',
      warranty_days: '30',
      evaluation_days: '30',
      max_seats: '5',
      subscription_period: '1 month',
      pricing: 'see pricing page',
      expiration_date: '2027-01-01',
      change_date: '2027-01-01',
      change_license: 'Apache-2.0',
      allowed_uses: 'non-production use',
      core_license: 'MIT',
      commercial_conditions: 'you have obtained a commercial license'
    };
    for (var key in defaults) {
      if (vars[key] === undefined) vars[key] = defaults[key];
    }
    return vars;
  };

  LicenseCompiler.prototype.checkCompatibility = function (selected) {
    var warnings = [];
    for (var i = 0; i < selected.length; i++) {
      var name = selected[i];
      var clause = this.clauseDb.getByName(name);
      if (!clause) continue;
      for (var c = 0; c < clause.conflicts.length; c++) {
        var conf = clause.conflicts[c];
        if (selected.indexOf(conf) !== -1) {
          warnings.push({
            code: 'ConflictingClauses',
            message: "Clauses '" + name + "' and '" + conf + "' have conflicting terms",
            clause: name
          });
        }
      }
    }
    for (i = 0; i < selected.length; i++) {
      name = selected[i];
      clause = this.clauseDb.getByName(name);
      if (!clause) continue;
      for (var d = 0; d < clause.dependencies.length; d++) {
        var dep = clause.dependencies[d];
        if (selected.indexOf(dep) === -1) {
          warnings.push({
            code: 'MissingRecommended',
            message: "Clause '" + name + "' depends on '" + dep + "' which is not included",
            clause: name
          });
        }
      }
    }

    if (selected.indexOf('NETWORK-COPYLEFT') !== -1) {
      warnings.push({
        code: 'NetworkCopyleftDetected',
        message: 'Network copyleft (AGPL-style) clause detected. Modified versions used over a network must disclose source code.',
        clause: 'NETWORK-COPYLEFT'
      });
    }
    if (selected.indexOf('AI-TRAINING-RESTRICTION') !== -1) {
      warnings.push({
        code: 'AiRestrictionPresent',
        message: 'AI/ML training restriction clause present. This may limit downstream use in AI pipelines.',
        clause: 'AI-TRAINING-RESTRICTION'
      });
    }
    if (selected.indexOf('NO-COMMERCIAL') !== -1) {
      warnings.push({
        code: 'CommercialRestrictionPresent',
        message: 'Non-commercial restriction clause present. This restricts commercial use of the software.',
        clause: 'NO-COMMERCIAL'
      });
    }
    var hasPatent = selected.indexOf('APACHE-PATENT') !== -1 || selected.indexOf('PATENT-RETALIATION') !== -1;
    if (!hasPatent) {
      var hasCopyleft = selected.indexOf('GPL-COPYLEFT') !== -1 || selected.indexOf('MPL-CONDITION') !== -1;
      if (hasCopyleft) {
        warnings.push({
          code: 'PatentRisk',
          message: 'No explicit patent grant or retaliation clause in a copyleft license. Consider adding patent protection.',
          clause: null
        });
      }
    }
    return warnings;
  };

  LicenseCompiler.prototype.generateSuggestions = function (answers) {
    var Self = LicenseCompiler;
    var suggestions = [];
    var licenseType = Self.getAnswerChoice(answers, 'license_type') || 'permissive';
    var hasAttr = Self.getAnswerBoolean(answers, 'require_attribution');
    var hasCommercial = Self.getAnswerBoolean(answers, 'allow_commercial');
    var hasDeriv = Self.getAnswerBoolean(answers, 'allow_derivative_works');
    var hasSource = Self.getAnswerBoolean(answers, 'require_source_disclosure');
    var hasAi = Self.getAnswerBoolean(answers, 'ai_training_restricted');
    var hasPatent = Self.getAnswerBoolean(answers, 'require_patent_grant');

    if (licenseType === 'permissive' || licenseType === 'bsd' || licenseType === 'isc') {
      if (!hasAttr) suggestions.push('Consider requiring attribution to ensure credit is preserved across redistributions.');
      if (!hasCommercial) suggestions.push('This permissive license allows commercial use. If you want to restrict commercial use, consider adding the NO-COMMERCIAL restriction.');
    }
    if (licenseType === 'copyleft' || licenseType === 'network_copyleft') {
      if (!hasSource) suggestions.push('Consider requiring source code disclosure to ensure derivative works remain open.');
      if (licenseType === 'copyleft' && !hasAi) suggestions.push('If you want to prevent AI training on your code, consider adding the AI-TRAINING-RESTRICTION clause.');
    }
    if (licenseType === 'public_domain') {
      suggestions.push('Public domain dedications cannot be revoked. Ensure all copyright holders consent to the dedication.');
      suggestions.push('Consider patent implications. A public domain dedication covers copyright but may not cover patent rights.');
    }
    if (!hasPatent && (licenseType === 'apache' || licenseType === 'permissive')) {
      suggestions.push('Consider including a patent grant clause to protect users from patent litigation related to the software.');
    }
    if (!hasDeriv && (licenseType === 'permissive' || licenseType === 'bsd')) {
      suggestions.push('If you want to allow derivative works, consider adding the DERIVATIVE-WORKS-ALLOW clause.');
    }
    if (licenseType === 'permissive' || licenseType === 'bsd') {
      suggestions.push('Consider offering a dual license (open source + commercial) to allow commercial entities to purchase a proprietary license.');
    }
    if (licenseType === 'copyleft') {
      suggestions.push('Ensure all linked libraries are GPL-compatible. GPL copyleft requires that combined works also be GPL-licensed.');
    }
    if (licenseType === 'lgpl') {
      suggestions.push('LGPL allows linking from proprietary software under certain conditions. Ensure the static linking exception matches your intended use.');
    }
    if (licenseType === 'mpl') {
      suggestions.push('MPL applies at the file level. Modified MPL files must remain under MPL, but combining with other files is permitted.');
    }
    if (licenseType === 'network_copyleft') {
      suggestions.push('Network copyleft (AGPL-style) requires source disclosure for SaaS use. This may deter some commercial adoption.');
    }
    suggestions.push('Review the generated license with a legal professional before distribution.');
    if (hasAi) suggestions.push('AI training restrictions may be difficult to enforce in some jurisdictions. Consider consulting legal counsel.');
    return suggestions;
  };

  LicenseCompiler.prototype.buildHeader = function (request) {
    var holders = [];
    for (var i = 0; i < request.copyright_holders.length; i++) holders.push(request.copyright_holders[i].name);
    return 'Copyright (c) ' + request.year + ' ' + holders.join(', ') + '\n\n' + request.project_name;
  };

  LicenseCompiler.prototype.buildPreamble = function (request) {
    var licenseType = LicenseCompiler.getAnswerChoice(request.answers, 'license_type') || 'permissive';
    var desc;
    switch (licenseType) {
      case 'permissive': desc = 'a permissive license'; break;
      case 'copyleft': desc = 'a strong copyleft license'; break;
      case 'public_domain': desc = 'a public domain dedication'; break;
      case 'bsd': desc = 'a BSD license'; break;
      case 'apache': desc = 'the Apache License'; break;
      case 'isc': desc = 'an ISC license'; break;
      case 'mpl': desc = 'the Mozilla Public License'; break;
      case 'lgpl': desc = 'the GNU Lesser General Public License'; break;
      case 'network_copolit': desc = 'a network copyleft license'; break;
      case 'proprietary': desc = 'a proprietary license'; break;
      case 'commercial': desc = 'a commercial license'; break;
      default: desc = 'the following license';
    }
    return 'This software is made available under ' + desc + '. By using, copying, modifying, or distributing this software, you agree to be bound by the terms and conditions set forth below.';
  };

  LicenseCompiler.prototype.renderFullText = function (header, preamble, sections, footer) {
    var text = '';
    var sorted = sections.slice().sort(function (a, b) { return a.priority - b.priority; });
    if (header) text += header + '\n\n';
    if (preamble) text += preamble + '\n\n';
    for (var i = 0; i < sorted.length; i++) {
      if (sorted[i].content === '') continue;
      text += sorted[i].content + '\n\n';
    }
    if (footer) text += footer + '\n';
    return text;
  };

  LicenseCompiler.getAnswerBoolean = function (answers, id) { return getAnswerBoolean(answers, id); };
  LicenseCompiler.getAnswerChoice = function (answers, id) { return getAnswerChoice(answers, id); };
  LicenseCompiler.getAnswerMultiChoice = function (answers, id) { return getAnswerMultiChoice(answers, id); };
  LicenseCompiler.getAnswerText = function (answers, id) { return getAnswerText(answers, id); };
  LicenseCompiler.getAnswerNumber = function (answers, id) { return getAnswerNumber(answers, id); };

  function uuidV4() {
    var s = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return s.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  NS.ClauseDatabase = ClauseDatabase;
  NS.LicenseCompiler = LicenseCompiler;
  NS.Compiler = {
    compile: function (request) { return new LicenseCompiler().compile(request); },
    ClauseDatabase: ClauseDatabase,
    LicenseCompiler: LicenseCompiler,
    helpers: {
      getAnswerBoolean: getAnswerBoolean,
      getAnswerChoice: getAnswerChoice,
      getAnswerMultiChoice: getAnswerMultiChoice,
      getAnswerText: getAnswerText,
      getAnswerNumber: getAnswerNumber
    }
  };
})();