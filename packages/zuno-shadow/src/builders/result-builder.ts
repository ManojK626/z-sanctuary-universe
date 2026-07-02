import type { ShadowValidationResult } from '../types/shadow-validation-result';
import type { PipelineExecutionSummary } from '../types/shadow-validation-result';
import type { RejectionReason } from '../types/verification-outcome';

export interface ResultBuilderInput {
  readonly summary: PipelineExecutionSummary;
  readonly rejectionReasons: readonly RejectionReason[];
}

export class ResultBuilder {
  private summary: PipelineExecutionSummary;
  private rejectionReasons: readonly RejectionReason[];

  constructor(input: ResultBuilderInput) {
    this.summary = input.summary;
    this.rejectionReasons = Object.freeze([...input.rejectionReasons]);
  }

  build(): ShadowValidationResult {
    const status = this.summary.finalStatus;
    const approved = status === 'approved';
    return Object.freeze({
      approved,
      status,
      summary: this.summary,
      rejectionReasons: this.rejectionReasons,
    });
  }
}

export function createShadowValidationResult(
  summary: PipelineExecutionSummary,
  rejectionReasons: readonly RejectionReason[] = []
): ShadowValidationResult {
  return new ResultBuilder({ summary, rejectionReasons }).build();
}
