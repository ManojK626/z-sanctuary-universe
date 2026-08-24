/**
 * C360 F5A field contract — bounded semantics for charter-selected goldens only.
 * AUTONOMOUS AUTHORITY = NONE · PRODUCTION AUTHORITY = NONE
 */

const AUTHORITY = Object.freeze({
  autonomous: 'NONE',
  production: 'NONE',
});

function baseResult(extra = {}) {
  return { authority: { ...AUTHORITY }, ...extra };
}

/** C360-A1: UNKNOWN ≠ ZERO */
export function classifyValueStatus(input) {
  const { value_status } = input;
  if (value_status === 'unknown') {
    return baseResult({
      status: 'OK',
      value_class: 'UNKNOWN',
      prohibited_triggered: [],
    });
  }
  return baseResult({ status: 'UNHANDLED', value_class: null });
}

/** C360-A2: MISSING ≠ ZERO */
export function classifyMissingObservation(input) {
  const { required_observation } = input;
  if (required_observation === 'absent') {
    return baseResult({
      status: 'OK',
      value_class: ['MISSING', 'NOT_OBSERVED'],
      prohibited_triggered: [],
    });
  }
  return baseResult({ status: 'UNHANDLED', value_class: null });
}

/** C360-B4: AI_PROPOSED ≠ OBSERVED_FACT */
export function classifyAiProvenance(input) {
  const { output_kind } = input;
  if (output_kind === 'ai_candidate') {
    return baseResult({
      status: 'OK',
      provenance: 'AI_PROPOSED',
      prohibited_triggered: [],
    });
  }
  return baseResult({ status: 'UNHANDLED', provenance: null });
}

/** C360-D1: OBSERVED ≠ SHADOW; both retained */
export function combineObservedAndShadow(input) {
  const { observed_state, shadow_state, observed, shadow } = input;
  const obs = observed ?? observed_state;
  const shd = shadow ?? shadow_state;
  if (obs === undefined && shd === undefined) {
    return baseResult({ status: 'UNHANDLED' });
  }
  const observedRetained = obs !== undefined && obs !== null;
  const shadowRetained = shd !== undefined && shd !== null;
  return baseResult({
    status: 'OK',
    observed_retained: observedRetained,
    shadow_retained: shadowRetained,
    classes_distinct: observedRetained && shadowRetained,
    observed: obs,
    shadow: shd,
    prohibited_triggered: [],
  });
}

/** C360-E1: PREDICTED ≠ OBSERVED */
export function classifyPrediction(input) {
  const { future_prediction } = input;
  if (future_prediction === true) {
    return baseResult({
      status: 'OK',
      state_class: 'PREDICTED_STATE',
      prohibited_triggered: [],
    });
  }
  return baseResult({ status: 'UNHANDLED', state_class: null });
}

/** C360-F1: Conflicting observations both retained */
export function preserveConflict(input) {
  const { source_a, source_b } = input;
  if (source_a === undefined || source_b === undefined) {
    return baseResult({ status: 'UNHANDLED' });
  }
  const conflict = source_a !== source_b;
  return baseResult({
    status: 'OK',
    a_retained: true,
    b_retained: true,
    conflict_mark: conflict ? 'CONFLICTING' : null,
    source_a,
    source_b,
    prohibited_triggered: [],
  });
}

/** C360-G1: STATE_TRANSITION ≠ STATE_OVERWRITE */
export function acceptStateTransition(input) {
  const { s1, s2 } = input;
  if (s1 === undefined || s2 === undefined) {
    return baseResult({ status: 'UNHANDLED' });
  }
  return baseResult({
    status: 'OK',
    s1_retained: true,
    s2_added: true,
    transition_representable: true,
    states: [s1, s2],
    prohibited_triggered: [],
  });
}

/** C360-Q1: Authority laws bundle */
export function checkAuthorityLaws(input) {
  const { scenario } = input;
  const laws = [
    'REPRESENTATION ≠ AUTHORITY',
    'MORE DIMENSIONS ≠ MORE TRUTH',
    'MORE OBSERVERS ≠ MORE AUTHORITY',
    'SWARM CONSENSUS ≠ STEWARD DECISION',
    'AI PROPOSAL ≠ CANONICAL ACCEPTANCE',
    'TRUE ≠ AUTHORIZED',
    'READY ≠ DEPLOY',
    'GO ≠ DEPLOY',
  ];
  const prohibited = [
    'auto_authorize_from_representation',
    'auto_authorize_from_swarm',
    'auto_deploy_from_GO',
  ];
  let authorityCreated = false;
  if (scenario === 'representation_only') {
    authorityCreated = false;
  } else if (scenario === 'swarm_consensus') {
    authorityCreated = false;
  } else if (scenario === 'ai_proposal') {
    authorityCreated = false;
  } else if (scenario === 'more_dimensions' || scenario === 'more_observers') {
    authorityCreated = false;
  }
  return baseResult({
    status: 'OK',
    laws,
    scenario,
    authority_created: authorityCreated,
    prohibited_triggered: authorityCreated ? prohibited : [],
  });
}
