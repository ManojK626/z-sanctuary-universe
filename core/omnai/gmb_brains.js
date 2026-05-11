/**
 * Giant Multiplying Brains — load / clone posture (§03 blueprint).
 * Returns advisory flags only.
 */

/** @typedef {{ id: string, loadPct: number }} BrainLoad */

export const STANDARD_BRAIN_IDS = Object.freeze([
  'MB-0',
  'BRAIN-1',
  'BRAIN-2',
  'BRAIN-3',
  'BRAIN-4',
  'BRAIN-5',
  'BRAIN-6',
  'BRAIN-7',
]);

const CLONE_THRESHOLD = 80;

/**
 * Whether blueprint auto-clone rule would fire for this brain.
 * @param {BrainLoad} row
 */
export function shouldSuggestClone(row) {
  const id = String(row?.id ?? '');
  if (id === 'MB-0') return false;
  const pct = Number(row?.loadPct);
  return !Number.isNaN(pct) && pct > CLONE_THRESHOLD;
}

/**
 * Summarize fleet loads.
 * @param {BrainLoad[]} rows
 */
export function summarizeGmb(rows) {
  const list = Array.isArray(rows) ? rows : [];
  const clones = [];
  const stable = [];
  for (const r of list) {
    if (!r || typeof r.id !== 'string') continue;
    if (shouldSuggestClone(r)) clones.push({ id: r.id, loadPct: Number(r.loadPct) });
    else stable.push({ id: r.id, loadPct: Number(r.loadPct) });
  }
  return {
    clone_threshold_pct: CLONE_THRESHOLD,
    suggested_clone: clones,
    stable,
    posture: clones.length === 0 ? 'GREEN_CAPACITY' : 'YELLOW_ELASTIC_CLONE_ADVISORY',
  };
}
