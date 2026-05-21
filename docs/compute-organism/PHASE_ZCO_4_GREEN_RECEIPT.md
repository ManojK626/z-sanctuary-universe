# Phase ZCO-4 — Green Receipt (Hardware Inventory Intake Schema)

**Phase:** ZCO-4 — manual-entry / observe-only intake
**Scope:** Policy, schema, planning guide, example JSON only
**Date:** 2026-05-21
**Prerequisites:** ZCO-1–3 sealed

## Intent

Teach the compute organism **what hardware exists** (declared), what role it serves, upgrade and recycle posture, and sanctuary lane ownership — **without scanning or controlling machines**.

## Deliverables

| Artifact | Status |
| ------------------------------------------------------- | ------ |
| `docs/compute-organism/ZCO_4_HARDWARE_INTAKE_POLICY.md` | Added |
| `docs/compute-organism/ZCO_4_HARDWARE_SCHEMA.md` | Added |
| `docs/compute-organism/ZCO_4_UPGRADE_PLANNING_GUIDE.md` | Added |
| `docs/compute-organism/PHASE_ZCO_4_GREEN_RECEIPT.md` | Added |
| `data/examples/zco_hardware_inventory.example.json` | Added |
| `data/examples/zco_multi_node_cluster.example.json` | Added |
| `data/examples/zco_upgrade_path.example.json` | Added |

## Explicitly not in ZCO-4

| Item | Posture |
| -------------------------------- | ---------------------------------------- |
| Hardware scan / WMI / SNMP | **Forbidden** |
| Shell, BIOS, drivers, benchmarks | **Forbidden** |
| Fan/clock/voltage control | **Forbidden** |
| Live telemetry claims | **Forbidden** |
| Intake validator script | Deferred (ZCO-5 proposal) |
| Operator inventory in repo | **Local gitignored only** when chartered |

## Acceptance

- [x] Policy states MUST NOT / MUST for intake
- [x] Schema documents inventory, cluster, upgrade path shapes
- [x] Examples include AI workstation, NAS_WAIT, recycle candidate
- [x] Arelium + OMNISWARM ZCO-4 roles documented (advisory)
- [x] `unified_motherboard_claim_allowed: false` in cluster example

## Verification

```bash
npm run verify:md
node -e "JSON.parse(require('fs').readFileSync('data/examples/zco_hardware_inventory.example.json')); JSON.parse(require('fs').readFileSync('data/examples/zco_multi_node_cluster.example.json')); JSON.parse(require('fs').readFileSync('data/examples/zco_upgrade_path.example.json')); console.log('zco4 examples ok')"
npm run z:compute:organism
```

## Verification evidence (2026-05-21)

| Check | Result |
| ------------------------------ | ------------------------------------------------------------------ |
| Example JSON parse | **ok** |
| `markdownlint-cli2` ZCO-4 docs | **0** errors |
| `npm run verify:md` | exit **0** |
| `npm run z:compute:organism` | exit **0** (ZCO-2 unchanged — intake examples not in observer yet) |
| Runtime/hardware scripts added | **None** |

## Rollback

Remove ZCO-4 docs and three example JSON files; revert architecture roadmap line. Run `npm run verify:md`.

## Next lane

**ZCO-5** sealed — see [PHASE_ZCO_5_GREEN_RECEIPT.md](PHASE_ZCO_5_GREEN_RECEIPT.md) (`npm run z:compute:intake`).

## Locked law

```text
ZCO-4 = human-declared inventory doctrine.
Intake ≠ scan.
Upgrade path ≠ install.
AMK-Goku owns sacred moves.
```
