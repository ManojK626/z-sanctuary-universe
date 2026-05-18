# Z-Pattern Safe Governance Report

- Signal: **BLUE**
- Mode: pattern_governance_only
- Timestamp: 2026-05-07T20:41:11.799Z

## Registry checks

- PASS: schema matches registry v1.
- PASS: mode is pattern_governance_only.
- PASS: registry_name present.
- PASS: allowed_domains populated.
- PASS: gated_domains populated.
- PASS: forbidden_claims list present.
- PASS: no forbidden_claim_paths_enabled (correct for Phase 1).
- PASS: high_risk_runtime_flags all false.
- PASS: signal_rules has GREEN/YELLOW/BLUE/RED.

## Sample classifications

### ps_numen_pattern_literacy_001

- Signal: **GREEN**
- Domain: education_pattern_literacy
- Notes: allowed domain education_pattern_literacy — educate/simulate/report framing

### ps_logical_brains_pathway_002

- Signal: **GREEN**
- Domain: learning_pathway_planning
- Notes: allowed domain learning_pathway_planning — educate/simulate/report framing

### ps_mu_claim_shape_003

- Signal: **GREEN**
- Domain: civic_claim_classification
- Notes: allowed domain civic_claim_classification — educate/simulate/report framing

### ps_dashboard_signals_004

- Signal: **GREEN**
- Domain: dashboard_signal_analysis
- Notes: allowed domain dashboard_signal_analysis — educate/simulate/report framing

### ps_ambiguous_dashboard_005

- Signal: **YELLOW**
- Domain: uncertainty_simulation
- Notes: simulation vocabulary without evidence pack attached

### ps_xbus_live_api_future_006

- Signal: **BLUE**
- Domain: live_external_api
- Notes: gated domain: live_external_api — AMK/human gate before outward claim

### ps_gamble_uncertainty_lab_007

- Signal: **BLUE**
- Domain: gambling_related_prediction
- Notes: gated domain: gambling_related_prediction — AMK/human gate before outward claim

### ps_spending_limits_edu_008

- Signal: **BLUE**
- Domain: bankroll_or_money_management
- Notes: gated domain: bankroll_or_money_management — AMK/human gate before outward claim

## Summary

{
  "green": 4,
  "yellow": 1,
  "blue": 3,
  "red": 0
}

## Locked law

- Pattern ≠ prediction certainty.
- Simulation ≠ betting advice.
- Confidence score ≠ guarantee.
- Bankroll math ≠ financial advice.
- Game pattern ≠ casino edge.
- GREEN ≠ deploy.
- BLUE requires AMK.
- RED blocks movement.
- AMK-Goku owns sacred moves.
