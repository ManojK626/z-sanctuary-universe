import React from 'react';
import { getAudioConsent, setAudioConsent } from '../lib/zMusicEngine/audioConsent.js';
import { appendMusicObserverEvent } from '../lib/zMusicEngine/memoryLog.js';

/**
 * @param {object} props
 * @param {(enabled: boolean) => void} props.onConsentChange
 */
export default function ZMusicAudioConsent({ onConsentChange }) {
  const enabled = getAudioConsent();

  function enable() {
    setAudioConsent(true);
    appendMusicObserverEvent('z_music_feedback', { kind: 'audio_consent', enabled: true });
    onConsentChange(true);
    try {
      const ev = new CustomEvent('z-sme-audio-consent', { detail: { enabled: true } });
      window.dispatchEvent(ev);
    } catch {
      /* ignore */
    }
  }

  function disable() {
    setAudioConsent(false);
    appendMusicObserverEvent('z_music_feedback', { kind: 'audio_consent', enabled: false });
    onConsentChange(false);
    try {
      const ev = new CustomEvent('z-sme-audio-consent', { detail: { enabled: false } });
      window.dispatchEvent(ev);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="zq-music-consent" role="region" aria-label="Audio playback consent">
      {!enabled ? (
        <>
          <p className="zq-music-consent-lead">
            <strong>Audio is off by default.</strong> No autoplay. Sources are shown before playback. Consent is stored
            only on this device.
          </p>
          <button type="button" className="zq-music-consent-enable" onClick={enable}>
            Enable audio playback
          </button>
        </>
      ) : (
        <>
          <p className="zq-music-consent-lead">
            <strong>Audio playback enabled</strong> (local only). You can turn it off anytime.
          </p>
          <button type="button" className="zq-music-consent-disable" onClick={disable}>
            Disable audio
          </button>
        </>
      )}
    </div>
  );
}
