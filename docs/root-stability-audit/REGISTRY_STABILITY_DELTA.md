# Registry Stability Delta

**Pass:** ROOT_SYSTEM_STABILITY_PASS  
**Branch:** `cursor/zsanctuary/root-system-stability-pass`  
**Date:** 2026-07-01  
**Prior:** ROOT_ALIGNMENT_PASS (`54d48cf`)

## Registry file

`data/z_pc_root_projects.json` — `updated_at` → **2026-07-01**

---

## Added rows

| id | path | role | reason |
| -- | ---- | ---- | ------ |
| `z-sanctuary-universe-2-pc-root` | `Z_Sanctuary_Universe 2` | member | PC-root continuation (~3176 files) distinct from nested copy |
| `z-labs` | `Z_Labs` | member | On disk; satellite manifest GREEN |
| `z-sanctuary-g` | `Z-Sanctuary G` | member | Was unregistered |
| `z-sanctuary-gem` | `Z-Sanctuary Gem` | member | Was unregistered |
| `z-worksphere-marketplace-hub` | `Z-WorkSphere_Marketplace_Hub` | member | Was unregistered |
| `z-sanctuary-external-paas` | `Z-sanctuary External PaaS` | member | Was unregistered |
| `z-pets-care-compassion` | `Z-Sancurary _Pets Care Compassion` | member (stub) | Visibility only |

---

## Updated rows

| id | change |
| -- | ------ |
| `z-sanctuary-universe-2-continuation` | Notes: dual-path warning |
| `z-sanctuary-browser-z-saiyan-lumina` | `path` → empty; `role` → external; `migration_status` → `path_missing` |
| `z-sanctuary-aimanity` | `path` → `z-Sanctuary-Aimanity` (disk casing) |

---

## Unchanged (still require AMK)

| Item | status |
| ---- | ------ |
| Hub path `Z_Sanctuary_Universe` | Aligned |
| Retired stub `ZSanctuary_Universe` | Retained on disk |
| ÉirMind `eirmind-ireland-projects-missing` | EMK-HOLD |
| Duplicate AT Princess ids | Consolidate later |
| Amk-Goku Dashboards 2 | Still missing |

---

## Deploy / autonomy impact

| Question | Answer |
| -------- | ------ |
| Deploy ranking changed? | **No** |
| Autonomy enabled? | **No** |
| Deployment overseer signal | Still **RED** (expected for learning phase) |

---

## After merge (operator)

1. `npm run zuno:snapshot`  
2. `npm run z:deployment:readiness`  
3. `node scripts/z_cross_project_health_probe.mjs`  
4. Review dashboard All Projects panel for new rows  

---

## Safety

- No folders deleted  
- No packages installed  
- No services started  
- No deploy  
