# Phase AMK-MAP-1 — GREEN receipt

**Slice:** AMK-Goku Main Control Dashboard HTML (read-only compass)
**Date:** 2026-05-01 (hub time)
**Status:** GREEN when checklist below is satisfied by a human operator.

## Scope locked

- Dashboard HTML + `dashboard/data/` map JSON + CSS + JS + docs only.
- No backend, auth, API/provider calls, billing, deploy, bridge execution, auto-merge, or live task dispatch from the new page.

## Deliverables

| Artifact | Role |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| `dashboard/Html/amk-goku-main-control.html` | Operator compass page |
| `dashboard/data/amk_control_dashboard_map.json` | Section copy, links, sealed list, blocked categories |
| `dashboard/scripts/amk-goku-main-control-readonly.js` | Fetch map + optional traffic/notifications JSON; render only |
| `dashboard/styles/amk-goku-main-control.css` | Calm palette, cards, pills, `prefers-reduced-motion` |
| `docs/AMK_GOKU_MAIN_CONTROL_DASHBOARD.md` | Operator instructions |
| `docs/PHASE_AMK_MAP_1_GREEN_RECEIPT.md` | This receipt |

## Automated checks (run from hub root)

```bash
node -e "JSON.parse(require('fs').readFileSync('dashboard/data/amk_control_dashboard_map.json','utf8')); console.log('AMK map JSON OK')"
npm run verify:md
npm run dashboard:registry-verify
npm run z:traffic
npm run z:car2
```

## Manual checklist

- [ ] Serve hub over HTTP; open `dashboard/Html/amk-goku-main-control.html`.
- [ ] Hero shows four paths; each link navigates or anchors as expected (no scripts firing tasks).
- [ ] Traffic card shows pill when `z_traffic_minibots_status.json` exists.
- [ ] Next lane queue shows cards when `data/amk_operator_notifications.json` loads.
- [ ] Sealed systems and receipts lists link to real paths (no 404 for files you expect present).
- [ ] From `index-skk-rkpk.html`, the **AMK-Goku Main Control Map** link opens this page.
- [ ] Confirmation notice visible: confirmation does not execute work; lanes open outside the panel.

## Rollback

1. Remove or revert: `dashboard/Html/amk-goku-main-control.html`, `dashboard/data/amk_control_dashboard_map.json`, `dashboard/scripts/amk-goku-main-control-readonly.js`, `dashboard/styles/amk-goku-main-control.css`, AMK-MAP-1 docs, README / `AI_BUILDER_CONTEXT` / dashboard header link lines.
2. No database or secrets to revoke for this phase.

## Sign-off line

Operator: **********\_\_\_\_********** Date: ****\_\_****
