/**
 * Z-QUESTRA Phase 2.1+ — design tokens aligned with Z-Sanctuary language (Guardian, Blueprint, Observe, …).
 * Phase 2.3 merges tinted readable body text via colorIdentityTokens.
 * Frontend-only; no hub imports.
 */

import {
  AGE_BODY_MUTED,
  AGE_BODY_READABLE,
  HIGH_CONTRAST_MUTED,
  HIGH_CONTRAST_TEXT,
} from './colorIdentityTokens.js';

export const SANCTUARY_SEMANTIC_ROLES = [
  'guardian',
  'blueprint',
  'observe',
  'reflect',
  'learn',
  'safety',
];

/** Accent presets mapped to semantic roles for panels */
export const SEMANTIC_ACCENTS = {
  guardian: { hue: '268', label: 'Guardian' },
  blueprint: { hue: '210', label: 'Blueprint' },
  observe: { hue: '172', label: 'Observe' },
  reflect: { hue: '280', label: 'Reflect' },
  learn: { hue: '42', label: 'Learn' },
  safety: { hue: '25', label: 'Safety' },
};

export const AGE_MODES = ['kids', 'teens', 'adults', 'enterprise'];

/**
 * Base palette per age mode: CSS variable-friendly strings (hsl components or full hsl()).
 * Glow is kept subtle; ComfortBar can scale or zero it.
 */
export const AGE_THEME_BASE = {
  kids: {
    '--zq-bg': 'hsl(220 35% 18%)',
    '--zq-surface': 'hsl(220 28% 24%)',
    '--zq-text': 'hsl(45 30% 94%)',
    '--zq-text-muted': 'hsl(45 18% 78%)',
    '--zq-radius': '14px',
    '--zq-font-scale': '1.08',
    '--zq-glow-strength': '0.35',
    '--zq-heading-weight': '650',
    '--zq-card-soft': '1',
  },
  teens: {
    '--zq-bg': 'hsl(240 28% 10%)',
    '--zq-surface': 'hsl(250 22% 16%)',
    '--zq-text': 'hsl(180 40% 94%)',
    '--zq-text-muted': 'hsl(200 15% 72%)',
    '--zq-radius': '10px',
    '--zq-font-scale': '1',
    '--zq-glow-strength': '0.55',
    '--zq-heading-weight': '700',
    '--zq-card-soft': '0.92',
  },
  adults: {
    '--zq-bg': 'hsl(222 18% 12%)',
    '--zq-surface': 'hsl(222 14% 18%)',
    '--zq-text': 'hsl(40 12% 93%)',
    '--zq-text-muted': 'hsl(210 8% 72%)',
    '--zq-radius': '8px',
    '--zq-font-scale': '0.98',
    '--zq-glow-strength': '0.25',
    '--zq-heading-weight': '600',
    '--zq-card-soft': '1',
  },
  enterprise: {
    '--zq-bg': 'hsl(210 15% 8%)',
    '--zq-surface': 'hsl(210 12% 12%)',
    '--zq-text': 'hsl(210 12% 92%)',
    '--zq-text-muted': 'hsl(210 8% 68%)',
    '--zq-radius': '4px',
    '--zq-font-scale': '0.95',
    '--zq-glow-strength': '0.15',
    '--zq-heading-weight': '650',
    '--zq-card-soft': '1',
  },
};

/**
 * Merge age base + comfort overrides into a flat map for document.documentElement.style.
 */
export function buildCssVariableMap(ageMode, comfort, semanticAccentHue) {
  const mode = AGE_THEME_BASE[ageMode] || AGE_THEME_BASE.adults;
  const out = { ...mode };

  const bodyText = AGE_BODY_READABLE[ageMode] || mode['--zq-text'];
  const bodyMuted = AGE_BODY_MUTED[ageMode] || mode['--zq-text-muted'];
  out['--zq-text'] = bodyText;
  out['--zq-text-muted'] = bodyMuted;

  const textMult =
    comfort.textSize === 'small'
      ? 0.875
      : comfort.textSize === 'large'
        ? 1.125
        : comfort.textSize === 'xl'
          ? 1.25
          : 1;
  const baseScale = parseFloat(String(mode['--zq-font-scale'] || '1'));
  out['--zq-font-scale'] = String(baseScale * textMult);

  if (comfort.contrast === 'high') {
    out['--zq-text'] = HIGH_CONTRAST_TEXT;
    out['--zq-text-muted'] = HIGH_CONTRAST_MUTED;
    out['--zq-surface'] = 'hsl(222 18% 12%)';
    out['--zq-glow-strength'] = '0.08';
  } else if (comfort.contrast === 'calm') {
    const gs = parseFloat(String(out['--zq-glow-strength'] || '0.3'));
    out['--zq-glow-strength'] = String(Math.max(0, gs * 0.45));
  } else if (comfort.contrast === 'neon') {
    const gs = parseFloat(String(out['--zq-glow-strength'] || '0.3'));
    out['--zq-glow-strength'] = String(Math.min(0.65, gs * 1.15));
  }

  if (comfort.motion === 'reduced') {
    out['--zq-glow-strength'] = String(
      Math.min(parseFloat(String(out['--zq-glow-strength'] || '0')), 0.2),
    );
  }

  if (comfort.brightness === 'lowLight') {
    out['--zq-bg'] = 'hsl(222 18% 8%)';
    out['--zq-surface'] = 'hsl(222 14% 14%)';
    out['--zq-text'] = 'hsl(40 10% 88%)';
  } else if (comfort.brightness === 'photophobia') {
    out['--zq-bg'] = 'hsl(220 12% 14%)';
    out['--zq-surface'] = 'hsl(220 10% 20%)';
    out['--zq-text'] = 'hsl(45 8% 82%)';
    out['--zq-text-muted'] = 'hsl(210 6% 62%)';
    out['--zq-glow-strength'] = '0.06';
  }

  const hue = semanticAccentHue ?? SEMANTIC_ACCENTS.guardian.hue;
  const glow = parseFloat(String(out['--zq-glow-strength'] || '0.3'));
  out['--zq-accent'] = `hsl(${hue} 65% 58%)`;
  out['--zq-accent-glow'] = `hsla(${hue} 70% 52% / ${glow * 0.45})`;

  return out;
}

export function applyCssVars(el, map) {
  if (!el || !map) return;
  Object.entries(map).forEach(([k, v]) => {
    el.style.setProperty(k, String(v));
  });
}
