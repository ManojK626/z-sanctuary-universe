# Z-Universe Mission Control MC-0.6 — Universe Census Architecture

**System ID:** Z-UNIVERSE-CENSUS-1
**Branch:** `cursor/zsanctuary/z-universe-census-mc-0-6`
**Date:** 2026-07-08
**Posture:** Read-only · Turtle Mode · Merge Hold ACTIVE · no runtime · no sibling modifications

**Doctrine:**

> Principles travel. Implementations stay modular.

> Mission Control observes · informs · recommends — never bypasses DRP, Human Approval, Merge Hold, Turtle Mode, or Governance.

---

## Purpose

Evolve Mission Control from **discovery** (MC-0.5) to **census**: every configured PC-root project is **known**, **profiled**, and **placed** in the ecosystem — including AI team, foundation adoption, readiness dimensions, timeline, and successor/duplicate posture.

**No idea lost.** Projects may sleep in Turtle Mode for months; Mission Control remembers why they exist.

---

## Pipeline

```text
npm run z:universe:census
  → z_universe_discovery_scan.mjs (MC-0.5 base)
  → z_universe_census_scan.mjs (MC-0.6 enrichment)
  → data/z_universe_project_registry.json (schema v1_2)
  → data/z_universe_ai_ecosystem_registry.json
  → data/reports/z_universe_census_report.{md,json}
```

---

## Per-project census fields

| Field                        | Description                                                                                     |
| ---------------------------- | ----------------------------------------------------------------------------------------------- |
| `universe_id`                | Immutable ZSU-NNNN (MC-0.5b)                                                                    |
| `census.purpose`             | Why the project exists                                                                          |
| `census.turtle_indicator`    | 🟢🟡🔵🟣🟤⚫🐢 at-a-glance stage                                                                |
| `census.ai_ecosystem`        | Lead, builder, repo, infra, specialists, steward                                                |
| `census.foundation_adoption` | Compassion, Turtle, DRP, AI Constitution, Consent, Foundation — adopted/partial/planned/unknown |
| `census.readiness_matrix`    | Independent dimensions — **no single score**                                                    |
| `census.integration_pathway` | Future MC integration path                                                                      |
| `timeline.*`                 | first_discovered, last_reviewed, last_activity, lifecycle, next_milestone, blocker, next action |
| `confidence.*`               | confirmed / inferred / unknown per attribute                                                    |

---

## AI ecosystem registry

**Machine:** `data/z_universe_ai_ecosystem_registry.json`

Universe-level AI systems (Zuno, Cursor, GitHub, Cloudflare, Claude, Gemini, Replit, AMK-Goku). Projects **reference** these IDs — no duplication.

**Documentation only** — no runtime AI connections.

---

## Successor & duplicate review (report only)

| Finding                                     | Verdict                            |
| ------------------------------------------- | ---------------------------------- |
| `Z_Sanctuary_Universe`                      | **Canonical hub** (ZSU-0001)       |
| `Z_Sanctuary_Universe 2` (PC root + nested) | Successor/duplicate — human review |
| `ZSanctuary_Universe` stub                  | Archived — not hub                 |
| AT Princess duplicate IDs                   | Consolidate when gated             |

**Never auto-merge.**

---

## Foundation doctrine adoption

References only — see [Z_SANCTUARY_FOUNDATION_DOCTRINES.md](../governance/Z_SANCTUARY_FOUNDATION_DOCTRINES.md).

---

## Dashboard future tabs (spec only — MC-0.6)

| Tab                     | Data source                                      |
| ----------------------- | ------------------------------------------------ |
| 🌍 Universe             | relationship_map_v2                              |
| 📂 Registry             | projects + ZSU IDs                               |
| 🤖 AI Council           | ai_ecosystem_registry + per-project ai_ecosystem |
| 📈 Analytics            | readiness_matrix rollups (future MC-4)           |
| 🕒 Timeline             | timeline + census milestones                     |
| 🧭 Roadmaps             | Track A / strategic_opportunities                |
| ⚖ Governance            | foundation_adoption + posture                    |
| ❤️ Foundation Doctrines | foundation_doc_refs                              |

**Read-only.** No execute buttons. Full spec: [Z_UNIVERSE_MC_DASHBOARD_CENSUS_SPEC.md](Z_UNIVERSE_MC_DASHBOARD_CENSUS_SPEC.md)

---

## Hard boundaries

- No modification of sibling project folders
- No runtime, deploy, or AI API connections
- Track A (VILE) remains highest engineering priority
- Census does not replace human consolidation decisions

---

## Related

- [Z_UNIVERSE_DISCOVERY_ARCHITECTURE.md](Z_UNIVERSE_DISCOVERY_ARCHITECTURE.md)
- [Z_UNIVERSE_MC_1_ARCHITECTURE.md](Z_UNIVERSE_MC_1_ARCHITECTURE.md)
- [PHASE_Z_UNIVERSE_CENSUS_MC_0_6_GREEN_RECEIPT.md](PHASE_Z_UNIVERSE_CENSUS_MC_0_6_GREEN_RECEIPT.md)
- [Z_UNIVERSE_CENSUS_EXECUTIVE_SUMMARY.md](Z_UNIVERSE_CENSUS_EXECUTIVE_SUMMARY.md)
