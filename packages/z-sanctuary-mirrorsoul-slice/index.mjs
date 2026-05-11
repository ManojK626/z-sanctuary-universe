/**
 * MirrorSoul + ZES stub — reflection-only; no auto-actions; reads hub reports for advisory context.
 * Slice 1 v2: see createEntryV2, reflectV2, getHistoryV2 and bridges/ for API-first paths.
 */
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { buildAdvisoryContext, readOptionalJson } from './advisory.mjs';
import { resolveHubRoot } from './resolve_hub.mjs';

const MAX_TEXT = 32000;

const EMOTIONS = {
  calm: ['calm', 'peace', 'rest', 'still', 'breathe', 'soft'],
  heavy: ['heavy', 'sad', 'grief', 'tears', 'tired', 'exhausted', 'despair', 'suffer'],
  hope: ['hope', 'grateful', 'gratitude', 'love', 'blessing', 'thank'],
  focus: ['focus', 'clarity', 'certain', 'uncertain', 'doubt', 'wonder'],
  energy: ['fire', 'angry', 'anxious', 'panic', 'stress', 'overwhelm'],
};

export { buildAdvisoryContext, readOptionalJson } from './advisory.mjs';
export { resolveHubForChildWorkspace, resolveHubRoot } from './resolve_hub.mjs';
export { analyzeEmotion } from './bridges/z_intelligence_bridge.mjs';
export {
  validatePredictionLog,
  appendValidationResolution,
  validateFromUser,
  validationHistoryPath,
} from './bridges/z_validation_bridge.mjs';
export { createEntryV2, reflectV2, getHistoryV2, resolveValidationV2 } from './mirror_soul_v2.mjs';
export { appendAdaptiveFuel } from './adaptive_fuel.mjs';

function detectEmotionTags(text) {
  const t = text.toLowerCase();
  const tags = new Set();
  for (const [tag, words] of Object.entries(EMOTIONS)) {
    for (const w of words) {
      if (t.includes(w)) {
        tags.add(tag);
        break;
      }
    }
  }
  if (tags.size === 0) tags.add('unspecified');
  return [...tags];
}

function buildReflection({ emotionTags, ctx }) {
  const tone =
    emotionTags.includes('hope') || emotionTags.includes('calm')
      ? 'gentle, steady'
      : emotionTags.includes('heavy') || emotionTags.includes('energy')
        ? 'present with what you feel'
        : 'neutral and caring';
  const q = ctx.qosmei_context?.recommendation;
  const spiLine = ctx.spi_context?.top_note
    ? ` Structure note (advisory): ${String(ctx.spi_context.top_note).slice(0, 200)}.`
    : '';
  return (
    `Mirror holds this without judgment (${tone}). You named: ${emotionTags.join(', ')}. ` +
    (q
      ? `Ecosystem note (advisory, not a command): ${String(q).slice(0, 300)}.`
      : 'Keep language human; you can return anytime.') +
    spiLine
  );
}

function zesFromEntries(count) {
  const base = 50;
  const delta = Math.min(45, Math.floor(count * 1.2));
  return Math.min(100, base + delta);
}

function loadZesState(filePath) {
  const o = readOptionalJson(filePath);
  if (o && typeof o === 'object' && o.users) return o;
  return { users: {} };
}

/**
 * @param {object} opts
 * @param {string} opts.text
 * @param {string} [opts.user_id]
 * @param {string} [opts.hubRoot]
 * @param {string} [opts.mirrorsoulDataDir] — default hubRoot/data/mirrorsoul/entries
 */
export async function processMirrorSoulEntry({ text, user_id = 'anonymous', hubRoot, mirrorsoulDataDir } = {}) {
  if (typeof text !== 'string' || !text.trim()) {
    const err = new Error('text required (non-empty string)');
    err.code = 'VALIDATION';
    throw err;
  }
  if (text.length > MAX_TEXT) {
    const err = new Error(`text too long (max ${MAX_TEXT})`);
    err.code = 'VALIDATION';
    throw err;
  }

  const root = resolveHubRoot(hubRoot);
  const entriesBase = mirrorsoulDataDir
    ? path.resolve(mirrorsoulDataDir)
    : path.join(root, 'data', 'mirrorsoul', 'entries');
  const zesFile = path.join(root, 'data', 'mirrorsoul', 'zes_state.json');
  const ctx = buildAdvisoryContext(root);
  const emotionTags = detectEmotionTags(text);
  const entry_id = randomUUID();
  const created_at = new Date().toISOString();
  const body = { ...ctx };
  const ai_reflection = buildReflection({ text, emotionTags, ctx: body });
  const entry = {
    entry_id,
    user_id,
    text,
    emotion_tags: emotionTags,
    created_at,
    ai_reflection,
    ...ctx,
  };

  fs.mkdirSync(entriesBase, { recursive: true });
  const day = created_at.slice(0, 10);
  const dayDir = path.join(entriesBase, day);
  fs.mkdirSync(dayDir, { recursive: true });
  const filePath = path.join(dayDir, `${entry_id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(entry, null, 2), 'utf8');

  const zesState = loadZesState(zesFile);
  const uid = String(user_id);
  const forUser = zesState.users[uid] || { count: 0, trust_score: 50, last_updated: null };
  forUser.count = (forUser.count || 0) + 1;
  forUser.trust_score = zesFromEntries(forUser.count);
  forUser.last_updated = created_at;
  zesState.users[uid] = forUser;
  fs.mkdirSync(path.dirname(zesFile), { recursive: true });
  fs.writeFileSync(
    zesFile,
    JSON.stringify(
      {
        ...zesState,
        last_global_update: created_at,
        note: 'ZES stub: trust from journal consistency only. Advisory.',
      },
      null,
      2
    ),
    'utf8'
  );
  return {
    ...entry,
    zes: {
      user_id: uid,
      trust_score: forUser.trust_score,
      entry_count: forUser.count,
      last_updated: forUser.last_updated,
    },
  };
}

/**
 * @param {string} userId
 * @param {string} [hubRoot]
 */
export function getZesState(userId, hubRoot) {
  const root = resolveHubRoot(hubRoot);
  const zesFile = path.join(root, 'data', 'mirrorsoul', 'zes_state.json');
  const zesState = loadZesState(zesFile);
  const uid = String(userId);
  return zesState.users[uid] || { user_id: uid, trust_score: 50, entry_count: 0, last_updated: null };
}
