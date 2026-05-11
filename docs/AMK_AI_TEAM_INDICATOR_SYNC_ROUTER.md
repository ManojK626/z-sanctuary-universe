# AMK-AI-SYNC-1 — AMK indicator sync observer + Z-AI team decision router

Formal ID: **AMK-AI-SYNC-1** — keeps **dashboard indicators** truthful against new modules/doc slices and gives **routing evidence** (“which AI-shaped lane should humans open first”) without assigning **sacred authority** to automation.

## Purpose

Provide a **read-only nervous-system**:

1. **Observe** drift between manifests (registries, reports, indicators, receipts).
2. **Route** intents to named **AI teams** (MOD-DIST, XBUS, SEC, Pattern-Safe, Replica, Ultra MAGE, IDE-Fusion, MU, NUMEN, Logical Brains, SUSBV, Indicator surface).
3. Emit **decision packets** suited for **AMK-Goku Personal AI summaries** — **evidence, not permission**.

Phase 1 is **observe + classify + propose only**. Validator **never** silently edits `amk_project_indicators.json`.

```text
New idea enters → classify → propose checks + team → packets for AMK → human sacred decision
```

## AI team surface (routing targets)

Teams are identifiers in **`data/amk_ai_team_router_registry.json`** (`ai_teams`). Routing rules map **keywords** to `primary_ai_team`, `supporting_ai_teams`, `required_commands`, and `signal_policy`.

| Need | Routes toward |
| ------------------------------ | ------------------------------------------------------------------- |
| Indicator row completeness | AMK Indicator team |
| Module placement | Z-MOD-DIST team |
| External connector | Z-XBUS team |
| Forbidden / safety posture | Z-SEC Triplecheck team |
| Pattern / prediction metaphors | Z-PATTERN-SAFE team |
| Replica / reviewer doctrine | Z-Replica Fabric team |
| Formula / doctrine rollup | Z-Ultra MAGE team |
| IDE / Cursor rhythm | Z-IDE-Fusion + Z-PC/Z-CMD |
| Learning pathways | Logical Brains team |
| Pattern literacy symbolism | Z-NUMEN team |
| Civic Mauritius rows | Z-MU Truth / Advisor team |
| Commercial readiness | Z-SUSBV team |
| Sacred escalation | Personal AI summary + AMK halt |
| Idle / no active task | Z-STILLNESS pathway — read-only learning + alignment summaries only |

## Decision packet shape

Each routed sample emits JSON matching **`decision_packet_schema.fields`**:

- `decision_id`, `topic`, `recommended_ai_team`
- `supporting_checks` (usually `npm run …`)
- `signal`, `why`, `safe_next_action`
- `forbidden_actions`, `amk_decision_required`

## Indicator sync checklist (conceptual)

The registry lists **`indicator_sync_checks`** operators should satisfy before treating a slice as dashboard-worthy:

```text
module_has_indicator_row, module_has_report, module_has_go_no_go,
module_has_related_docs, module_has_receipt, module_has_signal,
module_has_forbidden_lanes
```

**Phase 1:** validator **reports** mismatches via sample narratives and YAML-style hints — **does not mutate** canonical indicator JSON automatically.

## Command

```bash
npm run amk:ai-sync
```

Exercise RED classifier path (fixtures — validator exits **1**):

```powershell
$env:AMK_AI_SYNC_INCLUDE_RED_FIXTURE='1'
npm run amk:ai-sync
```

## Locked law

```text
Indicator sync ≠ auto-edit.
AI team routing ≠ authority.
Decision packet ≠ permission.
Personal AI summary ≠ sacred approval.
GREEN ≠ deploy.
BLUE requires AMK.
RED blocks movement.
AMK-Goku owns sacred moves.
```

## Artifacts

| Path | Role |
| ----------------------------------------------- | -------------------------------------------------- |
| `data/amk_ai_team_router_registry.json` | Teams + routing rules + checklist keys |
| `data/examples/amk_ai_team_router_samples.json` | Scenarios (+ optional RED fixture) |
| `scripts/amk_ai_team_sync_check.mjs` | Generates `data/reports/amk_ai_team_sync_report.*` |
| Receipt | `docs/PHASE_AMK_AI_SYNC_1_GREEN_RECEIPT.md` |

## Related

- [AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md](AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md)
- [Z_AI_FUSION_CAPABILITY_MAP.md](Z_AI_FUSION_CAPABILITY_MAP.md)
- [Z_MOD_DIST_MODULE_DISTRIBUTOR.md](Z_MOD_DIST_MODULE_DISTRIBUTOR.md)
- [Z_XBUS_EXTERNAL_CONNECTOR_GATE.md](Z_XBUS_EXTERNAL_CONNECTOR_GATE.md)
- [Z_PATTERN_SAFE_UNIVERSAL_PATTERN_SIMULATION.md](Z_PATTERN_SAFE_UNIVERSAL_PATTERN_SIMULATION.md)
