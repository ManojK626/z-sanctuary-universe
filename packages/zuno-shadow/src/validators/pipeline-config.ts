import { VERIFICATION_STAGES } from '../constants/stages';
import type { ShadowPipeline } from '../types/shadow-pipeline';
import type { ShadowRule } from '../types/shadow-rule';
import type { VerificationStage } from '../types/verification-stage';

export interface PipelineConfigValidation {
  readonly ok: boolean;
  readonly errors: readonly string[];
}

function isVerificationStage(value: string): value is VerificationStage {
  return (VERIFICATION_STAGES as readonly string[]).includes(value);
}

export function validateShadowPipeline(pipeline: ShadowPipeline): PipelineConfigValidation {
  const errors: string[] = [];

  if (!pipeline.id || pipeline.id.trim().length === 0) {
    errors.push('pipeline id is required');
  }

  if (!pipeline.name || pipeline.name.trim().length === 0) {
    errors.push('pipeline name is required');
  }

  if (pipeline.stages.length === 0) {
    errors.push('pipeline must declare at least one stage');
  }

  const stageSet = new Set<string>();
  for (const stage of pipeline.stages) {
    if (!isVerificationStage(stage)) {
      errors.push(`invalid stage: ${stage}`);
    }
    if (stageSet.has(stage)) {
      errors.push(`duplicate stage in pipeline order: ${stage}`);
    }
    stageSet.add(stage);
  }

  const ruleIds = new Set<string>();
  for (const rule of pipeline.rules) {
    if (!rule.id || rule.id.trim().length === 0) {
      errors.push('rule id is required');
    }
    if (ruleIds.has(rule.id)) {
      errors.push(`duplicate rule id: ${rule.id}`);
    }
    ruleIds.add(rule.id);

    if (!isVerificationStage(rule.stage)) {
      errors.push(`rule ${rule.id} has invalid stage`);
    }

    if (!pipeline.stages.includes(rule.stage)) {
      errors.push(`rule ${rule.id} targets stage not in pipeline: ${rule.stage}`);
    }
  }

  return {
    ok: errors.length === 0,
    errors: Object.freeze([...errors]),
  };
}

export function rulesForStage(
  pipeline: ShadowPipeline,
  stage: VerificationStage
): readonly ShadowRule[] {
  return pipeline.rules.filter((rule) => rule.stage === stage);
}
