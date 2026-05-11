'use client';

import { useCallback, useEffect, useState } from 'react';

const LS = 'zs_experience_v1';

const box = { maxWidth: '32rem' };

export function ExperienceForm() {
  const [consented, setConsented] = useState(false);
  const [primaryLane, setPrimaryLane] = useState('any');
  const [choices, setChoices] = useState([]);
  const [mode, setMode] = useState('loading');
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setMsg(null);
    try {
      const r = await fetch('/api/account/experience', { cache: 'no-store' });
      const j = await r.json();
      if (j?.choices) setChoices(j.choices);
      if (j?.mode === 'authed') {
        setMode('authed');
        setUser(j.user);
        setConsented(!!j.consented);
        setPrimaryLane(j.primaryLane || 'any');
        return;
      }
      setMode('guest');
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(LS) : null;
      if (raw) {
        const o = JSON.parse(raw);
        if (o && typeof o === 'object') {
          setConsented(!!o.consented);
          setPrimaryLane(String(o.primaryLane || 'any'));
        }
      }
    } catch (e) {
      setMode('guest');
      setMsg(String(e));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div style={box}>
      <p style={{ lineHeight: 1.55, color: '#94a3b8', fontSize: '0.92rem' }}>
        <strong>Opt-in only.</strong> This is a <strong>product-preference</strong> hint for the Sanctuary web UI
        (which lane to surface first in future flows). It is <strong>not</strong> a contract with Apple, Google,
        Samsung, or Microsoft, and it does <strong>not</strong> share data with them. Replace with a proper
        preference store and DPA when you have real accounts.
      </p>
      {mode === 'loading' ? <p style={{ color: '#94a3b8' }}>Loading…</p> : null}
      {mode === 'authed' ? (
        <p style={{ color: '#a5b4fc', fontSize: '0.9rem' }}>
          Signed in as <strong>{user}</strong> — saving updates a signed <code>zs_experience</code> cookie.
        </p>
      ) : mode === 'guest' ? (
        <p style={{ color: '#fbbf24', fontSize: '0.9rem' }}>
          <strong>Guest / gate off</strong> — values save only in this browser (localStorage) until you use sign-in
          with <code>ZS_WEB_AUTH=1</code>.
        </p>
      ) : null}
      {msg ? (
        <p style={{ color: /Saved|cookie|localStorage/.test(msg) ? '#86efac' : '#fca5a5' }} role="status">
          {msg}
        </p>
      ) : null}
      {mode === 'loading' ? null : (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setMsg(null);
          try {
            if (mode === 'authed') {
              const r = await fetch('/api/account/experience', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ consented, primaryLane }),
              });
              const j = await r.json();
              if (!r.ok) throw new Error(j.error || r.status);
              setMsg('Saved to account session (cookie).');
              return;
            }
            localStorage.setItem(LS, JSON.stringify({ consented, primaryLane, t: Date.now() }));
            setMsg('Saved on this device only (localStorage).');
          } catch (x) {
            setMsg(String(x));
          } finally {
            setBusy(false);
          }
        }}
        style={{ display: 'grid', gap: '1rem', marginTop: '1.25rem' }}
      >
        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={consented}
            onChange={(e) => setConsented(e.target.checked)}
            style={{ marginTop: '0.2rem' }}
          />
          <span style={{ lineHeight: 1.4 }}>
            I understand this is an in-app preference for Z-Sanctuary only, not OEM or store integration.
          </span>
        </label>
        <label style={{ display: 'grid', gap: '0.35rem' }}>
          <span>Default lane (illustration / UI ordering)</span>
          <select
            value={primaryLane}
            onChange={(e) => setPrimaryLane(e.target.value)}
            style={{
              padding: '0.5rem 0.65rem',
              borderRadius: 6,
              border: '1px solid #334',
              background: '#0a1020',
              color: '#e8f4ff',
            }}
          >
            {(choices.length
              ? choices
              : [
                  { value: 'any', label: '…' },
                  { value: 'ios', label: '…' },
                  { value: 'android', label: '…' },
                  { value: 'windows', label: '…' },
                  { value: 'neutral', label: '…' },
                ]
            ).map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={busy}
          style={{
            padding: '0.6rem 1rem',
            borderRadius: 8,
            border: 'none',
            background: 'linear-gradient(180deg, #0d9488, #0f766e)',
            color: '#ecfdf5',
            fontWeight: 600,
            cursor: busy ? 'wait' : 'pointer',
            maxWidth: '14rem',
          }}
        >
          {busy ? '…' : 'Save preference'}
        </button>
      </form>
      )}
    </div>
  );
}
