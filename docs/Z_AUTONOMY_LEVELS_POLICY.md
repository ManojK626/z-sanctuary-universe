# Z-Autonomy Levels Policy

## Purpose

Define **what may run without AMK/human intervention** versus what **must stay gated**. This policy pairs with [Z_AUTONOMOUS_GUARDIAN_LOOP.md](./Z_AUTONOMOUS_GUARDIAN_LOOP.md) and the machine-readable [`data/z_autonomy_task_policy.json`](../data/z_autonomy_task_policy.json).

**Golden law:** AI may observe and report automatically; it must not silently mutate sacred truth, deploy, bill, or open live bridges.

## Levels L0–L5

| Level | Name | Default auto? | Gate |
| ------ | --------------------- | ------------------ | ------------------------------------------ |
| **L0** | Observe | Yes (read-only) | None for reads |
| **L1** | Report | Yes (reports only) | Paths and scripts approved by hub |
| **L2** | Safe hygiene | No | Operator opt-in (formatting/table compact) |
| **L3** | Patch suggestion | No | Human review; no apply |
| **L4** | Controlled apply | No | AMK/human approval per Turtle lane |
| **L5** | Sacred / charter-only | Never automatic | Charter plus 14 DRP and 14 DOP review |

## L0 — Observe

- File walks, JSON reads, static analysis without writes.
- Must not change repo files or remote state.

## L1 — Report

- Writes **evidence artifacts** (for example under `data/reports/`) from read-only or deterministic checks.
- Examples aligned with hub scripts: `verify:md`, `z:car2`, `dashboard:registry-verify`, `z:cross-project:sync`, `z:traffic`, Zuno coverage when run as audit.

## L2 — Safe hygiene

- Markdown/table compaction, whitespace, style fixes **only when explicitly invoked**.
- Not a silent perpetual loop on protected branches unless operator policy allows.

## L3 — Patch suggestion

- Diffs, plans, branch proposals, AI-generated patches **for review only**.
- No merge, no push without human action.

## L4 — Controlled apply

- Small scoped edits after an **opened Turtle lane** (one domain, one rollback plan).
- Cursor/agents follow `.cursor/rules/z-turtle-mode-cursor-agents.mdc` (branch prefix, no direct main edits).

## L5 — Sacred / charter-only

- Deploy, billing/SKU changes, provider keys, live bridges, cross-project memory, production auth, autonomous merge to protected branches.
- Requires explicit charter and harm-reduction plus operational discipline gates—not inferred from docs.

## Human-gated categories (always)

- Deployment and release channels
- Billing, pricing, SKUs, entitlement **mutation**
- Provider/API keys and secrets
- Bridge execution and live service coupling
- Cross-project memory and shared user storage
- Accounts and authentication providers
- Children, privacy, voice, camera, GPS-sensitive surfaces
- Cloud sync without charter
- Production database writes
- Auto-merge or push without human approval

## Z-Traffic alignment

Sensitive **next-lane hints** should surface **BLUE** (human decision) per [Z_TRAFFIC_MINIBOTS.md](./Z_TRAFFIC_MINIBOTS.md), even when L1 checks are green.

## Related

- [Z_AUTONOMOUS_GUARDIAN_LOOP.md](./Z_AUTONOMOUS_GUARDIAN_LOOP.md)
- [Z_TRAFFIC_MINIBOTS.md](./Z_TRAFFIC_MINIBOTS.md)
- [Z_CROSS_PROJECT_CAPABILITY_SYNC.md](./cross-project/Z_CROSS_PROJECT_CAPABILITY_SYNC.md)
- [Z-SANCTUARY-VERIFICATION-CHECKLIST.md](./Z-SANCTUARY-VERIFICATION-CHECKLIST.md)
