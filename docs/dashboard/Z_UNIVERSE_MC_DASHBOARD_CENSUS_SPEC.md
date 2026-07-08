# Z-Universe MC-0.6 — Dashboard Census Integration Spec

**Phase:** MC-0.6 companion · future MC-1.x / MC-2 tabs
**Posture:** Read-only specification only — no UI implementation in MC-0.6

---

## Future tab bar (AMK vision)

```text
🌍 Universe | 📂 Registry | 🤖 AI Council | 📈 Analytics | 🕒 Timeline | 🧭 Roadmaps | ⚖ Governance | ❤️ Foundation
```

All tabs consume JSON from hub `data/` — serve over HTTP like MC-1.

---

## Data bindings

| Tab        | Primary JSON                                                                | Key fields                                        |
| ---------- | --------------------------------------------------------------------------- | ------------------------------------------------- |
| Universe   | `z_universe_project_registry.json` → `relationship_map_v2`                  | tree, project_edges                               |
| Registry   | same → `projects[]`                                                         | universe_id, purpose, turtle_indicator, MC status |
| AI Council | `z_universe_ai_ecosystem_registry.json` + per-project `census.ai_ecosystem` | systems[], references                             |
| Analytics  | census `readiness_matrix` rollups                                           | dimension counts — no single score                |
| Timeline   | `timeline` + MC-2.1 events                                                  | milestones, blockers                              |
| Roadmaps   | census report `strategic_opportunities` + status engine Track A             |                                                   |
| Governance | `census.foundation_adoption` + posture                                      | adopted/partial/planned                           |
| Foundation | `foundation_doc_refs`                                                       | link-only to governance docs                      |

---

## Project row template (Registry tab)

| Column      | Source                                       |
| ----------- | -------------------------------------------- |
| ZSU ID      | `universe_id`                                |
| Name        | `project_name`                               |
| Purpose     | `census.purpose`                             |
| Turtle      | `census.turtle_indicator.emoji` + label      |
| AI Team     | `census.ai_ecosystem.lead_ai.role` + builder |
| Readiness   | readiness_matrix chips (no aggregate %)      |
| Next action | `timeline.next_recommended_action`           |

Filter by lane, turtle indicator, MC status — same pattern as MC-1 registry table.

---

## AI Council tab (documentation layer)

Display universe AI registry table + per-project assignment matrix.

**Not** live multi-AI orchestration. Placeholder for MC-2 AI review attachments.

---

## Hard law

- No execute / deploy / merge buttons
- Links to docs and reports only
- Copy-only npm snippets in inspector (existing pattern)

---

## Related

- [Z_UNIVERSE_CENSUS_MC_0_6_ARCHITECTURE.md](Z_UNIVERSE_CENSUS_MC_0_6_ARCHITECTURE.md)
- [Z_UNIVERSE_MC_1_ARCHITECTURE.md](Z_UNIVERSE_MC_1_ARCHITECTURE.md)
