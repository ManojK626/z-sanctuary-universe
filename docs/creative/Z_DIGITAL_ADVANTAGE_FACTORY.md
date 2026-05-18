# Z-Digital Advantage Factory (Z-OMNAI lens)

## Purpose

The **Digital Advantage Factory** is a naming frame for how Z-Sanctuary turns disciplined internal work into **lasting digital assets**: pitch packs, trailers and campaign plans, manuals, landing narratives, tool specs, and dashboard indicators. It is a **factory metaphor** for workflow and packaging — not a claim that the hub autonomously manufactures revenue or AGI-grade outcomes.

## Factory floors (safe reading of OMNAI)

| Metaphor | Real Z-Sanctuary behaviour |
| -------- | -------------------------- |
| Omega-style formula | **Production routing score**: which step, lane, and evidence come next; documented in JSON and reviewed by humans for external work. |
| Multiplying brains | **Specialist lanes**: separate checklists for film, marketing, code prototypes, and so on — not autonomous agent swarms. |
| Quadruple spine | **Four tracks**: cognitive intent, evidence, build artefacts, and oversight (safety, AMK, policy). |
| Octo-ant overseer | **Eight-themed quality passes** (claims, rights, privacy, accessibility, performance hints, links, tone, charter fit), implemented as human processes and existing read-only scripts where applicable. |
| Large file system | **Asset vault conventions**: manifests, naming, and versioned packs under governance. |
| Pathway engine | **Next-step planner** plus reroute notes in docs and advisor flows — not self-executing orchestration. |

## Outputs vs claims

Outputs of the factory are **files, plans, and receipts** that teams can ship after normal review. The factory does **not**:

- Replace legal, financial, or medical review.
- Grant IP clearance by itself.
- Authorise public launch or pricing changes without AMK and source-of-truth owners.

## Where truth lives

- Entitlement and pricing **posture**: `data/z_service_entitlement_catalog.json` and [Z_SERVICE_ENTITLEMENT_AND_PRICING_POLICY.md](../cross-project/Z_SERVICE_ENTITLEMENT_AND_PRICING_POLICY.md).
- Autonomy **levels**: `data/z_autonomy_task_policy.json` and [Z_AUTONOMOUS_GUARDIAN_LOOP.md](../Z_AUTONOMOUS_GUARDIAN_LOOP.md).
- Creative **pipelines**: `data/z_omnai_creative_pipeline_templates.json`.

## Relationship to Z-OMNAI validator

Run `npm run z:omnai` after edits to the registry or templates. The validator flags **RED** language patterns that imply unsafe public claims or autonomous commercial actions, **BLUE** governance surfaces (for example public launch or pricing), and **YELLOW** incomplete evidence lists — aligned with Z-Traffic-style signalling, without adding runtime behaviour.
