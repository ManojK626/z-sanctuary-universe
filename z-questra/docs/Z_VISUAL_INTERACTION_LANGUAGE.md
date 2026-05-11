# Z Visual Interaction Language (Z-VIL) — Z-QUESTRA seed

## Purpose

This document anchors **visual interaction law** for Z-QUESTRA so other Z products can align over time: color realms, motion limits, and accessibility-first patterns — **without** mandating a shared npm package yet (QX-1 stays docs + metadata).

## Pillars (implemented in Z-QUESTRA today)

| Pillar | Implementation hint |
| --------------------- | --------------------------------------------------------------------------------- |
| Color realms | `theme/colorIdentityTokens.js`, age modes in `themeTokens.js`, PlayGarden accents |
| Shape / icon identity | Panel chips, zebra cards, badge studio glyphs |
| Comfort modes | Comfort bar prefs (`accessibilityPrefs.js`) |
| Motion limits | Reduced motion + OS flag; PlayGarden/kaleidoscope pause rules |
| Photophobia | Brightness lane softens glow and disables drift where coded |
| Age-mode themes | Kids / teens / adults / enterprise density + copy tone |
| Local-only receipts | Receipt poster — download only, no cloud |

## Non-goals (QX-1)

- No mandatory cross-repo package.
- No automatic sync of tokens into sibling repos.

## Evolution

- **Hub pointer (QX-1A):** [docs/design/Z_VISUAL_INTERACTION_LANGUAGE.md](../../docs/design/Z_VISUAL_INTERACTION_LANGUAGE.md) — stub that states doctrine-only posture and points here. This Questra copy remains the **implementation seed**; the hub doc may grow merge notes later without forcing code coupling.

## Related docs

- `docs/PHASE_2_3_LIVING_COLOR_VISUAL_STRUCTURE.md`
- `docs/VISUAL_STRUCTURE_PANEL_POLICY.md`
- `docs/Z_PLAYGARDEN_SAFETY_POLICY.md`
