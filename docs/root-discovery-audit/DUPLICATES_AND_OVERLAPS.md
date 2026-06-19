# Duplicates and Overlaps — Discovery Audit

**Posture:** Read-only · 2026-06-11

## Critical naming duplicates

| Issue | Paths | Severity | Recommendation |
| ----- | ----- | -------- | -------------- |
| **Hub name collision** | `Z_Sanctuary_Universe` vs `ZSanctuary_Universe` | **High** | Registry + EAII should point to underscore hub; retire or remove empty stub |
| **AT Princess duplicate registry IDs** | `at-princess-blackie-copilot` + `at-princess-blackie-copitol` | Medium | Same path in `z_pc_root_projects.json` twice |
| **Aimanity spelling** | `z-Sanctuary-Aimanity` vs `z-sanctuary-aimanity` in audit | Low | Align registry spelling |
| **Pets typo folder** | `Z-Sancurary _Pets Care Compassion` | Low | Rename or archive when human-gated |

## Conceptual overlaps

| Concept A | Concept B | Overlap | Consolidation note |
| --------- | --------- | ------- | ------------------ |
| **ÉirMind** | **Z-Sister Aisling Sol** | Magical AI / lineage | ÉirMind missing; Aisling Sol on disk — clarify canonical |
| **Z-Sanctuary Gem / G** | **Z-OMNI-Sanctuary** | Multiple “sanctuary” apps | Map purpose per folder; avoid merge without charter |
| **ZILWA tourism** | **Z-Tourism strategist card** | Tourism doctrine | Z-Tourism has no standalone pack |
| **Z-PEE / Z-EarthConscience** | **ZILWA env exhibits** | Environmental ethics | Pilot vs cultural tourism — keep lanes separate |
| **Roulette Replit** | **Z-Sanctuary_Replit** | Same analyzer family | Local vs hosted copies |
| **Lottery (hub)** | **Roulette modules** | Gaming-adjacent | Shared HIGH GOVERNANCE; separate products |
| **Zuno** | **Zuno orchestrator** | Naming | Reports ≠ live orchestrator runtime |
| **Amk-Goku Dashboards 2** | **Hub dashboard** | Dashboard surfaces | Dashboards 2 path missing; hub is canonical HODP |
| **Z_Sanctuary_Universe 2** | **Hub** | Continuation | Doctrine: hub remains SSWS authority |

## Renamed / missing (registry vs disk)

| Registry name | Expected path | Disk 2026-06-11 |
| ------------- | ------------- | --------------- |
| Ireland Projects (ÉirMind) | `Ireland Projects` | **Missing** |
| Amk-Goku Dashboards 2 | `Amk-Goku Dashboards 2` | **Missing** from root scan |
| AT PB Copilot | `AT PB Copilot` | **Missing** (use Princess&Blackie folder) |
| Hub | `ZSanctuary_Universe` | **Stub only** — real hub is `Z_Sanctuary_Universe` |

## Possible consolidations (human-gated — not executed)

1. Merge ÉirMind reference into **Z-Sister Aisling Sol** manifest or restore Ireland folder.  
2. Single **Aimanity** canonical path under Skyscraper vs standalone folder.  
3. Update `z_pc_root_projects.json` hub path to `Z_Sanctuary_Universe`.  
4. Archive empty `ZSanctuary_Universe` stub after registry fix.

## Forgotten-but-valuable (overlap with “orphan”)

| Asset | Why valuable |
| ----- | ------------ |
| Z-WorkSphere Flutter hub | Marketplace shape exists |
| Z-Sanctuary External PaaS | Deploy experiments |
| Skyscraper scripts | Early runtime JSON patterns |
| Vaults folder | Policy storage potential |
| Lottery education UI | Trust / education mode assets |
