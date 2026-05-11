import { describe, expect, it } from 'vitest';
import {
  AGE_MODES,
  AGE_THEME_BASE,
  buildCssVariableMap,
  SANCTUARY_SEMANTIC_ROLES,
} from './themeTokens.js';
import { DEFAULT_COMFORT_PREFS } from './accessibilityPrefs.js';

describe('themeTokens', () => {
  it('defines four age modes with palettes', () => {
    expect(AGE_MODES).toEqual(['kids', 'teens', 'adults', 'enterprise']);
    for (const m of AGE_MODES) {
      expect(AGE_THEME_BASE[m]['--zq-bg']).toMatch(/^hsl\(/);
      expect(AGE_THEME_BASE[m]['--zq-text']).toMatch(/^hsl\(/);
    }
  });

  it('includes sanctuary semantic roles list', () => {
    expect(SANCTUARY_SEMANTIC_ROLES).toContain('guardian');
    expect(SANCTUARY_SEMANTIC_ROLES).toContain('safety');
  });

  it('buildCssVariableMap merges comfort text size', () => {
    const map = buildCssVariableMap('adults', { ...DEFAULT_COMFORT_PREFS, textSize: 'xl' }, '268');
    expect(parseFloat(map['--zq-font-scale'])).toBeGreaterThan(1);
  });

  it('high contrast uses warm tint, not neutral pure white', () => {
    const map = buildCssVariableMap('adults', { ...DEFAULT_COMFORT_PREFS, contrast: 'high' }, '268');
    expect(map['--zq-text']).toMatch(/hsl\(48/);
  });

  it('photophobia mode softens glow', () => {
    const normal = buildCssVariableMap('teens', DEFAULT_COMFORT_PREFS, '200');
    const safe = buildCssVariableMap(
      'teens',
      { ...DEFAULT_COMFORT_PREFS, brightness: 'photophobia' },
      '200',
    );
    expect(parseFloat(safe['--zq-glow-strength'])).toBeLessThanOrEqual(parseFloat(normal['--zq-glow-strength']));
  });
});
