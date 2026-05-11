import React from 'react';
import { zebraCardBorder, zebraCardGlow } from '../theme/zebraFamilyTokens.js';

export default function ZebraInspectorCard({
  icon,
  title,
  subtitle,
  tone,
  statusBadge,
  gated = false,
  tags = [],
  children,
}) {
  return (
    <article
      className="zq-zebra-card"
      style={{
        border: zebraCardBorder(tone),
        boxShadow: gated ? 'none' : zebraCardGlow(tone),
        borderRadius: 'var(--zq-radius)',
        padding: '0.55rem 0.65rem',
        background: 'color-mix(in hsl, var(--zq-surface) 94%, transparent)',
        opacity: gated ? 0.88 : 1,
      }}
      aria-label={title}
    >
      <header style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', marginBottom: '0.25rem' }}>
        <span aria-hidden style={{ fontSize: '1.1rem', lineHeight: 1 }}>
          {icon}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: tone }}>{title}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--zq-text-muted)', lineHeight: 1.35 }}>{subtitle}</div>
        </div>
        <span
          style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            padding: '0.15rem 0.4rem',
            borderRadius: '999px',
            border: `1px solid color-mix(in hsl, ${tone} 40%, transparent)`,
            color: tone,
            whiteSpace: 'nowrap',
          }}
        >
          {statusBadge}
        </span>
      </header>
      {tags.length > 0 ? (
        <ul className="zq-zebra-tags" style={{ margin: '0 0 0.35rem', paddingLeft: '1rem', fontSize: '0.68rem' }}>
          {tags.map((t) => (
            <li key={t} style={{ color: 'var(--zq-text-muted)' }}>
              {t}
            </li>
          ))}
        </ul>
      ) : null}
      {children ? <div style={{ fontSize: '0.74rem', color: 'var(--zq-text)' }}>{children}</div> : null}
    </article>
  );
}
