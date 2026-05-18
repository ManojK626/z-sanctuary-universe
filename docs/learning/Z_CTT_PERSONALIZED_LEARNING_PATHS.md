# Z-CTT — Personalized learning paths (doctrine)

Formal lane: **Z-CTT / Z-Learning & Content Quality Engine** — Phase **ZCTT-1**.

## Purpose

Define how **human-guided** learning paths may be described in the ecosystem: goals, modules, checkpoints, and reflection — **without** automated profiling, external providers, or adaptive engines in Phase 1.

## Path model (doctrine)

A learning path is a **governed outline**, not an executing LMS:

```text
intent → modules → activities → checkpoints → reflection → receipt (human review)
```

| Element         | Description                                           | ZCTT-1                                 |
| --------------- | ----------------------------------------------------- | -------------------------------------- |
| **Intent**      | Why the learner (or AMK) chose this path              | Text metadata only                     |
| **Modules**     | Ordered units (doc links, exercises, creative briefs) | Registry references                    |
| **Activities**  | Optional games, puzzles, creative tasks               | From brain-boosting catalog            |
| **Checkpoints** | Self or mentor review moments                         | Rubric-backed; no auto-grade authority |
| **Reflection**  | What was learned; what to adjust                      | Non-medical journal prompts            |
| **Receipt**     | Phase or session summary for governance               | Human sign-off before any publish      |

## Personalization boundaries

**Allowed (Phase 1 vocabulary):**

- Operator or learner **selects** goals and pace
- Paths **suggest** optional modules from the curated registry
- Paths may **branch** by explicit human choice (not algorithmic inference)

**Held for later charter:**

- Automated difficulty adjustment
- Behavioral tracking across sessions
- Social comparison or public rankings
- External course marketplace links
- Credential or certificate issuance

## Child and minor safety

- No competitive loops designed for minors without a dedicated child-safety charter
- No dark-pattern engagement or streak punishment
- Parent/guardian visibility is a **future** policy lane — not implemented in ZCTT-1
- Content must pass [Z_CTT_CONTENT_EVALUATION_FRAMEWORK.md](Z_CTT_CONTENT_EVALUATION_FRAMEWORK.md) before any future live path ships

## Connections

| Consumer                | Use                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------- |
| **Z-QUESTRA**           | Quest-style paths and notebook tie-ins (future)                                     |
| **Genesis Studio**      | Script / eBook / course **templates** as optional exports — not runtime in ZCTT-1   |
| **Z-STILLNESS-LEARN-1** | Idle alignment vs active learning — complementary; stillness does not execute paths |
| **AI Builder**          | Module/doc learning checklists for builders                                         |

## Signals (when paths gain runtime later)

Follow hub traffic semantics:

- **GREEN** — path metadata valid; human review complete for the slice described
- **YELLOW** — overlap with another capsule; clarify ownership before build
- **BLUE** — ethics, child safety, or copyright question — AMK decides
- **RED** — profiling, external APIs, medical claims, or autonomous path execution — blocked

**GREEN ≠ deploy.**

## Related docs

- [Z_CTT_BRAIN_BOOSTING_TOOLS.md](Z_CTT_BRAIN_BOOSTING_TOOLS.md)
- [Z_CTT_CONTENT_EVALUATION_FRAMEWORK.md](Z_CTT_CONTENT_EVALUATION_FRAMEWORK.md)
- [../Z_STILLNESS_MODE_AI_LEARNING_PATHWAY.md](../Z_STILLNESS_MODE_AI_LEARNING_PATHWAY.md) — idle alignment (distinct lane)
