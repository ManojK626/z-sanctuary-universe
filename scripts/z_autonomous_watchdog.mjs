#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const RUNTIME_PATH = path.join(ROOT, 'data', 'reports', 'z_autonomous_runtime.json');
const WATCHDOG_PATH = path.join(ROOT, 'data', 'reports', 'z_autonomous_watchdog.json');

function hasFlag(flag) {
  return process.argv.includes(`--${flag}`);
}

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function runSelfHeal(jobId) {
  const result = spawnSync(process.execPath, ['scripts/z_autonomous_orchestrator.mjs', '--once', `--job=${jobId}`], {
    cwd: ROOT,
    shell: false,
    encoding: 'utf8',
  });
  return {
    job_id: jobId,
    ok: (result.status ?? 1) === 0,
    exit_code: result.status ?? 1,
    stdout_tail: String(result.stdout || '').trim().split(/\r?\n/).slice(-5),
    stderr_tail: String(result.stderr || '').trim().split(/\r?\n/).slice(-5),
  };
}

function main() {
  const heal = hasFlag('self-heal');
  const runtime = readJson(RUNTIME_PATH, null);
  const nowIso = new Date().toISOString();
  const nowMs = Date.now();

  if (!runtime) {
    const payload = {
      generated_at: nowIso,
      status: 'warn',
      reason: 'runtime_report_missing',
      actions: [],
    };
    writeJson(WATCHDOG_PATH, payload);
    console.log('Z-Autonomous watchdog: runtime report missing.');
    process.exit(0);
  }

  const generatedMs = Date.parse(runtime.generated_at || '');
  const ageSec = Number.isFinite(generatedMs) ? Math.floor((nowMs - generatedMs) / 1000) : null;
  const stale = ageSec === null ? true : ageSec > 3 * Math.max(30, Number(runtime.loop_interval_sec || 60));
  const hardFailedJobs = (runtime.results || []).filter((x) => x && x.ok === false && x.soft_fail !== true);

  const actions = [];
  if (heal) {
    for (const failed of hardFailedJobs) {
      actions.push(runSelfHeal(failed.id));
    }
  }

  let status = 'ok';
  if (hardFailedJobs.length > 0) status = 'blocked';
  else if (stale || String(runtime.status) === 'watch') status = 'watch';

  const payload = {
    generated_at: nowIso,
    status,
    runtime_status: runtime.status || 'unknown',
    runtime_age_sec: ageSec,
    stale,
    hard_failed_jobs: hardFailedJobs.map((x) => x.id),
    self_heal: {
      requested: heal,
      actions,
    },
  };
  writeJson(WATCHDOG_PATH, payload);
  console.log(`Z-Autonomous watchdog: ${status} (stale=${stale}, hard_failed=${hardFailedJobs.length})`);
  process.exit(status === 'blocked' ? 1 : 0);
}

main();
