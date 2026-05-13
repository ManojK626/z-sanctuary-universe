# AMK AI Team Sync Report

- Overall signal: **BLUE**
- Registry mode: read_only_indicator_and_decision_routing
- Generated: 2026-05-07T20:41:10.802Z
- Phase 1: **no automatic indicator JSON edits** (read-only proposals).

## Indicator / package / reports

- Indicator rows scanned: 47
- Report files present (12): z_mod_dist_report.json, z_xbus_connector_gate_report.json, z_sec_triplecheck_report.json, z_pattern_safe_report.json, z_replica_fabric_report.json, z_ultra_mage_formula_report.json, z_ide_fusion_report.json, z_mu_truth_report.json…
- Report files missing (hints): (none)
- npm script amk:ai-sync present: **true**

### Indicator advisory (non-blocking)

## Registry validation

- PASS: schema matches v1.
- PASS: mode is read_only_indicator_and_decision_routing.
- PASS: ai_teams populated.
- PASS: routing_rules count: 14.
- PASS: indicator_sync_checks present.
- PASS: decision_packet_schema present.

## Samples → decision packets

### amk_ai_sync_hypothetical_module_no_indicator

- Signal: **YELLOW**
- Rule: route_dashboard_indicator
- Reason: Hypothetical or new slice missing indicator row — propose JSON row + receipt; do not auto-write in Phase 1.

Decision packet:

```json
{
  "decision_id": "amk_ai_sync_amk_ai_sync_hypothetical_module_no_indicator",
  "topic": "amk_ai_sync_hypothetical_module_no_indicator: Register hypothetical engine Z_HYPOTHETICAL_UNREGISTERED_ENGINE_99 in hub doctrine",
  "recommended_ai_team": "amk_indicator_team",
  "supporting_checks": ["npm run dashboard:registry-verify"],
  "signal": "YELLOW",
  "why": "Hypothetical or new slice missing indicator row — propose JSON row + receipt; do not auto-write in Phase 1.",
  "safe_next_action": "Proceed with docs/validators only; widen scope via MOD-DIST + indicator checklist if needed.",
  "forbidden_actions": ["fabricate_green_overlay"],
  "amk_decision_required": false
}
```

### amk_ai_sync_external_api_blueprint

- Signal: **BLUE**
- Rule: route_external_connector
- Reason: rule route_external_connector; hits: external api, webhook

Decision packet:

```json
{
  "decision_id": "amk_ai_sync_amk_ai_sync_external_api_blueprint",
  "topic": "amk_ai_sync_external_api_blueprint: External OAuth + webhook for partner CRM",
  "recommended_ai_team": "z_xbus_team",
  "supporting_checks": ["npm run z:xbus:gate", "npm run z:sec:triplecheck"],
  "signal": "BLUE",
  "why": "rule route_external_connector; hits: external api, webhook",
  "safe_next_action": "Draft charter scope + receipts; mock metadata only unless AMK opens execution lane.",
  "forbidden_actions": ["live_api_call", "secret_write", "customer_data_flow"],
  "amk_decision_required": true
}
```

### amk_ai_sync_pattern_prediction_feature

- Signal: **BLUE**
- Rule: route_pattern_prediction
- Reason: rule route_pattern_prediction; hits: pattern engine

Decision packet:

```json
{
  "decision_id": "amk_ai_sync_amk_ai_sync_pattern_prediction_feature",
  "topic": "amk_ai_sync_pattern_prediction_feature: Uncertainty dashboard for XL2 prediction-game metaphor",
  "recommended_ai_team": "z_pattern_safe_team",
  "supporting_checks": ["npm run z:pattern:safe", "npm run z:mod:dist"],
  "signal": "BLUE",
  "why": "rule route_pattern_prediction; hits: pattern engine",
  "safe_next_action": "Draft charter scope + receipts; mock metadata only unless AMK opens execution lane.",
  "forbidden_actions": ["gambling_instruction_export", "guaranteed_prediction_claim"],
  "amk_decision_required": true
}
```

### amk_ai_sync_civic_claim

- Signal: **BLUE**
- Rule: route_civic_mu
- Reason: rule route_civic_mu; hits: mauritius, civic claim, z-mu

Decision packet:

```json
{
  "decision_id": "amk_ai_sync_amk_ai_sync_civic_claim",
  "topic": "amk_ai_sync_civic_claim: New civic ledger row wording",
  "recommended_ai_team": "z_mu_truth_team",
  "supporting_checks": ["npm run z:mu:truth", "npm run z:mu:advisor"],
  "signal": "BLUE",
  "why": "rule route_civic_mu; hits: mauritius, civic claim, z-mu",
  "safe_next_action": "Draft charter scope + receipts; mock metadata only unless AMK opens execution lane.",
  "forbidden_actions": ["protest_coordination_platform", "mass_messaging"],
  "amk_decision_required": true
}
```

### amk_ai_sync_replica_reviewer

- Signal: **BLUE**
- Rule: route_replica_minibot
- Reason: rule route_replica_minibot; hits: replica, reviewer bot

Decision packet:

```json
{
  "decision_id": "amk_ai_sync_amk_ai_sync_replica_reviewer",
  "topic": "amk_ai_sync_replica_reviewer: Task-scoped reviewer bot for PR summaries",
  "recommended_ai_team": "z_replica_fabric_team",
  "supporting_checks": ["npm run z:replica:fabric"],
  "signal": "BLUE",
  "why": "rule route_replica_minibot; hits: replica, reviewer bot",
  "safe_next_action": "Draft charter scope + receipts; mock metadata only unless AMK opens execution lane.",
  "forbidden_actions": ["autonomous_agent_runtime", "live_bridge_without_charter"],
  "amk_decision_required": true
}
```

### amk_ai_sync_dashboard_polish

- Signal: **GREEN**
- Rule: route_dashboard_indicator
- Reason: UI/copy polish scoped to posture chips —no new execution lanes; advisory-only.

Decision packet:

```json
{
  "decision_id": "amk_ai_sync_amk_ai_sync_dashboard_polish",
  "topic": "amk_ai_sync_dashboard_polish: Indicator card spacing and copy",
  "recommended_ai_team": "amk_indicator_team",
  "supporting_checks": ["npm run dashboard:registry-verify"],
  "signal": "GREEN",
  "why": "UI/copy polish scoped to posture chips —no new execution lanes; advisory-only.",
  "safe_next_action": "Proceed with docs/validators only; widen scope via MOD-DIST + indicator checklist if needed.",
  "forbidden_actions": ["fabricate_green_overlay"],
  "amk_decision_required": false
}
```

## Locked law

- Indicator sync ≠ auto-edit.
- AI team routing ≠ authority.
- Decision packet ≠ permission.
- Personal AI summary ≠ sacred approval.
- GREEN ≠ deploy.
- BLUE requires AMK.
- RED blocks movement.
- AMK-Goku owns sacred moves.
