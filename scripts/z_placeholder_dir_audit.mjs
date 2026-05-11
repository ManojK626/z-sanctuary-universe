import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REGISTRY_PATH = path.join(ROOT, 'data', 'z_placeholder_dirs.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_placeholder_dir_audit.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_placeholder_dir_audit.md');

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function run() {
  const registry = readJson(REGISTRY_PATH, { dirs: [] });
  const dirs = Array.isArray(registry.dirs) ? registry.dirs : [];

  const checks = dirs.map((entry) => {
    const rel = String(entry.path || '').replaceAll('\\', '/');
    const abs = path.join(ROOT, rel);
    const exists = fs.existsSync(abs);
    const isDir = exists ? fs.statSync(abs).isDirectory() : false;
    const count = isDir ? fs.readdirSync(abs, { withFileTypes: true }).length : 0;
    return {
      path: rel,
      intent: entry.intent || 'placeholder',
      note: entry.note || '',
      exists,
      is_dir: isDir,
      item_count: count,
      pass: exists && isDir,
    };
  });

  const payload = {
    generated_at: new Date().toISOString(),
    status: checks.every((c) => c.pass) ? 'green' : 'hold',
    total: checks.length,
    pass: checks.filter((c) => c.pass).length,
    checks,
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2));

  const md = [
    '# Z Placeholder Directory Audit',
    '',
    `Generated: ${payload.generated_at}`,
    `Status: ${payload.status.toUpperCase()}`,
    `Pass: ${payload.pass}/${payload.total}`,
    '',
    '## Entries',
    ...checks.map(
      (c) =>
        `- [${c.pass ? 'x' : ' '}] ${c.path} · exists=${c.exists} · is_dir=${c.is_dir} · item_count=${c.item_count}`
    ),
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'));

  console.log(`Placeholder dir audit written: ${OUT_JSON}`);
}

run();
