import { validationFailure, validationSuccess } from '../types/validation-result';
import type { ValidationResult } from '../types/validation-result';
import type { SecurityViolation } from '../types/validation-result';

export function detectUnknownFields(
  data: Record<string, unknown>,
  allowedKeys: readonly string[],
): readonly string[] {
  const allowed = new Set(allowedKeys);
  return Object.keys(data).filter((key) => !allowed.has(key));
}

export function validateNoUnknownFields(
  data: Record<string, unknown>,
  allowedKeys: readonly string[],
): ValidationResult<Record<string, unknown>> {
  const unknown = detectUnknownFields(data, allowedKeys);
  if (unknown.length === 0) {
    return validationSuccess(data);
  }

  const violations: SecurityViolation[] = unknown.map((field) => ({
    code: 'UNKNOWN_FIELD',
    message: `Unknown field not permitted: ${field}`,
    field,
    severity: 'medium',
  }));

  return validationFailure(violations);
}
