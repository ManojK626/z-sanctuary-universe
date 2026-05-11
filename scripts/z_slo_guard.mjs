import fs from 'node:fs';
import path from 'node:path';
import { createIncidentReport } from './z_incident_reporter.mjs';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const CONFIG_PATH = path.join(ROOT, 'config', 'z_slo_targets.json');
const IDENTITY_PATH = path.join(ROOT, 'config', 'z_workspace_identity.json');
const PROFILE_PATH = path.join(ROOT, 'config', 'z_slo_profiles.json');
const OUT_JSON = path.join(REPORTS_DIR, 'z_slo_guard.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_slo_guard.md');

function readJson(absPath, fallback = null) {
  try {
    if (!fs.existsSync(absPath)) return fallback;
    return JSON.parse(fs.readFileSync(absPath, 'utf8'));
  } catch {
    return fallback;
  }
}

function toIso(value) {
  if (!value) return null;
  const ts = Date.parse(value);
  if (!Number.isFinite(ts)) return null;
  return new Date(ts).toISOString();
}

function ageMinutes(isoTs) {
  const ts = Date.parse(isoTs || '');
  if (!Number.isFinite(ts)) return Number.POSITIVE_INFINITY;
  return Math.max(0, Math.round((Date.now() - ts) / 60000));
}

function checkTarget(target) {
  const reportRel = String(target.report || '').replaceAll('\\', '/');
  const reportAbs = path.join(ROOT, reportRel);
  const expectedStatus = String(target.require_status || 'green').toLowerCase();
  const maxAge = Number(target.max_age_minutes || 120);

  if (!fs.existsSync(reportAbs)) {
    return {
      id: target.id || reportRel,
      pass: false,
      report: reportRel,
      note: 'report_missing',
    };
  }

  const report = readJson(reportAbs, {});
  const reportStatus = String(report?.status || 'unknown').toLowerCase();
  const generatedAt = toIso(report?.generated_at || report?.generatedAt || '');
  const mins = ageMinutes(generatedAt);

  const statusOk = reportStatus === expectedStatus;
  const freshOk = mins <= maxAge;
  const pass = statusOk && freshOk;

  return {
    id: target.id || reportRel,
    pass,
    report: reportRel,
    status_ok: statusOk,
    freshness_ok: freshOk,
    expected_status: expectedStatus,
    actual_status: reportStatus,
    generated_at: generatedAt,
    age_minutes: mins,
    max_age_minutes: maxAge,
    note: pass ? 'ok' : !statusOk ? 'status_mismatch' : 'stale',
    profile_name: target.profile_name || 'default',
  };
}

function mergeOverrides(target, ...overridesList) {
  const merged = { ...target };
  for (const overrides of overridesList) {
    if (!overrides) continue;
    const entry = overrides[target.id];
    if (entry && typeof entry === 'object') {
      Object.assign(merged, entry);
    }
  }
  return merged;
}

function main() {
  const cfg = readJson(CONFIG_PATH, { targets: [] });
  const identity = readJson(IDENTITY_PATH, { id: 'UNKNOWN', role: 'unknown' });
  const profileCfg = readJson(PROFILE_PATH, { version: '0.1', default: {}, profiles: {}, roles: {} });
  const identityProfile = (profileCfg.profiles || {})[identity.id] || {};
  const roleProfile = (profileCfg.roles || {})[identity.role] || {};
  const defaultProfile = profileCfg.default || {};
  const profileName = identity.id || identity.role || 'default';
  const targets = Array.isArray(cfg?.targets) ? cfg.targets : [];
  const checks = targets.map((target) => {
    const effective = mergeOverrides(target, defaultProfile, roleProfile, identityProfile);
    effective.profile_name = profileName;
    return checkTarget(effective);
  });
  const failed = checks.filter((c) => !c.pass);
  const status = failed.length === 0 ? 'green' : 'hold';
  const payload = {
    generated_at: new Date().toISOString(),
    status,
    policy_version: cfg?.version || '0.1',
    workspace: identity.id || 'UNKNOWN',
    profile: profileName,
    totals: {
      targets: checks.length,
      passed: checks.length - failed.length,
      failed: failed.length,
    },
    checks,
  };

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  if (payload.status !== 'green') {
    createIncidentReport(payload);
  }

  const md = [
    '# Z SLO Guard',
    '',
    `- Generated: ${payload.generated_at}`,
    `- Status: ${payload.status.toUpperCase()}`,
    `- Policy Version: ${payload.policy_version}`,
    `- Workspace: ${payload.workspace}`,
    `- Profile: ${payload.profile}`,
    `- Targets: ${payload.totals.targets}`,
    `- Passed: ${payload.totals.passed}`,
    `- Failed: ${payload.totals.failed}`,
    '',
    '## Checks',
    ...checks.map(
      (c) =>
        `- [${c.pass ? 'x' : ' '}] ${c.id} | status=${c.actual_status}/${c.expected_status} | age=${c.age_minutes}m (max ${c.max_age_minutes}m) | ${c.note}`
    ),
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

  console.log(`Z SLO guard written: ${OUT_JSON}`);
  if (status !== 'green') {
    process.exit(1);
  }
}

main();
