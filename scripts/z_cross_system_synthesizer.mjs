#!/usr/bin/env node
/**
 * Z-Cross-system intelligence (Phase 4, read-only advisory).
 * Compares SPI + adaptive learning state + QOSMEI outputs. No execution, no overrides, no weight tuning.
 * Emits data/reports/z_cross_system_learning.{json,md}
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS, 'z_cross_system_learning.json');
const OUT_MD = path.join(REPORTS, 'z_cross_system_learning.md');

function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function num(v, fb = NaN) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fb;
}

function main() {
  const spi = readJson(path.join(REPORTS, 'z_structural_patterns.json'), null);
  const learning = readJson(path.join(REPORTS, 'z_adaptive_learning_state.json'), null);
  const qosmei = readJson(path.join(REPORTS, 'z_qosmei_core_signal.json'), null);

  const spiScore = num(spi?.structural_patterns_score, NaN);
  const qosComposite = num(qosmei?.score?.composite, NaN);
  const qosConfidence = num(qosmei?.score?.confidence, NaN);
  const spiPhase = String(spi?.system_phase || '').toLowerCase();
  const qosPosture = String(qosmei?.posture || '').toLowerCase();
  const evolution = String(spi?.evolution_phase || '').toLowerCase();

  const weights = learning?.weights && typeof learning.weights === 'object' ? learning.weights : {};
  const wVals = Object.values(weights)
    .map((x) => Number(x))
    .filter((x) => Number.isFinite(x));
  const meanWeight = wVals.length ? wVals.reduce((a, b) => a + b, 0) / wVals.length : NaN;

  const conflicts = [];
  const consensus_signals = [];

  let scoreGap = NaN;
  if (Number.isFinite(spiScore) && Number.isFinite(qosComposite)) {
    scoreGap = Math.abs(spiScore - qosComposite);
    if (scoreGap <= 18) consensus_signals.push('spi_qosmei_composite_close');
    if (scoreGap > 32) {
      conflicts.push({
        type: 'spi_vs_qosmei_composite',
        detail: 'Large gap between SPI structural score and QOSMEI composite',
        spi_score: spiScore,
        qosmei_composite: qosComposite,
      });
    }
  }

  const tension =
    (spiPhase === 'unstable' || spiPhase === 'learning') && qosPosture === 'clear' && Number.isFinite(qosComposite) && qosComposite >= 70;
  if (tension) {
    conflicts.push({
      type: 'phase_posture_tension',
      detail: 'SPI shows structural stress while QOSMEI posture is clear',
      spi_phase: spiPhase,
      qosmei_posture: qosPosture,
    });
  }

  if (Number.isFinite(meanWeight) && Math.abs(meanWeight - 1) > 0.12) {
    consensus_signals.push('adaptive_weights_drift_observed');
  }

  let checks = 0;
  let passed = 0;
  if (Number.isFinite(spiScore) && Number.isFinite(qosComposite)) {
    checks += 1;
    if (scoreGap <= 22) passed += 1;
  }
  if (spiPhase && qosPosture) {
    checks += 1;
    if (!tension) passed += 1;
  }
  if (Number.isFinite(qosConfidence) && Number.isFinite(spiScore)) {
    checks += 1;
    const n1 = spiScore / 100;
    const n2 = qosConfidence / 100;
    if (Math.abs(n1 - n2) <= 0.2) {
      passed += 1;
      consensus_signals.push('spi_vs_qosmei_confidence_band_ok');
    }
  }

  const hardConflict = tension || (Number.isFinite(scoreGap) && scoreGap > 32);
  let status = 'unknown';
  let confidence = 0;
  if (hardConflict) {
    status = 'conflict';
    confidence = checks ? Math.max(0.1, passed / checks - 0.25) : 0.2;
  } else if (checks > 0) {
    confidence = passed / checks;
    if (confidence > 0.8) status = 'aligned';
    else if (confidence > 0.45) status = 'partial';
    else status = 'partial';
  } else {
    status = 'partial';
    confidence = 0.5;
    consensus_signals.push('insufficient_cross_inputs');
  }

  const payload = {
    schema_version: 1,
    generated_at: new Date().toISOString(),
    advisory_only: true,
    drp_note:
      'Read-only alignment across SPI, adaptive learning state, and QOSMEI. Not fed into learning tuner or decision execution. QOSMEI may read this file on the next fusion run (one-cycle lag after qosmei:signal).',
    alignment: {
      status,
      confidence: Number(confidence.toFixed(3)),
      checks,
      checks_passed: passed,
    },
    conflicts,
    consensus_signals,
    summary: {
      spi_score: Number.isFinite(spiScore) ? spiScore : null,
      spi_phase: spiPhase || null,
      spi_evolution_phase: evolution || null,
      qosmei_composite: Number.isFinite(qosComposite) ? qosComposite : null,
      qosmei_posture: qosPosture || null,
      qosmei_confidence: Number.isFinite(qosConfidence) ? qosConfidence : null,
      learning_cycles: num(learning?.learning_cycles, 0),
      learning_mean_weight: Number.isFinite(meanWeight) ? Number(meanWeight.toFixed(4)) : null,
      spi_weight_blend: num(spi?.adaptive_learning?.weight_blend, NaN),
    },
    sources: [
      'data/reports/z_structural_patterns.json',
      'data/reports/z_adaptive_learning_state.json',
      'data/reports/z_qosmei_core_signal.json',
    ],
  };

  fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  const md = [
    '# Z-Cross-system learning (Phase 4)',
    '',
    `Generated: ${payload.generated_at}`,
    `Status: **${status}** · confidence: **${payload.alignment.confidence}**`,
    '',
    '## Conflicts',
    ...(payload.conflicts.length ? payload.conflicts.map((c) => `- **${c.type}**: ${c.detail}`) : ['- (none)']),
    '',
    '## Consensus',
    ...(payload.consensus_signals.length ? payload.consensus_signals.map((s) => `- ${s}`) : ['- (none)']),
    '',
    '## Refresh',
    '`npm run cross:system` after `npm run qosmei:signal` (Whale Bus `surface_reinforce` runs it last in the intelligence chain).',
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');
  console.log(`Z-Cross-system: ${OUT_JSON} status=${status} confidence=${payload.alignment.confidence}`);
}

main();
