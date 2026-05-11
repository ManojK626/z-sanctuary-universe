'use client';

import { useState } from 'react';

const intro =
  'MirrorSoul — emotional interface for the hub. Entry + reflect; optional validation; adaptive fuel (no raw text in learning strip). No auto-decisions.';
const localDataWarning =
  'This controls local MirrorSoul data in this workspace. It may not delete backups, exported files, or future cloud copies.';

export default function MirrorSoulPage() {
  const [text, setText] = useState('');
  const [user, setUser] = useState('amk');
  const [emotion, setEmotion] = useState('');
  const [intensity, setIntensity] = useState('');
  const [out, setOut] = useState(null);
  const [err, setErr] = useState(null);
  const [load, setLoad] = useState(false);
  const [history, setHistory] = useState(null);
  const [zes, setZes] = useState(null);
  const [vMsg, setVMsg] = useState(null);
  const [vNotes, setVNotes] = useState('');

  function buildBody() {
    const b = { text, user_id: user };
    if (emotion.trim()) b.emotion = emotion.trim();
    if (intensity !== '' && !Number.isNaN(Number(intensity))) {
      b.intensity = Math.max(0, Math.min(1, Number(intensity)));
    }
    return b;
  }

  async function submit() {
    setLoad(true);
    setErr(null);
    setOut(null);
    setVMsg(null);
    try {
      const body = buildBody();
      const r0 = await fetch('/api/mirrorsoul/entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!r0.ok) {
        const j0 = await r0.json();
        throw new Error(j0.error || j0.message || r0.status);
      }
      const r1 = await fetch('/api/mirrorsoul/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const j1 = await r1.json();
      if (!r1.ok) throw new Error(j1.error || j1.message || r1.status);
      setOut(j1);
    } catch (e) {
      setErr(e?.message || String(e));
    } finally {
      setLoad(false);
    }
  }

  async function loadHistory() {
    setErr(null);
    try {
      const r = await fetch(
        `/api/mirrorsoul/history?user_id=${encodeURIComponent(user)}&limit=20`,
        { cache: 'no-store' }
      );
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || r.status);
      setHistory(j.entries);
    } catch (e) {
      setErr(e?.message || String(e));
    }
  }

  async function loadZes() {
    setErr(null);
    try {
      const r = await fetch(`/api/zes/${encodeURIComponent(user)}`, { cache: 'no-store' });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || r.status);
      setZes(j.zes || null);
    } catch (e) {
      setErr(e?.message || String(e));
    }
  }

  async function syncZes() {
    setErr(null);
    try {
      const r = await fetch('/api/mirrorsoul/zes-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || j.message || r.status);
      setZes(j.zes || null);
    } catch (e) {
      setErr(e?.message || String(e));
    }
  }

  async function exportBundle() {
    setErr(null);
    try {
      const r = await fetch(`/api/mirrorsoul/export?user_id=${encodeURIComponent(user)}`, {
        cache: 'no-store',
      });
      const txt = await r.text();
      if (!r.ok) throw new Error(txt || r.status);
      const blob = new Blob([txt], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      a.href = url;
      a.download = `mirrorsoul_export_${user}_${stamp}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setErr(e?.message || String(e));
    }
  }

  async function deleteUserData() {
    const ok = window.confirm(
      `Delete local MirrorSoul entries/reflections for user "${user}" in this workspace? This cannot be undone here. ${localDataWarning}`
    );
    if (!ok) return;
    setErr(null);
    try {
      const r = await fetch('/api/mirrorsoul/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user, confirm: true }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || j.message || r.status);
      setVMsg(
        `Deleted local rows: entries=${j?.removed?.entries ?? 0}, reflections=${j?.removed?.reflections ?? 0}.`
      );
      setHistory(null);
      setZes(null);
    } catch (e) {
      setErr(e?.message || String(e));
    }
  }

  async function submitValidation(outcome) {
    if (!out?.prediction_id) return;
    setVMsg(null);
    try {
      const r = await fetch('/api/mirrorsoul/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prediction_id: out.prediction_id,
          outcome,
          notes: vNotes.trim() || undefined,
          actor: `ui:${user}`,
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || j.message);
      setVMsg(`Logged: ${outcome} (resolution id in hub log).`);
    } catch (e) {
      setErr(e?.message || String(e));
    }
  }

  return (
    <main
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '2rem 1rem',
        fontFamily: 'system-ui, sans-serif',
        lineHeight: 1.5,
        color: '#e8eef5',
        minHeight: '100vh',
        background: 'radial-gradient(1200px 800px at 50% -20%, #1a2744 0%, #0b0d12 55%)',
      }}
    >
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>MirrorSoul</h1>
      <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>{intro}</p>
      <p style={{ opacity: 0.85, fontSize: '0.82rem', marginTop: '0.45rem' }}>{localDataWarning}</p>
      <label style={{ display: 'block', marginTop: '1.25rem', fontSize: '0.85rem' }}>
        User id (local label)
        <input
          value={user}
          onChange={(e) => setUser(e.target.value)}
          style={{ display: 'block', width: '100%', marginTop: 6, padding: '0.5rem 0.6rem', borderRadius: 6, border: '1px solid #2a3a5c', background: '#11161f', color: '#e8eef5' }}
        />
      </label>
      <label style={{ display: 'block', marginTop: '0.75rem', fontSize: '0.85rem' }}>
        Emotion label (optional, e.g. conflicted)
        <input
          value={emotion}
          onChange={(e) => setEmotion(e.target.value)}
          placeholder="optional"
          style={{ display: 'block', width: '100%', marginTop: 6, padding: '0.5rem 0.6rem', borderRadius: 6, border: '1px solid #2a3a5c', background: '#11161f', color: '#e8eef5' }}
        />
      </label>
      <label style={{ display: 'block', marginTop: '0.75rem', fontSize: '0.85rem' }}>
        Intensity 0–1 (optional)
        <input
          value={intensity}
          onChange={(e) => setIntensity(e.target.value)}
          placeholder="0.0 – 1.0"
          style={{ display: 'block', width: '100%', marginTop: 6, padding: '0.5rem 0.6rem', borderRadius: 6, border: '1px solid #2a3a5c', background: '#11161f', color: '#e8eef5' }}
        />
      </label>
      <label style={{ display: 'block', marginTop: '0.9rem', fontSize: '0.85rem' }}>
        Your words
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          style={{
            display: 'block',
            width: '100%',
            marginTop: 6,
            padding: '0.6rem 0.65rem',
            borderRadius: 6,
            border: '1px solid #2a3a5c',
            background: '#11161f',
            color: '#e8eef5',
            fontSize: '0.95rem',
            resize: 'vertical',
          }}
        />
      </label>
      <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button
          type="button"
          onClick={submit}
          disabled={load || !text.trim()}
          style={btnStyle(load || !text.trim(), true)}
        >
          {load ? 'Reflecting…' : 'Send to Mirror'}
        </button>
        <button type="button" onClick={loadHistory} style={btnStyle(false, false)}>Load history (entries)</button>
        <button type="button" onClick={loadZes} style={btnStyle(false, false)}>Load ZES stub</button>
        <button type="button" onClick={syncZes} style={btnStyle(false, false)}>Sync ZES from entries</button>
        <button type="button" onClick={exportBundle} style={btnStyle(false, false)}>Export JSON</button>
        <button type="button" onClick={deleteUserData} style={btnStyle(false, false)}>Delete local data</button>
      </div>
      {err && (
        <pre style={{ marginTop: '1rem', color: '#f88', whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
          {err}
        </pre>
      )}
      {out && (
        <section style={{ marginTop: '1.5rem' }}>
          <h2 style={{ fontSize: '1.05rem' }}>Reflection (advisory)</h2>
          <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>prediction_id: {out.prediction_id || out.id}</p>
          <p style={{ fontSize: '0.95rem', opacity: 0.95, whiteSpace: 'pre-wrap' }}>{out.reflection}</p>
          {out.signals && (
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Signals: {out.signals.join(', ')} · conf {out.confidence != null ? out.confidence.toFixed(2) : '—'}
            </p>
          )}
          {out.suggestion && (
            <p style={{ fontSize: '0.85rem', marginTop: '0.4rem' }}>Suggestion: {out.suggestion}</p>
          )}
          <p style={{ fontSize: '0.8rem', marginTop: '1rem', opacity: 0.85 }}>How did this feel vs reality? (optional, closes the validation loop; hub log only)</p>
          <input
            value={vNotes}
            onChange={(e) => setVNotes(e.target.value)}
            placeholder="Short note (optional)"
            style={{ display: 'block', width: '100%', marginTop: 4, marginBottom: 8, padding: '0.45rem 0.5rem', borderRadius: 6, border: '1px solid #2a3a5c', background: '#11161f', color: '#e8eef5', fontSize: '0.85rem' }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <button type="button" onClick={() => submitValidation('aligned')} style={btnStyle(false, false)}>Aligned</button>
            <button type="button" onClick={() => submitValidation('divergent')} style={btnStyle(false, false)}>Divergent</button>
            <button type="button" onClick={() => submitValidation('abstain')} style={btnStyle(false, false)}>Abstain</button>
          </div>
          {vMsg && <p style={{ fontSize: '0.85rem', marginTop: 8, color: '#7dcea0' }}>{vMsg}</p>}
        </section>
      )}
      {history != null && (
        <section style={{ marginTop: '1.5rem' }}>
          <h2 style={{ fontSize: '1.05rem' }}>Recent entry lines (local)</h2>
          <pre style={{ fontSize: '0.75rem', opacity: 0.9, overflow: 'auto', maxHeight: 240, background: '#0a0c12', padding: 12, borderRadius: 6 }}>
            {JSON.stringify(history, null, 2)}
          </pre>
        </section>
      )}
      {zes != null && (
        <section style={{ marginTop: '1.5rem' }}>
          <h2 style={{ fontSize: '1.05rem' }}>ZES trust stub (advisory)</h2>
          <pre style={{ fontSize: '0.75rem', opacity: 0.9, overflow: 'auto', maxHeight: 240, background: '#0a0c12', padding: 12, borderRadius: 6 }}>
            {JSON.stringify(zes, null, 2)}
          </pre>
        </section>
      )}
    </main>
  );
}

function btnStyle(disabled, primary) {
  return {
    padding: '0.5rem 0.9rem',
    borderRadius: 6,
    border: '1px solid ' + (primary ? '#3d5a8a' : '#3a3f55'),
    background: disabled ? '#1e2a3f' : primary ? 'linear-gradient(90deg, #1e3a5f, #1a2f4d)' : '#1a1f2e',
    color: '#e8eef5',
    cursor: disabled ? 'not-allowed' : 'pointer',
  };
}
