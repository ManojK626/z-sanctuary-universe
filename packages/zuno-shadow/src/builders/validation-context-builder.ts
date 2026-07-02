import type { ValidationContext } from '../types/validation-context';

export interface ValidationContextBuilderOptions {
  readonly correlationId: string;
  readonly input: unknown;
  readonly serviceScope: string;
  readonly startedAtIso?: string;
  readonly metadata?: Readonly<Record<string, string>>;
  readonly priorEvidence?: ValidationContext['priorEvidence'];
}

export class ValidationContextBuilder {
  private readonly correlationId: string;
  private readonly input: unknown;
  private readonly serviceScope: string;
  private readonly startedAtIso: string;
  private metadata?: Readonly<Record<string, string>>;
  private priorEvidence: ValidationContext['priorEvidence'];

  constructor(options: ValidationContextBuilderOptions) {
    this.correlationId = options.correlationId;
    this.input = options.input;
    this.serviceScope = options.serviceScope;
    this.startedAtIso = options.startedAtIso ?? new Date().toISOString();
    this.metadata = options.metadata;
    this.priorEvidence = options.priorEvidence ?? [];
  }

  withMetadata(metadata: Readonly<Record<string, string>>): this {
    this.metadata = metadata;
    return this;
  }

  withPriorEvidence(priorEvidence: ValidationContext['priorEvidence']): this {
    this.priorEvidence = Object.freeze([...priorEvidence]);
    return this;
  }

  build(): ValidationContext {
    return Object.freeze({
      correlationId: this.correlationId,
      input: this.input,
      serviceScope: this.serviceScope,
      startedAtIso: this.startedAtIso,
      priorEvidence: Object.freeze([...this.priorEvidence]),
      ...(this.metadata !== undefined ? { metadata: this.metadata } : {}),
    });
  }
}

export function createValidationContext(
  correlationId: string,
  input: unknown,
  serviceScope: string
): ValidationContext {
  return new ValidationContextBuilder({ correlationId, input, serviceScope }).build();
}
