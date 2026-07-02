import type { VerificationStage } from './verification-stage';
import type { ValidationContext } from './validation-context';
import type { VerificationOutcome } from './verification-outcome';

/**
 * A Shadow rule declares identity and stage; business logic lives in consumer implementations.
 */
export interface ShadowRule {
  readonly id: string;
  readonly stage: VerificationStage;
  readonly description: string;
  execute(context: Readonly<ValidationContext>): VerificationOutcome | Promise<VerificationOutcome>;
}
