# Z-OMNAI master media concept seed (Z-OMNAI-BUILD-2A)

## Purpose

**Z-OMNAI-BUILD-2A** adds the **master media concept seed** — one internal JSON scaffold plus a **read-only report** — so AMK can capture a **single strong story seed** that can later branch into trailer work, song themes, a podcast angle, marketing hooks, poster direction, and PDF or e-book slices. This phase **does not** generate video, audio, images, or call providers.

## Relation to BUILD-2

- **Z-OMNAI-BUILD-2** — Structured **movie trailer review bundle** (sections, checklists, `z:omnai:movie-bundle`).
- **Z-OMNAI-BUILD-2A** — **Master seed** (`data/z_omnai_master_media_concept_seed.json`) keyed from `z_omnai_movie_trailer_review_bundle_v1`, extended with **cross-media prep blocks** in the generated report only.

## Artefacts

| Path | Role |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data/z_omnai_master_media_concept_seed.json` | Editable seed: message, audience, tone, world, characters, trailer beats, song hooks, podcast angle, hooks, poster direction, PDF angle, rights notes, AMK questions |
| `scripts/z_omnai_master_media_seed_generate.mjs` | Generator — reads seed, bundle, workbench, templates |
| `data/reports/z_omnai_master_media_seed_report.{json,md}` | Combined prep summary for AMK |
| `npm run z:omnai:media-seed` | Run the generator |

## What is not done here

- No **AI** or **provider** calls, no **scraping**, no **voice** or **multiplayer**.
- No **rendered** or **synthesised** media assets in the repo from this command.
- No **public** release, **upload**, **deploy**, **billing**, or **bridge** actions.

## Rights, IP, music, likeness

- Seed text is **planning only** — not a licence to sync music, use likeness, or ship key art.
- **Song hooks** are thematic seeds, not lyrics to steal and not a substitute for composer agreements.
- **Poster direction** is words only — design and clearance are separate lanes.

## Public release

- `public_release_status` remains **`not_approved`** until AMK or human opens that lane.
- Indicator posture: **`NO_GO_FOR_PUBLIC_RELEASE`**.

## Law

- Media seed ≠ generated movie.
- Song hook ≠ music rights.
- Podcast angle ≠ public episode.
- Marketing hook ≠ approved public copy.
- Poster direction ≠ generated key art.
- AMK or human opens public and media-generation lanes.

## Relation to ZAG, Z-Traffic, AAL, indicators, Z-SUSBV

- **ZAG** — Script stays **L1 report** evidence.
- **Z-Traffic** — Run after hub changes; advisory only.
- **Z-AAL** — Provider, deploy, and billing remain sacred lanes.
- **AMK indicators** — Row `z_omnai_master_media_seed`; **indicator ≠ permission**.
- **Z-SUSBV** — If marketing or PDF angle introduces **price, tier, donation, or SKU** language, run **Z-SUSBV** and entitlement review before any public surface.

## Letter gate (A–E)

After editing the seed, run **`npm run z:omnai:letter-gate`** to refresh which pipeline letter (**A–E**) is suggested next based on placeholders and reports. See [Z_OMNAI_MEDIA_LETTER_GATE.md](./Z_OMNAI_MEDIA_LETTER_GATE.md).

## Commands

```bash
npm run z:omnai:media-seed
npm run z:omnai:letter-gate
```

See [PHASE_Z_OMNAI_BUILD_2A_GREEN_RECEIPT.md](./PHASE_Z_OMNAI_BUILD_2A_GREEN_RECEIPT.md) for acceptance and rollback.
