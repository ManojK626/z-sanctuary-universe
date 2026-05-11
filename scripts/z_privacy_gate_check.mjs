import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const RAW_DIR = path.join(ROOT, 'uploads', 'raw');
const REPORT_PATH = path.join(ROOT, 'data', 'reports', 'privacy', 'z_privacy_report.json');

function walkFiles(folder) {
  if (!fs.existsSync(folder)) return [];
  const stack = [folder];
  const files = [];
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(fullPath);
      else if (entry.isFile()) files.push(fullPath);
    }
  }
  return files;
}

function hasRecentReport() {
  if (!fs.existsSync(REPORT_PATH)) return false;
  try {
    const data = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));
    const ts = Date.parse(data.generated_at || '');
    if (Number.isNaN(ts)) return false;
    const ageMs = Date.now() - ts;
    return ageMs <= 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

const rawFiles = walkFiles(RAW_DIR).map((file) => path.relative(ROOT, file).replaceAll('\\', '/'));
const recentReport = hasRecentReport();

if (rawFiles.length > 0) {
  console.error('⛔ Z-Privacy Gate blocked processing.');
  console.error(`Raw intake has ${rawFiles.length} file(s) pending privacy containment:`);
  rawFiles.slice(0, 20).forEach((f) => console.error(`- ${f}`));
  if (rawFiles.length > 20) console.error(`...and ${rawFiles.length - 20} more`);
  console.error('Run one of:');
  console.error('- node scripts/z_privacy_scan.mjs');
  console.error('- node scripts/z_privacy_scan.mjs --apply-actions');
  process.exit(2);
}

if (!recentReport) {
  console.error('⛔ Z-Privacy Gate blocked processing.');
  console.error('No recent privacy report found (24h).');
  console.error(`Expected: ${REPORT_PATH}`);
  console.error('Run: node scripts/z_privacy_scan.mjs');
  process.exit(3);
}

console.log('✅ Z-Privacy Gate check passed.');
