# Phase AMK-NOTIFY-1 — green receipt (AMK-Goku Notifications Panel)

## Scope delivered

| Item | Role |
| --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| [data/amk_operator_notifications.json](../data/amk_operator_notifications.json) | Lane card metadata (sample queue) |
| [dashboard/scripts/amk-goku-notifications-readonly.js](../dashboard/scripts/amk-goku-notifications-readonly.js) | Fetch JSON, render cards, localStorage decision stub only |
| [dashboard/styles/amk-goku-notifications.css](../dashboard/styles/amk-goku-notifications.css) | Panel styling |
| [AMK_GOKU_NOTIFICATIONS_PANEL.md](./AMK_GOKU_NOTIFICATIONS_PANEL.md) | Operator-facing panel doc |
| [AMK_GOKU_OPERATOR_CONFIRMATION_POLICY.md](./AMK_GOKU_OPERATOR_CONFIRMATION_POLICY.md) | Confirmation vs execution policy |
| `dashboard/Html/index-skk-rkpk.html` + shadow workbench | Panel + CSS + script wiring |

## Explicitly not in this phase

- Backend, auth, accounts, provider/API calls, billing, deployment, bridge execution, auto-merge, autonomous task execution, live Cursor task execution from the web UI.

## Manual checklist

1. Serve hub from repo root (`npx http-server . -p 5502`) and open `dashboard/Html/index-skk-rkpk.html` over HTTP — confirm panel loads or shows fetch hint when `file://`.
2. Click **Confirm / Hold / Needs review** — verify **localStorage** updates only (DevTools → Application).
3. Confirm **no** terminal or Cursor action fires from clicks.
4. Edit `data/amk_operator_notifications.json` when the real queue changes; keep `forbidden_actions` accurate per lane.
5. `npm run verify:md` after doc edits; `npm run z:traffic` and `npm run z:car2` before treating the hub as green for widen-scope work.

## Commands run (acceptance)

```bash
npm run verify:md
npm run z:traffic
npm run z:car2
npm run dashboard:registry-verify
```

## Rollback

1. Remove `data/amk_operator_notifications.json`, `dashboard/scripts/amk-goku-notifications-readonly.js`, `dashboard/styles/amk-goku-notifications.css`.
2. Revert HTML changes in `dashboard/Html/index-skk-rkpk.html` and `dashboard/Html/shadow/index-skk-rkpk.workbench.html`.
3. Remove the three `docs/AMK_*` / `docs/PHASE_AMK_NOTIFY_*` files and any cross-links (README, Z_TRAFFIC, Z_AUTONOMOUS) added for this phase.
