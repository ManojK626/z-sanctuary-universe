import React from 'react';
import { ZEBRA_LOCAL_CHECKLIST_ITEMS } from '../theme/zebraServiceMap.js';

/** Read-only informational checklist — no persistence */
export default function ZebraReadinessChecklist() {
  return (
    <div className="zq-zebra-checklist" role="list" aria-label="Local inspector checklist preview">
      {ZEBRA_LOCAL_CHECKLIST_ITEMS.map((item) => (
        <div
          key={item.id}
          role="listitem"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.45rem',
            fontSize: '0.78rem',
            marginBottom: '0.35rem',
            color: 'var(--zq-text)',
          }}
        >
          <span aria-hidden style={{ color: 'hsl(142 45% 52%)' }}>
            ✓
          </span>
          <span>{item.label}</span>
        </div>
      ))}
      <p className="zq-zebra-checklist-foot" style={{ margin: '0.5rem 0 0', fontSize: '0.72rem', color: 'var(--zq-text-muted)' }}>
        Preview markers only — nothing is saved from this list.
      </p>
    </div>
  );
}
