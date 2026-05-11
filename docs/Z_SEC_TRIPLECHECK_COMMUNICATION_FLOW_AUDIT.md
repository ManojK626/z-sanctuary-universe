# Z-SEC-TRIPLECHECK-1 — Communication Flow + Safety Drift Audit

**Purpose:** run a calm, read-only triple-check over path safety, report alignment, IDE fusion evidence, indicator consistency, and forbidden-lane posture before opening new build lanes.

## Scope

- policy JSON
- read-only validator script
- JSON/MD audit reports
- indicator metadata

No executor behavior is introduced.

## What it audits

1. Path/root safety (`.cursor/projects` misuse, archive package init risk).
2. Communication flow alignment (fusion, traffic, key reports).
3. Report drift (missing/stale/contradictory posture).
4. Project identity drift wording (Franed/Lumina/XL2 boundary checks).
5. Forbidden-lane signals (deploy/billing/secrets/provider/bridge/child-data/voice-camera-gps).

## External alignment note

This phase follows secure-by-design and risk-driven maturity principles:

- secure-by-design posture
- secure-development evidence checks
- maturity by measured drift reduction, not feature rush

## Relation to existing layers

- [AMK_AI_TEAM_INDICATOR_SYNC_ROUTER.md](AMK_AI_TEAM_INDICATOR_SYNC_ROUTER.md) — **`npm run amk:ai-sync`** emits packets that often recommend **Z-SEC Triplecheck** when forbidden-lane cues appear alongside connector or sacred-move language.

- [Z_AI_FUSION_CAPABILITY_MAP.md](Z_AI_FUSION_CAPABILITY_MAP.md) — **`npm run z:ai:fusion-map`** warns when overlaps might blur forbidden lanes (`RED_BLOCKED` cases).

- [VS_FALLBACK_1_VSCODE_OPERATING_MODE.md](VS_FALLBACK_1_VSCODE_OPERATING_MODE.md)
- [Z_IDE_FUSION_WORKFLOW_CONTROL.md](Z_IDE_FUSION_WORKFLOW_CONTROL.md)
- [Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md](Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md)
- [Z_TRAFFIC_MINIBOTS.md](Z_TRAFFIC_MINIBOTS.md)
- [Z_SSWS_WORKSPACE_SPINE.md](Z_SSWS_WORKSPACE_SPINE.md)
- [AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md](AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md)
- [Z_AUTONOMOUS_GUARDIAN_LOOP.md](Z_AUTONOMOUS_GUARDIAN_LOOP.md)
- [Z_LOGICAL_BRAINS_HUB_REFERENCE.md](Z_LOGICAL_BRAINS_HUB_REFERENCE.md)
- [Z_NUMEN_HUB_REFERENCE.md](Z_NUMEN_HUB_REFERENCE.md)
- [Z_MOD_DIST_MODULE_DISTRIBUTOR.md](Z_MOD_DIST_MODULE_DISTRIBUTOR.md)
- [Z_XBUS_EXTERNAL_CONNECTOR_GATE.md](Z_XBUS_EXTERNAL_CONNECTOR_GATE.md)
- [Z_REPLICA_FABRIC_GOVERNED_SELF_REPLICATION.md](Z_REPLICA_FABRIC_GOVERNED_SELF_REPLICATION.md)
- [Z_ULTRA_MAGE_FORMULA_CODEX.md](Z_ULTRA_MAGE_FORMULA_CODEX.md)
- [Z_CADENCE_REAL_CYCLE_RUNNER.md](Z_CADENCE_REAL_CYCLE_RUNNER.md)
- [Z_LEGAL_OPS_SAFETY_AND_BOUNDARY_POLICY.md](Z_LEGAL_OPS_SAFETY_AND_BOUNDARY_POLICY.md)
- [Z_LEGAL_PRODUCT_SAFETY_AND_IP_POLICY.md](Z_LEGAL_PRODUCT_SAFETY_AND_IP_POLICY.md)

## Command

```bash
npm run z:sec:triplecheck
```

## Locked law

```text
Triple-check ≠ execution.
Mr Bug suggestion ≠ permission.
Auto-fix is docs-hygiene only.
Security fix requires AMK.
GREEN ≠ deploy.
BLUE requires AMK.
RED blocks movement.
AMK-Goku owns sacred moves.
```
