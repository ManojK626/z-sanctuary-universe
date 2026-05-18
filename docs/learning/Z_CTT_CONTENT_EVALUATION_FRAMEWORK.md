# Z-CTT — Content evaluation framework (doctrine)

Formal lane: **Z-CTT / Z-Learning & Content Quality Engine** — Phase **ZCTT-1**.

## Purpose

Provide **evaluation rubrics** for learning and creative content across the ecosystem: clarity, safety, licensing posture, bias awareness, and governance fit — **without** live scoring services, external APIs, or automated publishing.

## Rubric dimensions (Phase 1)

| Dimension                 | Question                                       | Fail triggers (examples)                                |
| ------------------------- | ---------------------------------------------- | ------------------------------------------------------- |
| **Clarity**               | Can a human learner follow intent and steps?   | Contradictory instructions; missing prerequisites       |
| **Safety**                | Any medical, therapy, or harm-adjacent claims? | “Treats anxiety”; “guaranteed IQ gain”                  |
| **DRP / governance**      | Aligns with 14 DRP and Turtle Mode?            | Autonomous deploy; bypass human review                  |
| **Copyright / licensing** | Source and reuse rights documented?            | Unknown origin; scraped competitor content              |
| **Bias & fairness**       | Evaluator bias acknowledged?                   | Stereotype reinforcement; unchecked single-source truth |
| **Child / minor**         | Age-appropriate framing?                       | Competitive pressure on minors; unsafe challenges       |
| **Provider posture**      | External AI or course APIs required?           | Live provider call in ZCTT-1 scope — **blocked**        |
| **Export / publish**      | Human approval before outward share?           | Auto-post to social or public web                       |

## Evaluator bias safeguards

1. **Multiple lenses** — Where possible, two human or role-separated reviews (builder + overseer) before GREEN on sensitive content.
2. **Declared conflicts** — Evaluator notes affiliation, product interest, or cultural blind spots in the receipt.
3. **No reputation scores** — ZCTT-1 does **not** rank evaluators or creators on a public leaderboard.
4. **Evidence over hype** — Rubrics reward citations, licenses, and receipts — not market-superiority claims.
5. **Appeal path** — YELLOW/BLUE goes to AMK / Hierarchy Chief; RED stops the lane.

## Content curation (doctrine)

**Curation** means **human-selected** inclusion in a governed catalog:

- Provenance recorded (author, license, date, hub path)
- Evaluation rubric completed (checklist or short receipt)
- No automated “trending” or engagement-maximization feed in ZCTT-1

**Future TrustHub** may host a curated knowledge library **only** after a separate charter covering copyright, privacy, and export gates.

## AI-generated content (builder pack alignment)

When AI assists docs, modules, or learning assets:

| Check              | Requirement                                                         |
| ------------------ | ------------------------------------------------------------------- |
| Human review       | Required before treat-as-canonical                                  |
| Hallucination risk | Cross-check against hub registries and receipts                     |
| Sacred domains     | No legal, medical, or child-safety advice without human expert gate |
| Receipt            | Record model role as _assistant_; not _authority_                   |

## Copyright and licensing caution

- Prefer hub-original or explicitly licensed material
- Do not ingest third-party courseware or paywalled syllabi without written permission
- Attribute sources in metadata; link to `data/z_ctt_learning_capability_registry.json` entries
- Scraping competitors or the open web for “benchmark content” is **forbidden** in ZCTT-1

## Outputs (Phase 1 — types only)

Allowed **artifact names** in registry (no auto-writer):

- `content_evaluation_checklist`
- `curation_proposal`
- `bias_review_note`
- `license_posture_summary`
- `governance_fit_note`

Forbidden:

- `auto_publish`
- `auto_recommend`
- `user_profile_update`
- `evaluator_reputation_delta`

## Related docs

- [Z_CTT_BRAIN_BOOSTING_TOOLS.md](Z_CTT_BRAIN_BOOSTING_TOOLS.md)
- [Z_CTT_PERSONALIZED_LEARNING_PATHS.md](Z_CTT_PERSONALIZED_LEARNING_PATHS.md)
- [../Z_AI_AGENT_COLLABORATION_LAW.md](../Z_AI_AGENT_COLLABORATION_LAW.md) — multi-agent evaluation discipline
