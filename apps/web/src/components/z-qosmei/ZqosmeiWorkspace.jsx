'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ZQosmeiObservationPanel from './ZQosmeiObservationPanel.jsx';

const ZqosmeiSwarmScene = dynamic(() => import('./ZqosmeiSwarmScene.jsx'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        flex: 1,
        minHeight: '48vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0f17',
        color: '#11d6c2',
        fontSize: '0.9rem',
      }}
    >
      Bootstrapping Z-QOSMEI swarm (Three.js)…
    </div>
  ),
});

export default function ZqosmeiWorkspace() {
  const [quality, setQuality] = useState(/** @type {'high' | 'balanced' | 'potato'} */ ('balanced'));
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const fn = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  /** Leave room for root layout header (nav); do not cover site chrome. */
  const siteHeaderOffset = '52px';

  return (
    <div
      style={{
        position: 'fixed',
        top: siteHeaderOffset,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#0a0f17',
        display: 'flex',
        flexFlow: 'row wrap',
        alignContent: 'stretch',
      }}
    >
      <div
        style={{
          flex: '3 1 360px',
          minWidth: 280,
          minHeight: '50vh',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ZqosmeiSwarmScene quality={quality} reducedMotion={reducedMotion} soundEnabled={soundEnabled} />

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 12,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.35rem',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.45rem 0.5rem',
            background: 'linear-gradient(180deg, transparent, rgba(10,15,23,0.92))',
            pointerEvents: 'auto',
          }}
        >
          <span style={{ fontSize: '0.65rem', color: '#8ab4d8', marginRight: 4 }}>GPU</span>
          {(['high', 'balanced', 'potato']).map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQuality(/** @type {'high' | 'balanced' | 'potato'} */ (q))}
              style={{
                padding: '0.2rem 0.5rem',
                borderRadius: 8,
                fontSize: '0.68rem',
                cursor: 'pointer',
                border:
                  quality === q ? '1px solid #ffd166' : '1px solid rgba(255,255,255,0.15)',
                background: quality === q ? 'rgba(255,209,102,0.15)' : 'rgba(0,0,0,0.45)',
                color: quality === q ? '#ffd166' : '#aab',
              }}
            >
              {q[0].toUpperCase() + q.slice(1)}
            </button>
          ))}
          <span style={{ width: 8 }} />
          <button
            type="button"
            onClick={() => setSoundEnabled((s) => !s)}
            style={{
              padding: '0.2rem 0.55rem',
              borderRadius: 8,
              fontSize: '0.68rem',
              cursor: 'pointer',
              border: '1px solid rgba(17,214,194,0.45)',
              background: soundEnabled ? 'rgba(17,214,194,0.2)' : 'rgba(0,0,0,0.45)',
              color: soundEnabled ? '#11d6c2' : '#889',
            }}
          >
            Sound {soundEnabled ? 'on' : 'off'}
          </button>
          {reducedMotion ? (
            <span style={{ fontSize: '0.62rem', color: '#a78bfa', marginLeft: 4 }}>Reduced motion</span>
          ) : null}
        </div>
      </div>
      <div
        style={{
          flex: '1 1 300px',
          maxWidth: '100%',
          minHeight: '48vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ZQosmeiObservationPanel />
      </div>

      <Link
        href="/"
        style={{
          position: 'fixed',
          top: `calc(${siteHeaderOffset} + 12px)`,
          left: 12,
          zIndex: 30,
          padding: '0.5rem 0.85rem',
          borderRadius: 12,
          background: 'rgba(0,0,0,0.82)',
          color: '#11d6c2',
          textDecoration: 'none',
          fontSize: '0.9rem',
          border: '1px solid rgba(17,214,194,0.35)',
        }}
      >
        ← Governance home
      </Link>
      <a
        href="/api/z-qosmei/manifest"
        style={{
          position: 'fixed',
          top: `calc(${siteHeaderOffset} + 12px)`,
          right: 12,
          zIndex: 30,
          padding: '0.5rem 0.85rem',
          borderRadius: 12,
          background: 'rgba(0,0,0,0.82)',
          color: '#ffd166',
          textDecoration: 'none',
          fontSize: '0.85rem',
          border: '1px solid rgba(255,209,102,0.35)',
        }}
      >
        Z-QOSMEI manifest (JSON)
      </a>
    </div>
  );
}
