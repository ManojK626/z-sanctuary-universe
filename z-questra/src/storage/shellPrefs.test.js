import { describe, expect, it, beforeEach, vi } from 'vitest';
import { clearShellPrefs, readShellPrefs, SHELL_PREFS_KEY, writeShellPrefs } from './shellPrefs.js';

describe('shellPrefs', () => {
  beforeEach(() => {
    const store = {};
    vi.stubGlobal('localStorage', {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => {
        store[k] = String(v);
      },
      removeItem: (k) => {
        delete store[k];
      },
    });
  });

  it('round-trips remember flag, age, and comfort', () => {
    writeShellPrefs({
      remember: true,
      ageMode: 'kids',
      comfort: { textSize: 'large', contrast: 'calm' },
    });
    const r = readShellPrefs();
    expect(r.remember).toBe(true);
    expect(r.ageMode).toBe('kids');
    expect(r.comfort.textSize).toBe('large');
  });

  it('clearShellPrefs removes key', () => {
    writeShellPrefs({ remember: true, ageMode: 'adults', comfort: {} });
    clearShellPrefs();
    expect(readShellPrefs()).toBeNull();
  });

  it('ignores malformed JSON', () => {
    localStorage.setItem(SHELL_PREFS_KEY, '{');
    expect(readShellPrefs()).toBeNull();
  });
});
