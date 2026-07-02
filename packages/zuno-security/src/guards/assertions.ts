import type { ValidationResult } from '../types/validation-result';

export function assertSafeObject<T>(
  result: ValidationResult<T>,
  errorPrefix = 'Security assertion failed',
): asserts result is { ok: true; value: T; violations: readonly [] } {
  if (!result.ok) {
    const detail = result.violations.map((v) => v.message).join('; ');
    throw new Error(`${errorPrefix}: ${detail}`);
  }
}

export function assertNoViolations(
  violations: readonly { message: string }[],
  errorPrefix = 'Security assertion failed',
): void {
  if (violations.length > 0) {
    const detail = violations.map((v) => v.message).join('; ');
    throw new Error(`${errorPrefix}: ${detail}`);
  }
}
