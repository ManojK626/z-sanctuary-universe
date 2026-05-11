'use client';

import Link from 'next/link';
import { useState } from 'react';

const box = { maxWidth: '40rem' };

export default function ZunoFlowPage() {
  const [user, setUser] = useState('amk');
  const [note, setNote] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [view, setView] = useState(null);
  const [err, setErr] = useState(null);
  const [load, setLoad] = useState(false);
  const [anx, setAnx] = useState({ g1: 0, g2: 0, g3: 0, g4: 0, g5: 0, g6: 0, g7: 0 });

  const activate = async () => {
    setLoad(true);
    setErr(null);
    try {
      const r = await fetch('/api/zuno/flow/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user, mirrorsoul_note: note }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || r.status);
      setSessionId(j.sessionId);
      setView(j);
    } catch (e) {
      setErr(e?.message || String(e));
    } finally {
      setLoad(false);
    }
  };

  const next = async () => {
    if (!sessionId) return;
    setLoad(true);
    setErr(null);
    try {
      const r = await fetch(`/api/zuno/flow/${encodeURIComponent(sessionId)}/next`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || j.message || r.status);
      setView(j);
    } catch (e) {
      setErr(e?.message || String(e));
    } finally {
      setLoad(false);
    }
  };

  const saveAnxiety = async () => {
    if (!sessionId) return;
    setLoad(true);
    setErr(null);
    try {
      const r = await fetch(`/api/zuno/flow/${encodeURIComponent(sessionId)}/anxiety`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(anx),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || j.message || r.status);
      setView(j);
    } catch (e) {
      setErr(e?.message || String(e));
    } finally {
      setLoad(false);
    }
  };

  const p = view?.currentPhase;
  const isAnx = p?.id === 'anxiety_profile_scientific';

  return (
    <main
      className="sanctuary-focus-column"
      style={{
        minHeight: '100vh',
        background: '#0a0e27',
        color: '#e8f4ff',
        padding: '1.5rem 1.5rem 3rem',
      }}
    >
      <div style={box}>
        <h1 style={{ marginTop: 0, color: '#2dd4bf' }}>Zuno — transformation flow</h1>
        <p style={{ color: '#8ab4d8', lineHeight: 1.5, fontSize: '0.9rem' }}>
          Phased core: experience + knowledge, advisory only. The scientific step is a{' '}
          <strong>structured 7-item self-report</strong> (0–3 each) — <strong>not a diagnosis</strong>. Crisis: use real
          emergency and professional care.
        </p>
        <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
          <Link href="/continuation" style={{ color: '#7dd3fc' }}>
            Continuation manifest
          </Link>
          {' · '}
          <Link href="/mirrorsoul" style={{ color: '#7dd3fc' }}>
            MirrorSoul
          </Link>
        </p>

        {!sessionId ? (
          <div style={{ marginTop: '1.25rem' }}>
            <label style={{ display: 'block', color: '#a0e4cb', fontSize: '0.88rem' }}>User id (stub)</label>
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              style={{
                width: '100%',
                maxWidth: 240,
                marginBottom: '0.75rem',
                padding: '0.4rem 0.5rem',
                borderRadius: 8,
                border: '1px solid #334',
                background: '#111a2e',
                color: '#eee',
              }}
            />
            <label style={{ display: 'block', color: '#a0e4cb', fontSize: '0.88rem' }}>
              Optional note (future MirrorSoul handoff, max 2k chars)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              style={{
                width: '100%',
                maxWidth: '100%',
                marginBottom: '0.75rem',
                padding: '0.4rem 0.5rem',
                borderRadius: 8,
                border: '1px solid #334',
                background: '#111a2e',
                color: '#eee',
                fontSize: '0.85rem',
              }}
            />
            <button
              type="button"
              onClick={activate}
              disabled={load}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: 10,
                border: 'none',
                background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                color: '#fff',
                fontWeight: 600,
                cursor: load ? 'wait' : 'pointer',
              }}
            >
              Zuno, activate the transformation flow
            </button>
          </div>
        ) : null}

        {err ? <p style={{ color: '#fca5a5', marginTop: '1rem' }}>{err}</p> : null}

        {view && p ? (
          <section
            style={{
              marginTop: '1.5rem',
              padding: '1rem 1.1rem',
              borderRadius: 12,
              background: 'rgba(15, 32, 52, 0.9)',
              border: '1px solid rgba(45, 211, 191, 0.3)',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Phase {view.phaseIndex + 1} / {view.totalPhases} · {p.title}
            </div>
            <p style={{ color: '#5eead4', fontSize: '1.05rem', fontWeight: 600, margin: '0.4rem 0' }}>{p.zunoCall}</p>
            <p style={{ color: '#cbd5e1', fontSize: '0.88rem' }}>
              <strong>Experience:</strong> {p.experience}
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.86rem' }}>
              <strong>Knowledge:</strong> {p.knowledge}
            </p>
            {view.nextCue ? (
              <p style={{ color: '#a78bfa', fontSize: '0.8rem' }}>Next cue: {view.nextCue}</p>
            ) : null}
            <p style={{ fontSize: '0.72rem', color: '#475569', marginTop: '0.75rem' }}>Session: {sessionId}</p>

            {isAnx ? (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ color: '#fca5a5', fontSize: '0.82rem' }}>{view.disclaimer}</p>
                {(view.anxietyLabels || []).map((label, i) => {
                  const k = `g${i + 1}`;
                  return (
                    <div key={k} style={{ marginBottom: '0.5rem' }}>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: 2 }}>{label}</div>
                      <select
                        value={anx[k]}
                        onChange={(e) => setAnx((o) => ({ ...o, [k]: Number(e.target.value) }))}
                        style={{ padding: 4, borderRadius: 6, background: '#0f172a', color: '#e2e8f0' }}
                      >
                        <option value={0}>0 — not at all</option>
                        <option value={1}>1 — several days</option>
                        <option value={2}>2 — more than half the days</option>
                        <option value={3}>3 — nearly every day</option>
                      </select>
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={saveAnxiety}
                  disabled={load}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.45rem 0.9rem',
                    borderRadius: 8,
                    border: '1px solid #0f766e',
                    background: '#134e4a',
                    color: '#ecfdf5',
                    cursor: load ? 'wait' : 'pointer',
                  }}
                >
                  Save profile (this phase)
                </button>
              </div>
            ) : null}

            {view.anxiety?.sum != null && p.id === 'diagnostic' ? (
              <p style={{ color: '#fbbf24', fontSize: '0.9rem' }}>
                Recorded sum: {view.anxiety.sum} / 21 — band: {view.anxiety.band?.label} (self-report, not a diagnosis)
              </p>
            ) : null}

            <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {isAnx && (!view.anxiety || view.anxiety.sum == null) ? null : (
                <button
                  type="button"
                  onClick={next}
                  disabled={load || !view.canAdvance}
                  style={{
                    padding: '0.5rem 0.9rem',
                    borderRadius: 8,
                    border: '1px solid #0e7490',
                    background: view.canAdvance ? '#155e75' : '#334155',
                    color: view.canAdvance ? '#fff' : '#94a3b8',
                    cursor: !view.canAdvance || load ? 'not-allowed' : 'pointer',
                  }}
                >
                  {view.atLastPhase && p?.id === 'final_integration'
                    ? 'ZUNO FINAL INTEGRATION — flow complete for this run'
                    : isAnx
                      ? 'Continue the flow (after profile saved)'
                      : 'Continue the flow / next phase'}
                </button>
              )}
            </div>
            {view.atLastPhase && p?.id === 'final_integration' ? (
              <button
                type="button"
                onClick={() => {
                  setSessionId(null);
                  setView(null);
                  setErr(null);
                }}
                style={{
                  marginTop: '0.75rem',
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.85rem',
                  borderRadius: 8,
                  border: '1px solid #444',
                  background: 'transparent',
                  color: '#94a3b8',
                  cursor: 'pointer',
                }}
              >
                New run (activate again)
              </button>
            ) : null}
          </section>
        ) : null}
      </div>
    </main>
  );
}
