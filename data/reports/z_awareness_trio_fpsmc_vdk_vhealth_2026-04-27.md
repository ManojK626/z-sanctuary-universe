# Awareness trio handoff — FPSMC · VDK · VHealth

**Date:** 2026-04-27
**Role:** Stable receipt of the three **advisory, read-only** layers now echoed in `zuno_system_state_report` (narrative + JSON).
**This document is not a release record** — it does not replace `z_release_gate_summary`, execution enforcer, or human approval.

---

## Safety boundaries (all three)

| Property | Meaning |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| **Advisory only** | Suggests attention; does not change policy or code by itself. |
| **Read-only (Phase 1)** | Scans and reports only; no delete, no move, no quarantine automation. |
| **Non-gating** | Does not block merge, release, or verify pipelines unless you wire them there explicitly. |
| **Non-destructive** | No registry edits, no process kill, no Defender changes, no uploads. |
| **Human-reviewed** | Operator/Overseer interprets findings; Zuno shows **visibility**, not **authority**. |

---

## Z-FPSMC — storage awareness

| Field | Snapshot (as of report below) |
| ------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Safety string** | `READ_ONLY_PHASE1_NO_DELETE_NO_MOVE` |
| **Report** | `data/reports/z_fpsmc_storage_map.json` · `data/reports/z_fpsmc_storage_map.md` |
| **Generated (UTC)** | 2026-04-27T17:36:02.1044488Z |
| **Fixed drives** | 1 (C: — about **767 GiB** free of **~952 GiB** total; see JSON for exact bytes) |
| **PC-root project roots** | 13 known paths in map |
| **Container / Docker** | Read-only presence notes; `docker volume ls` may show exit errors if daemon offline (observability only) |
| **Warnings** | 0 |

**Doc:** `docs` tree — see Z-FPSMC doc referenced from `z_fpsmc_storage_map` report and Master Register as applicable.

---

## Z-VDK — security scan awareness (Phase 1)

| Field | Snapshot |
| ------------------------- | --------------------------------------------------------------------------- |
| **Safety string** | `READ_ONLY_PHASE1_NO_DELETE_NO_KILL` |
| **Report** | `data/reports/z_vdk_scan_report.json` · `data/reports/z_vdk_scan_report.md` |
| **Generated (UTC)** | 2026-04-27T19:18:00.4449563Z |
| **Files scanned** | 8849 |
| **Findings** | 13 total · critical **0** · high **2** · medium **11** · low **0** |
| **Scan roots (examples)** | Hub repo, `Extras & Tools`, user `Downloads` (depth-limited) |
| **Human review** | `data/reports/z_vdk_findings_review_2026-04-27.md` |

**Doc:** `docs/Z-VDK-VIRUS-DETECTION-QUARANTINE-CORE.md`

---

## Z-VHealth — predictive health + challenge coach

| Field | Snapshot |
| ------------------------- | ----------------------------------------------------------------------------------- |
| **Report** | `data/reports/z_vhealth_core_report.json` · `data/reports/z_vhealth_core_report.md` |
| **Generated (UTC)** | 2026-04-27T20:03:29.091Z |
| **Posture** | `caution` |
| **Health score** | 70 / 100 |
| **Future risk** | `medium` |
| **Top challenge (title)** | Signal + coherence refresh |
| **Authority** | `advisory_only_no_auto_execution` |

**Doc:** `docs/Z-VHEALTH-CORE.md`

---

## Zuno echo (where the trio appears)

After `npm run zuno:state`, the live state report includes:

- `fpsmc_storage` — drive/root/warning summary
- `vdk_security` — safety, counts, optional `review_report` path
- `vhealth_core` — posture, score, future risk, top challenge, authority

**Reports:** `data/reports/zuno_system_state_report.json` · `data/reports/zuno_system_state_report.md`

---

## Refresh commands (operator)

| Layer | Regenerate | Optional markdown |
| -------------------------- | -------------------------- | -------------------------------------------------------------- |
| **FPSMC** | `npm run fpsmc:scan` | `npm run fpsmc:report` |
| **VDK** | `npm run vdk:scan` | `npm run vdk:report` |
| **VHealth** | `npm run vhealth:report` | (built-in `.md` from script) |
| **Zuno** | `npm run zuno:state` | `npm run zuno:state:archive` (add `-- --force` if date exists) |
| **Signal (7d log counts)** | `npm run ai:signal:health` | — |

Typical “full awareness refresh” (order flexible):

```bash
npm run fpsmc:scan
npm run vdk:scan
npm run vhealth:report
npm run zuno:state
```

---

## Not release gates

This trio **does not**:

- satisfy or replace **release governance**, `z_release_gate_summary`, or **execution enforcer** output
- imply **GO** / **HOLD** for shipping
- override **Z-Super Overseer** or **Z-EAII** authority

It **does** give the operator a **single place in Zuno** to see **storage + security scan posture + health/challenge** in one read — **clarity without aggression**.

---

_Z-Sanctuary — self-aware, controlled, human-steered._
