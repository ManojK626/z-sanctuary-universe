/**
 * Worst-case rollup helper for overlay / batch reports (deterministic ranking).
 */

const ORDER = { UNKNOWN: 0, GREEN: 1, YELLOW: 2, RED: 3 };

/**
 * @param {string | null | undefined} a
 * @param {string | null | undefined} b
 */
export function worstPlanningPosture(a, b) {
  const ua = ORDER[String(a || 'UNKNOWN').toUpperCase()];
  const ub = ORDER[String(b || 'UNKNOWN').toUpperCase()];
  const ra = ua === undefined ? 0 : ua;
  const rb = ub === undefined ? 0 : ub;
  if (ra >= rb) return String(a || 'UNKNOWN').toUpperCase();
  return String(b || 'UNKNOWN').toUpperCase();
}
