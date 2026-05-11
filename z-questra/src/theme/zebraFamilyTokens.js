/**
 * Phase 2.3B — AT Love Zebra / Z-Zebras Family visual tokens (readable hues, no harsh white defaults).
 */

export const ZEBRA_STRIPE_TONES = {
  amber: 'hsl(38 82% 58%)',
  aqua: 'hsl(185 52% 62%)',
  mint: 'hsl(158 48% 58%)',
  violet: 'hsl(276 58% 68%)',
  rose: 'hsl(350 55% 68%)',
  leaf: 'hsl(136 42% 52%)',
  gold: 'hsl(43 72% 62%)',
  deepBlue: 'hsl(222 55% 62%)',
  cream: 'hsl(46 35% 88%)',
};

/** Rotate tones across zebra cards by index */
export function zebraToneAt(index) {
  const keys = Object.keys(ZEBRA_STRIPE_TONES);
  return ZEBRA_STRIPE_TONES[keys[index % keys.length]];
}

export function zebraCardBorder(tone) {
  return `1px solid color-mix(in hsl, ${tone} 42%, transparent)`;
}

export function zebraCardGlow(tone) {
  return `0 0 14px color-mix(in hsl, ${tone} 28%, transparent)`;
}
