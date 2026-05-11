# AMK-MAP-3 — Universal domain view (planning + UI)

**Purpose:** The same Z-Sanctuary organism map, filtered by **who is looking** — AMK/operator, kids, teens, adults, family, business, enterprise, or public visitor — without giving every lens the same control surface.

**Where it lives:** `dashboard/Html/amk-goku-main-control.html` reads `domain_views`, `service_catalog_sidebar`, `readiness_observatory`, `inspector_advisory`, and `launch_readiness` from `dashboard/data/amk_control_dashboard_map.json` (schema v3).

## View switcher

- **View as** is a `<select>` plus a short **emphasis hint** from JSON.
- Choice is stored in **browser localStorage** only (`amkGokuDomainView_v1`) for convenience — not identity, not auth, not sync.

## What each lens does

| Lens | Intent |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AMK-Goku / Operator** | Full sections; catalog shows all sensitivity tiers; still **no execution** from the page. |
| **Kids / Public Visitor** | Hides law/strip/ecosystem/health/rhythm/hero/operator queues/sealed/projects/safe-now/blocked/receipts/inspector/observatory/launch; shows **friendly welcome** copy + filtered catalog (learning + none only). |
| **Teens** | Hides blocked, receipts, observatory, launch, notification queue; keeps most learning/ops surfaces. |
| **Adults / Business / Enterprise** | Progressive exposure; enterprise sees security-tier catalog rows. |
| **Family** | Hides notification queue only by default (adjust in JSON if needed). |

## Side catalog

- Rows are **metadata** (icon, domain, ages, bridge, risk, links).
- **Pricing / entitlement** lines render only for **business**, **enterprise**, and **amk_operator** views so kids/teens never see owner strings on the same card layout.

## Readiness observatory

- Scores are **internal readiness metadata** when present; null → **UNKNOWN**.
- **Not** certification, **not** public ranking, **not** live user feedback.

## AI inspector block

- Lists which subsystems **advise** (Z-Traffic, CAR², SUSBV, VH100, MCBURB/FBAP, Zuno, ZAG, Z-Zebras preview).
- **Advise ≠ execute** — copy in JSON and on page.

## Launch readiness ceremony

- **Symbolic:** aggregates gates, blocked mirror, and human-approval line.
- **Does not** deploy to Cloudflare, **does not** run npm, **does not** publish services.

## Key law

- Dashboard view ≠ service access.
- Service listing ≠ entitlement.
- Rating ≠ certification.
- Launch readiness ≠ deployment.
- User feedback ≠ allowed until consent, privacy policy, deletion controls, and 14 DRP review.

## Receipt

[PHASE_AMK_MAP_3_GREEN_RECEIPT.md](PHASE_AMK_MAP_3_GREEN_RECEIPT.md)
