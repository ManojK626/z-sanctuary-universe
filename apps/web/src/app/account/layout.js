import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  COOKIE,
  readSessionValue,
  authGateConfigured,
  isSecretReady,
} from '../../lib/zs_web_session.js';

function safeNext(s) {
  if (!s || typeof s !== 'string') return '/account';
  if (!s.startsWith('/') || s.startsWith('//')) return '/account';
  return s.slice(0, 512);
}

export default function AccountLayout({ children }) {
  if (!authGateConfigured()) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <p
          style={{
            margin: 0,
            padding: '0.75rem 1.25rem',
            background: 'rgba(34, 197, 94, 0.12)',
            color: '#bbf7d0',
            fontSize: '0.9rem',
            borderBottom: '1px solid rgba(34, 197, 94, 0.35)',
          }}
        >
          <strong>Session gate off.</strong> Set <code style={{ color: '#a7f3d0' }}>ZS_WEB_AUTH=1</code> plus
          secrets (see <code>apps/web/.env.example</code>) to test sign-in.
        </p>
        {children}
      </div>
    );
  }
  if (!isSecretReady()) {
    return (
      <div style={{ minHeight: '100vh', color: '#fecaca', padding: '1.25rem' }}>
        <p>
          <strong>Auth is on</strong> but the server is missing a valid{' '}
          <code>ZS_SESSION_SECRET</code> (32+ chars) and/or <code>ZS_WEB_LOGIN_TOKEN</code> (16+ chars).
        </p>
        {children}
      </div>
    );
  }
  const cookie = cookies().get(COOKIE);
  const s = readSessionValue(cookie?.value);
  if (!s) {
    const next = safeNext('/account');
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }
  return <>{children}</>;
}
