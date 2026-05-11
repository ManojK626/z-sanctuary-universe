#!/usr/bin/env node
/**
 * Z-Learning evaluator (Phase 3, advisory-only).
 * Infers success | partial | failure from Guardian vs decision resolve events, appends z_learning_history.jsonl.
 * Emits data/reports/z_learning_evaluation.json
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const LOGS = path.join(ROOT, 'data', 'logs');
const REPORTS = path.join(ROOT, 'data', 'reports');
const DECISION_LOG = path.join(LOGS, 'z_decision_history.jsonl');
const HUMAN_VAL_LOG = path.join(LOGS, 'z_prediction_validation_history.jsonl');
const LEARNING_LOG = path.join(LOGS, 'z_learning_history.jsonl');
const OUT_EVAL = path.join(REPORTS, 'z_learning_evaluation.json');
const GUARDIAN = path.join(REPORTS, 'z_bot_guardian.json');
const SPI = path.join(REPORTS, 'z_structural_patterns.json');

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
  const out = [];
  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (!t) continue;
    try {
      out.push(JSON.parse(t));
    } catch {
      /* skip */
    }
  }
  return out;
}

function num(v, fb = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fb;
}

function existingLearningKeys() {
  const seen = new Set();
  for (const row of readJsonl(LEARNING_LOG)) {
    const id = row?.decision_id;
    const t = row?.decision_ts || row?.ts;
    if (id && t) seen.add(`${id}\t${t}`);
  }
  return seen;
}

/**
 * Map optional human feedback lines (source human) to learning outcomes.
 * accurate → success, partial → partial, wrong → failure. Overrides heuristics.
 */
function outcomeFromFeedback(fb) {
  const f = String(fb || '').toLowerCase();
  if (f === 'accurate') return 'success';
  if (f === 'partial') return 'partial';
  if (f === 'wrong' || f === 'incorrect') return 'failure';
  return null;
}

function ingestHumanValidations(seen) {
  const rows = readJsonl(HUMAN_VAL_LOG);
  const newLines = [];
  for (const line of rows) {
    if (String(line?.source || '') !== 'human' || !line.user_feedback) continue;
    if (line.kind && line.kind !== 'human_validation') continue;
    const outcome = outcomeFromFeedback(line.user_feedback);
    if (!outcome) continue;
    const pid = String(line.prediction_id || '').trim();
    if (!pid) continue;
    const validatedAt = line.validated_at || line.ts;
    if (!validatedAt) continue;
    const decisionId = `ms_validation:${pid}`;
    const k = `${decisionId}\t${validatedAt}`;
    if (seen.has(k)) continue;
    newLines.push({
      evaluated_at: new Date().toISOString(),
      decision_ts: validatedAt,
      decision_id: decisionId,
      action: 'validate',
      outcome,
      source: 'human',
      prediction_id: pid,
      user_feedback: String(line.user_feedback).toLowerCase(),
      notes: line.notes || null,
      spi_context: spiContextSnapshot(),
    });
    seen.add(k);
  }
  return newLines;
}

function outcomeFromGuardian(missing, prevMissing, decisionId) {
  if (decisionId === 'investigate_missing_project' || String(decisionId || '').includes('missing')) {
    if (missing === 0) return 'success';
    if (Number.isFinite(prevMissing) && missing < prevMissing) return 'partial';
    if (Number.isFinite(prevMissing) && missing > prevMissing) return 'failure';
  }
  if (missing === 0) return 'success';
  if (Number.isFinite(prevMissing) && missing < prevMissing) return 'partial';
  if (Number.isFinite(prevMissing) && missing > prevMissing) return 'failure';
  return 'partial';
}

function spiContextSnapshot() {
  const spi = readJson(SPI, null);
  if (!spi?.schema_version) {
    return { evolution_phase: null, signals: [] };
  }
  const signals = Array.isArray(spi.structural_patterns)
    ? spi.structural_patterns.map((p) => p.type).filter(Boolean)
    : [];
  return { evolution_phase: spi.evolution_phase ?? null, signals: [...new Set(signals)] };
}

function main() {
  const prev = readJson(OUT_EVAL, {});
  const prevMissing = num(prev.guardian_missing, NaN);
  const guardian = readJson(GUARDIAN, {});
  const missing = num(guardian?.summary?.missing, 0);
  const seen = existingLearningKeys();
  const humanNew = ingestHumanValidations(seen);
  const newLines = [...humanNew];
  const results = humanNew.map((r) => ({
    key: `${r.decision_id}\t${r.decision_ts}`,
    outcome: r.outcome,
    decision_id: r.decision_id,
    source: 'human',
  }));
  const history = readJsonl(DECISION_LOG);

  for (const e of history) {
    if (String(e?.action || '').toLowerCase() !== 'resolve') continue;
    const id = e?.decision_id;
    const ts = e?.ts;
    if (!id || !ts) continue;
    const k = `${id}\t${ts}`;
    if (seen.has(k)) continue;

    const oc = outcomeFromGuardian(missing, prevMissing, id);
    const sc = spiContextSnapshot();
    const line = {
      evaluated_at: new Date().toISOString(),
      decision_ts: ts,
      decision_id: id,
      action: 'resolve',
      outcome: oc,
      guardian_missing_at_eval: missing,
      guardian_missing_previous: Number.isFinite(prevMissing) ? prevMissing : null,
      spi_context: sc,
    };
    newLines.push(line);
    results.push({ key: k, outcome: oc, decision_id: id, source: 'resolve' });
    seen.add(k);
  }

  if (newLines.length) {
    fs.mkdirSync(LOGS, { recursive: true });
    for (const row of newLines) {
      fs.appendFileSync(LEARNING_LOG, `${JSON.stringify(row)}\n`, 'utf8');
    }
  }

  const payload = {
    schema_version: 1,
    generated_at: new Date().toISOString(),
    advisory_only: true,
    drp_note:
      'Resolve outcomes from Guardian; human feedback from data/logs/z_prediction_validation_history.jsonl (source human). No auto-exec.',
    new_entries: newLines.length,
    new_human_from_validation: humanNew.length,
    guardian_missing: missing,
    guardian_missing_previous: Number.isFinite(prevMissing) ? prevMissing : null,
    last_eval_outcomes: results,
    log_file: 'data/logs/z_learning_history.jsonl',
  };
  fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(OUT_EVAL, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(
    `Z-Learning evaluator: new=${newLines.length} (human=${humanNew.length}) missing=${missing} → ${OUT_EVAL}`
  );
}

main();
