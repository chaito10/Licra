const fs = require('fs');
const path = require('path');
const DIR = __dirname;
global.GLG_DATA = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'glg-data.json'), 'utf8'));

for (const f of ['engine-hash.js', 'engine-core.js', 'engine-spdx.js', 'engine-compat.js', 'engine-validate.js', 'engine-export.js']) {
  require(path.join(DIR, f));
}
const E = global.GLGEngine;
let failures = 0;
function check(name, got, want) {
  const ok = got === want;
  if (!ok) { failures++; console.log('FAIL  ' + name + '\n  got:  ' + JSON.stringify(got) + '\n  want: ' + JSON.stringify(want)); }
  else console.log('ok    ' + name);
}

console.log('--- Hashing vectors ---');
check('sha256("")', E.Hashing.sha256(''), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
check('sha256("abc")', E.Hashing.sha256('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
check('sha256("hello")', E.Hashing.sha256('hello'), '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
check('sha3_256("")', E.Hashing.sha3_256(''), 'a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a');
check('sha3_256("abc")', E.Hashing.sha3_256('abc'), '3a985da74fe225b2045c172d6bd390bd855f086e3e9d525b46bfe24511431532');
check('sha3_256("hello")', E.Hashing.sha3_256('hello'), '3338be694f50c5f338814986cdf0686453a888b84f424d792af4b9202398f392');
check('blake3("")', E.Hashing.blake3(''), 'af1349b9f5f9a1a6a0404dea36dcc9499bcb25c9adc112b7cc9a93cae41f3262');
check('blake3("abc")', E.Hashing.blake3('abc'), '6437b3ac38465133ffb63b75273a8db548c558465d79db03fd359c6cd5bd9d85');
check('blake3("hello")', E.Hashing.blake3('hello'), 'ea8f163db38682925e4491c5e58d4bb3506ef8c14eb78a86e908c5624a67200f');

console.log('--- Unicode UTF-8 boundary ---');
const crypto = require('crypto');
const nodeSha256 = s => crypto.createHash('sha256').update(Buffer.from(s, 'utf8')).digest('hex');
const nodeSha3 = s => crypto.createHash('sha3-256').update(Buffer.from(s, 'utf8')).digest('hex');
check('sha256(2-byte) matches node', E.Hashing.sha256('\u00e9'), nodeSha256('\u00e9'));
check('sha256(cyrillic) matches node', E.Hashing.sha256('\u043f\u0440\u0438\u0432\u0435\u0442'), nodeSha256('\u043f\u0440\u0438\u0432\u0435\u0442'));
check('sha3(2-byte) matches node', E.Hashing.sha3_256('\u00e9'), nodeSha3('\u00e9'));
check('sha3(emoji) matches node', E.Hashing.sha3_256('\ud83d\ude00'), nodeSha3('\ud83d\ude00'));
check('sha3(abc) matches node', E.Hashing.sha3_256('abc'), nodeSha3('abc'));

console.log('--- Compile MIT (permissive) ---');
const req = {
  project_name: 'DemoProject',
  copyright_holders: [{ name: 'Alice', email: null, organization: null, url: null }],
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
let res = E.Compiler.compile(req);
check('MIT applied clauses', JSON.stringify(res.applied_clauses), JSON.stringify(['MIT-PERMISSION', 'MIT-CONDITION', 'MIT-WARRANTY']));
check('MIT spdx_id', res.license.metadata.spdx_id, 'MIT');
check('MIT category', res.license.metadata.category, 'Permissive');
check('MIT hash.blake3', res.license.hash.blake3, E.Hashing.blake3(res.license.full_text));
check('MIT hash.sha256', res.license.hash.sha256, E.Hashing.sha256(res.license.full_text));
check('MIT warnings', JSON.stringify(res.warnings), '[]');
console.log('--- MIT full_text ---');
console.log(res.license.full_text);

console.log('--- Compile copyleft w/ restrictions ---');
const req2 = {
  project_name: 'Kernel',
  copyright_holders: [{ name: 'Bob', email: null, organization: null, url: null }],
  year: 2025,
  answers: [
    { question_id: 'license_type', value: { Choice: 'copyleft' } },
    { question_id: 'gpl_version', value: { Choice: '3.0-only' } },
    { question_id: 'ai_training_restricted', value: { Boolean: true } },
    { question_id: 'no_commercial', value: { Boolean: true } }
  ],
  custom_clauses: [],
  spdx_override: null,
  dual_license: null
};
res = E.Compiler.compile(req2);
check('copyleft spdx_id (custom restrictions -> null)', String(res.license.metadata.spdx_id), String(null));
check('copyleft has GPL-COPYLEFT + AI', res.applied_clauses.indexOf('GPL-COPYLEFT') !== -1 && res.applied_clauses.indexOf('AI-TRAINING-RESTRICTION') !== -1, true);
check('NO-COMMERCIAL skipped (missing commercial_contact var)', res.applied_clauses.indexOf('NO-COMMERCIAL') === -1, true);
check('NO-COMMERCIAL skip warning', res.warnings.some(w => w.code === 'MissingRecommended' && (w.clause === 'NO-COMMERCIAL')), true);

console.log('--- Validate an MIT text ---');
const vres = E.Validate.validateText(res.license.full_text);
console.log('validate:', JSON.stringify(vres));

console.log('--- Spdx parse ---');
const ast = E.Spdx.parse('MIT OR Apache-2.0');
check('spdx parse operator', ast.operator, 'Or');

console.log('--- Compat explain ---');
console.log(JSON.stringify(E.Compat.explain('MIT', 'GPL-3.0-only')));

console.log('--- Export markdown ---');
const md = E.Export.exportToMarkdown(res.license);
console.log(md.slice(0, 300));

console.log('--- Export all ---');
const all = E.Export.generateAll(res.license);
console.log('keys:', Object.keys(all).join(','));
console.log('spdx head:', JSON.stringify(String(all.spdx).slice(0, 120)));

if (failures) { console.log('\n' + failures + ' FAILURES'); process.exit(1); }
console.log('\nALL CHECKS PASSED');