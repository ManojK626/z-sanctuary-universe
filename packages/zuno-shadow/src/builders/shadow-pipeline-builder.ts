import { DEFAULT_PIPELINE_STAGE_ORDER, VERIFICATION_STAGES } from '../constants/stages';
import type { ShadowPipeline } from '../types/shadow-pipeline';
import type { ShadowRule } from '../types/shadow-rule';
import type { VerificationStage } from '../types/verification-stage';
import { validateShadowPipeline } from '../validators/pipeline-config';

export class ShadowPipelineBuilder {
  private id = '';
  private name = '';
  private stages: VerificationStage[] = [...DEFAULT_PIPELINE_STAGE_ORDER];
  private rules: ShadowRule[] = [];
  private stopOnReject = true;

  withId(id: string): this {
    this.id = id;
    return this;
  }

  withName(name: string): this {
    this.name = name;
    return this;
  }

  withStages(stages: readonly VerificationStage[]): this {
    this.stages = [...stages];
    return this;
  }

  withRules(rules: readonly ShadowRule[]): this {
    this.rules = [...rules];
    return this;
  }

  addRule(rule: ShadowRule): this {
    this.rules.push(rule);
    return this;
  }

  withStopOnReject(stopOnReject: boolean): this {
    this.stopOnReject = stopOnReject;
    return this;
  }

  build(): ShadowPipeline {
    const pipeline: ShadowPipeline = Object.freeze({
      id: this.id,
      name: this.name,
      stages: Object.freeze([...this.stages]),
      rules: Object.freeze([...this.rules]),
      stopOnReject: this.stopOnReject,
    });

    const check = validateShadowPipeline(pipeline);
    if (!check.ok) {
      throw new Error(`Invalid ShadowPipeline: ${check.errors.join('; ')}`);
    }

    return pipeline;
  }
}

export function createDefaultShadowPipeline(
  id: string,
  name: string,
  rules: readonly ShadowRule[] = []
): ShadowPipeline {
  return new ShadowPipelineBuilder()
    .withId(id)
    .withName(name)
    .withStages(VERIFICATION_STAGES)
    .withRules(rules)
    .build();
}
