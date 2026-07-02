import { validationFailure } from '../types/validation-result';
import type { ValidationResult } from '../types/validation-result';
import type { SecurityViolation } from '../types/validation-result';
import { detectSensitiveFields } from './sensitive-fields';

export function wrapInputValidation<T>(
  data: unknown,
  validate: (record: Record<string, unknown>) => ValidationResult<T>,
): ValidationResult<T> {
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    return validationFailure([
      {
        code: 'INPUT_NOT_OBJECT',
        message: 'Input must be a plain object',
        severity: 'high',
      },
    ]);
  }
  return validate(data as Record<string, unknown>);
}

export function wrapOutputValidation<T extends Record<string, unknown>>(
  data: T,
  options?: { rejectSensitiveKeys?: boolean },
): ValidationResult<T> {
  const rejectSensitive = options?.rejectSensitiveKeys ?? true;
  const sensitive = detectSensitiveFields(data, { deep: true });

  if (!rejectSensitive || sensitive.length === 0) {
    return { ok: true, value: data, violations: [] };
  }

  const violations: SecurityViolation[] = sensitive.map((field) => ({
    code: 'OUTPUT_SENSITIVE_FIELD',
    message: `Sensitive field must not appear in output: ${field}`,
    field,
    severity: 'high',
  }));

  return validationFailure(violations);
}
