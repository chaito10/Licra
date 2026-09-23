const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Load ONLY the consolidated single file, top-level script semantics (like <script>)
const code = fs.readFileSync(path.join(__dirname, 'glg-logic.js'), 'utf8');
vm.runInThisContext(code, { filename: 'glg-logic.js' });

const E = global.GLGEngine;
let failures = 0;
function check(name, got, want, quiet) {
  const ok = got === want;
  if (!ok) { failures++; console.log('FAIL  ' + name + '\n  got:  ' + JSON.stringify(got) + '\n  want: ' + JSON.stringify(want)); }
  else if (!quiet) console.log('ok    ' + name);
}

console.log('-- GLG_DATA embedded --');
check('310 questions', GLG_DATA.questions.length, 310);
check('55 clauses', GLG_DATA.clauses.length, 55);
check('86 spdx', GLG_DATA.spdx.length, 86);

console.log('-- hashing (single-file) --');
check('blake3("")', E.Hashing.blake3(''), 'af1349b9f5f9a1a6a0404dea36dcc9499bcb25c9adc112b7cc9a93cae41f3262');
check('blake3("abc")', E.Hashing.blake3('abc'), '6437b3ac38465133ffb63b75273a8db548c558465d79db03fd359c6cd5bd9d85');
check('sha256("abc")', E.Hashing.sha256('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
check('sha3_256("abc")', E.Hashing.sha3_256('abc'), '3a985da74fe225b2045c172d6bd390bd855f086e3e9d525b46bfe24511431532');

console.log('-- compile (single-file) --');
const req = {
  project_name: 'DemoProject',
  copyright_holders: [{ name: 'DemoProject', email: null, organization: null, url: null }],
  year: 2026,
  answers: [
    { question_id: 'license_type', value: { Choice: 'permissive' } },
    { question_id: 'own-001', value: { Boolean: true } },
    { question_id: 'copy-001', value: { Boolean: true } }
  ],
  custom_clauses: [],
  spdx_override: null,
  dual_license: null
};
const res = E.Compiler.compile(req);
// Reference fingerprint from Rust cargo new -o tmp-ref -n DemoProject -t permissive
check('blake3 fingerprint == Rust', res.license.hash.blake3, 'c47f8dea73af04bc50e93f2ef223dd70928c7252c6048f8b7d7b835269d25490');
check('spdx_id MIT', res.license.metadata.spdx_id, 'MIT');

console.log('-- exports --');
const all = E.Export.generateAll(res.license);
check('11 formats', Object.keys(all).length, 11);
check('plain_text present', !!all.plain_text && all.plain_text.indexOf('Permission is hereby granted') !== -1, true, true);
check('spdx is SPDX header (LicenseRef-... not JSON)', !!all.spdx && all.spdx.indexOf('SPDX-License-Identifier:') === 0, true);
check('exportToSpdx() is valid JSON doc', (() => { try { const d = JSON.parse(E.Export.exportToSpdx(res.license)); return d.spdxVersion === 'SPDX-3.0'; } catch (e) { return false; } })(), true);

console.log('-- validate --');
const v = E.Validate.validateLicense(res.license);
console.log('  score:', v.score, 'errors:', v.errors.length, 'warnings:', v.warnings.length);

console.log('-- spdx roundtrip --');
const ast = E.Spdx.parse('MIT OR Apache-2.0');
check('AND/OR parse', ast.operator, 'Or');

console.log('-- compat --');
console.log('  MIT vs GPL-3.0-only:', JSON.stringify(E.Compat.explain('MIT', 'GPL-3.0-only').compatible));

if (failures) { console.log('\n' + failures + ' FAILURES'); process.exit(1); }
console.log('\nSINGLE-FILE BUNDLE OK');