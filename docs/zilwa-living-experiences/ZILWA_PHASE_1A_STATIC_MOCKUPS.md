# ZILWA LIVING EXPERIENCES — Phase 1A Static Mockups

**System ID:** ZILWA-1A
**Phase:** 1A — static awareness mockups only
**Branch:** `cursor/zsanctuary/zilwa-living-experiences-1a`
**Status:** Turtle Mode — presentation and education
**Hub:** Z-Sanctuary Universe

---

## Objectives

Phase 1A delivers a **museum-exhibit** visual prototype showing how the ZILWA ecosystem **could** look and feel — without runtime, data collection, or live operations.

| Objective | Phase 1A posture |
| ----------------------------- | ---------------------------------------------- |
| Guest journey storytelling | Static HTML timeline — synthetic guest |
| Ambassador role visibility | Fictional profile cards |
| Host-family dignity | Read-only capacity, rest, fair-value reminders |
| Elder oral history protection | Metadata only — content not displayed |
| Reef education | Illustrative metrics — not live monitoring |
| Community journeys | Informational cards — no maps or scheduling |

**Success condition:** Feels like _"a museum exhibit showing the future vision"_ — **not** a functioning tourism platform.

---

## Human gate

**Human Gate Required Before Any Phase 1B Work.**

Phase 1B may propose interactive wireframes, registry entries, or hub dashboard links — only after AMK / legal / community-steward review.

---

## Files

| File | Purpose |
| ---------------------------------------------------------------------------------------------------- | --------------------------- |
| [dashboard/Html/zilwa-guest-journey.html](../../dashboard/Html/zilwa-guest-journey.html) | Guest journey demonstration |
| [dashboard/Html/zilwa-ambassador-cockpit.html](../../dashboard/Html/zilwa-ambassador-cockpit.html) | Cultural ambassador cockpit |
| [dashboard/Html/zilwa-host-family-panel.html](../../dashboard/Html/zilwa-host-family-panel.html) | Host family welcome panel |
| [dashboard/Html/zilwa-elder-story-archive.html](../../dashboard/Html/zilwa-elder-story-archive.html) | Elder story archive mockup |
| [dashboard/Html/zilwa-reef-awareness.html](../../dashboard/Html/zilwa-reef-awareness.html) | Reef restoration awareness |
| [dashboard/Html/zilwa-community-journeys.html](../../dashboard/Html/zilwa-community-journeys.html) | Community journey planner |
| [dashboard/styles/zilwa-phase-1a.css](../../dashboard/styles/zilwa-phase-1a.css) | Shared static stylesheet |
| [ZILWA_PHASE_1A_STATIC_MOCKUPS.md](ZILWA_PHASE_1A_STATIC_MOCKUPS.md) | This document |

**Open locally:** serve `dashboard/Html/` via static file server or open HTML directly in browser (relative CSS path).

---

## Required safety banner (every page)

Every mockup displays:

```text
ZILWA Phase 1A · Static Awareness Prototype
Not Live · No AI Decisions · No Payments · No Health Data · No Guest Records
```

Page-specific badges:

| Page | Badge |
| ------------------ | -------------------------------------- |
| Guest journey | DEMONSTRATION ONLY — NOT A LIVE SYSTEM |
| Ambassador cockpit | SYNTHETIC DEMO DATA |
| Host family | DEMONSTRATION ONLY — NOT A LIVE SYSTEM |
| Elder archive | DEMONSTRATION ONLY — NOT A LIVE SYSTEM |
| Reef awareness | DEMONSTRATION ONLY — NOT A LIVE SYSTEM |
| Community journeys | DEMONSTRATION ONLY — NOT A LIVE SYSTEM |

---

## Governance rules

| Rule | Law |
| ------------------ | --------------------------------------------- |
| Financial figures | Illustrative projections only |
| Health passport | Future concept — not shown, not collected |
| Oral histories | Family ownership; story content not displayed |
| Ambassador ratings | Synthetic demo — not live reputation |
| Reef metrics | Illustrative data only — not verified science |
| Guest profiles | Fictional — no guest records stored |
| Booking / payments | Not present — read-only display |
| AI | No live AI — no automation scripts on pages |

Cross-reference Phase 0 pack: [ZILWA_MASTER_BLUEPRINT.md](ZILWA_MASTER_BLUEPRINT.md), [ZILWA_HEALTH_PRIVACY_AND_CHILD_SAFETY.md](ZILWA_HEALTH_PRIVACY_AND_CHILD_SAFETY.md), [ZILWA_ELDER_ORAL_HISTORY_POLICY.md](ZILWA_ELDER_ORAL_HISTORY_POLICY.md).

---

## Future HOLD registry (Phase 1B+)

| Item | Status |
| ------------------------------------------ | ------------------------------------- |
| React Native app | HOLD |
| Express / Node backend | HOLD |
| Databases | HOLD |
| Authentication / user accounts | HOLD |
| Payment flows / escrow | HOLD |
| Medical forms / health storage | HOLD |
| Voice recording / uploads | HOLD |
| Live AI panels | HOLD |
| External APIs (maps, weather, marine data) | HOLD |
| Deploy scripts / public bind | HOLD |
| Dashboard registry auto-wire | HOLD — optional Phase 1B after review |

---

## Phase 0 lineage

- [ZILWA_PHASE_0_SCOPE.md](ZILWA_PHASE_0_SCOPE.md)
- [ZILWA_GREEN_RECEIPT.md](ZILWA_GREEN_RECEIPT.md)

---

## Verification

| Command | Intent |
| ----------------------------------- | ---------------------------- |
| `npm run verify:md` | Markdown lint |
| `npm run z:traffic` | Traffic tower signal |
| `npm run z:car2` | Similarity scan |
| `npm run dashboard:registry-verify` | Dashboard registry integrity |

---

## Rollback

```bash
git checkout main
git branch -D cursor/zsanctuary/zilwa-living-experiences-1a
```

Remove `dashboard/Html/zilwa-*.html`, `dashboard/styles/zilwa-phase-1a.css`, and this doc; revert INDEX / AI_BUILDER rows if added.
