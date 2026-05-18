# Z-OMNAI — Movie, Marketing, and Tool Pipelines

This document summarises the **seven** creative pipeline templates in `data/z_omnai_creative_pipeline_templates.json`. Each template lists inputs, production steps, required evidence, safety checks, outputs, human gates, and suggested verification commands where they already exist in the hub.

## 1. Movie and trailer (`z_omnai_movie_trailer_v1`)

High-level path: concept → world bible → script → scenes → visual style → shot list → poster and audio briefs → trailer copy → safety review.

**Governance:** internal planning surface by default. Public upload, paid media, and distribution remain **human-gated**.

## 2. Marketing campaign (`z_omnai_marketing_campaign_v1`)

Path: product slice → audience → claim evidence → landing narrative → offer boundaries → visuals → FAQ → compliance review → launch checklist.

**Governance:** **BLUE** surfaces — public launch and legal compliance. Align commercial copy with Z-SUSBV and entitlement policy; AMK opens external lanes.

## 3. Product landing page (`z_omnai_product_landing_page_v1`)

Single-product narrative: hero aligned to evidence, structured sections, FAQ, accessibility and performance notes, hand-off for implementation.

**Governance:** **BLUE** — public launch and compliance. No live secrets in mocks; pricing matches an approved source.

## 4. PDF, manual, or e-book (`z_omnai_pdf_manual_ebook_v1`)

Long-form instructional asset: outline, chapters, figure manifest, technical review, export hygiene, distribution class (internal vs customer).

**Governance:** **BLUE** when legal or regulated distribution is involved; otherwise internal planning with compliance checklist.

## 5. Real tool or dashboard prototype (`z_omnai_tool_dashboard_prototype_v1`)

Engineering-facing plan: user stories, feature map, UI flow, data boundary diagram, risk class, scoped build prompt, tests, receipt fields for indicators.

**Governance:** internal planning. Cross-project data or live APIs remain **charter-gated** per `data/z_cross_project_capability_index.json`. Use `npm run z:car2` when overlapping code warrants similarity review.

## 6. Music and sound brief (`z_omnai_music_sound_brief_v1`)

Composer or library brief: mood, tempo, stems, clearance path, revision plan, vault naming.

**Governance:** internal planning plus **legal compliance** for rights. No uncleared samples in shipped masters.

## 7. Investor or partner pitch pack (`z_omnai_investor_partner_pitch_v1`)

Narrative, traction, roadmap storyboard, economics **as references to authoritative docs**, risk pages, data room index, legal queue.

**Governance:** **BLUE** — public-facing or external recipient sends, **pricing** surfaces, and **legal compliance**. Not securities advice; counsel when required.

## Pipeline doc map

| Topic | Primary doc |
| ---------------- | -------------------------------------------------------------------------------- |
| System overview | [Z_OMNAI_CREATIVE_PRODUCTION_SYSTEM.md](./Z_OMNAI_CREATIVE_PRODUCTION_SYSTEM.md) |
| Factory metaphor | [Z_DIGITAL_ADVANTAGE_FACTORY.md](./Z_DIGITAL_ADVANTAGE_FACTORY.md) |
| Phase receipt | [PHASE_Z_OMNAI_1_GREEN_RECEIPT.md](./PHASE_Z_OMNAI_1_GREEN_RECEIPT.md) |

## Law (short)

- Marketing asset ≠ legal approval.
- Movie concept ≠ copyright or clearance permission.
- AMK and humans open public and commercial lanes.
