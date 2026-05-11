# Zuno orchestration docs (doctrine)

**Purpose:** Blueprint **Zuno as central ethical orchestrator** — not a single giant model — aligned with the **living** Z-Sanctuary hub (registry, audits, AI Builder pack, dashboard).

**Read first:** [AI_BUILDER_CONTEXT.md](../AI_BUILDER_CONTEXT.md), [Z_SANCTUARY_IMPLEMENTATION_LANES.md](../Z_SANCTUARY_IMPLEMENTATION_LANES.md).

| Doc | Role |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| [Z_SANCTUARY_MASTER_ORCHESTRATION_ROADMAP.md](Z_SANCTUARY_MASTER_ORCHESTRATION_ROADMAP.md) | End-to-end phases and links |
| [ZUNO_ORCHESTRATOR_BLUEPRINT.md](ZUNO_ORCHESTRATOR_BLUEPRINT.md) | Component map and responsibilities |
| [ZUNO_CAPABILITY_ROUTER.md](ZUNO_CAPABILITY_ROUTER.md) | Capability families and routing rules |
| [ZUNO_PROVIDER_ADAPTER_CONTRACT.md](ZUNO_PROVIDER_ADAPTER_CONTRACT.md) | Provider-agnostic adapter pattern (no live keys) |
| [ZUNO_MEMORY_KNOWLEDGE_LAYER.md](ZUNO_MEMORY_KNOWLEDGE_LAYER.md) | Knowledge and memory separation |
| [ZUNO_OUTPUT_VERIFIER.md](ZUNO_OUTPUT_VERIFIER.md) | Output checks before human or dashboard surfacing |
| [ZUNO_CONTRACT_EXAMPLES.md](ZUNO_CONTRACT_EXAMPLES.md) | Fixtures, validation, task-plan lint, dashboard card |
| [packages/zuno-orchestrator-contracts/README.md](../../packages/zuno-orchestrator-contracts/README.md) | Imports, scripts, boundaries |

## Phase 1A — TypeScript contracts only

Workspace package **`@z-sanctuary/zuno-orchestrator-contracts`** (`packages/zuno-orchestrator-contracts/`): interfaces for `ZunoRequest`, `ZunoTaskPlan`, `ZCapability`, `ZProviderAdapter`, `ZFormulaRef`, `ZDRPDecision`, `ZVerificationResult`. **No API keys, no network, no provider SDKs, no runtime orchestration.**

## Phase 1B — Contract fixtures + examples

Under **`packages/zuno-orchestrator-contracts/examples/`**: JSON examples aligned with those types, clearly marked **`_non_executable`**. See [ZUNO_CONTRACT_EXAMPLES.md](ZUNO_CONTRACT_EXAMPLES.md).

## Phase 1C — Fixture validation only

**`npm run examples:check --workspace=@z-sanctuary/zuno-orchestrator-contracts`** — local JSON validation (no network). Writes `data/reports/zuno_orchestrator_contract_examples_check.{json,md}`.

## Phase 1D — README + usage boundary polish

**[packages/zuno-orchestrator-contracts/README.md](../../packages/zuno-orchestrator-contracts/README.md)** — import boundaries, underscore stripping, examples are not runtime plans.

## Phase 2A — Read-only task plan linter

**`npm run task-plan:lint --workspace=@z-sanctuary/zuno-orchestrator-contracts`** — validates one **`ZunoTaskPlan`** JSON (default: **`examples/zuno_task_plan.example.json`**). Writes **`data/reports/zuno_task_plan_lint_report.{json,md}`**. **Does not execute** the plan. Included in package **`test`** after **`examples:check`**.

## Phase 2B — Dashboard visibility (read-only)

**HODP** (`dashboard/Html/index-skk-rkpk.html`) → Control Centre → **Observe & verify**: **`dashboard/scripts/z-orchestration-status-readonly.js`** fetches **`data/reports/zuno_orchestrator_contract_examples_check.json`**, **`zuno_task_plan_lint_report.json`**, and **`packages/zuno-orchestrator-contracts/package.json`** (name check). Shows PASS/FAIL (or UNKNOWN if files missing), fixed posture lines (**CLOSED** / **DISABLED** / **HOLD**), and report/doc links. **No buttons, no execution** — static visibility only when served from hub root.

From hub root:

```bash
npm install
npm run examples:check --workspace=@z-sanctuary/zuno-orchestrator-contracts
npm run task-plan:lint --workspace=@z-sanctuary/zuno-orchestrator-contracts
npm run test --workspace=@z-sanctuary/zuno-orchestrator-contracts
npm run build --workspace=@z-sanctuary/zuno-orchestrator-contracts
```

**Planning artefact:** `data/reports/zuno_orchestrator_phase_plan.{json,md}` — gap analysis; regenerate when orchestration docs change materially.

**Seal law:** Do not expand the hub by making it messy — stay truthful, modular, safe, auditable, and registry-grounded.
