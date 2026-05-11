/**
 * Quadruple spine routing (§04) — classify traffic kinds to spine planes and failsafe posture.
 */

/** @typedef {'COGNITIVE'|'DATA'|'BUILD'|'OVERSIGHT'} SpineId */

const KIND_MAP = /** @type {Record<string, SpineId>} */ ({
  reasoning: 'COGNITIVE',
  planning: 'COGNITIVE',
  graph: 'COGNITIVE',
  stream: 'DATA',
  ingest: 'DATA',
  embedding: 'DATA',
  build: 'BUILD',
  deploy: 'BUILD',
  registry: 'BUILD',
  audit: 'OVERSIGHT',
  kill_switch: 'OVERSIGHT',
  eval: 'OVERSIGHT',
});

/**
 * @param {string} trafficKind
 * @returns {{ spine: SpineId, note: string }}
 */
export function routeToSpine(trafficKind) {
  const key = String(trafficKind ?? '').trim().toLowerCase();
  const spine = KIND_MAP[key] ?? 'COGNITIVE';
  return { spine, note: KIND_MAP[key] ? 'mapped_kind' : 'default_to_cognitive' };
}

/** @type {Record<SpineId, string>} */
const FAILSAFE = {
  COGNITIVE: 'freeze_writes_degrade_planning',
  DATA: 'spill_cold_throttle_ingest',
  BUILD: 'hold_promotions_queue_build',
  OVERSIGHT: 'stop_build_spine_when_red',
};

export function failsafePosture(spine) {
  return FAILSAFE[spine] ?? 'observe_only';
}
