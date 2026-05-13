# Phase AMK-MAP-2 — GREEN receipt

**Slice:** Living ecosystem canvas + health monitoring strip + health rhythm scheduler (read-only)
**Hub:** ZSanctuary_Universe
**Status:** GREEN when checklist below is satisfied.

## See also

- **AMK-MAP-3** (universal domain lenses, side catalog, readiness observatory, launch ceremony): [PHASE_AMK_MAP_3_UNIVERSAL_DOMAIN_VIEW.md](PHASE_AMK_MAP_3_UNIVERSAL_DOMAIN_VIEW.md) and [PHASE_AMK_MAP_3_GREEN_RECEIPT.md](PHASE_AMK_MAP_3_GREEN_RECEIPT.md). MAP-2 canvas + health + rhythm remain the base; MAP-3 extends the same HTML page.

## Scope locked

- Dashboard HTML/CSS/JS + `dashboard/data/amk_control_dashboard_map.json` + docs only.
- Local SVG generated in-page (no external graph library, no canvas animation loops).
- No backend, cron, daemon, API/provider calls, billing, deploy, bridge execution, auto-merge, or Cursor task dispatch.

## Deliverables

| Artifact | Role |
| ----------------------------------------------------- | ------------------------------------------------------------------------- |
| `dashboard/Html/amk-goku-main-control.html` | Sections for canvas, health strip, rhythm planner |
| `dashboard/data/amk_control_dashboard_map.json` | `ecosystem_canvas`, `health_monitor_cards`, `rhythm_schedule` (schema v2) |
| `dashboard/scripts/amk-goku-main-control-readonly.js` | Fetch reports, evaluate health (UNKNOWN when missing), draw SVG |
| `dashboard/styles/amk-goku-main-control.css` | SVG strokes, health grid, rhythm layout |
| `docs/AMK_GOKU_MAIN_CONTROL_DASHBOARD.md` | AMK-MAP-2 behaviour documented |
| `docs/PHASE_AMK_MAP_2_GREEN_RECEIPT.md` | This receipt |

## Automated checks (hub root)

```bash
node -e "JSON.parse(require('fs').readFileSync('dashboard/data/amk_control_dashboard_map.json','utf8')); console.log('AMK map JSON OK')"
npm run verify:md
npm run dashboard:registry-verify
npm run z:traffic
npm run z:car2
```

## Manual checklist

- [ ] Serve hub over HTTP; open `dashboard/Html/amk-goku-main-control.html`.
- [ ] **Living ecosystem canvas:** AMK-Goku Core centered; satellites on ring; solid vs dashed edges match map intent; no flashing or motion loops.
- [ ] **Shapes:** legend matches rendered geometry (circle, diamond, hex, octagon, star, shield, square, spiral).
- [ ] **Health monitoring:** each card shows a chip; missing report JSON shows **UNKNOWN**, not fabricated GREEN.
- [ ] **Rhythm scheduler:** disclaimer visible — visual reminder only, does not run tasks; command lines are documentation strings.
- [ ] **Confirmation law** still visible in header block; notification queue unchanged (read-only).

## Rollback

1. Revert AMK-MAP-2 commits or restore prior versions of the files listed above.
2. Set `amk_control_dashboard_map.json` schema back to v1 only if you must drop MAP-2 data blocks (prefer full-file revert).

## Sign-off

Operator: \***\*\*\*\*\***\_\_\_\_\***\*\*\*\*\*** Date: \***\*\_\_\*\***
