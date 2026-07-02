/**
 * @z-sanctuary/zuno-observability
 *
 * Phase 2A — shared observability contract (types, validator, builder).
 * Infrastructure-neutral. No logging vendors. No application logic.
 */

export {
  CANONICAL_SCHEMA_RELATIVE_PATH,
  OBSERVABILITY_EVENT_KINDS,
  OBSERVABILITY_SEVERITIES,
  PACKAGE_SCHEMA_RELATIVE_PATH,
} from './constants';

export type {
  ObservabilityEvent,
  ObservabilityEventAttributes,
  ObservabilityEventAudit,
  ObservabilityEventKind,
  ObservabilityEventMetric,
  ObservabilitySeverity,
} from './types/observability-event';

export {
  assertObservabilityEvent,
  getCanonicalSchemaPath,
  validateObservabilityEvent,
} from './validators/validate-observability-event';
export type {
  ValidationFailure,
  ValidationResult,
  ValidationSuccess,
} from './validators/validate-observability-event';

export {
  isObservabilityEventKind,
  isObservabilitySeverity,
  isValidTimestampIso,
} from './validators/timestamp';

export {
  ObservabilityEventBuilder,
  createObservabilityEventBuilder,
} from './builders/observability-event-builder';
export type { ObservabilityEventBuilderOptions } from './builders/observability-event-builder';
