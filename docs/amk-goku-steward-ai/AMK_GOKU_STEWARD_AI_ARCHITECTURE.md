# AMK-Goku Steward AI — Architecture

**System ID:** AMK-GOKU-STEWARD-AI-1  
**Date:** 2026-07-08  
**Posture:** Documentation only · observer/orchestrator · no runtime controller

---

## AI Civilization Hierarchy (v1)

```text
                    👤 AMK-Goku (Founder)
                 Final Human Steward Authority
                              │
                              ▼
                  🧠 AMK-Goku Steward AI
       Chief Human Steward Interface · Executive Advisor
                              │
         ─────────────────────┼─────────────────────
                              │
                    🛡️ Chief AI Council
                              │
        ┌──────────┬──────────┼──────────┬──────────┐
        ▼          ▼          ▼          ▼          ▼
     ❤️ Zuno    💻 Cursor   🐙 GitHub  ☁️ CF    🧠 Specialists
   Governance  Engineering  Repository  Infra   (modular)
```

**Steward does not sit above the Founder.** Steward sits **between** council knowledge and **human** decision — as interface, not authority.

---

## Class of architecture (ecosystem)

```text
         FOUNDATION
              ↓
         GOVERNANCE
              ↓
      MISSION CONTROL  ←── data spine
              ↓
         SHARED AI      ←── Chief AI Council
              ↓
   INDEPENDENT PROJECTS
              ↓
      HUMAN STEWARDSHIP ←── AMK-Goku (final)
```

Steward AI is the **executive lens** on Mission Control + Council — not a replacement layer.

---

## Mission Control flow

```text
Projects
    │
    ▼
AI Specialists (per-project assignment)
    │
    ▼
Chief AI Council (domain chiefs)
    │
    ▼
AMK-Goku Steward AI (synthesis · advisory only)
    │
    ▼
Mission Control Dashboard (read-only visibility)
    │
    ▼
AMK Human Decision (sacred)
```

**Steward does not bypass the council** — it gathers their knowledge into one executive view.

---

## Data sources (read-only)

| Source | Path / doc |
| ------ | ---------- |
| Universe registry | `data/z_universe_project_registry.json` |
| AI ecosystem | `data/z_universe_ai_ecosystem_registry.json` |
| Universe census | `data/reports/z_universe_census_report.md` |
| Foundation readiness | `data/reports/z_vile_foundation_readiness_status.json` |
| Universe status | `data/reports/z_universe_status_report.json` |
| Civilization memory | [UNIVERSE_CHANGELOG.md](../UNIVERSE_CHANGELOG.md) |
| Release / Merge Hold | `data/z_release_control.json` |

No new databases. No APIs. Consume existing hub reports.

---

## Specialist AIs (modular future)

As ecosystem grows — each **reference only**, not duplicated:

| Specialist | Example domain |
| ---------- | -------------- |
| Research AI | Long-form analysis |
| Design AI | UX / visual systems |
| Legal AI | Draft review support |
| Finance AI | Commercial readiness |
| Education AI | Learning products |
| Wellness AI | Compassion-adjacent products |
| Tourism AI | ZILWA-adjacent |
| Marketplace AI | WorkSphere-adjacent |

Projects **reference** specialists via [AI ecosystem registry](../../data/z_universe_ai_ecosystem_registry.json) — principles travel, implementations stay modular.

---

## Anti-patterns (never build)

- Steward as auto-merge bot
- Steward as deploy trigger
- Steward overriding Zuno governance chief on ethics
- Steward hiding Merge Hold or DRP gates
- Single LLM “god mode” with write access to repos

---

## MC phase placement

| Phase | Steward relevance |
| ----- | ----------------- |
| MC-0.6 Census | Per-project AI team + sleep/wake context |
| MC-0.7 Intelligence | Reasons & advisor (charter only) |
| MC-0.8 | Executive intelligence layer (after Track A) |
| **Steward charter** | **This doc package** — docs only |
| Steward dashboard | Spec — [AMK_GOKU_STEWARD_AI_DASHBOARD_SPEC.md](AMK_GOKU_STEWARD_AI_DASHBOARD_SPEC.md) |

---

## Related

- [AMK_GOKU_STEWARD_AI_CHARTER.md](AMK_GOKU_STEWARD_AI_CHARTER.md)
- [Z_UNIVERSE_MISSION_CONTROL_ARCHITECTURE.md](../dashboard/Z_UNIVERSE_MISSION_CONTROL_ARCHITECTURE.md)
- [Z_UNIVERSE_MC_0_7_INTELLIGENCE_LAYER_CHARTER.md](../dashboard/Z_UNIVERSE_MC_0_7_INTELLIGENCE_LAYER_CHARTER.md)
