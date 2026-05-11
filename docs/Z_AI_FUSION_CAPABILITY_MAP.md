# Z-AI-FUSION-MAP-1 — AI capability overlap + fusion governance map

Formal ID: **Z-AI-FUSION-MAP-1** — read-only **role clarity** for Z-Sanctuary “AI-shaped” lanes (validators, routers, gates, reference capsules) so growth does not create **crowded dashboards** or **unclear ownership**.

## Purpose

- Map **capabilities** with purpose, outputs, forbiddens, and **lead/support/reference** stance.
- Score **overlap** from metadata only (purpose/output/gate/domain similarity) — **`overlap_score`** **suggests**; AMK confirms.
- Emit **fusion recommendations**: `KEEP_SEPARATE`, `LEAD_SUPPORT`, `ALIAS_TO_LEAD`, `MERGE_DOCS_ONLY`, `DEPRECATE_REFERENCE_ONLY`, `BLUE_AMK_REVIEW`, `RED_BLOCKED`.

Phase 1 ships **documents + registry + classifier + AMK indicator overlay** — **no** merging code paths, runtime agents, or automatic indicator rewires.

## Core law

```text
Fusion ≠ deletion.
Overlap ≠ error by default.
Similar AI ≠ duplicate.
Merge recommendation ≠ automatic merge.
AMK-Goku owns sacred consolidation moves.
Score suggests.
AMK decides.
```

## Relation to Z-STILLNESS-LEARN-1

When idle, assistants may compare roles and overlaps using fusion **docs and reports** as read-only orientation — outputs stay summaries and suggestions; **no** auto-merge or indicator mutation. See [Z_STILLNESS_MODE_AI_LEARNING_PATHWAY.md](Z_STILLNESS_MODE_AI_LEARNING_PATHWAY.md).

## What it overlaps with elsewhere

| System | Roles |
| ------------------------------------- | ---------------------------------------------------------------- |
| **Z-AI-FUSION-MAP** | **Who does what** — lead/support/alias clarity |
| **AMK-AI-SYNC** | **Which team to ask first** — routing packets |
| **Z-MOD-DIST** | **Where modules live** |
| **Z-XBUS / Z-PATTERN-SAFE / Z-SEC …** | **Domain gates** that fusion map references but does not replace |

## Artifacts

| Path | Role |
| --------------------------------------------------- | ---------------------------------------------- |
| `data/z_ai_fusion_capability_registry.json` | Domains + `ai_capabilities[]` rows |
| `data/examples/z_ai_fusion_capability_samples.json` | Paired evaluations (+ optional RED fixture) |
| `scripts/z_ai_fusion_map_check.mjs` | Writes `data/reports/z_ai_fusion_map_report.*` |

## Command

```bash
npm run z:ai:fusion-map
```

RED fixture drill (forces exit **1**):

```powershell
$env:Z_AI_FUSION_INCLUDE_RED_FIXTURE='1'
npm run z:ai:fusion-map
```

## Related

- Policy (dedup framing): [Z_AI_FUSION_DEDUP_AND_ROLE_POLICY.md](Z_AI_FUSION_DEDUP_AND_ROLE_POLICY.md)
- Receipt: [PHASE_Z_AI_FUSION_MAP_1_GREEN_RECEIPT.md](PHASE_Z_AI_FUSION_MAP_1_GREEN_RECEIPT.md)
- Router counterpart: [AMK_AI_TEAM_INDICATOR_SYNC_ROUTER.md](AMK_AI_TEAM_INDICATOR_SYNC_ROUTER.md)
