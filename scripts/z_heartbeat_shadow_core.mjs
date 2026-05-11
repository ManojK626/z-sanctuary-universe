#!/usr/bin/env node
/**
 * Z-Heartbeat Shadow Core — Phase 1: read-only resilience observer.
 * Writes status JSON/MD + appends one JSONL event per run. No deploy/shutdown/move/delete.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'data', 'reports');
const LOGS = path.join(ROOT, 'data', 'logs');
const OUT_JSON = path.join(REPORTS, 'z_heartbeat_shadow_status.json');
const OUT_MD = path.join(REPORTS, 'z_heartbeat_shadow_status.md');
const EVENTS_JSONL = path.join(LOGS, 'z_heartbeat_shadow_events.jsonl');
const AUTHORITY = 'advisory_only_no_auto_execution';
const SCHEMA_VERSION = 1;

/** Hours after which a report is “drift” (watch). */
const DRIFT_H = 48;
/** Hours after which Zuno is “very stale” (degraded contributor). */
const ZUNO_STALE_H = 72;
/** Hours after which FPSMC/VDK are considered degraded if still sole freshness signal. */
const MAP_STALE_H = 120;

function readJson(relUnderReports) {
  const p = path.join(REPORTS, relUnderReports);
  try {
    if (!fs.existsSync(p)) return { _missing: true, _path: p };
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return { _readError: true, _path: path.join(REPORTS, relUnderReports) };
  }
}

function readOptionalMd(relPath) {
  const p = path.isAbsolute(relPath) ? relPath : path.join(ROOT, relPath);
  try {
    if (!fs.existsSync(p)) return { exists: false, mtimeMs: null };
    const st = fs.statSync(p);
    return { exists: true, mtimeMs: st.mtimeMs };
  } catch {
    return { exists: false, mtimeMs: null };
  }
}

function ageHoursFromIso(iso) {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  return (Date.now() - t) / 3600000;
}

function latestZunoArchive() {
  try {
    const files = fs.readdirSync(REPORTS).filter((f) => /^zuno_system_state_report_archive_\d{4}-\d{2}-\d{2}\.md$/.test(f));
    if (!files.length) return null;
    files.sort();
    const last = files[files.length - 1];
    const st = fs.statSync(path.join(REPORTS, last));
    return {
      file: `data/reports/${last}`,
      mtimeMs: st.mtimeMs,
      age_hours: Number(((Date.now() - st.mtimeMs) / 3600000).toFixed(4)),
    };
  } catch {
    return null;
  }
}

function readSystemStatus() {
  const p = path.join(ROOT, 'data', 'system-status.json');
  try {
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function buildReport() {
  const generatedAt = new Date().toISOString();
  const zuno = readJson('zuno_system_state_report.json');
  const vhealth = readJson('z_vhealth_core_report.json');
  const fpsmc = readJson('z_fpsmc_storage_map.json');
  const vdk = readJson('z_vdk_scan_report.json');
  const comm = readJson('z_communication_health.json');
  const release = readJson('z_release_gate_summary.json');
  const greenReceipt = readOptionalMd('data/reports/z_full_technical_verify_green_2026-04-27.md');
  const sysStatus = readSystemStatus();
  const archive = latestZunoArchive();

  const freshness = {
    zuno_state_hours: zuno?._missing ? null : ageHoursFromIso(zuno.generated_at),
    vhealth_hours: vhealth?._missing ? null : ageHoursFromIso(vhealth.generated_at),
    fpsmc_hours: fpsmc?._missing ? null : ageHoursFromIso(fpsmc.generated_at),
    vdk_hours: vdk?._missing ? null : ageHoursFromIso(vdk.generated_at),
    communication_hours: comm?._missing ? null : ageHoursFromIso(comm.generated_at),
    release_gate_hours: release?._missing ? null : ageHoursFromIso(release.generated_at),
    technical_green_receipt: greenReceipt.exists
      ? { exists: true, age_hours: greenReceipt.mtimeMs != null ? (Date.now() - greenReceipt.mtimeMs) / 3600000 : null }
      : { exists: false, age_hours: null },
    latest_zuno_archive: archive,
  };

  const missing = [];
  const staleDrift = [];
  const staleSevere = [];
  if (zuno?._missing || zuno?._readError) missing.push('zuno_system_state_report.json');
  if (fpsmc?._missing || fpsmc?._readError) missing.push('z_fpsmc_storage_map.json');
  if (vdk?._missing || vdk?._readError) missing.push('z_vdk_scan_report.json');
  if (vhealth?._missing || vhealth?._readError) missing.push('z_vhealth_core_report.json');

  if (freshness.zuno_state_hours != null && freshness.zuno_state_hours > DRIFT_H) staleDrift.push('zuno');
  if (freshness.zuno_state_hours != null && freshness.zuno_state_hours > ZUNO_STALE_H) staleSevere.push('zuno');
  if (freshness.fpsmc_hours != null && freshness.fpsmc_hours > DRIFT_H) staleDrift.push('fpsmc');
  if (freshness.fpsmc_hours != null && freshness.fpsmc_hours > MAP_STALE_H) staleSevere.push('fpsmc');
  if (freshness.vdk_hours != null && freshness.vdk_hours > DRIFT_H) staleDrift.push('vdk');
  if (freshness.vdk_hours != null && freshness.vdk_hours > MAP_STALE_H) staleSevere.push('vdk');
  if (freshness.vhealth_hours != null && freshness.vhealth_hours > DRIFT_H) staleDrift.push('vhealth');
  if (freshness.communication_hours != null && freshness.communication_hours > 36) staleDrift.push('communication_health');

  const fpsmcWarnings = Array.isArray(fpsmc?.warnings) ? fpsmc.warnings.length : 0;
  const commUnhealthy = comm && !comm._missing && comm.flow_status && comm.flow_status !== 'healthy';
  const hubVerify = zuno?.z_brother_today?.system_status_hub?.verify;
  const verifyFail = hubVerify && hubVerify !== 'PASS';
  const releaseNotGo =
    release &&
    !release._missing &&
    release.verdict &&
    String(release.verdict).toUpperCase() !== 'GO';
  const vhealthScore = typeof vhealth?.health_score === 'number' ? vhealth.health_score : null;
  const vhealthHoldish = vhealthScore != null && vhealthScore < 50;

  const interrupted_or_missing_proof = {
    missing_critical_reports: missing,
    stale_beyond_drift: [...new Set(staleDrift)],
    stale_beyond_severe: [...new Set(staleSevere)],
    fpsmc_warning_count: fpsmcWarnings,
    communication_flow_not_healthy: !!commUnhealthy,
    hub_verify_not_pass: !!verifyFail,
    technical_green_receipt_missing: !greenReceipt.exists,
    system_status_verify:
      sysStatus && typeof sysStatus.verify === 'string' ? sysStatus.verify : null,
  };

  let heartbeat_posture = 'stable';
  if (missing.length >= 1) {
    heartbeat_posture = 'recovery_required';
  } else if (verifyFail || releaseNotGo || vhealthHoldish) {
    heartbeat_posture = 'hold';
  } else if (fpsmcWarnings > 0 || commUnhealthy || staleSevere.length >= 2) {
    heartbeat_posture = 'degraded';
  } else if (staleDrift.length >= 1 || !greenReceipt.exists) {
    heartbeat_posture = 'watch';
  }

  const safeByPosture = {
    stable: 'No advisory freeze. Keep normal cadence: refresh Zuno and awareness trio on schedule.',
    watch: 'Advisory: some observers are past drift window — refresh comms/communication health and re-run Zuno when practical; not an emergency by itself.',
    degraded: 'Advisory: multiple stress signals (storage warnings, comm stress, or very stale maps). Prefer save/archive; defer deploy until human review with release truth.',
    recovery_required: 'Advisory: critical report read failed or missing — refresh generators before trusting deploy; recover proof chain first.',
    hold: 'Advisory: hub verify, release gate, or extreme VHealth score indicates hold — align with release governance; Z-HSC does not change gates.',
  };
  const safe_mode_recommendation =
    safeByPosture[heartbeat_posture] || safeByPosture.degraded;

  const recovery_checklist = [
    'Advisory: freeze deploy intent until posture improves or human accepts risk (not an automatic block).',
    'npm run zuno:state',
    'npm run vhealth:report',
    'npm run fpsmc:scan && npm run fpsmc:report',
    'npm run vdk:scan && npm run vdk:report',
    'npm run zuno:state:archive -- --force',
    'Human GO/HOLD against release gate / Overseer truth — Z-HSC does not change gates.',
  ];

  const payload = {
    schema_version: SCHEMA_VERSION,
    name: 'z-heartbeat-shadow-core',
    generated_at: generatedAt,
    heartbeat_posture,
    authority: AUTHORITY,
    freshness,
    interrupted_or_missing_proof,
    safe_mode_recommendation,
    recovery_checklist,
    inputs_considered: [
      'zuno_system_state_report.json',
      'z_vhealth_core_report.json',
      'z_fpsmc_storage_map.json',
      'z_vdk_scan_report.json',
      'z_communication_health.json',
      'z_release_gate_summary.json',
      'data/reports/z_full_technical_verify_green_2026-04-27.md (optional)',
      'zuno_system_state_report_archive_*.md (latest)',
      'data/system-status.json (optional)',
    ],
    notes:
      'Phase 1 observer only. Does not detect AC power loss directly — infers stress from report staleness and known advisory signals.',
  };

  return payload;
}

function writeMd(data) {
  const fp = data.freshness;
  const im = data.interrupted_or_missing_proof;
  const lines = [
    '# Z-Heartbeat Shadow Core — status (Phase 1)',
    '',
    `**Generated (UTC):** ${data.generated_at}`,
    `**Posture:** \`${data.heartbeat_posture}\``,
    `**Authority:** \`${data.authority}\``,
    '',
    '## Freshness (approximate age)',
    '',
    `- Zuno state: **${fp.zuno_state_hours != null ? fp.zuno_state_hours.toFixed(2) + ' h' : 'n/a'}**`,
    `- VHealth: **${fp.vhealth_hours != null ? fp.vhealth_hours.toFixed(2) + ' h' : 'n/a'}**`,
    `- FPSMC map: **${fp.fpsmc_hours != null ? fp.fpsmc_hours.toFixed(2) + ' h' : 'n/a'}**`,
    `- VDK scan: **${fp.vdk_hours != null ? fp.vdk_hours.toFixed(2) + ' h' : 'n/a'}**`,
    `- Communication health: **${fp.communication_hours != null ? fp.communication_hours.toFixed(2) + ' h' : 'n/a'}**`,
    `- Technical green receipt file: **${fp.technical_green_receipt.exists ? 'present' : 'missing'}**${fp.technical_green_receipt.age_hours != null ? ` (~${fp.technical_green_receipt.age_hours.toFixed(2)} h since mtime)` : ''}`,
    `- Latest Zuno archive: **${fp.latest_zuno_archive ? fp.latest_zuno_archive.file : 'none found'}**${fp.latest_zuno_archive ? ` (~${fp.latest_zuno_archive.age_hours.toFixed(2)} h)` : ''}`,
    '',
    '## Flags',
    '',
    `- Missing critical reads: ${im.missing_critical_reports.length ? im.missing_critical_reports.join(', ') : '_none_'}`,
    `- Stale (drift): ${im.stale_beyond_drift.length ? im.stale_beyond_drift.join(', ') : '_none_'}`,
    `- Stale (severe): ${im.stale_beyond_severe.length ? im.stale_beyond_severe.join(', ') : '_none_'}`,
    `- FPSMC warnings: **${im.fpsmc_warning_count}**`,
    `- Communication flow not healthy: **${im.communication_flow_not_healthy}**`,
    `- Hub verify not PASS: **${im.hub_verify_not_pass}**`,
    `- Technical green receipt missing: **${im.technical_green_receipt_missing}**`,
    `- system-status verify: **${im.system_status_verify ?? 'n/a'}**`,
    '',
    '## Safe-mode recommendation',
    '',
    data.safe_mode_recommendation,
    '',
    '## Recovery checklist (advisory)',
    '',
    ...data.recovery_checklist.map((s) => `- ${s}`),
    '',
    '---',
    '',
    'Read-only observer. No shutdown, deploy, or gate changes. See [docs/Z-HEARTBEAT-SHADOW-CORE.md](../../docs/Z-HEARTBEAT-SHADOW-CORE.md).',
    '',
  ];
  return lines.join('\n');
}

function appendEvent(payload) {
  const ev = {
    ts: payload.generated_at,
    schema_version: payload.schema_version,
    heartbeat_posture: payload.heartbeat_posture,
    summary: `posture=${payload.heartbeat_posture} missing=${payload.interrupted_or_missing_proof.missing_critical_reports.length}`,
  };
  fs.mkdirSync(path.dirname(EVENTS_JSONL), { recursive: true });
  fs.appendFileSync(EVENTS_JSONL, `${JSON.stringify(ev)}\n`, 'utf8');
}

const payload = buildReport();
fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
fs.writeFileSync(OUT_MD, writeMd(payload), 'utf8');
appendEvent(payload);

console.log('OK: Z-Heartbeat Shadow Core');
console.log(' ', path.relative(ROOT, OUT_JSON));
console.log(' ', path.relative(ROOT, OUT_MD));
console.log(' ', path.relative(ROOT, EVENTS_JSONL), '(append)');
console.log(`posture=${payload.heartbeat_posture}`);
