import type { VerificationStage } from './verification-stage';
import type { ShadowRule } from './shadow-rule';

export interface ShadowPipeline {
  readonly id: string;
  readonly name: string;
  readonly stages: readonly VerificationStage[];
  readonly rules: readonly ShadowRule[];
  /** When true, rejected outcome stops remaining stages */
  readonly stopOnReject: boolean;
}
