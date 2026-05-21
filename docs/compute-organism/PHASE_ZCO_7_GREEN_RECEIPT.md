# Phase ZCO-7 — Green Receipt (Dashboard Intake + Draft Embed)

**Phase:** ZCO-7 — cockpit GET embed for intake validation and upgrade draft
**Scope:** Dashboard UI + manifest + docs — **no** new observer scripts
**Date:** 2026-05-21
**Prerequisites:** ZCO-3 panel, ZCO-5 intake validator, ZCO-6 upgrade draft

## Intent

```text
declare → validate → draft → display
```

Make ZCO-5 and ZCO-6 reports visible in the existing read-only compute organism panel.

## Deliverables

| Artifact | Status |
| ------------------------------------------------------------- | ---------------------------- |
| `dashboard/panels/z-compute-organism-dashboard-readonly.html` | Updated (ZCO-7 chain) |
| `dashboard/scripts/z-compute-organism-dashboard-readonly.js` | Updated (GET intake + draft) |
| `dashboard/styles/z-compute-organism-dashboard-readonly.css` | Updated |
| `data/z_compute_organism_dashboard_manifest.json` | Updated |
| `docs/compute-organism/ZCO_7_DASHBOARD_INTAKE_DRAFT_EMBED.md` | Added |
| `docs/compute-organism/PHASE_ZCO_7_GREEN_RECEIPT.md` | Added |

## Explicitly not in ZCO-7

| Item | Posture |
| -------------------------------- | ------------------------- |
| Hardware / orchestration buttons | **Forbidden** |
| npm or shell from browser | **Forbidden** |
| Network or device scan | **Forbidden** |
| New probe or validator logic | Use ZCO-5/6 scripts only |
| Auto-polling side effects | Manual refresh = GET only |

## Acceptance

- [x] Panel GETs intake validation JSON when present
- [x] Panel GETs upgrade plan draft JSON when present
- [x] Missing reports show operator hints (no silent failure)
- [x] Refresh data = GET only; no control plane
- [x] Law unchanged: visibility ≠ permission

## Verification

```bash
npm run z:compute:organism
npm run z:compute:intake
npm run z:compute:upgrade-draft
npm run verify:md
npm run dashboard:registry-verify
npm run z:traffic
```

Open over HTTP: `dashboard/panels/z-compute-organism-dashboard-readonly.html`

## Verification evidence (2026-05-21)

| Check | Result |
| ----------------------------------- | ------------------------ |
| `npm run z:compute:organism` | GREEN |
| `npm run z:compute:intake` | YELLOW (default example) |
| `npm run z:compute:upgrade-draft` | YELLOW (12 phases) |
| `npm run verify:md` | pass |
| `npm run dashboard:registry-verify` | green |

## Locked law

```text
ZCO-7 = display only.
Not a stealth admin tool.
AMK-Goku owns sacred moves.
```
