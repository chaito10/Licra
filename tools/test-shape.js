const fs = require('fs');
require('vm').runInThisContext(fs.readFileSync('tools/glg-logic.js', 'utf8'));
require('vm').runInThisContext(fs.readFileSync('tools/mapping.js', 'utf8'));
const base = { project_name: 'DemoProject', copyright_holder: 'Demo Author', copyright_email: 'demo@example.com', copyright_org: 'Demo Org', year: 2026, license_type: 'permissive' };
const answers = { 'com-001': 'permitted' };
const req = GLGMap.buildRequest(answers, base);
const lic = GLGEngine.Compiler.compile(req);
console.log('type:', typeof lic);
console.log('json keys:', JSON.stringify(lic, null, 1).slice(0, 2000));