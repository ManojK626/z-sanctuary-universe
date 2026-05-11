# Phase 2.5 — Uncertainty Kaleidoscope + Receipt Poster

## Purpose

Phase 2.5 adds **uncertainty literacy** and **local creative proof** inside Z PlayGarden:

| Surface | Role |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Uncertainty Kaleidoscope** | Gentle Canvas 2D symmetry toy — explore randomness vs pattern **visually**. Illustrative only. |
| **Receipt Poster** | Printable-style memento (preview + **SVG/PNG download**) summarizing local notebook hints and guardian-safe copy. |

Together they deliver **joy, pride, and learning** without gambling-like loops, predictions, or hub coupling.

## Uncertainty literacy

Real projects live with unknowns. The kaleidoscope helps users **feel** how small random variations combine into structure — without claiming to forecast outcomes. Required copy on screen:

> This is a visual learning toy for randomness and pattern. It does not predict outcomes.

## Controls (kaleidoscope)

| Control | Effect |
| ----------------------------------------- | ------------------------------------------------------------------------ |
| Randomness: Calm / Balanced / Wild | Adjusts color spread and drift speed (drift still **slow**; no strobing) |
| Pattern: Soft / Spiral / Mirror / Star | Changes wedge drawing style |
| New gentle mix | Reseeds local visual — not a prize, score, or bet |
| Comfort + OS reduced motion + photophobia | Pauses drift; softens color/glow in drawing |

## Receipt poster

| Field | Source |
| ---------------- | --------------------------------------------------------------------------------- |
| Notebook pages | `collectNotebookMeta` from Local Notebook |
| Highlight tones | Parsed from `[[tone]]` open tags across pages |
| First page title | First notebook page title |
| Age mode | App age lane |
| Timestamp | Set when poster instance mounts (session-scoped) |
| Footer lines | Guardian / Z-Zebras **roadmap-only** language — no certification or bridge claims |

Exports are **client-side file downloads** only — no cloud upload, no new storage layer.

## Files

| Path | Role |
| -------------------------------------------- | ---------------------------------- |
| `src/components/UncertaintyKaleidoscope.jsx` | Kaleidoscope UI + canvas |
| `src/components/ReceiptPoster.jsx` | Poster preview + download buttons |
| `src/notebook/notebookMeta.js` | `collectNotebookMeta` |
| `src/game/receiptPosterExport.js` | SVG string + XML escape |
| `src/theme/playGardenTokens.js` | `KALEIDOSCOPE_*` options, phase id |

## Related

- [Z_PLAYGARDEN_SAFETY_POLICY.md](./Z_PLAYGARDEN_SAFETY_POLICY.md)
- [PHASE_2_5_GREEN_RECEIPT.md](./PHASE_2_5_GREEN_RECEIPT.md)
