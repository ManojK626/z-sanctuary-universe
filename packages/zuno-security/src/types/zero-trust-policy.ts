import type { SecurityClassification } from './security-classification';
import type { TrustLevel } from './trust-level';

/**
 * Zero Trust policy contract — describes behaviour; does not execute infrastructure.
 * @see docs/vile/SECURITY_ZERO_TRUST.md
 */
export interface ZeroTrustPolicy {
  readonly id: string;
  readonly name: string;
  /** Verify every request — no implicit trust */
  readonly verifyBeforeTrust: true;
  /** Least-privilege metadata label (e.g. role or scope name) */
  readonly leastPrivilegeLabel: string;
  readonly requiredTrustLevel: TrustLevel;
  readonly allowedClassifications: readonly SecurityClassification[];
  /** Boundary validation must run explicitly */
  readonly explicitValidationRequired: true;
  readonly immutableResult: true;
}
