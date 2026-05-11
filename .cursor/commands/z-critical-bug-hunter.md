# Z-Critical Bug Hunter

Use **only** for high-severity correctness review in a **controlled lane** — not routine cleanup.

## Invoke

1. Open **Custom agent** (or task chat) and choose agent **`z-critical-bug-hunter`**, **or**
2. Paste the copy-ready prompt from **[docs/Z-CRITICAL-BUG-HUNTER-BRIEF.md](../../docs/Z-CRITICAL-BUG-HUNTER-BRIEF.md)** (section “Cursor-ready prompt”).

## Rules (short)

- Read-only investigation first; **no PR** unless explicitly approved.
- No broad refactors; no style-only fixes; no secrets/deploy/payment/governance unless explicitly in scope.
- Respect Handshake + Doorway/Escort; provide rollback plan when proposing fixes.

## Not for

Constant scanning, auto-fix bots, or low-severity churn.
