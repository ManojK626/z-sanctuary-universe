# Phase ZCO-3 — Green Receipt (Compute Organism Read-only Dashboard)

**Phase:** ZCO-3 — dashboard panel only
**Scope:** GET/read local JSON — **no** hardware control, shell, scan, orchestration
**Date:** 2026-05-21
**Prerequisites:** ZCO-1 doctrine, ZCO-2 `npm run z:compute:organism`

## Intent

Make the compute-organism spine **visible in the Sanctuary cockpit** without a control plane.

## Deliverables

| Artifact | Status |
| -------------------------------------------------------------- | ------ |
| `dashboard/panels/z-compute-organism-dashboard-readonly.html` | Added |
| `dashboard/scripts/z-compute-organism-dashboard-readonly.js` | Added |
| `dashboard/styles/z-compute-organism-dashboard-readonly.css` | Added |
| `data/z_compute_organism_dashboard_manifest.json` | Added |
| `docs/compute-organism/Z_COMPUTE_ORGANISM_DASHBOARD_SYSTEM.md` | Added |
| `docs/compute-organism/PHASE_ZCO_3_GREEN_RECEIPT.md` | Added |

## Explicitly not in ZCO-3

| Item | Posture |
| -------------------------------- | --------------------- |
| Hardware / orchestration buttons | **Forbidden** |
| npm or shell from browser | **Forbidden** |
| Network or device scan | **Forbidden** |
| New status observer logic | Use ZCO-2 script only |

## Acceptance

- [x] Panel shows mode, posture, Arelium, OMNISWARM, examples validated, global signal
- [x] Links to ZCO docs + green receipts (markdown hrefs)
- [x] Refresh data = GET only
- [x] Law block states no control plane

## Verification

```bash
npm run z:compute:organism
npm run verify:md
npm run dashboard:registry-verify
```

Open over HTTP:

`dashboard/panels/z-compute-organism-dashboard-readonly.html`

## Verification evidence (2026-05-21)

| Check | Result |
| ----------------------------------- | -------------------------------------------------- |
| `npm run verify:md` | exit **0** |
| `npm run z:compute:organism` | exit **0**, `overall_signal` **GREEN** |
| `npm run dashboard:registry-verify` | **green** |
| Panel JS | `fetch` + GET only; no hardware/orchestration APIs |

## Rollback

Remove panel, script, stylesheet, manifest, and ZCO-3 docs. Re-run `npm run verify:md`.

## Locked law

```text
ZCO-3 = visibility only.
Panel ≠ datacenter console.
AMK-Goku owns sacred moves.
```
