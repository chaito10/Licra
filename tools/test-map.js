const fs = require('fs');
require('vm').runInThisContext(fs.readFileSync('tools/mapping.js', 'utf8'));
const d = JSON.parse(fs.readFileSync('tools/data/glg-data.json', 'utf8'));
const qids = new Set(d.questions.map(q => q.id));
let missing = [];
for (const rule of GLGMap.CURATED) {
  if (!qids.has(rule.from)) missing.push(rule.from);
}
console.log('curated sources missing from DB:', missing.length ? missing : 'none');

const base = {
  project_name: 'DemoProject',
  copyright_holder: 'Demo Author',
  copyright_email: 'demo@example.com',
  copyright_org: 'Demo Org',
  year: 2026,
  license_type: 'copyleft',
  gpl_version: '3.0-or-later',
  commercial_model: 'per_seat'
};
const answers = {
  'own-001': 'organization',
  'attr-001': true,
  'copy-001': true,
  'pat-001': true,
  'liab-001': true,
  'dw-001': true,
  'gov-001': true,
  'edu-001': true,
  'np-001': true,
  'cloud-001': true,
  'cont-001': true,
  'ec-001': false,
  'term-001': ['license_violation', 'patent_litigation'],
  'rev-001': 'for_cause',
  'src-001': 'mandatory',
  'com-001': 'separate_license',
  'war-001': 'limited',
  'resale-001': 'conditional',
  'ai-001': 'not_permitted',
  'mil-001': false,
  'nuc-001': 'non_weapons',
  'hc-001': 'conditional',
  'tm-001': false,
  'net-001': true,
  'drm-002': true,
  'telem-001': false,
  'dual-001': true,
  'dual-002': 'Commercial License v2'
};
const req = GLGMap.buildRequest(answers, base);
console.log(JSON.stringify(req, null, 1));