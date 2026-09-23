const fs = require('fs');
require('vm').runInThisContext(fs.readFileSync('tools/glg-logic.js', 'utf8'));
require('vm').runInThisContext(fs.readFileSync('tools/mapping.js', 'utf8'));

const base = { project_name: 'DemoProject', copyright_holder: 'Demo Author', copyright_email: 'demo@example.com', copyright_org: 'Demo Org', year: 2026, license_type: 'permissive' };
const answers = {
  'attr-001': true, 'copy-001': true, 'pat-001': true, 'liab-001': true,
  'dw-001': true, 'gov-001': true, 'edu-001': true, 'np-001': true,
  'cloud-001': true, 'cont-001': true, 'ec-001': false,
  'term-001': ['license_violation'], 'rev-001': 'for_cause',
  'src-001': 'mandatory', 'com-001': 'permitted', 'war-001': 'limited',
  'resale-001': 'permitted', 'ai-001': 'permitted', 'mil-001': true,
  'nuc-001': 'permitted', 'hc-001': 'permitted', 'tm-001': true,
  'net-001': false, 'drm-002': false, 'telem-001': true
};
const req = GLGMap.buildRequest(answers, base);
const raw = GLGEngine.Compiler.compile(req);
const lic = raw.license || raw;
console.log('spdx_id:', lic.metadata && lic.metadata.spdx_id);
console.log('category:', lic.metadata && lic.metadata.category);
console.log('hash.blake3:', lic.hash && (lic.hash.blake3 || lic.hash.fingerprint || JSON.stringify(lic.hash).slice(0,60)));
console.log('num clauses:', (lic.clauses||[]).length);
console.log('clauses:', lic.clauses.map(c=>c.name).join(', '));
console.log('--- full_text head ---');
console.log((lic.full_text||'').split('\n').slice(0,14).join('\n'));

const vr = GLGEngine.Validate.validateText(lic.full_text);
console.log('\nvalidate:', JSON.stringify(vr).slice(0,200));
const all = GLGEngine.Export.generateAll(lic);
console.log('generateAll keys:', Object.keys(all).map(k=>k+'='+ (typeof all[k]==='string' ? all[k].length : 'n/a')).join('\n'));
console.log('\nexplain-exists:', typeof GLGEngine.Export.exportAiSummary);