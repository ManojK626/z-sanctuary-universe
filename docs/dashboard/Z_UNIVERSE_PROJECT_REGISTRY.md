# Z-Sanctuary Universe Project Registry

**Schema:** `z_universe_project_registry_v1_1`
**Machine source:** [data/z_universe_project_registry.json](../../data/z_universe_project_registry.json)
**Immutable IDs:** [data/z_universe_id_map.json](../../data/z_universe_id_map.json)
**Refresh:** `npm run z:universe:discovery`
**Posture:** Read-only · Turtle Mode · Merge Hold · no runtime coupling

---

## Purpose

Canonical **global project registry** for Mission Control — every PC workspace project acknowledged, classified, and visible to the AMK-Goku Indicator Dashboard without automatic integration.

---

## Summary (last scan)

| Metric                                   | Value         |
| ---------------------------------------- | ------------- |
| Total projects                           | 25            |
| On disk                                  | 21            |
| Disk unregistered                        | 1 (`Backups`) |
| Core                                     | 4             |
| Growing                                  | 10            |
| Research                                 | 4             |
| Archive                                  | 2             |
| Unknown                                  | 5             |
| Mission Control integrated               | 1 (hub)       |
| Awaiting integration                     | 19            |
| Documentation strong / partial / missing | 5 / 11 / 9    |

Full report: [data/reports/z_universe_discovery_report.md](../../data/reports/z_universe_discovery_report.md)

---

## Standard project record fields

| Field                                       | Description                                                        |
| ------------------------------------------- | ------------------------------------------------------------------ |
| universe_id                                 | Immutable `ZSU-NNNN` from `z_universe_id_map.json`                 |
| stable_key                                  | Persistent key (registry id or disk path hash) — survives renames  |
| project_name                                | Display name                                                       |
| local_root_path                             | Relative to pc_root                                                |
| description                                 | From registry notes or discovery                                   |
| technology_stack                            | Detected stack (read-only probe)                                   |
| repository_status                           | Git branch/HEAD if repo                                            |
| current_phase                               | Lifecycle phase label                                              |
| architecture / governance / …               | Multi-dimensional status (no single score)                         |
| classification_lane                         | core · growing · research · archive · unknown                      |
| mission_control_status                      | integrated · registered_awaiting · disk_unregistered · link_only   |
| merge_hold / turtle_mode / runtime_coupling | Always true / true / false unless chartered                        |
| recommended_next_action                     | Operator guidance                                                  |
| timeline                                    | first_discovered · last_reviewed · last_activity · lifecycle_stage |
| confidence                                  | Per-field confirmed / inferred / unknown                           |
| owner                                       | AMK-Goku                                                           |

---

## Core lane (strategic)

| Project                            | Path                     | Notes                                      |
| ---------------------------------- | ------------------------ | ------------------------------------------ |
| Z_Sanctuary_Universe               | `Z_Sanctuary_Universe`   | Hub · Mission Control host · integrated    |
| Z_Sanctuary_Universe 2 (PC root)   | `Z_Sanctuary_Universe 2` | Continuation tree — clarify canonical path |
| Z_Labs                             | `Z_Labs`                 | Approved satellite · markdown relay        |
| ZSanctuary_Universe (retired stub) | `ZSanctuary_Universe`    | **Archive** — do not use as hub            |

Charter products inside hub (Z-Connect, VILE, ZILWA, Nexus) are documented under hub `docs/` — departments in `data/z_universe_department_registry.json`.

---

## Disk unregistered (action required)

| Folder  | Recommendation                                                                     |
| ------- | ---------------------------------------------------------------------------------- |
| Backups | AMK review — register purpose in `z_pc_root_projects.json` or document as ops sink |

---

## Duplicate candidates

1. **AT Princess & Blackie Copilot** — two registry ids, same path (`at-princess-blackie-copilot` / `at-princess-blackie-copitol`)
2. **Z_Sanctuary_Universe 2** — nested under hub vs PC root sibling

Human-gated consolidation only.

---

## Dependency map (read-only)

See `dependency_map` in JSON — hub governance spine, Z_Labs satellite link, VILE packages in hub monorepo, Z-Connect charter docs (no runtime bridge).

---

## Integration law

> Registered · Awaiting Integration · Turtle Mode · No Runtime Coupling

Buttons and dashboard panels **observe** this registry — they do not auto-integrate or auto-deploy.

---

## Related

- [Z_UNIVERSE_DISCOVERY_ARCHITECTURE.md](Z_UNIVERSE_DISCOVERY_ARCHITECTURE.md)
- [Z_UNIVERSE_MISSION_CONTROL_ARCHITECTURE.md](Z_UNIVERSE_MISSION_CONTROL_ARCHITECTURE.md)
- [data/z_pc_root_projects.json](../../data/z_pc_root_projects.json)
