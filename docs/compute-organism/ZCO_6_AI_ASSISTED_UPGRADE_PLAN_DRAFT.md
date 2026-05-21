# ZCO-6 — AI-Assisted Upgrade Plan Draft (advice only)

**Phase:** ZCO-6 — read-only advisory draft from validated declared inventory
**Planning guide:** [ZCO_4_UPGRADE_PLANNING_GUIDE.md](ZCO_4_UPGRADE_PLANNING_GUIDE.md)
**Prerequisite:** [ZCO_5_LOCAL_INTAKE_VALIDATOR.md](ZCO_5_LOCAL_INTAKE_VALIDATOR.md)

## Purpose

First **builder intelligence** step in the Z-Compute Organism lane: turn **intake validation + declared inventory** into a **staged upgrade-plan draft** for human review — without purchase links, prices, hardware scans, shell, network, or install authority.

```text
ZCO-1 doctrine → ZCO-2 observer → ZCO-3 cockpit → ZCO-4 schema → ZCO-5 validation → ZCO-6 upgrade draft
```

## Command

From hub root (run intake first):

```bash
npm run z:compute:intake
npm run z:compute:upgrade-draft
```

Optional paths:

```bash
# PowerShell — custom validation report or inventory override
$env:ZCO_INTAKE_VALIDATION_PATH = "data/reports/z_compute_intake_validation.json"
$env:ZCO_INVENTORY_PATH = "C:\path\to\my\zco_inventory.json"
npm run z:compute:upgrade-draft
```

**Default validation report:** `data/reports/z_compute_intake_validation.json` (from last `z:compute:intake` run).

## Outputs

| Artifact | Role |
| ------------------------------------------------ | ------------- |
| `data/reports/z_compute_upgrade_plan_draft.json` | Machine draft |
| `data/reports/z_compute_upgrade_plan_draft.md` | Human summary |

## Posture (always in report)

```text
runtime_orchestration: CLOSED
hardware_control: DISABLED
telemetry_collection: DISABLED
purchase_links: DISABLED
price_quotes: DISABLED
install_authority: AMK_HUMAN_ONLY
```

## Signal logic

| Draft signal | Meaning |
| ------------ | --------------------------------------------------------------------------------------- |
| **GREEN** | Safe advisory draft from **GREEN** intake on complete-enough inventory |
| **YELLOW** | Intake **YELLOW** — suggestions limited; sparse/recycle fields need human clarification |
| **RED** | **Blocked** — intake **RED**, missing validation report, or inventory unreadable |

Exit code **1** only on **RED**. **YELLOW** and **GREEN** exit **0**.

## What the drafter does

| Action | Allowed |
| -------------------------------------------------------------------------------- | ------- |
| Read intake validation JSON | Yes |
| Read inventory JSON referenced by validation | Yes |
| Emit phased `assess` / `prepare` / `acquire` / `install` / `validate` advisories | Yes |
| Tag **AMK gate** on acquire/install and NAS_WAIT | Yes |
| Assign OMNISWARM MiniBot vocabulary (advisory) | Yes |
| Write draft reports | Yes |

## What the drafter MUST NOT do

| Forbidden | Reason |
| ----------------------------- | ------------------- |
| Purchase URLs or vendor links | ZCO-6 law |
| Currency / price quotes | Advice-only |
| Hardware scan | Declared-only model |
| Shell / network / control | No runtime |
| Auto-install or auto-purchase | AMK + human only |
| Override RED intake | Blocked until clean |

## Relationship to ZCO-4 / ZCO-5

| Tool | Role |
| --------------------------------- | --------------------------------------------------------------------------- |
| `npm run z:compute:intake` | Validates declared inventory — **source of truth for block/allow** |
| `npm run z:compute:upgrade-draft` | Drafts phases from **valid-enough** inventory + intake signal |
| `zco_upgrade_path.example.json` | **Manual** operator-authored example; ZCO-6 draft is **generated** advisory |

Operators may copy draft phases into a local gitignored upgrade-path JSON after AMK review.

## Arelium / OMNISWARM

- **PowerBot** / **ThermalBot** — assess PSU and cooling before acquire
- **StorageBot** — NAS_WAIT prepare (BLUE, AMK gate)
- **UpgradeBot** — declared `upgrade_goals` as acquire hypotheses
- **RecycleBot** — dormant / recycle_candidate advisories

## Locked law

```text
ZCO-6 = builder intelligence advice only.
Draft ≠ purchase order ≠ install script.
AMK-Goku owns acquire, wiring, power-on, and install.
GREEN ≠ deploy.
```
