'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useMemo } from 'react';

const wrap = {
  minHeight: '100vh',
  color: '#e8f4ff',
  padding: '1.75rem 1.5rem 3rem',
  maxWidth: '28rem',
};

function safeNext(s) {
  if (!s || typeof s !== 'string') return '/account';
  if (!s.startsWith('/') || s.startsWith('//')) return '/account';
  return s.slice(0, 512);
}

export default function LoginPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const next = useMemo(() => safeNext(sp.get('next')), [sp]);
  const [token, setToken] = useState('');
  const [userLabel, setUserLabel] = useState('friend');
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  return (
    <main style={wrap}>
      <h1 style={{ color: '#5eead4', marginTop: 0 }}>Sign in (dev token)</h1>
      <p style={{ lineHeight: 1.5, color: '#94a3b8', fontSize: '0.92rem' }}>
        Set <code>ZS_WEB_AUTH=1</code>, <code>ZS_SESSION_SECRET</code> (32+), and <code>ZS_WEB_LOGIN_TOKEN</code>{' '}
        (16+) in <code>.env.local</code>. Replace with a real IdP for production.{' '}
        <Link href="/privacy" style={{ color: '#7dd3fc' }}>
          Privacy
        </Link>
        ,{' '}
        <Link href="/terms" style={{ color: '#7dd3fc' }}>
          Terms
        </Link>
        .
      </p>
      {err ? (
        <p style={{ color: '#fca5a5', fontSize: '0.9rem' }} role="alert">
          {err}
        </p>
      ) : null}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setErr(null);
          setBusy(true);
          try {
            const r = await fetch('/api/auth/dev-session', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ token, userLabel }),
            });
            const j = await r.json().catch(() => ({}));
            if (!r.ok) {
              setErr(j.hint || j.error || r.status);
              return;
            }
            router.push(next);
            router.refresh();
          } catch (x) {
            setErr(String(x));
          } finally {
            setBusy(false);
          }
        }}
        style={{ display: 'grid', gap: '0.85rem', marginTop: '1rem' }}
      >
        <label style={{ display: 'grid', gap: '0.35rem', fontSize: '0.9rem' }}>
          <span>Display name</span>
          <input
            value={userLabel}
            onChange={(e) => setUserLabel(e.target.value)}
            autoComplete="username"
            style={{ padding: '0.5rem 0.65rem', borderRadius: 6, border: '1px solid #334', background: '#0a1020', color: '#e8f4ff' }}
          />
        </label>
        <label style={{ display: 'grid', gap: '0.35rem', fontSize: '0.9rem' }}>
          <span>Login token (matches ZS_WEB_LOGIN_TOKEN)</span>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            autoComplete="current-password"
            style={{ padding: '0.5rem 0.65rem', borderRadius: 6, border: '1px solid #334', background: '#0a1020', color: '#e8f4ff' }}
          />
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
          }}
        >
          {busy ? '…' : 'Sign in'}
        </button>
      </form>
      <p style={{ marginTop: '1.5rem' }}>
        <Link href={next || '/account'} style={{ color: '#7dd3fc' }}>
          Continue to account (if already signed in)
        </Link>
        {' · '}
        <Link href="/" style={{ color: '#7dd3fc' }}>
          Home
        </Link>
      </p>
    </main>
  );
}
