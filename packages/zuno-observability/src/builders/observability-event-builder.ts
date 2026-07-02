import { randomUUID } from 'node:crypto';
import type {
  ObservabilityEvent,
  ObservabilityEventAttributes,
  ObservabilityEventAudit,
  ObservabilityEventKind,
  ObservabilityEventMetric,
  ObservabilitySeverity,
} from '../types/observability-event';
import { assertObservabilityEvent } from '../validators/validate-observability-event';
import { isValidTimestampIso } from '../validators/timestamp';

export interface ObservabilityEventBuilderOptions {
  readonly service: string;
  readonly kind: ObservabilityEventKind;
  readonly severity: ObservabilitySeverity;
  readonly id?: string;
  readonly timestampIso?: string;
  readonly correlationId?: string;
  readonly traceId?: string;
  readonly spanId?: string;
  readonly message?: string;
  readonly attributes?: ObservabilityEventAttributes;
  readonly audit?: ObservabilityEventAudit;
  readonly metric?: ObservabilityEventMetric;
}

export class ObservabilityEventBuilder {
  private readonly service: string;
  private kind: ObservabilityEventKind;
  private severity: ObservabilitySeverity;
  private id: string;
  private timestampIso: string;
  private correlationId?: string;
  private traceId?: string;
  private spanId?: string;
  private message?: string;
  private attributes?: ObservabilityEventAttributes;
  private audit?: ObservabilityEventAudit;
  private metric?: ObservabilityEventMetric;

  constructor(options: ObservabilityEventBuilderOptions) {
    this.service = options.service;
    this.kind = options.kind;
    this.severity = options.severity;
    this.id = options.id ?? randomUUID();
    this.timestampIso = options.timestampIso ?? new Date().toISOString();
    this.correlationId = options.correlationId;
    this.traceId = options.traceId;
    this.spanId = options.spanId;
    this.message = options.message;
    this.attributes = options.attributes;
    this.audit = options.audit;
    this.metric = options.metric;
  }

  withKind(kind: ObservabilityEventKind): this {
    this.kind = kind;
    return this;
  }

  withSeverity(severity: ObservabilitySeverity): this {
    this.severity = severity;
    return this;
  }

  withCorrelationId(correlationId: string): this {
    this.correlationId = correlationId;
    return this;
  }

  withTraceIds(traceId: string, spanId?: string): this {
    this.traceId = traceId;
    this.spanId = spanId;
    return this;
  }

  withMessage(message: string): this {
    this.message = message;
    return this;
  }

  withAttributes(attributes: ObservabilityEventAttributes): this {
    this.attributes = attributes;
    return this;
  }

  withAudit(audit: ObservabilityEventAudit): this {
    this.audit = audit;
    return this;
  }

  withMetric(metric: ObservabilityEventMetric): this {
    this.metric = metric;
    return this;
  }

  build(): ObservabilityEvent {
    if (!isValidTimestampIso(this.timestampIso)) {
      throw new Error(`Invalid timestampIso: ${this.timestampIso}`);
    }

    const event: ObservabilityEvent = {
      id: this.id,
      kind: this.kind,
      timestampIso: this.timestampIso,
      service: this.service,
      severity: this.severity,
      ...(this.correlationId !== undefined ? { correlationId: this.correlationId } : {}),
      ...(this.traceId !== undefined ? { traceId: this.traceId } : {}),
      ...(this.spanId !== undefined ? { spanId: this.spanId } : {}),
      ...(this.message !== undefined ? { message: this.message } : {}),
      ...(this.attributes !== undefined ? { attributes: this.attributes } : {}),
      ...(this.audit !== undefined ? { audit: this.audit } : {}),
      ...(this.metric !== undefined ? { metric: this.metric } : {}),
    };

    return assertObservabilityEvent(event);
  }
}

export function createObservabilityEventBuilder(
  service: string,
  kind: ObservabilityEventKind,
  severity: ObservabilitySeverity,
): ObservabilityEventBuilder {
  return new ObservabilityEventBuilder({ service, kind, severity });
}
