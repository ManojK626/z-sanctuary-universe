import { describe, expect, it } from 'vitest';
import {
  KALEIDOSCOPE_PATTERNS,
  KALEIDOSCOPE_RANDOMNESS,
  playGardenAllowPulse,
  playGardenGlowStrength,
} from './playGardenTokens.js';

describe('playGardenTokens', () => {
  it('exposes kaleidoscope option lists', () => {
    expect(KALEIDOSCOPE_RANDOMNESS.length).toBe(3);
    expect(KALEIDOSCOPE_PATTERNS.length).toBe(4);
  });

  it('softens glow for photophobia', () => {
    expect(playGardenGlowStrength({ brightness: 'photophobia', motion: 'full' })).toBe('low');
  });

  it('disallows pulse when OS reduced motion', () => {
    expect(playGardenAllowPulse({ motion: 'full', brightness: 'standard' }, true)).toBe(false);
  });
});
