import React from 'react';
import { CERTIFICATION_DISCLAIMER, READINESS_CARDS, ZEBRA_ROLES } from '../theme/zebraServiceMap.js';
import { zebraToneAt } from '../theme/zebraFamilyTokens.js';
import ZebraInspectorCard from './ZebraInspectorCard.jsx';
import ZebraReadinessChecklist from './ZebraReadinessChecklist.jsx';

function statusLabel(status) {
  if (status === 'gated') return 'Gated';
  return 'Local preview';
}

export default function ZZebrasFamilyPanel() {
  return (
    <section
      className="zq-zebras-family"
      aria-labelledby="zq-zebras-family-title"
      style={{
        marginTop: '1rem',
        padding: '0.85rem 1rem',
        borderRadius: 'var(--zq-radius)',
        border: '1px solid color-mix(in hsl, hsl(43 72% 58%) 32%, transparent)',
        background: 'color-mix(in hsl, var(--zq-surface) 96%, hsl(276 20% 18%))',
      }}
    >
      <h2 id="zq-zebras-family-title" style={{ margin: '0 0 0.35rem', fontSize: '1rem', color: 'hsl(43 72% 62%)' }}>
        <span aria-hidden>🦓</span> AT Love Zebra — Z-Zebras Family
      </h2>
      <p style={{ margin: '0 0 0.5rem', fontSize: '0.78rem', color: 'var(--zq-text-muted)', lineHeight: 1.4 }}>
        The colorful inspector / designer / readiness family — unique stripes, one family. Local metadata only.
      </p>

      <div
        className="zq-zebras-disclaimer"
        role="status"
        style={{
          fontSize: '0.76rem',
          lineHeight: 1.45,
          padding: '0.5rem 0.6rem',
          marginBottom: '0.75rem',
          borderRadius: 'var(--zq-radius)',
          border: '1px solid color-mix(in hsl, hsl(38 82% 52%) 38%, transparent)',
          background: 'color-mix(in hsl, hsl(38 82% 52%) 10%, var(--zq-surface))',
          color: 'var(--zq-text)',
        }}
      >
        <strong>Local inspector preview only.</strong> No certification, account, API, email, storage, voice, or
        Z-Sanctuary bridge is active in this phase. {CERTIFICATION_DISCLAIMER}
      </div>

      <h3 style={{ margin: '0 0 0.45rem', fontSize: '0.88rem', color: 'hsl(185 52% 62%)' }}>Zebra roles</h3>
      <div
        className="zq-zebra-role-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '0.5rem',
          marginBottom: '1rem',
        }}
      >
        {ZEBRA_ROLES.map((z, i) => (
          <ZebraInspectorCard
            key={z.zebraId}
            icon={z.icon}
            title={z.name}
            subtitle={z.role}
            tone={zebraToneAt(i)}
            statusBadge={statusLabel(z.currentStatus)}
            gated={z.currentStatus === 'gated'}
            tags={
              z.standardReadinessTags.length > 0 ? z.standardReadinessTags : [`Bridge: ${z.bridgeStatus}`]
            }
          >
            {z.requiresDRPGate ? (
              <span style={{ color: 'var(--zq-text-muted)', fontSize: '0.72rem' }}>14 DRP awareness · human gate</span>
            ) : null}
          </ZebraInspectorCard>
        ))}
      </div>

      <h3 style={{ margin: '0 0 0.45rem', fontSize: '0.88rem', color: 'hsl(158 48% 58%)' }}>
        Readiness cards (service layers — mock)
      </h3>
      <div
        className="zq-zebra-readiness-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '0.5rem',
          marginBottom: '1rem',
        }}
      >
        {READINESS_CARDS.map((card, i) => (
          <ZebraInspectorCard
            key={card.id}
            icon="📋"
            title={card.title}
            subtitle={card.summary}
            tone={zebraToneAt(i + 3)}
            statusBadge={card.id === 'service-bridge' || card.id === 'scheduler' ? 'Read-only' : 'Preview'}
            gated={card.id === 'service-bridge'}
            tags={[...(card.standardReadinessTags || []), `Tier hint: ${card.mockTier}`]}
          >
            {card.id === 'notes-diary' ? (
              <div
                style={{
                  marginTop: '0.35rem',
                  padding: '0.35rem',
                  borderRadius: '6px',
                  background: 'color-mix(in hsl, hsl(350 55% 68%) 12%, transparent)',
                  fontSize: '0.72rem',
                }}
              >
                <a href="#zq-local-notebook" style={{ color: 'inherit', fontWeight: 600 }}>
                  📔 Open Local Notebook (Z tools → Notes above)
                </a>
              </div>
            ) : null}
            {card.id === 'scheduler' ? (
              <div
                style={{
                  marginTop: '0.35rem',
                  padding: '0.35rem',
                  borderRadius: '6px',
                  background: 'color-mix(in hsl, hsl(222 55% 62%) 12%, transparent)',
                  fontSize: '0.72rem',
                }}
              >
                🗓 Morning focus · mock slot · no sync
              </div>
            ) : null}
          </ZebraInspectorCard>
        ))}
      </div>

      <h3 style={{ margin: '0 0 0.35rem', fontSize: '0.88rem', color: 'hsl(276 58% 68%)' }}>Local checklist</h3>
      <ZebraReadinessChecklist />
    </section>
  );
}
