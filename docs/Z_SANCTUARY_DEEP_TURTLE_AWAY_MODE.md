# Z-Sanctuary Deep Turtle Away Mode (Z-AWAY-1)

**Phase:** Z-AWAY-1 — operator doctrine only (AMK absent 1–2 weeks)
**Receipt:** [PHASE_Z_AWAY_1_GREEN_RECEIPT.md](PHASE_Z_AWAY_1_GREEN_RECEIPT.md)
**Authority:** AMK-Goku / human — sacred moves unchanged

## Core law

```text
Observe lightly · Report clearly · Do nothing dangerous
```

Away mode is **not** more automation. It is **stability, quietness, predictable snapshots, and rest** for the workstation and the hub.

## What away mode is

| Yes | No |
| --- | --- |
| Manual report refresh before leaving | New watchers or schedulers |
| Read-only dashboards (GET JSON) | Background agents |
| Executive summaries (short) | Report storms |
| One pre-departure ritual | Queue execution |
| Calm while operator is away | Probes, deploy, Cloudflare bind |

## Reporting chain (low noise)

```text
local reports (data/reports/*.json — manual npm refresh)
        ↓
aggregators (z:traffic, optional z:cycle:observe rollup)
        ↓
SKK/RKPK sky (symbolic calm / integrity — major warnings only)
        ↓
AMK Main Control (single operator overview — GET only)
        ↓
Zuno executive summary (posture + stale + human decisions)
        ↓
Z-DAIO (read-only operational posture — no escalation)
```

**Do not** let every module push its own full dashboard. MiniBots and lanes **summarize** into top indicators only.

| Layer | Away role |
| ----- | --------- |
| MiniBots / lane reports | Snapshot posture |
| Z-Traffic | Global health rollup |
| ZCO (when merged) | Node posture from declared local manifest |
| SKK/RKPK | Sanctuary sky — not terminal spam |
| AMK Main Control | One overview |
| Zuno | Five-line executive awareness |
| Z-DAIO | All calm; CLOSED; no probe; no deploy |

## Away indicators (GREEN-focused)

Enough for 1–2 weeks away:

| Indicator | How |
| --------- | --- |
| MD hygiene | `npm run verify:md` |
| Global traffic | `npm run z:traffic` |
| Dashboard registry | `npm run dashboard:registry-verify` |
| ZCO posture | `z:compute:organism`, `intake`, `upgrade-draft` when ZCO spine on branch |
| Runtime posture | CLOSED in ZCO / organism reports |
| Telemetry posture | DISABLED |
| NAS | NAS_WAIT until human verifies mount |
| Git branch | Clean or one named WIP branch |
| Probes | NONE (ZCO-8 charter; no ZCO-9 runtime) |

Not required while away: giant logs, deep metrics spam, always-on loops, noisy AI chatter.

## Z-Zuno executive summary template

When the operator returns, **one screen** — nothing more unless asked:

```text
Overall: GREEN / YELLOW / BLUE / RED (one line)
Top 3 stale receipts or verify gaps
Top 3 human decisions waiting (merge, NAS mount, charter)
ZCO: Node Alpha posture + NAS_WAIT if any
Runtime: CLOSED · Telemetry: OFF · Probes: NONE
```

## Hard forbidden (away cycle)

| Forbidden | Reason |
| --------- | ------ |
| Auto-running Cycle Observe **task_queue** | Queue is **suggestions only** — AMK picks branches |
| ZCO-9+ probes / WMI / network scan | ZCO-8 doctrine; charter + AMK required |
| Docker/K8s sprawl, background AI farms | Workstation stays quiet |
| Uncontrolled local model runtimes | Human-owned capacity |
| Merge/deploy without AMK review | Sanctuary gate |
| Cloudflare production bind | Separate sacred lane |
| New watchers or cron from this doc | Z-AWAY-1 is metadata only |

## Pre-departure ritual (run once)

From hub root:

```powershell
npm run verify:md
npm run z:traffic
npm run dashboard:registry-verify
```

When **ZCO spine** is on `main` (or your working branch):

```powershell
$env:ZCO_INVENTORY_PATH = "data/local/zco_node_alpha.local.json"
npm run z:compute:organism
npm run z:compute:intake
npm run z:compute:upgrade-draft
```

Optional read-only snapshots (only if you choose — each writes reports only):

```powershell
npm run z:pc:activation
npm run z:cycle:observe
npm run z:deployment:readiness
```

Then:

1. Open AMK Main Control + cycle/ZCO panels over **http** → **Refresh** once (GET only).
2. Screenshot or note top signals.
3. `git status` — commit intentional work only; clean or label WIP branch.
4. Stop dev servers, experimental Docker, duplicate watchers.
5. **Rest.**

## Return ritual (after 1–2 weeks)

1. Re-run the pre-departure npm bundle (refresh reports).
2. Read Cycle Observe `task_queue` as **suggestions** — choose **one** `cursor/zsanctuary/…` branch if any.
3. Merge pending PRs with human review only.
4. **Do not** open ZCO-9 probe runtime without Z-ATE + AMK charter.
5. Add `data/local/zco_nas_wait.local.json` only when ready to **declare** NAS — not probe.

## Psychological law

```text
constant activity ≠ progress
calm + coherent while away = infrastructure health
```

## Related

| Doc | Role |
| --- | ---- |
| [Z_CYCLE_OBSERVE_SYSTEM.md](Z_CYCLE_OBSERVE_SYSTEM.md) | Observer + queue — no execution |
| ZCO-8 probe charter (when ZCO spine merged) | No probe until chartered |
| [AMK_GOKU_MAIN_CONTROL_DASHBOARD.md](AMK_GOKU_MAIN_CONTROL_DASHBOARD.md) | Operator overview |
| [zuno-4root/ZUNO_4ROOT_COMMUNICATION_SPINE.md](zuno-4root/ZUNO_4ROOT_COMMUNICATION_SPINE.md) | SKK/RKPK framing |

## Locked law

```text
Z-AWAY-1 = doctrine only.
Away mode ≠ permission to automate.
AMK-Goku owns sacred moves.
```
