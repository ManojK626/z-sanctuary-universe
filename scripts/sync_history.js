// Z: scripts\sync_history.js
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const options = args.reduce((acc, arg) => {
  if (!arg.startsWith('--')) return acc;
  const [key, value] = arg.replace('--', '').split('=');
  acc[key] = value || true;
  return acc;
}, {});

const sourceDir = options.source || path.join('data', 'import_sources');
const convertedDir = options.converted || path.join('data', 'converted');
const output = options.output || path.join('data', 'roulette_history.json');
const interval = Number(options.interval || 600) * 1000;

function convertFiles(files) {
  if (!files.length) return [];
  const converter = path.join(__dirname, 'prepare_history_template.js');
  const converted = [];
  files.forEach((file) => {
    const input = path.resolve(sourceDir, file);
    const dest = path.join(
      convertedDir,
      `${path.basename(file, path.extname(file))}-prepared.xlsx`
    );
    spawn('node', [converter, `--input=${input}`, `--output=${convertedDir}`], {
      stdio: 'inherit',
    });
    converted.push(dest);
  });
  return converted;
}

function runImport(inputs) {
  const importer = path.join(__dirname, 'import_history.js');
  const command = [
    'node',
    importer,
    `--input=${inputs.join(',')}`,
    `--output=${output}`,
    '--description=auto-sync',
  ];
  spawn(command[0], command.slice(1), { stdio: 'inherit' });
}

function syncOnce() {
  if (!fs.existsSync(sourceDir)) {
    console.warn('Source directory missing:', sourceDir);
    return;
  }
  const files = fs.readdirSync(sourceDir).filter((file) => /\.(xlsx|xls|csv|ods)$/i.test(file));
  if (!files.length) return;
  const converted = convertFiles(files);
  if (converted.length) {
    runImport(converted);
  }
}

syncOnce();
if (interval > 0) {
  setInterval(syncOnce, interval);
}
