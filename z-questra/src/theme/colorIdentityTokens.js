/**
 * Phase 2.3 — semantic readable hues (no pure #fff default body; calm body uses warm tinted neutrals).
 * Values are full hsl() strings for CSS.
 */

export const NAMED_TONES = {
  gold: 'hsl(43 72% 62%)',
  aqua: 'hsl(185 52% 62%)',
  mint: 'hsl(158 48% 58%)',
  lavender: 'hsl(268 48% 72%)',
  rose: 'hsl(350 55% 68%)',
  peach: 'hsl(24 78% 72%)',
  amber: 'hsl(38 82% 58%)',
  leaf: 'hsl(136 42% 52%)',
  sky: 'hsl(205 62% 68%)',
  violet: 'hsl(276 58% 68%)',
  cyan: 'hsl(192 70% 58%)',
  commandGreen: 'hsl(142 45% 52%)',
  commandMagenta: 'hsl(310 48% 62%)',
  coral: 'hsl(12 70% 64%)',
  cream: 'hsl(46 35% 88%)',
  parchment: 'hsl(42 28% 78%)',
};

/** Body copy per age lane — tinted, not flat grey */
export const AGE_BODY_READABLE = {
  kids: 'hsl(48 42% 88%)',
  teens: 'hsl(185 28% 82%)',
  adults: 'hsl(42 22% 86%)',
  enterprise: 'hsl(195 24% 82%)',
};

/** Muted secondary lines — still hue-tinted */
export const AGE_BODY_MUTED = {
  kids: 'hsl(280 18% 72%)',
  teens: 'hsl(210 18% 68%)',
  adults: 'hsl(215 14% 72%)',
  enterprise: 'hsl(200 14% 68%)',
};

/** High-contrast mode: warm bright text, not pure white */
export const HIGH_CONTRAST_TEXT = 'hsl(48 35% 94%)';
export const HIGH_CONTRAST_MUTED = 'hsl(200 25% 82%)';

/** Guardian ribbon segment hints (static CSS; no animation) */
export const GUARDIAN_RIBBON = {
  safe: 'hsl(142 48% 48%)',
  caution: 'hsl(38 90% 52%)',
  stop: 'hsl(0 65% 58%)',
};

export function resolveTone(name) {
  return NAMED_TONES[name] || NAMED_TONES.cream;
}

/** Ensures string is not literal white hex (guardrail for future edits) */
export function assertNoPureWhite(cssColor) {
  if (!cssColor) return true;
  const s = String(cssColor).toLowerCase().replace(/\s/g, '');
  return !/^#fff(?:fff)?$/.test(s) && s !== '#ffffff';
}
