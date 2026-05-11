import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'data', 'reports');
const OUT_STATE = path.join(REPORTS, 'z_security_sentinel.json');
const OUT_ALERTS = path.join(REPORTS, 'z_security_alerts.json');
const OUT_ALERTS_JSONL = path.join(REPORTS, 'z_security_alerts.jsonl');

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs
    .readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
}

function severityFromStatus(status) {
  const s = String(status || '').toLowerCase();
  if (s === 'green') return 'ok';
  if (s === 'hold' || s === 'warn') return 'warn';
  return 'critical';
}

function run() {
  const hygiene = readJson(path.join(REPORTS, 'z_hygiene_status.json'), {});
  const proof = readJson(path.join(REPORTS, 'z_proof_mesh_card.json'), {});
  const autorun = readJson(path.join(REPORTS, 'z_autorun_audit.json'), {});
  const storage = readJson(path.join(REPORTS, 'z_storage_hygiene_audit.json'), {});
  const layout = readJson(path.join(REPORTS, 'z_data_layout_audit.json'), {});

  const checks = [
    { id: 'hygiene', status: hygiene.status || 'unknown' },
    { id: 'proof', status: proof.status || 'unknown' },
    { id: 'autorun', status: autorun.status || 'unknown' },
    { id: 'storage', status: storage.status || 'unknown' },
    { id: 'layout', status: layout.status || 'unknown' },
  ];

  const critical = checks.filter((c) => severityFromStatus(c.status) === 'critical');
  const warn = checks.filter((c) => severityFromStatus(c.status) === 'warn');
  const status = critical.length ? 'critical' : warn.length ? 'warn' : 'green';

  const alert = {
    ts: new Date().toISOString(),
    status,
    critical_count: critical.length,
    warn_count: warn.length,
    checks,
    lane_notify: ['observe', 'protect', 'repair', 'report'],
    message:
      status === 'green'
        ? 'All security lanes stable.'
        : status === 'warn'
          ? 'Security sentinel warning: review hold/warn checks.'
          : 'Security sentinel critical: immediate governance review required.',
  };

  const existing = readJsonl(OUT_ALERTS_JSONL).slice(-500);
  existing.push(alert);
  fs.mkdirSync(path.dirname(OUT_ALERTS_JSONL), { recursive: true });
  fs.writeFileSync(
    OUT_ALERTS_JSONL,
    existing.map((x) => JSON.stringify(x)).join('\n') + '\n'
  );

  writeJson(OUT_STATE, alert);
  writeJson(OUT_ALERTS, { generated_at: alert.ts, latest: alert, history_tail: existing.slice(-50) });
  console.log(`Security sentinel written: ${OUT_STATE}`);
}

run();
