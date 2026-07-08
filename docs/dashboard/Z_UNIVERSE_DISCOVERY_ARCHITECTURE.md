# Universe Discovery Architecture (MC-0.5)

**System ID:** Z-UNIVERSE-DISCOVERY-1
**Version:** 1.0
**Date:** 2026-07-04
**Posture:** Read-only · discovery-first · no project mutations

---

## Mission

Conduct complete **read-only discovery** of the configured PC workspace so **no project is forgotten**, while preserving Merge Hold, Turtle Mode, and governance.

This is **not** implementation, migration, or integration.

---

## Scope boundary

| In scope                                      | Out of scope                  |
| --------------------------------------------- | ----------------------------- |
| `pc_root` from `data/z_pc_root_projects.json` | Arbitrary drive scanning      |
| Registry rows + top-level disk folders        | Modifying sibling repos       |
| Git/tech/docs probes (read-only)              | Merge, deploy, delete, rename |
| Classification + Mission Control registration | Automatic integration         |

Aligns with Z-CONTROL-LINK-1: manifest-driven discovery, not unbounded disk enumeration.

---

## Pipeline

```text
Configured pc_root + z_pc_root_projects.json
        ↓
z_universe_discovery_scan.mjs (read-only probes)
        ↓
data/z_universe_project_registry.json
data/reports/z_universe_discovery_report.{json,md}
        ↓
z_universe_status_report.mjs (rollup expansion)
        ↓
AMK-Goku Indicator Dashboard (future MC-1 overlay)
```

---

## Classification lanes (exactly one per project)

| Lane     | Meaning                       | Examples                      |
| -------- | ----------------------------- | ----------------------------- |
| core     | Primary strategic             | Z_Sanctuary_Universe, Z_Labs  |
| growing  | Future integration candidates | Member repos with code        |
| research | Experiments / Replit / PaaS   | External PaaS, Replit         |
| archive  | Legacy / stub / retired       | Retired stub, compassion stub |
| unknown  | Needs AMK review              | Missing docs, unclear purpose |

---

## Mission Control integration states

| Status                          | Meaning                                         |
| ------------------------------- | ----------------------------------------------- |
| integrated                      | Mission Control host (hub) or department-linked |
| registered_awaiting_integration | In PC registry, visible, Turtle Mode            |
| disk_unregistered               | On disk but not in `z_pc_root_projects.json`    |
| link_only_external              | Replit/hosted — no local folder                 |

Every project shows: **Registered · Turtle Mode · No Runtime Coupling** unless explicitly integrated.

---

## Commands

```bash
npm run z:universe:discovery
npm run z:universe:registry:refresh   # idempotent re-scan
npm run z:universe:status             # includes registry expansion
```

---

## Deliverables

| Artifact                                                                                 | Role                                                   |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| [Z_UNIVERSE_PROJECT_REGISTRY.md](Z_UNIVERSE_PROJECT_REGISTRY.md)                         | Human registry index                                   |
| [Z_UNIVERSE_DISCOVERY_REPORT.md](../../data/reports/z_universe_discovery_report.md)      | Generated report (on run)                              |
| `data/z_universe_project_registry.json`                                                  | Machine registry                                       |
| [Z_UNIVERSE_MISSION_CONTROL_ARCHITECTURE.md](Z_UNIVERSE_MISSION_CONTROL_ARCHITECTURE.md) | MC-0 parent                                            |
| [Z_UNIVERSE_CENSUS_MC_0_6_ARCHITECTURE.md](Z_UNIVERSE_CENSUS_MC_0_6_ARCHITECTURE.md)     | MC-0.6 census enrichment · `npm run z:universe:census` |

---

## Validation checklist

- [ ] Every disk folder at pc_root top-level acknowledged or skipped (node_modules, .cursor)
- [ ] Every registry row probed
- [ ] No sibling project files modified
- [ ] Merge Hold unchanged
- [ ] Turtle Mode unchanged

---

## Related

- [Z_SANCTUARY_UNIVERSE_RESOLUTION_2026_07_04.md](../Z_SANCTUARY_UNIVERSE_RESOLUTION_2026_07_04.md)
- [AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md](../AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md)
