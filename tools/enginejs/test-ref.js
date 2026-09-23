const fs = require('fs');
const path = require('path');
global.GLG_DATA = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'glg-data.json'), 'utf8'));
for (const f of ['engine-hash.js', 'engine-core.js', 'engine-spdx.js', 'engine-compat.js', 'engine-validate.js', 'engine-export.js']) {
  require(path.join(__dirname, f));
}
const E = global.GLGEngine;

// Replicate cmd_new request exactly (permissive / DemoProject / year from now)
const year = String(new Date().getFullYear());
const req = {
  project_name: 'DemoProject',
  copyright_holders: [{ name: 'DemoProject', email: null, organization: null, url: null }],
  year: parseInt(year, 10),
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

const refText = fs.readFileSync(path.join(__dirname, '..', '..', 'tmp-ref', 'LICENSE'), 'utf8');
const refMd = fs.readFileSync(path.join(__dirname, '..', '..', 'tmp-ref', 'LICENSE.md'), 'utf8');

let fail = 0;
const ck = (n, a, b) => { if (a === b) { console.log('ok   ' + n); } else { fail++; console.log('FAIL ' + n + '\n  js:  ' + JSON.stringify(a).slice(0, 200) + '\n  rust:' + JSON.stringify(b).slice(0, 200)); } };

ck('full_text vs Rust', res.license.full_text, refText);
console.log('JS fingerprint:   ' + res.license.hash.blake3);
console.log('Rust fingerprint: c47f8dea73af04bc50e93f2ef223dd70928c7252c6048f8b7d7b835269d25490');
ck('fingerprint', res.license.hash.blake3, 'c47f8dea73af04bc50e93f2ef223dd70928c7252c6048f8b7d7b835269d25490');
ck('spdx_id', res.license.metadata.spdx_id, 'MIT');

// markdown: Rust uses its own md; compare structurally (strip uuid/timestamps)
// Rust export_to_markdown - check license.md
const jsMd = E.Export.exportToMarkdown(res.license);
// mask uuid + timestamps
const mask = s => s.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g, 'UUID').replace(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/g, 'TS').replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/g, 'TS');
ck('markdown masked', mask(jsMd), mask(refMd));

process.exit(fail ? 1 : 0);