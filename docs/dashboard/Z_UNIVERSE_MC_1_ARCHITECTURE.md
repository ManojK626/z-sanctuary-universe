# Z-Universe Mission Control MC-1 — Read-only Dashboard Overlay

**Phase:** MC-1
**Status:** Active (read-only visualization)
**Authority:** AMK-approved 2026-07-04 after MC-0.5 green receipt

## Purpose

MC-1 adds a **read-only situational awareness layer** to the AMK-Goku Main Control Dashboard. It visualizes data produced by MC-0 / MC-0.5 without introducing runtime coupling, execution buttons, or cross-repo mutation.

**Mission Control doctrine:** *Mission Control exists to make the Universe understandable, never to make decisions in place of its stewards.*

## Pipeline (unchanged)

```text
Dashboard (observe) → Universe Status Engine → Readiness → DRP → Human Approval → Approved Action
```

MC-1 occupies **only** the first hop: **observe and visualize**.

## Surfaces

| Panel                    | Data source                                | Execution              |
| ------------------------ | ------------------------------------------ | ---------------------- |
| Universe Registry        | `data/z_universe_project_registry.json`    | None — table + filters |
| Hub charter registry     | `charter_projects` in same JSON            | Doc links only         |
| Department Map           | `data/z_universe_department_registry.json` | Doc links only         |
| Dependency graph         | `dependency_map` hints                     | Display only           |
| Health matrix            | Project `status_dimensions`                | Display only           |
| Critical path (Track A)  | Department registry + hub resolution doc   | Doc links only         |
| AI consensus             | Placeholder                                | MC-2 future            |
| Recommended next actions | Registry + charter rows                    | Review text only       |

## Files

| Asset         | Path                                                                     |
| ------------- | ------------------------------------------------------------------------ |
| HTML section  | `dashboard/Html/amk-goku-main-control.html` (`#amk-universe-mc-section`) |
| Script        | `dashboard/scripts/amk-universe-mission-control-readonly.js`             |
| Styles        | `dashboard/styles/amk-universe-mission-control.css`                      |
| Registry      | `data/z_universe_project_registry.json`                                  |
| Immutable IDs | `data/z_universe_id_map.json`                                            |
| Departments   | `data/z_universe_department_registry.json`                               |

## MC-0.5b refinements (identity layer)

Before MC-1 render, discovery assigns:

1. **Immutable Universe IDs** (`ZSU-NNNN`) via `data/z_universe_id_map.json` — never reassigned on rename.
2. **Timeline** per project: `first_discovered`, `last_reviewed`, `last_activity`, `lifecycle_stage`.
3. **Confidence** per attribute: `confirmed` / `inferred` / `unknown`.

Refresh registry:

```bash
npm run z:universe:discovery
# or
npm run z:universe:registry:refresh
```

## Operator usage

1. Run discovery refresh when PC root registry changes.
2. Serve hub dashboard over HTTP (same as other indicator overlays).
3. Open `dashboard/Html/amk-goku-main-control.html` → **Universe Mission Control (MC-1)** section.

## Hard boundaries

- No npm/task/deploy buttons in MC-1 UI
- No automatic merge, register, or integrate actions
- Z-Connect architecture remains **FROZEN** — MC-1 does not add contract layers
- Track A (VILE merge) remains highest engineering priority

## Next phases

| Phase   | Scope                                            |
| ------- | ------------------------------------------------ |
| MC-2    | AI review attachments (read-only summaries)      |
| MC-2.1  | Universe event timeline feed (executive chronology) |
| MC-3    | Gated workflow initiators (human gate preserved) |
| MC-4    | Universe analytics                               |

**Future tab vision (AMK):** four permanent views — Universe · Registry · Analytics · Timeline — with detail panels beneath each core view.

## Related docs

- [Z_UNIVERSE_MISSION_CONTROL_ARCHITECTURE.md](./Z_UNIVERSE_MISSION_CONTROL_ARCHITECTURE.md)
- [Z_UNIVERSE_DISCOVERY_ARCHITECTURE.md](./Z_UNIVERSE_DISCOVERY_ARCHITECTURE.md)
- [Z_UNIVERSE_PROJECT_REGISTRY.md](./Z_UNIVERSE_PROJECT_REGISTRY.md)
- [PHASE_Z_UNIVERSE_MC_1_GREEN_RECEIPT.md](./PHASE_Z_UNIVERSE_MC_1_GREEN_RECEIPT.md)
