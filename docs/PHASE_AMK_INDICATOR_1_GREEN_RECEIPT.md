# Phase AMK-INDICATOR-1 — GREEN receipt (manual)

**Scope:** Read-only dashboard UI + `dashboard/data/amk_project_indicators.json` + docs. **No** backend, auth, provider calls, billing, deployment execution, bridge execution, auto-merge, or live Cursor task dispatch.

## Manual checklist (operator)

- [ ] `node -e "JSON.parse(require('fs').readFileSync('dashboard/data/amk_project_indicators.json','utf8')); console.log('AMK indicators JSON OK')"` exits 0.
- [ ] `npm run verify:md` exits 0.
- [ ] `npm run dashboard:registry-verify` exits 0.
- [ ] `npm run z:traffic` exits 0.
- [ ] `npm run z:car2` exits 0.
- [ ] `npm run z:susbv:overseer` exits 0 (when script is present in package.json).
- [ ] Serve hub from repo root (`npx http-server . -p 5502` or equivalent) and open:
  - `dashboard/Html/index-skk-rkpk.html` — left **Unified readiness indicators** panel renders; Cloudflare card shows **HOLD**.
  - `dashboard/Html/amk-goku-main-control.html` — **Unified readiness indicators** section renders.
  - Shadow workbench mirror shows the same panel (observe-only disclaimer).
- [ ] Confirm **no** new buttons run npm, tasks, or deploy; acknowledgement is **localStorage only** with on-screen text stating it does not execute work.
- [ ] **Kids** / **Public Visitor** lenses on main control hide the indicators section (domain map JSON).

## Rollback

1. Remove `<script defer src="../scripts/amk-project-indicators-readonly.js">` and CSS link from affected HTML files.
2. Remove indicator panel markup from `index-skk-rkpk.html` and shadow workbench.
3. Remove the `data-amk-section="indicators"` block from `amk-goku-main-control.html`.
4. Delete `dashboard/data/amk_project_indicators.json`, `dashboard/scripts/amk-project-indicators-readonly.js`, `dashboard/styles/amk-project-indicators.css`, and this receipt + `AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md` if fully reverting.
5. Revert `dashboard/data/amk_control_dashboard_map.json` hidden_section_ids for `indicators` if rolling back domain behavior.

## Evidence links

- Primary spec: [AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md](./AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md)
