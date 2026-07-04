# Z-Sanctuary Universe — Mission Control Architecture

**System ID:** Z-UNIVERSE-MC-1  
**Version:** 1.0  
**Status:** Architecture + first status report · **observer/orchestrator** · no runtime controller  
**Date:** 2026-07-04  
**Owner:** AMK-Goku  
**Posture:** Read-only dashboard evolution · Merge Hold · Runtime NOT AUTHORIZED

---

## Vision

The **AMK-Goku Indicator Dashboard** becomes **Mission Control** for the entire Z-Sanctuary Universe — a single place to see ecosystem health, department posture, and recommended next steps.

**Critical refinement:** Mission Control **observes and orchestrates** — it does **not** directly execute every project action.

```text
❌ Dashboard → runs every project directly

✅ Dashboard → Universe Status Engine → Readiness → DRP → Human Approval → Approved Action
```

This preserves governance: Merge Hold, DRP, Shadow, and AMK sacred gates.

---

## Universe architecture

```text
🌍 Z-SANCTUARY UNIVERSE
            │
            ▼
  AMK-GOKU INDICATOR DASHBOARD (Mission Control)
            │
────────────────────────────────────────────
  📊 Universe Health    📦 Project Registry
  🛡 Governance Status  🤖 AI Reports
  📈 Progress Metrics   🚦 Readiness Indicators
  ⚠ Risk Alerts         📚 Documentation
────────────────────────────────────────────
            │
            ▼
     Department Status Cards
  ❤️ Z-Connect  🏨 ZILWA  ⚖ Z-Legal  🌱 Compassion
  🧠 Zuno Core  🛰 VILE   🌌 Future / Nexus
────────────────────────────────────────────
            │
            ▼
   Standard Zuno Universe Report (per department)
```

Existing surfaces: `dashboard/Html/amk-goku-main-control.html` · `dashboard/data/amk_project_indicators.json` · [AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md](../AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md)

---

## Universe Status Engine

Read-only rollup script aggregates hub registries and reports:

```bash
npm run z:universe:status
```

Output: `data/reports/z_universe_status_report.{json,md}`

Engine doc: [Z_UNIVERSE_STATUS_ENGINE.md](Z_UNIVERSE_STATUS_ENGINE.md)

**Does not:** deploy, merge, build, publish, mutate sibling repos, or bypass gates.

---

## Department cards

Each department publishes the same standard report structure. Registry: `data/z_universe_department_registry.json`

| Field | Purpose |
| ----- | ------- |
| Current phase | Where the project is in its lifecycle |
| Architecture | FROZEN / HOLD / active |
| Merge Hold | Active or released |
| Runtime | NOT AUTHORIZED until gate opens |
| Readiness | Evidence-based posture |
| Open risks | Honest blockers |
| Next action | Recommended operator step |
| Required human gate | AMK / DRP / sacred move |
| Latest validation | Report paths + signals |
| Dependencies | Other departments |

Spec: [Z_ZUNO_UNIVERSE_REPORT_SPEC.md](Z_ZUNO_UNIVERSE_REPORT_SPEC.md)

---

## Universe health (separate dimensions)

**No single combined percentage.** Use independent signals:

| Dimension | Typical source |
| --------- | -------------- |
| Architecture | Phase freeze, lifecycle completeness |
| Governance | Merge Hold, Universe Resolution |
| Documentation | Handbook, receipts |
| Development | Branch merge posture, open work |
| Testing | Package/integration test evidence |
| Deployment | Sacred gate — usually RED/HOLD |
| Commercial | Prep checklist, milestone framing |
| Security | VILE packages, policy docs |

---

## AI department reviews (consolidated view)

Multiple AI perspectives feed **one dashboard view** — not a single opinion:

| AI role | Responsibility |
| ------- | -------------- |
| Zuno Architect | Architecture review |
| Governance AI | DRP and policy checks |
| QA AI | Verification and testing |
| Documentation AI | Documentation completeness |
| Strategy AI | Prioritization and roadmap |
| Commercial AI | Launch readiness |
| Security AI | Security posture |

Phase 0: roles documented; consolidated report in universe status JSON. Future: structured AI review attachments per department (read-only).

---

## One-click actions (with gates)

Buttons **initiate approved workflows** — they do **not** override governance.

| Action | Available when |
| ------ | -------------- |
| Review PR | Always (opens review — does not merge) |
| Generate report | Always (read-only scripts) |
| Run validation | Always (verify intents) |
| Build | Only when project gate allows |
| Merge | After governance approval |
| Deploy | After governance approval (sacred) |
| Publish | After governance approval (sacred) |

---

## Alignment with hub doctrine

- [Z_SANCTUARY_UNIVERSE_RESOLUTION_2026_07_04.md](../Z_SANCTUARY_UNIVERSE_RESOLUTION_2026_07_04.md) — Track A priority  
- [Z_SANCTUARY_PROJECT_ARCHITECTURE_LIFECYCLE.md](../Z_SANCTUARY_PROJECT_ARCHITECTURE_LIFECYCLE.md) — freeze means freeze  
- [Z_ECOSYSTEM_AWARENESS_SPINE.md](../Z_ECOSYSTEM_AWARENESS_SPINE.md) — Z-AWARE-1 complements this layer  
- Z-Connect **architecture frozen** — no new Z-Connect layers from Mission Control work  

---

## Phase roadmap

| Phase | Deliverable | Status |
| ----- | ----------- | ------ |
| MC-0 | Architecture + universe status report script | **This phase** |
| MC-1 | Dashboard panel consuming `z_universe_status_report.json` | Future — after AMK review |
| MC-2 | Per-department AI review attachments | Future |
| MC-3 | Gated action initiators (workflow links only) | Future — sacred gate each |

---

## Reports

- [PHASE_Z_UNIVERSE_MISSION_CONTROL_0_ARCHITECTURE_REPORT.md](PHASE_Z_UNIVERSE_MISSION_CONTROL_0_ARCHITECTURE_REPORT.md)  
- [PHASE_Z_UNIVERSE_MISSION_CONTROL_0_GREEN_RECEIPT.md](PHASE_Z_UNIVERSE_MISSION_CONTROL_0_GREEN_RECEIPT.md)

---

## Verdict

Mission Control architecture: **GREEN** for review · Observer/orchestrator · Runtime NOT AUTHORIZED
