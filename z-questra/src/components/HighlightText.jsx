import React from 'react';
import { resolveTone } from '../theme/colorIdentityTokens.js';

/**
 * inline emphasis | pill badge | full-width calm band
 */
export default function HighlightText({ tone = 'gold', variant = 'emphasis', children }) {
  const color = resolveTone(tone);
  if (variant === 'pill') {
    return (
      <span
        className="zq-highlight-pill"
        style={{
          display: 'inline-block',
          padding: '0.12rem 0.5rem',
          borderRadius: '999px',
          border: `1px solid color-mix(in hsl, ${color} 55%, transparent)`,
          background: `color-mix(in hsl, ${color} 22%, transparent)`,
          color,
          fontSize: '0.78rem',
          fontWeight: 600,
        }}
      >
        {children}
      </span>
    );
  }
  if (variant === 'band') {
    return (
      <div
        className="zq-highlight-band"
        style={{
          margin: '0.35rem 0',
          padding: '0.45rem 0.55rem',
          borderRadius: 'var(--zq-radius)',
          borderLeft: `3px solid ${color}`,
          background: `color-mix(in hsl, ${color} 12%, var(--zq-surface))`,
          color: 'var(--zq-text)',
        }}
      >
        {children}
      </div>
    );
  }
  return (
    <span className="zq-highlight-emphasis" style={{ color, fontWeight: 600 }}>
      {children}
    </span>
  );
}
