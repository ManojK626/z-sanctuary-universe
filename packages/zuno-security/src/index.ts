/**
 * @z-sanctuary/zuno-security
 *
 * Phase 2A Package 2 — shared security contracts and Zero Trust policy primitives.
 * Not authentication, authorization service, or encryption runtime.
 */

export {
  DATA_SENSITIVITIES,
  SECURITY_CLASSIFICATIONS,
  SENSITIVE_FIELD_PATTERNS,
  TRUST_LEVELS,
  VIOLATION_SEVERITIES,
} from './constants/classifications';

export type { SecurityClassification } from './types/security-classification';
export type { DataSensitivity } from './types/data-sensitivity';
export type { TrustLevel } from './types/trust-level';

export type {
  SecurityViolation,
  ValidationFailure,
  ValidationResult,
  ValidationSuccess,
  ViolationSeverity,
} from './types/validation-result';
export { validationFailure, validationSuccess } from './types/validation-result';

export type { ZeroTrustPolicy } from './types/zero-trust-policy';

export {
  evaluateTrustLevel,
  isDataSensitivity,
  isSecurityClassification,
  isTrustLevel,
  meetsTrustLevel,
} from './guards/trust-level';

export { assertNoViolations, assertSafeObject } from './guards/assertions';

export { validateRequiredFields } from './validators/required-fields';
export {
  detectUnknownFields,
  validateNoUnknownFields,
} from './validators/unknown-fields';
export {
  containsSensitiveFieldNames,
  detectSensitiveFields,
} from './validators/sensitive-fields';
export { wrapInputValidation, wrapOutputValidation } from './validators/input-output';

export {
  createZeroTrustPolicyDescriptor,
  validateZeroTrustPolicy,
} from './policies/zero-trust-policy';
