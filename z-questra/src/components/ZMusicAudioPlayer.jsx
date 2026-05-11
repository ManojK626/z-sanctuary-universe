import React, { useEffect, useRef } from 'react';
import { appendMusicObserverEvent } from '../lib/zMusicEngine/memoryLog.js';

/**
 * @param {object} props
 * @param {boolean} props.consentEnabled
 * @param {{ id: string, title: string, mode: string, energy: number } | null} props.activeTrack
 * @param {import('../lib/zMusicEngine/audioSources.js').ZSmeAudioSource | null} props.audioSource
 * @param {'kids' | 'teens' | 'adults' | 'enterprise'} props.ageMode
 */
export default function ZMusicAudioPlayer({ consentEnabled, activeTrack, audioSource, ageMode }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !consentEnabled) return;
    try {
      el.pause();
      el.removeAttribute('src');
      el.load();
    } catch {
      /* ignore */
    }
  }, [activeTrack?.id, consentEnabled]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !consentEnabled || !audioSource?.audioUrl) return;
    el.src = audioSource.audioUrl;
    el.load();
  }, [activeTrack?.id, audioSource?.audioUrl, consentEnabled]);

  if (!consentEnabled) return null;

  const hasUrl = !!(audioSource && typeof audioSource.audioUrl === 'string' && audioSource.audioUrl.trim().length > 0);

  return (
    <div className="zq-music-player" aria-label="Audio player">
      {ageMode === 'kids' ? (
        <p className="zq-music-player-kids">Kids mode: keep volume low. No intense surprises — guardian defaults stay on.</p>
      ) : null}

      {activeTrack && audioSource ? (
        <>
          <div className="zq-music-player-meta">
            <strong>{audioSource.title}</strong>
            <span className="zq-music-player-seed">Playlist row: {activeTrack.title}</span>
            <span className="zq-music-player-source">
              Source: <strong>{audioSource.sourceType}</strong> — {audioSource.sourceLabel}
            </span>
            <span className="zq-music-player-intensity">Intensity label: {audioSource.intensity}</span>
          </div>
          {hasUrl ? (
            <audio
              ref={ref}
              className="zq-music-audio-el"
              controls
              preload="none"
              playsInline
              onPlay={() => {
                appendMusicObserverEvent('z_music_play_started', {
                  trackId: activeTrack.id,
                  audioSourceId: audioSource.trackId,
                  consent: true,
                  playback: 'html_audio_element',
                });
              }}
            />
          ) : (
            <p className="zq-music-player-missing">
              Audio source not attached yet. You can still use <strong>Log play intent</strong> below — no hidden
              playback.
            </p>
          )}
        </>
      ) : (
        <p className="zq-music-player-missing">Select a playlist row to see source metadata.</p>
      )}
    </div>
  );
}
