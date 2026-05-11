import Link from 'next/link';

const t = { minHeight: '100vh', color: '#e8f4ff', padding: '1.75rem 1.5rem 3rem', maxWidth: '46rem' };

export default function PrivacyPage() {
  return (
    <main style={t}>
      <h1 style={{ color: '#7dd3fc', marginTop: 0 }}>Privacy (baseline)</h1>
      <p style={{ lineHeight: 1.6, color: '#94a3b8' }}>
        The Z-Sanctuary web app is governed by the hub’s governance and your regional law. In this
        <strong> development slice</strong>, sign-in uses a server-issued <strong>signed, HTTP-only cookie
        </strong> when <code>ZS_WEB_AUTH=1</code> is set. An optional <code>zs_experience</code> cookie stores
        opt-in lane <strong>preference</strong> (not device telemetry) when you save the Experience profile. There
        is <strong>no</strong> third-party analytics in
        this page bundle by default. Production deployments must add a data‑processing statement, contact,
        retention rules, and regional notices before collecting personal data. Nothing here is medical or
        financial advice. Replace the dev token flow with an identity provider and staff-approved policies before
        go‑live.
      </p>
      <p style={{ marginTop: '1.25rem' }}>
        <Link href="/" style={{ color: '#5eead4' }}>
          Home
        </Link>
        {' · '}
        <Link href="/terms" style={{ color: '#5eead4' }}>
          Terms
        </Link>
      </p>
    </main>
  );
}
