# Z-OMNAI — Creative Production System (Phase Z-OMNAI-1)

## What this phase is

Phase **Z-OMNAI-1** turns the OMNAI-style blueprint into a **governed creative production framework** for the Z-Sanctuary hub: movies and trailers, marketing, landing pages, PDFs and manuals, tools and dashboards, music briefs, and partner or investor packs. This phase ships **documentation, JSON registries, and a read-only validator** only.

OMNAI material is treated as **architecture inspiration**, workflow metaphor, and routing map — **not** as literal product truth about infinite intelligence, guaranteed convergence, or autonomous superintelligence.

## Why “infinite power” stays internal

Phrases like “infinite power” or “omega infinity” may appear as **internal metaphors** to describe ambition or breadth of creative lanes. They must **not** appear as public claims, marketing guarantees, or proof of AGI. The law for this phase is:

- Blueprint ≠ product claim.
- Architecture metaphor ≠ AGI proof.
- Creative pipeline ≠ autonomous launch.

See also [Z_DIGITAL_ADVANTAGE_FACTORY.md](./Z_DIGITAL_ADVANTAGE_FACTORY.md) and the translation registry `data/z_omnai_blueprint_translation_registry.json`.

## Operating flow (adapter)

The adapter encourages a repeatable path:

1. Idea
2. Research and evidence
3. Story or product structure
4. Visual direction
5. Script or copy
6. Tool or page plan
7. Safety and claim check
8. Packaging
9. Delivery checklist

Machine-readable templates live in `data/z_omnai_creative_pipeline_templates.json`. Safe OMNAI-to-Z mappings live in `data/z_omnai_blueprint_translation_registry.json`. Validation and reports: `npm run z:omnai`.

## Z-OMNAI-BUILD-1 — Capability workbench

Phase **Z-OMNAI-BUILD-1** adds the **Blueprint Capability Workbench** (`data/z_omnai_capability_workbench.json`) and `npm run z:omnai:build-plan` to emit **internal build plans and review bundles** from those templates — still **no** AI, API, deploy, or billing. See [Z_OMNAI_BLUEPRINT_CAPABILITY_WORKBENCH.md](./Z_OMNAI_BLUEPRINT_CAPABILITY_WORKBENCH.md) and [PHASE_Z_OMNAI_BUILD_1_GREEN_RECEIPT.md](./PHASE_Z_OMNAI_BUILD_1_GREEN_RECEIPT.md).

Phase **Z-OMNAI-BUILD-2** adds the **movie trailer review bundle** (`npm run z:omnai:movie-bundle`) for the GREEN `movie_trailer` lane — structured internal prep only. See [Z_OMNAI_MOVIE_TRAILER_REVIEW_BUNDLE.md](./Z_OMNAI_MOVIE_TRAILER_REVIEW_BUNDLE.md).

Phase **Z-OMNAI-BUILD-2A** adds the **master media concept seed** (`npm run z:omnai:media-seed`) so one internal seed can feed trailer, music, podcast, and marketing planning without media generation. See [Z_OMNAI_MASTER_MEDIA_CONCEPT_SEED.md](./Z_OMNAI_MASTER_MEDIA_CONCEPT_SEED.md).

## Relation to ZAG, Z-Traffic, AAL, AMK indicators, Z-SUSBV, and ZSX

| System | Role for Z-OMNAI |
| ------ | ---------------- |
| **ZAG** ([Z_AUTONOMOUS_GUARDIAN_LOOP.md](../Z_AUTONOMOUS_GUARDIAN_LOOP.md)) | Doctrine for what may run automatically (observe, report) versus what needs human or AMK gates. Z-OMNAI validators are L0–L1 style evidence; public lanes stay gated. |
| **Z-Traffic** ([Z_TRAFFIC_MINIBOTS.md](../Z_TRAFFIC_MINIBOTS.md), `npm run z:traffic`) | Minibot-style **read-only** signals (GREEN, YELLOW, RED, BLUE) align with how creative packs should surface governance-sensitive work without executing it. |
| **Z-AAL** ([AMK_AUTONOMOUS_APPROVAL_LADDER.md](../AMK_AUTONOMOUS_APPROVAL_LADDER.md)) | Ladder for **auto-lane candidates** versus **sacred** lanes. Creative production that touches launch, pricing, or legal surfaces belongs on higher rungs with AMK approval. |
| **AMK indicators** ([AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md](../AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md), `dashboard/data/amk_project_indicators.json`) | Advisory readiness rows: **indicator ≠ permission**. Z-OMNAI outputs should feed evidence into reviews, not imply go-live authority. |
| **Zuno Advisor Console** ([AMK_ZUNO_ADVISOR_CONSOLE.md](../AMK_ZUNO_ADVISOR_CONSOLE.md)) | Deterministic “what next?” hints. Z-OMNAI complements that with **creative next-step** structure, still without LLM execution in this phase. |
| **Z-SUSBV** (`npm run z:susbv`, [commercial/Z_SUSBV_SANCTUARY_SELF_BENCHMARKS_VALIDATION.md](../commercial/Z_SUSBV_SANCTUARY_SELF_BENCHMARKS_VALIDATION.md)) | When creative work includes **pricing or commercial claims**, benchmark and entitlement **metadata** discipline applies. |
| **ZSX** (`data/z_cross_project_capability_index.json`) | Cross-project capabilities are **catalogued**, not silently inherited. Creative packs that reference sibling products must respect `forbidden_without_charter` and bridge posture in that index. |

## What Z-OMNAI-1 does not ship

- No live AI provider calls, no hidden agents, no scraping, no deployment, no billing execution.
- No autonomous self-improvement, auto-merge, or runtime orchestration beyond existing hub npm scripts run by operators.
- No public AGI, infinite intelligence, or guaranteed-outcome claims as product truth.

## Inputs the adapter was aligned with

Cross-read (not duplicated here): [AI_BUILDER_CONTEXT.md](../AI_BUILDER_CONTEXT.md), [Z_AUTONOMOUS_GUARDIAN_LOOP.md](../Z_AUTONOMOUS_GUARDIAN_LOOP.md), [Z_TRAFFIC_MINIBOTS.md](../Z_TRAFFIC_MINIBOTS.md), [AMK_AUTONOMOUS_APPROVAL_LADDER.md](../AMK_AUTONOMOUS_APPROVAL_LADDER.md), [AMK_ZUNO_ADVISOR_CONSOLE.md](../AMK_ZUNO_ADVISOR_CONSOLE.md), [AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md](../AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md), `data/z_autonomy_task_policy.json`, [cross-project/Z_SERVICE_ENTITLEMENT_AND_PRICING_POLICY.md](../cross-project/Z_SERVICE_ENTITLEMENT_AND_PRICING_POLICY.md), `data/z_service_entitlement_catalog.json`.

## Acceptance reminder

- JSON parses.
- `npm run z:omnai` exits 0 and refreshes `data/reports/z_omnai_blueprint_report.{json,md}`.
- No new runtime AI, API, deploy, or billing behaviour in this phase.
