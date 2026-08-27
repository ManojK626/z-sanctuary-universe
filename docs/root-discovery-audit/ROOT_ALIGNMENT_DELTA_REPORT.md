# Root Alignment Delta Report

**Pass:** ROOT_ALIGNMENT_PASS  
**Branch:** `cursor/zsanctuary/root-alignment-pass`  
**Date:** 2026-06-11 (historical alignment pass)  
**Prior audit:** `cursor/zsanctuary/root-discovery-audit` (read-only)

**Reading rule:** The tables and AMK items below record **2026-06-11** observations. They are not current registry truth. See **Current superseding state — 2026-07-10** after the June sections.

## What changed

| Item | Before | After |
| --- | --- | --- |
| `data/z_pc_root_projects.json` → `hub` | `ZSanctuary_Universe` | **`Z_Sanctuary_Universe`** |
| Hub project `path` | `ZSanctuary_Universe` | **`Z_Sanctuary_Universe`** |
| Hub project `name` | `ZSanctuary_Universe` | **`Z_Sanctuary_Universe`** |
| Continuation lane path | `ZSanctuary_Universe/Z_Sanctuary_Universe 2` | **`Z_Sanctuary_Universe/Z_Sanctuary_Universe 2`** |
| Retired stub | Undocumented | **`retired_stub` row** for `ZSanctuary_Universe` |
| ÉirMind Ireland path | Missing; vague reference | **`eirmind-ireland-projects-missing` row** + alignment doc |
| `z_ecosystem_awareness_registry.json` | Folder not stated | **`canonical_hub_folder`** + hub path note |
| ÉirMind ecosystem hold | Reference-only | **Hold pending AMK** + rehome recommendation |
| Discovery reports | Pre-alignment drift warnings | **Refreshed** — aligned posture |

## What stayed uncertain (2026-06-11)

| Item | Status |
| --- | --- |
| `Ireland Projects` folder on disk | **Still missing** |
| AMK final ÉirMind decision | **Hold** (EMK-HOLD default) |
| `Amk-Goku Dashboards 2` / `AT PB Copilot` paths | Still missing |
| Unregistered PC folders (G, Gem, WorkSphere, etc.) | Not added to registry (June-11) |
| Live service verification | Not performed (no services started) |
| Generated reports in `data/reports/` | May still show old paths until refresh scripts run |

## What still requires AMK decision (2026-06-11)

1. **ÉirMind:** EMK-RESTORE vs EMK-REHOME vs EMK-ARCHIVE vs EMK-HOLD  
2. **Retired stub folder:** Keep on disk (June-11 current) vs archive later — **do not delete without AMK**  
3. **Duplicate AT Princess registry ids** — consolidate when convenient  
4. **PR merges:** strategist #20, discovery, alignment — all **Merge HOLD**

## Deployable candidate ranking

**Unchanged** after alignment (registry fix does not change product readiness):

| Rank | Candidate |
| --- | --- |
| 1 | Z-QUESTRA/Z-SME |
| 2 | ZILWA static subset (post-listening) |
| 3 | Z-PEE ethics pilot |
| 4 | Hub read-only slice |
| 5 | Roulette edu-framed (governance) |

## Autonomy status

**Unchanged.** No autonomous services enabled. Zuno remains report/scripts layer (L1), not a daemon. Nyssa/Zera still unknown in hub grep.

## Files touched (this pass)

- `data/z_pc_root_projects.json`  
- `data/z_ecosystem_awareness_registry.json`  
- `docs/root-discovery-audit/*` (refreshed + delta + ÉirMind decision)  

## Safety boundaries confirmed

- No runtime added  
- No deployment  
- No packages installed  
- No autonomous AI enabled  
- No payment/VAT/company logic  
- Human gate preserved  
- **No folders deleted**

## Current superseding state — 2026-07-10

Carried in Slice 1 `data/z_pc_root_projects.json`. Does **not** rewrite the June-11 tables above.

- Retired `ZSanctuary_Universe` folder is **absent on disk**. Identity is kept as `retired_projects[]` archive/reference only.
- Citizen rows now registered include G, Gem, WorkSphere, Labs, External PaaS, Pets (stub visibility), and related path updates (for example browser `path_missing`).
- Universe 2 is recorded as `intentional_split_not_merge` (PC-root continuation + nested hub backup slice). SSWS stays on the hub.
- ÉirMind remains **EMK-HOLD**. The June decision table is not lifted.
- Companion June docs in this pack (for example `ROOT_PROJECT_REGISTRY.md` “retained on disk”) remain June snapshots unless a later slice updates them.

## Verdict

GREEN FOR PR REVIEW — MERGE HOLD until AMK reads this delta. June-11 text is historical; current identity is the 2026-07-10 superseding state plus later Slice 1 registry files.
