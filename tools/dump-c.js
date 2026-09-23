const fs = require('fs');
const d = JSON.parse(fs.readFileSync('tools/data/glg-data.json', 'utf8'));
for (const c of d.clauses) {
  const first = (c.content || '').split('\n')[0].slice(0, 90);
  console.log(`${c.name}\t[${c.category}]\tpri=${c.priority}\tdeps=[${(c.dependencies||[]).join(',')}]\tconflicts=[${(c.conflicts||[]).join(',')}]\treqvars=[${(c.required_variables||[]).join(',')}]\t${first}`);
}