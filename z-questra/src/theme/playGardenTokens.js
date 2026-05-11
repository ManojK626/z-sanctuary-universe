/**
 * Phase 2.5 — Z PlayGarden visual tokens (Canvas / SVG; no external engine).
 */

export const PLAY_GARDEN_PHASE = '2.5';

/** Uncertainty kaleidoscope — slower drift = calmer; illustrative only, not predictive. */
export const KALEIDOSCOPE_RANDOMNESS = [
  { id: 'calm', label: 'Calm' },
  { id: 'balanced', label: 'Balanced' },
  { id: 'wild', label: 'Wild' },
];

export const KALEIDOSCOPE_PATTERNS = [
  { id: 'soft', label: 'Soft' },
  { id: 'spiral', label: 'Spiral' },
  { id: 'mirror', label: 'Mirror' },
  { id: 'star', label: 'Star' },
];

/** Non-monetary badge previews — pride / learning only */
export const PLAY_GARDEN_BADGES = [
  { id: 'notebook-star', label: 'Notebook Star', tone: 'gold', hint: 'Notes, highlights, export/import' },
  { id: 'comfort-hero', label: 'Comfort Hero', tone: 'mint', hint: 'Comfort bar & calm modes' },
  { id: 'zebra-helper', label: 'Zebra Helper', tone: 'lavender', hint: 'Z-Zebras readiness family' },
  { id: 'guardian-shield', label: 'Guardian Shield', tone: 'commandGreen', hint: 'Safe local guardian path' },
  { id: 'learning-explorer', label: 'Learning Explorer', tone: 'sky', hint: 'Learning lane explorer' },
];

export function playGardenGlowStrength(comfort) {
  if (!comfort || typeof comfort !== 'object') return 'medium';
  if (comfort.brightness === 'photophobia') return 'low';
  if (comfort.motion === 'reduced') return 'low';
  return 'medium';
}

export function playGardenAllowPulse(comfort, osReducedMotion) {
  if (osReducedMotion) return false;
  if (!comfort || typeof comfort !== 'object') return true;
  if (comfort.motion === 'reduced') return false;
  if (comfort.brightness === 'photophobia') return false;
  return true;
}
