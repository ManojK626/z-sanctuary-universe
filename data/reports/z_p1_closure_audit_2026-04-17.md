# P1 closure audit — 2026-04-17 (Task 007.5)

## Evidence: `npm run lint`

- **ESLint (root):** fixed `scripts/launch_zsanctuary.js` (quotes), `scripts/z_autonomous_orchestrator.mjs` (`for (;;)` daemon loop), `scripts/z_lab_readiness.mjs` (removed unused `boost` read).
- **Markdownlint:** fixed `docs/IMPLEMENTATION_GUIDE_FUTURE_PROOFING.md` (stray/closing fence), `Z_Labs/workspaces/Z_4_WINDOW_PLAN.md` (MD032 blank line before list).
- **Workspaces:** added `"lint": "eslint . --ext .js --no-error-on-unmatched-pattern"` to `packages/z-sanctuary-core/package.json` so `npm run lint --workspaces` completes.

Full `npm run lint` exit code: **0**.

## Queue: `data/z_priority_queue.json`

Seven **Codex repeat** P1 items marked **`done`** with **`ZClosedAt`** and **`ZClosureReason`** (no mass-close without evidence).

## Z-Execution Enforcer (after Zuno refresh)

- **`p1_open`:** **0** (was 7).
- **Gate:** still **BLOCK** due to **`Release gate: hold`** and **`Readiness gates: 0/4`** — intentional governance, not a lint regression.

## `npm run verify:full`

Still expected to stop at the enforcer until **readiness** and **release gate** move; P1 clearing alone does not override that contract.
