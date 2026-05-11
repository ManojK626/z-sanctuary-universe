# Z-B2B & partner authentication — build sketch (pre-wiring; MODULE-BUILD-PLAN style)

**Status:** _Specification only_ — no production B2B or OAuth in the hub until legal + security + Hierarchy Chief sign-off.
**Relation:** Sits _above_ `apps/web` dev session (`zs_session` / `zs_experience`); _replaces_ them for enterprises when a real IdP and DPA are in place.
**As-of:** 2026-04-26 (aligns with [AGENTS.md](../AGENTS.md) and the continuation “web-first” product note: `Z_Sanctuary_Universe 2/docs/product/Z-SANCTUARY_WEB_FIRST_SERVICE_VISION.md` from the Organiser, sibling of this hub).

---

## 1. Module identity

| Field | Value |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Name** | `z-b2b-partner-access` (working title) |
| **Purpose** | Let **vetted partners** (OEM, operator, B2B tenant) access **versioned Z-Sanctuary APIs** and optional **web** flows using **industry-standard auth**, without implying hardware/OS integration. |
| **Authority** | Same roof as the hub: Z-Super Overseer / Z-SSWS / Hierarchy Chief; no second governance plane. |

---

## 2. In scope (later phases)

- **User auth (B2C-style):** OAuth2 / **OpenID Connect** for end users (Authorization Code + PKCE for public clients; server-side code flow for confidential clients).
- **Partner / B2B machine access:** **OAuth2 client credentials** (or mTLS + short-lived tokens) for server-to-server; per-tenant **client_id**, **rotating secrets**, **IP allowlist** (optional), **scoped** API keys in audit trail.
- **Event delivery (optional):** **Signed webhooks** (HMAC body + timestamp + `Idempotency-Key`) for “lane registered”, “entitlement changed”, _etc._ — product-defined; no silent PII in payloads by default.
- **Contracts (non-code):** DPA, BAA if health-adjacent, DPA for EU/UK, acceptable-use; **Data Processing Addendum** template pointer in ops, not in repo secrets.

## 3. Explicit non-goals (until re-scoped)

- “One click connect every OEM” without **legal and technical** integration.
- Storing end-user PII in hub **monolith** without a **separate** store + encryption policy + DSR process.
- Replacing **GGAESP / Z-ECR** with partner scores as authority; partner signals are **input**, not governance roof.

---

## 3.1 Current hub reality (do not conflate)

| Surface | What it is |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| `apps/web` `POST /api/auth/dev-session` + `zs_session` | **Dev** shared token + HMAC cookie. |
| `zs_experience` + `/api/account/experience` | **Product preference** (UI), not partner integration. |
| This sketch | **Target** architecture for _future_ B2B/OAuth; implement only after checklists below. |

---

## 4. Trust boundaries (must document before any wire)

1. **Tenant model:** `tenant_id` on every B2B token and every webhook; no cross-tenant data paths without explicit product + legal approval.
2. **Classification:** which fields are _public / partner-confidential / end-user PII_; PII default **off** the hot path.
3. **Retention + deletion:** webhook logs, access logs, and IdP subject mapping — **retention cap** and **erasure** story per jurisdiction.
4. **Kill switch:** feature flag to disable _all_ partner client credentials and block webhooks at the edge.
5. **Audit:** append-only (or WORM) operator log for client creation, secret rotation, scope changes.

---

## 5. Phased delivery (suggested)

| Phase | Name | Outcome | Gate to next |
| ------ | ------------ | --------------------------------------------------------------------------------------------------- | ------------------------------- |
| **P0** | _Paper_ | DPA + scope matrix + data map | Legal + security review |
| **P1** | _Stub_ | `openapi.yaml` (or `packages/`) for **one** `GET /v1/health` + one **m2m**-scoped read; **no** PII. | AAFRTC / Z-SCTE per change size |
| **P2** | _Pilot_ | One IdP in **staging** (e.g. Auth0/Entra) + one pilot tenant, rate limits, webhook replay queue. | Pilot contract signed |
| **P3** | _Production_ | Rota secrets, SLO, on-call, incident playbooks | `manual_release` + overseer |

---

## 6. API shape (illustrative; not implemented here)

- **Base path:** e.g. `/api/v1/partner/...` (separate from `dev-session`).
- **Versioning:** URL or header; **one** version live in production per product rule.
- **Errors:** JSON `{ "error", "code", "request_id" }`; no stack traces in prod.
- **Rate limits:** per `client_id` and per `tenant_id`; 429 with `Retry-After`.

---

## 7. OpenID Connect (end users) — design notes

- **Discovery** via `.well-known/openid-configuration` when using a managed IdP.
- **Claims:** `sub` stable per IdP; map to **internal** `z_user_id` in your user store; never send raw PII to GGAESP training by default.
- **Session:** browser uses **IdP session** + optional **BFF**; retire `zs_session` in prod in favour of same-origin session bound to **opaque** server session id.

---

## 8. Webhook contract (if used)

- **Sign:** `HMAC-SHA256(secret, timestamp + body)`; reject skew > 5m.
- **Order:** at-least-once; consumers **idempotent** by `Idempotency-Key` + `event_id`.
- **Payload:** minimal, **no** unnecessary PII; event schema versioned.

---

## 9. What implementers do next (when approved)

1. Add **module manifest** row (per hub MODULE-BUILD-PLAN habitus) in the registry the Overseer actually reads.
2. Create **P1** OpenAPI file + one route in `apps/api` or a **separate** service if scale/isolation require it.
3. **Do not** remove dev auth from `apps/web` until **P2** has a product decision and migration note.

---

## 10. Reference links (this repo / cousin)

- [GGAESP-360 — pointer (hub)](GGAESP-360-CODEX-POINTER.md)
- [AGENTS.md](../AGENTS.md)
- `Z_Sanctuary_Universe 2/scripts/z_suc2_slice_product_module_hints.json` (field `governance.relatedHubDocs`)

_End of sketch. Implement only as versioned, reviewed slices._
