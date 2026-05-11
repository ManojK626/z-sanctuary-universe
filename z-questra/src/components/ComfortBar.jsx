import React from 'react';
import {
  TEXT_SIZE_OPTIONS,
  CONTRAST_OPTIONS,
  MOTION_OPTIONS,
  READING_OPTIONS,
  BRIGHTNESS_OPTIONS,
  AUDIO_READINESS_OPTIONS,
  PANEL_VIEW_OPTIONS,
} from '../theme/accessibilityPrefs.js';

const rowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.35rem',
  alignItems: 'center',
  marginBottom: '0.5rem',
};
const labelStyle = { minWidth: '9rem', fontSize: '0.78rem', opacity: 0.9 };

function Segmented({ label, options, value, onChange, ariaLabel, dataTestId }) {
  return (
    <div style={rowStyle} role="group" aria-label={ariaLabel} data-testid={dataTestId}>
      <span style={labelStyle}>{label}</span>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          className="zq-btn-age"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function ComfortBar({ prefs, onChange }) {
  const set = (key, v) => onChange({ ...prefs, [key]: v });

  return (
    <section
      className="zq-comfort-bar"
      aria-label="Comfort and accessibility"
      style={{
        border: '1px solid color-mix(in hsl, var(--zq-accent) 28%, transparent)',
        borderRadius: 'var(--zq-radius)',
        padding: '0.75rem 1rem',
        marginBottom: '1.25rem',
        background: 'var(--zq-surface)',
        boxShadow: '0 0 20px var(--zq-accent-glow)',
      }}
    >
      <h2 style={{ margin: '0 0 0.65rem', fontSize: '0.95rem', fontWeight: 'var(--zq-heading-weight)' }}>
        Comfort bar
      </h2>
      <Segmented
        label="Text size"
        ariaLabel="Z-QUESTRA body text size"
        dataTestId="zq-comfort-text-size"
        options={TEXT_SIZE_OPTIONS}
        value={prefs.textSize}
        onChange={(v) => set('textSize', v)}
      />
      <Segmented
        label="Contrast"
        ariaLabel="Contrast mode"
        options={CONTRAST_OPTIONS}
        value={prefs.contrast}
        onChange={(v) => set('contrast', v)}
      />
      <Segmented
        label="Motion"
        ariaLabel="Motion preference"
        options={MOTION_OPTIONS}
        value={prefs.motion}
        onChange={(v) => set('motion', v)}
      />
      <Segmented
        label="Reading"
        ariaLabel="Z-QUESTRA typography reading mode"
        dataTestId="zq-comfort-reading"
        options={READING_OPTIONS}
        value={prefs.reading}
        onChange={(v) => set('reading', v)}
      />
      <Segmented
        label="Brightness"
        ariaLabel="Brightness comfort"
        options={BRIGHTNESS_OPTIONS}
        value={prefs.brightness}
        onChange={(v) => set('brightness', v)}
      />
      <Segmented
        label="Audio readiness"
        ariaLabel="Audio readiness"
        options={AUDIO_READINESS_OPTIONS}
        value={prefs.audioReadiness}
        onChange={(v) => set('audioReadiness', v)}
      />
      <Segmented
        label="Panel view"
        ariaLabel="Panel layout"
        options={PANEL_VIEW_OPTIONS}
        value={prefs.panelView}
        onChange={(v) => set('panelView', v)}
      />
    </section>
  );
}
