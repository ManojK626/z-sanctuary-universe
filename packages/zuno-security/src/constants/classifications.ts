/**
 * Canonical security enumerations — aligned to docs/vile/SECURITY_ZERO_TRUST.md
 * Do not extend without VILE architecture PR.
 */

export const SECURITY_CLASSIFICATIONS = [
  'public',
  'internal',
  'confidential',
  'restricted',
] as const;

export const DATA_SENSITIVITIES = [
  'none',
  'low',
  'medium',
  'high',
  'critical',
] as const;

export const TRUST_LEVELS = [
  'untrusted',
  'limited',
  'verified',
  'elevated',
] as const;

/** Field name substrings suggesting sensitive data (heuristic only — not encryption). */
export const SENSITIVE_FIELD_PATTERNS = [
  'password',
  'passwd',
  'secret',
  'token',
  'apikey',
  'api_key',
  'authorization',
  'credential',
  'ssn',
  'social_security',
  'credit_card',
  'card_number',
  'cvv',
  'private_key',
  'refresh_token',
  'access_token',
] as const;

export const VIOLATION_SEVERITIES = ['low', 'medium', 'high'] as const;
