import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const ANALYZER_PATH = path.join(REPORTS_DIR, 'z_anydevices_analyzer.json');
const SECURITY_PATH = path.join(REPORTS_DIR, 'z_anydevices_security_scan.json');
const OUT_JSON = path.join(REPORTS_DIR, 'z_anydevices_monitor.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_anydevices_monitor.md');
const HISTORY_JSONL = path.join(REPORTS_DIR, 'z_anydevices_monitor_history.jsonl');

const ANALYZER_STALE_MINUTES = 5;
const SECURITY_STALE_MINUTES = 10;

function readJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function minutesSince(isoTs) {
  if (!isoTs) return Number.POSITIVE_INFINITY;
  const t = Date.parse(isoTs);
  if (Number.isNaN(t)) return Number.POSITIVE_INFINITY;
  return (Date.now() - t) / 60000;
}

function runCmd(label, command) {
  const res = spawnSync(command, { cwd: ROOT, shell: true, encoding: 'utf8' });
  return {
    label,
    command,
    exit_code: res.status ?? 1,
    ok: !res.error && (res.status ?? 1) === 0,
    error: res.error ? res.error.message : null,
    stderr: String(res.stderr || '').trim(),
  };
}

function safeReadJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function canonicalize(value) {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(canonicalize);
  const out = {};
  for (const key of Object.keys(value).sort()) out[key] = canonicalize(value[key]);
  return out;
}

function sha256Hex(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function computeFingerprint(analyzer) {
  const deviceClasses = Array.isArray(analyzer?.devices?.class_counts)
    ? analyzer.devices.class_counts.map((x) => ({ Name: x?.Name || null, Count: Number(x?.Count || 0) }))
    : [];
  const adapters = Array.isArray(analyzer?.network?.adapters)
    ? analyzer.network.adapters.map((x) => ({
        Name: x?.Name || null,
        Status: x?.Status || null,
        LinkSpeed: x?.LinkSpeed || null,
      }))
    : [];
  const gpus = Array.isArray(analyzer?.compute?.gpus)
    ? analyzer.compute.gpus.map((x) => ({ Name: x?.Name || null, DriverVersion: x?.DriverVersion || null }))
    : [];
  const material = {
    platform: analyzer?.host?.platform || null,
    release: analyzer?.host?.release || null,
    cpu_model: analyzer?.host?.cpu?.model || null,
    cpu_cores: Number(analyzer?.host?.cpu?.cores_logical || 0),
    memory_total_gb: Number(analyzer?.host?.memory_gb?.total || 0),
    storage_total_gb: Number(analyzer?.storage?.total_size_gb || 0),
    storage_free_gb: Number(analyzer?.storage?.total_free_gb || 0),
    device_classes: deviceClasses,
    adapters,
    gpus,
  };
  const canonical = JSON.stringify(canonicalize(material));
  return {
    hash: sha256Hex(canonical),
    material,
  };
}

function detectDelta(prev, next) {
  if (!prev) return { changed: false, summary: 'baseline_initialized' };
  const deltas = [];
  if (prev.memory_total_gb !== next.memory_total_gb) {
    deltas.push(`memory_total_gb ${prev.memory_total_gb} -> ${next.memory_total_gb}`);
  }
  if (prev.storage_total_gb !== next.storage_total_gb) {
    deltas.push(`storage_total_gb ${prev.storage_total_gb} -> ${next.storage_total_gb}`);
  }
  if (prev.storage_free_gb !== next.storage_free_gb) {
    deltas.push(`storage_free_gb ${prev.storage_free_gb} -> ${next.storage_free_gb}`);
  }
  if (JSON.stringify(prev.device_classes) !== JSON.stringify(next.device_classes)) {
    deltas.push('device_classes changed');
  }
  if (JSON.stringify(prev.adapters) !== JSON.stringify(next.adapters)) {
    deltas.push('network_adapters changed');
  }
  if (JSON.stringify(prev.gpus) !== JSON.stringify(next.gpus)) {
    deltas.push('gpu inventory changed');
  }
  if (!deltas.length) return { changed: false, summary: 'no_material_change' };
  return { changed: true, summary: deltas.join(' | ') };
}

function appendHistory(entry) {
  fs.mkdirSync(path.dirname(HISTORY_JSONL), { recursive: true });
  fs.appendFileSync(HISTORY_JSONL, `${JSON.stringify(entry)}\n`, 'utf8');
}

function ensureFreshReports() {
  const analyzer = readJson(ANALYZER_PATH);
  const security = readJson(SECURITY_PATH);
  const analyzerAge = minutesSince(analyzer?.generated_at);
  const securityAge = minutesSince(security?.generated_at);
  const steps = [];

  if (!analyzer || analyzerAge > ANALYZER_STALE_MINUTES) {
    steps.push(runCmd('anydevices_analyzer_refresh', 'node scripts/z_anydevices_analyzer.mjs'));
  }
  if (!security || securityAge > SECURITY_STALE_MINUTES) {
    steps.push(runCmd('anydevices_security_refresh', 'node scripts/z_anydevices_security_scan.mjs'));
  }
  if (!fs.existsSync(path.join(REPORTS_DIR, 'z_anydevices_approval_queue.json'))) {
    steps.push(runCmd('anydevices_queue_init', 'node scripts/z_anydevices_approval_queue.mjs init'));
  }

  return steps;
}

function run() {
  const startedAt = new Date().toISOString();
  const steps = ensureFreshReports();
  const previous = safeReadJson(OUT_JSON);
  const analyzer = readJson(ANALYZER_PATH);
  const security = readJson(SECURITY_PATH);
  const queue = readJson(path.join(REPORTS_DIR, 'z_anydevices_approval_queue.json'));

  const analyzerAge = Math.round(minutesSince(analyzer?.generated_at));
  const securityAge = Math.round(minutesSince(security?.generated_at));
  const pending = Array.isArray(queue?.approvals)
    ? queue.approvals.filter((x) => x?.status === 'pending').length
    : 0;
  const nextFp = computeFingerprint(analyzer || {});
  const prevFp = previous?.device_fingerprint || null;
  const delta = detectDelta(prevFp?.material || null, nextFp.material);
  const fingerprintChanged = Boolean(prevFp?.hash && prevFp.hash !== nextFp.hash);

  const status =
    String(security?.status || '').toLowerCase() === 'blocked'
      ? 'hold'
      : steps.some((s) => !s.ok)
        ? 'hold'
        : 'green';

  const payload = {
    generated_at: startedAt,
    status,
    device_change_detected: fingerprintChanged,
    device_change_summary: fingerprintChanged ? delta.summary : 'no_change',
    analyzer_age_minutes: Number.isFinite(analyzerAge) ? analyzerAge : null,
    security_age_minutes: Number.isFinite(securityAge) ? securityAge : null,
    analyzer_status: analyzer?.status || 'unknown',
    security_status: security?.status || 'unknown',
    pending_approvals: pending,
    device_fingerprint: nextFp,
    actions: steps,
    notes:
      status === 'green'
        ? 'AnyDevices posture refreshed and aligned.'
        : 'AnyDevices monitor detected stale/blocked posture. Review security scan and approvals.',
  };

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  const md = [
    '# Z AnyDevices Monitor',
    '',
    `Generated: ${payload.generated_at}`,
    `Status: ${payload.status.toUpperCase()}`,
    `Analyzer: ${payload.analyzer_status} (${payload.analyzer_age_minutes ?? 'n/a'}m old)`,
    `Security: ${payload.security_status} (${payload.security_age_minutes ?? 'n/a'}m old)`,
    `Pending approvals: ${payload.pending_approvals}`,
    `Device change detected: ${payload.device_change_detected}`,
    `Device change summary: ${payload.device_change_summary}`,
    `Device fingerprint: ${payload.device_fingerprint.hash.slice(0, 16)}...`,
    '',
    '## Actions',
    ...(steps.length ? steps.map((s) => `- [${s.ok ? 'x' : ' '}] ${s.label} (exit=${s.exit_code})`) : ['- none']),
    '',
  ];
  fs.writeFileSync(OUT_MD, `${md.join('\n')}\n`, 'utf8');

  appendHistory({
    ts: startedAt,
    type: 'anydevices_monitor',
    status,
    analyzer_status: payload.analyzer_status,
    security_status: payload.security_status,
    device_change_detected: payload.device_change_detected,
    device_change_summary: payload.device_change_summary,
    fingerprint: payload.device_fingerprint.hash,
  });

  console.log(`✅ AnyDevices monitor written: ${OUT_JSON}`);
}

run();
