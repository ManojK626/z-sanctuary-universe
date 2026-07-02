import type { OUTCOME_STATUSES } from '../constants/stages';
import type { VerificationStage } from './verification-stage';

export type VerificationOutcomeStatus = (typeof OUTCOME_STATUSES)[number];

export interface RejectionReason {
  readonly code: string;
  readonly message: string;
  readonly stage: VerificationStage;
}

export interface ValidationEvidence {
  readonly id: string;
  readonly stage: VerificationStage;
  readonly ruleId: string;
  readonly recordedAtIso: string;
  readonly detail: string;
  readonly metadata?: Readonly<Record<string, string>>;
}

export interface VerificationOutcome {
  readonly status: VerificationOutcomeStatus;
  readonly stage: VerificationStage;
  readonly ruleId: string;
  readonly reasons: readonly RejectionReason[];
  readonly evidence: readonly ValidationEvidence[];
}
