import React from 'react';
import ReceiptPoster from './ReceiptPoster.jsx';
import UncertaintyKaleidoscope from './UncertaintyKaleidoscope.jsx';
import ZBadgeStudio from './ZBadgeStudio.jsx';
import ZCanvasGarden from './ZCanvasGarden.jsx';
import { ROUTE_FLOW, routeStatusLabel } from '../game/playGardenMap.js';
import { PLAY_GARDEN_PHASE } from '../theme/playGardenTokens.js';
import { READINESS_CARDS } from '../theme/zebraServiceMap.js';

export default function ZPlayGardenPanel({ notebookMeta, comfort, ageMode }) {
  const pageCount = notebookMeta?.pageCount ?? 1;

  return (
    <section
      id="zq-play-garden"
      className="zq-play-garden-panel"
      data-testid="zq-play-garden-panel"
      aria-labelledby="zq-play-garden-title"
      style={{
        marginTop: '1rem',
        padding: '0.85rem 1rem',
        borderRadius: 'var(--zq-radius)',
        border: '1px solid color-mix(in hsl, hsl(268 48% 58%) 30%, transparent)',
        background: 'color-mix(in hsl, var(--zq-surface) 93%, hsl(276 18% 16%))',
      }}
    >
      <h3 id="zq-play-garden-title" style={{ margin: '0 0 0.35rem', fontSize: '1rem', color: 'hsl(268 52% 72%)' }}>
        <span aria-hidden>🎮</span> Z PlayGarden · Phase {PLAY_GARDEN_PHASE}
      </h3>
      <p style={{ margin: '0 0 0.65rem', fontSize: '0.76rem', color: 'var(--zq-text-muted)', lineHeight: 1.45 }}>
        Local-only entertainment and learning — uncertainty kaleidoscope, receipt poster, canvas garden. No backend,
        multiplayer, payments, loot boxes, gambling, prediction claims, public leaderboards, or live Z-Sanctuary bridge.
      </p>

      <div
        role="status"
        style={{
          fontSize: '0.74rem',
          lineHeight: 1.45,
          padding: '0.5rem 0.6rem',
          marginBottom: '0.75rem',
          borderRadius: 'var(--zq-radius)',
          border: '1px solid color-mix(in hsl, hsl(142 45% 48%) 32%, transparent)',
          background: 'color-mix(in hsl, hsl(142 38% 42%) 8%, var(--zq-surface))',
          color: 'var(--zq-text)',
        }}
      >
        <strong>Safety posture:</strong> calm creativity and uncertainty literacy — no stakes. Reduced motion and
        photophobia soften glow, pause kaleidoscope drift, and keep orbit gentle elsewhere.
      </div>

      <h4
        style={{
          margin: '0 0 0.55rem',
          fontSize: '0.92rem',
          fontWeight: 700,
          color: 'hsl(185 48% 62%)',
        }}
      >
        Creative Tools
      </h4>

      <div style={{ marginBottom: '1rem' }}>
        <UncertaintyKaleidoscope comfort={comfort} />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <ReceiptPoster notebookMeta={notebookMeta} ageMode={ageMode} />
      </div>

      <div style={{ marginBottom: '0.85rem' }}>
        <ZCanvasGarden notebookPageCount={pageCount} comfort={comfort} readinessCardCount={READINESS_CARDS.length} />
      </div>

      <div style={{ marginBottom: '0.85rem' }}>
        <ZBadgeStudio />
      </div>

      <div>
        <h4 style={{ margin: '0 0 0.45rem', fontSize: '0.88rem', color: 'hsl(205 58% 68%)' }}>Z Route Explorer</h4>
        <ol style={{ margin: 0, paddingLeft: '1.15rem', fontSize: '0.78rem', lineHeight: 1.55, color: 'var(--zq-text)' }}>
          {ROUTE_FLOW.map((step) => (
            <li key={step.id} style={{ marginBottom: '0.35rem' }}>
              <strong>{step.label}</strong>{' '}
              <span style={{ color: 'var(--zq-text-muted)', fontSize: '0.72rem' }}>
                ({routeStatusLabel(step.status)})
              </span>
              <div style={{ color: 'var(--zq-text-muted)', fontSize: '0.72rem', marginTop: '0.15rem' }}>{step.detail}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
