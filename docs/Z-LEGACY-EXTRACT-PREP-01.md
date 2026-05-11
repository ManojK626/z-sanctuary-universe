# Legacy extract pack 01 (prepare-only)

**Source bundle:** `Z_Legacy_Glowing_Master_Bible_v7_3_7.zip`
**Intent:** lift only low-risk, reusable ideas into current governance without importing legacy engines.

## Extracted concept A: PRM-Delta transparency card

- **Canonical name:** `prm-delta-transparency-card`
- **Gate:** `PREPARE ONLY`
- **From legacy:** Planetary Resources module + demo receipts (`e-diesel`, `urban-mined-gold`)
- **Safe use now:** display-only card/mock that explains receipt fields and provenance intent
- **Do not do now:** no real market claims, no execution logic, no live valuation

## Extracted concept B: CRI index explainer card

- **Canonical name:** `cri-index-explainer-card`
- **Gate:** `PREPARE ONLY`
- **From legacy:** `CRI — Carbon • Regeneration • Inequality` example dataset
- **Safe use now:** educational/explainer UI with sample values and clear “illustrative” label
- **Do not do now:** no policy scoring, no partner compliance verdicts, no auto-ranking people/orgs

## Why these two

- They are content/education oriented (low execution risk)
- They fit `Z-Stack Lite` as mock cards
- They preserve roots-first posture (safety + reflection before power modules)

## Promotion checklist

Before moving either concept beyond prepare-only:

1. Add explicit owner and rollback note
2. Keep claims language non-financial, non-regulatory
3. Verify with:
   - `npm test`
   - `npm run build`
   - `npm run verify:full:technical`

**Result:** extraction succeeded without wiring legacy flags or engines.
