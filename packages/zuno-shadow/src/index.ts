/**
 * @z-sanctuary/zuno-shadow
 *
 * Phase 2A Package 3 — Shadow Validation Framework (contracts + executor).
 * Not an AI runtime. No LLM. No network.
 */

export {
  DEFAULT_PIPELINE_STAGE_ORDER,
  FINAL_STATUSES,
  OUTCOME_STATUSES,
  VERIFICATION_STAGES,
} from './constants/stages';

export type { VerificationStage } from './types/verification-stage';
export type {
  RejectionReason,
  ValidationEvidence,
  VerificationOutcome,
  VerificationOutcomeStatus,
} from './types/verification-outcome';
export type { ValidationContext } from './types/validation-context';
export type { ShadowRule } from './types/shadow-rule';
export type { ShadowPipeline } from './types/shadow-pipeline';
export type {
  FinalValidationStatus,
  PipelineExecutionSummary,
  ShadowValidationResult,
} from './types/shadow-validation-result';

export { EvidenceBuilder, createEvidence } from './builders/evidence-builder';
export type { EvidenceBuilderOptions } from './builders/evidence-builder';

export {
  ValidationContextBuilder,
  createValidationContext,
} from './builders/validation-context-builder';
export type { ValidationContextBuilderOptions } from './builders/validation-context-builder';

export { ResultBuilder, createShadowValidationResult } from './builders/result-builder';
export type { ResultBuilderInput } from './builders/result-builder';

export {
  ShadowPipelineBuilder,
  createDefaultShadowPipeline,
} from './builders/shadow-pipeline-builder';

export { validateShadowPipeline, rulesForStage } from './validators/pipeline-config';
export type { PipelineConfigValidation } from './validators/pipeline-config';

export { executeShadowPipeline } from './pipeline/executor';

export { createPassRule, createRejectRule } from './rules/rule-factories';
export type { PassRuleOptions, RejectRuleOptions } from './rules/rule-factories';
