import React, { useState } from 'react';
import { GUARDIAN_RIBBON, resolveTone } from '../theme/colorIdentityTokens.js';
import { getRouteMeta } from '../theme/sanctuaryRouteMap.js';
import { getPanelVisualIdentity } from '../theme/panelVisualMap.js';

const DEPT_LABEL = {
  guide: 'Zuno Guide lane',
  education: 'Learning cards',
  command: 'Enterprise command',
  knowledge: 'Knowledge / Q&A structure',
  music: 'Z-Sanctuary Music Engine',
};

export default function PanelFrame({ panelId, title, highlight, children, defaultCollapsed = false }) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const meta = getRouteMeta(panelId);
  const identity = getPanelVisualIdentity(panelId);

  const accent = resolveTone(identity.accentColor);
  const heading = resolveTone(identity.headingColor);
  const highlightCol = resolveTone(identity.highlightColor);
  const lineCol = resolveTone(identity.lineColor);

  const deptLabel = DEPT_LABEL[identity.department] || identity.department;
  const headingClass =
    identity.motionStyle === 'subtle'
      ? 'zq-gradient-title zq-gradient-title--panel'
      : 'zq-panel-heading-solid';

  return (
    <article
      className="zq-panel-frame"
      data-panel-id={panelId}
      data-department={identity.department}
      data-route-key={meta?.routeKey || ''}
      data-sanctuary-family={meta?.sanctuaryFamily || ''}
      data-guardian-level={identity.guardianLevel || meta?.guardianLevel || ''}
      role={meta?.accessibilityRole === 'main' ? 'main' : 'region'}
      aria-labelledby={`zq-panel-h-${panelId}`}
      style={{
        '--zq-structure-line': lineCol,
        borderRadius: 'var(--zq-radius)',
        border: `1px solid color-mix(in hsl, ${accent} 42%, transparent)`,
        background: 'var(--zq-surface)',
        boxShadow: `0 0 18px color-mix(in hsl, ${accent} 35%, transparent)`,
        padding: '0.65rem 0.85rem',
      }}
    >
      <div
        className="zq-guardian-ribbon"
        style={{
          background: `linear-gradient(90deg, ${GUARDIAN_RIBBON.safe}, ${GUARDIAN_RIBBON.caution}, ${GUARDIAN_RIBBON.stop})`,
        }}
        aria-hidden
      />
      <header
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '0.5rem',
          marginBottom: collapsed ? 0 : '0.5rem',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '0.72rem',
              letterSpacing: '0.04em',
              color: 'var(--zq-text-muted)',
            }}
          >
            <span aria-hidden>{identity.icon}</span> {deptLabel} · {meta?.routeKey || panelId}
          </div>
          <h3
            id={`zq-panel-h-${panelId}`}
            className={headingClass}
            style={{
              margin: '0.15rem 0 0',
              fontSize: '1.05rem',
              fontWeight: 'var(--zq-heading-weight)',
              ...(identity.motionStyle === 'none' ? { color: heading } : {}),
            }}
          >
            {title}
          </h3>
        </div>
        <button
          type="button"
          className="zq-btn-age"
          aria-expanded={!collapsed}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? 'Expand' : 'Collapse'}
        </button>
      </header>
      {!collapsed && highlight ? (
        <p
          className="zq-panel-highlight"
          style={{
            margin: '0 0 0.55rem',
            fontSize: '0.88rem',
            lineHeight: 1.5,
            color: highlightCol,
          }}
        >
          {highlight}
        </p>
      ) : null}
      {!collapsed ? (
        <div
          className="zq-panel-body"
          style={{
            fontSize: '0.86rem',
            lineHeight: 1.45,
            color: 'var(--zq-text)',
          }}
        >
          {children}
        </div>
      ) : null}
      {!collapsed && meta ? (
        <footer
          style={{
            marginTop: '0.65rem',
            paddingTop: '0.45rem',
            borderTop: `1px solid color-mix(in hsl, ${lineCol} 40%, transparent)`,
            fontSize: '0.68rem',
            color: 'var(--zq-text-muted)',
          }}
        >
          Bridge: {meta.futureBridge} · status: {meta.status}
        </footer>
      ) : null}
    </article>
  );
}
