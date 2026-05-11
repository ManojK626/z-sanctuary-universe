# Phase 2.5 — Green Receipt (Uncertainty Kaleidoscope + Receipt Poster)

## Build summary

| Item | Status |
| --------------------------------------------------- | ------ |
| Creative Tools section in Z PlayGarden | Done |
| Uncertainty Kaleidoscope (Canvas) | Done |
| Randomness + pattern controls | Done |
| Motion / photophobia safety | Done |
| Non-prediction copy on kaleidoscope | Done |
| Receipt poster preview | Done |
| Download SVG + PNG (no new deps) | Done |
| `collectNotebookMeta` for poster | Done |
| `playGarden` route row (local-only label) | Done |
| New backend / API / cloud / LLM / payments / bridge | None |

## Verify

```bash
cd z-questra
npm test
```

Expect: **exit code 0**.

## Manual checklist

| Check | Pass |
| ---------------------------------------------------- | ---- |
| Kaleidoscope renders | ☐ |
| Randomness control changes look | ☐ |
| Pattern control changes look | ☐ |
| Reduced motion / photophobia pauses or softens drift | ☐ |
| Kids mode text remains readable | ☐ |
| No gambling / “sure win” / prediction wording | ☐ |
| Receipt poster shows page count + tones | ☐ |
| SVG + PNG download triggers (local file) | ☐ |
| `npm test` green | ☐ |

## Rollback

1. Remove `UncertaintyKaleidoscope*`, `ReceiptPoster*`, `notebookMeta*`, `receiptPosterExport*`.
2. Revert `ZPlayGardenPanel.jsx`, `playGardenTokens.js`, `playGardenMap.js`, `LocalNotebookPanel.jsx`, `App.jsx`, `package.json` version.
3. Remove or revert Phase 2.5 docs as needed.

## Sign-off

| Role | Name | Date |
| -------- | ---- | ---- |
| Operator | | |
