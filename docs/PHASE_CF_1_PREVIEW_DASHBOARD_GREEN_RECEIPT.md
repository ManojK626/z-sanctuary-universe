# Phase CF-1 — Cloudflare Pages preview dashboard (green receipt)

**Formal ID:** CF-1 — Preview dashboard posture only. **Not** production launch, domain binding, Workers, secrets, R2, Vectorize, Access, or AI routes.

**Doc type:** Docs-only receipt + manual testing checklist (no Cloudflare mutations from this file).

**Non-goals (this receipt must not trigger):** creation of Workers, rotation or creation of secrets, R2 buckets, Vectorize, Access policies, production or preview custom domain bindings beyond the existing Pages preview alias, or production deploys.

## Hub gates (required — re-run after receipt or dashboard path changes)

From repo root (`z-sanctuary-universe`):

```bash
npm run verify:md
npm run z:traffic
npm run z:car2
```

These scripts are the sealed **GREEN** receipts for markdown hygiene, traffic minibots status, and CAR² scan (see `cloudflare-governance/VERIFY_COMMANDS.json` for the wider matrix).

## Current state (operator snapshot)

| Item | Status |
| ---------------------------------- | ---------------------------------------------------------- |
| GitHub `main` | Synced with hub expectations |
| Local git (before preview checks) | Clean |
| Wrangler | Authenticated (operator-managed) |
| Cloudflare Pages project | `z-sanctuary-universe` |
| Preview URL / branch-style alias | `https://preview-dashboard.z-sanctuary-universe.pages.dev` |
| Dashboard UI | Opens successfully on preview |
| Production / custom domain binding | **HOLD** — not applied for this phase |
| Preview security headers | `dashboard/_headers` (deployed with preview) |

## Preview URL, branch alias, and scope

- **Primary preview URL:** `https://preview-dashboard.z-sanctuary-universe.pages.dev`
- **Branch / preview alias:** Hostname segment `preview-dashboard` on `*.z-sanctuary-universe.pages.dev` (confirm the active deployment in Cloudflare Pages → **z-sanctuary-universe** → **Deployments** matches this preview URL for the synced `main` build).
- **Scope:** Static Pages preview for dashboard assets; governance pack lives under `cloudflare-governance/` (see [../cloudflare-governance/README.md](../cloudflare-governance/README.md)).

## Security headers (preview)

Source file: `dashboard/_headers` (repo path: `dashboard/_headers`).

| Header | Role |
| -------------------------------------------------- | --------------------------------------------------------- |
| `X-Frame-Options: DENY` | Reduce clickjacking on preview |
| `X-Content-Type-Options: nosniff` | Reduce MIME confusion |
| `Referrer-Policy: strict-origin-when-cross-origin` | Tighter referrer leakage |
| `Permissions-Policy` | Disables camera/mic/geolocation in browser policy surface |
| `X-Robots-Tag: noindex` | Discourage indexing of preview |

## Required gates (hub receipts)

These gates **passed** for the sealed posture described by the operator (GitHub `main` synced; local clean before preview checks; Wrangler authenticated; preview live):

| Gate | Command |
| -------- | ------------------- |
| Markdown | `npm run verify:md` |
| Traffic | `npm run z:traffic` |
| CAR² | `npm run z:car2` |

Re-run after any doc or dashboard path change affecting preview. Record new outcomes in your operator log if policy requires it.

## Production HOLD (explicit)

- **No** production custom hostname binding for this receipt.
- **No** production deploy lane opened by this document.
- **No** Workers, **no** new secrets, **no** R2 buckets, **no** Vectorize, **no** Access policies, **no** AI/Workers routes created by this phase.

## Manual test checklist (preview)

Complete in a normal browser (or operator device). Record date and outcome in your own log if needed.

- [ ] **Root preview opens** — Load `https://preview-dashboard.z-sanctuary-universe.pages.dev` (or the current preview root URL for the deployment); expect HTTP 200 and the dashboard shell or configured index.
- [ ] **Open Dashboard UI link works** — From preview root, follow the main dashboard entry (same-origin paths under the preview host); navigation succeeds without mixed-content errors for static assets.
- [ ] **`/Html/index-skk-rkpk.html` opens** — e.g. `https://preview-dashboard.z-sanctuary-universe.pages.dev/Html/index-skk-rkpk.html` (path relative to preview root; repo source: `dashboard/Html/index-skk-rkpk.html` — casing `Html` must match deployment output).
- [ ] **No production domain binding** — Address bar stays on `*.pages.dev` (or another non-production preview host); no apex or production custom domain is required for this checklist.
- [ ] **No Workers, secrets, R2, Vectorize, Access policies, domain bindings, or AI routes** — In the Cloudflare account UI, confirm none of these were created **for** this preview-only phase (operator visual check).

## Governance references

- [cloudflare-governance/README.md](../cloudflare-governance/README.md)
- [cloudflare-governance/VERIFY_COMMANDS.json](../cloudflare-governance/VERIFY_COMMANDS.json)
- [cloudflare-governance/TEST_MATRIX.json](../cloudflare-governance/TEST_MATRIX.json)
- Hub precautions: [Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md](Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md) (if applicable to future AI edge work)

## Rollback (docs-only phase)

1. Remove or archive this file if the phase is superseded.
2. Remove the link from `cloudflare-governance/README.md` if the receipt is retired.
3. Preview decommission remains a **human + AMK** Cloudflare UI / project action — not automated from this repo receipt.

---

**Seal:** CF-1 preview dashboard receipt is **documentation + checklist only**. GREEN hub checks do not authorize production deploy or domain binding.
