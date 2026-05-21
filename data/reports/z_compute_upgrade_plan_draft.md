# Z-Compute upgrade plan draft (ZCO-6)

```text
ZCO UPGRADE PLAN DRAFT (ADVISORY)
---------------------------------
Mode: Turtle / Advice-only
Runtime orchestration: CLOSED
Hardware control: DISABLED
Purchase links: DISABLED
Price quotes: DISABLED
Install authority: AMK_HUMAN_ONLY
Intake signal: YELLOW
Draft signal: YELLOW
Blocked: false
Phases drafted: 12
```

**Generated:** 2026-05-21T21:23:35.297Z

Advisory upgrade-plan draft only. No purchase links, prices, scan, shell, network, or install authority.

This draft is educational governance output only. AMK-Goku approves acquire, wiring, power-on, and install. GREEN ≠ permission to buy or deploy.

## Limitations

- Intake validation YELLOW — suggestions may be incomplete until operator clarifies sparse fields.
- YELLOW upgrade_plan_sparse: inventory[2]: upgrade_goals without constraints/receipts_note

## Node advisories

### z-node-001 (ai_workstation)



- **assess** [#1] Review declared PSU (1200 W) vs GPU+CPU load on z-node-001; confirm cooling notes before any acquire phase — signal **GREEN**, AMK gate: **false**, PowerBot
- **acquire** [#2] Declared goal (advisory): Optional second NVMe tier — AMK gate before acquire/install — signal **BLUE**, AMK gate: **true**, UpgradeBot
- **acquire** [#3] Declared goal (advisory): quieter case fans — AMK gate before acquire/install — signal **BLUE**, AMK gate: **true**, UpgradeBot
- **install** [#4] Physical install for z-node-001 changes — human only; no hub auto-install — signal **BLUE**, AMK gate: **true**, ThermalBot
- **validate** [#5] Update local inventory JSON for z-node-001; re-run npm run z:compute:intake and z:compute:upgrade-draft — signal **GREEN**, AMK gate: **false**, ExplainBot

### z-node-nas-01 (storage_nas)



- **assess** [#1] Review declared PSU (250 W) vs GPU+CPU load on z-node-nas-01; confirm cooling notes before any acquire phase — signal **GREEN**, AMK gate: **false**, PowerBot
- **prepare** [#2] Verify NAS mount and backup path for z-node-nas-01 before routing workloads (NAS_WAIT — human only) — signal **BLUE**, AMK gate: **true**, StorageBot
- **validate** [#3] Update local inventory JSON for z-node-nas-01; re-run npm run z:compute:intake and z:compute:upgrade-draft — signal **GREEN**, AMK gate: **false**, ExplainBot

### z-node-recycle-02 (recycle_dormant)

- _Note:_ Recycle/dormant node — revival requires separate AMK BLUE path before power-on
- _Note:_ z-node-recycle-02: sparse upgrade_goals — add constraints or receipts_note for fuller draft

- **assess** [#1] Review declared PSU (650 W) vs GPU+CPU load on z-node-recycle-02; confirm cooling notes before any acquire phase — signal **GREEN**, AMK gate: **false**, PowerBot
- **acquire** [#2] Declared goal (advisory): Revive as worker after AMK BLUE review — AMK gate before acquire/install — signal **BLUE**, AMK gate: **true**, UpgradeBot
- **install** [#3] Physical install for z-node-recycle-02 changes — human only; no hub auto-install — signal **BLUE**, AMK gate: **true**, ThermalBot
- **validate** [#4] Update local inventory JSON for z-node-recycle-02; re-run npm run z:compute:intake and z:compute:upgrade-draft — signal **GREEN**, AMK gate: **false**, ExplainBot

## Recycle opportunities

- **z-node-recycle-02** — Advisory: document reuse intent for z-node-recycle-02; PSU/thermal audit before revival (BLUE, AMK gate)

**Smallest safe next action:** Clarify YELLOW intake findings; treat acquire phases as AMK-gated hypotheses only.

Full JSON: `data/reports/z_compute_upgrade_plan_draft.json`
