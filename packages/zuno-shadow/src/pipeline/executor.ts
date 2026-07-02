import type { ShadowPipeline } from '../types/shadow-pipeline';
import type { ShadowValidationResult } from '../types/shadow-validation-result';
import type { PipelineExecutionSummary } from '../types/shadow-validation-result';
import type { FinalValidationStatus } from '../types/shadow-validation-result';
import type { ValidationContext } from '../types/validation-context';
import type { VerificationOutcome } from '../types/verification-outcome';
import type { RejectionReason } from '../types/verification-outcome';
import type { ValidationEvidence } from '../types/verification-outcome';
import type { VerificationStage } from '../types/verification-stage';
import { ValidationContextBuilder } from '../builders/validation-context-builder';
import { createShadowValidationResult } from '../builders/result-builder';
import { rulesForStage } from '../validators/pipeline-config';

function mergeEvidence(
  prior: readonly ValidationEvidence[],
  added: readonly ValidationEvidence[]
): readonly ValidationEvidence[] {
  return Object.freeze([...prior, ...added]);
}

function outcomeToFinalStatus(outcomes: readonly VerificationOutcome[]): FinalValidationStatus {
  if (outcomes.some((o) => o.status === 'rejected')) {
    return 'rejected';
  }
  if (outcomes.some((o) => o.status === 'degraded')) {
    return 'degraded';
  }
  return 'approved';
}

/**
 * Executes a Shadow pipeline — framework only; rules supplied by consumer.
 */
export async function executeShadowPipeline(
  pipeline: ShadowPipeline,
  baseContext: Pick<ValidationContext, 'correlationId' | 'input' | 'serviceScope' | 'metadata'>
): Promise<ShadowValidationResult> {
  const startedAtIso = new Date().toISOString();
  const outcomes: VerificationOutcome[] = [];
  const allEvidence: ValidationEvidence[] = [];
  const rejectionReasons: RejectionReason[] = [];
  const stagesExecuted: VerificationStage[] = [];

  let priorEvidence: readonly ValidationEvidence[] = [];

  for (const stage of pipeline.stages) {
    stagesExecuted.push(stage);
    const stageRules = rulesForStage(pipeline, stage);

    for (const rule of stageRules) {
      const context = new ValidationContextBuilder({
        ...baseContext,
        startedAtIso,
        priorEvidence,
      }).build();

      const outcome = await Promise.resolve(rule.execute(context));
      outcomes.push(Object.freeze({ ...outcome }));
      allEvidence.push(...outcome.evidence);
      priorEvidence = mergeEvidence(priorEvidence, outcome.evidence);

      if (outcome.reasons.length > 0) {
        rejectionReasons.push(...outcome.reasons);
      }

      if (outcome.status === 'rejected' && pipeline.stopOnReject) {
        const summary: PipelineExecutionSummary = Object.freeze({
          pipelineId: pipeline.id,
          startedAtIso,
          completedAtIso: new Date().toISOString(),
          stagesExecuted: Object.freeze([...stagesExecuted]),
          finalStatus: 'rejected',
          outcomes: Object.freeze([...outcomes]),
          evidence: Object.freeze([...allEvidence]),
        });
        return createShadowValidationResult(summary, Object.freeze([...rejectionReasons]));
      }

      if (outcome.status === 'degraded' && pipeline.stopOnReject) {
        const summary: PipelineExecutionSummary = Object.freeze({
          pipelineId: pipeline.id,
          startedAtIso,
          completedAtIso: new Date().toISOString(),
          stagesExecuted: Object.freeze([...stagesExecuted]),
          finalStatus: 'degraded',
          outcomes: Object.freeze([...outcomes]),
          evidence: Object.freeze([...allEvidence]),
        });
        return createShadowValidationResult(summary, Object.freeze([...rejectionReasons]));
      }
    }
  }

  const finalStatus = outcomeToFinalStatus(outcomes);
  const summary: PipelineExecutionSummary = Object.freeze({
    pipelineId: pipeline.id,
    startedAtIso,
    completedAtIso: new Date().toISOString(),
    stagesExecuted: Object.freeze([...stagesExecuted]),
    finalStatus,
    outcomes: Object.freeze([...outcomes]),
    evidence: Object.freeze([...allEvidence]),
  });

  return createShadowValidationResult(
    summary,
    finalStatus === 'approved' ? [] : Object.freeze([...rejectionReasons])
  );
}
