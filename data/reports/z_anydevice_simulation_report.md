# Z-AnyDevice synthetic simulation report

- **Generated:** 2026-05-12T18:06:23.454Z
- **Schema:** `z_anydevice_simulation_report_v1`

## Law

Synthetic simulation only. No real device scanning, no antivirus claims, no network probing, no drivers, no secrets, no Cloudflare production changes, no NAS writes.

## Simulations (7 devices)

| device_id | ecosystem_role | trusted_status | risk_signal | blocked | required_human_gate |
| --------- | -------------- | -------------- | ----------- | ------- | ------------------- |
| ssws_prime_node | z_ssws_cockpit_node | GREEN | GREEN | no | none_for_declared_read_only_role |
| z_lab_background_node | z_lab_supervised_analysis_node | YELLOW | YELLOW | no | human_review_before_expansion |
| cloudflare_preview_edge | cloudflare_preview_controller | BLUE | BLUE | no | amk_governance_decision |
| nas_cold_mirror_candidate | nas_cold_mirror_candidate | NAS_WAIT | YELLOW | no | mount_and_operator_verify_nas |
| unknown_usb_device | quarantine_unknown_device | QUARANTINE | RED | yes | remediation_or_disposal_amk |
| dashboard_display_node | dashboard_display_node | GREEN | GREEN | no | none_for_declared_read_only_role |
| local_ai_inference_node | local_ai_inference_node | YELLOW | YELLOW | no | human_review_before_expansion |

## Recommended actions (summary)

- **ssws_prime_node:** ALLOWED: GREEN — use only within declared ecosystem_role and read-only hub doctrine; do not exceed charter.
- **z_lab_background_node:** REVIEW_REQUIRED: YELLOW — human review before role expansion, exports, or new integration surfaces.
- **cloudflare_preview_edge:** AMK_DECISION: BLUE — governance sequencing; preview/docs posture only until AMK-Goku clears expansion.
- **nas_cold_mirror_candidate:** HOLD: NAS_WAIT — mount and operator-verify before any NAS or cold-mirror class action; no NAS writes from simulation.
- **unknown_usb_device:** BLOCK: RED or QUARANTINE — no sensitive hub workflows; no auto-connect; treat as untrusted until reclassified.
- **dashboard_display_node:** ALLOWED: GREEN — use only within declared ecosystem_role and read-only hub doctrine; do not exceed charter.
- **local_ai_inference_node:** REVIEW_REQUIRED: YELLOW — human review before role expansion, exports, or new integration surfaces.

---

Full JSON: `data/reports/z_anydevice_simulation_report.json`
