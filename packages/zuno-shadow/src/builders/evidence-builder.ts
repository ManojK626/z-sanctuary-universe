import { randomUUID } from 'node:crypto';
import type { ValidationEvidence } from '../types/verification-outcome';
import type { VerificationStage } from '../types/verification-stage';

export interface EvidenceBuilderOptions {
  readonly stage: VerificationStage;
  readonly ruleId: string;
  readonly detail: string;
  readonly id?: string;
  readonly recordedAtIso?: string;
  readonly metadata?: Readonly<Record<string, string>>;
}

export class EvidenceBuilder {
  private readonly stage: VerificationStage;
  private readonly ruleId: string;
  private detail: string;
  private readonly id: string;
  private readonly recordedAtIso: string;
  private metadata?: Readonly<Record<string, string>>;

  constructor(options: EvidenceBuilderOptions) {
    this.stage = options.stage;
    this.ruleId = options.ruleId;
    this.detail = options.detail;
    this.id = options.id ?? randomUUID();
    this.recordedAtIso = options.recordedAtIso ?? new Date().toISOString();
    this.metadata = options.metadata;
  }

  withDetail(detail: string): this {
    this.detail = detail;
    return this;
  }

  withMetadata(metadata: Readonly<Record<string, string>>): this {
    this.metadata = metadata;
    return this;
  }

  build(): ValidationEvidence {
    return Object.freeze({
      id: this.id,
      stage: this.stage,
      ruleId: this.ruleId,
      recordedAtIso: this.recordedAtIso,
      detail: this.detail,
      ...(this.metadata !== undefined ? { metadata: this.metadata } : {}),
    });
  }
}

export function createEvidence(
  stage: VerificationStage,
  ruleId: string,
  detail: string
): ValidationEvidence {
  return new EvidenceBuilder({ stage, ruleId, detail }).build();
}
