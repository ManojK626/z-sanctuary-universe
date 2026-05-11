#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const JOBS_PATH = path.join(ROOT, 'data', 'z_autonomous_jobs.json');
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const STATE_PATH = path.join(REPORTS_DIR, 'z_autonomous_state.json');
const RUNTIME_PATH = path.join(REPORTS_DIR, 'z_autonomous_runtime.json');
const LEDGER_PATH = path.join(REPORTS_DIR, 'z_autonomous_ledger.jsonl');

function parseArgs(argv) {
  const args = {
    once: false,
    loop: false,
    job: null,
    force: false,
  };
  for (const token of argv) {
    if (token === '--once') args.once = true;
    else if (token === '--loop') args.loop = true;
    else if (token.startsWith('--job=')) args.job = token.slice('--job='.length);
    else if (token === '--force') args.force = true;
  }
  if (!args.once && !args.loop) args.once = true;
  return args;
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

function appendJsonl(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, 'utf8');
}

function npmCommand() {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm';
}

function normalizeRisk(r) {
  return String(r || 'low').toLowerCase();
}

function readApprovalToken(policy) {
  const envName = String(policy?.approval_env || 'Z_AUTONOMOUS_APPROVAL_TOKEN');
  let token = String(process.env[envName] || '');
  const relFile = policy?.approval_token_file;
  if (!token && relFile) {
    const filePath = path.join(ROOT, String(relFile));
    try {
      const raw = fs.readFileSync(filePath, 'utf8').trim();
      token = raw.split(/\r?\n/)[0] || '';
    } catch {
      /* optional file */
    }
  }
  return token;
}

function approvalMinLength(policy, job) {
  const base = Math.max(1, Number(policy?.approval_token_min_length || 8));
  if (normalizeRisk(job?.risk) === 'sacred') {
    const sacred = Number(policy?.sacred_token_min_length || base + 8);
    return Math.max(base, sacred);
  }
  return base;
}

function jobRequiresApproval(job, policy) {
  const risks = Array.isArray(policy?.require_approval_for_risks)
    ? policy.require_approval_for_risks.map((x) => String(x).toLowerCase())
    : ['high', 'sacred'];
  return risks.includes(normalizeRisk(job?.risk));
}

function hasApprovalForJob(job, policy) {
  const token = readApprovalToken(policy);
  return token.length >= approvalMinLength(policy, job);
}

function runJob(job) {
  const timeoutMs = Math.max(30, Number(job.timeout_sec || 900)) * 1000;
  let command = job.command;
  let args = Array.isArray(job.args) ? job.args : [];
  let useShell = false;
  if (job.kind === 'npm') {
    if (process.platform === 'win32') {
      command = `npm run ${String(job.script || '')}`;
      args = [];
      useShell = true;
    } else {
      command = npmCommand();
      args = ['run', String(job.script || '')];
    }
  }
  if (!command) {
    return {
      ok: false,
      code: 1,
      elapsed_ms: 0,
      error: 'missing_command',
    };
  }
  const startedMs = Date.now();
  const result = spawnSync(command, args, {
    cwd: ROOT,
    timeout: timeoutMs,
    shell: useShell,
    encoding: 'utf8',
  });
  const elapsedMs = Date.now() - startedMs;
  const ok = (result.status ?? 1) === 0;
  return {
    ok,
    code: result.status ?? 1,
    elapsed_ms: elapsedMs,
    timeout: Boolean(result.signal),
    stdout_tail: String(result.stdout || '').trim().split(/\r?\n/).slice(-8),
    stderr_tail: String(result.stderr || '').trim().split(/\r?\n/).slice(-8),
  };
}

function statusFromResults(results) {
  const actionable = results.filter((x) => !x.skipped_by_policy);
  const hardFailures = actionable.filter((x) => !x.ok && !x.soft_fail);
  const softFailures = actionable.filter((x) => !x.ok && x.soft_fail);
  if (hardFailures.length > 0) return 'blocked';
  if (softFailures.length > 0) return 'watch';
  return 'ok';
}

function runCycle({ selectedJobId = null, force = false }) {
  const nowIso = new Date().toISOString();
  const nowMs = Date.now();
  const config = readJson(JOBS_PATH, { loop_interval_sec: 60, jobs: [], policy: {} });
  const policy = config.policy && typeof config.policy === 'object' ? config.policy : {};
  const state = readJson(STATE_PATH, { jobs: {} });
  const jobs = Array.isArray(config.jobs) ? config.jobs : [];

  const eligible = jobs.filter((job) => {
    if (!job || job.enabled === false) return false;
    if (selectedJobId && job.id !== selectedJobId) return false;
    return true;
  });

  const due = force
    ? eligible
    : eligible.filter((job) => {
    const runEveryMs = Math.max(30, Number(job.interval_sec || 300)) * 1000;
    const lastOkOrFail = Number(state.jobs?.[job.id]?.last_finished_ms || 0);
    if (!lastOkOrFail) return true;
    return nowMs - lastOkOrFail >= runEveryMs;
  });

  const results = [];
  for (const job of due) {
    const startedAt = new Date().toISOString();
    let row;
    if (jobRequiresApproval(job, policy) && !hasApprovalForJob(job, policy)) {
      const finishedAt = new Date().toISOString();
      row = {
        id: job.id,
        label: job.label || job.id,
        risk: String(job.risk || 'low'),
        soft_fail: Boolean(job.soft_fail),
        started_at: startedAt,
        finished_at: finishedAt,
        skipped_by_policy: true,
        policy_reason: 'approval_required',
        policy_hint: `Set ${policy.approval_env || 'Z_AUTONOMOUS_APPROVAL_TOKEN'} (${approvalMinLength(policy, job)}+ chars) or create ${policy.approval_token_file || 'data/local/z_autonomous_approval_token'}`,
        ok: true,
        code: 0,
        elapsed_ms: 0,
      };
      results.push(row);
      state.jobs[job.id] = {
        last_started_at: startedAt,
        last_finished_at: finishedAt,
        last_finished_ms: Date.now(),
        last_ok: null,
        last_code: null,
        last_skipped_policy: true,
        risk: row.risk,
      };
      continue;
    }
    const outcome = runJob(job);
    const finishedAt = new Date().toISOString();
    row = {
      id: job.id,
      label: job.label || job.id,
      risk: String(job.risk || 'low'),
      soft_fail: Boolean(job.soft_fail),
      started_at: startedAt,
      finished_at: finishedAt,
      skipped_by_policy: false,
      ...outcome,
    };
    results.push(row);
    state.jobs[job.id] = {
      last_started_at: startedAt,
      last_finished_at: finishedAt,
      last_finished_ms: Date.now(),
      last_ok: row.ok,
      last_code: row.code,
      last_skipped_policy: false,
      risk: row.risk,
    };
  }

  const skipped = eligible
    .filter((job) => !due.some((x) => x.id === job.id))
    .map((job) => ({ id: job.id, label: job.label || job.id }));

  const status = statusFromResults(results);
  const policySkipped = results.filter((x) => x.skipped_by_policy).length;
  const executed = results.filter((x) => !x.skipped_by_policy).length;
  const payload = {
    generated_at: nowIso,
    mode: selectedJobId ? 'single-job' : 'cycle',
    status,
    policy: {
      require_approval_for_risks: Array.isArray(policy.require_approval_for_risks)
        ? policy.require_approval_for_risks
        : ['high', 'sacred'],
      approval_env: policy.approval_env || 'Z_AUTONOMOUS_APPROVAL_TOKEN',
      approval_ready_high: hasApprovalForJob({ risk: 'high' }, policy),
      approval_ready_sacred: hasApprovalForJob({ risk: 'sacred' }, policy),
    },
    loop_interval_sec: Number(config.loop_interval_sec || 60),
    totals: {
      eligible: eligible.length,
      due: due.length,
      ran: results.length,
      executed,
      skipped: skipped.length,
      skipped_policy: policySkipped,
      failed_hard: results.filter((x) => !x.skipped_by_policy && !x.ok && !x.soft_fail).length,
      failed_soft: results.filter((x) => !x.skipped_by_policy && !x.ok && x.soft_fail).length,
    },
    due_job_ids: due.map((x) => x.id),
    skipped_jobs: skipped,
    results,
  };

  writeJson(STATE_PATH, state);
  writeJson(RUNTIME_PATH, payload);
  appendJsonl(LEDGER_PATH, {
    ts: nowIso,
    event: 'autonomous_cycle',
    status,
    ran: results.length,
    executed: payload.totals.executed,
    skipped_policy: policySkipped,
    failed_hard: payload.totals.failed_hard,
    failed_soft: payload.totals.failed_soft,
    due_job_ids: payload.due_job_ids,
  });
  return payload;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.once) {
    const payload = runCycle({ selectedJobId: args.job, force: args.force });
    console.log(`Z-Autonomous cycle: ${payload.status} (ran=${payload.totals.ran})`);
    process.exit(payload.status === 'blocked' ? 1 : 0);
  }

  const cfg = readJson(JOBS_PATH, { loop_interval_sec: 60 });
  const waitMs = Math.max(15, Number(cfg.loop_interval_sec || 60)) * 1000;
  console.log(`Z-Autonomous loop started (interval=${Math.round(waitMs / 1000)}s).`);
  // Daemon loop (process exits on SIGINT/SIGTERM).
  for (;;) {
    const payload = runCycle({ selectedJobId: args.job, force: args.force });
    console.log(`[Z-Autonomous] ${payload.status} ran=${payload.totals.ran} failed_hard=${payload.totals.failed_hard}`);
    await sleep(waitMs);
  }
}

main().catch((error) => {
  console.error('Z-Autonomous orchestrator crashed:', error?.message || error);
  process.exit(1);
});
