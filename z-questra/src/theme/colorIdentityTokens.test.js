import { describe, expect, it } from 'vitest';
import {
  assertNoPureWhite,
  HIGH_CONTRAST_TEXT,
  resolveTone,
  NAMED_TONES,
} from './colorIdentityTokens.js';

describe('colorIdentityTokens', () => {
  it('resolveTone returns hsl for known names', () => {
    expect(resolveTone('gold')).toMatch(/^hsl\(/);
    expect(resolveTone('bogus')).toBeTruthy();
  });

  it('high contrast text is warm tinted, not neutral white', () => {
    expect(HIGH_CONTRAST_TEXT).toMatch(/hsl\(48/);
    expect(assertNoPureWhite(HIGH_CONTRAST_TEXT)).toBe(true);
  });

  it('named tones avoid literal white hex', () => {
    for (const v of Object.values(NAMED_TONES)) {
      expect(String(v).toLowerCase()).not.toContain('#fff');
    }
  });
});
