# Z-Sanctuary Living Ecosphere Map

## Status

**ZMV-1B shipped (read-only HTML).** Implemented files:

| Artifact | Path |
| -------- | -------------------------------------------------------- |
| Page | `dashboard/Html/z-universe-ecosphere-map.html` |
| Script | `dashboard/scripts/z-universe-ecosphere-map-readonly.js` |
| Styles | `dashboard/styles/z-universe-ecosphere-map.css` |

Serve hub root (e.g. `npx http-server . -p 5502`), then open:

`http://127.0.0.1:5502/dashboard/Html/z-universe-ecosphere-map.html`

**ZMV-1C:** The unified main dashboard header (`dashboard/Html/index-skk-rkpk.html`) includes the same link text for one-click discovery — plain anchor only, no script.

No Cloudflare or deploy changes; no execution buttons on the map.

**ZMV-1A** remains the registry + policy foundation; this page **visualizes** those JSON sources alongside NAV and ZSX catalogs.

## Intended map layers

| Layer | Example sources |
| ------------- | ---------------------------------------------------------------- |
| Projects | ÉirMind, Z-QUESTRA, Hub, XL2, Z-WorkSphere (reference rows only) |
| Modules | `data/z_master_module_registry.json`, module docs indexes |
| Capabilities | `data/z_cross_project_capability_index.json`, Questra manifest |
| Visual tools | `data/z_magical_visual_capability_registry.json`, Z-VIL docs |
| Service state | `dashboard/data/z_universe_service_catalog.json` (NAV-1) |
| Entitlement | `data/z_service_entitlement_catalog.json` |
| Governance | 14 DRP / 14 DOP, charter pointers, MAOS |
| Deployment | Cloudflare **candidate** notes only — no edge deploy from map |
| Trust | Green receipts, Zuno / CAR² reports, policy markdown |

## Read-only behavior

- **Fetch + render** catalog JSON when served over HTTP (same pattern as NAV-1).
- **Links** open docs/reports with `target="_blank"` from hub-relative paths.
- **No** payments, auth, provider calls, entitlement enforcement, or cross-project memory.

## Cloudflare awareness

The map may **label** future edge hosting as contingency only (see hub Cloudflare docs in AGENTS). **ZMV-1A does not** configure workers, routes, or secrets.

## Related

- [Z_UNIVERSE_WORKSTATION_NAVIGATOR.md](./Z_UNIVERSE_WORKSTATION_NAVIGATOR.md)
- [Z_MAGICAL_VISUAL_BRIDGE_POLICY.md](../cross-project/Z_MAGICAL_VISUAL_BRIDGE_POLICY.md)
- [PHASE_ZMV_1A_GREEN_RECEIPT.md](../cross-project/PHASE_ZMV_1A_GREEN_RECEIPT.md)
- [PHASE_ZMV_1B_GREEN_RECEIPT.md](../cross-project/PHASE_ZMV_1B_GREEN_RECEIPT.md)
