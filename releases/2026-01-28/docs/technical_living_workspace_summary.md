<!-- Z: releases\2026-01-28\docs\technical_living_workspace_summary.md -->

# Living Workspace Technical Summary

## Purpose

This document explains the moving pieces behind the living workspace so engineers can trace the automation guardrails, observability wiring, and reflection hooks.

## Script Inventory (tags defined in `docs/living_workspace_manifest.json`)

- `core/harisha_tooltips.js`: builds Harisha-aware tooltips for buttons marked with `data-harisha-action`.
- `core/harisha_shortcuts.js`: monitors keyboard combos, updates tooltips, and logs shortcut usage with Harisha context.
- `core/harisha_integration.js`: renders the Harisha overlay badge, refreshes all tooltips, and binds shortcut scanning + tooltip refresh.
- `core/harisha_zone_panel.js`: displays Harisha score, zone state, and reflection summary; reacts to Chronicle, World Pulse, and zoning events.
- `core/super_ghost_reflection_ui.js`: embeds the weekly reflection card, pattern summary, and export/run buttons inside the Insight rail.
- `z_colour/z_colour_engine.js`: chooses palette profiles based on Harisha + World Pulse context, applies CSS variables, and logs `z_colour.shift`.
- `core/world_pulse_panel.js`: renders world pulse signals, Safe Pack chips, and Harisha overlays.

## Automation Package Script

- `scripts/package_living_workspace.js`: copies the living workspace brief + manifest into `packages/living-workspace-package` and adds a README describing how to refresh it. Run `npm run package:living-workspace` to regenerate the bundle.
- `scripts/create_release_snapshot.js`: copies the docs, manifest, package, and bot summaries into `releases/<date>/` for release snapshots, plus includes a README describing the release contents.

## Bundled Assets

- `docs/Living-Workspace-Brief.md`: living narrative linking Harisha, Safe Pack, World Pulse, Super Ghost, Z-Colour, and automation overlays.
- `docs/executive_living_workspace_summary.md`: executive-friendly story (linked via Insight).
- `docs/technical_living_workspace_summary.md`: this document for developers.
- `docs/living_workspace_manifest.json`: maps each script to its tag + role for traceability.
- `packages/living-workspace-package`: package copy used for stakeholder demos.

## Integration Notes

- Automation buttons marked with `data-harisha-action`/`data-harisha-shortcut` now call the tooltip helper; tooltips refresh on `harisha:update`.
- Safe Pack actions, reflection exports, and Harisha shortcuts log to Chronicle (`z.safe_pack.*`, `super_ghost.weekly_reflection`, `harisha.shortcut`) for Super Ghost narrations.
- Z-Colour binding listens for World Pulse and Harisha signals, ensuring the palette matches the current mood.
