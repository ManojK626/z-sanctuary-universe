# Phase Z-SSWS-LAB-1 — green receipt (unified Cursor workspace control)

**Date:** 2026-05-04
**Scope:** Workspace files, `data/amk_cursor_workspace_profiles.json`, checker script, reports, doorway profile updates, docs, dashboard indicator metadata.
**Out of scope:** Repo merge, folder moves, server start, `npm install`, extension auto-install, secrets, NAS mount, deploy, Cloudflare, billing/bridge/provider behaviour.

## Delivered

- `workspaces/AMK-Goku-Super-Saiyan-Main.code-workspace` — hub + Z_Labs cockpit with search/watcher excludes.
- `workspaces/AMK-Goku-Z-Lab.code-workspace` — Z_Labs-only deep lane.
- `data/amk_cursor_workspace_profiles.json` — main + deep-work profile map and laws.
- `scripts/amk_cursor_workspace_profiles_check.mjs` — validator; writes `data/reports/amk_cursor_workspace_profiles_report.{json,md}`.
- `docs/AMK_CURSOR_WORKSPACE_STRATEGY.md`, this receipt, cross-links in hub docs.
- `data/amk_workspace_doorway_registry.json` — profiles `main_control`, `z_lab`, `questra`, `creative_deep`; morning → main cockpit; new project rows for both workspace files.
- `scripts/amk_open_workspace_doors.ps1` — extended `ValidateSet` for new profiles.
- `package.json` — `amk:workspace:profiles`.
- `dashboard/data/amk_project_indicators.json` + `dashboard/scripts/amk-project-indicators-readonly.js` — indicator + overlay for workspace profiles report.

## Verification (operator)

```bash
node -e "JSON.parse(require('fs').readFileSync('data/amk_cursor_workspace_profiles.json','utf8')); JSON.parse(require('fs').readFileSync('workspaces/AMK-Goku-Super-Saiyan-Main.code-workspace','utf8')); console.log('AMK workspace profiles JSON OK')"
npm run amk:workspace:profiles
npm run amk:doorway:status
npm run verify:md
npm run z:ssws:requirements
npm run z:traffic
npm run z:car2
npm run dashboard:registry-verify
```

## Posture

- **Go/No-Go:** `NO_GO_FOR_AUTO_LAUNCH` on the new indicator row.
- **YELLOW** from the checker is expected when the main workspace includes the full hub root (load awareness), not a failure.
