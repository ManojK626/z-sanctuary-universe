/**
 * Canonical Shadow pipeline stages — aligned to docs/vile/SHADOW_VALIDATION_PIPELINE.md
 */

export const VERIFICATION_STAGES = [
  'schema_validation',
  'safety_validation',
  'risk_validation',
  'compliance_validation',
  'shadow_verification',
] as const;

export const FINAL_STATUSES = ['approved', 'rejected', 'degraded'] as const;

export const OUTCOME_STATUSES = ['passed', 'rejected', 'degraded'] as const;

export const DEFAULT_PIPELINE_STAGE_ORDER: readonly (typeof VERIFICATION_STAGES)[number][] = [
  'schema_validation',
  'safety_validation',
  'risk_validation',
  'compliance_validation',
  'shadow_verification',
];
