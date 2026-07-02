import type { VerificationStage } from '../types/verification-stage';
import type { ValidationContext } from '../types/validation-context';
import type { VerificationOutcome } from '../types/verification-outcome';
import type { ShadowRule } from '../types/shadow-rule';
import { createEvidence } from '../builders/evidence-builder';

export interface PassRuleOptions {
  readonly id: string;
  readonly stage: VerificationStage;
  readonly description?: string;
  readonly detail?: string;
}

export function createPassRule(options: PassRuleOptions): ShadowRule {
  return Object.freeze({
    id: options.id,
    stage: options.stage,
    description: options.description ?? `Pass rule ${options.id}`,
    execute(context: Readonly<ValidationContext>): VerificationOutcome {
      return Object.freeze({
        status: 'passed',
        stage: options.stage,
        ruleId: options.id,
        reasons: [],
        evidence: Object.freeze([
          createEvidence(
            options.stage,
            options.id,
            options.detail ?? `Passed for ${context.correlationId}`
          ),
        ]),
      });
    },
  });
}

export interface RejectRuleOptions {
  readonly id: string;
  readonly stage: VerificationStage;
  readonly code: string;
  readonly message: string;
  readonly description?: string;
}

export function createRejectRule(options: RejectRuleOptions): ShadowRule {
  return Object.freeze({
    id: options.id,
    stage: options.stage,
    description: options.description ?? `Reject rule ${options.id}`,
    execute(context: Readonly<ValidationContext>): VerificationOutcome {
      return Object.freeze({
        status: 'rejected',
        stage: options.stage,
        ruleId: options.id,
        reasons: Object.freeze([
          Object.freeze({
            code: options.code,
            message: options.message,
            stage: options.stage,
          }),
        ]),
        evidence: Object.freeze([
          createEvidence(options.stage, options.id, `Rejected: ${options.message}`),
        ]),
      });
    },
  });
}
