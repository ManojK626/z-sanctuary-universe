# Z-VHealth Core — health intelligence (Phase 1)

**Generated (UTC):** 2026-04-27T20:03:29.091Z
**Posture:** `caution` · **Health score:** **70** / 100 · **Future risk:** **medium**
**Authority:** `advisory_only_no_auto_execution`

## Top risk (summary)

Learning/signal health is low — add real task log / signal before scaling work.

## Top risks (list)

- Learning/signal health is low — add real task log / signal before scaling work.
- System coherence misaligned — layers disagree; resolve signal vs structure.
- Z-VDK: 2 high-severity path(s) (often Downloads installers) — confirm origin.

## Recommended challenge

- **id:** `signal_coherence_refresh`
- **title:** Signal + coherence refresh
- **reason:** Coherence or signal reports show strain — strengthen real log lines and refresh scans.
- **safe action:** `Append task JSONL entries, then npm run zuno:state`

## Challenge queue

### signal_coherence_refresh

- **difficulty:** medium
- **reward:** coherence + signal alignment
- **why:** Coherence or signal reports show strain — strengthen real log lines and refresh scans.
- **safe command:** `Append task JSONL entries, then npm run zuno:state`

### vdk_calm_review

- **difficulty:** easy
- **reward:** VDK confidence +10
- **why:** VDK has multiple findings — review the latest findings report; no quarantine in Phase 1.
- **safe command:** `Read data/reports/z_vdk_findings_review_*.md and z_vdk_scan_report.json`

### freshness_challenge

- **difficulty:** easy
- **reward:** observer freshness
- **why:** Keep AAFRTC + comms manifests in window for clear cross-layer reads.
- **safe command:** `node scripts/z_aafrtc_resolve.mjs  # then npm run comms:github-ai as needed`

## Preparation plan

- npm run zuno:state
- npm run vhealth:report
- If VDK age is stale: npm run vdk:scan && npm run vdk:report
- If storage unknown: npm run fpsmc:scan && npm run fpsmc:report
- Archive Zuno if desired: npm run zuno:state:archive -- --force

## Inputs read (presence)

- `zuno_system_state_report.json`: yes
- `z_qosmei_core_signal.json`: yes
- `z_system_coherence.json`: yes
- `z_adaptive_coherence.json`: yes
- `z_communication_health.json`: yes
- `z_bot_guardian.json`: yes
- `z_bot_alerts.json`: yes
- `z_fpsmc_storage_map.json`: yes
- `z_vdk_scan_report.json`: yes
- `z_prediction_validation.json`: yes
- `z_release_gate_summary.json`: yes
- `z_execution_enforcer.json (optional)`: yes

---

Read-only advisory layer. Does not modify source, gates, or security policy. See [docs/Z-VHEALTH-CORE.md](../docs/Z-VHEALTH-CORE.md).
