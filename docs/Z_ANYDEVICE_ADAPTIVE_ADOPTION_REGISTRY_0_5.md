# Z-AnyDevice adaptive adoption registry 0.5

Inventory reconciled to 0.6 local evidence. This registry records adaptive-interface evidence. It does not grant device trust, approval, quarantine, or security posture, and it does not authorize a new project edit.

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

The earlier Firefox and WebKit dashboard link-list difference is a test-harness artifact. The same seven report links are hidden on mobile and compact in every browser, and visible on standard and wide. Required destinations match.

The cockpit body scale stays `0.5`. Coarse-pointer controls use `calc(44px / var(--z-body-ui-scale, 1))`, so the effective target is 44px where CSS zoom changes the border box. Fine pointer keeps the existing desktop sizes.

Inline report links, and the apps/web header links, stay exempt from a 44px box. The shadow workbench remains `LEGACY` with the pre-existing script 404 carried as P2.

## Candidate backlog

These surfaces are not authorized for mutation:

| Candidate | Status |
| --- | --- |
| `dashboard/Html/amk-goku-main-control.html` | NOT_TESTED |
| Z-Connect sealed preview lineage | NOT_TESTED |
| Z-Golden canonical web surface | NOT_TESTED |

Archives, snapshots, exports, and generated copies stay out of the active queue.

`ADAPTIVE_STATUS_IS_NOT_DEVICE_TRUST`

`Z_ANYDEVICE_ADAPTIVE_PLATFORM_CAPABILITY: PROVEN_TWO_HOST_PLATFORM_CAPABILITY`

`ECOSYSTEM_WIDE_GREEN: NO`
