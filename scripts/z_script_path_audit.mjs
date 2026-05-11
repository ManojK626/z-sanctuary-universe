import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TARGET_HTML = path.join(ROOT, 'core', 'index.html');
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_script_path_audit.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_script_path_audit.md');

function run() {
  const generatedAt = new Date().toISOString();
  const html = fs.readFileSync(TARGET_HTML, 'utf8');
  const matches = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map((m) => m[1]);
  const local = matches.filter((src) => !src.startsWith('http') && !src.startsWith('/'));

  const rows = local.map((src) => {
    const resolved = path.normalize(path.join(ROOT, 'core', src));
    return {
      src,
      resolved: path.relative(ROOT, resolved).replaceAll('\\', '/'),
      exists: fs.existsSync(resolved),
      suspicious: src.startsWith('./core/'),
    };
  });

  const missing = rows.filter((r) => !r.exists);
  const suspicious = rows.filter((r) => r.suspicious);
  const status = missing.length === 0 ? 'green' : 'hold';

  const payload = {
    generated_at: generatedAt,
    status,
    metrics: {
      total_scripts: matches.length,
      local_scripts: local.length,
      missing_scripts: missing.length,
      suspicious_prefix_paths: suspicious.length,
    },
    missing,
    suspicious,
  };

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2));

  const md = [
    '# Z Script Path Audit',
    '',
    `Generated: ${generatedAt}`,
    `Status: ${status.toUpperCase()}`,
    '',
    '## Metrics',
    `- total_scripts: ${payload.metrics.total_scripts}`,
    `- local_scripts: ${payload.metrics.local_scripts}`,
    `- missing_scripts: ${payload.metrics.missing_scripts}`,
    `- suspicious_prefix_paths: ${payload.metrics.suspicious_prefix_paths}`,
    '',
    '## Missing',
    ...(missing.length
      ? missing.map((m) => `- ${m.src} -> ${m.resolved}`)
      : ['- none']),
    '',
    '## Suspicious Prefix (`./core/` from `core/index.html`)',
    ...(suspicious.length
      ? suspicious.map((s) => `- ${s.src}`)
      : ['- none']),
    '',
  ];

  fs.writeFileSync(OUT_MD, md.join('\n'));
  console.log(`✅ Script path audit written: ${OUT_JSON}`);
}

run();
