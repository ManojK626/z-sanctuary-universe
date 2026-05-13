# Phase AMK-MAP-3 — GREEN receipt

**Slice:** Universal domain lens + side catalog + readiness observatory + launch ceremony (read-only)
**Hub:** ZSanctuary_Universe
**Status:** GREEN when checklist below is satisfied.

## Scope locked

- Dashboard HTML/CSS/JS + `dashboard/data/amk_control_dashboard_map.json` + docs only.
- **No** backend, auth, real user feedback collection, analytics, provider/API calls, billing, deploy, bridge execution, auto-merge, or autonomous upgrades.

## Deliverables

| Artifact | Role |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `dashboard/data/amk_control_dashboard_map.json` | `domain_views`, `service_catalog_sidebar`, `readiness_observatory`, `inspector_advisory`, `launch_readiness`, `map3_disclaimer` |
| `dashboard/Html/amk-goku-main-control.html` | Domain bar, disclaimer, friendly panel, layout + `data-amk-section` targets |
| `dashboard/scripts/amk-goku-main-control-readonly.js` | View apply/hide, catalog filter, observatory + inspector + launch renders |
| `dashboard/styles/amk-goku-main-control.css` | Layout, catalog cards, observatory, launch |
| `docs/PHASE_AMK_MAP_3_UNIVERSAL_DOMAIN_VIEW.md` | Doctrine for MAP-3 |
| `docs/PHASE_AMK_MAP_3_GREEN_RECEIPT.md` | This receipt |

## Automated checks (hub root)

```bash
node -e "JSON.parse(require('fs').readFileSync('dashboard/data/amk_control_dashboard_map.json','utf8')); console.log('AMK map JSON OK')"
npm run verify:md
npm run dashboard:registry-verify
npm run z:traffic
npm run z:car2
```

## Manual checklist

- [ ] Open main control page over HTTP; **View as** changes hint and catalog rows.
- [ ] **Kids** and **Public Visitor:** technical sections hidden; friendly panel visible; catalog has no commercial/admin/security-tier rows.
- [ ] **Readiness observatory:** null scores show **UNKNOWN**.
- [ ] **Launch ceremony:** shows PREPARE (or configured status), gates list, blocked mirror — **no** deploy button.
- [ ] Catalog toggle opens/closes on narrow view; wide view shows catalog without requiring toggle.

## Rollback

Revert MAP-3 commits or restore prior `amk_control_dashboard_map.json`, HTML, CSS, JS, and MAP-3 docs. Clear `localStorage` key `amkGokuDomainView_v1` if needed.

## Sign-off

Operator: \***\*\*\*\*\***\_\_\_\_\***\*\*\*\*\*** Date: \***\*\_\_\*\***
