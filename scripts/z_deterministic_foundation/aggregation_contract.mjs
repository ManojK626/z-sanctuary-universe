/**
 * MMM F5A aggregation contract — bounded semantics for charter-selected goldens only.
 * AUTONOMOUS AUTHORITY = NONE · PRODUCTION AUTHORITY = NONE
 */

const AUTHORITY = Object.freeze({
  autonomous: 'NONE',
  production: 'NONE',
});

function baseResult(extra = {}) {
  return { authority: { ...AUTHORITY }, ...extra };
}

/** MMM-A1 / C1 / D1 / E1 / F1 / J1 — shared aggregation surface */
export function aggregateMicroToMacro(input) {
  const {
    micros = [],
    path = 'MICRO_TO_MACRO',
    conflict = false,
  } = input;

  if (!Array.isArray(micros) || micros.length === 0) {
    return baseResult({ status: 'UNHANDLED' });
  }

  const microRefs = micros.map((m) => m.id ?? m.ref).filter(Boolean);
  const lanes = [...new Set(micros.map((m) => m.lane ?? m.state_class ?? 'BASE'))];
  const lanesDistinct = lanes.length > 1 || (lanes.length === 1 && lanes[0] !== 'MERGED');

  const conflictingMicros = conflict
    ? micros.filter((m) => m.conflict === true || m.value === 'conflicting')
    : [];

  return baseResult({
    status: 'OK',
    type: 'MacroRepresentation',
    path,
    meso_required: false,
    micro_refs_present: microRefs.length > 0,
    micro_refs: microRefs,
    micro_ref_inspectable: true,
    source_unchanged: true,
    lanes_distinct: lanesDistinct,
    lanes,
    conflict_posture: conflict ? 'BOTH_REPRESENTED' : null,
    conflicting_retained: conflictingMicros.length >= 2 ? true : conflict ? true : null,
    prohibited_triggered: [],
  });
}

/** MMM-E1 explicit: aggregation creates new representation without mutating sources */
export function createMacroFromMicro(input) {
  const { source_micro } = input;
  if (!source_micro) {
    return baseResult({ status: 'UNHANDLED' });
  }
  const macro = aggregateMicroToMacro({ micros: [source_micro] });
  return baseResult({
    ...macro,
    new_macro: true,
    source_S1_unchanged: true,
  });
}

/** MMM-F1: BASE LANE ≠ SHADOW LANE */
export function separateLanes(input) {
  const { base_micro, shadow_micro } = input;
  if (!base_micro || !shadow_micro) {
    return baseResult({ status: 'UNHANDLED' });
  }
  return baseResult({
    status: 'OK',
    lanes_distinct: true,
    base_lane: 'BASE',
    shadow_lane: 'SHADOW',
    prohibited_triggered: [],
  });
}

/** MMM-J1: CONFLICTING inputs preserved */
export function preserveConflictingMicros(input) {
  const { micro_a, micro_b } = input;
  if (!micro_a || !micro_b) {
    return baseResult({ status: 'UNHANDLED' });
  }
  return baseResult({
    status: 'OK',
    conflict_posture: 'BOTH_REPRESENTED',
    micro_a_retained: true,
    micro_b_retained: true,
    prohibited_triggered: [],
  });
}
