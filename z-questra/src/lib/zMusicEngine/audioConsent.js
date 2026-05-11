export const AUDIO_CONSENT_KEY = 'z-questra:z-sme-audio-consent-v1';

function getDefaultStorage() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * @param {Storage | null} [storage]
 */
export function getAudioConsent(storage) {
  const s = storage ?? getDefaultStorage();
  if (!s || typeof s.getItem !== 'function') return false;
  return s.getItem(AUDIO_CONSENT_KEY) === 'enabled';
}

/**
 * @param {boolean} enabled
 * @param {Storage | null} [storage]
 */
export function setAudioConsent(enabled, storage) {
  const s = storage ?? getDefaultStorage();
  if (!s || typeof s.setItem !== 'function') return;
  if (enabled) {
    s.setItem(AUDIO_CONSENT_KEY, 'enabled');
  } else if (typeof s.removeItem === 'function') {
    s.removeItem(AUDIO_CONSENT_KEY);
  } else {
    s.setItem(AUDIO_CONSENT_KEY, '');
  }
}
