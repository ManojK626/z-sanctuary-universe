# Z-REPLICA-FABRIC-1 — Universal governed self-replication fabric

## Purpose

**Z-Replica Fabric** is the **safe engineering translation** of the OMNAI **monocore / shadow replica / factory** vocabulary for the entire Z-Sanctuary AI ecosystem. It **reuses the design language** of recursive scaling and multiplying cognitive surfaces **without** allowing uncontrolled runtime spawning, live bridges, deployments, billing, secrets, or autonomous merges.

Phase **Z-REPLICA-FABRIC-1** ships **documents, JSON registry, sample missions, and a read-only validator** only — no autonomous agents, no provider execution, no background replication workers.

```text
One core doctrine  →  many project-scoped replicas  →  each mission has limits
→  each output returns as evidence  →  AMK approves sacred upgrades
```

## What “infinite” means here

**Infinite** refers to **expandable doctrine and pattern language**, not unbounded execution. The fabric may describe many mission types and project mappings; **runtime behavior stays bounded** by gates, reports, and human approval.

## Locked law

```text
Self-replication ≠ uncontrolled autonomy.
Replica ≠ authority.
Clone ≠ permission.
Factory ≠ deployment.
Self-tools ≠ self-publishing.
Merge-back requires evidence.
BLUE requires AMK for persistent replicas or external lanes.
RED blocks movement.
GREEN ≠ deploy.
AMK-Goku owns sacred moves.
```

## Relation to Z-STILLNESS-LEARN-1

Stillness Mode may include **reading** Replica Fabric doctrine to remember task-scoped vs persistent replica boundaries — **never** spawning replicas or autonomy from idle state. See [Z_STILLNESS_MODE_AI_LEARNING_PATHWAY.md](Z_STILLNESS_MODE_AI_LEARNING_PATHWAY.md).

## How this ties to existing layers

| Layer | Role for the fabric |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Z-MOD-DIST** | Suggests where an idea or module replica **belongs** (routing advisor). |
| **Z-XBUS** | **Only** layer that may eventually govern **external** connectors; fabric replicas **never** open live connector lanes. |
| **Z-SSWS Cockpit** | Workspace / root awareness and deep-work discipline (visibility ≠ execution). |
| **Z-IDE-FUSION** | Parallel IDE evidence and handoff posture (builder alignment, not autonomous spawn). |
| **Z-SEC-TRIPLECHECK** | Drift and forbidden-lane honesty checks across reports and paths. |
| **AMK indicators** | **z_replica_fabric_governance** surfaces fabric signal and posture chips. |

## Replica outputs (allowed)

Replicas in this doctrine may produce **only** categories registered in `data/z_replica_fabric_registry.json`, such as:

- reports, recommendations, documentation drafts
- schemas, mock plans, route suggestions, risk classifications

## Replica actions (forbidden when treated as live)

The registry lists explicit **forbidden replica actions** (for example: runtime self-replication, autonomous deploy, provider calls, payment activation, secret write, external webhooks, child-data flows, auto-merge, production connectors, file-system sprawl, unbounded loops). **No validator in this phase enables them.**

## Merge-back and evidence

Any merge of fabric-related changes into protected branches should carry **receipts**: this report, markdown lint where applicable, and explicit **AMK** acknowledgment for anything that could be interpreted as widening execution or external lanes.

## Commands

```bash
npm run z:replica:fabric
```

Registry parse smoke check:

```bash
node -e "JSON.parse(require('fs').readFileSync('data/z_replica_fabric_registry.json','utf8')); console.log('Z Replica Fabric registry OK')"
```

## Artifacts

| Path | Role |
| ----------------------------------------------------- | -------------------------------------------------------------------- |
| `data/z_replica_fabric_registry.json` | Doctrine registry (mode, lists, mappings, locked law pointers). |
| `data/examples/z_replica_fabric_sample_missions.json` | Advisory missions (+ optional RED fixture when env flag is set). |
| `scripts/z_replica_fabric_check.mjs` | Validator; writes JSON/Markdown reports; syncs indicator **signal**. |
| `data/reports/z_replica_fabric_report.json` | Machine-readable rollup. |
| `data/reports/z_replica_fabric_report.md` | Human-readable rollup. |

## Signals (overall)

| Signal | Meaning |
| ---------- | ----------------------------------------------------------------------------------------------------------------- |
| **GREEN** | Registry posture is doctrine-only; sample missions stay mock/report-safe. |
| **YELLOW** | Optional metadata gaps (for example unknown project mapping or empty rollback notes). |
| **BLUE** | At least one mission proposes persistent replica stance or external lane — AMK decision before execution. |
| **RED** | Registry violation or a mission asserts live forbidden risk (fixture mode or broken data). Validator exits **1**. |

Fixture note: append `fixture_missions` by running with `Z_REPLICA_FABRIC_INCLUDE_FIXTURES=1` **only when deliberately exercising RED**.

## Relation to Z-ULTRA-MAGE-1

**Z-ULTRA-MAGE** rolls replica, routing, connector, traffic, and AMK doctrinal language into a **single formula codex** registry — still **report-only** unless AMK opens chartered execution. See [Z_ULTRA_MAGE_FORMULA_CODEX.md](./Z_ULTRA_MAGE_FORMULA_CODEX.md) and `npm run z:ultra:mage`.

## Relation to Z-PATTERN-SAFE-1

Task-scoped “review bots” or pattern reviewers stay **offline report surfaces** unless AMK charters execution; do not pair replica fabric launches with wagering or guaranteed-prediction exports. Governance map: [Z_PATTERN_SAFE_UNIVERSAL_PATTERN_SIMULATION.md](./Z_PATTERN_SAFE_UNIVERSAL_PATTERN_SIMULATION.md).

Indicator / team routing: [AMK_AI_TEAM_INDICATOR_SYNC_ROUTER.md](./AMK_AI_TEAM_INDICATOR_SYNC_ROUTER.md).

Capability overlap framing (Ultra MAGE / replica siblings): **`npm run z:ai:fusion-map`** ([Z_AI_FUSION_CAPABILITY_MAP.md](./Z_AI_FUSION_CAPABILITY_MAP.md)).

## Receipt

Seal and acceptance checklist: [PHASE_Z_REPLICA_FABRIC_1_GREEN_RECEIPT.md](./PHASE_Z_REPLICA_FABRIC_1_GREEN_RECEIPT.md).
