import type { OBSERVABILITY_EVENT_KINDS, OBSERVABILITY_SEVERITIES } from '../constants';

export type ObservabilityEventKind = (typeof OBSERVABILITY_EVENT_KINDS)[number];

export type ObservabilitySeverity = (typeof OBSERVABILITY_SEVERITIES)[number];

export interface ObservabilityEventAudit {
  readonly actorId?: string;
  readonly action?: string;
  readonly resourceType?: string;
  readonly resourceId?: string;
  readonly immutable?: true;
}

export interface ObservabilityEventMetric {
  readonly name?: string;
  readonly value?: number;
  readonly unit?: string;
}

export type ObservabilityEventAttributes = Readonly<
  Record<string, string | number | boolean>
>;

/**
 * VILEObservabilityEvent — mirrors canonical JSON Schema v1 exactly.
 * @see docs/vile/platform-contracts/schemas/v1/observability-event.schema.json
 */
export interface ObservabilityEvent {
  readonly id: string;
  readonly kind: ObservabilityEventKind;
  readonly timestampIso: string;
  readonly service: string;
  readonly severity: ObservabilitySeverity;
  readonly correlationId?: string;
  readonly traceId?: string;
  readonly spanId?: string;
  readonly message?: string;
  readonly attributes?: ObservabilityEventAttributes;
  readonly audit?: ObservabilityEventAudit;
  readonly metric?: ObservabilityEventMetric;
}
