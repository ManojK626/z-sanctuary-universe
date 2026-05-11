# Z-AAL — Z Autonomous Approval Ladder

**Purpose:** Separate what the Sanctuary may treat as **internal auto-lane candidates** (evidence, hygiene, reports) from what **AMK-Goku must personally approve** (deploy, billing, bridges, providers, memory, auth, privacy, children, voice/GPS/camera, public claims, red-zone work).

**Phase:** AAL-1 is **read-only metadata + dashboard UI** only. No task execution, no LLM API, no voice engine, no deploy, no bridge, no billing automation.

## Two top-level categories

### 1. Sanctuary auto-lane

- Internal, reversible, evidence-based, already governed by existing scripts and receipts.
- Examples: markdown verify, table compact, Z-Traffic, **Z-AMK-GTAI** (`npm run z:amk:strategy` — read-only rollup), Z-CAR², dashboard registry verify, Z-SUSBV validation/overseer reports, Zuno coverage audit, Z-API-SPINE and **Z-SSWS-LINK-1** launch-requirements reports (`npm run z:ssws:requirements`), receipt refresh scripts (human still chooses when to run them).
- **Doctrine states** may read as READY → VERIFYING → VERIFIED → WAITING_FOR_NEXT_LANE — the browser **does not** advance git state or run `npm`.

### 2. AMK physical / sacred lane

- Deployment / Cloudflare launch, billing / pricing / SKUs, provider and API keys, live bridges, cross-project memory, auth and accounts, voice and sensors, children and privacy-sensitive systems, public claims, user feedback collection, production database writes, auto-merge, red-zone fixes.
- Dashboard colors align with posture: **BLUE** = AMK decision, **RED** = blocked until fixed, **PURPLE** = future-gated, **GOLD** = sealed baseline.

## Autonomy ladder (L0–L5)

- **L0 — Observe:** Auto read reports and JSON in local/CI context.
- **L1 — Report:** Auto write status MD/JSON from validators when a human or CI invokes the script.
- **L2 — Safe hygiene:** Gated auto (e.g. MD060 table compact) only in an opened Turtle lane — never silent on `main`.
- **L3 — Prepare patch:** AMK review — plans/diffs for human merge.
- **L4 — Controlled apply:** Explicit approval for small approved edits — still not deploy or billing.
- **L5 — Sacred action:** Charter only — deploy, bill, bridge, provider, cross-project memory.

Machine-readable policy continues to live in [`data/z_autonomy_task_policy.json`](../data/z_autonomy_task_policy.json). Ladder rows for the dashboard live in [`dashboard/data/amk_autonomous_approval_ladder.json`](../dashboard/data/amk_autonomous_approval_ladder.json).

## Law

```text
Advisor ≠ executor.
Approval ≠ deployment.
Auto-lane ≠ unrestricted autonomy.
One click ≠ launch.
Voice input ≠ allowed until consent, privacy, and DRP gate.
AMK-Goku owns sacred moves.
```

## Z-AWARE-1 (ecosystem spine)

The hub registry + capsules (`npm run z:ecosystem:awareness`) classify **which projects** need attention; AAL classifies **which tasks** sit in auto-lane vs sacred lane. Both stay read-only in the browser. See [Z_ECOSYSTEM_AWARENESS_SPINE.md](./Z_ECOSYSTEM_AWARENESS_SPINE.md).

## Related

- [Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md](./Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md)
- [Z_FORMULA_SWARM_CO_DESIGN_ENGINE.md](./Z_FORMULA_SWARM_CO_DESIGN_ENGINE.md)
- [Z_IDE_FUSION_WORKFLOW_CONTROL.md](./Z_IDE_FUSION_WORKFLOW_CONTROL.md)
- [AMK_ZUNO_ADVISOR_CONSOLE.md](./AMK_ZUNO_ADVISOR_CONSOLE.md)
- [PHASE_AAL_1_GREEN_RECEIPT.md](./PHASE_AAL_1_GREEN_RECEIPT.md)
- [Z_AUTONOMOUS_GUARDIAN_LOOP.md](./Z_AUTONOMOUS_GUARDIAN_LOOP.md)
- [AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md](./AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md)
- [Z_TRAFFIC_MINIBOTS.md](./Z_TRAFFIC_MINIBOTS.md)
- [Z_ECOSYSTEM_AWARENESS_SPINE.md](./Z_ECOSYSTEM_AWARENESS_SPINE.md)
