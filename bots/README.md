# Bot chain (Z-Sanctuary hub)

Node **bots** under this folder are the **operational awareness loop**: registry/disk signal → triage → decisions → patterns and advisory layers. They read and write **reports and logs** under `data/`; they do not replace [Hierarchy Chief](../docs/Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md) authority, release gates, or human execution approval.

**Run from repo root** (`ZSanctuary_Universe`) so paths resolve correctly.

**PC root disk memory (catalog + diff):** `npm run pc-root:catalog` writes `data/reports/z_pc_root_dirent_catalog.json` (read-only listing from `pc_root` in `data/z_pc_root_projects.json`). `npm run pc-root:catalog:baseline` saves that snapshot as baseline; `npm run pc-root:catalog:diff` regenerates the catalog and writes `data/reports/z_pc_root_dirent_catalog_diff.json` vs the baseline. Options: `--depth 2|3`, `--max-children N`, `--compare-baseline <path>`.

## Layout

| Directory | Role |
| --- | --- |
| `_lib/` | Shared helpers (paths, JSON/JSONL I/O, registry scan, decision history) |
| `guardian/` | Registry vs disk (Guardian) |
| `sync/` | Sync / snapshot style receipts |
| `health/` | Health pass |
| `alerts/` | Alert aggregation |
| `decision/` | Decisions and lifecycle actions |
| `pattern/` | Pattern rollups from history |
| `rootcause/`, `predict/`, `adaptive/` | Heuristic layers (advisory) |
| `strategy/` | Strategy synthesis (advisory) |
| `execution/` | Execution plan and executor (gated) |

## npm entrypoints

| Script | What it runs |
| --- | --- |
| `npm run bot:guardian` | Guardian |
| `npm run bot:sync` | Sync bot |
| `npm run bot:health` | Health bot |
| `npm run bot:alerts` | Alerts |
| `npm run bot:decision` | Decision bot |
| `npm run bot:decision:act` | Append decision lifecycle events (`data/logs/z_decision_history.jsonl`) |
| `npm run bot:pattern` | Pattern bot |
| `npm run bot:rootcause` | Root-cause heuristics |
| `npm run bot:predict` | Predict |
| `npm run bot:adaptive` | Adaptive ranking |
| `npm run bot:strategy` | Strategy |
| `npm run bot:execution:plan` | Execution plan (advisory) |
| `npm run bot:execution:run` | Execution runner (gated) |
| `npm run bot:awareness` | Chained: guardian → … → adaptive (no execution/strategy) |
| `npm run bot:awareness:plus` | `bot:awareness` + execution plan + strategy |

## Experience cycles (pattern intelligence)

Before expanding automation, NAS-wide sync “intelligence,” edge deploy agents, or multi-agent autonomous execution, use the **controlled experience loop** and **phase lock** in [Z-SCTE — Self Creations Test Ecosystem](../docs/Z-SCTE-SELF-CREATIONS-TEST-ECOSYSTEM.md) **Section 6** (*Experience cycles (pattern intelligence) — before expanding the stack*). That keeps patterns, prediction, and adaptive output grounded in **repeated** decision history, not one-off noise.

**Related:** decision UI [`dashboard/panels/z_decision_panel.html`](../dashboard/panels/z_decision_panel.html); state receipt `npm run zuno:state` (`scripts/z_zuno_state_report.mjs`).
