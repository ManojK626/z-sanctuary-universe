# VILE Platform Modules (`apps/`)

**Posture:** Surface map · Phase 2+ implementation

## Module table

| App | Primary users | Core capabilities | Phase |
| --- | ------------- | ----------------- | ----- |
| `traveller` | Visitors | Search, book, offline wallet, emergency | 2 |
| `vendor` | Guides, artisans, hosts | Onboarding, listings, payouts (abstracted) | 2–3 |
| `operations` | Z-Sanctuary ops | Moderation, incidents, audit review | 2 |
| `government` | Agencies (read-heavy) | Aggregated insights, compliance exports | 4 |
| `research` | Academia, NGOs | Consent-gated datasets | 3–4 |
| `community` | Locals, stewards | Stories, ambassador network | 3 |
| `mobile` | All roles | Offline-first shell (React Native charter) | 2+ |
| `api` | Integrations | Versioned HTTP/gRPC — DRP on every route | 2 |
| `dashboard` | AMK, operators | Read-only + gated actions — hub HODP alignment | 1–2 |

## Hub seeds (today)

| Path | VILE relationship |
| ---- | ----------------- |
| `apps/web` | Next.js seed — **not** VILE traveller app until chartered |
| `apps/api` | API seed — align with [API_SURFACE_PLAN.md](API_SURFACE_PLAN.md) when Phase 2 opens |
| `dashboard/` | Operator cockpit — ZILWA exhibits already live as static HTML |

## Module boundaries

```text
traveller  ──┐
vendor     ──┼──► api (gateway + DRP) ──► zuno-orchestrator ──► agents
operations ──┘
```

- **No** business logic in dashboard HTML beyond read-only fetch  
- **No** payment keys in `vendor` or `traveller` — `zuno-payments` adapter only  
- **government** and **research** are export/read-heavy — extra legal review  

## ZILWA exhibit mapping

Static exhibits (`dashboard/Html/zilwa-*`) inform UX and doctrine for:

- `traveller` — cultural experiences  
- `community` — steward and elder stories  
- `operations` — safeguarding panels  

Exhibits are **not** production apps. See [ZILWA_VILE_RELATIONSHIP.md](ZILWA_VILE_RELATIONSHIP.md).
