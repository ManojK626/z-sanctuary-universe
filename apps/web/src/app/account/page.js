import { cookies } from 'next/headers';
import Link from 'next/link';
import { COOKIE, readSessionValue, authGateConfigured } from '../../lib/zs_web_session.js';
import { LogoutButton } from './LogoutButton.jsx';

const box = {
  minHeight: '100vh',
  color: '#e8f4ff',
  padding: '1.75rem 1.5rem 3rem',
  maxWidth: '36rem',
};

export default function AccountPage() {
  const c = cookies().get(COOKIE);
  const s = readSessionValue(c?.value);
  const gate = authGateConfigured();

  if (!gate) {
    return (
      <main style={box}>
        <h1 style={{ color: '#11d6c2', marginTop: 0 }}>Account (public preview)</h1>
        <p style={{ lineHeight: 1.55, color: '#94a3b8' }}>
          The session gate is <strong>off</strong>. Turn on <code>ZS_WEB_AUTH=1</code> and set secrets in{' '}
          <code>apps/web/.env.local</code> to practice the same sign-in flow you will use for the web-first
          product surface.
        </p>
        <p style={{ marginTop: '1.25rem' }}>
          <Link href="/account/experience" style={{ color: '#c4b5fd' }}>
            Experience profile
          </Link>
          {' · '}
          <Link href="/login" style={{ color: '#5eead4' }}>
            Open login
          </Link>
          {' · '}
          <Link href="/" style={{ color: '#7dd3fc' }}>
            Home
          </Link>
        </p>
      </main>
    );
  }
  if (!s) {
    return (
      <main style={box}>
        <h1 style={{ color: '#fda4af', marginTop: 0 }}>Session not available</h1>
        <p style={{ lineHeight: 1.5, color: '#94a3b8' }}>
          If the server is still misconfigured, set secrets in <code>.env.local</code> (see{' '}
          <code>apps/web/.env.example</code>) or <Link href="/login">go to sign-in</Link>.
        </p>
      </main>
    );
  }
  return (
    <main style={box}>
      <h1 style={{ color: '#11d6c2', marginTop: 0 }}>Signed in</h1>
      <p style={{ lineHeight: 1.55 }}>
        <strong>Label:</strong> {s.u}
      </p>
      <p style={{ lineHeight: 1.5, color: '#94a3b8', fontSize: '0.92rem' }}>
        This is a <strong>dev</strong> shared-token + signed cookie. Swap for OAuth2/OIDC and a real user store
        before production. Privacy and terms:{' '}
        <Link href="/privacy" style={{ color: '#7dd3fc' }}>
          /privacy
        </Link>
        ,{' '}
        <Link href="/terms" style={{ color: '#7dd3fc' }}>
          /terms
        </Link>
        .
      </p>
      <p style={{ marginTop: '1.15rem' }}>
        <Link href="/account/experience" style={{ color: '#c4b5fd' }}>
          Experience profile (lane preference)
        </Link>
      </p>
      <div style={{ marginTop: '1.5rem' }}>
        <LogoutButton />
      </div>
    </main>
  );
}
