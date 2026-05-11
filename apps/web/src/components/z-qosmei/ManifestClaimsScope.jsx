'use client';

import { useEffect, useState } from 'react';

export const CLAIMS_FALLBACK_OPERATIONAL =
  'Operational coherence (registry, verify, build) is the only automated prediction this toolstack asserts.';
export const CLAIMS_FALLBACK_OBSERVATION =
  'This panel summarizes loaded history — not randomness certification and not next-spin forecasting.';

/**
 * Renders ethics.claimsScope from the manifest. If `operational` and `observation` are passed (e.g. from a parent that already loaded the manifest), no extra fetch runs.
 */
export default function ManifestClaimsScope({
  variant = 'home',
  operational: operationalProp,
  observation: observationProp,
}) {
  const [operational, setOperational] = useState(operationalProp ?? null);
  const [observation, setObservation] = useState(observationProp ?? null);

  useEffect(() => {
    if (operationalProp != null && observationProp != null) {
      setOperational(operationalProp);
      setObservation(observationProp);
      return;
    }
    let cancelled = false;
    fetch('/api/z-qosmei/manifest')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.ethics?.claimsScope) return;
        const c = data.ethics.claimsScope;
        setOperational(c.operational ?? CLAIMS_FALLBACK_OPERATIONAL);
        setObservation(c.observation ?? CLAIMS_FALLBACK_OBSERVATION);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [operationalProp, observationProp]);

  const op = operational ?? CLAIMS_FALLBACK_OPERATIONAL;
  const ob = observation ?? CLAIMS_FALLBACK_OBSERVATION;
  const heading = variant === 'home' ? 'Z-QOSMEI claims scope' : 'Claims scope';

  const boxStyle =
    variant === 'home'
      ? {
          maxWidth: '52rem',
          marginBottom: '1.25rem',
          padding: '0.55rem 0.75rem',
          borderRadius: 10,
          background: 'rgba(255,209,102,0.08)',
          border: '1px solid rgba(255,209,102,0.25)',
          fontSize: '0.78rem',
          lineHeight: 1.55,
          color: '#aabccd',
        }
      : {
          marginTop: '0.55rem',
          padding: '0.45rem 0.6rem',
          borderRadius: 8,
          background: 'rgba(255,209,102,0.07)',
          border: '1px solid rgba(255,209,102,0.22)',
          fontSize: '0.7rem',
          lineHeight: 1.5,
          color: '#aabccd',
        };

  return (
    <aside style={boxStyle}>
      <strong style={{ color: '#ffd166', display: 'block', marginBottom: 4 }}>{heading}</strong>
      <span style={{ display: 'block' }}>{op}</span>
      <span style={{ display: 'block', marginTop: 6 }}>{ob}</span>
    </aside>
  );
}
