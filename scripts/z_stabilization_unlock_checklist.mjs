#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_stabilization_unlock_checklist.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_stabilization_unlock_checklist.md');

const APPLY = process.argv.includes('--apply');
const nodeCmd = process.execPath;
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const STEPS = [
  {
    id: 'report_freshness',
    label: 'Refresh report freshness artifact',
    command: nodeCmd,
    args: ['scripts/z_report_freshness_check.mjs'],
  },
  {
    id: 'cross_project_observer',
    label: 'Refresh cross-project observer status',
    command: npmCmd,
    args: ['run', 'monitor:cross-project'],
  },
  {
    id: 'trust_scorecard',
    label: 'Recompute trust scorecard',
    command: npmCmd,
    args: ['run', 'trust:scorecard'],
  },
  {
    id: 'release_gate',
    label: 'Re-evaluate release gate verdict',
    command: npmCmd,
    args: ['run', 'release:gate'],
  },
];

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function run(command, args) {
  const child = spawnSync(command, args, {
    cwd: ROOT,
    stdio: 'inherit',
    shell: false,
  });
  return !child.error && (child.status ?? 1) === 0;
}

function refreshEnforcer() {
  run(nodeCmd, ['scripts/z_execution_enforcer.mjs']);
  const report = readJson(path.join(REPORTS_DIR, 'z_execution_enforcer.json')) || {};
  const checks = report?.checks || {};
  return {
    action: String(report?.action || 'unknown').toUpperCase(),
    reason: report?.reason || 'n/a',
    blockers: Array.isArray(report?.blockers) ? report.blockers : [],
    p1_open: checks.p1_open ?? null,
    readiness_pass: checks.readiness_pass ?? null,
    readiness_total: checks.readiness_total ?? null,
    release_gate: checks.release_gate ?? null,
  };
}

function writeReports(payload) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const lines = [
    '# Z Stabilization Unlock Checklist',
    '',
    `Generated: ${payload.generated_at}`,
    `Mode: ${payload.mode}`,
    '',
    `Initial action: **${payload.initial.action}**`,
    `Final action: **${payload.final.action}**`,
    '',
    '## Progress',
    `- Initial blockers: ${payload.initial.blockers.length}`,
    `- Final blockers: ${payload.final.blockers.length}`,
    '',
    '## Steps',
    '| Step | Status | Action after step |',
    '| --- | --- | --- |',
    ...payload.steps.map((step) => {
      const status = step.status;
      return `| ${step.id} | ${status} | ${step.enforcer_after.action} |`;
    }),
    '',
    '## Final blockers',
    ...(payload.final.blockers.length ? payload.final.blockers.map((b) => `- ${b}`) : ['- none']),
    '',
  ];

  fs.writeFileSync(OUT_MD, lines.join('\n'), 'utf8');
}

function main() {
  const initial = refreshEnforcer();
  const results = [];

  for (const step of STEPS) {
    let status = 'dry-run';
    if (APPLY) {
      const ok = run(step.command, step.args);
      status = ok ? 'ok' : 'failed';
    }
    const enforcerAfter = refreshEnforcer();
    results.push({
      id: step.id,
      label: step.label,
      command: `${step.command} ${step.args.join(' ')}`,
      status,
      enforcer_after: enforcerAfter,
    });
  }

  const final = results.length ? results[results.length - 1].enforcer_after : refreshEnforcer();
  const payload = {
    generated_at: new Date().toISOString(),
    mode: APPLY ? 'apply' : 'dry-run',
    initial,
    final,
    steps: results,
  };

  writeReports(payload);
  process.stdout.write(`Checklist report: ${OUT_JSON}\n`);
  process.stdout.write(
    `[Z-Unlock] Initial=${initial.action} (${initial.blockers.length} blockers) -> Final=${final.action} (${final.blockers.length} blockers)\n`
  );
}

main();
