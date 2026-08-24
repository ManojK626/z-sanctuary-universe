/**
 * Shadow F5A contract — validate explicit candidates only; no autonomous generation.
 * AUTONOMOUS AUTHORITY = NONE · PRODUCTION AUTHORITY = NONE
 */

const AUTHORITY = Object.freeze({
  autonomous: 'NONE',
  production: 'NONE',
});

function baseResult(extra = {}) {
  return { authority: { ...AUTHORITY }, ...extra };
}

/** SH-A1: SHADOW ≠ OBSERVED */
export function validateShadowIdentity(input) {
  const { base, shadow_candidate } = input;
  if (!shadow_candidate) {
    return baseResult({ status: 'UNHANDLED' });
  }
  const stateClass = shadow_candidate.state_class ?? 'SHADOW';
  const prohibited = [];
  if (stateClass === 'OBSERVED') prohibited.push('reclassify_shadow_as_observation');
  return baseResult({
    status: prohibited.length ? 'FAIL' : 'OK',
    state_class: 'SHADOW',
    field_role: 'ShadowState',
    base_unchanged_class: base?.state_class ?? 'OBSERVED',
    prohibited_triggered: prohibited,
  });
}

/** SH-B2: Missing base → INVALID/INCOMPLETE */
export function validateBaseReference(input) {
  const { base_reference } = input;
  if (base_reference === 'absent' || base_reference === undefined || base_reference === null) {
    return baseResult({
      status: 'OK',
      validity: ['INVALID', 'INCOMPLETE'],
      prohibited_triggered: [],
    });
  }
  if (base_reference === 'explicit' || base_reference) {
    return baseResult({
      status: 'OK',
      validity: 'READY',
      reference_present: true,
      prohibited_triggered: [],
    });
  }
  return baseResult({ status: 'UNHANDLED' });
}

/** SH-C3: HIDDEN_ASSUMPTIONS → INCOMPLETE */
export function validateAssumptions(input) {
  const { assumptions_declared, depends_on_undeclared_changed_assumption } = input;
  if (depends_on_undeclared_changed_assumption === true) {
    return baseResult({
      status: 'OK',
      validity: 'INCOMPLETE',
      prohibited_triggered: [],
    });
  }
  if (assumptions_declared === true) {
    return baseResult({
      status: 'OK',
      assumptions: { declared: true, inspectable: true },
      validity: 'READY',
      prohibited_triggered: [],
    });
  }
  return baseResult({ status: 'UNHANDLED' });
}

/** SH-G2: COUNTERFACTUAL ≠ CAUSAL PROOF */
export function validateCounterfactual(input) {
  const { shadow_class, claims_causality } = input;
  if (shadow_class !== 'COUNTERFACTUAL') {
    return baseResult({ status: 'UNHANDLED' });
  }
  const prohibited = [];
  if (claims_causality === true) {
    prohibited.push('claim_X_caused_Y_solely_from_shadow_delta');
  }
  return baseResult({
    status: prohibited.length ? 'FAIL' : 'OK',
    role: 'alternative_reasoning',
    class: 'COUNTERFACTUAL',
    prohibited_triggered: prohibited,
  });
}

/** SH-L1: CONTROL_BRANCH ≠ SHADOW */
export function validateControlBranch(input) {
  const { control } = input;
  if (!control) {
    return baseResult({ status: 'UNHANDLED' });
  }
  return baseResult({
    status: 'OK',
    is_shadow: false,
    branches: 'control_only',
    prohibited_triggered: [],
  });
}

/** SH-Y5: MACRO SHADOW remains traceable */
export function validateMacroShadowTraceability(input) {
  const { macro_shadow } = input;
  if (!macro_shadow) {
    return baseResult({ status: 'UNHANDLED' });
  }
  const traceableTo = [];
  if (macro_shadow.lower_grain_shadow_refs) traceableTo.push('lower_grain_shadow_refs');
  if (macro_shadow.base_refs) traceableTo.push('base_refs');
  if (macro_shadow.assumptions) traceableTo.push('assumptions');
  if (macro_shadow.provenance) traceableTo.push('provenance');

  const orphan = traceableTo.length === 0;
  return baseResult({
    status: orphan ? 'FAIL' : 'OK',
    traceable_to: traceableTo,
    prohibited_triggered: orphan ? ['orphan_macro_shadow'] : [],
  });
}
