import { describe, expect, it } from 'vitest';
import { filterOutput } from './filterOutput.js';

describe('filterOutput', () => {
  it('passes through normal notebook text and highlight markup', () => {
    expect(filterOutput('Hello [[gold]]world[[/gold]]')).toBe('Hello [[gold]]world[[/gold]]');
  });

  it('neutralizes script-like fragments', () => {
    expect(filterOutput('<script>alert(1)</script>hi')).toContain('[removed]');
    expect(filterOutput('onclick=alert(1)')).not.toContain('onclick');
  });

  it('truncates very long strings', () => {
    const long = 'a'.repeat(60_000);
    expect(filterOutput(long).length).toBeLessThan(long.length);
    expect(filterOutput(long)).toContain('…');
  });
});
