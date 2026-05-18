# Z-MU Civic Knowledge Advisor Report

- Signal: **BLUE**
- Mode: advisor_framework_only
- Timestamp: 2026-05-07T20:21:28.267Z

## Policy / template checks

- PASS: mode is advisor_framework_only.
- PASS: no_live_ai_provider is true.
- PASS: no_public_launch is true.
- PASS: no_user_memory is true.
- PASS: no_personal_data_collection is true.
- PASS: no_legal_advice_claim is true.
- PASS: no_government_impersonation is true.
- PASS: no_protest_coordination is true.
- PASS: no_harassment_or_doxxing is true.
- PASS: no_illegal_leak_guidance is true.
- PASS: no_ethnic_or_religious_blame is true.
- PASS: required_answer_labels complete.
- PASS: allowed_modes populated.
- PASS: forbidden_user_message_substrings present.
- PASS: templates count: 8.

## Sample question classifications

### mu_q_proc_ministry_010

- Signal: **GREEN**
- Mode: learn_governance
- Notes: procedural / educational framing

### mu_q_checklist_docs_011

- Signal: **GREEN**
- Mode: evidence_checklist
- Notes: procedural / educational framing

### mu_q_claim_wage_uncited_012

- Signal: **YELLOW**
- Mode: claim_checker
- Notes: public claim requires citation — needs_citation truth path

### mu_q_sensitive_review_013

- Signal: **BLUE**
- Mode: understand_my_situation
- Notes: human/legal/ethics review required for this prompt shape

### mu_q_policy_scenario_014

- Signal: **GREEN**
- Mode: policy_explainer
- Notes: policy scenario OK if labeled not prediction

## Summary

{
"green": 3,
"yellow": 1,
"blue": 1,
"red": 0
}

## Locked law

- Civic advisor is not government authority.
- Explanation is not legal advice.
- Source link is not proof.
- Answer log is not surveillance.
- User question is not consent to store personal data.
- GREEN is not public launch.
- BLUE requires human/legal/ethics review.
- RED blocks movement.
- AMK-Goku owns sacred moves.
