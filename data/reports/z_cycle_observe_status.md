# Z-Cycle observe status

**Generated:** 2026-05-12T19:20:42.534Z
**Schema:** `z_cycle_observe_status_v1`

## Law

Observation tower only. Suggests and classifies; does not execute the task queue.

## Ecosystem stage

- **id:** governed_organism_foundation
- **label:** Governed organism foundation

## Latest report signals

```json
{
  "z_traffic_minibots_status": {
    "overall_signal": null,
    "ok": null
  },
  "z_car2_similarity_report": {
    "ok": null,
    "files_scanned": null
  },
  "z_crystal_dna_drift_report": {
    "overall_signal": "BLUE",
    "findings_count": 3
  },
  "z_anydevice_simulation_report": {
    "simulations": 7,
    "warnings": 0
  }
}
```

## Coverage (registry-only)

- Crystal shards: **8** (manifest ok: true)
- Doorway entries: **5**
- Satellites: **2**
- Synthetic devices: **7**

## Observer rollup signal: **BLUE**

## Task queue (do not auto-execute)

| task_id | category | signal | requires_human |
| ------------------------------------ | ---------------------------- | --------- | -------------- |
| observe_reread_cycle_report | L1_READ_ONLY_OBSERVE | GREEN | no |
| refresh_verify_md | L2_REPORT_REFRESH | GREEN | no |
| refresh_traffic_minibots | L2_REPORT_REFRESH | UNKNOWN | no |
| refresh_car2_similarity | L2_REPORT_REFRESH | GREEN | no |
| refresh_crystal_dna_drift | L2_REPORT_REFRESH | BLUE | no |
| refresh_anydevice_simulation | L2_REPORT_REFRESH | GREEN | no |
| proposal_review_crystal_topology | L3_DOC_SYNC_PROPOSAL | BLUE | yes |
| proposal_triage_traffic_signal | L3_DOC_SYNC_PROPOSAL | UNDEFINED | yes |
| apply_control_links_after_review | L4_HUMAN_APPROVED_APPLY | BLUE | yes |
| forbidden_autonomous_deploy | L5_FORBIDDEN_WITHOUT_CHARTER | RED | yes |
| forbidden_nas_mutation_from_observer | L5_FORBIDDEN_WITHOUT_CHARTER | RED | yes |

Full JSON: `data/reports/z_cycle_observe_status.json`
