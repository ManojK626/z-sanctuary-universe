# Z-PAPAO precaution brief (advisory emit)

**Generated:** 2026-04-23T17:17:57.366Z
**Schema:** 1.0
**Governance:** Advisory pre-alert brief only — Z-PAPAO does not execute actions, crawl the web, or read vault payloads.

## Pre-alerts

- **MEDIUM** [STRUCTURAL_MODULE_WARN]: Structural health: 0 critical, 2 warning module(s) — inspect z_system_health before heavy deploy.
  - Citation: `data/reports/z_system_health.json`
- **HIGH** [COMMS_DEGRADED]: Communication flow is degraded or needs attention — refresh comms manifests and AAFRTC before high-risk work.
  - Citation: `data/reports/z_communication_health.json`
- **HIGH** [COHERENCE_MISALIGNED]: System coherence is misaligned or low — review contradictions in coherence report before promoting changes.
  - Citation: `data/reports/z_system_coherence.json`
- **MEDIUM** [CONSISTENCY_WATCH]: Consistency alerts present — resolve or consciously accept before large refactors.
  - Citation: `data/reports/z_ai_consistency_alerts.json`
- **MEDIUM** [SIGNAL_LOW]: Activity signal is low — outcomes and learning layers may be underfed.
  - Citation: `data/reports/z_ai_signal_health.json`
- **HIGH** [ADAPTIVE_RISK_HIGH]: Adaptive coherence predicts elevated risk — follow top recommended actions in that report.
  - Citation: `data/reports/z_adaptive_coherence.json`

## Precautions

- Do not automate or bypass Cursor approval UIs (Allowlist, Run, Approve terminal) — use tasks, dashboards, and slash rituals per hub boundary.
  - Data: `data/z_visual_automation_boundary.json` · Doc: `docs/Z-AI-VISUAL-OVERLAY-CURSOR-APPROVALS-RESEARCH.md`
- When unsure about authority or repo ownership, read Hierarchy Chief before cross-project edits.
  - Data: `docs/Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md`
- Run npm run ecosystem:status-emit after registry edits to refresh on-disk path visibility.
  - Data: `data/z_pc_root_projects.json`
- Run Phase COMMS from Z-NEXT roadmap: comms:github-ai, comms:cloudflare-ai, z_aafrtc_resolve.mjs.
  - Data: `docs/Z-NEXT-ROADMAP-CURSOR-AUTO.md`
- Prefer Playbook A (FEED) and a fresh garage scan after adding real learning events.
  - Data: `docs/Z-NEXT-ROADMAP-CURSOR-AUTO.md`

## Meta

- **Sources read:** 9 path(s)
- **Machine-readable:** `data/reports/z_papao_precaution_brief.json`

Design: [docs/Z-PAPAO-DESIGN.md](docs/Z-PAPAO-DESIGN.md)

_Advisory only — Z-PAPAO does not approve releases or override Overseer / DRP._
