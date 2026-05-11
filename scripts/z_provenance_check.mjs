import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, 'config', 'provenance_manifest.json');
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_provenance_check.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_provenance_check.md');

function readJson(absPath) {
  if (!fs.existsSync(absPath)) return null;
  return JSON.parse(fs.readFileSync(absPath, 'utf8'));
}

function fileHash(relPath) {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) return null;
  const data = fs.readFileSync(full);
  return createHash('sha256').update(data).digest('hex');
}

function checkEntry(entry) {
  const actual = fileHash(entry.path);
  const match = actual && actual === entry.sha256;
  return {
    path: entry.path,
    role: entry.role,
    expected: entry.sha256,
    actual,
    pass: Boolean(match),
  };
}

function main() {
  const manifest = readJson(MANIFEST_PATH);
  if (!manifest) {
    console.error('Provenance manifest missing');
    process.exit(1);
  }
  const entries = Array.isArray(manifest.entries) ? manifest.entries : [];
  const checks = entries.map((entry) => checkEntry(entry));
  const failed = checks.filter((c) => !c.pass);
  const status = failed.length === 0 ? 'green' : 'hold';
  const payload = {
    generated_at: new Date().toISOString(),
    status,
    manifest_version: manifest.version || '0.1',
    entries: checks,
  };
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  const md = [
    '# Z Provenance Check',
    '',
    `- Generated: ${payload.generated_at}`,
    `- Status: ${payload.status.toUpperCase()}`,
    `- Manifest Version: ${payload.manifest_version}`,
    '',
    '## Entries',
    ...checks.map((c) => `- [${c.pass ? 'x' : ' '}] ${c.path} (${c.role}) | expected=${c.expected} | actual=${c.actual || 'missing'}`),
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');
  if (status !== 'green') {
    process.exit(1);
  }
  console.log(`Z provenance check written: ${OUT_JSON}`);
}

main();
