# Z-Heartbeat Shadow Core (Z-HSC)

**Public description:** A resilience and recovery **observer** that helps Z-Sanctuary stacks reason about **pause → preserve → verify → resume** — without pretending to control power, networks, or deployments.

**Short name:** Z-HSC (Z-Heartbeat Shadow Core).

## Role

When electricity, internet, weather, devices, storage, or external routes fail, the hub should **not** panic in silence. Z-HSC Phase 1 **reads existing reports** and emits:

- a **heartbeat posture** (how “fresh” and complete the proof chain is),
- **freshness** summaries,
- flags for **missing proof** or **stale** observers,
- a **safe-mode recommendation** and **recovery checklist**,

all **advisory-only** — no shutdown, deploy, file moves, Cloudflare/Replit actions, or release-gate changes.

## Phase 1 boundaries

| Allowed | Not allowed (Phase 1) |
| ---------------------------------------------------- | --------------------------------- |
| Read JSON/MD under `data/reports/` | Execute shutdown, restart, deploy |
| Write `z_heartbeat_shadow_status.json` / `.md` | Delete, move, quarantine files |
| Append one line to `z_heartbeat_shadow_events.jsonl` | Change release gates or enforcer |
| Recommend operator steps | Auto-fix or auto-resume |

**Authority:** `advisory_only_no_auto_execution` (same family as Z-VHealth / awareness trio).

## Outputs

| Path | Purpose |
| --------------------------------------------- | ------------------------------------------ |
| `data/reports/z_heartbeat_shadow_status.json` | Machine-readable posture + freshness |
| `data/reports/z_heartbeat_shadow_status.md` | Human-readable summary |
| `data/logs/z_heartbeat_shadow_events.jsonl` | Append-only event log (one object per run) |

## npm

```bash
npm run heartbeat:shadow
```

## Inputs (when present)

Reports such as: Zuno state, VHealth, FPSMC, VDK, communication health, release gate summary; optional technical-green receipt MD; latest Zuno archive filename detection.

## Posture bands

| Posture | Meaning (Phase 1) |
| ------------------- | -------------------------------------------------------------------------------------------------------- |
| `stable` | Core reports present and within freshness window |
| `watch` | Minor drift — refresh observers soon |
| `degraded` | Storage warnings, comm stress, or multiple stale proofs |
| `recovery_required` | Critical report missing or observability gap |
| `hold` | Do **not** treat deploy as safe until human review (advisory; pairs with release/verify truth elsewhere) |

## Golden rule

> When the world cuts power, the Sanctuary protects **memory first** — reports, archives, receipts — then humans decide **GO/HOLD**.

Later phases may integrate dashboards, QOSMEI, or weather/event hooks; Phase 1 is **observe and narrate only**.

---

_Z-HSC — calm survival signal, not a self-repairing monster._
