import Link from 'next/link';
import dynamic from 'next/dynamic';
import { loadPcRootProjects } from 'z-sanctuary-core';
import ManifestClaimsScope from '../components/z-qosmei/ManifestClaimsScope.jsx';

/** R3F + drei must not execute during SSR / RSC prerender (Next 15+); load only on the client. */
const SKKRKPKOverlay = dynamic(() => import('../components/skk-rkpk/SKKRKPKOverlay.jsx'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        maxWidth: 520,
        border: '1px solid rgba(0, 212, 255, 0.35)',
        borderRadius: 12,
        padding: '1rem',
        background: 'rgba(10, 14, 39, 0.85)',
        color: '#8ab4d8',
        fontSize: '0.85rem',
      }}
    >
      Loading SKK + RKPK companion (WebGL)…
    </div>
  ),
});

export default function HomePage() {
  let hubProjectsLine = '';
  try {
    const reg = loadPcRootProjects();
    const names = Array.isArray(reg.projects) ? reg.projects.map((p) => p.name).filter(Boolean) : [];
    hubProjectsLine = names.length ? names.slice(0, 8).join(' · ') + (names.length > 8 ? ' …' : '') : '';
  } catch {
    hubProjectsLine = '';
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0a0e27', color: '#f0f0f0', padding: '2rem' }}>
      <h1 style={{ marginTop: 0 }}>Z-Sanctuary Governance Dashboard</h1>
      <p style={{ marginBottom: '1rem' }}>
        <Link
          href="/z-qosmei"
          style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #1a2a44, #0f2840)',
            color: '#ffd166',
            textDecoration: 'none',
            fontWeight: 600,
            border: '1px solid rgba(17,214,194,0.45)',
          }}
        >
          Open Z-QOSMEI (Quantum Omni-Swarm demo)
        </Link>
        <span style={{ marginLeft: '0.75rem', fontSize: '0.85rem', color: '#8ab4d8' }}>
          Vision shell + Three.js scene ·{' '}
          <a href="/api/z-qosmei/manifest" style={{ color: '#a0e4cb' }}>
            manifest JSON
          </a>
        </span>
      </p>
      <p style={{ color: '#a0e4cb' }}>
        SKK and RKPK are rendered as live governance companions, fed by the dashboard state API.
      </p>
      {hubProjectsLine ? (
        <p style={{ fontSize: '0.85rem', color: '#8ab4d8', marginBottom: '1.25rem', maxWidth: '52rem' }}>
          <strong style={{ color: '#c5e3ff' }}>Hub registry (z-sanctuary-core):</strong> {hubProjectsLine}
        </p>
      ) : null}
      <ManifestClaimsScope variant="home" />
      <SKKRKPKOverlay />
      <section
        className="sanctuary-focus-column"
        style={{
          marginTop: '1.5rem',
          border: '1px solid rgba(125, 211, 252, 0.25)',
          borderRadius: 12,
          padding: '1rem',
          background: 'rgba(10, 20, 40, 0.55)',
          maxWidth: 860,
        }}
      >
        <h2 style={{ marginTop: 0, color: '#c4b5fd' }}>Z-Stack Lite (current safe shell)</h2>
        <p style={{ color: '#93c5fd', marginTop: '0.2rem' }}>
          Build-now focus: Safety Core + MirrorSoul. Platform-expansion modules stay in gate docs until promoted.
        </p>
        <p style={{ marginBottom: 0 }}>
          <Link href="/safety" style={{ color: '#7dd3fc', marginRight: '0.8rem' }}>
            Safety Core v1.7
          </Link>
          <Link href="/z-stack-lite" style={{ color: '#c4b5fd', marginRight: '0.8rem' }}>
            Z-Stack Lite
          </Link>
          <Link href="/mirrorsoul" style={{ color: '#5eead4' }}>
            MirrorSoul
          </Link>
        </p>
      </section>
    </main>
  );
}
