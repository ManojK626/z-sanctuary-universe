# @z-sanctuary/zuno-shadow

**Phase:** 2A Package 3 · VILE Platform
**Posture:** Shadow Validation Framework — **not** an AI runtime, LLM integration, or network layer

## Purpose

Provides the canonical **Shadow Validation Framework** for the Z-Sanctuary / VILE ecosystem:

- Configurable verification pipelines with immutable evidence
- Rule interfaces and stage contracts (framework executes; consumers supply business rules)
- Builders for pipelines, context, evidence, and results
- Generic executor — no hard-coded business logic

**Trust rule:** No AI-generated output is considered trustworthy until it passes a configured verification pipeline.

## Source of truth

- [SHADOW_VALIDATION_PIPELINE.md](../../docs/vile/SHADOW_VALIDATION_PIPELINE.md)
- [SYSTEM_BOUNDARIES.md](../../docs/vile/SYSTEM_BOUNDARIES.md)
- [VILE_CANONICAL_SYSTEM_BLUEPRINT.md](../../docs/vile/VILE_CANONICAL_SYSTEM_BLUEPRINT.md)
- [platform-contracts/](../../docs/vile/platform-contracts/) — schemas inform future integration; this package ships TypeScript contracts only

## Installation

```bash
npm install
npm run build --workspace=@z-sanctuary/zuno-shadow
```

## Pipeline model

Default stage order (configurable per pipeline):

```text
Input
  → schema_validation
  → safety_validation
  → risk_validation
  → compliance_validation
  → shadow_verification
  → approved | rejected | degraded
```

Stages are declared on `ShadowPipeline`. Rules bind to a stage via `ShadowRule.stage`. The executor runs rules in pipeline stage order; prior evidence is passed forward without mutation.

## Usage

```typescript
import {
  ShadowPipelineBuilder,
  createPassRule,
  createRejectRule,
  executeShadowPipeline,
  createValidationContext,
} from '@z-sanctuary/zuno-shadow';

const pipeline = new ShadowPipelineBuilder()
  .withId('vile-agent-output')
  .withName('Agent output shadow gate')
  .withStages(['schema_validation', 'safety_validation', 'shadow_verification'])
  .addRule(
    createPassRule({
      id: 'schema-struct',
      stage: 'schema_validation',
      detail: 'Payload matches expected shape',
    })
  )
  .addRule(
    createRejectRule({
      id: 'safety-block',
      stage: 'safety_validation',
      code: 'SAFETY_VIOLATION',
      message: 'Consumer-defined safety rule failed',
    })
  )
  .build();

const result = await executeShadowPipeline(pipeline, {
  correlationId: 'req-001',
  input: { message: '…' },
  serviceScope: 'vile-orchestrator',
});

if (!result.approved) {
  // handle rejectionReasons + immutable evidence — no network in this package
}
```

Custom rules implement `ShadowRule`:

```typescript
import type { ShadowRule, ValidationContext, VerificationOutcome } from '@z-sanctuary/zuno-shadow';

const myRule: ShadowRule = {
  id: 'custom-compliance',
  stage: 'compliance_validation',
  description: 'Consumer-owned compliance check',
  execute(context: Readonly<ValidationContext>): VerificationOutcome {
    return {
      status: 'passed',
      stage: 'compliance_validation',
      ruleId: 'custom-compliance',
      reasons: [],
      evidence: [],
    };
  },
};
```

## Relationship to Zuno architecture

- **Zuno / VILE agents** — attach shadow pipelines before surfacing AI output
- **zuno-security** — complementary; security classifies and validates I/O; shadow orchestrates multi-stage verification
- **zuno-observability** — consumers may emit audit events from pipeline results; this package does not log
- **zuno-drp** (future Pkg 4) — compliance stage may invoke DRP middleware when chartered; not implemented here

## Package boundaries

| In scope                          | Out of scope                      |
| --------------------------------- | --------------------------------- |
| Types, builders, executor         | OpenAI, Anthropic, local LLM      |
| Rule interfaces                   | Booking / vendor validation       |
| Immutable results + evidence      | Database, API endpoints, UI       |
| Pipeline configuration validation | Authentication, payments, network |

## Future extension points

- Wire `agent-message.schema.json` `shadowStatus` at integration layer (Phase 2B+)
- Pluggable async rule batches per stage
- Optional bridge to `@z-sanctuary/zuno-drp` for compliance stage (Pkg 4 charter)
- Observability emitters in consuming services (not in this package)

## Tests

```bash
npm run test --workspace=@z-sanctuary/zuno-shadow
```

## Rollback

See [ROLLBACK.md](ROLLBACK.md).
