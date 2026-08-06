# Registry Atlas — Where Truth Lives

**Status:** ✅ TURTLE STEP 2 · READ-ONLY ATLAS
**Date:** 2026-08-03
**Question answered:** *If I need the truth about something, where do I go?*
**Law:** Not another registry · not a management layer · awaken, don't replace · freshness is part of trust
**Gate:** Does this strengthen stewardship? → **Yes**

---

## One flow (remember this)

```text
Master Register (human narrative)
       │
       ▼
Project registries (PC-root · Universe)
       │
       ▼
AI registries (Family · hierarchy)
       │
       ▼
Module registries (manifest → synced)
       │
       ▼
Operational reports (data/reports/)
       │
       ▼
Stewardship certificates
```

**Reports are evidence of a moment in time** — always read `generated_at` / age.
**Registries are citizenship / identity** — who and what belongs.

---

## Atlas table

| Name | Purpose | Steward / owner | File location | Depends on | Source of truth? | Last updated (file / field) | NHV |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Master Modules Register** | Human narrative of modules & priorities | AMK · Hierarchy Chief | `docs/Z-MASTER-MODULES-REGISTER.md` | Hierarchy Chief · Constitution | **Yes** (human spine for modules) | 2026-08-02 (mtime) | Keep aligned with manifest |
| **PC-root projects** | Organiser folder citizens · paths · roles | AMK · Z-EAII | `data/z_pc_root_projects.json` | Disk under PC root | **Yes** for on-disk PC projects | 2026-07-10 / `updated_at` | Empty-path externals |
| **Universe project registry** | Broader census / Mission Control | AMK · Mission Control docs | `data/z_universe_project_registry.json` | PC-root + discovery | **Yes** for universe citizenship language | 2026-07-10 / `generated_at` ~07-08 | Cross-check PC-root |
| **Module manifest** | Machine module cards (ACN/MTEH) | AMK · Z-EAII | `data/z_module_manifest.json` | Master Register intent | **Yes** for module *ids* before sync | 2026-05-20 (mtime) | May lag Master Register |
| **Module registry (synced)** | Generated / synced module list | Scripts · Z-EAII | `data/Z_module_registry.json` | Module manifest | **No** — derived | 2026-04-29 (mtime) | Prefer manifest if conflict |
| **Master module registry (JSON)** | Alternate machine master list | Hub | `data/z_master_module_registry.json` | Manifest / Register | **No** if conflicts with MD Register + manifest | 2026-05-01 (mtime) | Prefer MD + manifest |
| **Family AI registry** | Family / companion AI identity | AMK | `data/z_family_ai_registry.json` | PC-root for paths | **Yes** for family AI *identity* | 2026-08-01 / `updated_at` 07-24 | No runtime coupling |
| **MDGEV dashboard registry** | Hub dashboard tile catalog | AMK · HODP | `data/z_mdg_dashboard_registry.json` | Panel HTML paths | **Yes** for MDGEV tiles | 2026-08-01 (mtime) | Not all panels are tiled |
| **Stewardship certificates** | Backup / stewardship proofs | AMK | `data/z_stewardship_certificate_registry.json` | Wave runbooks · inventory | **Yes** for certificate *records* | 2026-08-01 / field 07-24 | BOM/encoding hygiene |
| **Growth / sealed systems** | Ecosystem stage · sealed lanes | AMK · Overseer | `data/z_ecosystem_growth_stage_registry.json` | Observe receipts | **Yes** for sealed-system list | 2026-07-21 / field older | Stage labels age |
| **Satellite control-link** | Manifest of satellite bridge targets | AMK · Control-root | `data/z_satellite_control_link_manifest.json` | Hub policy | **Yes** for which satellites may sync | 2026-08-01 / field 05-11 | NAS_WAIT rows |
| **Doorway workspace** | Governed open targets | AMK | `data/z_doorway_workspace_registry.json` | PC paths | **Yes** for doorway opens | 2026-05-11 | Stale vs disk |
| **Monster project registry** | Catalog IDs for monster map | AMK · Builder doctrine | `data/z_sanctuary_monster_project_registry.json` | Master map docs | **Yes** for monster *ids* | 2026-05-03 (mtime) | ≠ PC-root ids |
| **Z-ZES organism citizenship** | Shared-organism identity · deps · steward | AMK · Zuno · Z-EAII | `data/z_zes_organism_citizenship.json` | Constitution · Atlas · Phase 0 charter | **Yes** for Z-ZES registry identity | 2026-08-04 / Phase 0.5 | Foresight only · no runtime |
| **Autonomy task policy** | What automation levels allow | AMK | `data/z_autonomy_task_policy.json` | Constitution · Turtle | **Yes** for autonomy ladder | 2026-08-01 (mtime) | — |
| **Deployment readiness projects** | Scoring inputs for readiness rollup | Overseer scripts | `data/z_deployment_readiness_project_registry.json` | Policy JSON · PC-root | **No** for citizenship — scoring aid | 2026-05-12 (mtime) | Readiness ≠ deploy |
| **Operational reports** | Moment-in-time signals | Scripts · observe lanes | `data/reports/z_*.{json,md}` | Registries above | **Yes** for *that* refresh only | Per `generated_at` | **Always check age** |

---

## Quick “where do I go?”

| I need… | Go here first |
| --- | --- |
| Is this a PC project / path? | `data/z_pc_root_projects.json` |
| Human story of a module? | `docs/Z-MASTER-MODULES-REGISTER.md` |
| Machine module id? | `data/z_module_manifest.json` |
| Z-ZES organism citizenship? | `data/z_zes_organism_citizenship.json` |
| Family AI identity? | `data/z_family_ai_registry.json` |
| Which dashboard tile? | `data/z_mdg_dashboard_registry.json` |
| Backup proof? | Certificates + `data/reports/z_backup_readiness_inventory.json` |
| Is the ecosystem “GREEN/BLUE” today? | Morning Cockpit (with **age**) ← report JSON |
| What is sealed? | `data/z_ecosystem_growth_stage_registry.json` |
| May we sync a satellite? | `data/z_satellite_control_link_manifest.json` |

---

## Conflict rule

1. **Citizenship / path** → PC-root wins for Organiser disk.
2. **Module identity** → Manifest wins over synced/derived JSON.
3. **Human meaning** → Master Modules Register + Constitution.
4. **Operational signal** → Newest report with **visible age**; stale ≠ false, but **untrustworthy for action**.
5. If still unclear → **Needs Human Verification**.

---

## Related principles

- Evidence: every recommendation traceable to evidence (Constitution Art. XII)
- Time: every operational signal traceable in time (Freshness Principle)
- Center: [Z_SANCTUARY_STEWARDSHIP_IS_THE_CENTER.md](Z_SANCTUARY_STEWARDSHIP_IS_THE_CENTER.md)

Next Turtle Step: **done** — see [Quality Gate Takeoff Checklist](Z_SANCTUARY_QUALITY_GATE_TAKEOFF_CHECKLIST.md). Book III stays closed until AMK opens it.

---

*Registry Atlas · Turtle Step 2 · one page · future-proof*
