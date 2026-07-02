import type { ValidationEvidence } from './verification-outcome';

/**
 * Immutable validation context passed to each rule.
 * Evidence is appended only by the framework executor — rules return new evidence in outcomes.
 */
export interface ValidationContext {
  readonly correlationId: string;
  readonly input: unknown;
  readonly serviceScope: string;
  readonly startedAtIso: string;
  readonly metadata?: Readonly<Record<string, string>>;
  readonly priorEvidence: readonly ValidationEvidence[];
}
