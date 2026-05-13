# Z-OMNAI Blueprint Capability Workbench (Z-OMNAI-BUILD-1)

## Purpose

The **Blueprint Capability Workbench** turns Z-OMNAI-1 from registry and templates into a **practical internal surface**: AMK (or operators under AMK policy) pick a **workbench mode**, see required inputs and evidence, and run a **read-only generator** that writes a **build plan and review bundle** report. It does **not** call AI providers, external APIs, deploy, billing, or public publishing.

## What exists on disk

| Artefact | Role |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `data/z_omnai_capability_workbench.json` | Supported modes, inputs, evidence, gates, and global laws |
| `data/z_omnai_creative_pipeline_templates.json` | Source production steps merged into each plan |
| `scripts/z_omnai_build_plan_generate.mjs` | Generator — writes reports only |
| `data/reports/z_omnai_build_plan_report.json` | Machine-readable build plan for all modes |
| `data/reports/z_omnai_build_plan_report.md` | Human-readable summary |
| `npm run z:omnai` | Validator for translation + templates (Phase Z-OMNAI-1) |
| `data/z_omnai_movie_trailer_bundle.json` | **Z-OMNAI-BUILD-2** — first deep bundle for `movie_trailer` (internal review only) |
| `npm run z:omnai:movie-bundle` | Emits `data/reports/z_omnai_movie_trailer_bundle_report.{json,md}` |
| `data/z_omnai_master_media_concept_seed.json` | **Z-OMNAI-BUILD-2A** — master story seed for trailer, music, podcast, marketing branches |
| `npm run z:omnai:media-seed` | Emits `data/reports/z_omnai_master_media_seed_report.{json,md}` |
| `data/z_omnai_media_letter_gate.json` | **Z-OMNAI-LETTER-GATE-1** — A–E lane metadata |
| `npm run z:omnai:letter-gate` | Emits `data/reports/z_omnai_media_letter_gate_report.{json,md}` |

## Z-OMNAI-LETTER-GATE-1 — Media pipeline letter readiness

Phase **Z-OMNAI-LETTER-GATE-1** adds a **read-only letter gate** so AMK sees which of **A–E** is ready, blocked, or human-gated — recommendations are **not** execution. See [Z_OMNAI_MEDIA_LETTER_GATE.md](./Z_OMNAI_MEDIA_LETTER_GATE.md) and [PHASE_Z_OMNAI_LETTER_GATE_1_GREEN_RECEIPT.md](./PHASE_Z_OMNAI_LETTER_GATE_1_GREEN_RECEIPT.md).

## Z-OMNAI-BUILD-2 — Movie trailer review bundle

Phase **Z-OMNAI-BUILD-2** adds the **movie trailer review bundle** for the **GREEN** `movie_trailer` lane: structured prompts, placeholders, and checklists — **no** generated media, providers, or publishing. See [Z_OMNAI_MOVIE_TRAILER_REVIEW_BUNDLE.md](./Z_OMNAI_MOVIE_TRAILER_REVIEW_BUNDLE.md) and [PHASE_Z_OMNAI_BUILD_2_GREEN_RECEIPT.md](./PHASE_Z_OMNAI_BUILD_2_GREEN_RECEIPT.md).

## Z-OMNAI-BUILD-2A — Master media concept seed

Phase **Z-OMNAI-BUILD-2A** adds `data/z_omnai_master_media_concept_seed.json` and `npm run z:omnai:media-seed` so AMK can hold **one master seed** that branches to trailer, song themes, podcast angle, marketing hooks, poster direction, and PDF or e-book planning — still **read-only** reports, **no** media generation. See [Z_OMNAI_MASTER_MEDIA_CONCEPT_SEED.md](./Z_OMNAI_MASTER_MEDIA_CONCEPT_SEED.md) and [PHASE_Z_OMNAI_BUILD_2A_GREEN_RECEIPT.md](./PHASE_Z_OMNAI_BUILD_2A_GREEN_RECEIPT.md).

## Workbench modes

| mode_id | Maps to pipeline | Typical use |
| -------------------------- | ------------------------------------- | -------------------------------------- |
| `movie_trailer` | `z_omnai_movie_trailer_v1` | Trailers and long-form motion planning |
| `marketing_campaign` | `z_omnai_marketing_campaign_v1` | Campaign briefs and claim ledgers |
| `landing_page` | `z_omnai_product_landing_page_v1` | Single-product landing structure |
| `pdf_manual_ebook` | `z_omnai_pdf_manual_ebook_v1` | Manuals and long-form PDFs |
| `tool_dashboard_prototype` | `z_omnai_tool_dashboard_prototype_v1` | Tool and dashboard specs |
| `music_sound_brief` | `z_omnai_music_sound_brief_v1` | Music and sound briefs |
| `pitch_pack` | `z_omnai_investor_partner_pitch_v1` | Investor or partner decks |

## How AMK chooses a mode

1. Open `data/z_omnai_capability_workbench.json` (or this doc) and pick a **mode_id** that matches the creative or product slice.
2. Ensure **required inputs** are available or stubbed honestly as unknown.
3. Run `npm run z:omnai` so translation and template posture stay green or expected BLUE.
4. Run `npm run z:omnai:build-plan` for the **full multi-mode** report, or `npm run z:omnai:build-plan -- --mode=movie_trailer` to attach a **focus expansion** for one mode in the JSON output.
5. Read `data/reports/z_omnai_build_plan_report.md` (or JSON) as the **review bundle** only — not execution authority.

## Signals (build plan)

| Signal | Meaning |
| ---------- | ---------------------------------------------------------------------------------------------- |
| **GREEN** | Internal planning surfaces only; still human-owned for any external step |
| **BLUE** | Template touches public launch, pricing, legal, partner, privacy, health, or compliance review |
| **YELLOW** | Evidence lists or template linkage need tightening before relying on the bundle |
| **RED** | Forbidden claim or execution language detected in scanned fields — fix before use |

**BLUE is not failure.** It matches AMK indicators: public, pricing, and legal lanes stay **human-gated**.

## Relation to ZAG, Z-Traffic, AAL, AMK indicators, Z-SUSBV, ZSX

- **ZAG** — Workbench scripts stay at **observe / report** (L1). No autonomous execution.
- **Z-Traffic** — Same signal vocabulary mindset; run `npm run z:traffic` after hub ritual changes.
- **Z-AAL** — Sacred lanes (deploy, billing, provider) remain off this generator.
- **AMK indicators** — Row `z_omnai_build_workbench` surfaces posture; **indicator ≠ permission**.
- **Z-SUSBV** — Pricing or commercial numbers in a bundle require **Z-SUSBV** and entitlement review, not this script.
- **ZSX** — Cross-project capabilities remain **catalog reference**; no silent bridges from a plan file.

## What this phase does not do

- No LLM or provider calls, no scraping, no voice, no multiplayer.
- No deployment, billing mutation, or Cloudflare changes.
- No auto-merge or hidden agents.

## Commands

```bash
npm run z:omnai
npm run z:omnai:build-plan
npm run z:omnai:build-plan -- --mode=marketing_campaign
```

See [PHASE_Z_OMNAI_BUILD_1_GREEN_RECEIPT.md](./PHASE_Z_OMNAI_BUILD_1_GREEN_RECEIPT.md) for acceptance and rollback.
