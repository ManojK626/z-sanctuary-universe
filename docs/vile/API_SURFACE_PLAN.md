# API Surface Plan

**Status:** Design · Phase 2  
**Gateway:** `apps/api` (future VILE API, not generic hub seed without charter)

## Versioning

```text
/v1/...  — stable public contract
```

Breaking changes require new major version + migration doc.

## Domain groups

| Group | Example routes (illustrative) | DRP |
| ----- | ----------------------------- | --- |
| Destinations | `GET /v1/destinations` | Standard |
| Experiences | `GET /v1/experiences` | Standard + culture safety |
| Itineraries | `POST /v1/itineraries/plan` | Orchestrator + Shadow |
| Bookings | `POST /v1/bookings` | **HOLD** — payment gate |
| Vendors | `POST /v1/vendors/onboard` | Compliance heavy |
| Emergency | `GET /v1/emergency/bundle` | Offline-signed content |
| Health info | `GET /v1/health/guides` | Medical disclaimers |
| Research | `GET /v1/research/export` | Government charter |

## Middleware stack (every route)

```text
TLS → auth → rate limit → DRP → shadow (if AI) → handler → audit
```

## Errors

Structured problem+json — no stack traces or PII to clients.

## Phase 1

OpenAPI **outline** optional in Phase 2 charter — not required for doc-only foundation.

## Related

- [DRP_MIDDLEWARE_ARCHITECTURE.md](DRP_MIDDLEWARE_ARCHITECTURE.md)  
- [Z_API_READINESS_AND_SMOKE_GATE.md](../Z_API_READINESS_AND_SMOKE_GATE.md)  
