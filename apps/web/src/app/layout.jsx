import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Z-Sanctuary Universe',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="sanctuary-body">
        <div className="sanctuary-tv-wrap sanctuary-tv-wrap--with-padding">
        <header
          className="sanctuary-tv-header"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.5rem 1.25rem',
            padding: '0.65rem 1.25rem',
            background: 'linear-gradient(180deg, #050813, #0a1020)',
            borderBottom: '1px solid rgba(0, 212, 255, 0.22)',
          }}
        >
          <span style={{ fontWeight: 700, color: '#e8f4ff', letterSpacing: '0.02em' }}>Z-Sanctuary</span>
          <nav
            className="sanctuary-nav"
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem 0.75rem' }}
          >
            <Link href="/" style={{ color: '#11d6c2', textDecoration: 'none' }}>
              Governance dashboard
            </Link>
            <Link href="/z-qosmei" style={{ color: '#ffd166', textDecoration: 'none' }}>
              Z-QOSMEI · vision + observation
            </Link>
            <Link href="/mirrorsoul" style={{ color: '#a0e4cb', textDecoration: 'none' }}>
              MirrorSoul
            </Link>
            <Link href="/continuation" style={{ color: '#7dd3fc', textDecoration: 'none' }}>
              Continuation (Z-SUC-2)
            </Link>
            <Link href="/project-aura" style={{ color: '#fde68a', textDecoration: 'none' }}>
              AURA / Z-HOLO
            </Link>
            <Link href="/zuno/flow" style={{ color: '#5eead4', textDecoration: 'none' }}>
              Zuno flow
            </Link>
            <Link href="/safety" style={{ color: '#7dd3fc', textDecoration: 'none' }}>
              Safety
            </Link>
            <Link href="/z-stack-lite" style={{ color: '#c4b5fd', textDecoration: 'none' }}>
              Z-Stack Lite
            </Link>
            <Link href="/account" style={{ color: '#a5b4fc', textDecoration: 'none' }}>
              Account
            </Link>
            <Link href="/account/experience" style={{ color: '#c4b5fd', textDecoration: 'none' }}>
              Experience
            </Link>
            <Link href="/login" style={{ color: '#a5b4fc', textDecoration: 'none' }}>
              Sign in
            </Link>
            <Link href="/privacy" style={{ color: '#8ab4d8', textDecoration: 'none' }}>
              Privacy
            </Link>
            <Link href="/terms" style={{ color: '#8ab4d8', textDecoration: 'none' }}>
              Terms
            </Link>
            <a href="/api/z-qosmei/manifest" style={{ color: '#8ab4d8', textDecoration: 'none' }}>
              Manifest (JSON)
            </a>
          </nav>
        </header>
        <noscript>
          <div
            style={{
              padding: '1rem 1.25rem',
              background: '#2a1515',
              color: '#ffb4b4',
              borderBottom: '1px solid #662222',
            }}
          >
            JavaScript is required for WebGL (SKK/RKPK, Z-QOSMEI swarm) and live panels. Enable scripts to use
            the full dashboard.
          </div>
        </noscript>
        {children}
        </div>
      </body>
    </html>
  );
}
