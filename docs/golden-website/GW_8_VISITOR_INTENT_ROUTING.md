# GW-8 — Visitor intent routing

**Phase:** Golden Website GW-8
**Date:** 2026-08-27
**Runtime:** CLOSED. This document is future routing policy, not a live classifier.

Intent changes **presentation and routing**, not factual truth. The same evidence rules apply to every visitor class.

## Intent classes

| Intent | Typical need | Default local routes |
| --- | --- | --- |
| PUBLIC_EXPLORATION | What is this? | `index.html`, `portfolio.html`, `gallery.html` |
| INVESTOR | Capital / return | Commercial QUALIFY + `index.html`. No valuation. |
| BUSINESS_PARTNER | Collaboration | Capability pages + limitations. No partnership offer invented. |
| RESEARCHER | Evidence and methods | Evidence Mode, Core, 14 DRP, Cycle Observe |
| GOVERNMENT_INSTITUTION | Governance / non-harm | 14 DRP, Turtle Mode, human-decides law |
| ENGINEER_CONTRIBUTOR | How it is built | Core, Navigator, Map foundation, Museum (local prototype) |
| CRITIC_REVIEW | Challenge claims | Critic Mode policy: limitations and gaps only |
| UNKNOWN | Unclassified | Treat as PUBLIC_EXPLORATION unless unsafe; else UNKNOWN |

## Rules

- Do not give investors a different evidence state than the public.
- Do not hide QUALIFIED from critics or upgrade it for partners.
- Private requests stay `PRIVATE_REFUSAL` for every intent.
- Hype questions stay `QUALIFY` even if the visitor is friendly.

Machine map: [data/golden-website/public/gw8_surface_routing.json](../../data/golden-website/public/gw8_surface_routing.json)
