# Z-AnyDevice adaptive adoption registry 0.5

Inventory reconciled through the 1.1 Project #3 evidence record. This registry records adaptive-interface evidence. It does not grant device trust, approval, quarantine, or security posture, and it does not authorize another project edit.

Machine inventory: `data/z_anydevice_adaptive_adoption_registry.json`

## Status values

| Status | Meaning |
| --- | --- |
| GREEN | The surface passes its required adaptive evidence. |
| AMBER | The foundation is in place and partial evidence passes. Material evidence debt remains. |
| RED | A measured critical adaptive failure. |
| NOT_TESTED | A canonical surface is identified and has not been tested. |
| LEGACY | A historical, export, snapshot, or shadow artifact. |
| EXEMPT | Not an interactive adaptive surface. |

## Reconciled inventory

| Surface | Status | Chromium | Firefox | WebKit |
| --- | --- | --- | --- | --- |
| `dashboard/Html/index-skk-rkpk.html` | GREEN | PASS | PASS | PASS |
| `apps/web` | GREEN | PASS | PASS | PASS |
| `dashboard/Html/amk-goku-main-control.html` | GREEN | PASS | PASS | PASS |
| `docs/golden-website/shell/index.html` | GREEN | PASS | PASS | PASS |

The earlier Firefox and WebKit dashboard link-list difference is a test-harness artifact. The same seven report links are hidden on mobile and compact in every browser, and visible on standard and wide. Required destinations match.

AMK-Goku Main Control is GREEN from external harness evidence on `dd2085d6f19ba3428f9e5984b7ea8c76bb7f3c46`. That record stayed `NOT_TESTED` until the steward accepted the evidence. Physical-device evidence is `NOT_COLLECTED`. `z-density` is not applicable.

The Golden Website home page is GREEN from external harness evidence on `825a671c03a9ebdfa4724a59dcc71abaffd8c69c`. That GREEN record is the home page only. Sibling Golden shell pages remain `NOT_TESTED`. The record stayed `NOT_TESTED` until the steward accepted the evidence. Publication is not authorized. Human screen-reader validation and physical Android validation remain outstanding. Physical-device evidence is `NOT_COLLECTED`.

The cockpit body scale stays `0.5`. Coarse-pointer controls use `calc(44px / var(--z-body-ui-scale, 1))`, so the effective target is 44px where CSS zoom changes the border box. Fine pointer keeps the existing desktop sizes.

Inline report links, and the apps/web header links, stay exempt from a 44px box. The shadow workbench remains `LEGACY` with the pre-existing script 404 carried as P2.

## Candidate backlog

These surfaces are not authorized for mutation:

| Candidate | Status |
| --- | --- |
| Z-Connect sealed preview lineage | NOT_TESTED |

Archives, snapshots, exports, and generated copies stay out of the active queue.

`ADAPTIVE_STATUS_IS_NOT_DEVICE_TRUST`

The platform label follows the GREEN host rows. Four GREEN hosts produce the four-host label. That label is not ecosystem-wide GREEN, and it does not cover the untested Golden sibling pages.

`Z_ANYDEVICE_ADAPTIVE_PLATFORM_CAPABILITY: PROVEN_FOUR_HOST_PLATFORM_CAPABILITY`

`ECOSYSTEM_WIDE_GREEN: NO`
