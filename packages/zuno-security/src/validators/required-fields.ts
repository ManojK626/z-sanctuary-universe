import { validationFailure, validationSuccess } from '../types/validation-result';
import type { ValidationResult } from '../types/validation-result';
import type { SecurityViolation } from '../types/validation-result';

export function validateRequiredFields(
  data: Record<string, unknown>,
  required: readonly string[],
): ValidationResult<Record<string, unknown>> {
  const violations: SecurityViolation[] = [];

  for (const field of required) {
    if (!(field in data)) {
      violations.push({
        code: 'REQUIRED_FIELD_MISSING',
        message: `Required field missing: ${field}`,
        field,
        severity: 'high',
      });
      continue;
    }
    const value = data[field];
    if (value === null || value === undefined) {
      violations.push({
        code: 'REQUIRED_FIELD_EMPTY',
        message: `Required field empty: ${field}`,
        field,
        severity: 'high',
      });
    }
  }

  if (violations.length > 0) {
    return validationFailure(violations);
  }
  return validationSuccess(data);
}
