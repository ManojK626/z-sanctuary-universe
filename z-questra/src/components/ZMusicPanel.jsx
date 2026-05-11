import React, { useEffect, useMemo, useState } from 'react';
import PanelFrame from './PanelFrame.jsx';
import { inferMode } from '../lib/zMusicEngine/moodModel.js';
import { buildDefaultPlaylist, explainTrack } from '../lib/zMusicEngine/playlistEngine.js';
import { appendMusicObserverEvent, readMusicObserverLog } from '../lib/zMusicEngine/memoryLog.js';
import { getAudioConsent } from '../lib/zMusicEngine/audioConsent.js';
import { getAudioSourceForSeedTrack } from '../lib/zMusicEngine/audioSources.js';
import ZMusicAudioConsent from './ZMusicAudioConsent.jsx';
import ZMusicAudioPlayer from './ZMusicAudioPlayer.jsx';
import './ZMusicPanel.css';

const CONTEXTS = /** @type {const} */ (['rest', 'training', 'reflection']);
const MODES = /** @type {const} */ (['alignment', 'power', 'journey']);

/**
 * @param {object} props
 * @param {'kids' | 'teens' | 'adults' | 'enterprise'} props.ageMode
 */
export default function ZMusicPanel({ ageMode }) {
  const [context, setContext] = useState('rest');
  const [userMode, setUserMode] = useState(null);
  const [activeTrackId, setActiveTrackId] = useState(null);
  const [logTick, setLogTick] = useState(0);
  const [audioConsent, setAudioConsent] = useState(() => getAudioConsent());

  const userExplicitPower = userMode === 'power';

  const effectiveMode = useMemo(
    () => inferMode({ userSelected: userMode || undefined, context, ageMode }),
    [userMode, context, ageMode],
  );

  const playlist = useMemo(
    () => buildDefaultPlaylist(effectiveMode, { ageMode, userExplicitPower, maxTracks: 6 }),
    [effectiveMode, ageMode, userExplicitPower],
  );

  useEffect(() => {
    setActiveTrackId((prev) => {
      if (prev && playlist.tracks.some((t) => t.id === prev)) return prev;
      return playlist.tracks[0]?.id ?? null;
    });
  }, [playlist.tracks, effectiveMode, context, userMode]);

  const activeTrack = playlist.tracks.find((t) => t.id === activeTrackId) || playlist.tracks[0] || null;

  const audioSource = useMemo(
    () => (activeTrack ? getAudioSourceForSeedTrack(activeTrack.id) : null),
    [activeTrack],
  );

  const trackExplanation = useMemo(() => {
    if (!activeTrack) return null;
    return explainTrack(activeTrack, effectiveMode, {
      signals: ['context', userMode ? 'user_mode_pill' : 'inferred_mode'],
    });
  }, [activeTrack, effectiveMode, userMode]);

  function onModePill(mode) {
    const next = userMode === mode ? null : mode;
    setUserMode(next);
    appendMusicObserverEvent('z_music_mode_selected', {
      mode: next || effectiveMode,
      context,
      explicitPill: next,
    });
    setLogTick((x) => x + 1);
  }

  function onContextChange(c) {
    setContext(c);
    appendMusicObserverEvent('z_music_mode_selected', {
      source: 'context',
      context: c,
      inferred: inferMode({ context: c, ageMode }),
    });
    setLogTick((x) => x + 1);
  }

  function onPlayIntent() {
    if (!activeTrack) return;
    appendMusicObserverEvent('z_music_play_started', {
      trackId: activeTrack.id,
      title: activeTrack.title,
      mode: effectiveMode,
      note: 'Intent log — HTML audio only runs after consent and when a URL is attached.',
    });
    setLogTick((x) => x + 1);
  }

  function onFeedback(kind) {
    appendMusicObserverEvent('z_music_feedback', { kind, trackId: activeTrack?.id, mode: effectiveMode });
    setLogTick((x) => x + 1);
  }

  function onTrainingIntent() {
    appendMusicObserverEvent('z_music_feedback', {
      kind: 'training_intent_copy',
      mode: effectiveMode,
      hint: 'Open Amk-Goku Commander from Z-Sanctuary dashboard when hub is available.',
    });
    setLogTick((x) => x + 1);
  }

  const recent = readMusicObserverLog().slice(-5);
  void logTick;

  return (
    <div className="zq-music-panel">
      <PanelFrame
        panelId="z-music-engine"
        title="Z-Sanctuary Music Engine (SME v1.1)"
        highlight="Opt-in audio + explainable playlist — local observer log only. No hub bridge. Not medical advice."
      >
        <p className="zq-music-disclaimer">
          <strong>Guardian:</strong> audio is <strong>off</strong> until you enable it. No autoplay. v1.1 can play real
          media only when a visible <code>audioUrl</code> is attached in the source catalog — otherwise you still get
          full explainability and intent logs. Match confidence is not a health metric.
        </p>

        <ZMusicAudioConsent onConsentChange={setAudioConsent} />

        <ZMusicAudioPlayer
          consentEnabled={audioConsent}
          activeTrack={activeTrack}
          audioSource={audioSource}
          ageMode={ageMode}
        />

        <div className="zq-music-context" role="group" aria-label="Activity context">
          <span>Context:</span>
          {CONTEXTS.map((c) => (
            <button
              key={c}
              type="button"
              className="zq-music-pill"
              aria-pressed={context === c}
              onClick={() => onContextChange(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="zq-music-pills" role="group" aria-label="Music mode">
          <span style={{ width: '100%', fontSize: '0.78rem', opacity: 0.85, marginBottom: '0.15rem' }}>
            Mode (tap to override inference; tap again to clear):
          </span>
          {MODES.map((m) => (
            <button
              key={m}
              type="button"
              className="zq-music-pill"
              aria-pressed={userMode === m}
              onClick={() => onModePill(m)}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="zq-music-now" aria-live="polite">
          <h4>Now playing (intent)</h4>
          {activeTrack ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                <strong>{activeTrack.title}</strong>
                <span style={{ fontSize: '0.78rem', opacity: 0.85 }}>
                  mode {activeTrack.mode} · energy {activeTrack.energy.toFixed(2)}
                </span>
              </div>
              <details style={{ marginTop: '0.45rem' }}>
                <summary>Why this track?</summary>
                {trackExplanation ? (
                  <ul style={{ margin: '0.35rem 0 0', paddingLeft: '1.1rem', fontSize: '0.82rem' }}>
                    <li>
                      <strong>What changed:</strong> {trackExplanation.what_changed}
                    </li>
                    <li>
                      <strong>Signals:</strong> {trackExplanation.signals_considered.join(', ')}
                    </li>
                    <li>
                      <strong>Reason:</strong> {trackExplanation.reason}
                    </li>
                    <li>
                      <strong>Confidence:</strong> {trackExplanation.confidence.toFixed(2)} (match, not medical)
                    </li>
                  </ul>
                ) : null}
              </details>
              <div style={{ marginTop: '0.45rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                <button type="button" className="zq-music-pill" onClick={onPlayIntent}>
                  Log play intent
                </button>
              </div>
            </>
          ) : (
            <p style={{ margin: 0, fontSize: '0.85rem' }}>No tracks for this filter — adjust mode or context.</p>
          )}
        </div>

        <div>
          <h4 style={{ margin: '0 0 0.35rem', fontSize: '0.95rem' }}>Playlist</h4>
          <p style={{ margin: '0 0 0.35rem', fontSize: '0.78rem', opacity: 0.85 }}>
            Inferred mode: <strong>{effectiveMode}</strong> · {playlist.explanation.reason}
          </p>
          <ul className="zq-music-list">
            {playlist.tracks.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setActiveTrackId(t.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    textAlign: 'left',
                    padding: 0,
                    font: 'inherit',
                    textDecoration: activeTrackId === t.id || (!activeTrackId && t === playlist.tracks[0]) ? 'underline' : 'none',
                  }}
                >
                  {t.title}
                </button>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{t.energy.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <details style={{ marginTop: '0.55rem' }}>
          <summary>Playlist-level explanation</summary>
          <ul style={{ margin: '0.35rem 0 0', paddingLeft: '1.1rem', fontSize: '0.82rem' }}>
            <li>
              <strong>What changed:</strong> {playlist.explanation.what_changed}
            </li>
            <li>
              <strong>Signals:</strong> {playlist.explanation.signals_considered.join(', ')}
            </li>
            <li>
              <strong>Reason:</strong> {playlist.explanation.reason}
            </li>
            <li>
              <strong>Confidence:</strong> {playlist.explanation.confidence.toFixed(2)}
            </li>
            {playlist.explanation.next_action ? (
              <li>
                <strong>Next (optional):</strong> {playlist.explanation.next_action}
              </li>
            ) : null}
          </ul>
        </details>

        <div className="zq-music-feedback" aria-label="Feedback">
          <span style={{ width: '100%', fontSize: '0.78rem', opacity: 0.85 }}>Feedback (local log only):</span>
          <button type="button" onClick={() => onFeedback('up')}>
            👍
          </button>
          <button type="button" onClick={() => onFeedback('down')}>
            👎
          </button>
          <button type="button" onClick={() => onFeedback('too_intense')}>
            too intense
          </button>
          <button type="button" onClick={() => onFeedback('too_slow')}>
            too slow
          </button>
        </div>

        <div className="zq-music-next">
          <button type="button" onClick={onTrainingIntent}>
            Log training intent (Amk-Goku link later)
          </button>
        </div>

        <div className="zq-music-log" aria-label="Recent observer events">
          <strong>Recent observer events:</strong>
          {recent.length === 0 ? (
            <div>None yet.</div>
          ) : (
            recent.map((e, i) => (
              <div key={`${e.createdAt}-${i}`}>
                {e.createdAt} — {e.type}
              </div>
            ))
          )}
        </div>
      </PanelFrame>
    </div>
  );
}
