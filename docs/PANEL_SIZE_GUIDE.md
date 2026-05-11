# Panel Size & Layout Guide

This guide captures the hardened panel sizing strategy that the Z‑Sanctuary Universe and Z‑Labs dashboards now share. Follow it whenever you add new panels or copy dashboards between workspaces.

## 1. Length categories

Every panel lives in one of three size buckets:

- **short** — metadata/status helpers, occupies the right column, keeps a compact footprint.
- **medium** — secondary dashboards that still fit beside tall lanes.
- **tall** — primary dashboards that own the center lane and may stretch vertically.

The length you choose drives CSS (via the `.z-panel-length-*` helpers) and layout hints.

## 2. Central config

All defaults live in `config/z_panel_size_base.json`. The file now exposes:

- `defaults.length` → fallback length when nothing is specified.
- `columns` → maps length → column (`short` → `right`, `medium` → `left`, `tall` → `center`).
- `panels` → per-panel overrides for both `length` and `column`. Update this object whenever you register a new panel ID.
- `guidance` → a textual reminder that the right column is for short panels and the same JSON must be mirrored inside each Z-Lab workspace.

Because `z_ui_extras.js` reads this file at runtime, any change there automatically influences the docking logic, column selection, and stored panel length.

## 3. Fit & quick actions

- The quick-action “F” (Fit Content) now sets `.z-panel-fit-mode`, forcing the panel to stretch across the viewport and respecting photophobic contrast rules.
- Fast revert is handled by the “Expand Medium” or “Collapse” actions; the last stored length is persisted so the layout comes back to the right column when you close the fit view.
- New panels should wrap their content in the `z-panel-body` container so the fit math can measure `scrollHeight`.

## 4. Z‑Lab alignment

The Z-Lab dashboards must stay in sync with this strategy:

1. Copy `config/z_panel_size_base.json` into the Z-Lab workspace (or create a symlink) and point `PANEL_SIZE_CONFIG_PATH` there.
2. When adding a new panel to Z-Lab, reuse the same `length` + `column` entry.
3. Mirror the light-touch CSS in `interface/z_style.css` so the glow/fit logic stays consistent.

Treat this file as the single source of truth. If you ever reorganize panel layouts, update both the config JSON and this guide so the governance layer knows how to reconnect the same values.
