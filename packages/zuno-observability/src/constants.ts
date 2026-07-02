/**
 * Canonical observability contract constants.
 * Values MUST match docs/vile/platform-contracts/schemas/v1/observability-event.schema.json
 */

export const OBSERVABILITY_EVENT_KINDS = [
  'log',
  'metric',
  'trace_span',
  'audit',
  'health',
] as const;

export const OBSERVABILITY_SEVERITIES = [
  'debug',
  'info',
  'warn',
  'error',
  'critical',
] as const;

export const CANONICAL_SCHEMA_RELATIVE_PATH =
  '../../../docs/vile/platform-contracts/schemas/v1/observability-event.schema.json';

export const PACKAGE_SCHEMA_RELATIVE_PATH =
  '../schemas/v1/observability-event.schema.json';
