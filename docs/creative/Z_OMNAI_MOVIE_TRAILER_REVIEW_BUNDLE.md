# Z-OMNAI movie trailer review bundle (Z-OMNAI-BUILD-2)

## Purpose

**Z-OMNAI-BUILD-2** is the first **concrete internal review bundle** for the **GREEN** `movie_trailer` workbench lane. It gives AMK a structured scaffold to prepare a movie or trailer concept **without** generating video, audio, images, or calling providers. OMNAI blueprint ideas (lanes, oversight, pathway planning) stay **internal architecture inspiration**, not public AGI claims.

## What this phase creates

| Artefact | Role |
| ---- | ---- |
| `data/z_omnai_movie_trailer_bundle.json` | Section prompts, placeholders, checklists, forbidden actions, human gates |
| `scripts/z_omnai_movie_trailer_bundle_generate.mjs` | Read-only report generator |
| `data/reports/z_omnai_movie_trailer_bundle_report.json` | Structured bundle summary + checklists |
| `data/reports/z_omnai_movie_trailer_bundle_report.md` | Operator-readable summary |
| `npm run z:omnai:movie-bundle` | Run the generator |

## Sections in the bundle

The JSON defines AMK-facing blocks: **story concept**, **world bible**, **character roles**, **trailer structure**, **scene beats**, **shot list**, **visual style guide**, **music and sound brief**, **poster and key-art brief**, **accessibility and sensory notes**, **safety and rights checklist**, and **review questions for AMK**.

## What is explicitly not shipped here

- No AI or provider calls, no scraping, no voice or multiplayer.
- No image, video, or audio **generation**; no copyrighted asset creation.
- No public upload, deploy, billing, or bridge execution.
- Briefs describe **intent**; they do **not** grant music, likeness, or key-art rights.

## Rights, IP, likeness, music

- **Rights posture** in JSON: `original_or_permission_required`.
- **Music brief** is planning only — sync and master rights need a separate rights lane.
- **Likeness** and real-person allusions require consent and counsel when applicable.
- **Style references** are for mood, not to copy protected frames or mimic living artists without permission.

## Public release

- `public_release_status` stays **`not_approved`** until AMK or human opens the public release lane.
- AMK indicators use **`NO_GO_FOR_PUBLIC_RELEASE`** for this row until that gate is satisfied.

## Law

- Review bundle ≠ final movie.
- Trailer outline ≠ public release.
- Style guide ≠ copyrighted asset permission.
- Music brief ≠ music rights.
- Poster brief ≠ generated key art.
- AMK or human opens public release.

## Relation to Z-OMNAI-BUILD-1, ZAG, Z-Traffic, AAL, indicators, Z-SUSBV

- **Z-OMNAI-BUILD-1** — Workbench and `z:omnai:build-plan` supply the cross-mode plan; BUILD-2 deepens **movie_trailer** only.
- **ZAG** — Generator stays **L1 report**; no autonomous execution.
- **Z-Traffic** — Run after hub ritual changes; advisory signals only.
- **Z-AAL** — Sacred lanes (deploy, billing, provider) stay off this tool.
- **AMK indicators** — Row `z_omnai_movie_trailer_bundle`; **indicator ≠ permission**.
- **Z-SUSBV** — If trailer or end-card introduces **price, tier, or donation claims**, run **Z-SUSBV** and entitlement review before any public surface.

## Z-OMNAI-BUILD-2A — Master media concept seed

Phase **Z-OMNAI-BUILD-2A** layers a **master media concept seed** on top of this trailer bundle so one internal story seed can feed trailer, music, podcast, marketing, and PDF branches — still **no** generated media. See [Z_OMNAI_MASTER_MEDIA_CONCEPT_SEED.md](./Z_OMNAI_MASTER_MEDIA_CONCEPT_SEED.md) and `npm run z:omnai:media-seed`.

## Commands

```bash
npm run z:omnai
npm run z:omnai:build-plan
npm run z:omnai:movie-bundle
npm run z:omnai:media-seed
```

See [PHASE_Z_OMNAI_BUILD_2_GREEN_RECEIPT.md](./PHASE_Z_OMNAI_BUILD_2_GREEN_RECEIPT.md) for acceptance and rollback.
