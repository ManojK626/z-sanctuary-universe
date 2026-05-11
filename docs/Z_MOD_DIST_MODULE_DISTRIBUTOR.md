# Z-MOD-DIST-1 — Module Distributor / Co-Design Router

## Purpose

**Z-MOD-DIST** is a **read-only routing advisor**: it reads a **routing registry** and **suggest** where a new idea (module, media concept, dashboard, policy, workflow, creative pipeline, or commercial slice) likely belongs in the Z-Sanctuary ecosystem—using **forecast / suggestion / routing** language only, never prediction certainty.

## Scope

- Hub **docs + JSON registry + sample inputs + validator reports**
- **No** live AI inference, backend, provider calls, deployment, billing, secrets
- **No** runtime bridge execution, auto-launch, auto-merge, scraping, profiling, or autonomous execution
- **No** automatic project creation

## Outputs

| Artifact | Role |
| --------------------------------------------- | -------------------------------------------------------- |
| `data/z_mod_dist_routing_registry.json` | Router rules, workspaces, gates, forbidden claims |
| `data/examples/z_mod_dist_sample_inputs.json` | Example intents (fixtures optional via env; see receipt) |
| `scripts/z_mod_dist_route_check.mjs` | Read-only classifier + reports |
| `data/reports/z_mod_dist_report.json` / `.md` | Advisory routing results |

## Command

```bash
npm run z:mod:dist
```

## Known workspaces (keys)

Registry keys include: `main_hub`, `ZSanctuary_Labs`, `z_questra`, `Z_Saiyan_Lumina`, `AT_Princess_Blackie_Franed`, `Z_OMNAI`, `Z_SUSBV`, `xl2_reference_only`. Labels are human-readable in JSON.

## Signals

| Signal | Meaning |
| ---------- | --------------------------------------------------------------- |
| **GREEN** | Registry valid; samples only safe advisory routes |
| **YELLOW** | Some sample had no rule match, or minor registry gap |
| **BLUE** | Fixture or flag paths requiring AMK/charter (when included) |
| **RED** | Forbidden lane in registry or sample (e.g. deploy without gate) |

## Locked law

```text
Routing suggestion ≠ permission.
Module forecast ≠ future certainty.
Good fit ≠ deployment approval.
Shared pattern ≠ shared entitlement.
GREEN ≠ deploy.
BLUE requires AMK.
RED blocks movement.
AMK-Goku owns sacred moves.
```

## Relation to Z-XBUS-GATE-1

**Z-MOD-DIST** answers _where an idea belongs_. **Z-XBUS** answers _whether it may later connect outside_ under charter and AMK gates. After routing, register connector intent in the XBUS registry before any live integration — see [Z_XBUS_EXTERNAL_CONNECTOR_GATE.md](Z_XBUS_EXTERNAL_CONNECTOR_GATE.md) and `npm run z:xbus:gate`.

## Relation to Z-REPLICA-FABRIC-1

**Z-REPLICA-FABRIC** answers _how OMNAI-style replica language is bounded_ across projects: task-scoped outputs, no live clone execution, and **AMK** on persistent or external proposals. See [Z_REPLICA_FABRIC_GOVERNED_SELF_REPLICATION.md](Z_REPLICA_FABRIC_GOVERNED_SELF_REPLICATION.md) and `npm run z:replica:fabric`.

## Relation to Z-ULTRA-MAGE-1

**Z-ULTRA-MAGE** rolls routing, replica, connector-class, safety, and traffic language into one **formula governance codex** — still evidence-only in phase 1. See [Z_ULTRA_MAGE_FORMULA_CODEX.md](Z_ULTRA_MAGE_FORMULA_CODEX.md) and `npm run z:ultra:mage`.

## Relation to Z-NUMEN / Logical Brains

Example: **Z-NUMEN**-class ideas should match **learning / perception** rules and land in **ZSanctuary_Labs** first, with **hub reference** added only as a separate gated step—same pattern as Logical Brains and NUMEN hub registration.

## Relation to Z-PATTERN-SAFE-1

Prediction-simulation or “pattern engine” concepts should declare **education / uncertainty / gated** posture in **`data/z_pattern_safe_registry.json`** before MOD-DIST suggests a capsule — wagering or bankroll optimisation never routes as a GREEN “product.” See [Z_PATTERN_SAFE_UNIVERSAL_PATTERN_SIMULATION.md](Z_PATTERN_SAFE_UNIVERSAL_PATTERN_SIMULATION.md) and `npm run z:pattern:safe`.

## Relation to AMK-AI-SYNC-1

When a slice is ambiguous, **`npm run amk:ai-sync`** emits **packets** tying **intent → team → checks** — MOD-DIST remains the capsule owner for “where belongs,” AI-SYNC is the **traffic layer** atop indicators. See [AMK_AI_TEAM_INDICATOR_SYNC_ROUTER.md](AMK_AI_TEAM_INDICATOR_SYNC_ROUTER.md).

## Relation to Z-AI-FUSION-MAP-1

Before spawning a routing clone, check **`npm run z:ai:fusion-map`** — `z_mod_dist` should stay distinct from AMK routing packets (`LEAD_SUPPORT` posture documented in registry pairs). Doctrine: [Z_AI_FUSION_CAPABILITY_MAP.md](Z_AI_FUSION_CAPABILITY_MAP.md).

## AMK dashboard visibility (AMK-DASH-MOD-DIST-1)

On **AMK-INDICATOR-1** panels (`dashboard/Html/index-skk-rkpk.html`, `amk-goku-main-control.html`, shadow workbench), the row **`z_mod_dist_routing_advisor`** shows posture chips and short law lines so AMK sees **advisory-only** framing. When the hub is served over HTTP, **`signal`** overlays from **`data/reports/z_mod_dist_report.json`** (`npm run z:mod:dist`). Doctrine: [AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md](./AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md); receipt: [PHASE_AMK_DASH_MOD_DIST_1_GREEN_RECEIPT.md](./PHASE_AMK_DASH_MOD_DIST_1_GREEN_RECEIPT.md).
