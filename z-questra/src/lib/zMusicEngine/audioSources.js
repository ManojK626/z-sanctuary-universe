/**
 * @typedef {'user_generated' | 'local_demo' | 'user_url' | 'approved_signed'} ZSourceType
 * @typedef {'low' | 'medium' | 'high'} ZIntensityLabel
 */

/**
 * @typedef {object} ZSmeAudioSource
 * @property {string} trackId
 * @property {string} seedTrackId
 * @property {string} title
 * @property {import('./moodModel.js').ZMode} mode
 * @property {ZSourceType} sourceType
 * @property {string} audioUrl
 * @property {string} sourceLabel
 * @property {ZIntensityLabel} intensity
 */

/**
 * Canonical audio metadata per hero seed row.
 * v1.2: set `audioUrl` only when the file exists under `public/audio/` (same-origin). If missing, leave empty — see
 * `z_music_engine/PHASE_2_8_Z_SME_SAME_ORIGIN_AUDIO_RECEIPT.md`.
 */
export const Z_SME_AUDIO_SOURCES = /** @type {ZSmeAudioSource[]} */ ([
  {
    trackId: 'aligned-with-nature',
    seedTrackId: 'al-1',
    title: 'Aligned With Nature',
    mode: 'alignment',
    sourceType: 'user_generated',
    audioUrl: '',
    sourceLabel: 'Generated track URL not attached yet',
    intensity: 'low',
  },
  {
    trackId: 'awakened-energy',
    seedTrackId: 'pw-1',
    title: 'Awakened Energy',
    mode: 'power',
    sourceType: 'user_generated',
    audioUrl: '',
    sourceLabel: 'Generated track URL not attached yet',
    intensity: 'medium',
  },
  {
    trackId: 'the-inner-journey',
    seedTrackId: 'jy-1',
    title: 'The Inner Journey',
    mode: 'journey',
    sourceType: 'user_generated',
    audioUrl: '',
    sourceLabel: 'Generated track URL not attached yet',
    intensity: 'low',
  },
]);

/**
 * @param {string} seedTrackId
 * @returns {ZSmeAudioSource | null}
 */
export function getAudioSourceForSeedTrack(seedTrackId) {
  return Z_SME_AUDIO_SOURCES.find((s) => s.seedTrackId === seedTrackId) || null;
}
