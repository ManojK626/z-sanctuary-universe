# Z-Sanctuary Monster Project — Master Map

**Purpose:** One **human-readable** map of the Monster Project: trees, cores, engines, ethics rings, and named implementation surfaces. It pairs with **`data/z_sanctuary_monster_project_registry.json`** (machine roster) and the **Cursor Build Master Doctrine** (`.cursor/rules/z-cursor-build-master-doctrine.mdc`).

**Rule:** Catalog and registry **before** new runtime wiring. Symbolic or high-risk domains ship as **metadata, UI, docs, registry, or simulation** first unless explicitly chartered.

## Four truth sources (read before building)

1. **Technology truth:** [z_zuno_technology_snapshot.md](z_zuno_technology_snapshot.md), `data/zuno_state_snapshot.json`, [AI_BUILDER_CONTEXT.md](AI_BUILDER_CONTEXT.md) — what is real, green, planned, blocked, or metadata-only.
2. **Monster Project truth:** this document + `data/z_sanctuary_monster_project_registry.json`.
3. **Cursor rules:** `.cursor/rules/` (especially Build Master Doctrine) + [AGENTS.md](../AGENTS.md).
4. **Build order:** catalog → registry → read-only dashboards → local UI prototypes → verification scripts → green receipts → **then** controlled runtime (see JSON `build_order` and doctrine rule).

## Build order (A–G)

| Step | Name | Intent |
| ---- | --------------------------- | -------------------------------------------- |
| A | Catalog everything | Names, layers, evidence posture before code. |
| B | Registry entries | Stable IDs in manifests; no silent orphans. |
| C | Read-only dashboards | Metadata and navigation only. |
| D | Local UI prototypes | Sandboxed UI without production coupling. |
| E | Verification scripts | Read-only checks and JSON receipts. |
| F | Green receipts | Pass artifacts before widening scope. |
| G | Controlled runtime features | Only after charter, gates, and receipts. |

## Master roster (required names)

Canonical **`id`** values match **`_meta.required_entry_ids`** in `data/z_sanctuary_monster_project_registry.json`.

| Label | Stable `id` | Family | Default representation |
| ---------------------------- | ---------------------------- | ----------------------- | ---------------------- |
| Z-Tree Motherboard | `z_tree_motherboard` | tree_spine | mixed |
| Tree Pyramid | `tree_pyramid` | tree_spine | metadata |
| Tree of Life | `tree_of_life` | tree_spine | metadata |
| Chakra Tree | `chakra_tree` | tree_spine | metadata |
| Virtual Motherboard | `virtual_motherboard` | tree_spine | simulation |
| 1 Penny Engine | `one_penny_engine` | economics | metadata |
| Give & Receive | `give_and_receive` | economics | metadata |
| Money Pathway Cores | `money_pathway_cores` | economics | metadata |
| ZES / ZECC | `zes_zecc` | ecosystem_core | mixed |
| Ghost Core | `ghost_core` | ecosystem_core | metadata |
| Alien Core | `alien_core` | ecosystem_core | metadata |
| Bee Vision | `bee_vision` | perception | ui |
| Hashirai Mentors | `hashirai_mentors` | lineage | docs |
| Heart & Genes | `heart_and_genes` | lineage | metadata |
| TMK-Goku Codex | `tmk_goku_codex` | lineage | docs |
| Movie / Eternal Storytelling | `movie_eternal_storytelling` | narrative | docs |
| Z-Passport | `z_passport` | identity | registry |
| Panic Mode | `panic_mode` | safety_lifecycle | ui |
| Recovery Angels | `recovery_angels` | safety_lifecycle | metadata |
| Aftercare | `aftercare` | safety_lifecycle | metadata |
| Z-World | `z_world` | world_layer | mixed |
| GGAESP-360 | `ggaesp_360` | ethics_stack | docs |
| Z-PEE Planetary Ethics | `z_pee_planetary_ethics` | ethics_stack | docs |
| Z-QUESTRA | `z_questra` | implementation_projects | code |
| Z-SME | `z_sme` | implementation_projects | mixed |
| Magical Canvas PlayKit | `magical_canvas_playkit` | implementation_projects | ui |

## Rings, formulas, and oversight (pointers)

| Topic | Where to read |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Ω / DRP / formula discipline | [Z-ULTRA-INSTINCTS-AND-FORMULAS.md](Z-ULTRA-INSTINCTS-AND-FORMULAS.md) |
| Hierarchy and operational roof | [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md) |
| Module and engine indexes | [Z_SANCTUARY_MODULE_INDEX.md](Z_SANCTUARY_MODULE_INDEX.md), [Z_SANCTUARY_ENGINE_INDEX.md](Z_SANCTUARY_ENGINE_INDEX.md) |
| Hub module ID truth list | `data/z_master_module_registry.json` |
| Builder hard boundaries | [Z_SANCTUARY_BUILD_RULES.md](Z_SANCTUARY_BUILD_RULES.md) |
| New module posture | [Z-NEW-MODULE-DISCIPLINE.md](Z-NEW-MODULE-DISCIPLINE.md) |

JSON **`rings_and_spines`** holds a small machine-readable subset (quadruple spine, Ω anchor, operational roof) for validators and dashboards.

## Safety and sensitivity

Domains that touch **safety, money, identity, children, recovery, health, or emergency** flows stay **gated and receipt-backed**. Do not add **runtime bridges, payments, external APIs, biometric capture, background autonomy, or deployment** code unless explicitly chartered and aligned with overseer policy.

## Verification (green receipt)

From hub root:

```bash
npm run z:monster:registry-verify
```

Truth refresh and drift (technology + Monster layers):

```bash
npm run zuno:snapshot && npm run zuno:snapshot:truth-align && npm run z:traffic
```

Receipts: `data/reports/z_monster_project_registry_verify.json`, `data/reports/zuno_truth_layer_alignment.json` / `.md`.

## Rollback

Revert edits to this file, `data/z_sanctuary_monster_project_registry.json`, and the doctrine rule if a catalog change was mistaken; re-run verify.
