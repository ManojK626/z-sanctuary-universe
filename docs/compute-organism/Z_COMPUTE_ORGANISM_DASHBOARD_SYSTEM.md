# Z-Compute Organism Dashboard — read-only (ZCO-3 + ZCO-7 embed)

**Mission:** Make the compute-organism **infrastructure awareness spine** visible in the Sanctuary cockpit **without** opening a dangerous control plane.

**ZCO-7:** Same panel now embeds **intake validation** and **upgrade plan draft** reports (GET only). See [ZCO_7_DASHBOARD_INTAKE_DRAFT_EMBED.md](ZCO_7_DASHBOARD_INTAKE_DRAFT_EMBED.md).

## Governance law (mandatory)

The dashboard **MUST NOT**:

- control hardware, PSU, fans, BIOS, or power
- run shell commands or npm from the browser
- scan networks or devices
- orchestrate clusters or workloads
- deploy, merge, or mutate registries
- become a control plane

It **MAY**:

- **GET** `data/reports/z_compute_organism_status.json` (same-origin HTTP)
- **GET** `data/reports/z_compute_intake_validation.json` (ZCO-7)
- **GET** `data/reports/z_compute_upgrade_plan_draft.json` (ZCO-7)
- display posture, doctrine readiness, examples validated, global signal, intake findings, draft phases
- link to ZCO doctrine markdown and green receipts
- offer **Refresh data** (repeat GET only)

## Artifacts

| Artifact | Role |
| ------------------------------------------------------------- | ----------------------------- |
| `dashboard/panels/z-compute-organism-dashboard-readonly.html` | Standalone read-only panel |
| `dashboard/scripts/z-compute-organism-dashboard-readonly.js` | GET JSON only |
| `dashboard/styles/z-compute-organism-dashboard-readonly.css` | Presentation only |
| `data/z_compute_organism_dashboard_manifest.json` | Machine pointer + law summary |

## Data flow

1. Operator runs `npm run z:compute:organism`, `npm run z:compute:intake`, `npm run z:compute:upgrade-draft` from hub root.
2. Serve hub over **http** (e.g. dashboard static server on port 5502).
3. Open `dashboard/panels/z-compute-organism-dashboard-readonly.html`.
4. Page reads status + intake + draft JSON; **Refresh data** repeats GET — does not run scripts.

## Displayed fields (from status JSON)

| UI label | Source |
| --------------------- | ----------------------------------- |
| ZCO mode | `mode` |
| Runtime orchestration | `posture.runtime_orchestration` |
| Hardware control | `posture.hardware_control` |
| Arelium Shield | `readiness.arelium_shield_doctrine` |
| OMNISWARM doctrine | `readiness.swarm_doctrine` |
| Examples validated | `examples.examples_validated` |
| Global signal | `overall_signal` |
| Hub traffic | `global_hub_signal.traffic_overall` |

## Related

| Doc | Role |
| ---------------------------------------------------------------------------------- | ----------------------- |
| [Z_COMPUTE_ORGANISM_ARCHITECTURE.md](Z_COMPUTE_ORGANISM_ARCHITECTURE.md) | Architecture spine |
| [Z_SSWS_AI_TOWER_BUILDER_INSTRUCTIONS.md](Z_SSWS_AI_TOWER_BUILDER_INSTRUCTIONS.md) | Builder instructions |
| [PHASE_ZCO_2_GREEN_RECEIPT.md](PHASE_ZCO_2_GREEN_RECEIPT.md) | Status observer |
| [PHASE_ZCO_3_GREEN_RECEIPT.md](PHASE_ZCO_3_GREEN_RECEIPT.md) | Dashboard phase (ZCO-3) |
| [ZCO_7_DASHBOARD_INTAKE_DRAFT_EMBED.md](ZCO_7_DASHBOARD_INTAKE_DRAFT_EMBED.md) | Intake + draft embed |
| [PHASE_ZCO_7_GREEN_RECEIPT.md](PHASE_ZCO_7_GREEN_RECEIPT.md) | ZCO-7 green receipt |

## Locked law

```text
Dashboard visibility ≠ permission to act.
GREEN on panel ≠ deploy.
Refresh data = GET only.
AMK-Goku owns sacred moves.
```
