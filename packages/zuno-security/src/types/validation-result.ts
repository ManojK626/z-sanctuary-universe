import type { VIOLATION_SEVERITIES } from '../constants/classifications';

export type ViolationSeverity = (typeof VIOLATION_SEVERITIES)[number];

export interface SecurityViolation {
  readonly code: string;
  readonly message: string;
  readonly field?: string;
  readonly severity: ViolationSeverity;
}

export interface ValidationSuccess<T> {
  readonly ok: true;
  readonly value: T;
  readonly violations: readonly [];
}

export interface ValidationFailure {
  readonly ok: false;
  readonly violations: readonly SecurityViolation[];
}

export type ValidationResult<T = unknown> = ValidationSuccess<T> | ValidationFailure;

export function validationSuccess<T>(value: T): ValidationSuccess<T> {
  return { ok: true, value, violations: [] };
}

export function validationFailure(
  violations: readonly SecurityViolation[],
): ValidationFailure {
  return { ok: false, violations };
}
