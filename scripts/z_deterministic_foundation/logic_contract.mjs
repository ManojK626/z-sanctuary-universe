/**
 * Z Logic F5A contract — explicit functions only; no DSL/parser/eval.
 * AUTONOMOUS AUTHORITY = NONE · PRODUCTION AUTHORITY = NONE
 */

const AUTHORITY = Object.freeze({
  autonomous: 'NONE',
  production: 'NONE',
});

function baseResult(extra = {}) {
  return { authority: { ...AUTHORITY }, ...extra };
}

/** ZL-A3: UNKNOWN must not coerce to Boolean */
export function evaluatePredicate(input) {
  const { evidence } = input;
  if (evidence === 'UNKNOWN') {
    return baseResult({
      status: 'OK',
      predicate_result: null,
      failure_posture: 'insufficient_evidence_explicit',
      evidence_condition: 'UNKNOWN',
      prohibited_triggered: [],
    });
  }
  if (evidence === 'MISSING') {
    return baseResult({
      status: 'OK',
      predicate_result: null,
      failure_posture: 'insufficient_evidence_explicit',
      evidence_condition: 'MISSING',
      prohibited_triggered: [],
    });
  }
  if (evidence === 'CONFLICTING') {
    return baseResult({
      status: 'OK',
      predicate_result: null,
      state_posture: 'conflict_preserved',
      evidence_condition: 'CONFLICTING',
      prohibited_triggered: [],
    });
  }
  if (evidence === true || evidence === 'TRUE') {
    return baseResult({
      status: 'OK',
      predicate_result: 'TRUE',
      evidence_condition: 'TRUE',
      evidence_unchanged: true,
      prohibited_triggered: [],
    });
  }
  if (evidence === false || evidence === 'FALSE') {
    return baseResult({
      status: 'OK',
      predicate_result: 'FALSE',
      evidence_condition: 'FALSE',
      evidence_unchanged: true,
      prohibited_triggered: [],
    });
  }
  return baseResult({ status: 'UNHANDLED', predicate_result: null });
}

/** ZL-C1: IF TRUE makes THEN eligible; not authorized */
export function evaluateIf(input) {
  const { predicate_result } = input;
  if (predicate_result === 'TRUE') {
    return baseResult({
      status: 'OK',
      control_outcome: 'THEN_path_eligible',
      authorized: false,
      prohibited_triggered: [],
    });
  }
  return baseResult({
    status: 'OK',
    control_outcome: 'THEN_path_not_eligible',
    authorized: false,
    prohibited_triggered: [],
  });
}

/** ZL-D1: ELSE is control path only; not Shadow */
export function evaluateElse(input) {
  return baseResult({
    status: 'OK',
    control_outcome: 'control_path',
    shadow_posture: 'NOT_SHADOW',
    prohibited_triggered: [],
  });
}

/** ZL-O1: HOLD / BLOCK / STOP remain distinct */
export function evaluateHoldBlockStop(input) {
  const { outcome } = input;
  const definitions = {
    HOLD: 'pause_preserve_state',
    BLOCK: 'prohibit_candidate_path',
    STOP: 'terminate_bounded_path',
  };
  if (!outcome || !definitions[outcome]) {
    return baseResult({ status: 'UNHANDLED' });
  }
  const allDistinct =
    definitions.HOLD !== definitions.BLOCK &&
    definitions.HOLD !== definitions.STOP &&
    definitions.BLOCK !== definitions.STOP;
  return baseResult({
    status: 'OK',
    control_outcome: { [outcome]: definitions[outcome] },
    all_distinct: allDistinct,
    history_posture: 'preserved',
    prohibited_triggered: [],
  });
}

/** ZL-J2: REQUIRE failure is visible */
export function evaluateRequire(input) {
  const { precondition_present } = input;
  if (precondition_present === false) {
    return baseResult({
      status: 'OK',
      failure_posture: 'explicit_non_eligibility',
      eligible: false,
      prohibited_triggered: [],
    });
  }
  if (precondition_present === true) {
    return baseResult({
      status: 'OK',
      eligible: true,
      prohibited_triggered: [],
    });
  }
  return baseResult({ status: 'UNHANDLED' });
}

/** ZL-AL1: Predicate evaluation ≠ evidence mutation */
export function evaluatePredicateNonMutation(input) {
  const result = evaluatePredicate(input);
  return baseResult({
    ...result,
    state_posture: 'evidence_unchanged',
  });
}
