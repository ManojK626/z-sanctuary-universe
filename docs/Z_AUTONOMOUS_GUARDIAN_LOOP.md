# Z-Autonomous Guardian Loop

## Intent

**Z-Sanctuary can use autonomy for reflexes, not for uncontrolled power.**

The **Z-Autonomous Guardian Loop** is the doctrine for background-style AI and automation across docs, dashboards, registries, and project reports: **observe and report freely**, **hygiene only when opted in**, **apply only in opened Turtle lanes**, **sacred actions only with charter**.

Canonical split:

```text
Observe automatically    yes
Report automatically     yes
Fix tiny safe hygiene    only when explicitly approved / invoked
Suggest next lanes       yes (advisory)
Execute risky changes    never without AMK/human gate
Deploy / bill / bridge   never without charter
```

## Autonomy levels

Detailed tables and rules: [Z_AUTONOMY_LEVELS_POLICY.md](./Z_AUTONOMY_LEVELS_POLICY.md).
Machine-readable policy: [`data/z_autonomy_task_policy.json`](../data/z_autonomy_task_policy.json).

## Safe evidence rhythm (L0–L1)

These are **evidence tasks**, not power tasks. They may run in a guarded local or CI context without changing commercial truth:

```bash
npm run verify:md
npm run z:car2
npm run dashboard:registry-verify
npm run z:cross-project:sync
npm run z:traffic
npm run z:swarm:14drp
```

Deeper, **opt-in** packs (treat as **L2** when they regenerate large doc surfaces):

```bash
npm run z:ai-builder:refresh
node scripts/z_traffic_minibots_status.mjs --deep --with-questra
```

Project-specific example:

```bash
cd z-questra && npm test
```

## Integration map (conceptual)

| Companion | Role |
| -------------------------- | ----------------------------------------------- |
| Z-Traffic Minibots | Readiness signals GREEN/YELLOW/RED/BLUE |
| Zuno coverage audit | Registry/doc coverage evidence |
| Z-CAR² | Drift and duplication report |
| AI Builder refresh | Regenerated module docs when explicitly run |
| Z-MAOS | Operator routing — human-in-the-loop |
| NAV / workstation catalog | Cockpit metadata — not entitlement |
| ZSX / entitlement catalogs | Capability vs billing separation |
| 14 DRP and 14 DOP | Gates before memory, bridges, sacred automation |

## Turtle Mode

- **One domain, one purpose, one rollback** per lane.
- AMK/human **opens** the lane; minibots **do not** choose the destination alone.
- See `.cursor/rules/z-turtle-mode-cursor-agents.mdc` and [Z_TRAFFIC_MINIBOTS.md](./Z_TRAFFIC_MINIBOTS.md).

## Future ladder (do not skip)

Automation may climb in order; **ZAG-1** is doctrine only:

1. **ZAG-1** — Policy and docs (this phase).
2. **ZAG-2** — Manual read-only loop script.
3. **ZAG-3** — Scheduled local **report-only** task.
4. **ZAG-4** — CI **report-only** workflow.
5. **ZAG-5** — Patch suggestion bot.
6. **ZAG-6** — Human-approved apply mode.
7. **ZAG-7** — Chartered live automation for **selected** safe tasks only.

There is no permission for “nonstop autonomous improvement” at the top rung without climbing the ladder.

## What ZAG-1 does not ship

- No daemons, no silent schedulers, no auto-merge, no deploy hooks added by this doctrine.
- This document does **not** authorize new provider calls, billing, or live bridges.

## Z-AAL Autonomous Approval Ladder (AAL-1)

**Z-AAL** adds a machine-readable ladder (`dashboard/data/amk_autonomous_approval_ladder.json`) and a **Zuno Advisor Console** on the AMK main control dashboard: **auto-lane candidates** vs **AMK sacred lane**, L0–L5 copy, and deterministic “what next?” hints — **no** LLM API, voice, deploy, bridge, or billing from the UI. See [AMK_AUTONOMOUS_APPROVAL_LADDER.md](./AMK_AUTONOMOUS_APPROVAL_LADDER.md) and [AMK_ZUNO_ADVISOR_CONSOLE.md](./AMK_ZUNO_ADVISOR_CONSOLE.md).

## Z-AWARE-1 Universal Ecosystem Awareness Spine

**Z-AWARE-1** (`data/z_ecosystem_awareness_registry.json` + `npm run z:ecosystem:awareness`) aggregates **project capsules** and routes **RED/BLUE** only toward AMK notification candidates by default. L1 evidence task — not execution. See [Z_ECOSYSTEM_AWARENESS_SPINE.md](./Z_ECOSYSTEM_AWARENESS_SPINE.md).

## AMK-Goku Notifications (Phase AMK-NOTIFY-1)

The **AMK-Goku Notifications** dashboard panel shows **autonomy_level** and lane suggestions; it **does not** execute ZAG-tier work from the browser. Confirmation opens lanes **outside** the UI — see [AMK_GOKU_OPERATOR_CONFIRMATION_POLICY.md](./AMK_GOKU_OPERATOR_CONFIRMATION_POLICY.md).

## Related

- [Z_AUTONOMY_LEVELS_POLICY.md](./Z_AUTONOMY_LEVELS_POLICY.md)
- [Z_AUTONOMOUS_GUARDIAN_LOOP_GREEN_RECEIPT.md](./Z_AUTONOMOUS_GUARDIAN_LOOP_GREEN_RECEIPT.md)
- [Z_TRAFFIC_MINIBOTS.md](./Z_TRAFFIC_MINIBOTS.md)
- [Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md](./Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md)
- [AMK_AUTONOMOUS_APPROVAL_LADDER.md](./AMK_AUTONOMOUS_APPROVAL_LADDER.md)
