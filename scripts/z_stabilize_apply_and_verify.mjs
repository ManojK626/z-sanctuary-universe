#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const nodeCmd = JSON.stringify(process.execPath);

const STEPS = [
  { label: 'report_freshness', command: `${nodeCmd} scripts/z_report_freshness_check.mjs` },
  { label: 'cross_project_observer', command: 'npm run monitor:cross-project' },
  { label: 'trust_scorecard', command: 'npm run trust:scorecard' },
  { label: 'release_gate', command: 'npm run release:gate' },
  { label: 'execution_enforcer', command: `${nodeCmd} scripts/z_execution_enforcer.mjs` },
  { label: 'bridge_summary', command: 'npm run bridge:intel:summary' },
  { label: 'bridge_regression', command: 'npm run bridge:intel:regression' },
  { label: 'ide_commflow_guard', command: 'npm run ide:commflow:guard' },
  { label: 'lab_folder_boost', command: 'npm run lab:folder:boost' },
  { label: 'go_no_go', command: 'npm run release:go-no-go' },
  { label: 'ecosystem_commflow', command: 'npm run ecosystem:commflow:verify' },
];

function runStep(step) {
  process.stdout.write(`\n[stabilize:apply-and-verify] step=${step.label}\n`);
  const res = spawnSync(step.command, [], {
    cwd: ROOT,
    stdio: 'inherit',
    shell: true,
  });
  const exitCode = res.status ?? 1;
  return { ...step, exitCode, ok: !res.error && exitCode === 0 };
}

const results = [];
for (const step of STEPS) {
  const result = runStep(step);
  results.push(result);
}

const failed = results.filter((r) => !r.ok);
process.stdout.write('\n[stabilize:apply-and-verify] summary\n');
for (const result of results) {
  process.stdout.write(`- ${result.label}: ${result.ok ? 'ok' : `failed (exit ${result.exitCode})`}\n`);
}

if (failed.length > 0) {
  process.stderr.write(
    `[stabilize:apply-and-verify] completed with ${failed.length} failing step(s). Inspect latest reports.\n`
  );
  process.exitCode = 1;
} else {
  process.stdout.write('[stabilize:apply-and-verify] all steps passed.\n');
}
