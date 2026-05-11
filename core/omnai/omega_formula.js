/**
 * OMNAI Ω layer — deterministic tier mapping from blueprint table (§02).
 * Simulation / planning only; not a live formula engine or provider call surface.
 */

/** Power multipliers for TIER 1–5 (baseline → 10k× illustrative). */
export const TIER_POWER = Object.freeze([1, 10, 100, 1000, 10000]);

/**
 * Maps completed RSI cycles to tier label and multiplier. At 5+ cycles → unbounded sentinel.
 * @param {number} rsiCyclesCompleted
 * @returns {{ tier_key: string, tier_index: number | null, rsi_cycles: number, multiplier: number }}
 */
export function tierFromRsiCycles(rsiCyclesCompleted) {
  const n = Math.max(0, Math.floor(Number(rsiCyclesCompleted)));
  if (Number.isNaN(n)) {
    return { tier_key: 'TIER_1', tier_index: 0, rsi_cycles: 0, multiplier: TIER_POWER[0] };
  }
  if (n >= TIER_POWER.length) {
    return { tier_key: 'TIER_INF', tier_index: null, rsi_cycles: n, multiplier: Number.POSITIVE_INFINITY };
  }
  return { tier_key: `TIER_${n + 1}`, tier_index: n, rsi_cycles: n, multiplier: TIER_POWER[n] };
}

/**
 * Single RSI-style step on a nonnegative score (illustrative, capped for stability).
 * @param {number} score
 * @param {number} exponent
 * @param {number} cap
 */
export function rsiStep(score, exponent = 1.05, cap = 1e9) {
  const s = Math.max(0, Number(score));
  const e = Math.max(1, Number(exponent));
  return Math.min(s ** e, cap);
}
