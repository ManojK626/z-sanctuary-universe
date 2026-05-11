# Zuno contract examples (Phase 1B)

**Purpose:** Show how **`@z-sanctuary/zuno-orchestrator-contracts`** types map to JSON **fixtures** — **documentation only**. No runtime orchestrator reads these files yet.

**Phase 1D:** Usage boundaries and import notes live in [packages/zuno-orchestrator-contracts/README.md](../../packages/zuno-orchestrator-contracts/README.md).

## Non-executable rule

All example JSON includes `_non_executable: true` and `_description`. Treat them like sample wireframes, not commands.

## Do not consume examples as runtime plans

Files under **`examples/`** are **contract evidence** for Cursor, operators, and **`examples:check`** — **not** inputs to a task runner. A future orchestrator must **never** load these paths as executable work unless explicitly redesigned with separate gated artefacts.

## Underscore fields and assignment

Fixture-only keys: **`_fixture`**, **`_non_executable`**, **`_description`** (and any future **`_*`** metadata). They are **not** part of the TypeScript interfaces.

**Strip** all **`_*`** keys after `JSON.parse` and **before** treating the object as a `ZunoRequest`, `ZunoTaskPlan`, etc. Keep fixtures and runtime payloads strictly separated.

## Phase 1C — Local validation (no execution)

From hub root:

```bash
npm run examples:check --workspace=@z-sanctuary/zuno-orchestrator-contracts
```

This runs **`scripts/validate_examples.mjs`** (filesystem only): parses each fixture, checks `_non_executable`, required fields, capability families, **all provider adapters `enabled: false`**, and writes:

- `data/reports/zuno_orchestrator_contract_examples_check.json`
- `data/reports/zuno_orchestrator_contract_examples_check.md`

**Commands overview:** see the scripts table in [packages/zuno-orchestrator-contracts/README.md](../../packages/zuno-orchestrator-contracts/README.md).

`npm run test --workspace=@z-sanctuary/zuno-orchestrator-contracts` runs **`tsc --noEmit`**, **`examples:check`**, and **`task-plan:lint`** (Phase 2A).

## Phase 2A — Task plan linter (read-only)

Lint a single **`ZunoTaskPlan`** file — **no execution**.

```bash
npm run task-plan:lint --workspace=@z-sanctuary/zuno-orchestrator-contracts
```

Optional custom path (hub or absolute):

```bash
node packages/zuno-orchestrator-contracts/scripts/lint_task_plan.mjs path/to/plan.json
```

Writes **`data/reports/zuno_task_plan_lint_report.{json,md}`**. Requires **`drpPreview`**, valid steps and capabilities, **no enabled provider-like objects** embedded in the JSON, and flags forbidden wording in step descriptions (see script). Exit **1** on errors.

## Fixture locations

| File | Maps to |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| [examples/zuno_request.example.json](../../packages/zuno-orchestrator-contracts/examples/zuno_request.example.json) | `ZunoRequest` (+ nested `ZCapability`, `ZFormulaRef`) |
| [examples/zuno_task_plan.example.json](../../packages/zuno-orchestrator-contracts/examples/zuno_task_plan.example.json) | `ZunoTaskPlan`, `ZunoTaskPlanStep`, optional `ZDRPDecision` |
| [examples/provider_adapter_manifest.example.json](../../packages/zuno-orchestrator-contracts/examples/provider_adapter_manifest.example.json) | `adapters[]` of `ZProviderAdapter` (manifest wrapper) |
| [examples/drp_decision.example.json](../../packages/zuno-orchestrator-contracts/examples/drp_decision.example.json) | `ZDRPDecision` |
| [examples/verification_result.example.json](../../packages/zuno-orchestrator-contracts/examples/verification_result.example.json) | `ZVerificationResult` |

## Field notes

- **`ZunoRequest.capabilitiesSought`:** each item must use a valid `ZCapabilityFamily` string from the TypeScript union (e.g. `evaluation_verify`, `text_reasoning`).
- **`ZunoTaskPlan.requestId`:** should match the parent request `id` when the plan is an illustration of a full flow.
- **`provider_adapter_manifest`:** production may use `data/providers/z_provider_capability_registry.json` later; this example stays disabled (`enabled: false`) and keyless.
- **`ZDRPDecision.dimensions`:** keys are free-form labels until a canonical DRP dimension enum lands in governance docs.
- **`ZVerificationResult`:** one layer per object; a full pipeline would emit one result per layer (`syntactic` → `grounded` → `safe` → `scoped` → `honest`).

## Related

- [README.md](README.md) — orchestration index + Phase 1A–2A
- [ZUNO_OUTPUT_VERIFIER.md](ZUNO_OUTPUT_VERIFIER.md) — verifier layers
- [ZUNO_PROVIDER_ADAPTER_CONTRACT.md](ZUNO_PROVIDER_ADAPTER_CONTRACT.md) — adapter doctrine

## Rollback

Remove `packages/zuno-orchestrator-contracts/examples/*` and this doc; unlink from [README.md](README.md). Remove `scripts/validate_examples.mjs` and report files for Phase 1C rollback.
