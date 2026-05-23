# Phase Z-RNS-FOUNDATION-1 — Green Receipt (Timeline & Evidence Vault)

**Phase:** Z-RNS-FOUNDATION-1
**Builds on:** Z-RNS-ARCH-1
**Date:** 2026-05-21
**Authority:** AMK-Goku / human review — **not** legal advice

## Scope

| In scope | Out of scope |
| -------- | ------------ |
| Timeline builder (IndexedDB) | Cloud sync |
| Evidence vault (local blobs) | AI API |
| Metadata tags / categories | Court filing |
| Evidence cards + media preview | PDF/ZIP binary bundles |
| Cause → effect event links | Voice capture runtime |
| Rights tracker (awareness) | Automated GDPR/CCTV send |
| Export manifest (JSON metadata) | Deployment |
| AI summary local mock | Legal advice claims |

## Deliverables

| Artifact | Path |
| -------- | ---- |
| Foundation doctrine | `docs/Z_RNS_FOUNDATION_HUB.md` |
| IndexedDB schema | `data/z_rns_foundation_schema.json` |
| Hub HTML | `dashboard/Html/z-rns-foundation-hub.html` |
| Hub script | `dashboard/scripts/z-rns-foundation-hub.js` |
| Hub styles | `dashboard/styles/z-rns-foundation-hub.css` |
| Verify script | `scripts/z_rns_foundation_check.mjs` |

## Acceptance

- [x] Timeline events persist in browser IndexedDB
- [x] Evidence files stored locally with metadata
- [x] Image/video preview from local blobs
- [x] Cause → effect links between timeline events
- [x] Rights tracker with overdue highlight
- [x] Export manifest preview + JSON download (metadata only)
- [x] AI summary is local template mock — no network
- [x] Voice notes blocked with charter message
- [x] Awareness strip — no vigilante / anti-law framing
- [x] No cloud, AI API, or legal-advice claims

## Verification

```bash
npm run z:rns:foundation
npm run verify:md
```

Open: `dashboard/Html/z-rns-foundation-hub.html` via hub static server.

## Locked law

```text
Structured chronology first. Everything else follows.
Awareness · organisation · preparation — not “beat the system.”
Process maps ≠ legal advice.
```

## Rollback

Revert foundation hub assets, schema, verify script, and this receipt from Git history. Operators may clear IndexedDB `z_rns_foundation_v1` in browser dev tools.
