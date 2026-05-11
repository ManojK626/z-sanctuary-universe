/**
 * Comfort / accessibility preference keys — frontend-only; persisted locally optional later (not in Phase 2.1).
 */

export const DEFAULT_COMFORT_PREFS = {
  textSize: 'medium',
  contrast: 'calm',
  motion: 'on',
  reading: 'normal',
  brightness: 'normal',
  audioReadiness: 'captions',
  panelView: 'normal',
};

export const TEXT_SIZE_OPTIONS = [
  { id: 'small', label: 'Small' },
  { id: 'medium', label: 'Medium' },
  { id: 'large', label: 'Large' },
  { id: 'xl', label: 'XL' },
];

export const CONTRAST_OPTIONS = [
  { id: 'calm', label: 'Calm' },
  { id: 'neon', label: 'Neon' },
  { id: 'high', label: 'High contrast' },
];

export const MOTION_OPTIONS = [
  { id: 'on', label: 'On' },
  { id: 'reduced', label: 'Reduced' },
];

export const READING_OPTIONS = [
  { id: 'normal', label: 'Normal' },
  { id: 'dyslexia', label: 'Dyslexia-friendly' },
];

export const BRIGHTNESS_OPTIONS = [
  { id: 'normal', label: 'Normal' },
  { id: 'lowLight', label: 'Low light' },
  { id: 'photophobia', label: 'Photophobia safe' },
];

export const AUDIO_READINESS_OPTIONS = [
  { id: 'captions', label: 'Captions' },
  { id: 'readAloudLabels', label: 'Read-aloud ready labels' },
];

export const PANEL_VIEW_OPTIONS = [
  { id: 'normal', label: 'Normal' },
  { id: 'wide', label: 'Wide' },
  { id: 'focus', label: 'Focus mode' },
];

export function normalizeComfortPrefs(partial) {
  return { ...DEFAULT_COMFORT_PREFS, ...partial };
}

/** Classes / dataset hints for global shell */
export function comfortClassNames(prefs) {
  const c = [];
  if (prefs.reading === 'dyslexia') c.push('zq-dyslexia');
  if (prefs.motion === 'reduced') c.push('zq-reduced-motion');
  if (prefs.panelView === 'wide') c.push('zq-panel-wide');
  if (prefs.panelView === 'focus') c.push('zq-panel-focus');
  return c.join(' ');
}
