const fs = require('fs');
require('vm').runInThisContext(fs.readFileSync('tools/glg-logic.js', 'utf8'));
const NS = GLGEngine;
function keys(o, depth) {
  if (!o || typeof o !== 'object') return String(o);
  return Object.keys(o).map(k => k + (depth>0 && typeof o[k]==='object' && o[k] ? ':' + keys(o[k], depth-1) : '')).join(', ');
}
console.log('NS keys:', keys(NS, 0));
for (const k of Object.keys(NS)) {
  const v = NS[k];
  if (typeof v === 'object' && v !== null) {
    console.log('--- ' + k + ' ---');
    console.log('  ' + keys(v, 1));
  } else if (typeof v === 'function') {
    console.log('fn ' + k + ' -> ' + (v.toString().match(/function\s*\([^)]*\)/)?.[0] || 'fn'));
  } else {
    console.log('val ' + k + ' = ' + v);
  }
}
console.log('=== Validate ===');
console.log(keys(NS.Validate ? (NS.Validate.Validator || NS.Validate) : null, 1));
console.log('=== Export ===');
console.log(keys(NS.Export, 0));