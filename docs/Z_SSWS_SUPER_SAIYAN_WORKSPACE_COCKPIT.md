# Z-SSWS-COCKPIT-1 — Super Saiyan Workspace Cockpit Orchestrator

## Purpose

**Z-SSWS-COCKPIT-1** is a **read-only cockpit layer**: one JSON registry plus one validator/report that expresses **which disk roots belong to AMK posture**, whether they should appear in **main cockpit vs deep-work** mode, **which IDE role fits best**, and a **dry-run opening plan text** — **without** auto-launch, NAS mounts, Cloudflare routes, secrets, bridges, billing, deploy, child-data flows, or background sync.

Phase 1 obeys the same Turtle Mode discipline as doorway and IDE fusion reports: **evidence first, humans open IDE windows.**

## Why not “one IDE per project”?

Opening every sibling repo in parallel creates:

- watcher and AI context load
- `same_project_parallel` YELLOW noise from fusion
- risk of terminals running from **wrong cwd**
- duplicate edits and harder rollback

**Stronger posture:** **know everything in the cockpit; open only what you are actively building.**

VS Code workspaces (single folder or multi-root) describe what is **visible** together — not what is **approved to execute** everywhere at once ([VS Code workspaces](https://code.visualstudio.com/docs/editing/workspaces/workspaces)). **Workspace Trust** remains the correct mental model before extensions or tasks run unattended ([Workspace Trust](https://code.visualstudio.com/docs/editing/workspaces/workspace-trust)).

## Recommended daily model

| Window | Role |
| ----------------------- | ----------------------------------------------------------------- |
| **Main cockpit** | Hub dashboard, gates, receipts, indicators |
| **Deep work** | One focused repo or workspace file |
| **Emergency / compare** | Only when isolation or conflict review truly needs another window |

## Artifacts

| Path | Role |
| ---------------------------------------------- | ------------------------------------------------ |
| `data/z_ssws_cockpit_registry.json` | Canonical cockpit registry (roots + modes + law) |
| `scripts/z_ssws_cockpit_status.mjs` | Validator → JSON + Markdown reports |
| `data/reports/z_ssws_cockpit_report.{json,md}` | Evidence for AMK and dashboard overlay |

## Command

```bash
npm run z:ssws:cockpit
```

Supporting evidence (operators run deliberately):

```bash
npm run z:pc:ide-path
npm run z:ide:fusion
```

## Signals

| Signal | Meaning (Phase COCKPIT-1) |
| ---------- | --------------------------------------------------------------------------------- |
| **GREEN** | Cockpit + required roots honored; Phase 1 law holds |
| **YELLOW** | Optional roots absent, labs recommended path missing, or IDE PATH evidence thin |
| **BLUE** | AMK-gated project modes (commercial / SUSBV lane posture) declared in registry |
| **RED** | Auto-launch, non–dry-run policy, unlawful live NAS/Cloud/sync, or fatal root loss |

Exit **0** for GREEN/YELLOW/BLUE; exit **1** only for RED.

## Fusion coupling

Fusion **YELLOW** because **both** Cursor and VS Code declare active hub sessions often means **honest coordinated watch**, not catastrophe. Elevate cautiously using **fusion + triplecheck**, not vibes.

## Locked law

```text
Cockpit ≠ auto-launch.
Workspace visibility ≠ execution.
NAS declared ≠ NAS mounted.
Cloudflare declared ≠ deployment.
Two IDEs active ≠ uncontrolled swarm.
GREEN ≠ deploy.
AMK-Goku owns sacred moves.
```

## Related

- [AMK_WORKSPACE_DOORWAY.md](AMK_WORKSPACE_DOORWAY.md) — Z-SSWS-DOOR-1 localized open commands registry.
- [Z_SSWS_WORKSPACE_SPINE.md](Z_SSWS_WORKSPACE_SPINE.md) — Z-SSWS-LINK-1 launch metadata spine.
- [AMK_CURSOR_WORKSPACE_STRATEGY.md](AMK_CURSOR_WORKSPACE_STRATEGY.md) — LAB-1 workspace files.
- [AMK_IDE_PATH_AND_FUSION_OPERATOR_RHYTHM.md](AMK_IDE_PATH_AND_FUSION_OPERATOR_RHYTHM.md) — PATH proof + fusion cadence.
- [Z_REPLICA_FABRIC_GOVERNED_SELF_REPLICATION.md](Z_REPLICA_FABRIC_GOVERNED_SELF_REPLICATION.md) — Z-REPLICA-FABRIC-1 governed replica doctrine (metadata + reports; no autonomous workspace spawn).
