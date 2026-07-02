import {
  SECURITY_CLASSIFICATIONS,
  DATA_SENSITIVITIES,
  TRUST_LEVELS,
} from '../constants/classifications';
import type { SecurityClassification } from '../types/security-classification';
import type { DataSensitivity } from '../types/data-sensitivity';
import type { TrustLevel } from '../types/trust-level';

export function isSecurityClassification(value: string): value is SecurityClassification {
  return (SECURITY_CLASSIFICATIONS as readonly string[]).includes(value);
}

export function isDataSensitivity(value: string): value is DataSensitivity {
  return (DATA_SENSITIVITIES as readonly string[]).includes(value);
}

export function isTrustLevel(value: string): value is TrustLevel {
  return (TRUST_LEVELS as readonly string[]).includes(value);
}

const TRUST_RANK: Record<TrustLevel, number> = {
  untrusted: 0,
  limited: 1,
  verified: 2,
  elevated: 3,
};

/**
 * Returns true when actor trust meets or exceeds required level (verify-before-trust).
 */
export function meetsTrustLevel(actor: TrustLevel, required: TrustLevel): boolean {
  return TRUST_RANK[actor] >= TRUST_RANK[required];
}

export function evaluateTrustLevel(
  actor: TrustLevel,
  required: TrustLevel,
): { allowed: boolean; actor: TrustLevel; required: TrustLevel } {
  return {
    allowed: meetsTrustLevel(actor, required),
    actor,
    required,
  };
}
