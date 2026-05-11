import React from 'react';
import { PLAY_GARDEN_BADGES } from '../theme/playGardenTokens.js';
import { resolveTone } from '../theme/colorIdentityTokens.js';

function BadgeGlyph({ id }) {
  const stroke = 'currentColor';
  const common = { fill: 'none', strokeWidth: 2, strokeLinecap: 'round' };
  switch (id) {
    case 'notebook-star':
      return (
        <svg viewBox="0 0 48 48" width="36" height="36" aria-hidden>
          <path {...common} stroke={stroke} d="M24 6l4 12h12l-10 8 4 14-10-8-10 8 4-14-10-8h12z" />
        </svg>
      );
    case 'comfort-hero':
      return (
        <svg viewBox="0 0 48 48" width="36" height="36" aria-hidden>
          <path {...common} stroke={stroke} d="M10 26c8-12 20-12 28 0v10H10V26z" />
          <path {...common} stroke={stroke} d="M16 18v-4a8 8 0 0116 0v4" />
        </svg>
      );
    case 'zebra-helper':
      return (
        <svg viewBox="0 0 48 48" width="36" height="36" aria-hidden>
          <ellipse cx="24" cy="26" rx="14" ry="10" {...common} stroke={stroke} />
          <path {...common} stroke={stroke} d="M12 18h24M18 12l-4-4M30 12l4-4" />
        </svg>
      );
    case 'guardian-shield':
      return (
        <svg viewBox="0 0 48 48" width="36" height="36" aria-hidden>
          <path {...common} stroke={stroke} d="M24 8l14 6v12c0 10-6 16-14 18-8-2-14-8-14-18V14z" />
        </svg>
      );
    case 'learning-explorer':
      return (
        <svg viewBox="0 0 48 48" width="36" height="36" aria-hidden>
          <circle cx="18" cy="22" r="8" {...common} stroke={stroke} />
          <path {...common} stroke={stroke} d="M24 28l14 14M32 12l6 6" />
        </svg>
      );
    default:
      return null;
  }
}

export default function ZBadgeStudio() {
  return (
    <div className="zq-badge-studio" data-testid="zq-badge-studio">
      <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.88rem', color: 'var(--zq-text)' }}>Glow Badge Studio (preview)</h4>
      <p style={{ margin: '0 0 0.65rem', fontSize: '0.74rem', color: 'var(--zq-text-muted)', lineHeight: 1.45 }}>
        Non-monetary pride badges — no purchases, loot boxes, streak pressure, or public leaderboards.
      </p>
      <div
        className="zq-badge-studio-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '0.5rem',
        }}
      >
        {PLAY_GARDEN_BADGES.map((b) => {
          const color = resolveTone(b.tone);
          return (
            <div
              key={b.id}
              className="zq-badge-card"
              style={{
                padding: '0.5rem 0.55rem',
                borderRadius: 'var(--zq-radius)',
                border: `1px solid color-mix(in hsl, ${color} 38%, transparent)`,
                background: `color-mix(in hsl, ${color} 12%, var(--zq-surface))`,
              }}
            >
              <div style={{ color, marginBottom: '0.25rem' }}>
                <BadgeGlyph id={b.id} />
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--zq-text)' }}>{b.label}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--zq-text-muted)', marginTop: '0.2rem', lineHeight: 1.35 }}>
                {b.hint}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
