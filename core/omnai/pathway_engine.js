/**
 * Self-guiding pathway signals (§09) — maps scalar hints to enumerated posture.
 */

/** @typedef {'CONVERGE'|'DIVERGE'|'UNCLEAR'|'OVERCAP'|'COMPLETE'} PathwaySignal */

/**
 * @param {{
 *   residualDelta?: number,
 *   goalClarity?: number,
 *   capacityRatio?: number,
 *   completesRubric?: boolean,
 * }} p
 * @returns {{ signal: PathwaySignal, note: string }}
 */
export function pathwaySignal(p = {}) {
  if (p.completesRubric) return { signal: 'COMPLETE', note: 'acceptance_met' };

  const clarity = Number(p.goalClarity ?? 1);
  if (clarity < 0.35) return { signal: 'UNCLEAR', note: 'goal_underspecified' };

  const cap = Number(p.capacityRatio ?? 0);
  if (!Number.isNaN(cap) && cap > 0.92) return { signal: 'OVERCAP', note: 'queue_or_budget_high' };

  const delta = Number(p.residualDelta ?? 0);
  if (!Number.isNaN(delta) && delta > 0.05) return { signal: 'DIVERGE', note: 'residual_rising' };

  return { signal: 'CONVERGE', note: 'within_epsilon_band' };
}
