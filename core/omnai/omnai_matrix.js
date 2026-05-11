/**
 * Cartesian index decode for maximal combination coverage within a capped budget.
 *
 * Dimensions (product = 4800 unique tuples):
 * - rsi_cycles: 4
 * - traffic_kind: 6
 * - pathway preset: 5
 * - ant preset: 4
 * - entity preset: 5
 * - brain_load preset: 2
 */

const RSI = [0, 1, 3, 5];
const TRAFFIC = /** @type {const} */ ([
  'reasoning',
  'stream',
  'build',
  'audit',
  'embedding',
  'ingest',
]);

const pathwayPresets = {
  converge: {
    residualDelta: -0.02,
    goalClarity: 0.92,
    capacityRatio: 0.41,
    completesRubric: false,
  },
  diverge: {
    residualDelta: 0.18,
    goalClarity: 0.88,
    capacityRatio: 0.55,
    completesRubric: false,
  },
  unclear: {
    residualDelta: 0,
    goalClarity: 0.22,
    capacityRatio: 0.5,
    completesRubric: false,
  },
  overcap: {
    residualDelta: -0.01,
    goalClarity: 0.85,
    capacityRatio: 0.97,
    completesRubric: false,
  },
  complete: {
    completesRubric: true,
    residualDelta: -0.01,
    goalClarity: 0.95,
    capacityRatio: 0.33,
  },
};

const pathwayKeys = /** @type {(keyof typeof pathwayPresets)[]} */ ([
  'converge',
  'diverge',
  'unclear',
  'overcap',
  'complete',
]);

const antPresets = {
  green: {
    reasoningDagCycles: 120,
    ingestIntegrityOk: true,
    secretsDetected: false,
    ciGreen: true,
    formulaStable: true,
    pathwayDiverging: false,
    hiveSkewPct: 4,
    recursionDepth: 8,
    recursionLimit: 48,
  },
  secrets: {
    reasoningDagCycles: 120,
    ingestIntegrityOk: true,
    secretsDetected: true,
    ciGreen: true,
    formulaStable: true,
    pathwayDiverging: false,
    hiveSkewPct: 2,
    recursionDepth: 6,
    recursionLimit: 48,
  },
  ci_fail: {
    reasoningDagCycles: 120,
    ingestIntegrityOk: true,
    secretsDetected: false,
    ciGreen: false,
    formulaStable: true,
    pathwayDiverging: false,
    hiveSkewPct: 2,
    recursionDepth: 6,
    recursionLimit: 48,
  },
  recursion_critical: {
    reasoningDagCycles: 900,
    ingestIntegrityOk: true,
    secretsDetected: false,
    ciGreen: true,
    formulaStable: true,
    pathwayDiverging: false,
    hiveSkewPct: 28,
    recursionDepth: 55,
    recursionLimit: 32,
  },
};

const antKeys = /** @type {(keyof typeof antPresets)[]} */ ([
  'green',
  'secrets',
  'ci_fail',
  'recursion_critical',
]);

const entityPresets = {
  assistant_ok: { lane: 'ASSISTANT', action: 'format_user_reply' },
  ghost_blocked: { lane: 'GHOST', action: 'production_mutation' },
  shadow_blocked: { lane: 'SHADOW', action: 'customer_data_export_live' },
  master_ok: { lane: 'MASTER', action: 'policy_merge_draft' },
  minibot_blocked: { lane: 'MINIBOT', action: 'iam_wide_change' },
};

const entityKeys = /** @type {(keyof typeof entityPresets)[]} */ ([
  'assistant_ok',
  'ghost_blocked',
  'shadow_blocked',
  'master_ok',
  'minibot_blocked',
]);

const brainPresets = {
  stable: [
    { id: 'MB-0', loadPct: 38 },
    { id: 'BRAIN-3', loadPct: 52 },
    { id: 'BRAIN-7', loadPct: 44 },
  ],
  elastic: [
    { id: 'MB-0', loadPct: 42 },
    { id: 'BRAIN-3', loadPct: 91 },
    { id: 'BRAIN-2', loadPct: 86 },
    { id: 'BRAIN-7', loadPct: 48 },
  ],
};

const brainKeys = /** @type {(keyof typeof brainPresets)[]} */ ([
  'stable',
  'elastic',
]);

export const MATRIX_DIMENSIONS_PRODUCT =
  RSI.length *
  TRAFFIC.length *
  pathwayKeys.length *
  antKeys.length *
  entityKeys.length *
  brainKeys.length;

/**
 * Decode linear index → full scenario definition (immutable fields + labels for reports).
 * @param {number} index
 */
export function decodeMatrixScenario(index) {
  let q = Math.max(0, Math.floor(Number(index)));

  const bi = q % brainKeys.length;
  q = Math.floor(q / brainKeys.length);

  const ei = q % entityKeys.length;
  q = Math.floor(q / entityKeys.length);

  const ai = q % antKeys.length;
  q = Math.floor(q / antKeys.length);

  const pi = q % pathwayKeys.length;
  q = Math.floor(q / pathwayKeys.length);

  const ti = q % TRAFFIC.length;
  q = Math.floor(q / TRAFFIC.length);

  const ri = q % RSI.length;

  const brainKey = brainKeys[bi];
  const entityKey = entityKeys[ei];
  const antKey = antKeys[ai];
  const pathKey = pathwayKeys[pi];

  /** @type {Record<string, unknown>} */
  const scenario = {
    schema: 'z_omnai_core_scenario_v1',
    matrix_index: index,
    matrix_axes: {
      rsi_cycles: RSI[ri],
      traffic_kind: TRAFFIC[ti],
      pathway_preset: pathKey,
      ant_preset: antKey,
      entity_preset: entityKey,
      brain_preset: brainKey,
    },
    rsi_cycles: RSI[ri],
    traffic_kind: TRAFFIC[ti],
    brains: [...brainPresets[brainKey]],
    ants: { ...antPresets[antKey] },
    pathway: { ...pathwayPresets[pathKey] },
    entity: { ...entityPresets[entityKey] },
  };

  return scenario;
}

/**
 * Indices 0 … min(product-1, maxCount-1) inclusive.
 * @param {number} maxCount
 * @returns {number[]}
 */
export function matrixIndexRange(maxCount) {
  const n = Math.max(1, Math.min(MATRIX_DIMENSIONS_PRODUCT, Math.floor(Number(maxCount)) || 320));
  return Array.from({ length: n }, (_, i) => i);
}
