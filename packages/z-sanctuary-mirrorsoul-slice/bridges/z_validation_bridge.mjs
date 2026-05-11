import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

/** Legacy compact log (older clients / resolve path). */
function legacyPath(hubRoot) {
  return path.join(hubRoot, 'data', 'logs', 'z_prediction_validation.jsonl');
}

/** Canonical shared log: same file as `scripts/z_prediction_validation.mjs` and `z_learning_evaluator.mjs`. */
export function validationHistoryPath(hubRoot) {
  return path.join(hubRoot, 'data', 'logs', 'z_prediction_validation_history.jsonl');
}

/**
 * @param {string} hubRoot
 * @param {object} record
 * @param {string} [record.id]
 * @param {string} [record.type] pending | (omit for historical rows)
 * @param {string} [record.source] mirrorsoul
 * @param {number} [record.confidence]
 * @param {string} [record.status]
 * @param {string} [record.prediction_id]
 * @param {number} [record.reflection_id]
 * @param {string[]} [record.signals]
 * @param {string} [record.user_id]
 */
export function validatePredictionLog(hubRoot, record) {
  const file = legacyPath(hubRoot);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const line = JSON.stringify({
    type: 'pending',
    id: record.id || randomUUID(),
    confidence: record.confidence,
    status: record.status || 'pending',
    source: record.source || 'mirrorsoul',
    ts: new Date().toISOString(),
  });
  fs.appendFileSync(file, `${line}\n`, 'utf8');

  const p = validationHistoryPath(hubRoot);
  const pid = record.prediction_id || (record.id ? `pred_ms_${String(record.id).replace(/-/g, '')}` : `pred_ms_${randomUUID().replace(/-/g, '')}`);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const unified = {
    kind: 'mirrorsoul_pending',
    ts: new Date().toISOString(),
    prediction_id: pid,
    reflection_id: record.reflection_id != null ? record.reflection_id : null,
    source: 'mirrorSoul',
    confidence: typeof record.confidence === 'number' ? record.confidence : null,
    status: record.status || 'pending',
    user_id: record.user_id != null ? String(record.user_id) : null,
    signals: Array.isArray(record.signals) ? record.signals : null,
  };
  fs.appendFileSync(p, `${JSON.stringify(unified)}\n`, 'utf8');
}

const OUTCOMES = new Set(['aligned', 'divergent', 'abstain']);

const FEEDBACK = new Set(['accurate', 'partial', 'wrong']);

/**
 * @param {string} hubRoot
 * @param {object} p
 * @param {string} p.prediction_id
 * @param {string} p.outcome  aligned | divergent | abstain
 * @param {string} [p.notes]
 * @param {string} [p.actor]
 */
export function appendValidationResolution(hubRoot, p) {
  if (!p?.prediction_id) {
    const e = new Error('prediction_id required');
    e.code = 'VALIDATION';
    throw e;
  }
  const o = String(p.outcome);
  if (!OUTCOMES.has(o)) {
    const e = new Error('outcome must be aligned, divergent, or abstain');
    e.code = 'VALIDATION';
    throw e;
  }
  const file = legacyPath(hubRoot);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const line = JSON.stringify({
    type: 'resolution',
    resolves_id: p.prediction_id,
    outcome: o,
    notes: typeof p.notes === 'string' ? p.notes.slice(0, 2000) : null,
    actor: p.actor || 'operator',
    source: 'mirrorsoul',
    ts: new Date().toISOString(),
  });
  fs.appendFileSync(file, `${line}\n`, 'utf8');

  const ufb = o === 'aligned' ? 'accurate' : o === 'divergent' ? 'wrong' : 'partial';
  const hp = validationHistoryPath(hubRoot);
  const human = {
    kind: 'human_validation',
    ts: new Date().toISOString(),
    prediction_id: String(p.prediction_id).trim(),
    user_feedback: ufb,
    notes: typeof p.notes === 'string' ? p.notes.slice(0, 2000) : null,
    source: 'human',
    validated_at: new Date().toISOString(),
    _legacy_outcome: o,
  };
  fs.appendFileSync(hp, `${JSON.stringify(human)}\n`, 'utf8');
  return line;
}

/**
 * Optional: human-in-the-loop feedback (accurate | partial | wrong).
 * @param {string} hubRoot
 * @param {{ prediction_id: string, user_feedback: string, notes?: string }} data
 */
export function validateFromUser(hubRoot, data) {
  const pid = data?.prediction_id;
  if (typeof pid !== 'string' || !pid.trim()) {
    const e = new Error('prediction_id required');
    e.code = 'VALIDATION';
    throw e;
  }
  const fb = String(data?.user_feedback || '').toLowerCase();
  if (!FEEDBACK.has(fb)) {
    const e = new Error('user_feedback must be one of: accurate, partial, wrong');
    e.code = 'VALIDATION';
    throw e;
  }
  const p = validationHistoryPath(hubRoot);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const line = {
    kind: 'human_validation',
    ts: new Date().toISOString(),
    prediction_id: pid.trim(),
    user_feedback: fb,
    notes: typeof data?.notes === 'string' ? data.notes : null,
    source: 'human',
    validated_at: new Date().toISOString(),
  };
  fs.appendFileSync(p, `${JSON.stringify(line)}\n`, 'utf8');
  return { status: 'recorded', prediction_id: line.prediction_id };
}
