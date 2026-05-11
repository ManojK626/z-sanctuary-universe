# Z-Garage — template + operator checklist

Advisory only. Does not change release governance, Enforcer, or deploy authority.

## In-repo template (copy-paste)

- Folder: `templates/z_garage_node_minimal/`
- File: `package.json` — minimal `start` / `build` / `test` / `lint` stubs (safe exit 0)
- Short usage: `templates/z_garage_node_minimal/README.md`

## When to use

- Z-Garage **patterns** show the same task many times (e.g. “Add npm scripts…”).
- The folder is (or should be) a **real Node package**, not a random data-only directory.

## Checklist (safe order)

1. **Refresh signals** — From hub root: `npm run z:garage:full-scan` (or at least `node scripts/z_garage_scanner.mjs && node scripts/z_ci_core.mjs && node scripts/z_garage_planner.mjs`).
2. **Read patterns** — Open `data/reports/z_garage_upgrade_plan.json` → `patterns`. Confirm the top pattern matches what you intend to fix (usually scripts).
3. **Pick targets** — Choose **real** packages first (`packages/*`, `apps/*`, or named modules). Avoid sprinkling `package.json` into every scanned folder “just to silence the report.”
4. **Apply template** — Copy/merge `templates/z_garage_node_minimal/package.json`; set `name`, then replace stub scripts with real `start` / `build` / `test` / `lint` when ready.
5. **Re-scan** — Run `npm run z:garage:full-scan` again; confirm `pressure` / patterns improve in `z_garage_upgrade_plan.json` and dashboard.
6. **Governance** — Keep using Enforcer / release gates as before; this checklist does not approve deploys.

## Extras (both on purpose)

- **Template files** = repeatable, reviewable baseline in git.
- **This checklist** = human gate so automation does not run ahead of intent.

If a path should **not** become a Node project, fix **classification** or scanner depth in a dedicated change instead of faking scripts everywhere.

## Z-Bridge–specific (hub)

- **`config/z_bridge` and `data/z_bridge`** are config/data trees, not Node packages. The scanner now only flags **`no_scripts`** when a folder **has** `package.json` (`node_project`). Z-Bridge surfaces are classified as **`bridge`** where appropriate, so they are not treated as generic “unknown” noise.
- **Engine + deploy + dashboard** use local `package.json` under `scripts/z_bridge`, `deploy/z_bridge_soft`, and `ui/z_bridge_dashboard` with real or documented stub scripts; hub commands remain the primary entry (`npm run z:bridge:*`, `deploy:cf-z-bridge:*`).
