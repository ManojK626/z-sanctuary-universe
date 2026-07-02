import { createRequire } from 'node:module';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const require = createRequire(import.meta.url);
const {
  ShadowPipelineBuilder,
  createDefaultShadowPipeline,
  ValidationContextBuilder,
  EvidenceBuilder,
  ResultBuilder,
  validateShadowPipeline,
  executeShadowPipeline,
  createPassRule,
  createRejectRule,
  createValidationContext,
  createEvidence,
  createShadowValidationResult,
} = require('../dist/index.js');

test('empty pipeline (stages only, no rules) approves', async () => {
  const pipeline = new ShadowPipelineBuilder()
    .withId('empty')
    .withName('Empty rules')
    .withStages(['schema_validation'])
    .withRules([])
    .build();

  const result = await executeShadowPipeline(pipeline, {
    correlationId: 'corr-empty',
    input: { ok: true },
    serviceScope: 'test',
  });

  assert.equal(result.approved, true);
  assert.equal(result.status, 'approved');
  assert.equal(result.summary.outcomes.length, 0);
});

test('single-stage pipeline executes one rule', async () => {
  const rule = createPassRule({
    id: 'schema-ok',
    stage: 'schema_validation',
    detail: 'Schema valid',
  });
  const pipeline = new ShadowPipelineBuilder()
    .withId('single')
    .withName('Single stage')
    .withStages(['schema_validation'])
    .addRule(rule)
    .build();

  const result = await executeShadowPipeline(pipeline, {
    correlationId: 'corr-single',
    input: {},
    serviceScope: 'test',
  });

  assert.equal(result.approved, true);
  assert.equal(result.summary.stagesExecuted.length, 1);
  assert.equal(result.summary.outcomes.length, 1);
  assert.equal(result.summary.outcomes[0].ruleId, 'schema-ok');
});

test('multi-stage pipeline runs stages in order', async () => {
  const makeRule = (id, stage) =>
    createPassRule({
      id,
      stage,
      detail: `Passed ${stage}`,
    });

  const pipeline = new ShadowPipelineBuilder()
    .withId('multi')
    .withName('Multi stage')
    .withStages(['schema_validation', 'safety_validation', 'shadow_verification'])
    .withRules([
      makeRule('r-schema', 'schema_validation'),
      makeRule('r-safety', 'safety_validation'),
      makeRule('r-shadow', 'shadow_verification'),
    ])
    .build();

  const result = await executeShadowPipeline(pipeline, {
    correlationId: 'corr-multi',
    input: { payload: 1 },
    serviceScope: 'test',
  });

  assert.equal(result.approved, true);
  assert.deepEqual(result.summary.stagesExecuted, [
    'schema_validation',
    'safety_validation',
    'shadow_verification',
  ]);
  assert.equal(result.summary.outcomes.length, 3);
  assert.equal(result.summary.evidence.length, 3);
});

test('early rejection stops pipeline when stopOnReject is true', async () => {
  const pipeline = new ShadowPipelineBuilder()
    .withId('reject-early')
    .withName('Early reject')
    .withStages(['schema_validation', 'safety_validation'])
    .withRules([
      createRejectRule({
        id: 'block-schema',
        stage: 'schema_validation',
        code: 'SCHEMA_INVALID',
        message: 'Missing required field',
      }),
      createPassRule({ id: 'never-runs', stage: 'safety_validation' }),
    ])
    .withStopOnReject(true)
    .build();

  const result = await executeShadowPipeline(pipeline, {
    correlationId: 'corr-reject',
    input: {},
    serviceScope: 'test',
  });

  assert.equal(result.approved, false);
  assert.equal(result.status, 'rejected');
  assert.equal(result.summary.stagesExecuted.length, 1);
  assert.equal(result.rejectionReasons.length, 1);
  assert.equal(result.rejectionReasons[0].code, 'SCHEMA_INVALID');
});

test('evidence collection accumulates across rules without mutation', async () => {
  const pipeline = new ShadowPipelineBuilder()
    .withId('evidence')
    .withName('Evidence')
    .withStages(['schema_validation', 'risk_validation'])
    .withRules([
      createPassRule({ id: 'e1', stage: 'schema_validation', detail: 'first' }),
      createPassRule({ id: 'e2', stage: 'risk_validation', detail: 'second' }),
    ])
    .build();

  const result = await executeShadowPipeline(pipeline, {
    correlationId: 'corr-evidence',
    input: {},
    serviceScope: 'test',
  });

  assert.equal(result.summary.evidence.length, 2);
  assert.equal(result.summary.evidence[0].detail, 'first');
  assert.equal(result.summary.evidence[1].detail, 'second');
  assert.throws(() => {
    result.summary.evidence.push({});
  });
});

test('results and outcomes are immutable after completion', async () => {
  const pipeline = createDefaultShadowPipeline('immutable', 'Immutable test', [
    createPassRule({ id: 'p1', stage: 'schema_validation' }),
  ]);

  const result = await executeShadowPipeline(pipeline, {
    correlationId: 'corr-immutable',
    input: {},
    serviceScope: 'test',
  });

  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.summary), true);
  assert.equal(Object.isFrozen(result.summary.outcomes), true);
  assert.equal(Object.isFrozen(result.summary.evidence), true);
  assert.equal(Object.isFrozen(result.rejectionReasons), true);
  if (result.summary.outcomes.length > 0) {
    assert.equal(Object.isFrozen(result.summary.outcomes[0]), true);
  }
});

test('builders produce valid canonical objects', () => {
  const evidence = new EvidenceBuilder({
    stage: 'schema_validation',
    ruleId: 'b1',
    detail: 'builder evidence',
  }).build();
  assert.equal(evidence.stage, 'schema_validation');
  assert.equal(Object.isFrozen(evidence), true);

  const context = new ValidationContextBuilder({
    correlationId: 'c1',
    input: { x: 1 },
    serviceScope: 'scope',
  }).build();
  assert.equal(context.correlationId, 'c1');
  assert.equal(Object.isFrozen(context), true);
  assert.equal(Object.isFrozen(context.priorEvidence), true);

  const summary = {
    pipelineId: 'p',
    startedAtIso: new Date().toISOString(),
    completedAtIso: new Date().toISOString(),
    stagesExecuted: ['schema_validation'],
    finalStatus: 'approved',
    outcomes: [],
    evidence: [],
  };
  const result = new ResultBuilder({ summary, rejectionReasons: [] }).build();
  assert.equal(result.approved, true);
  assert.equal(Object.isFrozen(result), true);

  const pipeline = new ShadowPipelineBuilder()
    .withId('b-pipe')
    .withName('Builder pipe')
    .withStages(['schema_validation'])
    .build();
  assert.equal(pipeline.id, 'b-pipe');
  assert.equal(Object.isFrozen(pipeline), true);
});

test('invalid pipeline configuration is rejected', () => {
  const bad = validateShadowPipeline({
    id: '',
    name: '',
    stages: [],
    rules: [],
    stopOnReject: true,
  });
  assert.equal(bad.ok, false);
  assert.ok(bad.errors.length > 0);

  assert.throws(() => {
    new ShadowPipelineBuilder().withId('').withName('Bad').withStages([]).build();
  }, /Invalid ShadowPipeline/);

  const orphanRule = createPassRule({ id: 'orphan', stage: 'shadow_verification' });
  assert.throws(() => {
    new ShadowPipelineBuilder()
      .withId('orphan-pipe')
      .withName('Orphan rule')
      .withStages(['schema_validation'])
      .addRule(orphanRule)
      .build();
  }, /Invalid ShadowPipeline/);
});

test('createValidationContext and createEvidence helpers', () => {
  const ctx = createValidationContext('h1', { a: 1 }, 'helper-scope');
  assert.equal(ctx.serviceScope, 'helper-scope');
  const ev = createEvidence('compliance_validation', 'r1', 'helper detail');
  assert.equal(ev.ruleId, 'r1');
});

test('createShadowValidationResult reflects summary status', () => {
  const summary = {
    pipelineId: 'x',
    startedAtIso: '2026-01-01T00:00:00.000Z',
    completedAtIso: '2026-01-01T00:00:01.000Z',
    stagesExecuted: ['schema_validation'],
    finalStatus: 'rejected',
    outcomes: [],
    evidence: [],
  };
  const result = createShadowValidationResult(summary, [
    { code: 'X', message: 'fail', stage: 'schema_validation' },
  ]);
  assert.equal(result.approved, false);
  assert.equal(result.status, 'rejected');
});
