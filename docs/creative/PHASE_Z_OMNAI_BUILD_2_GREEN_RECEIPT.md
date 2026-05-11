# Phase Z-OMNAI-BUILD-2 — GREEN Receipt

**Phase:** Z-OMNAI-BUILD-2 — Movie trailer review bundle
**Scope:** Docs + JSON + read-only generator + AMK indicator row.

## Checklist

- [x] `data/z_omnai_movie_trailer_bundle.json`
- [x] `scripts/z_omnai_movie_trailer_bundle_generate.mjs`
- [x] `data/reports/z_omnai_movie_trailer_bundle_report.{json,md}` from generator
- [x] `docs/creative/Z_OMNAI_MOVIE_TRAILER_REVIEW_BUNDLE.md`
- [x] `package.json` — `z:omnai:movie-bundle`
- [x] `data/z_autonomy_task_policy.json` — L1 + conceptual **Z-OMNAI-BUILD-2**
- [x] `dashboard/data/amk_project_indicators.json` — `z_omnai_movie_trailer_bundle`
- [x] No AI, API, media generation, deploy, billing, or bridge behaviour

## Verification

```bash
node -e "JSON.parse(require('fs').readFileSync('data/z_omnai_movie_trailer_bundle.json','utf8')); console.log('Z-OMNAI movie bundle JSON OK')"
npm run z:omnai
npm run z:omnai:build-plan
npm run z:omnai:movie-bundle
npm run verify:md
npm run z:traffic
npm run z:car2
```

Hub root: `ZSanctuary_Universe`.

## Expected signal

- Generator **`overall_signal`:** **GREEN** when bundle JSON is complete and no forbidden claim phrases appear in scanned section text.
- **YELLOW** if section prompts or placeholders are thin (generator flags only).
- **RED** if forbidden execution or hype language appears — **exit 1** in that case only.

## Rollback

1. Remove `z:omnai:movie-bundle` from `package.json`.
2. Delete `scripts/z_omnai_movie_trailer_bundle_generate.mjs`, `data/z_omnai_movie_trailer_bundle.json`, and `data/reports/z_omnai_movie_trailer_bundle_report.{json,md}`.
3. Remove indicator `z_omnai_movie_trailer_bundle` from `dashboard/data/amk_project_indicators.json`.
4. Revert `data/z_autonomy_task_policy.json` entries for this phase.
5. Remove this receipt and `Z_OMNAI_MOVIE_TRAILER_REVIEW_BUNDLE.md`; revert links in `Z_OMNAI_BLUEPRINT_CAPABILITY_WORKBENCH.md` and `docs/AI_BUILDER_CONTEXT.md` if added.

## Manual checklist

- Treat reports as **internal AMK prep**, not distribution approval.
- Complete **rights and music** rows before any external screener.
- Re-run `npm run z:omnai:movie-bundle` after edits to the bundle JSON.
