# GW-1 — Publication contract

**Phase:** Golden Website GW-1
**Date:** 2026-08-27
**Authority:** GW-0A accepted · GW-1 open as **data only**
**Twin:** [data/golden-website/public/gw_public_knowledge_twin.json](../../data/golden-website/public/gw_public_knowledge_twin.json)

This contract is **publication law** for the Public Knowledge Twin. It is not a website, not an AI runtime, and not a deploy.

## Publication law (locked)

```text
PRIVATE SANCTUARY
        ↓
PUBLICATION REVIEW
        ↓
SANITIZATION
        ↓
EVIDENCE CHECK
        ↓
HUMAN APPROVAL
        ↓
PUBLIC KNOWLEDGE TWIN
```

**Private unless approved.**

No record enters `records[]` because it exists in the GW-0A overlay, because it has a green receipt, because HTML works, or because a candidate recommendation is optimistic.

## Deny by default

| Rule | Meaning |
| ---- | ------- |
| Default collection | `records: []` |
| Overlay existence | Not publication |
| Candidate recommendation | Not publication |
| Temporary ID survival | Not promotion |
| Human approval | Required for every public row |
| Automatic promotion | Forbidden |

GW-1 result: **zero** public twin records. That is valid and preferred.

## Identity split (do not collapse)

| Layer | Changes when branding changes? |
| ----- | ------------------------------ |
| `canonical_id` | No. Stable and boring. |
| `temporary_id` | No, until a promotion review. `canonical_id` stays `null`. |
| Public display name | Yes, allowed later. |
| `public_slug` | Yes, allowed later. Independent of canonical ID. |

GW-0A overlay still stores some temporary keys in `canonical_id` for inventory history. GW-1 maps those to `temporary_id` with `canonical_id: null`. Do not treat overlay inventory keys as promoted IDs.

## What the Twin is

A **sanitized public derivative** of Sanctuary overlay metadata, after review.

It is **not**:

- a new source of Sanctuary truth
- a replacement for `z_pc_root_projects.json`, master modules, monster registry, or engine index
- HODP, Morning Cockpit, or a live control plane
- Golden Guide AI runtime
- a deployable website

Later surfaces must consume **this same** public truth model:

- Portfolio Atlas
- Evidence Atlas
- Golden Universe Map
- Visual Gallery
- Prototype Museum
- Golden Guide AI
- Business Mode
- Human Benefit Mode
- Critic Mode
- Partner / Investor Gateway

Architecture: **Registry → Knowledge Twin → generated views**. One approved public record may later feed a card, a canvas node, an answer, a gallery link, a prototype link, an economic view, an impact view, and an evidence page. GW-1 does not generate those views.

## Reuse mappings (document only — no runtime)

| Future public surface | Existing Sanctuary systems to reuse, not duplicate |
| --------------------- | -------------------------------------------------- |
| Golden Guide AI (Ask Z-Sanctuary) | Z-EAII Knowledge Ask, Z-AI QADP, Z-Q&A&RP. **Not Zuno.** Zuno stays Sanctuary/personal. |
| Golden Universe Map | Navigator, ecosphere HTML, monster map, biology map, Magical Canvas PlayKit, Universal Canvas lite. One public map identity. |
| Evidence Atlas | Green receipts, AAFRTC / verify scripts, monster + dashboard registry verifies. Public language stays weaker than internal seals. |
| Prototype Museum | 22 prototype overlay rows now; 62 HTML files on disk later only after identity → relevance → functionality → dependencies → sanitization → security → evidence → approval. Do not iframe all 62. |
| Visual Gallery | 4 evidenced repo visuals (mostly ICIS, withhold) plus a later Visual Recovery Lane for chat/project mockups not in this clone. Four found ≠ four ever existed. |
| Business / investor filter | COMMERCIAL-READINESS, pricing doctrine, SUSBV, market map, entitlement catalog. Status ladder stays at `POTENTIAL_NOT_VALIDATED` until later phases. |
| Stakeholder vision | `docs/Z-STAKEHOLDERS-AND-BUSINESS-AI.md` — CONCEPT; data-room at most. |

## Forbidden in the Twin

Secrets, credentials, environment variables, personal/vault data, local/private IPs, sensitive internal paths, raw telemetry, raw private datasets, unpublished sensitive IP, internal security topology, unrestricted source dumps.

See [GW_0A_PUBLIC_PRIVATE_BOUNDARY.md](GW_0A_PUBLIC_PRIVATE_BOUNDARY.md) and [GW_1_CLAIM_POLICY.md](GW_1_CLAIM_POLICY.md).

## Withheld records

`withheld_records[]` may hold **only** safe metadata: IDs, type, withhold class, reason code, proposed exposure class.

Do not copy purpose text, notes, paths, visuals, or summaries into withheld rows.

## Stop

No Golden Website pages. No Golden Guide AI. No Golden Universe Map UI. No deploy. Await Steward review for GW-2.
