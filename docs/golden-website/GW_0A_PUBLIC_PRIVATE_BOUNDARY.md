# GW-0A — Public / private boundary

**Phase:** Golden Website GW-0A
**Date:** 2026-08-27
**Related:** [GW_0A_CANONICAL_PORTFOLIO_RECONCILIATION.md](GW_0A_CANONICAL_PORTFOLIO_RECONCILIATION.md)

No private or internal asset is exposed automatically. GW-0A created **zero** `PUBLIC_SAFE` overlay rows.

## Pipeline (locked)

```text
PRIVATE Z-SANCTUARY
        ↓
publication / sanitization gate  (human Steward + AMK-Goku)
        ↓
PUBLIC KNOWLEDGE TWIN            (GW-1+, not opened)
        ↓
Golden Website surfaces          (empty in GW-0A)
```

| Stage | What it is | What it is not |
| ----- | ---------- | -------------- |
| PRIVATE Z-SANCTUARY | Hub repo, Organiser, vaults, local dashboards, scientific lanes, receipts | Not the public internet |
| Publication / sanitization gate | Human review of **each** claim, path, screenshot, and ID | Not an AI auto-redact, not a deploy hook |
| PUBLIC KNOWLEDGE TWIN | Future sanitized explanation of the organism | Not a live control plane |
| Golden Website surfaces | Named public pages/sections after GW-1 mapping | Not HODP, not Morning Cockpit, not NAS |

Doctrine at the gate: observe → verify → suggest → **human decides**. Readiness ≠ deploy.

## Exposure classes (how records travel)

| Class | May leave private sanctuary? |
| ----- | ---------------------------- |
| `DO_NOT_PUBLISH` | Never via Golden Website |
| `PRIVATE` | Stay internal unless Steward reclassifies |
| `QUALIFIED_DATA_ROOM` | Named counterparties only, under NDA / steward process — not the public site |
| `PUBLIC_AFTER_SANITIZATION` | Eligible for Knowledge Twin **after** the gate |
| `PUBLIC_SAFE` | Allowed on the public site — **none assigned in GW-0A** |

## Forbidden public content

The following must not appear on the Golden Website, Knowledge Twin, or any auto-generated public page:

| Forbidden | Why |
| --------- | --- |
| Secrets | Tokens, keys, passwords, `.env` values |
| Credentials | Logins, API credentials, SSH material |
| Personal data | AMK-Goku vault history, family/health, identifiable people without consent |
| Sensitive private repository paths | Internal folder layouts that aid intrusion or dox operator machines |
| Raw internal telemetry | Zuno dumps, cycle-observe queues as live feeds, guardian raw logs |
| Security topology | Firewall, NAS share maps, RDP, expose-how-to-reach |
| Unreviewed IP | Formulas, product ideas, and research not cleared for public |
| Private datasets | Player captures, ICIS natural-image custody, vault snapshots |
| Development-only endpoints | Hub npm scripts as if they were public APIs |
| Local IPs | Loopback and LAN addresses (including dashboard bind URLs) |
| Environment variables | Names or values that reveal internals |
| Internal debug data | Stack traces, workbench shadows, `file://` operator notes |

Also forbidden without a separate sacred-move charter: Cloudflare production bind, public NAS, exposed RDP, live payment copy, auto-merge, autonomous execution.

## Classes of overlay records (default)

| Record kind | Default exposure |
| ----------- | ---------------- |
| Hub / HODP / SSWS cockpits | `PRIVATE` |
| PC-root sibling paths | `PRIVATE` (do not publish disk topology) |
| Vault / Folder Manager / TMK-Goku personal canon | `DO_NOT_PUBLISH` |
| ICIS fixtures, Bee Vision, ICIS-4 | `DO_NOT_PUBLISH` |
| Money / passport / panic / heart-and-genes monster cores | `DO_NOT_PUBLISH` or `HOLD` |
| Commercial checklists / prices | `QUALIFIED_DATA_ROOM` — no public price claims |
| 14 DRP / Ω high-level ethics | `PUBLIC_AFTER_SANITIZATION` (prose only) |
| Navigator role (read-only cockpit idea) | `PUBLIC_AFTER_SANITIZATION` after copy review |

## Sanitization gate checklist (human)

Before any record’s `golden_website_surfaces` is filled:

1. Strip local IPs, env, secrets, personal names beyond approved public identity.
2. Replace internal paths with public-safe names or omit them.
3. Downgrade implementation language: local `WORKING` UI ≠ public product.
4. Keep `commercial_status: POTENTIAL_NOT_VALIDATED` until billing evidence exists.
5. Confirm 14 DRP and Hierarchy Chief do not forbid the claim.
6. Steward signs the Knowledge Twin slice (future receipt — not this phase).

## GitHub vs public site

`docs/Z-ECOSYSTEM-GITHUB-INTEGRATION.md` describes **ecosystem identity for operators**. That is not permission to publish private repo contents. Private GitHub remains behind the same sanitization gate.

## Stop

GW-0A documents the boundary only. It does not open the Knowledge Twin or bind any public surface.
