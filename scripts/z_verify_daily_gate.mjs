import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const STAMP_PATH = path.join(REPORTS_DIR, 'z_verify_daily_gate.json');
const MD_PATH = path.join(REPORTS_DIR, 'z_verify_daily_gate.md');
const HOURS_WINDOW = 24;

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function writeReports(payload) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(STAMP_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  const lines = [
    '# Z Verify Daily Gate',
    '',
    `- Status: ${String(payload.status || 'unknown').toUpperCase()}`,
    `- Ran verify:full: ${payload.ran_verify_full ? 'yes' : 'no'}`,
    `- Reason: ${payload.reason || 'n/a'}`,
    `- Generated: ${payload.generated_at}`,
    payload.last_success_at ? `- Last success: ${payload.last_success_at}` : null,
    '',
  ].filter(Boolean);
  fs.writeFileSync(MD_PATH, `${lines.join('\n')}\n`, 'utf8');
}

function hoursSince(isoTs) {
  if (!isoTs) return Number.POSITIVE_INFINITY;
  const t = Date.parse(isoTs);
  if (Number.isNaN(t)) return Number.POSITIVE_INFINITY;
  return (Date.now() - t) / 36e5;
}

function runVerifyFull() {
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  return spawnSync(`${npmCmd} run verify:full`, {
    cwd: ROOT,
    stdio: 'inherit',
    shell: true,
  });
}

function runDashboardRegistryVerify() {
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  return spawnSync(`${npmCmd} run dashboard:registry-verify`, {
    cwd: ROOT,
    stdio: 'inherit',
    shell: true,
  });
}

function refreshOctaveArtifacts() {
  const nodeCmd = process.platform === 'win32' ? 'node.exe' : 'node';
  return spawnSync(`${nodeCmd} scripts/z_octave_artifacts_refresh.mjs`, {
    cwd: ROOT,
    stdio: 'inherit',
    shell: true,
  });
}

const now = new Date().toISOString();
const prior = readJson(STAMP_PATH) || {};
const elapsedHours = hoursSince(prior.last_success_at);

const refreshResult = refreshOctaveArtifacts();
if (refreshResult.error || (refreshResult.status ?? 1) !== 0) {
  const payload = {
    generated_at: now,
    status: 'hold',
    ran_verify_full: false,
    reason: refreshResult.error
      ? `OCTAVE artifact refresh failed: ${refreshResult.error.message}`
      : `OCTAVE artifact refresh failed with exit code ${refreshResult.status ?? 1}.`,
    last_success_at: prior.last_success_at || null,
  };
  writeReports(payload);
  process.exit(refreshResult.status ?? 1);
}

if (elapsedHours < HOURS_WINDOW) {
  const dashVerify = runDashboardRegistryVerify();
  if (dashVerify.error || (dashVerify.status ?? 1) !== 0) {
    const payload = {
      generated_at: now,
      status: 'hold',
      ran_verify_full: false,
      reason: dashVerify.error
        ? `dashboard:registry-verify failed to launch: ${dashVerify.error.message}`
        : `dashboard:registry-verify failed with exit code ${dashVerify.status ?? 1}.`,
      last_success_at: prior.last_success_at || null,
    };
    writeReports(payload);
    process.exit(dashVerify.status ?? 1);
  }
  const payload = {
    generated_at: now,
    status: 'green',
    ran_verify_full: false,
    dashboard_registry_verify_ok: true,
    reason: `Skipped: last successful run ${elapsedHours.toFixed(2)}h ago (< ${HOURS_WINDOW}h window). dashboard:registry-verify passed (verify:full not run).`,
    last_success_at: prior.last_success_at || null,
  };
  writeReports(payload);
  console.log(payload.reason);
  process.exit(0);
}

const result = runVerifyFull();
const ok = !result.error && (result.status ?? 1) === 0;

const payload = {
  generated_at: now,
  status: ok ? 'green' : 'hold',
  ran_verify_full: true,
  dashboard_registry_verify_ok: ok,
  reason: ok
    ? 'verify:full completed (includes dashboard:registry-verify).'
    : result.error
      ? `verify:full failed to launch: ${result.error.message}`
      : `verify:full failed with exit code ${result.status ?? 1}.`,
  last_success_at: ok ? now : prior.last_success_at || null,
};
writeReports(payload);

if (!ok) {
  process.exit(result.status ?? 1);
}

console.log('Z verify daily gate passed.');
