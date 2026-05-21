# ZCO-7 — Dashboard Embed (intake + upgrade draft)

**Phase:** ZCO-7 — cockpit visibility for ZCO-5 and ZCO-6 reports
**Panel:** [Z_COMPUTE_ORGANISM_DASHBOARD_SYSTEM.md](Z_COMPUTE_ORGANISM_DASHBOARD_SYSTEM.md) (same read-only HTML surface as ZCO-3)
**Prerequisites:** ZCO-5 `npm run z:compute:intake`, ZCO-6 `npm run z:compute:upgrade-draft`

## Purpose

Complete the clean operator chain in the Sanctuary cockpit:

```text
declare → validate → draft → display
```

Without adding scan, shell, network, hardware control, or a control plane.

## Governance law

The embed **MUST NOT**:

- run `npm`, shell, or probes from the browser
- scan hardware or networks
- control devices, fans, PSU, or BIOS
- POST/PUT to APIs or mutate registries
- auto-refresh on a timer that triggers side effects (manual **Refresh data** = GET only)

It **MAY**:

- **GET** `data/reports/z_compute_intake_validation.json`
- **GET** `data/reports/z_compute_upgrade_plan_draft.json`
- display signals, findings, limitations, and phase summaries
- show section hints when reports are missing (operator runs hub commands locally)

## Operator workflow

```bash
npm run z:compute:organism
npm run z:compute:intake
npm run z:compute:upgrade-draft
```

Serve hub over **http** (same-origin), then open:

`dashboard/panels/z-compute-organism-dashboard-readonly.html`

Click **Refresh data** — repeats GET only.

## UI sections (ZCO-7)

| Block | JSON source | Display |
| ----------------- | ----------------------------------- | -------------------------------------------------------- |
| Intake validation | `z_compute_intake_validation.json` | Signal, inventory path, RED/YELLOW counts, top findings |
| Upgrade draft | `z_compute_upgrade_plan_draft.json` | Signal, blocked, phase count, limitations, phase preview |

ZCO-2 organism status cards remain unchanged above the chain block.

## Artifacts touched

| Path | Change |
| ------------------------------------------------------------- | ------------------------------- |
| `dashboard/panels/z-compute-organism-dashboard-readonly.html` | ZCO-7 chain section |
| `dashboard/scripts/z-compute-organism-dashboard-readonly.js` | Optional GET for intake + draft |
| `dashboard/styles/z-compute-organism-dashboard-readonly.css` | Chain layout |
| `data/z_compute_organism_dashboard_manifest.json` | ZCO-7 data URLs + commands |

## Locked law

```text
Dashboard visibility ≠ permission to act.
YELLOW on panel ≠ full planning clearance.
RED draft blocked = fix intake first.
AMK-Goku owns acquire, install, and deploy.
```
