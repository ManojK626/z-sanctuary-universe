# Zuno awareness score (A3)

**Generated:** 2026-05-03T15:52:29.702Z

| Field | Value |
| ---- | ---- |
| **Band** | **RED** |
| Score | 10 |
| Dominant drivers | z_traffic_RED; a2a_temporal_deltas_present; a2b_truth_layer_YELLOW |

## Band meanings

| Band | Meaning |
| ---- | ------- |
| GREEN | Stable, aligned, no blocking drift. |
| YELLOW | Known drift, symbolic gaps, optional baseline missing, or advisory minibots. |
| BLUE | Human / AMK decision required before treating posture as proceed. |
| RED | Broken required evidence (e.g. registry or snapshot integrity failed). |

## Signals (summary)

| Source | Summary |
| ---- | ---- |
| Monster registry verify | {"script_exit_code":0,"receipt_pass":true,"receipt_path":"data/reports/z_monster_project_registry_verify.json"} |
| Snapshot ingest | {"snapshot_present":true,"truth_alignment_ref_ok":true,"snapshot_id":"ZUNO_SNAPSHOT_2026_05_03"} |
| A2a temporal | {"script_exit_code":0,"status":"ok","baseline_path":"data/zuno_state_snapshot.baseline.json","summary":{"added":1,"removed":0,"changed":1,"non_claim_changed":0,"posture_changed":0},"note":null} |
| A2b truth layer | {"script_exit_code":0,"status":"YELLOW","echo_in_sync":true,"narrative_missing_count":23} |
| Z-Traffic chief | {"script_exit_code":1,"overall_signal":"RED","human_decision_required":false} |
| Non-claims | {"band":"GREEN"} |
| Posture language | {"band":"GREEN"} |

## Rationale

- z_traffic_RED
- a2a_temporal_deltas_present
- a2b_truth_layer_YELLOW

---

*Read-only receipt — no auto-fix or phase advancement.*
