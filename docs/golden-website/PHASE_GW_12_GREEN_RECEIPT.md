# Phase GW-12 — GREEN receipt

**Slice:** Golden Website — AI Integrity & Anti-Hallucination Challenge Layer
**Date:** 2026-08-27
**Status:** GREEN-SCOPED for **local Challenge the AI sandbox + HOW WE HANDLE AI FAILURE page only**. Production Golden Guide AI = **CLOSED**. Twin live records = **0**. Publication = **NONE**. Deploy = **none**.

## Steward seal (2026-08-27)

> GW-12 — ACCEPTED · AI INTEGRITY CHALLENGE GREEN
> 36/36 integrity · 22/22 red-team · 12/12 cross-posture · 0 fabricated citations · 0 evidence-state upgrades · 0 provider/external calls · Twin 0

Canonical: AI output is a proposal downstream of approved evidence, claim guards, citations, UNKNOWN, Critic Mode, and human review.

GW-13 may audit public-pilot readiness. It does not publish, deploy, add an LLM, or open a live Guide.

## Counts

| Check                                  | Result      |
| -------------------------------------- | ----------- |
| Corpus records consumed                | **22**      |
| Integrity questions                    | **36 / 36** |
| Integrity red-team probes              | **22 / 22** |
| Three-mode consistency                 | **12 / 12** |
| Fabricated citations                   | **0**       |
| Evidence-state upgrades                | **0**       |
| Contradictions with approved corpus    | **0**       |
| UNKNOWN (integrity + red-team)         | **3**       |
| PRIVATE_REFUSAL (integrity + red-team) | **9**       |
| External / provider calls              | **0**       |
| Private browser exposure               | **0**       |
| Twin `records[]`                       | **0**       |

GW-9 baseline remains true: 50/50 behavior tests, 16/16 adversarial. GW-10 remains true: 44/44 critic, 20/20 consistency, 22/22 red-team, 0 contradictions.

## Surfaces / artifacts

| Artifact       | Path                                                     |
| -------------- | -------------------------------------------------------- |
| Policy         | `docs/golden-website/GW_12_AI_INTEGRITY_CHALLENGE.md`    |
| Integrity Q&A  | `docs/golden-website/GW_12_AI_INTEGRITY_QA.md`           |
| Integrity page | `docs/golden-website/shell/ai-integrity.html`            |
| Sandbox mode   | CHALLENGE THE AI on `guide-sandbox.html`                 |
| Suite results  | `docs/golden-website/gw-12/integrity_suite_results.json` |

Pathways of reasoning over the same 22 records: Normal Guide, Critic Mode, Integrity Mode, plus UNKNOWN / PRIVATE_REFUSAL.

## Security results

No mailto, forms, emails, Windows paths, or operator HTML in the integrity payload. Playwright recorded **0** `http`/`https` requests.

## Accessibility / browser

Keyboard skip, 1440 / 768 / 390 overflow, reduced motion, 44px Challenge the AI target: **PASS**. Human NVDA / VoiceOver still required before public pilot.

## Unresolved diligence gaps

- Production Golden Guide AI remains closed.
- No LLM language layer (by design). This suite does not prove a future model cannot fail.
- UNKNOWN review queue is not built.
- Independent public audit of a live Guide does not exist yet.
- Human accessibility testing still required before public pilot.
- Full Golden Universe Map remains locked.

## Validators

| Command                                            | Result                         |
| -------------------------------------------------- | ------------------------------ |
| `node scripts/z_gw_12_build_integrity_payload.mjs` | **PASS**                       |
| `node scripts/z_gw_12_integrity_smoke.mjs`         | **PASS**                       |
| `node scripts/z_gw_12_run_integrity_suite.mjs`     | **PASS** 36/36 + 22/22 + 12/12 |
| `node scripts/z_gw_12_visual_pass.mjs`             | **PASS**                       |
| `node scripts/z_gw_9_run_behavior_suite.mjs`       | **PASS** 50/50                 |
| `node scripts/z_gw_10_run_critic_suite.mjs`        | **PASS** 44/44 + 20/20         |
| markdownlint GW-12 docs                            | **PASS**                       |
| `npm run dashboard:registry-verify`                | **GREEN**                      |
| `npm run alias:audit`                              | **GREEN**                      |
| `npm run security:data-leak-audit`                 | **GREEN** (0 findings)         |
| `npm run z:monster:registry-verify`                | **PASS**                       |

## Rollback

Delete GW-12 integrity page/JSON/docs/scripts, restore Guide sandbox to two modes, revert `ai-integrity.html` routing and nav, and revert INDEX / Master Register / Twin phase_notes. Twin `records[]` was never filled. No provider was added.

## Sign-off line

Operator: Steward accepted. Date: 2026-08-27
