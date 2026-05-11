# @z-sanctuary/zuno-orchestrator-contracts

**Phase 1 — contracts, fixtures, and validation only.** TypeScript types for future Zuno orchestration. **No** runtime orchestrator, **no** provider SDKs, **no** API keys, **no** network calls.

Doctrine hub: [docs/orchestration/README.md](../../docs/orchestration/README.md)

## What this package is not

- Not an execution engine — it does not run task plans, call models, or mutate repos.
- Not a loader for `examples/*.example.json` as live plans — see **Usage boundaries** below.

## Importing from other hub packages (future)

After **`npm install`** at the monorepo root, add a workspace dependency and import types from **`dist/`** (run **`npm run build`** in this package first) or depend on source via your package’s TypeScript `paths` (team choice).

**Example (consumer `package.json`):**

```json
{
  "dependencies": {
    "@z-sanctuary/zuno-orchestrator-contracts": "*"
  }
}
```

**Example (TypeScript):**

```ts
import type { ZunoRequest, ZunoTaskPlan } from '@z-sanctuary/zuno-orchestrator-contracts';
```

Use **`import type`** only unless you later add runtime-safe factories that do not execute plans.

## Fixture JSON vs contract types

Example files under **`examples/`** include documentation-only keys: **`_fixture`**, **`_non_executable`**, **`_description`**. Those keys are **not** part of the exported interfaces.

**Before** assigning parsed JSON to a variable typed as `ZunoRequest`, `ZunoTaskPlan`, etc., **strip** all keys starting with **`_`** (and any other doc-only keys you add). Otherwise you blur fixtures with runtime payloads.

The **`examples:check`** script validates fixtures but does **not** produce stripped objects for execution — it only reports pass/fail.

## Phase 2A — Task plan linter (read-only)

**`task-plan:lint`** validates a **`ZunoTaskPlan`** JSON shape locally — **no execution**.

- Default input: **`examples/zuno_task_plan.example.json`**
- Optional path: `node scripts/lint_task_plan.mjs path/to/plan.json`
- Checks: required fields, **`drpPreview` required**, capability families, **no enabled provider-like objects** in the tree, forbidden wording in step descriptions (commerce, auto-deploy, secrets, sensitive modalities), heuristic warnings for execution-flavoured text.
- Reports: **`data/reports/zuno_task_plan_lint_report.{json,md}`**
- Exit **1** on structural or policy errors; warnings alone still **exit 0**.

## Usage boundaries

- **Do not** feed `examples/*.example.json` into any future orchestrator as executable plans — they are **non-executable evidence** for humans and CI.
- **Do not** treat `_non_executable: true` files as API bodies for providers.
- Production-shaped JSON (when it exists) should live outside **`examples/`** and omit underscore meta unless you define a separate envelope schema.

## npm scripts (run from hub root or this directory)

| Script | Command | Purpose |
| ---------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `build` | `npm run build --workspace=@z-sanctuary/zuno-orchestrator-contracts` | Emit **`dist/`** (`.js` + `.d.ts`) |
| `test` | `npm run test --workspace=@z-sanctuary/zuno-orchestrator-contracts` | **`tsc --noEmit`**, **`examples:check`**, **`task-plan:lint`** |
| `examples:check` | `npm run examples:check --workspace=@z-sanctuary/zuno-orchestrator-contracts` | Fixture batch validation → **`data/reports/zuno_orchestrator_contract_examples_check.*`** |
| `task-plan:lint` | `npm run task-plan:lint --workspace=@z-sanctuary/zuno-orchestrator-contracts` | Single **`ZunoTaskPlan`** lint → **`data/reports/zuno_task_plan_lint_report.*`** |

Root **`npm run test`** runs workspace tests; this package’s **`test`** chains typecheck, fixture validation, and default task-plan lint.

## Related

- [examples/README.md](examples/README.md) — fixture folder disclaimer
- [docs/orchestration/ZUNO_CONTRACT_EXAMPLES.md](../../docs/orchestration/ZUNO_CONTRACT_EXAMPLES.md) — field mapping + lint commands
