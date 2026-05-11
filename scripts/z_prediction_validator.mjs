#!/usr/bin/env node
/**
 * Z-Prediction validation (Phase 5.5, advisory).
 * Heuristicly scores current predictive output vs decision/learning/pattern logs.
 * Append-only history; no mutation of other evidence.
 * Emits data/reports/z_prediction_validation.{json,md}
 * Appends data/logs/z_prediction_validation_history.jsonl
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const LOGS = path.join(ROOT, 'data', 'logs');
const REPORTS = path.join(ROOT, 'data', 'reports');
const PRED = path.join(REPORTS, 'z_predictive_intelligence.json');
const OUT_JSON = path.join(REPORTS, 'z_prediction_validation.json');
const OUT_MD = path.join(REPORTS, 'z_prediction_validation.md');
const HIST = path.join(LOGS, 'z_prediction_validation_history.jsonl');
const DEC = path.join(LOGS, 'z_decision_history.jsonl');
const LEARN = path.join(LOGS, 'z_learning_history.jsonl');

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

function appendJsonl(p, lineObj) {
  const line = `${JSON.stringify(lineObj)}\n`;
  if (!fs.existsSync(LOGS)) fs.mkdirSync(LOGS, { recursive: true });
  fs.appendFileSync(p, line, 'utf8');
}

function num(v, f = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : f;
}

function runOne(pred, ctx) {
  const {
    reopenMax,
    failRate,
    ps,
    phase,
    highPat,
    crossS,
    pendingN,
    qosComp,
    hasPhantom,
  } = ctx;

  const t = String(pred.type || '');

  /** @type {{ actual_outcome: string, conclusive: boolean, was_correct: boolean | null }} */
  let r = { actual_outcome: 'unknown', conclusive: false, was_correct: null };

  if (t === 'likely_reopen') {
    const reopened = reopenMax >= 1 || failRate > 0.35;
    r.actual_outcome = reopened ? 'reopened' : 'held';
    r.conclusive = true;
    r.was_correct = reopened;
  } else if (t === 'stability_hold') {
    const stable = failRate < 0.2 && reopenMax === 0 && !ps.silent_drift_detected;
    r.actual_outcome = stable ? 'held' : 'unstable';
    r.conclusive = true;
    r.was_correct = stable;
  } else if (t === 'drift_incoming') {
    const driftEvid = Boolean(ps.silent_drift_detected) || failRate > 0.15;
    r.actual_outcome = driftEvid ? 'drift_signal' : 'no_drift';
    r.conclusive = true;
    r.was_correct = driftEvid;
  } else if (t === 'convergence') {
    const ok =
      String(phase).toLowerCase() === 'optimized' &&
      String(crossS).toLowerCase() === 'aligned' &&
      highPat === 0;
    r.actual_outcome = ok ? 'converging' : 'not_converging';
    r.conclusive = true;
    r.was_correct = ok;
  } else if (t === 'over_control_risk') {
    const lag = pendingN > 0 && num(qosComp, 0) > 80;
    r.actual_outcome = lag ? 'governance_lag' : 'clear_governance';
    r.conclusive = true;
    r.was_correct = lag;
  } else if (t === 'phantom_risk') {
    r.actual_outcome = hasPhantom ? 'phantom_signal' : 'no_phantom';
    r.conclusive = true;
    r.was_correct = hasPhantom;
  }

  if (!r.conclusive) return { ...r, inconclusive: true };

  return {
    ...r,
    inconclusive: false,
  };
}

function buildHistoryStats(lines) {
  const scored = lines.filter(
    (l) => l && l.inconclusive !== true && typeof l.was_correct === 'boolean'
  );
  const byType = {};
  for (const l of scored) {
    const ty = l.prediction || l.prediction_type || 'unknown';
    if (!byType[ty]) {
      byType[ty] = { correct: 0, n: 0, accuracy: 0, samples: 0 };
    }
    byType[ty].n += 1;
    if (l.was_correct) byType[ty].correct += 1;
  }
  for (const k of Object.keys(byType)) {
    byType[k].samples = byType[k].n;
    byType[k].accuracy = byType[k].n > 0 ? byType[k].correct / byType[k].n : 0;
  }
  return { scored, byType };
}

function highLowCalibration(scored) {
  const withConf = scored.filter((l) => num(l.confidence) > 0);
  const high = withConf.filter((l) => num(l.confidence) >= 0.55);
  const low = withConf.filter((l) => num(l.confidence) < 0.55);
  const hAcc = high.length ? high.filter((l) => l.was_correct).length / high.length : 0;
  const lAcc = low.length ? low.filter((l) => l.was_correct).length / low.length : 0;
  return {
    high_confidence_accuracy: Number(hAcc.toFixed(3)),
    low_confidence_accuracy: Number(lAcc.toFixed(3)),
    samples_high: high.length,
    samples_low: low.length,
  };
}

function trendFromLines(scored) {
  if (scored.length < 8) return 'insufficient';
  const mid = Math.floor(scored.length / 2);
  const a = scored.slice(0, mid);
  const b = scored.slice(mid);
  const accA = a.filter((x) => x.was_correct).length / a.length;
  const accB = b.filter((x) => x.was_correct).length / b.length;
  if (accB - accA > 0.08) return 'improving';
  if (accA - accB > 0.08) return 'degrading';
  return 'flat';
}

function main() {
  const pred = readJson(PRED, null);
  if (!pred?.schema_version) {
    const out = {
      schema_version: 1,
      generated_at: new Date().toISOString(),
      advisory_only: true,
      drp_note: 'Run npm run predictive:intel first; validator scores its predictions against current logs.',
      this_run: [],
      validation_summary: {
        total_predictions: 0,
        validated: 0,
        correct: 0,
        incorrect: 0,
        accuracy: 0,
      },
      by_type: {},
      confidence_calibration: {
        high_confidence_accuracy: 0,
        low_confidence_accuracy: 0,
        samples_high: 0,
        samples_low: 0,
      },
      trend: 'insufficient',
      confidence_alignment: 'insufficient',
    };
    fs.mkdirSync(REPORTS, { recursive: true });
    fs.writeFileSync(OUT_JSON, `${JSON.stringify(out, null, 2)}\n`, 'utf8');
    console.log('Z-Prediction validation: missing z_predictive_intelligence.json — wrote stub report');
    return;
  }

  const patterns = readJson(path.join(REPORTS, 'z_bot_patterns.json'), {}) || {};
  const decisions = readJson(path.join(REPORTS, 'z_bot_decisions.json'), {}) || {};
  const spi = readJson(path.join(REPORTS, 'z_structural_patterns.json'), null) || {};
  const qos = readJson(path.join(REPORTS, 'z_qosmei_core_signal.json'), null);
  const learningLines = readJsonl(LEARN);
  const decisionLines = readJsonl(DEC);

  const plist = Array.isArray(patterns.patterns) ? patterns.patterns : [];
  const reopenMax = plist.reduce((m, p) => Math.max(m, num(p.reopen_count, 0)), 0);
  const highPat = plist.filter((p) => String(p?.pattern_severity).toUpperCase() === 'HIGH').length;

  const ps = spi?.predictive_signals || {};
  const phase = String(spi?.system_phase || '');
  const crossS = readJson(path.join(REPORTS, 'z_cross_system_learning.json'), null)?.alignment?.status || '';
  const hasPhantom = Array.isArray(spi?.structural_patterns) && spi.structural_patterns.some((p) => p.type === 'phantom_project');
  const pendingN = Array.isArray(decisions?.decisions)
    ? decisions.decisions.filter((d) => String(d?.status || '').toLowerCase() === 'pending').length
    : 0;

  let nOut = 0;
  let failN = 0;
  for (const row of learningLines) {
    if (row.outcome === 'failure' || row.outcome === 'success' || row.outcome === 'partial') {
      nOut += 1;
      if (row.outcome === 'failure') failN += 1;
    }
  }
  const failRate = nOut ? failN / nOut : 0;

  const hasReopen = decisionLines.some(
    (d) => String(d.action || d.event || '').toLowerCase() === 'reopen'
  );

  const predList = Array.isArray(pred?.predictions) ? pred.predictions : [];
  const prAt = pred?.generated_at || new Date().toISOString();
  const reopenEff = hasReopen ? Math.max(reopenMax, 1) : reopenMax;

  const ctx = {
    reopenMax: reopenEff,
    failRate,
    learningLines,
    ps,
    phase,
    highPat,
    crossS: String(crossS).toLowerCase(),
    pendingN,
    qosComp: qos?.score?.composite,
    hasPhantom,
  };

  const histLines = readJsonl(HIST);
  const known = new Set(
    histLines
      .map((h) => `${h.predictive_run_at || h.predictive_run || ''}|${h.prediction_id || h.id || ''}|${h.prediction || h.prediction_type || ''}`)
      .filter((x) => x && !x.startsWith('|'))
  );

  const thisRun = [];
  for (const p of predList) {
    const o = runOne(p, ctx);
    const rec = {
      ts: new Date().toISOString(),
      predictive_run_at: prAt,
      prediction_id: p.id,
      prediction: p.type,
      confidence: p.confidence,
      actual_outcome: o.actual_outcome,
      was_correct: o.was_correct,
      inconclusive: o.inconclusive || !o.conclusive,
    };
    thisRun.push(rec);
    const k = `${prAt}|${p.id}|${p.type}`;
    if (rec.inconclusive) continue;
    if (known.has(k)) continue;
    known.add(k);
    appendJsonl(HIST, rec);
  }

  const allHist = readJsonl(HIST);
  const { scored, byType } = buildHistoryStats(allHist);
  const cal = highLowCalibration(scored);
  const trend = trendFromLines(scored);

  const validated = scored.length;
  const correct = scored.filter((s) => s.was_correct).length;
  const incorrect = scored.filter((s) => s.was_correct === false).length;
  const accuracy = validated > 0 ? correct / validated : 0;

  const accNum = num(accuracy, 0);
  let confidenceAlignment = 'insufficient';
  if (validated < 5) confidenceAlignment = 'insufficient';
  else if (accNum < 0.5) confidenceAlignment = 'low_trust';
  else if (accNum > 0.75) confidenceAlignment = 'high_trust';
  else confidenceAlignment = 'calibrated';

  const byTypeOut = Object.fromEntries(
    Object.keys(byType).map((k) => [
      k,
      { accuracy: Number((byType[k].accuracy || 0).toFixed(3)), samples: byType[k].samples || 0 },
    ])
  );

  const out = {
    schema_version: 1,
    generated_at: new Date().toISOString(),
    advisory_only: true,
    drp_note:
      'Phase 5.5: heuristic comparison of last predictive run vs current logs. Openly logs misses; no deletion from history. Used for QOSMEI and next predictive confidence nudge.',
    source_predictive: 'data/reports/z_predictive_intelligence.json',
    this_run: thisRun,
    validation_summary: {
      total_predictions: predList.length,
      validated,
      correct,
      incorrect,
      accuracy: Number(accuracy.toFixed(3)),
    },
    by_type: byTypeOut,
    confidence_calibration: cal,
    trend,
    confidence_alignment: confidenceAlignment,
    history_file: 'data/logs/z_prediction_validation_history.jsonl',
  };

  const md = [
    '# Z-Prediction validation (Phase 5.5)',
    '',
    `Generated: ${out.generated_at}`,
    '',
    '## Summary',
    `- Scored in history: **${validated}** (correct **${correct}** / wrong **${incorrect}**) — accuracy **${(accuracy * 100).toFixed(1)}%**`,
    `- Trend: **${trend}** · alignment: **${confidenceAlignment}**`,
    '',
    '## By type',
    ...Object.keys(byTypeOut).map(
      (k) => `- **${k}**: n=${byTypeOut[k].samples} acc≈${byTypeOut[k].accuracy}`
    ),
  ];

  fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(out, null, 2)}\n`, 'utf8');
  fs.writeFileSync(OUT_MD, md.join('\n') + '\n', 'utf8');
  console.log(
    `Z-Prediction validation: ${OUT_JSON} validated=${validated} accuracy=${(accuracy * 100).toFixed(0)}% trend=${trend}`
  );
}

main();
