/**
 * Z Deterministic Foundation Kernel — F5A thin composition surface.
 * AUTONOMOUS AUTHORITY = NONE · PRODUCTION AUTHORITY = NONE
 */

export {
  classifyValueStatus,
  classifyMissingObservation,
  classifyAiProvenance,
  combineObservedAndShadow,
  classifyPrediction,
  preserveConflict,
  acceptStateTransition,
  checkAuthorityLaws,
} from './field_contract.mjs';

export {
  aggregateMicroToMacro,
  createMacroFromMicro,
  separateLanes,
  preserveConflictingMicros,
} from './aggregation_contract.mjs';

export {
  validateShadowIdentity,
  validateBaseReference,
  validateAssumptions,
  validateCounterfactual,
  validateControlBranch,
  validateMacroShadowTraceability,
} from './shadow_contract.mjs';

export {
  evaluatePredicate,
  evaluateIf,
  evaluateElse,
  evaluateHoldBlockStop,
  evaluateRequire,
  evaluatePredicateNonMutation,
} from './logic_contract.mjs';

export const KERNEL_META = Object.freeze({
  name: 'Z Deterministic Foundation Kernel',
  maturity: 'F5A_THIN_DETERMINISTIC_PROOF',
  autonomous_authority: 'NONE',
  production_authority: 'NONE',
});
