#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_release_gate.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_release_gate.md');

function runStep(name, command, args) {
  const child = spawnSync(command, args, { cwd: ROOT, stdio: 'inherit', shell: false });
  return {
    name,
    command: `${command} ${args.join(' ')}`.trim(),
    exit_code: child.status ?? 1,
    ok: !child.error && (child.status ?? 1) === 0,
    error: child.error ? String(child.error.message || child.error) : null,
  };
}

function readJson(relPath) {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), 'utf8'));
  } catch {
    return null;
  }
}

const nodeCmd = process.execPath;
const steps = [
  runStep('execution_enforcer_gate', nodeCmd, ['scripts/z_execution_enforcer_gate.mjs']),
  runStep('cursor_folders_verify', nodeCmd, ['scripts/z_cursor_folder_bootstrap.mjs', '--verify']),
  runStep('structure_verify', nodeCmd, ['scripts/z_sanctuary_structure_verify.mjs']),
  runStep('registry_omni_verify', nodeCmd, ['scripts/z_registry_omni_verify.mjs']),
  runStep('report_freshness', nodeCmd, ['scripts/z_report_freshness_check.mjs']),
  runStep('cross_project_observer', nodeCmd, ['scripts/z_cross_project_health_probe.mjs']),
  runStep('boundary_ownership', nodeCmd, ['scripts/z_boundary_service_ownership_check.mjs']),
  runStep('trust_scorecard', nodeCmd, ['scripts/z_trust_scorecard.mjs']),
];

const freshness = readJson('data/reports/z_report_freshness.json');
const observer = readJson('data/reports/z_cross_project_observer.json');
const boundary = readJson('data/reports/z_boundary_service_ownership.json');
const trust = readJson('data/reports/z_trust_scorecard.json');

const failedSteps = steps.filter((s) => !s.ok);
const hardSignals = [
  freshness?.status === 'hold' ? 'freshness=hold' : null,
  observer?.status === 'hold' ? 'observer=hold' : null,
  (boundary?.violations?.length || 0) > 0 ? `boundary_violations=${boundary.violations.length}` : null,
  trust?.release_gate === 'hold' ? 'trust_scorecard=hold' : null,
].filter(Boolean);

const verdict = failedSteps.length === 0 && hardSignals.length === 0 ? 'go' : 'hold';

const payload = {
  generated_at: new Date().toISOString(),
  verdict,
  steps,
  checks: {
    freshness_status: freshness?.status || 'unknown',
    observer_status: observer?.status || 'unknown',
    boundary_violations: boundary?.violations?.length || 0,
    trust_score: trust?.trust_score ?? null,
    trust_grade: trust?.grade ?? null,
    trust_release_gate: trust?.release_gate ?? 'unknown',
  },
  blockers: [...failedSteps.map((s) => `${s.name} failed (exit ${s.exit_code})`), ...hardSignals],
};

fs.mkdirSync(REPORTS_DIR, { recursive: true });
fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

const md = [
  '# Z Release Gate',
  '',
  `Generated: ${payload.generated_at}`,
  `Verdict: **${payload.verdict.toUpperCase()}**`,
  '',
  '## Step Results',
  '| Step | Exit | Status |',
  '| --- | --- | --- |',
  ...steps.map((s) => `| ${s.name} | ${s.exit_code} | ${s.ok ? 'pass' : 'fail'} |`),
  '',
  '## Signal Checks',
  `- freshness: ${payload.checks.freshness_status}`,
  `- observer: ${payload.checks.observer_status}`,
  `- boundary violations: ${payload.checks.boundary_violations}`,
  `- trust score: ${payload.checks.trust_score ?? 'n/a'} (${payload.checks.trust_grade || 'n/a'})`,
  `- trust release gate: ${payload.checks.trust_release_gate}`,
  '',
  '## Blockers',
  ...(payload.blockers.length ? payload.blockers.map((b) => `- ${b}`) : ['- none']),
  '',
];
fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

console.log(`Release gate verdict: ${payload.verdict.toUpperCase()} (${OUT_JSON})`);
process.exit(verdict === 'go' ? 0 : 1);
