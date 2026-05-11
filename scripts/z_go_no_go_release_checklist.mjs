#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORT_DIR, 'z_go_no_go_release_checklist.json');
const OUT_MD = path.join(REPORT_DIR, 'z_go_no_go_release_checklist.md');

function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function refreshArtifacts() {
  const nodeCmd = process.execPath;
  const steps = [
    ['scripts/z_execution_enforcer.mjs'],
    ['scripts/z_bridge/z_bridge_intelligence_summary.mjs'],
    ['scripts/z_bridge/z_intelligence_regression.mjs'],
    ['scripts/z_report_freshness_check.mjs'],
    ['scripts/z_cross_project_health_probe.mjs'],
    ['scripts/z_trust_scorecard.mjs'],
    ['scripts/z_structural_pattern_intelligence.mjs'],
    ['scripts/z_spi_decision_advisor.mjs'],
    ['scripts/z_learning_evaluator.mjs'],
    ['scripts/z_adaptive_weight_tuner.mjs'],
    ['scripts/z_qosmei_signal_fusion.mjs'],
    ['scripts/z_cross_system_synthesizer.mjs'],
    ['scripts/z_predictive_intelligence_engine.mjs'],
    ['scripts/z_prediction_validator.mjs'],
    ['scripts/z_qosmei_signal_fusion.mjs'],
    ['scripts/z_release_gate_summary.mjs'],
  ];
  for (const args of steps) {
    const res = spawnSync(nodeCmd, args, { cwd: ROOT, stdio: 'inherit', shell: false });
    if (res.error || (res.status ?? 1) !== 0) return false;
  }
  return true;
}

function gate(id, label, pass, value, required, notes = '') {
  return { id, label, pass, value, required, notes };
}

function buildChecklist() {
  const enforcer = readJson(path.join(REPORT_DIR, 'z_execution_enforcer.json'), {});
  const releaseSummary = readJson(path.join(REPORT_DIR, 'z_release_gate_summary.json'), {});
  const trust = readJson(path.join(REPORT_DIR, 'z_trust_scorecard.json'), {});
  const zuno = readJson(path.join(REPORT_DIR, 'zuno_system_state_report.json'), {});
  const bridgeRegression = readJson(path.join(REPORT_DIR, 'z_bridge_intelligence_regression.json'), {});
  const bridgeSummary = readJson(path.join(REPORT_DIR, 'z_bridge_intelligence_summary.json'), {});
  const qosmei = readJson(path.join(REPORT_DIR, 'z_qosmei_core_signal.json'), {});

  const checks = enforcer?.checks || {};
  const readinessPass = Number(checks.readiness_pass ?? zuno?.current?.metrics?.readiness_gates_pass ?? 0);
  const readinessTotal = Number(checks.readiness_total ?? zuno?.current?.metrics?.readiness_gates_total ?? 4);
  const trustScore = Number(trust?.trust_score ?? releaseSummary?.trust?.score ?? 0);
  const p1Open = Number(checks.p1_open ?? 0);
  const releaseGate = String(releaseSummary?.release_gate || checks.release_gate || releaseSummary?.verdict || 'unknown').toLowerCase();
  const enforcerAction = String(enforcer?.action || 'unknown').toUpperCase();
  const regressionPass = String(bridgeRegression?.status || '').toLowerCase() === 'pass';
  const qosmeiComposite = Number(qosmei?.score?.composite ?? 0);
  const qosmeiClear =
    String(qosmei?.posture || '').toLowerCase() === 'clear' &&
    String(qosmei?.confidence_band || '').toLowerCase() === 'high' &&
    qosmei?.advisory_only !== false;
  const advisoryBridgeAllowance =
    qosmeiClear && trustScore >= 85 && enforcerAction === 'ALLOW_PROGRESS';
  const bridgeBlocked = Number(bridgeSummary?.allocations_blocked ?? 0);
  const bridgeBlockedLimit = advisoryBridgeAllowance ? 4 : 2;
  const bridgeRequired = advisoryBridgeAllowance ? '<= 2 (strict) | <= 4 (QOSMEI advisory lane)' : '<= 2';

  const gates = [
    gate('execution_enforcer', 'Execution enforcer must allow progress', enforcerAction === 'ALLOW_PROGRESS', enforcerAction, 'ALLOW_PROGRESS'),
    gate('release_gate', 'Release gate verdict', releaseGate === 'ready' || releaseGate === 'go', releaseGate, 'ready/go'),
    gate('readiness', 'Readiness gates', readinessPass >= readinessTotal && readinessTotal > 0, `${readinessPass}/${readinessTotal}`, `${readinessTotal}/${readinessTotal}`),
    gate('p1_backlog', 'P1 tasks open', p1Open === 0, p1Open, 0),
    gate('trust_score', 'Trust score minimum', trustScore >= 85, trustScore, '>= 85'),
    gate(
      'qosmei_advisory_signal',
      'QOSMEI advisory signal',
      qosmeiComposite >= 75,
      `${qosmeiComposite} (${qosmei?.posture || 'unknown'})`,
      '>= 75 (advisory)',
      qosmei?.recommendation || 'No QOSMEI recommendation'
    ),
    gate('bridge_regression', 'Bridge intelligence regression', regressionPass, bridgeRegression?.status || 'unknown', 'pass'),
    gate(
      'bridge_blocked_ratio',
      'Bridge blocked decisions trend',
      bridgeBlocked <= bridgeBlockedLimit,
      bridgeBlocked,
      bridgeRequired,
      advisoryBridgeAllowance
        ? 'Bounded advisory lane active: enforcer=ALLOW_PROGRESS, trust>=85, QOSMEI=clear/high.'
        : 'Strict lane active: requires <=2 blocked allocations.'
    ),
  ];

  const failed = gates.filter((g) => !g.pass);
  const verdict = failed.length === 0 ? 'GO' : 'NO-GO';

  return {
    generated_at: new Date().toISOString(),
    verdict,
    total_gates: gates.length,
    passed_gates: gates.length - failed.length,
    failed_gates: failed.length,
    gates,
    blockers: failed.map((f) => `${f.id}: value=${f.value} required=${f.required}`),
  };
}

function writeReport(payload) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  const md = [
    '# Z GO/NO-GO Release Checklist',
    '',
    `Generated: ${payload.generated_at}`,
    `Verdict: **${payload.verdict}**`,
    `Passed: ${payload.passed_gates}/${payload.total_gates}`,
    '',
    '| Gate | Result | Value | Required |',
    '| --- | --- | --- | --- |',
    ...payload.gates.map((g) => `| ${g.label} | ${g.pass ? 'PASS' : 'FAIL'} | ${g.value} | ${g.required} |`),
    '',
    '## Blockers',
    ...(payload.blockers.length ? payload.blockers.map((b) => `- ${b}`) : ['- none']),
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');
}

if (!refreshArtifacts()) {
  console.error('[z_go_no_go_release_checklist] artifact refresh failed');
  process.exit(1);
}
const payload = buildChecklist();
writeReport(payload);
console.log(`[z_go_no_go_release_checklist] ${payload.verdict} -> ${OUT_JSON}`);
if (payload.verdict !== 'GO') process.exitCode = 1;
