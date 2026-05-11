import React from 'react';

/** Connector line between Visual Structure nodes — static; no animation when reduced motion. */
export default function StructureFlowLine({ vertical = true, tone = 'var(--zq-structure-line, hsl(200 40% 45%))' }) {
  if (vertical) {
    return (
      <div
        className="zq-structure-line zq-structure-line--v"
        style={{ borderColor: tone }}
        aria-hidden
      />
    );
  }
  return (
    <div
      className="zq-structure-line zq-structure-line--h"
      style={{ borderColor: tone }}
      aria-hidden
    />
  );
}
