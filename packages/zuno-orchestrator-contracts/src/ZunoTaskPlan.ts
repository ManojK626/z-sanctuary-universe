import type { ZCapability } from './ZCapability';
import type { ZDRPDecision } from './ZDRPDecision';

/**
 * Single planned step — human gate explicit per step when needed.
 */
export interface ZunoTaskPlanStep {
  readonly stepId: string;
  readonly description: string;
  readonly capability: ZCapability;
  readonly requiresHumanApproval: boolean;
}

/**
 * Planned response to a ZunoRequest — still not execution.
 */
export interface ZunoTaskPlan {
  readonly planId: string;
  readonly requestId: string;
  readonly steps: readonly ZunoTaskPlanStep[];
  readonly drpPreview?: ZDRPDecision;
}
