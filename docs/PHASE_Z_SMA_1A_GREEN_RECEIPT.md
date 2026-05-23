# Phase Z-SMA-1A — Green Receipt (Consent & Language Polish)

**Phase:** Z-SMA-1A — UI polish only
**Builds on:** Z-SMA-1 Turtle seed
**Date:** 2026-05-23
**Authority:** AMK-Goku / family review — private only

## Scope

| In scope | Out of scope |
| -------- | ------------ |
| Visible consent status badges | Real stories |
| Private-only warning strip | Storage / save |
| Export receipt preview (read-only) | AI calls |
| Clearer Creole / English / French labels | Backend |
| Human-readable privacy descriptions | Public sharing |

## Deliverables

| Artifact | Change |
| -------- | ------ |
| `dashboard/Html/z-sma-true-life-hub.html` | Private strip, export preview, Z-SMA-1A badge |
| `dashboard/scripts/z-sma-true-life-hub-readonly.js` | Consent badges, receipt preview, i18n polish |
| `dashboard/styles/z-sma-true-life-hub.css` | Strip, badges, export preview styles |
| `docs/PHASE_Z_SMA_1A_GREEN_RECEIPT.md` | This receipt |

## Acceptance

- [x] Consent badges visible on sister and group lanes
- [x] Private-only warning strip below toolbar
- [x] Export receipt preview (JSON, preview-only — no download)
- [x] Clearer language selector labels
- [x] Human-readable privacy descriptions
- [x] Default privacy remains `private_only`
- [x] No real trauma text
- [x] No storage, AI, backend, or external network beyond seed GET

## Verification

```bash
npm run verify:md
npm run dashboard:registry-verify
```

Open: `dashboard/Html/z-sma-true-life-hub.html` over http.

## Locked law

```text
Real people first. AI second. Public last.
Soft, truthful, protected, human-first.
```
