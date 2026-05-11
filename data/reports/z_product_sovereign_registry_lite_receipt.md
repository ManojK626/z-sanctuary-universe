# Z-Product Sovereign Registry Lite — Receipt

**Generated posture:** mock / read-only / internal planning.

## What shipped

| Artifact | Purpose |
| --------------------------------------------------------- | ------------------------------------------------------------------- |
| `data/z_sovereign_products_registry.json` | Sovereign product cards (seed list + schema-shaped fields). |
| `dashboard/panels/z_product_sovereign_registry_lite.html` | Read-only iframe panel — badges, no commerce, low-sensory friendly. |
| `dashboard/Html/index-skk-rkpk.html` | Panel shell + Control Centre link + Commander action button. |
| `core/z_ui_extras.js` | Panel Directory entry under Core Systems → Live Signals. |
| `scripts/z_product_registry_verify.mjs` | Required fields + enum validation. |
| `package.json` | `npm run z:products:verify` |

## Explicit non-goals (this build)

- No manufacturing outreach, payments, supplier or certification claims from UI.
- No backend automation or external network from the Lite panel.

## Commander (review posture)

- **Lanes:** “Z-Product Sovereign Registry Lite · review · paused” — no IndustryBot-generated fields yet; manual review via Action panel + JSON.
- **Mock receipt line** reflects pause (see `dashboard/scripts/z-commander-panel.js`).

## Ops

```bash
npm run z:products:verify
```

Serve dashboard from hub root so `../../data/z_sovereign_products_registry.json` resolves in the panel iframe.

## Rollback

Remove the artifacts above and revert wiring in `index-skk-rkpk.html`, `core/z_ui_extras.js`, and the `z:products:verify` script line in `package.json`.
