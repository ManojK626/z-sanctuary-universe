# Root Alignment Delta Report

**Pass:** ROOT_ALIGNMENT_PASS  
**Branch:** `cursor/zsanctuary/root-alignment-pass`  
**Date:** 2026-06-11  
**Prior audit:** `cursor/zsanctuary/root-discovery-audit` (read-only)

## What changed

| Item | Before | After |
| ---- | ------ | ----- |
| `data/z_pc_root_projects.json` → `hub` | `ZSanctuary_Universe` | **`Z_Sanctuary_Universe`** |
| Hub project `path` | `ZSanctuary_Universe` | **`Z_Sanctuary_Universe`** |
| Hub project `name` | `ZSanctuary_Universe` | **`Z_Sanctuary_Universe`** |
| Continuation lane path | `ZSanctuary_Universe/Z_Sanctuary_Universe 2` | **`Z_Sanctuary_Universe/Z_Sanctuary_Universe 2`** |
| Retired stub | Undocumented | **`retired_stub` row** for `ZSanctuary_Universe` |
| ÉirMind Ireland path | Missing; vague reference | **`eirmind-ireland-projects-missing` row** + alignment doc |
| `z_ecosystem_awareness_registry.json` | Folder not stated | **`canonical_hub_folder`** + hub path note |
| ÉirMind ecosystem hold | Reference-only | **Hold pending AMK** + rehome recommendation |
| Discovery reports | Pre-alignment drift warnings | **Refreshed** — aligned posture |

## What stayed uncertain

| Item | Status |
| ---- | ------ |
| `Ireland Projects` folder on disk | **Still missing** |
| AMK final ÉirMind decision | **Hold** (EMK-HOLD default) |
| `Amk-Goku Dashboards 2` / `AT PB Copilot` paths | Still missing |
| Unregistered PC folders (G, Gem, WorkSphere, etc.) | Not added to registry |
| Live service verification | Not performed (no services started) |
| Generated reports in `data/reports/` | May still show old paths until refresh scripts run |

## What still requires AMK decision

1. **ÉirMind:** EMK-RESTORE vs EMK-REHOME vs EMK-ARCHIVE vs EMK-HOLD  
2. **Retired stub folder:** Keep on disk (current) vs archive later — **do not delete without AMK**  
3. **Duplicate AT Princess registry ids** — consolidate when convenient  
4. **PR merges:** strategist #20, discovery, alignment — all **Merge HOLD**

## Deployable candidate ranking

**Unchanged** after alignment (registry fix does not change product readiness):

| Rank | Candidate |
| ---- | --------- |
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

## Verdict

GREEN FOR PR REVIEW — MERGE HOLD until AMK reads this delta
