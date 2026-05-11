// Z: scripts\validate_history.js
const fs = require('fs');
const path = require('path');

const file = path.join('data', 'roulette_history.json');
if (!fs.existsSync(file)) {
  console.error('History file not found:', file);
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(file, 'utf8'));
const entries = summary.entries || [];
const total = entries.reduce((acc, entry) => acc + entry.total, 0);
const hottest = entries.sort((a, b) => b.total - a.total).slice(0, 5);

console.log('History validation report');
console.log('==========================');
console.log('Source:', summary.source);
console.log('Imported at:', summary.importedAt);
console.log('Patterns tracked:', entries.length);
console.log('Total counts:', total);
console.log('Top patterns:');
hottest.forEach((entry) => {
  console.log(` - ${entry.name}: ${entry.total} hits`);
});
console.log('Materialization complete. Use this report when pitching investors.');
