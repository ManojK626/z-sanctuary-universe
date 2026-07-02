import type { FINAL_STATUSES } from '../constants/stages';
import type { VerificationStage } from './verification-stage';
import type { VerificationOutcome } from './verification-outcome';
import type { ValidationEvidence } from './verification-outcome';
import type { RejectionReason } from './verification-outcome';

export type FinalValidationStatus = (typeof FINAL_STATUSES)[number];

export interface PipelineExecutionSummary {
  readonly pipelineId: string;
  readonly startedAtIso: string;
  readonly completedAtIso: string;
  readonly stagesExecuted: readonly VerificationStage[];
  readonly finalStatus: FinalValidationStatus;
  readonly outcomes: readonly VerificationOutcome[];
  readonly evidence: readonly ValidationEvidence[];
}

export interface ShadowValidationResult {
  readonly approved: boolean;
  readonly status: FinalValidationStatus;
  readonly summary: PipelineExecutionSummary;
  readonly rejectionReasons: readonly RejectionReason[];
}
