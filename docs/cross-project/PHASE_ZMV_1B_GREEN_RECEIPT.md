# Phase ZMV-1B — Living Ecosphere HTML Map · Green receipt

## Scope

**Read-only HTML + client script + CSS.** Loads existing hub JSON via `fetch`. No backend, auth, billing execution, entitlement enforcement, provider/API calls, Cloudflare deploy changes, iframe runtime coupling to paid services, or workflow execution buttons.

## Delivered

| Item | Path |
| ----------------- | -------------------------------------------------------- |
| Map page | `dashboard/Html/z-universe-ecosphere-map.html` |
| Script | `dashboard/scripts/z-universe-ecosphere-map-readonly.js` |
| Styles | `dashboard/styles/z-universe-ecosphere-map.css` |
| NAV catalog row | `zmv_ecosphere_map_readonly` under **Overview** |
| Design doc update | `docs/dashboard/Z_SANCTUARY_LIVING_ECOSPHERE_MAP.md` |

## Serve

From hub root:

```bash
npx http-server . -p 5502
```

Open: `http://127.0.0.1:5502/dashboard/Html/z-universe-ecosphere-map.html`

(`file://` will not load JSON due to `fetch` restrictions.)

## Acceptance commands

```bash
npm run dashboard:registry-verify
npm run z:cross-project:sync
npm run verify:md
```

## Manual checklist

| Check | Pass |
| ------------------------------------------ | ---- |
| Page loads over HTTP | ☐ |
| Magical (ZMV) section shows 7 rows | ☐ |
| Navigator services render | ☐ |
| Filter input only hides cards (no network) | ☐ |
| No execute/deploy controls | ☐ |

## ZMV-1C — Main dashboard header link

Plain anchor **Living Ecosphere Map** in `dashboard/Html/index-skk-rkpk.html` (and shadow workbench `dashboard/Html/shadow/index-skk-rkpk.workbench.html` with `../z-universe-ecosphere-map.html`). No new scripts or catalog rows.

## Rollback

Delete the three dashboard files above; remove catalog service `zmv_ecosphere_map_readonly`; revert doc edits (navigator, dashboard README, `Z_SANCTUARY_LIVING_ECOSPHERE_MAP.md`); delete this receipt. **ZMV-1C:** remove header `<p>` blocks with the ecosphere anchor from canonical + shadow HTML.
