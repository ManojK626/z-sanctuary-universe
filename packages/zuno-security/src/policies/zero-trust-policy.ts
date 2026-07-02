import { isSecurityClassification } from '../guards/trust-level';
import { isTrustLevel } from '../guards/trust-level';
import {
  validationFailure,
  validationSuccess,
} from '../types/validation-result';
import type { ValidationResult } from '../types/validation-result';
import type { SecurityViolation } from '../types/validation-result';
import type { ZeroTrustPolicy } from '../types/zero-trust-policy';

export function validateZeroTrustPolicy(data: unknown): ValidationResult<ZeroTrustPolicy> {
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    return validationFailure([
      {
        code: 'POLICY_NOT_OBJECT',
        message: 'ZeroTrustPolicy must be an object',
        severity: 'high',
      },
    ]);
  }

  const record = data as Record<string, unknown>;
  const violations: SecurityViolation[] = [];

  if (typeof record.id !== 'string' || record.id.length === 0) {
    violations.push({
      code: 'POLICY_INVALID_ID',
      message: 'Policy id must be a non-empty string',
      field: 'id',
      severity: 'high',
    });
  }

  if (typeof record.name !== 'string' || record.name.length === 0) {
    violations.push({
      code: 'POLICY_INVALID_NAME',
      message: 'Policy name must be a non-empty string',
      field: 'name',
      severity: 'medium',
    });
  }

  if (record.verifyBeforeTrust !== true) {
    violations.push({
      code: 'POLICY_VERIFY_BEFORE_TRUST',
      message: 'verifyBeforeTrust must be true (Zero Trust)',
      field: 'verifyBeforeTrust',
      severity: 'high',
    });
  }

  if (typeof record.leastPrivilegeLabel !== 'string' || record.leastPrivilegeLabel.length === 0) {
    violations.push({
      code: 'POLICY_LEAST_PRIVILEGE',
      message: 'leastPrivilegeLabel must be a non-empty string',
      field: 'leastPrivilegeLabel',
      severity: 'medium',
    });
  }

  if (typeof record.requiredTrustLevel !== 'string' || !isTrustLevel(record.requiredTrustLevel)) {
    violations.push({
      code: 'POLICY_TRUST_LEVEL',
      message: 'requiredTrustLevel must be a valid TrustLevel',
      field: 'requiredTrustLevel',
      severity: 'high',
    });
  }

  if (!Array.isArray(record.allowedClassifications) || record.allowedClassifications.length === 0) {
    violations.push({
      code: 'POLICY_CLASSIFICATIONS',
      message: 'allowedClassifications must be a non-empty array',
      field: 'allowedClassifications',
      severity: 'high',
    });
  } else {
    for (const item of record.allowedClassifications) {
      if (typeof item !== 'string' || !isSecurityClassification(item)) {
        violations.push({
          code: 'POLICY_CLASSIFICATION_INVALID',
          message: 'allowedClassifications contains invalid SecurityClassification',
          field: 'allowedClassifications',
          severity: 'high',
        });
        break;
      }
    }
  }

  if (record.explicitValidationRequired !== true) {
    violations.push({
      code: 'POLICY_EXPLICIT_VALIDATION',
      message: 'explicitValidationRequired must be true',
      field: 'explicitValidationRequired',
      severity: 'high',
    });
  }

  if (record.immutableResult !== true) {
    violations.push({
      code: 'POLICY_IMMUTABLE_RESULT',
      message: 'immutableResult must be true',
      field: 'immutableResult',
      severity: 'medium',
    });
  }

  if (violations.length > 0) {
    return validationFailure(violations);
  }

  const policy: ZeroTrustPolicy = {
    id: record.id as string,
    name: record.name as string,
    verifyBeforeTrust: true,
    leastPrivilegeLabel: record.leastPrivilegeLabel as string,
    requiredTrustLevel: record.requiredTrustLevel as ZeroTrustPolicy['requiredTrustLevel'],
    allowedClassifications: record.allowedClassifications as ZeroTrustPolicy['allowedClassifications'],
    explicitValidationRequired: true,
    immutableResult: true,
  };

  return validationSuccess(policy);
}

/**
 * Returns a frozen policy descriptor — policy describes behaviour only.
 */
export function createZeroTrustPolicyDescriptor(
  input: Omit<ZeroTrustPolicy, 'verifyBeforeTrust' | 'explicitValidationRequired' | 'immutableResult'>,
): ZeroTrustPolicy {
  const policy: ZeroTrustPolicy = {
    ...input,
    verifyBeforeTrust: true,
    explicitValidationRequired: true,
    immutableResult: true,
  };
  const check = validateZeroTrustPolicy(policy);
  if (!check.ok) {
    const detail = check.violations.map((v) => v.message).join('; ');
    throw new Error(`Invalid ZeroTrustPolicy: ${detail}`);
  }
  return Object.freeze(policy);
}
