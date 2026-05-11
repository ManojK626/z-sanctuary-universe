import { describe, expect, it, beforeEach } from 'vitest';
import { AUDIO_CONSENT_KEY, getAudioConsent, setAudioConsent } from './audioConsent.js';

function mockStorage() {
  /** @type {Record<string, string>} */
  const m = {};
  return {
    getItem: (k) => (k in m ? m[k] : null),
    setItem: (k, v) => {
      m[k] = v;
    },
    removeItem: (k) => {
      delete m[k];
    },
  };
}

describe('audioConsent', () => {
  let storage;

  beforeEach(() => {
    storage = mockStorage();
  });

  it('returns false when unset', () => {
    expect(getAudioConsent(storage)).toBe(false);
  });

  it('returns true when enabled', () => {
    setAudioConsent(true, storage);
    expect(getAudioConsent(storage)).toBe(true);
    expect(storage.getItem(AUDIO_CONSENT_KEY)).toBe('enabled');
  });

  it('clears when disabled', () => {
    setAudioConsent(true, storage);
    setAudioConsent(false, storage);
    expect(getAudioConsent(storage)).toBe(false);
    expect(storage.getItem(AUDIO_CONSENT_KEY)).toBeNull();
  });
});
