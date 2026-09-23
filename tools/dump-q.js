const fs = require('fs');
const d = JSON.parse(fs.readFileSync('tools/data/glg-data.json', 'utf8'));
for (const q of d.questions) {
  const opts = (q.options || []).map(o => o.value).join('|');
  let out = `${q.id}\t[${q.category}]\t${q.question_type}\t${q.title}`;
  if (opts) out += `\n      opts= ${opts}`;
  console.log(out);
}