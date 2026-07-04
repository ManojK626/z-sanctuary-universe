# Phase Z-Universe MC-1 Green Receipt

**Phase ID:** MC-1
**Title:** Read-only Dashboard Overlay
**Date:** 2026-07-04
**AMK gate:** Approved (MC-0.5 acceptance + MC-1 charter)

## Intent

Visualize universe registry, departments, dependencies, health, and Track A critical path on the AMK Main Control Dashboard — **without execution authority**.

## Deliverables

| Item                                                         | Status |
| ------------------------------------------------------------ | ------ |
| `dashboard/scripts/amk-universe-mission-control-readonly.js` | ✅     |
| `dashboard/styles/amk-universe-mission-control.css`          | ✅     |
| AMK Main Control HTML section `#amk-universe-mc-section`     | ✅     |
| MC-0.5b: `data/z_universe_id_map.json`                       | ✅     |
| MC-0.5b: timeline + confidence in discovery registry v1_1    | ✅     |
| `docs/dashboard/Z_UNIVERSE_MC_1_ARCHITECTURE.md`             | ✅     |

## MC-0.5b refinements included

1. **Universe Identity** — immutable `ZSU-NNNN` IDs in `z_universe_id_map.json`
2. **Project timeline** — first discovered, last reviewed, last activity, lifecycle stage
3. **Confidence indicators** — confirmed / inferred / unknown per attribute

## Validation

- [ ] `npm run z:universe:discovery` completes without modifying sibling projects
- [ ] Registry schema `z_universe_project_registry_v1_1` written
- [ ] Dashboard section loads registry + department JSON over HTTP
- [ ] No execute/deploy/merge buttons in MC-1 panel
- [ ] Merge Hold and Turtle Mode preserved on all rows

## Posture

```text
merge_hold: true
runtime_authorized: false
turtle_mode: true
track_a_priority: VILE merge unchanged
z_connect: Phase 1.5 FROZEN
```

## Rollback

1. Remove MC-1 script/CSS/link from `amk-goku-main-control.html`
2. Revert discovery script to v1 schema if needed (id map file can remain — read-only)
3. Delete `amk-universe-mission-control-readonly.js` and CSS

## Next

- **MC-2:** AI review attachments (read-only)
- **Track A:** VILE Pkgs 1–3 merge → zuno-drp → verify main
