// Z: scripts\create_dummy_history.js
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const args = process.argv.slice(2);
const options = args.reduce((acc, arg) => {
  if (!arg.startsWith('--')) return acc;
  const [key, value] = arg.replace('--', '').split('=');
  acc[key] = value || true;
  return acc;
}, {});

const output = options.output || path.join('data', 'dummy-history.xlsx');
const rows = [['Pattern', ...Array.from({ length: 48 }, (_, i) => `Count ${i}`)]];

for (let i = 1; i <= 12; i += 1) {
  const name = `Z${i}`;
  rows.push([name, ...Array.from({ length: 48 }, () => Math.floor(Math.random() * 5))]);
}

const wb = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(wb, xlsx.utils.aoa_to_sheet(rows), 'dummy');
fs.mkdirSync(path.dirname(output), { recursive: true });
xlsx.writeFile(wb, output);
console.log(`Dummy workbook created at ${output}`);
