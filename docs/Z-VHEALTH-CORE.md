# Z-VHealth Core

**Z-VHealth** = **Virtual Health + Vital Health + Verification Health** — a **predictive health intelligence layer** for the full Z-Sanctuary ecosystem.

> Z-VHealth = predictive health intelligence for the Z-Sanctuary stack (advisory, observer-first).

## Role (not a second authority)

| Layer | Role |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Main hub** | Authority, execution, dashboard, release truth |
| **Z-VHealth** | Shadow health intelligence: prediction, preparation, **challenge suggestions** — a “doctor + coach + future-risk mirror” for the stack |

Z-VHealth does **not** override Overseer, release gates, or execution enforcer. It **recommends**; humans and the main hub **approve and execute**.

## Safe wording

Prefer: **self-observing**, **self-preparing**, **self-recommending**, **self-challenging**, **human-approved execution**.
Avoid claiming the stack “self-automates” in a way that implies unsupervised file or policy changes.

**Boundaries (Phase 1+):** Z-VHealth may recommend actions, prepare plan text, and suggest challenge tasks. It **must not** modify source files, release gates, storage layout, or security settings without **human/Overseer** approval. Phase 1 **only** reads existing reports and writes the VHealth report files.

## What it watches (inputs)

When present, reports under `data/reports/` are read, including (not exhaustive):

- `zuno_system_state_report.json` — hub verify, signal, coherence summaries
- `z_qosmei_core_signal.json`
- `z_system_coherence.json`
- `z_adaptive_coherence.json`
- `z_communication_health.json`
- `z_bot_guardian.json`, `z_bot_alerts.json`
- `z_fpsmc_storage_map.json`
- `z_vdk_scan_report.json`
- `z_prediction_validation.json`
- `z_release_gate_summary.json`

Optional: VDK human reviews (`z_vdk_findings_review_*.md`) are not parsed in Phase 1; point to them from challenges when VDK has findings.

## Outputs

| File | Purpose |
| ----------------------------------------- | ------------------------------------------------------------------------- |
| `data/reports/z_vhealth_core_report.json` | Machine-readable score, posture, risks, challenge queue, preparation plan |
| `data/reports/z_vhealth_core_report.md` | Human-readable summary |

## Posture bands (from score)

| Score | Posture |
| ------- | --------- |
| 90–100 | `strong` |
| 75–89 | `watch` |
| 50–74 | `caution` |
| &lt; 50 | `hold` |

## npm

```bash
npm run vhealth:report
```

Run after refreshing upstream reports (e.g. `npm run zuno:state`, `fpsmc:scan`, `vdk:scan`) for a current picture.

## DRP-style alignment

Z-VHealth answers: what is healthy now, what is weakening, what may fail next, what to prepare, and what **small, safe challenge** would improve the system — with **human gate** on all execution.

---

_Z-VHealth Core — daily immune intelligence for the ecosystem, not a ruler._
