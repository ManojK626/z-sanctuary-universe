#!/usr/bin/env node
/**
 * Z-Predictive intelligence (Phase 5, advisory-only).
 * Experience-weighted heuristics from SPI, learning, cross-system, patterns, decisions, QOSMEI.
 * No auto-execution, no registry/disk writes, no Guardian override.
 * Emits data/reports/z_predictive_intelligence.{json,md}
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const LOGS = path.join(ROOT, 'data', 'logs');
const REPORTS = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS, 'z_predictive_intelligence.json');
const OUT_MD = path.join(REPORTS, 'z_predictive_intelligence.md');
const LEARNING_LOG = path.join(LOGS, 'z_learning_history.jsonl');
const PREDICTION_VAL_REP = path.join(REPORTS, 'z_prediction_validation.json');

function readJson(p, fb = null) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fb;
  }
}

function readJsonl(p) {
  if (!fs.existsSync(p)) return [];
  const raw = fs.readFileSync(p, 'utf8').trim();
  if (!raw) return [];
  const o = [];
  for (const line of raw.split('\n')) {
    if (!line.trim()) continue;
    try {
      o.push(JSON.parse(line));
    } catch {
      /* skip */
    }
  }
  return o;
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function num(v, f = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : f;
}

function confidenceCapFromCycles(cycles) {
  if (cycles < 5) return 0.55;
  if (cycles < 10) return 0.7;
  if (cycles < 20) return 0.85;
  return 0.95;
}

function main() {
  const spi = readJson(path.join(REPORTS, 'z_structural_patterns.json'), null);
  const al = readJson(path.join(REPORTS, 'z_adaptive_learning_state.json'), null);
  const cross = readJson(path.join(REPORTS, 'z_cross_system_learning.json'), null);
  const patterns = readJson(path.join(REPORTS, 'z_bot_patterns.json'), {});
  const decisions = readJson(path.join(REPORTS, 'z_bot_decisions.json'), {});
  const qos = readJson(path.join(REPORTS, 'z_qosmei_core_signal.json'), null);

  const learningLines = readJsonl(LEARNING_LOG);
  const learningCycles = num(al?.learning_cycles, 0);
  const cap = confidenceCapFromCycles(learningCycles);
  const lineN = learningLines.length;

  const learning_density = clamp((lineN / 50) * 0.5 + (Math.min(learningCycles, 20) / 20) * 0.5, 0, 1);
  const plist = Array.isArray(patterns?.patterns) ? patterns.patterns : [];
  const reopenMax = plist.reduce((m, p) => Math.max(m, num(p.reopen_count, 0)), 0);
  const highPat = plist.filter((p) => String(p?.pattern_severity).toUpperCase() === 'HIGH').length;
  const pattern_repeat_rate = clamp(0.5 * (reopenMax / 4) + 0.5 * (highPat > 0 ? 0.4 : 0), 0, 1);

  const crossC = num(cross?.alignment?.confidence, 0.5);
  const crossS = String(cross?.alignment?.status || '').toLowerCase();
  const crossAlign = crossS === 'aligned' ? crossC : crossS === 'conflict' ? 1 - crossC : 0.55;

  const wv = al?.weights && typeof al.weights === 'object' ? al.weights : {};
  const wvals = Object.values(wv)
    .map((x) => num(x, 1))
    .filter((x) => x > 0);
  const meanW = wvals.length ? wvals.reduce((a, b) => a + b, 0) / wvals.length : 1;
  const adaptive_weight_strength = clamp(1 - Math.abs(meanW - 1) * 1.2, 0, 1);

  const model_confidence = clamp(
    learning_density * 0.4 + pattern_repeat_rate * 0.2 + crossAlign * 0.2 + adaptive_weight_strength * 0.2,
    0,
    1
  );
  const raw_conf = Math.min(model_confidence, cap);

  const ps = spi?.predictive_signals || {};
  const pendingN = Array.isArray(decisions?.decisions)
    ? decisions.decisions.filter((d) => String(d?.status || '').toLowerCase() === 'pending').length
    : 0;
  const phase = String(spi?.system_phase || '').toLowerCase();

  let failRate = 0;
  let nOut = 0;
  for (const row of learningLines) {
    if (row.outcome === 'failure' || row.outcome === 'success' || row.outcome === 'partial') {
      nOut += 1;
      if (row.outcome === 'failure') failRate += 1;
    }
  }
  if (nOut) failRate /= nOut;

  const predictions = [];
  if (reopenMax >= 1 || failRate > 0.4) {
    const c = clamp(0.35 + reopenMax * 0.1 + failRate * 0.2, 0, cap);
    predictions.push({
      id: 'decision_lifecycle',
      type: 'likely_reopen',
      confidence: c,
      risk_level: 'medium',
      based_on: [`pattern.reopen_max=${reopenMax}`, `learning.fail_rate~=${failRate.toFixed(2)}`],
      suggested_action: 'Monitor governance queue; avoid closing related items until structure is stable (advisory).',
    });
  }
  if (ps.stability_convergence_detected && failRate < 0.2) {
    const c = clamp(0.4 + raw_conf * 0.25, 0, cap);
    predictions.push({
      id: 'stability',
      type: 'stability_hold',
      confidence: c,
      risk_level: 'low',
      based_on: ['spi.stability_convergence', 'learning not dominated by failure'],
      suggested_action: 'Short-term: safe to keep current resolve posture; still log structural changes (advisory).',
    });
  }
  if (ps.silent_drift_detected) {
    predictions.push({
      id: 'drift',
      type: 'drift_incoming',
      confidence: clamp(0.55 + 0.1 * (1 - learning_density), 0, cap),
      risk_level: 'high',
      based_on: ['spi.silent_drift', 'no decision after catalog diff window'],
      suggested_action: 'Ack or log a decision line after catalog diffs to avoid blind drift (advisory).',
    });
  }
  if (phase === 'optimized' && crossS === 'aligned' && highPat === 0) {
    predictions.push({
      id: 'convergence',
      type: 'convergence',
      confidence: clamp(0.45 + raw_conf * 0.2, 0, cap),
      risk_level: 'low',
      based_on: ['spi.phase=optimized', 'cross_system=aligned', 'no HIGH pattern rows'],
      suggested_action: 'Favor small friction tests so learning density stays honest (advisory).',
    });
  }
  if (pendingN > 0 && ps.silent_drift_detected === false && num(qos?.score?.composite, 0) > 80) {
    predictions.push({
      id: 'governance',
      type: 'over_control_risk',
      confidence: clamp(0.4 + 0.05 * pendingN, 0, cap),
      risk_level: 'medium',
      based_on: ['pending_decisions>0', 'strong qosmei composite (possible governance lag)'],
      suggested_action: 'Triage pending decisions; clear or dismiss with notes (advisory).',
    });
  }
  if (Array.isArray(spi?.structural_patterns) && spi.structural_patterns.some((p) => p.type === 'phantom_project')) {
    predictions.push({
      id: 'phantom',
      type: 'phantom_risk',
      confidence: clamp(0.55, 0, cap),
      risk_level: 'high',
      based_on: ['spi.phantom_project'],
      suggested_action: 'Verify registry vs disk before re-resolve (advisory).',
    });
  }

  /** Phase 5.5: nudge from prior validation run (earned, not assumed). */
  const vrep = readJson(PREDICTION_VAL_REP, null);
  const valN = num(vrep?.validation_summary?.validated, 0);
  const vacc = num(vrep?.validation_summary?.accuracy, NaN);
  let validation_adjustment = { applied: false, note: 'insufficient or missing z_prediction_validation.json' };
  if (vrep?.schema_version && valN >= 3 && Number.isFinite(vacc)) {
    for (const p of predictions) {
      let c = num(p.confidence, 0);
      if (vacc < 0.6) c *= 0.85;
      if (vacc > 0.75) c *= 1.05;
      p.confidence = Math.min(c, cap);
    }
    validation_adjustment = {
      applied: true,
      prior_accuracy: vacc,
      validated_n: valN,
    };
  }

  let highRiskN = 0;
  for (const p of predictions) {
    if (String(p.risk_level).toLowerCase() === 'high') highRiskN += 1;
  }
  const topPred = predictions.length ? predictions.slice().sort((a, b) => b.confidence - a.confidence)[0] : null;
  const dominant = topPred ? topPred.type : null;

  /** Small deltas for QOSMEI (bounded, advisory). */
  let risk_delta = 0;
  let conf_delta = 0;
  if (highRiskN > 0) risk_delta = clamp(2 + highRiskN, 0, 6);
  if (dominant === 'stability_hold' || dominant === 'convergence') conf_delta = 2;
  if (dominant === 'over_control_risk' || dominant === 'likely_reopen') conf_delta = -1.5;
  if (dominant === 'drift_incoming' || dominant === 'phantom_risk') {
    risk_delta = clamp(risk_delta + 2, 0, 8);
  }
  if (failRate > 0.5) {
    conf_delta -= 1;
    risk_delta += 1.5;
  }
  if (String(cross?.alignment?.status).toLowerCase() === 'conflict') {
    risk_delta = clamp(risk_delta + 1, 0, 8);
  }
  if (String(cross?.alignment?.status).toLowerCase() === 'aligned' && highRiskN === 0) {
    conf_delta = clamp(conf_delta + 0.5, -4, 3);
  }

  const generated_at = new Date().toISOString();
  const payload = {
    schema_version: 1,
    generated_at,
    advisory_only: true,
    drp_note:
      'Phase 5: heuristic predictions from merged signals. Does not run fixes, change registry, or auto-resolve decisions. Confidence is capped from learning cycle count. Phase 5.5 validation file may pre-scale per-prediction confidence. QOSMEI may apply small risk/confidence nudges from fusion_hint (bounded).',
    learning_cycles: learningCycles,
    validation_adjustment,
    confidence_cap_applied: cap,
    learning_history_lines: lineN,
    confidence_model: {
      learning_density: Number(learning_density.toFixed(3)),
      pattern_repeat_rate: Number(pattern_repeat_rate.toFixed(3)),
      cross_system_alignment: Number(crossAlign.toFixed(3)),
      adaptive_weight_strength: Number(adaptive_weight_strength.toFixed(3)),
      model_confidence: Number(model_confidence.toFixed(3)),
    },
    predictions,
    summary: {
      predictions_n: predictions.length,
      highest_confidence: topPred ? Number(topPred.confidence.toFixed(3)) : 0,
      dominant_signal: dominant,
      high_risk_predictions: highRiskN,
    },
    fusion_hint: {
      risk_delta: Number(risk_delta.toFixed(2)),
      confidence_delta: Number(conf_delta.toFixed(2)),
    },
  };

  fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  const md = [
    '# Z-Predictive intelligence (Phase 5)',
    '',
    `Generated: ${generated_at}`,
    `Cap (from learning cycles): **${cap}** · predictions: **${predictions.length}**`,
    '',
    '## Dominant',
    dominant ? `**${dominant}** · conf top ~ ${payload.summary.highest_confidence}` : '(none)',
    '',
    '## Predictions',
    ...predictions.map(
      (p) =>
        `- **${p.type}** id=${p.id} conf=${p.confidence} risk=${p.risk_level} — ${(p.based_on || []).join(', ')}`
    ),
    '',
    '## QOSMEI nudge (advisory, bounded)',
    `risk_delta=${payload.fusion_hint.risk_delta} · confidence_delta=${payload.fusion_hint.confidence_delta}`,
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');
  console.log(`Z-Predictive: ${OUT_JSON} predictions=${predictions.length} dominant=${dominant || 'n/a'}`);
}

main();
