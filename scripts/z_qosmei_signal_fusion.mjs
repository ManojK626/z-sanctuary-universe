#!/usr/bin/env node
/**
 * Z-QOSMEI core signal fusion (Phase 1, advisory-only).
 * Builds one ranked signal payload for dashboard + AI tower + Zuno.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_qosmei_core_signal.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_qosmei_core_signal.md');

function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function clamp(num, min, max) {
  return Math.max(min, Math.min(max, num));
}

function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function confidenceBand(score) {
  if (score >= 80) return 'high';
  if (score >= 55) return 'medium';
  return 'low';
}

function statusBand(score) {
  if (score >= 75) return 'clear';
  if (score >= 50) return 'watch';
  return 'attention';
}

function lanePriority(score) {
  if (score >= 75) return 'optimize';
  if (score >= 50) return 'stabilize';
  return 'intervene';
}

function build() {
  const guardian = readJson(path.join(REPORTS_DIR, 'z_bot_guardian.json'), {});
  const alerts = readJson(path.join(REPORTS_DIR, 'z_bot_alerts.json'), {});
  const decisions = readJson(path.join(REPORTS_DIR, 'z_bot_decisions.json'), {});
  const patterns = readJson(path.join(REPORTS_DIR, 'z_bot_patterns.json'), {});
  const rootcause = readJson(path.join(REPORTS_DIR, 'z_bot_rootcause.json'), {});
  const predict = readJson(path.join(REPORTS_DIR, 'z_bot_predictions.json'), {});
  const adaptive = readJson(path.join(REPORTS_DIR, 'z_bot_adaptive.json'), {});
  const execution = readJson(path.join(REPORTS_DIR, 'z_bot_execution_result.json'), {});
  const spi = readJson(path.join(REPORTS_DIR, 'z_structural_patterns.json'), null);
  const al = readJson(path.join(REPORTS_DIR, 'z_adaptive_learning_state.json'), null);
  /** Previous cross-system run (one cycle after `cross:system` post-fusion). */
  const prevCross = readJson(path.join(REPORTS_DIR, 'z_cross_system_learning.json'), null);
  /** Phase 5 predictive (run after cross; same pass may use file from prior step in pipeline). */
  const p5 = readJson(path.join(REPORTS_DIR, 'z_predictive_intelligence.json'), null);
  const pval = readJson(path.join(REPORTS_DIR, 'z_prediction_validation.json'), null);

  const missingPaths = num(guardian?.summary?.missing, 0);
  const totalAlerts = typeof alerts?.total_alerts === 'number'
    ? num(alerts.total_alerts, 0)
    : Array.isArray(alerts?.alerts)
      ? alerts.alerts.length
      : 0;
  const pendingDecisions = Array.isArray(decisions?.decisions)
    ? decisions.decisions.filter((d) => String(d?.status || '').toLowerCase() === 'pending').length
    : 0;
  const highPatterns = Array.isArray(patterns?.patterns)
    ? patterns.patterns.filter((p) => String(p?.pattern_severity || '').toUpperCase() === 'HIGH').length
    : 0;
  const rootcauseHints = Array.isArray(rootcause?.results) ? rootcause.results.length : 0;
  const predictCount = Array.isArray(predict?.predictions) ? predict.predictions.length : 0;
  const adaptiveCount = Array.isArray(adaptive?.ranked) ? adaptive.ranked.length : 0;
  const executionOk = Boolean(execution?.last_run?.ok);

  const impactScore = clamp(
    100
      - missingPaths * 25
      - totalAlerts * 10
      - pendingDecisions * 8
      - highPatterns * 10
      - (executionOk ? 0 : 10),
    0,
    100
  );
  const urgencyScore = clamp(
    missingPaths * 30 + totalAlerts * 12 + pendingDecisions * 10 + highPatterns * 12,
    0,
    100
  );
  let confidenceScore = clamp(
    40
      + (rootcauseHints > 0 ? 15 : 0)
      + (predictCount > 0 ? 15 : 0)
      + (adaptiveCount > 0 ? 15 : 0)
      + (executionOk ? 15 : 0),
    0,
    100
  );
  let riskScore = clamp(
    missingPaths * 25 + totalAlerts * 15 + pendingDecisions * 8 + highPatterns * 15 + (executionOk ? 0 : 10),
    0,
    100
  );

  const ps = spi?.predictive_signals || {};
  const wAl = { rename_instability: 1, silent_drift: 1, stability_convergence: 1, ...(al?.weights || {}) };
  if (spi?.schema_version) {
    if (ps.silent_drift_detected) riskScore = clamp(riskScore + 10, 0, 100);
    if (ps.rename_instability_detected) confidenceScore = clamp(confidenceScore - 5, 0, 100);
    if (ps.stability_convergence_detected) confidenceScore = clamp(confidenceScore + 5, 0, 100);
  }
  if (spi?.schema_version && al?.schema_version) {
    const ws = num(wAl.silent_drift, 1) - 1;
    const wr = num(wAl.rename_instability, 1) - 1;
    const wc = num(wAl.stability_convergence, 1) - 1;
    if (ps.silent_drift_detected) riskScore = clamp(riskScore + 10 * ws, 0, 100);
    if (ps.rename_instability_detected) confidenceScore = clamp(confidenceScore - 5 * wr, 0, 100);
    if (ps.stability_convergence_detected) confidenceScore = clamp(confidenceScore + 4 * wc, 0, 100);
  }

  let composite = clamp(
    Math.round((impactScore * 0.35 + (100 - riskScore) * 0.25 + confidenceScore * 0.25 + (100 - urgencyScore) * 0.15) * 10) / 10,
    0,
    100
  );

  const structural_patterns_score = num(spi?.structural_patterns_score, NaN);
  const spiPhase = String(spi?.system_phase || '').toLowerCase();
  const spiEvolution = String(spi?.evolution_phase || '').toLowerCase();
  if (Number.isFinite(structural_patterns_score)) {
    if (structural_patterns_score < 58 || spiPhase === 'unstable' || spiPhase === 'learning') {
      confidenceScore = clamp(confidenceScore - 8, 0, 100);
      riskScore = clamp(riskScore + 10, 0, 100);
    } else if (structural_patterns_score >= 88 && spiPhase === 'optimized') {
      confidenceScore = clamp(confidenceScore + 4, 0, 100);
      riskScore = clamp(riskScore - 4, 0, 100);
    } else if (structural_patterns_score >= 75) {
      confidenceScore = clamp(confidenceScore + 2, 0, 100);
      riskScore = clamp(riskScore - 2, 0, 100);
    }
    composite = clamp(
      Math.round((impactScore * 0.35 + (100 - riskScore) * 0.25 + confidenceScore * 0.25 + (100 - urgencyScore) * 0.15) * 10) / 10,
      0,
      100
    );
  }

  const crs = String(prevCross?.alignment?.status || '').toLowerCase();
  if (prevCross?.schema_version && crs === 'aligned') {
    confidenceScore = clamp(confidenceScore + 2, 0, 100);
  } else if (crs === 'conflict') {
    riskScore = clamp(riskScore + 5, 0, 100);
  }
  composite = clamp(
    Math.round((impactScore * 0.35 + (100 - riskScore) * 0.25 + confidenceScore * 0.25 + (100 - urgencyScore) * 0.15) * 10) / 10,
    0,
    100
  );

  if (p5?.schema_version && p5.fusion_hint) {
    const cd = num(p5.fusion_hint.confidence_delta, 0);
    const rd = num(p5.fusion_hint.risk_delta, 0);
    confidenceScore = clamp(confidenceScore + cd, 0, 100);
    riskScore = clamp(riskScore + rd, 0, 100);
  }
  const pvalN = num(pval?.validation_summary?.validated, 0);
  const pvalAcc = num(pval?.validation_summary?.accuracy, NaN);
  if (pval?.schema_version && pvalN >= 3 && Number.isFinite(pvalAcc)) {
    if (pvalAcc < 0.6) confidenceScore = clamp(confidenceScore - 5, 0, 100);
    else if (pvalAcc > 0.75) confidenceScore = clamp(confidenceScore + 3, 0, 100);
  }
  composite = clamp(
    Math.round((impactScore * 0.35 + (100 - riskScore) * 0.25 + confidenceScore * 0.25 + (100 - urgencyScore) * 0.15) * 10) / 10,
    0,
    100
  );

  const payload = {
    generated_at: new Date().toISOString(),
    advisory_only: true,
    phase: 'qosmei-fusion-v1',
    posture: statusBand(composite),
    lane_priority: lanePriority(composite),
    confidence_band: confidenceBand(confidenceScore),
    score: {
      composite,
      impact: impactScore,
      urgency: urgencyScore,
      confidence: confidenceScore,
      risk: riskScore,
      structural_patterns_score: Number.isFinite(structural_patterns_score) ? Math.round(structural_patterns_score) : null,
      evolution_phase: Number.isFinite(structural_patterns_score) ? spiEvolution || null : null,
    },
    structural_patterns_phase: Number.isFinite(structural_patterns_score) ? spiPhase || null : null,
    signals: {
      guardian_missing_paths: missingPaths,
      rollup_alerts: totalAlerts,
      pending_decisions: pendingDecisions,
      high_patterns: highPatterns,
      rootcause_hints: rootcauseHints,
      predictions: predictCount,
      adaptive_ranked_actions: adaptiveCount,
      execution_ok: executionOk,
      structural_patterns_score: Number.isFinite(structural_patterns_score) ? Math.round(structural_patterns_score) : null,
      structural_patterns_phase: Number.isFinite(structural_patterns_score) ? spiPhase || null : null,
      spi_predictive_silent_drift: Boolean(ps.silent_drift_detected),
      spi_predictive_rename_instability: Boolean(ps.rename_instability_detected),
      spi_predictive_stability_convergence: Boolean(ps.stability_convergence_detected),
      adaptive_learning_cycles: num(al?.learning_cycles, 0),
      adaptive_weights_effective: Boolean(al?.schema_version),
      cross_system_status: crs || null,
      cross_system_confidence: num(prevCross?.alignment?.confidence, NaN),
      phase5_cap: p5?.confidence_cap_applied ?? null,
      phase5_predictions_n: num(p5?.summary?.predictions_n, 0),
      phase5_dominant: p5?.summary?.dominant_signal || null,
      phase55_validation_accuracy: pvalN >= 3 && Number.isFinite(pvalAcc) ? pvalAcc : null,
      phase55_validated_n: pvalN >= 3 ? pvalN : 0,
    },
    recommendation:
      composite >= 75
        ? 'QOSMEI clear: keep optimize lane and continue observer cadence.'
        : composite >= 50
          ? 'QOSMEI watch: stabilize top-risk lanes before scaling.'
          : 'QOSMEI attention: route to intervention lane and human review.',
    sources: [
      'data/reports/z_bot_guardian.json',
      'data/reports/z_bot_alerts.json',
      'data/reports/z_bot_decisions.json',
      'data/reports/z_bot_patterns.json',
      'data/reports/z_bot_rootcause.json',
      'data/reports/z_bot_predictions.json',
      'data/reports/z_bot_adaptive.json',
      'data/reports/z_bot_execution_result.json',
      'data/reports/z_structural_patterns.json',
      'data/reports/z_adaptive_learning_state.json',
      'data/reports/z_cross_system_learning.json',
      'data/reports/z_predictive_intelligence.json',
      'data/reports/z_prediction_validation.json',
    ],
  };

  return payload;
}

function write(payload) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  const md = [
    '# Z-QOSMEI Core Signal (Phase 1)',
    '',
    `Generated: ${payload.generated_at}`,
    `Posture: **${String(payload.posture).toUpperCase()}**`,
    `Composite score: **${payload.score.composite}**`,
    '',
    '## Score Vector',
    `- Impact: ${payload.score.impact}`,
    `- Urgency: ${payload.score.urgency}`,
    `- Confidence: ${payload.score.confidence} (${payload.confidence_band})`,
    `- Risk: ${payload.score.risk}`,
    `- SPI score: ${payload.score.structural_patterns_score ?? 'n/a'} (phase: ${payload.structural_patterns_phase ?? 'n/a'} · evolution: ${payload.score.evolution_phase ?? 'n/a'})`,
    `- SPI predictive flags: silent_drift=${payload.signals.spi_predictive_silent_drift} rename_instability=${payload.signals.spi_predictive_rename_instability} stability=${payload.signals.spi_predictive_stability_convergence}`,
    `- Phase 3 adaptive: cycles **${payload.signals.adaptive_learning_cycles}** · weights active: **${payload.signals.adaptive_weights_effective ? 'yes' : 'no'}**`,
    `- Phase 4 cross-system (prior run): **${payload.signals.cross_system_status ?? 'n/a'}** · confidence **${payload.signals.cross_system_confidence ?? 'n/a'}**`,
    '',
    '## Signal Inputs',
    `- Guardian missing paths: ${payload.signals.guardian_missing_paths}`,
    `- Rollup alerts: ${payload.signals.rollup_alerts}`,
    `- Pending decisions: ${payload.signals.pending_decisions}`,
    `- High patterns: ${payload.signals.high_patterns}`,
    `- Rootcause hints: ${payload.signals.rootcause_hints}`,
    `- Predictions: ${payload.signals.predictions}`,
    `- Adaptive ranked actions: ${payload.signals.adaptive_ranked_actions}`,
    `- Execution ok: ${payload.signals.execution_ok}`,
    `- SPI score: ${payload.signals.structural_patterns_score ?? 'n/a'} · phase: ${payload.signals.structural_patterns_phase ?? 'n/a'} · predictive: drift=${payload.signals.spi_predictive_silent_drift} rename=${payload.signals.spi_predictive_rename_instability} stable=${payload.signals.spi_predictive_stability_convergence}`,
    '',
    `Recommendation: ${payload.recommendation}`,
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');
}

const payload = build();
write(payload);
console.log(`Z-QOSMEI core signal written: ${OUT_JSON} posture=${payload.posture} score=${payload.score.composite}`);
