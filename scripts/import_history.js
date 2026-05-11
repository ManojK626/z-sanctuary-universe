// Z: scripts\import_history.js
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

const autoDir = options.auto || options.autoDir || '';
let dirFiles = [];
if (autoDir) {
  try {
    const resolved = path.resolve(autoDir);
    dirFiles = fs.readdirSync(resolved).map((file) => path.join(resolved, file));
  } catch {
    dirFiles = [];
  }
}
let inputs = (options.input || options.i || '')
  .split(',')
  .map((v) => v.trim())
  .filter(Boolean);
if (!inputs.length && dirFiles.length) {
  inputs = dirFiles;
}
const output = options.output || path.join('data', 'roulette_history.json');
const description = options.description || 'Imported stats';

if (!inputs.length) {
  console.error(
    'Usage: node scripts/import_history.js --input=file1.xlsx,file2.xlsx --output=path.json'
  );
  process.exit(1);
}

function summarizeSheet(filePath) {
  const wb = xlsx.readFile(filePath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, raw: true });
  const headers = rows[0] || [];
  const entries = rows.slice(1).map((row) => {
    const name = row[0];
    const counts = row.slice(1).map((value) => Number(value) || 0);
    const total = counts.reduce((acc, value) => acc + value, 0);
    const weighted = counts.reduce((acc, value, idx) => acc + idx * value, 0);
    return {
      name,
      total,
      average: total ? +(weighted / total).toFixed(2) : 0,
      counts,
    };
  });
  return { headers, entries };
}

const summary = inputs.map((inputPath) => {
  const absolute = path.resolve(inputPath);
  const base = path.basename(absolute, path.extname(absolute));
  const { headers, entries } = summarizeSheet(absolute);
  const outPath = path.join('data', `${base}-${Date.now()}.json`);
  const payload = {
    source: path.basename(inputPath),
    importedAt: new Date().toISOString(),
    description,
    headers,
    entries,
  };
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
  console.log(`History snapshot written to ${outPath}.`);
  return payload;
});

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(summary[summary.length - 1], null, 2));
console.log(`Latest history synced to ${output}.`);
const metadata = {
  importedAt: new Date().toISOString(),
  datasets: summary.map((entry) => ({
    source: entry.source,
    totalPatterns: entry.entries.length,
    averageCount:
      entry.entries.reduce((acc, item) => acc + item.total, 0) / Math.max(1, entry.entries.length),
  })),
};
const metadataPath = path.join(path.dirname(output), 'last_import.json');
fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
console.log(`Metadata written to ${metadataPath}.`);
