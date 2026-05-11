/**
 * Thin orchestration kernel — runs one “tick” of engines from a normalized snapshot.
 * Simulation only; emits trace for reports and tests.
 */

import { tierFromRsiCycles, rsiStep } from './omega_formula.js';
import { summarizeGmb } from './gmb_brains.js';
import { routeToSpine, failsafePosture } from './quad_spines.js';
import { evaluateAnts } from './octo_ant.js';
import { pathwaySignal } from './pathway_engine.js';
import { canPerformAction } from './entity_hierarchy.js';

/**
 * @param {Record<string, unknown>} scenario
 */
function normalizeScenario(scenario) {
  const s = scenario && typeof scenario === 'object' ? scenario : {};

  /** @type {import('./gmb_brains.js').BrainLoad[]} */
  const brains = Array.isArray(s.brains) ? /** @type {any} */ (s.brains) : [];

  /** @type {import('./octo_ant.js').AntSnapshot} */
  const ants = typeof s.ants === 'object' && s.ants !== null ? /** @type {any} */ (s.ants) : {};

  const pathway = typeof s.pathway === 'object' && s.pathway !== null ? /** @type {any} */ (s.pathway) : {};

  const trafficKind = typeof s.traffic_kind === 'string' ? s.traffic_kind : 'reasoning';

  const entity = typeof s.entity === 'object' && s.entity !== null ? /** @type {any} */ (s.entity) : {};

  const rsiCycles =
    typeof s.rsi_cycles === 'number'
      ? s.rsi_cycles
      : typeof s.rsi_cycles === 'string'
        ? Number(s.rsi_cycles)
        : 0;

  const omegaPreview = tierFromRsiCycles(rsiCycles);
  const baseSeed = omegaPreview.multiplier === Infinity ? 10000 : omegaPreview.multiplier;
  const rsiScoreSeed =
    typeof s.rsi_score_seed === 'number' && !Number.isNaN(Number(s.rsi_score_seed))
      ? Number(s.rsi_score_seed)
      : Math.max(1, baseSeed);

  return { brains, ants, pathway, trafficKind, entity, rsiCycles, rsiScoreSeed };
}

/**
 * Runs all core engines once and returns a serializable rollup.
 * @param {Record<string, unknown>} scenario
 */
export function runOmnaiCoreTick(scenario) {
  const n = normalizeScenario(scenario);

  const omegaTier = tierFromRsiCycles(n.rsiCycles);
  const omegaStep = rsiStep(Math.max(1, n.rsiScoreSeed));

  const gmb = summarizeGmb(n.brains);

  const spineRoute = routeToSpine(n.trafficKind);

  const antPanel = evaluateAnts(n.ants);

  const pathway = pathwaySignal(n.pathway);

  const lane = canPerformAction(
    String(n.entity?.lane ?? ''),
    String(n.entity?.action ?? ''),
  );

  const trace_order = ['omega_formula', 'gmb', 'spines', 'octo_ant', 'pathway', 'entity_lane'];

  const planning_posture = computePlanningPosture(antPanel, pathway, lane, gmb);

  return {
    schema: 'z_omnai_core_engine_tick_v1',
    mode: 'deterministic_simulation_only',
    omega: {
      tier: omegaTier.tier_key,
      rsi_cycles: omegaTier.rsi_cycles,
      multiplier: omegaTier.multiplier === Infinity ? 'Infinity' : omegaTier.multiplier,
      illustrative_rsi_step: omegaStep,
    },
    gmb,
    quad_spine: {
      route: spineRoute,
      failsafe: failsafePosture(spineRoute.spine),
    },
    octo_ant: antPanel,
    pathway,
    entity_lane: lane,
    rollup: {
      planning_posture,
      /** Human-readable rollup; not operational permission. */
      suggested_operator_note: synthesizeNote(antPanel, pathway, lane, gmb),
    },
    trace_order,
  };
}

/**
 * Stricter advisory posture: veto and overseer RED win; any ant failure or pathway stress is at least YELLOW.
 * @param {object} antPanel
 * @param {{ signal: string }} pathway
 * @param {{ allowed: boolean }} lane
 * @param {{ posture: string }} gmb
 */
function computePlanningPosture(antPanel, pathway, lane, gmb) {
  if (antPanel.veto_recommended === true || antPanel.posture === 'RED_REVIEW') return 'RED';
  if (!lane.allowed && lane.reason === 'policy_forbid') return 'YELLOW';
  const ps = String(pathway.signal || '');
  if (ps === 'DIVERGE' || ps === 'OVERCAP') return 'YELLOW';
  if (ps === 'UNCLEAR') return 'YELLOW';
  if (antPanel.all_ok === false || antPanel.posture === 'YELLOW') return 'YELLOW';
  if (gmb.posture === 'YELLOW_ELASTIC_CLONE_ADVISORY') return 'YELLOW';
  if (!lane.allowed) return 'YELLOW';
  return 'GREEN';
}

/** @param {object} antPanel */
function synthesizeNote(antPanel, pathway, lane, gmb) {
  const bits = [];
  if (antPanel.veto_recommended) bits.push('overseers: veto advisory — halt promotion until review');
  if (!antPanel.all_ok) bits.push('overseers: one or more ANT checks failed — inspect octo_ant payload');
  if (pathway.signal === 'DIVERGE') bits.push('pathway: residual divergence — reroute or tighten tools');
  if (pathway.signal === 'OVERCAP') bits.push('pathway: capacity pressure — shard or shed work');
  if (pathway.signal === 'UNCLEAR') bits.push('pathway: clarify goal vector before widening tools');
  if (gmb.posture === 'YELLOW_ELASTIC_CLONE_ADVISORY') bits.push('GMB: elastic clone advisory active on at least one brain');
  if (!lane.allowed) bits.push(`entity lane ${lane.lane}: action blocked (${lane.reason})`);
  if (!bits.length) bits.push('steady-state simulation posture — verify against live charters before execution');
  return bits.join('; ');
}
