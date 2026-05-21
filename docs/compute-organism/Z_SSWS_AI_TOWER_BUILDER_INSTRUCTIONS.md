# Z-SSWS + AI Tower — Compute Organism Builder Instructions (ZCO-1)

**Phase:** ZCO-1 — **Cursor / AI Builder instruction spine**
**Project:** Z-Compute Organism / Z-Compute Forge (hardware, motherboard, NAS, cluster, upgrade intelligence)
**Mode:** Markdown + JSON metadata only — **Turtle Mode**

## Purpose

Before any runtime, orchestration, or hardware automation exists, **teach Cursor and future agents how to build** the compute-organism project safely. **Z-SSWS** supplies workspace discipline and route maps; **AI Tower** supplies overseer/agent hierarchy — together they are the **builder instruction spine** for this lane.

**Start here** when opening a Cursor task on Z-Compute Organism. Then read the architecture pack in order (table below).

## Hard law (non-negotiable)

| Rule | Meaning |
| ------------------------- | --------------------------------------------------------------------------------- |
| Turtle Mode only | Branch `cursor/zsanctuary/zco-*`; PR to `main`; no direct main edits |
| Docs + JSON only in ZCO-1 | No runtime orchestration, no deploy, no provider/API wiring |
| No hardware control | No shell scripts that PWM fans, flash BIOS, chain PSUs, or overclock |
| No fake physics | No claim that random motherboards become **one literal CPU/memory brain** |
| Distributed truth | Cluster planning, node awareness, upgrade **guidance**, safe **education** |
| Human sacred moves | Purchases, wiring, power, cooling, networking, deployment, business use → **AMK** |

```text
Observe → verify → suggest → human decides
Readiness ≠ deploy
GREEN ≠ permission to buy, wire, or power on
```

## Read order (builders)

| # | Doc | Role |
| --- | ---------------------------------------------------------------------------------- | -------------------------------------------------------- |
| 1 | [Z_COMPUTE_ORGANISM_ARCHITECTURE.md](Z_COMPUTE_ORGANISM_ARCHITECTURE.md) | Seven layers, reality check, phased roadmap |
| 2 | [Z_SSWS_AI_TOWER_BUILDER_INSTRUCTIONS.md](Z_SSWS_AI_TOWER_BUILDER_INSTRUCTIONS.md) | This spine — SSWS + AI Tower roles |
| 3 | [Z_ARELIUM_SHIELD_INFRASTRUCTURE_ROLE.md](Z_ARELIUM_SHIELD_INFRASTRUCTURE_ROLE.md) | Protective nervous system / trust boundary |
| 4 | [Z_OMNISWARM_CLUSTER_MINIBOTS.md](Z_OMNISWARM_CLUSTER_MINIBOTS.md) | Specialist MiniBots (observer-first) |
| 5 | [Z_FORMULA_INFRASTRUCTURE_ENGINE.md](Z_FORMULA_INFRASTRUCTURE_ENGINE.md) | Fairness, reliability, receipts, optimization vocabulary |
| 6 | [PHASE_ZCO_1_GREEN_RECEIPT.md](PHASE_ZCO_1_GREEN_RECEIPT.md) | Phase seal — no runtime in ZCO-1 |

**Hub authority when unsure:** [../Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](../Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md), [../../AGENTS.md](../../AGENTS.md), [../AI_BUILDER_CONTEXT.md](../AI_BUILDER_CONTEXT.md).

**Examples (metadata only):**

- `../../data/examples/z_compute_node_registry.example.json`
- `../../data/examples/z_compute_swarm_roles.example.json`

## Z-SSWS role (workspace spine)

[Z-SSWS](../Z_SSWS_WORKSPACE_SPINE.md) is the **main workspace and task spine** for the hub — launch requirements, extension metadata, verify command strings, shadow rules — **without executing** them.

For Z-Compute Organism, Z-SSWS means:

| SSWS duty | Builder behavior |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Project discipline** | Confirm repo root is `Z_Sanctuary_Universe` (hub) unless a future satellite charter adds a thin bridge only |
| **Route map** | Point builders to `docs/compute-organism/` — do not fork long doctrine into sibling folders |
| **Launch requirement ≠ launch** | Documenting `npm run` verify commands is allowed; **running** heavy lanes requires operator intent |
| **Shadow / mirror** | Staging docs may live in branches; shadow ≠ deploy |
| **Doorway** | [AMK_PROJECT_DOORWAY_LAUNCHER.md](../AMK_PROJECT_DOORWAY_LAUNCHER.md) opens workspaces — no auto-build from ZCO docs |

**SSWS commands (hub runway — advisory):**

```bash
npm run z:ssws:requirements
npm run z:traffic
npm run z:swarm:14drp
```

## AI Tower role (overseer hierarchy)

**AI Tower** is the colony **overseer layer** in hub doctrine ([Z-SSWS-ALL-PROJECTS-AND-AI-COLONY-BLUEPRINT.md](../Z-SSWS-ALL-PROJECTS-AND-AI-COLONY-BLUEPRINT.md), [Z-SSWS-MINI-BOT-AI-TOWER-MARKDOWN-RELAY.md](../Z-SSWS-MINI-BOT-AI-TOWER-MARKDOWN-RELAY.md)). Code references may live under `core/ai_tower/` — ZCO-1 does **not** require new Tower runtime.

For compute organism, AI Tower means:

| Tower duty | ZCO-1 posture |
| ------------------- | -------------------------------------------------------------- |
| **Observer** | Read registries, receipts, traffic reports — summarize posture |
| **Verifier** | Cross-check claims vs evidence; invoke Troublemaker discipline |
| **Planner** | Suggest smallest Turtle branch — **not** execute |
| **Explainer** | Teach operators; route to ExplainBot docs |
| **Coordinator** | Roll up MiniBot signals — **no** dispatch authority |
| **Topology mapper** | Declared nodes only — no LAN scan |
| **Upgrade advisor** | Compatibility hints — AMK for purchases/installs |

**Tower may:** observe, classify, summarize, suggest doc/report updates.
**Tower must not:** deploy, merge, mutate NAS, scan arbitrary PC paths, auto-fix hardware, bind production edge, access secrets.

## Layer stack (how SSWS + Tower fit)

| Layer | Owner | ZCO-1 function |
| -------------------------- | ---------------------------- | ---------------------------------------------------- |
| **Z-SSWS** | Workspace spine | Builder route map, verify strings, Turtle discipline |
| **AI Tower** | Overseer hierarchy | Observer / planner / explainer for agents |
| **Z-Arelium Shields** | Safety membrane | Trust, isolation, health policy |
| **Z-OMNI AI** | Global overseer intelligence | Topology + upgrade **vocabulary** (not OS) |
| **Z-OMNISWARM + MiniBots** | Specialists | Thermal, power, storage, security, etc. |
| **Z-Formulas** | Optimization frames | Fairness, reliability, receipts |
| **14 DRP** | Ethical permission gate | Overrides all formulas |
| **Turtle Mode** | Build discipline | Small PRs, human merge |

## Cursor task template (copy-ready)

```md
You are in Z_Sanctuary_Universe — Z-Compute Organism (ZCO-1).

Read first:
docs/compute-organism/Z_SSWS_AI_TOWER_BUILDER_INSTRUCTIONS.md
docs/compute-organism/Z_COMPUTE_ORGANISM_ARCHITECTURE.md

Hard law: docs + JSON only; no runtime; no hardware control; no deploy;
no unified-motherboard physics claims; AMK for power/wiring/purchases.

One domain per branch: docs/compute-organism OR data/examples — not both
unless explicitly requested.

Before suggesting work: npm run z:traffic (advisory).
After doc edits: npm run verify:md on touched paths.

Output: files changed, verification exit codes, confirm no runtime added.
```

## Agent questions (universal — answer before suggesting)

From [Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md](../Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md):

1. Which repo root am I in?
2. Is this hub or a satellite?
3. What may I read?
4. What may I change?
5. What is forbidden?
6. Which signal is active (GREEN/YELLOW/BLUE/RED)?
7. Does AMK need to decide?
8. What is the smallest safe next action?
9. What evidence proves it?
10. What rollback exists?

## Forbidden builder outputs (ZCO-1)

- Orchestration daemons, Kubernetes operators, or schedulers
- Scripts that probe hardware, scan networks, or mutate PSU/fan/BIOS
- Provider API keys, cloud deploy manifests, or auto-merge
- Marketing copy implying infinite scale or quantum hardware speedup
- Registry entries presented as live inventory without operator declaration

## Allowed builder outputs (ZCO-1)

- Architecture and safety markdown under `docs/compute-organism/`
- Example JSON under `data/examples/`
- Cross-links in `AI_BUILDER_CONTEXT.md`, `docs/INDEX.md`, `Z_SSWS_WORKSPACE_SPINE.md`
- Green receipts and phased roadmap tables
- Read-only report **design** paragraphs (implementation = ZCO-2+ with receipt)

## Verification (operator / agent)

```bash
npm run verify:md
npm run z:compute:organism
npm run z:compute:intake
npm run z:compute:upgrade-draft
npm run z:traffic
npm run z:car2
```

**ZCO-2 status report:** `data/reports/z_compute_organism_status.{json,md}` — read-only infrastructure awareness; does not execute hardware or orchestration.

**ZCO-3 dashboard:** `dashboard/panels/z-compute-organism-dashboard-readonly.html` — GET status JSON only; [Z_COMPUTE_ORGANISM_DASHBOARD_SYSTEM.md](Z_COMPUTE_ORGANISM_DASHBOARD_SYSTEM.md).

**ZCO-4 intake:** [ZCO_4_HARDWARE_INTAKE_POLICY.md](ZCO_4_HARDWARE_INTAKE_POLICY.md) — manual inventory examples under `data/examples/zco_*.example.json`; no scan or telemetry.

**ZCO-5 validator:** `npm run z:compute:intake` — env `ZCO_INVENTORY_PATH` or default example; [ZCO_5_LOCAL_INTAKE_VALIDATOR.md](ZCO_5_LOCAL_INTAKE_VALIDATOR.md).

**ZCO-6 upgrade draft:** `npm run z:compute:upgrade-draft` — after intake; reads validation report + inventory; [ZCO_6_AI_ASSISTED_UPGRADE_PLAN_DRAFT.md](ZCO_6_AI_ASSISTED_UPGRADE_PLAN_DRAFT.md). Advice only — AMK gate for acquire/install.

**ZCO-7 cockpit embed:** `dashboard/panels/z-compute-organism-dashboard-readonly.html` — GET status + intake + draft; [ZCO_7_DASHBOARD_INTAKE_DRAFT_EMBED.md](ZCO_7_DASHBOARD_INTAKE_DRAFT_EMBED.md).

**ZCO-8 probe charter:** [ZCO_8_PROBE_CHARTER_DOCTRINE.md](ZCO_8_PROBE_CHARTER_DOCTRINE.md) — doctrine only; no probe runtime until ZCO-9+ with AMK + Z-ATE receipt.

If `verify:md` fails on unrelated hub MD060 debt, lint only touched ZCO paths:

```bash
npx markdownlint-cli2 "docs/compute-organism/**/*.md"
```

## Locked law

```text
Teach the project before building the project.
Z-SSWS = discipline and routes, not auto-launch.
AI Tower = overseer roles, not datacenter control.
ZCO-1 = doctrine spine only.
AMK-Goku owns sacred moves.
```
