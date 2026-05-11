import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { analyzeEmotion } from './bridges/z_intelligence_bridge.mjs';
import { appendValidationResolution, validatePredictionLog } from './bridges/z_validation_bridge.mjs';
import { readOptionalJson } from './advisory.mjs';
import { resolveHubRoot } from './resolve_hub.mjs';
import { appendAdaptiveFuel } from './adaptive_fuel.mjs';

function dataDir(hub) {
  return path.join(hub, 'data', 'mirrorSoul');
}

function readJsonlTail(file, maxLines = 500) {
  if (!fs.existsSync(file)) return [];
  const raw = fs.readFileSync(file, 'utf8');
  const all = raw
    .split('\n')
    .filter(Boolean)
    .map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  return all.slice(-maxLines);
}

function mergePatternsFile(hubRoot, signals) {
  const f = path.join(dataDir(hubRoot), 'emotional_patterns.json');
  const cur = readOptionalJson(f) || { counts: {}, updated_at: null, advisory_only: true };
  for (const s of signals) {
    const k = String(s);
    if (k.startsWith('label:')) continue;
    cur.counts[k] = (cur.counts[k] || 0) + 1;
  }
  cur.updated_at = new Date().toISOString();
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, JSON.stringify(cur, null, 2), 'utf8');
  return cur;
}

/**
 * @param {object} p
 * @param {string} p.user_id
 * @param {string} p.text
 * @param {string} [p.emotion]
 * @param {number} [p.intensity]
 * @param {string} p.hubRoot
 */
export async function createEntryV2({ user_id, text, emotion, intensity, hubRoot } = {}) {
  const err = (m) => {
    const e = new Error(m);
    e.code = 'VALIDATION';
    return e;
  };
  if (typeof text !== 'string' || !text.trim()) throw err('text required');
  if (text.length > 32000) throw err('text too long');
  const root = resolveHubRoot(hubRoot);
  const d = dataDir(root);
  fs.mkdirSync(d, { recursive: true });
  const entry = {
    id: randomUUID(),
    user_id: String(user_id || 'anonymous'),
    text,
    emotion: emotion || null,
    intensity: typeof intensity === 'number' ? Math.max(0, Math.min(1, intensity)) : null,
    ts: new Date().toISOString(),
  };
  fs.appendFileSync(path.join(d, 'entries.jsonl'), `${JSON.stringify(entry)}\n`, 'utf8');
  return entry;
}

/**
 * @param {object} p
 * @param {string} p.text
 * @param {string} [p.user_id]
 * @param {string} [p.emotion]
 * @param {number} [p.intensity]
 * @param {string} p.hubRoot
 * @param {boolean} [p.logValidation] default true
 */
export async function reflectV2({ text, user_id, emotion, intensity, hubRoot, logValidation = true } = {}) {
  const root = resolveHubRoot(hubRoot);
  const intel = await analyzeEmotion({ text, user_id, emotion, intensity, hubRoot: root });
  const rowId = randomUUID();
  const reflectionId = Date.now();
  const predictionId = `pred_ms_${rowId.replace(/-/g, '')}`;
  const out = {
    id: rowId,
    user_id: user_id || 'anonymous',
    reflection: intel.reflection,
    signals: intel.signals,
    suggestion: intel.suggestion,
    confidence: intel.confidence,
    ts: new Date().toISOString(),
    reflection_id: reflectionId,
    prediction_id: predictionId,
    validation_status: 'pending',
    remind_in_hours: 6,
  };
  fs.mkdirSync(dataDir(root), { recursive: true });
  fs.appendFileSync(
    path.join(dataDir(root), 'reflections.jsonl'),
    `${JSON.stringify({ ...out, _advisory_meta: true })}\n`,
    'utf8'
  );
  if (logValidation) {
    validatePredictionLog(root, {
      id: out.id,
      prediction_id: out.prediction_id,
      reflection_id: out.reflection_id,
      confidence: out.confidence,
      status: 'pending',
      user_id: out.user_id,
      signals: intel.signals || [],
    });
  }
  appendAdaptiveFuel(root, {
    reflection_id: out.id,
    prediction_id: out.prediction_id,
    user_id: out.user_id,
    signals: intel.signals,
    confidence: out.confidence,
  });
  mergePatternsFile(root, intel.signals || []);
  return out;
}

/**
 * @param {string} hubRoot
 * @param {{ prediction_id: string, outcome: string, notes?: string, actor?: string }} p
 */
export function resolveValidationV2(hubRoot, p) {
  const line = appendValidationResolution(hubRoot, p);
  return JSON.parse(line);
}

/**
 * @param {string} userId
 * @param {string} hubRoot
 * @param {number} [limit=50]
 */
export function getHistoryV2(userId, hubRoot, limit = 50) {
  const root = resolveHubRoot(hubRoot);
  const f = path.join(dataDir(root), 'entries.jsonl');
  const rows = readJsonlTail(f, 2000);
  const uid = String(userId);
  return rows.filter((r) => r.user_id === uid).slice(-limit);
}
