#!/usr/bin/env node
/**
 * Z-VHealth Core — Phase 1: read-only second health intelligence hub.
 * Reads existing JSON reports; writes z_vhealth_core_report.json + .md only.
 * No auto-fix, no release/gate changes, no quarantine, no deploy.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS, 'z_vhealth_core_report.json');
const OUT_MD = path.join(REPORTS, 'z_vhealth_core_report.md');

const INPUT_FILES = [
  'zuno_system_state_report.json',
  'z_qosmei_core_signal.json',
  'z_system_coherence.json',
  'z_adaptive_coherence.json',
  'z_communication_health.json',
  'z_bot_guardian.json',
  'z_bot_alerts.json',
  'z_fpsmc_storage_map.json',
  'z_vdk_scan_report.json',
  'z_prediction_validation.json',
  'z_release_gate_summary.json',
];

const AUTHORITY = 'advisory_only_no_auto_execution';

function readJson(name) {
  const p = path.join(REPORTS, name);
  try {
    if (!fs.existsSync(p)) return { _missing: true, _path: p };
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return { _readError: true, _path: path.join(REPORTS, name) };
  }
}

function safeStr(v) {
  if (v === null || v === undefined) return '';
  return String(v);
}

function mapPosture(score) {
  if (score >= 90) return 'strong';
  if (score >= 75) return 'watch';
  if (score >= 50) return 'caution';
  return 'hold';
}

function mapFutureRisk(score, vdkCritical, releaseHold, enforcerBlock) {
  if (enforcerBlock || vdkCritical > 0) return 'high';
  if (releaseHold) return 'high';
  if (score < 50) return 'high';
  if (score < 75) return 'medium';
  return 'low';
}

function buildReport() {
  const inputs = {};
  for (const f of INPUT_FILES) {
    inputs[f] = readJson(f);
  }

  const zuno = inputs['zuno_system_state_report.json'];
  const qos = inputs['z_qosmei_core_signal.json'];
  const sysCoh = inputs['z_system_coherence.json'];
  const adapt = inputs['z_adaptive_coherence.json'];
  const comm = inputs['z_communication_health.json'];
  const guardian = inputs['z_bot_guardian.json'];
  const alerts = inputs['z_bot_alerts.json'];
  const fpsmc = inputs['z_fpsmc_storage_map.json'];
  const vdk = inputs['z_vdk_scan_report.json'];
  const predVal = inputs['z_prediction_validation.json'];
  const release = inputs['z_release_gate_summary.json'];

  const enforcerPath = path.join(REPORTS, 'z_execution_enforcer.json');
  let enforcer = null;
  if (fs.existsSync(enforcerPath)) {
    try {
      enforcer = JSON.parse(fs.readFileSync(enforcerPath, 'utf8'));
    } catch {
      enforcer = null;
    }
  }

  const topRisks = [];
  let score = 88;
  const verify =
    zuno?._missing || zuno?._readError
      ? null
      : zuno.z_brother_today?.system_status_hub?.verify ?? zuno.system_status_hub?.verify;
  if (verify && verify !== 'PASS') {
    score -= 18;
    topRisks.push('Hub verify not PASS (Zuno summary).');
  }

  const signalLow =
    !zuno?._missing &&
    (zuno.signal_health?.status === 'low' || zuno.signal_health?.trend === 'insufficient');
  if (signalLow) {
    score -= 8;
    topRisks.push('Learning/signal health is low — add real task log / signal before scaling work.');
  }

  const cohStatus = sysCoh?._missing ? null : sysCoh.status;
  const cohMis =
    cohStatus === 'misaligned' || zuno?.system_coherence?.status === 'misaligned';
  if (cohMis) {
    score -= 7;
    topRisks.push('System coherence misaligned — layers disagree; resolve signal vs structure.');
  }

  const predRisk = adapt?._missing ? null : adapt.prediction_risk;
  if (predRisk === 'high') {
    score -= 5;
    topRisks.push('Adaptive coherence predicts elevated instability — address top adaptive actions.');
  }

  if (qos && !qos._missing && qos.posture && qos.posture !== 'clear') {
    score -= 4;
    topRisks.push(`QOSMEI posture not clear (${safeStr(qos.posture)}).`);
  }

  const commOk =
    !comm?._missing && comm.flow_status === 'healthy' && (!comm.issues || comm.issues.length === 0);
  if (!comm?._missing && !commOk) {
    score -= 5;
    topRisks.push('Communication health degraded or has open issues — refresh comms observers.');
  }

  const gSev = guardian?._missing ? null : guardian.summary?.highest_severity;
  if (gSev === 'HIGH' || (guardian?.summary?.severity?.HIGH ?? 0) > 0) {
    score -= 14;
    topRisks.push('Guardian reported HIGH-severity path issues.');
  } else if (gSev === 'MEDIUM' || (guardian?.summary?.severity?.MEDIUM ?? 0) > 0) {
    score -= 6;
    topRisks.push('Guardian has MEDIUM-severity items — review PC-root paths.');
  }

  const highAlerts = alerts?._missing ? 0 : Number(alerts.by_level?.HIGH || 0);
  if (highAlerts > 0) {
    score -= 4 * Math.min(highAlerts, 3);
    topRisks.push(`Bot alerts: ${highAlerts} HIGH-level alert(s).`);
  }

  const vdkSum = vdk?._missing ? null : vdk.summary;
  const vdkCrit = vdkSum?.critical ?? 0;
  const vdkHigh = vdkSum?.high ?? 0;
  const vdkMed = vdkSum?.medium ?? 0;
  if (vdkCrit > 0) {
    score -= 20;
    topRisks.push(`Z-VDK: ${vdkCrit} critical finding(s) — human review before any quarantine.`);
  } else if (vdkHigh > 0) {
    score -= 3;
    topRisks.push(`Z-VDK: ${vdkHigh} high-severity path(s) (often Downloads installers) — confirm origin.`);
  } else if (vdkMed > 3) {
    score -= 2;
    topRisks.push('Z-VDK: several medium findings — triage or refine scan allowlists when ready.');
  }

  const fpsmcWarnings = Array.isArray(fpsmc?.warnings) ? fpsmc.warnings : [];
  if (fpsmcWarnings.length > 0) {
    score -= Math.min(2 * fpsmcWarnings.length, 10);
    topRisks.push(`Z-FPSMC storage warnings: ${fpsmcWarnings.length} (low disk or scan notes).`);
  }

  const verdict = release?._missing ? null : release.verdict;
  const releaseHold = verdict && String(verdict).toUpperCase() !== 'GO';
  if (verdict && releaseHold) {
    score -= 10;
    topRisks.push(`Release gate not GO (${safeStr(verdict)}) — do not treat as release-ready.`);
  }

  const enforcerBlock =
    enforcer &&
    (String(enforcer.action || '').includes('BLOCK') ||
      (Array.isArray(enforcer.blockers) && enforcer.blockers.length > 0));
  if (enforcerBlock) {
    score -= 15;
    topRisks.push('Execution enforcer reports blockers — check z_execution_enforcer.json.');
  }

  const valAcc = predVal?.validation_summary?.accuracy;
  if (typeof valAcc === 'number' && valAcc < 0.5) {
    score -= 4;
    topRisks.push('Prediction validation accuracy low — review predictive vs actual logs.');
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  if (topRisks.length > 7) topRisks.length = 7;

  const posture = mapPosture(score);
  const futureRisk = mapFutureRisk(score, vdkCrit, releaseHold, !!enforcerBlock);
  const topRisk =
    topRisks[0] || (score >= 85 ? 'no_single_dominant_risk' : 'aggregate_pressure');

  const challengeQueue = [];
  if (cohMis || signalLow) {
    challengeQueue.push({
      id: 'signal_coherence_refresh',
      title: 'Signal + coherence refresh',
      difficulty: 'medium',
      reward: 'coherence + signal alignment',
      why: 'Coherence or signal reports show strain — strengthen real log lines and refresh scans.',
      safe_command: 'Append task JSONL entries, then npm run zuno:state',
    });
  }
  if (vdkHigh > 0 || vdkMed > 5) {
    challengeQueue.push({
      id: 'vdk_calm_review',
      title: 'VDK calm review',
      difficulty: 'easy',
      reward: 'VDK confidence +10',
      why: 'VDK has multiple findings — review the latest findings report; no quarantine in Phase 1.',
      safe_command: 'Read data/reports/z_vdk_findings_review_*.md and z_vdk_scan_report.json',
    });
  }
  if (verify && verify !== 'PASS') {
    challengeQueue.push({
      id: 'verify_recovery_scope',
      title: 'Recover hub verify (scoped)',
      difficulty: 'hard',
      reward: 'verify confidence',
      why: 'Hub verify not PASS — fix one failing scope, then re-run the appropriate verify target.',
      safe_command: 'npm run verify:full:technical  # or scoped pipeline per failure',
    });
  }
  if (fpsmcWarnings.length > 0) {
    challengeQueue.push({
      id: 'storage_challenge',
      title: 'Storage posture check',
      difficulty: 'medium',
      reward: 'storage clarity',
      why: 'FPSMC reported storage warnings — free space or path notes need attention.',
      safe_command: 'npm run fpsmc:scan && npm run fpsmc:report',
    });
  }
  challengeQueue.push({
    id: 'freshness_challenge',
    title: 'Observer freshness',
    difficulty: 'easy',
    reward: 'observer freshness',
    why: 'Keep AAFRTC + comms manifests in window for clear cross-layer reads.',
    safe_command: 'node scripts/z_aafrtc_resolve.mjs  # then npm run comms:github-ai as needed',
  });
  if (commOk && !signalLow && score >= 80) {
    challengeQueue.push({
      id: 'lint_scope_cleanup',
      title: 'Lint one scope (verify debt)',
      difficulty: 'medium',
      reward: 'verify debt reduction',
      why: 'When ready, reduce lint debt in one package at a time — no mass auto-fix.',
      safe_command: 'eslint scoped path from verify output; then npm run verify:full:technical',
    });
  }

  const recommendedChallenge = challengeQueue[0]
    ? {
        id: challengeQueue[0].id,
        title: challengeQueue[0].title,
        reason: challengeQueue[0].why,
        safe_action: challengeQueue[0].safe_command,
      }
    : {
        id: 'maintenance_cadence',
        title: 'Run standard observer cadence',
        reason: 'No dominant risk — keep reports fresh.',
        safe_action: 'npm run zuno:state',
      };

  const preparationPlan = [
    'npm run zuno:state',
    'npm run vhealth:report',
    'If VDK age is stale: npm run vdk:scan && npm run vdk:report',
    'If storage unknown: npm run fpsmc:scan && npm run fpsmc:report',
    'Archive Zuno if desired: npm run zuno:state:archive -- --force',
  ];

  const inputsPresent = Object.fromEntries(
    INPUT_FILES.map((f) => [f, !inputs[f]?._missing && !inputs[f]?._readError]),
  );
  if (enforcer) inputsPresent['z_execution_enforcer.json (optional)'] = true;

  return {
    schema_version: 1,
    name: 'z-vhealth-core',
    generated_at: new Date().toISOString(),
    posture,
    health_score: score,
    future_risk: futureRisk,
    top_risk: topRisk,
    top_risks: topRisks,
    recommended_challenge: recommendedChallenge,
    challenge_queue: challengeQueue,
    preparation_plan: preparationPlan,
    authority: AUTHORITY,
    sources_read: INPUT_FILES,
    inputs_present: inputsPresent,
    notes: {
      enforcer_considered: enforcer != null,
      scoring: 'Heuristic blend from Zuno, QOSMEI, coherence, comms, guardian, alerts, FPSMC, VDK, release, optional enforcer',
    },
  };
}

function writeMd(data) {
  const lines = [
    '# Z-VHealth Core — health intelligence (Phase 1)',
    '',
    `**Generated (UTC):** ${data.generated_at}`,
    `**Posture:** \`${data.posture}\` · **Health score:** **${data.health_score}** / 100 · **Future risk:** **${data.future_risk}**`,
    `**Authority:** \`${data.authority}\``,
    '',
    '## Top risk (summary)',
    '',
    safeStr(data.top_risk),
    '',
    '## Top risks (list)',
    '',
    ...(data.top_risks.length ? data.top_risks.map((r) => `- ${r}`) : ['- _None flagged._']),
    '',
    '## Recommended challenge',
    '',
    `- **id:** \`${data.recommended_challenge.id}\``,
    `- **title:** ${data.recommended_challenge.title}`,
    `- **reason:** ${data.recommended_challenge.reason}`,
    `- **safe action:** \`${String(data.recommended_challenge.safe_action).replace(/`/g, '\'')}\``,
    '',
    '## Challenge queue',
    '',
    ...data.challenge_queue.map(
      (c) =>
        `### ${c.id}\n\n- **difficulty:** ${c.difficulty}\n- **reward:** ${c.reward}\n- **why:** ${c.why}\n- **safe command:** \`${String(c.safe_command).replace(/`/g, '\'')}\`\n`,
    ),
    '## Preparation plan',
    '',
    ...data.preparation_plan.map((p) => `- ${p}`),
    '',
    '## Inputs read (presence)',
    '',
    ...Object.entries(data.inputs_present).map(([k, v]) => `- \`${k}\`: ${v ? 'yes' : 'no'}`),
    '',
    '---',
    '',
    'Read-only advisory layer. Does not modify source, gates, or security policy. See [docs/Z-VHEALTH-CORE.md](../docs/Z-VHEALTH-CORE.md).',
    '',
  ];
  return lines.join('\n');
}

const data = buildReport();
fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify(data, null, 2));
fs.writeFileSync(OUT_MD, writeMd(data));
console.log('OK: Z-VHealth report written:');
console.log(' ', path.relative(ROOT, OUT_JSON));
console.log(' ', path.relative(ROOT, OUT_MD));
console.log(`posture=${data.posture} score=${data.health_score} future_risk=${data.future_risk}`);
