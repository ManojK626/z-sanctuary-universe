import { Z_MUSIC_SEED_TRACKS } from './seedTracks.js';

/**
 * @typedef {import('./moodModel.js').ZMode} ZMode
 * @typedef {import('./explainability.js').ZExplanation} ZExplanation
 * @typedef {import('./seedTracks.js').ZTrack} ZTrack
 */

/**
 * @param {ZMode} mode
 * @param {ZTrack[]} tracks
 * @param {object} [opts]
 * @param {number} [opts.maxTracks]
 * @param {'kids' | 'teens' | 'adults' | 'enterprise' | undefined} [opts.ageMode]
 * @param {boolean} [opts.userExplicitPower]
 */
export function buildPlaylist(mode, tracks, opts = {}) {
  const maxTracks = Math.min(12, Math.max(3, opts.maxTracks ?? 6));
  const ageMode = opts.ageMode;
  const kidsCap = ageMode === 'kids' && !opts.userExplicitPower;

  let filtered = tracks.filter((t) => t.mode === mode);
  if (kidsCap) {
    filtered = filtered.filter((t) => t.energy <= 0.72);
  }

  const picked = filtered.slice(0, maxTracks);

  const signals = ['catalog_mode_filter'];
  if (kidsCap) signals.push('kids_energy_cap');
  if (opts.userExplicitPower) signals.push('user_explicit_power');

  /** @type {ZExplanation} */
  const explanation = {
    what_changed: `Active mode ${mode}${kidsCap ? ' with kids energy cap' : ''}.`,
    signals_considered: signals,
    reason:
      picked.length > 0
        ? `Tracks tagged "${mode}" match intent${kidsCap ? ' within calmer energy band' : ''}.`
        : `No tracks matched filters for "${mode}" — widen catalog or relax guardian.`,
    confidence: confidenceScore(picked.length, tracks.filter((t) => t.mode === mode).length, kidsCap),
    next_action: 'Optional: log reflection or copy training intent for Amk-Goku when hub is available.',
  };

  return { tracks: picked, explanation };
}

/**
 * @param {ZMode} mode
 * @param {object} [opts]
 * @param {number} [opts.maxTracks]
 * @param {'kids' | 'teens' | 'adults' | 'enterprise' | undefined} [opts.ageMode]
 * @param {boolean} [opts.userExplicitPower]
 */
export function buildDefaultPlaylist(mode, opts = {}) {
  return buildPlaylist(mode, Z_MUSIC_SEED_TRACKS, opts);
}

/**
 * @param {ZTrack} track
 * @param {ZMode} mode
 * @param {object} ctx
 * @param {string[]} ctx.signals
 */
export function explainTrack(track, mode, ctx = { signals: [] }) {
  return {
    what_changed: `Highlighting "${track.title}" for mode ${mode}.`,
    signals_considered: ['track.mode_tag', 'track.energy', ...ctx.signals],
    reason: `This row shares mode "${mode}" and energy ${track.energy.toFixed(2)} (0 = calm, 1 = intense). Not a health score.`,
    confidence: Math.min(0.94, 0.62 + track.energy * 0.2),
  };
}

function confidenceScore(pickedCount, poolSize, kidsCap) {
  if (pickedCount === 0) return 0.15;
  const base = 0.55 + Math.min(0.28, pickedCount * 0.04);
  const poolBoost = poolSize > 0 ? Math.min(0.12, poolSize * 0.015) : 0;
  const guardianDiscount = kidsCap ? -0.05 : 0;
  return Math.min(0.95, base + poolBoost + guardianDiscount);
}
