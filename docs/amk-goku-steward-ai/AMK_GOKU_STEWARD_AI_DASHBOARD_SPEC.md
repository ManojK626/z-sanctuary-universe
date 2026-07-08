# AMK-Goku Steward AI — Dashboard Panel Spec

**System ID:** AMK-GOKU-STEWARD-AI-DASHBOARD-1  
**Date:** 2026-07-08  
**Posture:** Specification only · **no implementation in this charter**  
**Surface:** [AMK-Goku Main Control Dashboard](../AMK_GOKU_MAIN_CONTROL_DASHBOARD.md)

---

## Panel identity

**Section title:** `👤 AMK-Goku Steward AI`  
**Role:** Chief Human Steward Interface — executive summary, not control plane  
**Law:** No execute buttons · links and copy-only snippets only

---

## Purpose

One **executive summary** instead of opening many reports — while preserving:

> **AI advises. Governance protects. Humans decide.**

Steward panel **observes** Mission Control data. It does **not** bypass council or human gates.

---

## Proposed layout

```text
┌─────────────────────────────────────────────────────────┐
│ 👤 AMK-Goku Steward AI · Chief Human Steward Interface  │
│ Read-only · derived from hub reports                    │
├─────────────────────────────────────────────────────────┤
│ 🌍 Universe Status          │ 🏗️ Foundation Readiness   │
│ 🛡️ Governance Status        │ ❤️ Soulmates Readiness    │
├─────────────────────────────────────────────────────────┤
│ 🤖 AI Council Consensus (rollup · advisory)            │
├─────────────────────────────────────────────────────────┤
│ 📂 Project Priorities · 🐢 Turtle Mode · ⚠️ Human gates │
├─────────────────────────────────────────────────────────┤
│ 🎯 Recommended Next Step (P0 · human decision)          │
└─────────────────────────────────────────────────────────┘
```

---

## Section → data binding

| Panel section | Primary JSON / report |
| ------------- | --------------------- |
| 🌍 Universe Status | `z_universe_status_report.json` · census summary |
| 🏗️ Foundation Readiness | `z_vile_foundation_readiness_status.json` |
| ❤️ Soulmates Readiness | Strategic review · B2 program status (docs links) |
| 🛡️ Governance Status | `z_release_control.json` · Merge Hold · DRP refs |
| 🤖 AI Council Consensus | `z_universe_ai_ecosystem_registry.json` + per-project assignments |
| 📂 Project Priorities | `z_universe_project_registry.json` · recommended actions |
| 🐢 Turtle Mode Projects | `census.turtle_indicator` filter |
| ⚠️ Human Decisions Required | P0 items from readiness + release control |
| 🎯 Recommended Next Step | `recommended_next_human_action` (foundation) + Track A P0 |

---

## Steward memory row (per project drill-down)

Inspector / expandable row (future):

| Field | Source |
| ----- | ------ |
| Human purpose | `census.purpose` + changelog |
| Problem solved | project docs / B2 vision |
| Foundation doctrines | `census.foundation_adoption` (links only) |
| AI team | `census.ai_ecosystem` |
| Next milestone | `timeline.next_milestone` |
| Posture | turtle_indicator · lifecycle |

---

## Relationship to existing panels

| Existing | Relationship |
| -------- | ------------ |
| Universe Mission Control (MC-1) | Data spine — Steward **summarizes**, does not replace |
| Track A Foundation Readiness | Engineering detail — Steward links here |
| Zuno Advisor (AAL-1) | Deterministic local Q&A — precursor; Steward is executive rollup |
| Project Indicators | Posture chips — Steward may mirror worst signal |

**Do not duplicate** full MC tables in Steward panel — link + executive chips only.

---

## MC-0.8 placement

When Track A stabilizes, Steward panel becomes the **executive intelligence** entry point described in [MC-0.7 charter](../dashboard/Z_UNIVERSE_MC_0_7_INTELLIGENCE_LAYER_CHARTER.md):

- Readiness **with reasons**
- Universe Advisor recommendations (registry-derived)
- Wake-up cost (when chartered)

**Prerequisite:** Track A green · MC matured through use.

---

## Hard UI law

- No merge / deploy / npm-run buttons  
- No LLM chat box (unless future gated charter)  
- Copy-only command snippets (existing AMK dashboard law)  
- Serve over HTTP for JSON — same as MC-1  

---

## Implementation phases (future — not authorized now)

| Phase | Deliverable |
| ----- | ----------- |
| S-0 | This spec + charter (done) |
| S-1 | Read-only HTML section + static JSON rollup script |
| S-2 | Drill-down inspector wiring |
| S-3 | MC-0.8 intelligence reasons (charter) |

---

## Related

- [AMK_GOKU_STEWARD_AI_CHARTER.md](AMK_GOKU_STEWARD_AI_CHARTER.md)
- [AMK_GOKU_STEWARD_AI_ARCHITECTURE.md](AMK_GOKU_STEWARD_AI_ARCHITECTURE.md)
- [Z_UNIVERSE_MC_DASHBOARD_CENSUS_SPEC.md](../dashboard/Z_UNIVERSE_MC_DASHBOARD_CENSUS_SPEC.md)
