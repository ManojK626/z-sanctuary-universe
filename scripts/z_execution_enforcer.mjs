#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { evaluateReleaseGovernance, normalizeReleaseControl } from './z_release_governance_core.mjs';

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'data', 'reports');
const OUTPUT_PATH = path.join(REPORT_DIR, 'z_execution_enforcer.json');

function nowIso() {
  return new Date().toISOString();
}

async function readJsonSafe(filePath, fallback = null) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function countOpenP1FromTaskList(taskList) {
  if (!Array.isArray(taskList)) return 0;
  return taskList.filter((task) => {
    const priority = String(task?.priority || '').toUpperCase();
    const status = String(task?.status || '').toLowerCase();
    return priority === 'P1' && !['done', 'closed', 'resolved'].includes(status);
  }).length;
}

function countPlannedModules(manifest) {
  const modules = manifest?.ZModules;
  if (!Array.isArray(modules)) return 0;
  return modules.filter((module) => String(module?.ZStatus || '').toLowerCase() === 'planned').length;
}

function chooseAction(context) {
  const blockers = [];

  if (context.p1Open > 0) {
    blockers.push(`P1 tasks open: ${context.p1Open}`);
  }
  if (context.releaseGate !== 'ready') {
    blockers.push(`Release governance: ${context.releaseGate} (${context.governanceHint || 'see z_release_governance.json'})`);
  }
  if (context.readinessPass < context.readinessTotal) {
    blockers.push(`Readiness gates: ${context.readinessPass}/${context.readinessTotal}`);
  }

  let action = 'ALLOW_PROGRESS';
  let reason = 'No blocking signals detected.';

  if (blockers.length > 0) {
    action = 'BLOCK';
    reason = blockers.join(' | ');
  } else if (context.disturbance === 'alert') {
    action = 'FORCE_DIAGNOSTICS';
    reason = 'Disturbance watch is alert.';
  }

  return { action, reason, blockers };
}

function buildReport(context) {
  const decision = chooseAction(context);
  const promotionAllowed = context.plannedModules === 0;

  return {
    generated_at: nowIso(),
    source_reports: {
      zuno: 'data/reports/zuno_system_state_report.json',
      release_gate: 'data/reports/z_release_gate_summary.json',
      release_governance: 'data/reports/z_release_governance.json',
      release_control: 'data/z_release_control.json',
      ai_status: 'data/reports/z_ai_status.json',
      module_manifest: 'data/z_module_manifest.json',
      task_list: 'data/z_task_list.json',
      system_coherence: 'data/reports/z_system_coherence.json',
      adaptive_coherence: 'data/reports/z_adaptive_coherence.json',
      self_tuning: 'data/reports/z_self_tuning.json',
      experience_memory: 'data/reports/z_experience_memory.json',
      experience_intelligence: 'data/reports/z_experience_intelligence.json',
      fusion_council: 'data/reports/z_fusion_council.json',
      dsr: 'data/reports/z_dsr_analysis.json',
      formula_sync: 'data/reports/z_formula_sync_check.json',
      traffic_intelligence: 'data/reports/z_traffic_intelligence.json',
      fhmff_lite: 'data/reports/z_fhmff_lite.json',
    },
    mode: 'stabilization',
    action: decision.action,
    reason: decision.reason,
    blockers: decision.blockers,
    checks: {
      p1_open: context.p1Open,
      readiness_pass: context.readinessPass,
      readiness_total: context.readinessTotal,
      release_gate: context.releaseGate,
      governance: context.governanceSnapshot || null,
      disturbance_watch: context.disturbance,
      planned_modules: context.plannedModules,
      promotion_allowed: promotionAllowed,
      zci_warning: (context.zciWeakProjects ?? 0) > 5 ? 'attention' : 'ok',
      upgrade_pressure: context.garagePlanPressure === 'high' ? 'attention' : 'ok',
      communication_health: context.communicationFlow ?? 'unknown',
      coherence: context.coherenceCheck ?? 'unknown',
      adaptive_coherence: context.adaptiveCoherenceCheck ?? 'unknown',
      self_tuning: context.selfTuningCheck ?? 'unknown',
      experience_memory: context.experienceMemoryCheck ?? 'unknown',
      experience_intelligence: context.experienceIntelligenceCheck ?? 'unknown',
      fusion_council: context.fusionCouncilCheck ?? 'unknown',
      dsr: context.dsrCheck ?? 'unknown',
      formula_sync: context.formulaSyncCheck ?? 'unknown',
      traffic_intelligence: context.trafficIntelligenceCheck ?? 'unknown',
      fhmff_lite: context.fhmffCheck ?? 'unknown',
    },
    enforcement: {
      build_allowed: decision.action === 'ALLOW_PROGRESS',
      deploy_allowed: context.readinessPass >= context.readinessTotal && context.releaseGate === 'ready',
      diagnostics_required: decision.action === 'FORCE_DIAGNOSTICS' || context.disturbance === 'alert',
      module_promotion_allowed: promotionAllowed,
    },
    directives: [
      context.p1Open > 0 ? 'Resolve P1 tasks before new build actions.' : null,
      context.readinessPass < context.readinessTotal ? 'Pass all readiness gates before deployment.' : null,
      context.releaseGate !== 'ready'
        ? 'When readiness is full and P1 is clear: set data/z_release_control.json manual_release true (human approval) to set governance to ready; keep trust/freshness green for the full npm run release:gate pipeline.'
        : null,
      context.disturbance === 'alert' ? 'Run disturbance diagnostics and clear failed checks.' : null,
      !promotionAllowed ? 'Keep planned modules from promotion until they are explicitly marked ready.' : null,
    ].filter(Boolean),
  };
}

async function main() {
  const zuno = await readJsonSafe(path.join(REPORT_DIR, 'zuno_system_state_report.json'), {});
  const commHealth = await readJsonSafe(path.join(REPORT_DIR, 'z_communication_health.json'), null);
  const coherenceReport = await readJsonSafe(path.join(REPORT_DIR, 'z_system_coherence.json'), null);
  const adaptiveReport = await readJsonSafe(path.join(REPORT_DIR, 'z_adaptive_coherence.json'), null);
  const selfTuningReport = await readJsonSafe(path.join(REPORT_DIR, 'z_self_tuning.json'), null);
  const experienceMemoryReport = await readJsonSafe(path.join(REPORT_DIR, 'z_experience_memory.json'), null);
  const experienceIntelligenceReport = await readJsonSafe(path.join(REPORT_DIR, 'z_experience_intelligence.json'), null);
  const fusionCouncilReport = await readJsonSafe(path.join(REPORT_DIR, 'z_fusion_council.json'), null);
  const dsrReport = await readJsonSafe(path.join(REPORT_DIR, 'z_dsr_analysis.json'), null);
  const formulaSyncReport = await readJsonSafe(path.join(REPORT_DIR, 'z_formula_sync_check.json'), null);
  const zciIntel = await readJsonSafe(path.join(ROOT, 'data', 'reports', 'z_ci_intelligence.json'), null);
  const garagePlan = await readJsonSafe(path.join(ROOT, 'data', 'reports', 'z_garage_upgrade_plan.json'), null);
  const zciWeakProjects = Array.isArray(zciIntel?.projects)
    ? zciIntel.projects.filter((p) => Number(p?.score) < 60).length
    : 0;
  const garagePlanPressure = String(garagePlan?.pressure || 'low').toLowerCase();
  const aiStatus = await readJsonSafe(path.join(REPORT_DIR, 'z_ai_status.json'), {});
  const manifest = await readJsonSafe(path.join(ROOT, 'data', 'z_module_manifest.json'), {});
  const taskList = await readJsonSafe(path.join(ROOT, 'data', 'z_task_list.json'), []);
  const controlRaw = await readJsonSafe(path.join(ROOT, 'data', 'z_release_control.json'), {});

  const metrics = zuno?.current?.metrics || {};
  const disturbanceFromZuno = String(zuno?.executive_status?.disturbance_watch || '').toLowerCase();
  const disturbanceFromAi = String(aiStatus?.disturbance_watch?.status || '').toLowerCase();

  const p1Open = Math.max(num(metrics.task_p1_open, 0), countOpenP1FromTaskList(taskList));
  const readinessPass = num(metrics.readiness_gates_pass, 0);
  const readinessTotal = Math.max(num(metrics.readiness_gates_total, 4), 1);
  const control = normalizeReleaseControl(controlRaw);

  const governanceSnapshot = evaluateReleaseGovernance({
    p1Open,
    readinessPass,
    readinessTotal,
    control
  });

  let governanceHint = 'manual_release false';
  if (!control.manual_release) {
    governanceHint = 'manual_release false (edit data/z_release_control.json)';
  } else if (p1Open > 0) {
    governanceHint = 'P1 backlog not clear';
  } else if (readinessPass < readinessTotal) {
    governanceHint = `readiness ${readinessPass}/${readinessTotal}`;
  } else {
    governanceHint = 'ready';
  }

  const communicationFlow = (() => {
    if (!commHealth || typeof commHealth !== 'object') return 'unknown';
    const flow = String(commHealth.flow_status || '').toLowerCase();
    if (flow === 'healthy') return 'ok';
    if (flow === 'broken') return 'attention';
    if (flow === 'degraded') return 'watch';
    return 'unknown';
  })();

  const coherenceCheck = (() => {
    if (!coherenceReport || typeof coherenceReport.coherence_score !== 'number') return 'unknown';
    const s = coherenceReport.coherence_score;
    if (s < 50) return 'attention';
    if (s < 70) return 'watch';
    return 'ok';
  })();

  const adaptiveCoherenceCheck = (() => {
    if (!adaptiveReport?.prediction) return 'unknown';
    const r = String(adaptiveReport.prediction.risk_level || '').toLowerCase();
    if (r === 'high') return 'attention';
    if (r === 'medium') return 'watch';
    if (r === 'low') return 'ok';
    return 'unknown';
  })();

  const selfTuningCheck = (() => {
    if (!selfTuningReport || typeof selfTuningReport !== 'object') return 'unknown';
    if (String(selfTuningReport.system_learning_state || '') === 'mature') return 'mature';
    return 'learning';
  })();

  const experienceMemoryCheck = (() => {
    if (!experienceMemoryReport || typeof experienceMemoryReport !== 'object') return 'unknown';
    if (String(experienceMemoryReport.confidence || '') === 'high') return 'mature';
    return 'learning';
  })();

  const experienceIntelligenceCheck = (() => {
    if (!experienceIntelligenceReport || typeof experienceIntelligenceReport !== 'object') return 'unknown';
    const conf = String(
      experienceIntelligenceReport?.strategic_guidance?.confidence ??
      experienceIntelligenceReport?.data_volume?.confidence ??
      ''
    ).toLowerCase();
    if (conf === 'high') return 'mature';
    return 'learning';
  })();

  const fusionCouncilCheck = (() => {
    if (!fusionCouncilReport || typeof fusionCouncilReport !== 'object') return 'unknown';
    const conf = String(fusionCouncilReport.confidence || '').toLowerCase();
    if (conf === 'high') return 'mature';
    return 'learning';
  })();

  const dsrCheck = (() => {
    if (!dsrReport || typeof dsrReport !== 'object') return 'unknown';
    const conflicts = Number(dsrReport?.summary?.conflicts ?? 0);
    const similar = Number(dsrReport?.summary?.similar ?? 0);
    if (conflicts > 0) return 'attention';
    if (similar > 5) return 'watch';
    return 'ok';
  })();

  const formulaSyncCheck = (() => {
    if (!formulaSyncReport || typeof formulaSyncReport !== 'object') return 'unknown';
    const s = String(formulaSyncReport?.summary?.status || '').toLowerCase();
    if (s === 'attention') return 'attention';
    if (s === 'watch') return 'watch';
    if (s === 'ok') return 'ok';
    return 'unknown';
  })();

  const trafficIntelligenceReport = await readJsonSafe(
    path.join(REPORT_DIR, 'z_traffic_intelligence.json'),
    null
  );
  const trafficIntelligenceCheck = (() => {
    if (!trafficIntelligenceReport || typeof trafficIntelligenceReport !== 'object') return 'unknown';
    const lane = String(trafficIntelligenceReport.priority_lane || '').toLowerCase();
    if (lane === 'stabilize') return 'attention';
    if (lane === 'fix_flow' || lane === 'feed') return 'watch';
    if (lane === 'observe') return 'ok';
    return 'unknown';
  })();

  const fhmffReport = await readJsonSafe(
    path.join(REPORT_DIR, 'z_fhmff_lite.json'),
    null
  );
  const fhmffCheck = (() => {
    if (!fhmffReport || typeof fhmffReport !== 'object') return 'unknown';
    const s = String(fhmffReport.system_state || '').toLowerCase();
    if (s === 'deeply_frozen') return 'attention';
    if (s === 'partially_frozen' || s === 'stable') return 'watch';
    if (s === 'flowing') return 'ok';
    return 'unknown';
  })();

  const context = {
    p1Open,
    readinessPass,
    readinessTotal,
    releaseGate: governanceSnapshot.effective_release_gate,
    governanceSnapshot,
    governanceHint,
    disturbance: disturbanceFromZuno || disturbanceFromAi || 'unknown',
    plannedModules: countPlannedModules(manifest),
    zciWeakProjects,
    garagePlanPressure,
    communicationFlow,
    coherenceCheck,
    adaptiveCoherenceCheck,
    selfTuningCheck,
    experienceMemoryCheck,
    experienceIntelligenceCheck,
    fusionCouncilCheck,
    dsrCheck,
    formulaSyncCheck,
    trafficIntelligenceCheck,
    fhmffCheck,
  };

  const report = buildReport(context);
  await fs.mkdir(REPORT_DIR, { recursive: true });
  const govPath = path.join(REPORT_DIR, 'z_release_governance.json');
  await fs.writeFile(govPath, `${JSON.stringify(governanceSnapshot, null, 2)}\n`, 'utf8');
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  process.stdout.write(`Z Execution Enforcer report written: ${OUTPUT_PATH}\n`);
}

main().catch((error) => {
  process.stderr.write(`z_execution_enforcer failed: ${error?.message || String(error)}\n`);
  process.exitCode = 1;
});
