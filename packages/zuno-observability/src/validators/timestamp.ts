import { OBSERVABILITY_EVENT_KINDS, OBSERVABILITY_SEVERITIES } from '../constants';
import type {
  ObservabilityEventKind,
  ObservabilitySeverity,
} from '../types/observability-event';

export function isObservabilityEventKind(value: string): value is ObservabilityEventKind {
  return (OBSERVABILITY_EVENT_KINDS as readonly string[]).includes(value);
}

export function isObservabilitySeverity(value: string): value is ObservabilitySeverity {
  return (OBSERVABILITY_SEVERITIES as readonly string[]).includes(value);
}

/**
 * Validates ISO 8601 date-time strings accepted by the canonical schema.
 */
export function isValidTimestampIso(value: string): boolean {
  if (typeof value !== 'string' || value.length === 0) {
    return false;
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed);
}
