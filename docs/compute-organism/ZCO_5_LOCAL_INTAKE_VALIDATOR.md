# ZCO-5 — Local Intake Validator (read-only)

**Phase:** ZCO-5 — validate operator-declared inventory JSON only
**Rules:** [ZCO_5_VALIDATION_RULES.md](ZCO_5_VALIDATION_RULES.md)
**Parent:** [ZCO_4_HARDWARE_INTAKE_POLICY.md](ZCO_4_HARDWARE_INTAKE_POLICY.md)

## Purpose

Add an **Infrastructure Intelligence Governance Spine** layer that checks **local, human-entered** inventory files for shape, safety, and forbidden control/telemetry claims — without scanning hardware, executing shell commands, or touching the network.

```text
ZCO-1 doctrine → ZCO-2 observer → ZCO-3 cockpit → ZCO-4 schema → ZCO-5 intake validation → ZCO-6 upgrade draft → ZCO-7 dashboard embed
```

## Command

From hub root:

```bash
npm run z:compute:intake
```

Operator inventory path (optional):

```bash
# PowerShell
$env:ZCO_INVENTORY_PATH = "C:\path\to\my\zco_inventory.json"
npm run z:compute:intake

# bash
ZCO_INVENTORY_PATH=data/local/my_inventory.json npm run z:compute:intake
```

**Default** (when env unset): `data/examples/zco_hardware_inventory.example.json`

## Outputs

| Artifact | Role |
| ----------------------------------------------- | -------------- |
| `data/reports/z_compute_intake_validation.json` | Machine report |
| `data/reports/z_compute_intake_validation.md` | Human summary |

## Posture (always in report)

```text
runtime_orchestration: CLOSED
hardware_control: DISABLED
telemetry_collection: DISABLED
network_probe: DISABLED
```

## What the validator does

| Action | Allowed |
| ----------------------------- | ------- |
| Read one JSON file from disk | Yes |
| Validate required fields | Yes |
| Detect duplicate `node_id` | Yes |
| Flag forbidden keys / wording | Yes |
| Classify GREEN / YELLOW / RED | Yes |
| Write validation reports | Yes |

## What the validator MUST NOT do

| Forbidden | Reason |
| ------------------------- | -------------------- |
| Hardware scan | ZCO law |
| Shell execution | No runtime control |
| Network probe | No scan |
| BIOS / driver / benchmark | Human only |
| Fan/GPU/CPU control | No control plane |
| Auto-discovery | Declared-only model |
| Orchestration | ZCO-2/5 observe only |

## Relationship to ZCO-2

| Tool | Scope |
| ---------------------------- | ------------------------------------------------------------------- |
| `npm run z:compute:organism` | Hub doctrine + **committed examples** + forbidden **scripts** audit |
| `npm run z:compute:intake` | **Your** inventory JSON path (env or default example) |

Run both for full posture; neither grants deploy or hardware authority.

## Arelium / OMNISWARM (advisory)

Validation findings feed **IntakeBot** vocabulary:

- **RED** → hold until inventory cleaned
- **YELLOW** → ExplainBot + AMK clarification
- **GREEN** → safe for planning discourse only — not install permission

## Locked law

```text
ZCO-5 = declared planning validator, not endpoint agent.
Exit 1 on RED only.
GREEN ≠ deploy.
```
