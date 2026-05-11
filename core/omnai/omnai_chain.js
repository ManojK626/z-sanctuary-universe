/**
 * Multi-step deterministic chain across merged scenarios (blueprint pacing).
 */

import { mergeScenarios } from './omnai_scenario_merge.js';
import { runOmnaiCoreTick } from './omnai_kernel.js';

/**
 * @param {Record<string, unknown>} seed
 * @param {Record<string, unknown>[]} steps
 */
export function runOmnaiCoreChain(seed, steps) {
  const list = Array.isArray(steps) ? steps : [];
  let acc = seed && typeof seed === 'object' ? { ...seed } : {};
  const trace = [];

  for (let i = 0; i < list.length; i++) {
    acc = mergeScenarios(acc, list[i]);
    const tick = runOmnaiCoreTick(acc);
    trace.push({
      step_index: i,
      merged_preview: summarizeAcc(acc),
      tick,
    });
  }

  return {
    schema: 'z_omnai_core_engine_chain_report_v1',
    mode: 'deterministic_chain_only',
    step_count: trace.length,
    trace,
    final_rollup: trace.length ? trace[trace.length - 1].tick.rollup : null,
  };
}

/** @param {Record<string, unknown>} acc */
function summarizeAcc(acc) {
  return {
    rsi_cycles: acc.rsi_cycles,
    traffic_kind: acc.traffic_kind,
    pathway: acc.pathway,
    entity: acc.entity,
    ant_flags: typeof acc.ants === 'object' && acc.ants !== null ? acc.ants : {},
  };
}
