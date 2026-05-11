// Z: scripts\prepare_history_template.js
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

const input = options.input || options.i;
const outputDir = options.output || path.join('data', 'converted');

if (!input) {
  console.error(
    'Usage: node scripts/prepare_history_template.js --input=source.xlsx --output=converted_dir'
  );
  process.exit(1);
}

const workbook = xlsx.readFile(input);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, raw: true });
const prepared = rows.map((row) => {
  const base = [];
  for (let i = 0; i < 48; i += 1) {
    base[i] = Number(row[i + 1] || 0);
  }
  return [row[0], ...base];
});

const outWb = xlsx.utils.book_new();
const outSheet = xlsx.utils.aoa_to_sheet(prepared);
xlsx.utils.book_append_sheet(outWb, outSheet, 'prepared');

fs.mkdirSync(outputDir, { recursive: true });
const dest = path.join(outputDir, `${path.basename(input, path.extname(input))}-prepared.xlsx`);
xlsx.writeFile(outWb, dest);
console.log(`Prepared workbook saved to ${dest}`);
