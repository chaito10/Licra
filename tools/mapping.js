/* GLG mapping layer: curated questionnaire-id -> compiler-key bridge.
   Converts wizard answers (keyed by questionnaire ids like 'own-001') plus
   synthesized base-license answers into the flat compiler request the
   LicenseCompiler expects (question_id = compiler key, serde AnswerValue).
   Mirrors src/questionnaire.rs answer vocabulary + src/compiler.rs keys. */

(function () {
  if (typeof window !== 'undefined') window.GLGMap = window.GLGMap || {};
  var ROOT = (typeof window !== 'undefined') ? window : (typeof self !== 'undefined' ? self : globalThis);
  ROOT.GLGMap = ROOT.GLGMap || {};
  var M = ROOT.GLGMap;

  /* Synthesized question ids that map 1:1 to compiler keys.
     Their raw values come straight through (Choice kept as-is). */
  var SYNTHETIC_DIRECT = [
    'license_type', 'bsd_variant', 'gpl_version', 'lgpl_version',
    'agpl_version', 'public_domain_variant', 'commercial_model'
  ];

  /* Synthesized metadata answers (not passed to the compiler as answers,
     consumed by the request builder). */
  var SYNTHETIC_META = ['project_name', 'project_version', 'copyright_holder', 'copyright_email', 'copyright_org', 'year'];

  /* Curated questionnaire-id -> compiler key derivation rules.
     key:   compiler answer key
     from:  questionnaire question id
     mode:  how the raw value is transformed
       bool        -> Boolean passed through
       not         -> inverse Boolean (question says "permitted" -> restriction bool)
       neq(<val>)  -> true unless choice equals <val>
       not_never   -> MultiChoice; true unless it contains 'never'
       resale      -> Choice; true unless 'permitted'
       warranty    -> Choice; true when 'limited' or 'full'
       src         -> Choice; true unless 'no'
       no_commercial-> Choice; true when 'not_permitted' or 'separate_license'
  */
  var CURATED = [
    { key: 'require_attribution',        from: 'attr-001', mode: 'bool' },
    { key: 'copyright_notice',           from: 'copy-001', mode: 'bool' },
    { key: 'require_patent_grant',       from: 'pat-001',  mode: 'bool' },
    { key: 'include_liability_capped',   from: 'liab-001', mode: 'bool' },
    { key: 'allow_derivative_works',     from: 'dw-001',   mode: 'bool' },
    { key: 'include_government_use',     from: 'gov-001',  mode: 'bool' },
    { key: 'include_education_exception',from: 'edu-001',  mode: 'bool' },
    { key: 'include_nonprofit_exception',from: 'np-001',   mode: 'bool' },
    { key: 'include_cloud_hosting',      from: 'cloud-001',mode: 'bool' },
    { key: 'include_container_rights',   from: 'cont-001', mode: 'bool' },
    { key: 'export_control',             from: 'ec-001',   mode: 'bool' },
    { key: 'include_termination',        from: 'term-001', mode: 'not_never' },
    { key: 'include_revision',           from: 'rev-001',  mode: 'neq', value: 'irrevocable' },
    { key: 'require_source_disclosure',  from: 'src-001',  mode: 'src' },
    { key: 'no_commercial',              from: 'com-001',  mode: 'no_commercial' },
    { key: 'allow_commercial',           from: 'com-001',  mode: 'commercial_ok' },
    { key: 'provide_warranty',           from: 'war-001',  mode: 'warranty' },
    { key: 'resale_restriction',         from: 'resale-001', mode: 'resale' },
    { key: 'ai_training_restricted',     from: 'ai-001',   mode: 'neq_permitted' },
    { key: 'military_restricted',        from: 'mil-001',  mode: 'not' },
    { key: 'nuclear_restricted',         from: 'nuc-001',  mode: 'neq_permitted' },
    { key: 'healthcare_restricted',      from: 'hc-001',   mode: 'neq_permitted' },
    { key: 'no_trademark',               from: 'tm-001',   mode: 'not' },
    { key: 'network_copyleft_restriction', from: 'net-001', mode: 'bool' },
    { key: 'no_derivatives',             from: 'dw-001',   mode: 'invert_bool' },
    { key: 'drm_restriction',            from: 'drm-002',  mode: 'bool' },
    { key: 'privacy_no_telemetry',       from: 'telem-001', mode: 'invert_bool' },
    { key: 'telemetry_notice',           from: 'telem-001', mode: 'bool' }
  ];

  function rawOf(answers, id) {
    if (!answers || !answers[id]) return undefined;
    return answers[id];
  }

  function apply(mode, raw, rule) {
    if (raw === undefined || raw === null || raw === '') return undefined;
    switch (mode) {
      case 'bool': return !!raw;
      case 'not': return raw === false;
      case 'invert_bool': return raw === false;
      case 'neq_permitted': return raw !== 'permitted';
      case 'neq': return rule.value === undefined ? true : raw !== rule.value;
      case 'neq_irrevocable': return raw !== 'irrevocable';
      case 'not_never': {
        var arr = Array.isArray(raw) ? raw : [raw];
        return arr.indexOf('never') === -1 && arr.length > 0;
      }
      case 'src': return raw !== 'no';
      case 'no_commercial': return raw === 'not_permitted' || raw === 'separate_license';
      case 'commercial_ok': return raw !== 'not_permitted';
      case 'warranty': return raw === 'limited' || raw === 'full';
      case 'resale': return raw !== 'permitted';
      default: return raw;
    }
  }

  /* Derive 'additional_restrictions' multi-choice from already-derived bools. */
  function buildAdditionalRestrictions(bools) {
    var out = [];
    if (bools.no_commercial) out.push('no_commercial');
    if (bools.no_derivatives) out.push('no_derivatives');
    if (bools.ai_training_restricted) out.push('ai_training');
    if (bools.military_restricted) out.push('military');
    if (bools.network_copyleft_restriction) out.push('network_copyleft');
    return out;
  }

  /* Build ans = map compiler-key -> derived raw value (pre-serialization). */
  M.derive = function (answers, baseAnswers) {
    var merged = {};
    for (var k in answers) merged[k] = answers[k];
    for (var b in baseAnswers || {}) merged[b] = baseAnswers[b];

    var bools = {};
    var ans = {};
    for (var i = 0; i < CURATED.length; i++) {
      var rule = CURATED[i];
      var val = apply(rule.mode, rawOf(merged, rule.from), rule);
      if (val !== undefined) {
        ans[rule.key] = val;
        if (typeof val === 'boolean') bools[rule.key] = val;
      }
    }

    for (var s = 0; s < SYNTHETIC_DIRECT.length; s++) {
      var sid = SYNTHETIC_DIRECT[s];
      var sv = rawOf(merged, sid);
      if (sv !== undefined && sv !== null && sv !== '') ans[sid] = sv;
    }

    var extra = buildAdditionalRestrictions(bools);
    if (extra.length) ans.additional_restrictions = extra;

    /* dual licensing: dual-001 + dual-002 (text of second license) */
    if (rawOf(merged, 'dual-001') === true) {
      var second = rawOf(merged, 'dual-002');
      var first = M.guessSpdx(ans) || 'Apache-2.0';
      if (second && String(second).trim()) {
        ans.dual_license_a = first;
        ans.dual_license_b = String(second).trim();
      }
    }

    return ans;
  };

  /* Best-effort SPDX for the synthesized base license (mirrors determineSpdx). */
  M.guessSpdx = function (ans) {
    var lt = ans.license_type;
    if (!lt) return null;
    switch (lt) {
      case 'permissive': return 'MIT';
      case 'copyleft': {
        var g = ans.gpl_version;
        if (g === '2.0-only') return 'GPL-2.0-only';
        if (g === '2.0-or-later') return 'GPL-2.0-or-later';
        if (g === '3.0-only') return 'GPL-3.0-only';
        return 'GPL-3.0-or-later';
      }
      case 'public_domain': return ans.public_domain_variant === 'cc0' ? 'CC0-1.0' : 'Unlicense';
      case 'bsd': {
        if (ans.bsd_variant === 'bsd-3') return 'BSD-3-Clause';
        if (ans.bsd_variant === 'bsd-4') return 'BSD-4-Clause';
        return 'BSD-2-Clause';
      }
      case 'apache': return 'Apache-2.0';
      case 'isc': return 'ISC';
      case 'mpl': return 'MPL-2.0';
      case 'lgpl': {
        var l = ans.lgpl_version;
        if (l === '2.1-only') return 'LGPL-2.1-only';
        if (l === '2.1-or-later') return 'LGPL-2.1-or-later';
        if (l === '3.0-only') return 'LGPL-3.0-only';
        return 'LGPL-3.0-or-later';
      }
      case 'network_copyleft': return ans.agpl_version === '3.0-only' ? 'AGPL-3.0-only' : 'AGPL-3.0-or-later';
      default: return null;
    }
  };

  /* Final request builder: raw derived answers -> serde AnswerValue array. */
  M.buildRequest = function (answers, baseAnswers) {
    var derived = M.derive(answers, baseAnswers);
    var answersOut = [];
    for (var k in derived) {
      var v = derived[k];
      var value;
      if (Array.isArray(v)) value = { MultiChoice: v.slice() };
      else if (typeof v === 'boolean') value = { Boolean: v };
      else if (typeof v === 'number') value = { Number: v };
      else value = { Choice: String(v) };
      answersOut.push({ question_id: k, value: value });
    }

    var holderName = (baseAnswers && baseAnswers.copyright_holder) || (answers && answers['own-001']) || 'Copyright Holder';
    var holders = [{ name: holderName }];
    if (baseAnswers && baseAnswers.copyright_email) holders[0].email = baseAnswers.copyright_email;
    if (baseAnswers && baseAnswers.copyright_org) holders[0].organization = baseAnswers.copyright_org;

    var request = {
      project_name: (baseAnswers && baseAnswers.project_name) || 'Untitled',
      year: (baseAnswers && baseAnswers.year) ? Number(baseAnswers.year) : new Date().getFullYear(),
      copyright_holders: holders,
      answers: answersOut,
      custom_clauses: []
    };
    if (derived.dual_license_a && derived.dual_license_b) {
      request.dual_license = [derived.dual_license_a, derived.dual_license_b];
    }
    return request;
  };

  M.SYNTHETIC_DIRECT = SYNTHETIC_DIRECT;
  M.SYNTHETIC_META = SYNTHETIC_META;
  M.CURATED = CURATED;
})();