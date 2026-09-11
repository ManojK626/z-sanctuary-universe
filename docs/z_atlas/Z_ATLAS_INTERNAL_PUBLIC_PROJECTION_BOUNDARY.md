# Z-Atlas Internal vs Public Projection Boundary

**Gate:** `Z-ATLAS-0-LIVING-MULTI-PROJECT-TOPOLOGY-CONSTITUTION`  
**Verdict language:** `PUBLIC_ATLAS_SANITIZATION_BOUNDARY: DEFINED`

No public website is created in this gate.

---

## Two Atlases (same organism, different projection)

| Atlas | Audience | May include |
| --- | --- | --- |
| **Internal Atlas** | Steward, operators, authorized AIs | Private Windows paths, worktrees, branches, receipts, HOLD mechanics, security topology references, internal evidence stores |
| **Public Atlas** (future Golden Website — Phase 5+) | Public / customers | Sanitized category → product → public-safe status only |

Public Atlas is a **projection**, not a second source of truth.

---

## PUBLIC_ATLAS_SANITIZATION_BOUNDARY: DEFINED

Public Atlas **must not** expose:

- private Windows paths (e.g. `C:\Z-Wheel Cracker`, Organiser worktrees)
- private branches or worktree names
- internal receipts and verify JSON
- secrets, credentials, tokens, Account IDs
- security topology (sentinels, vault internals, Triple-Check internals)
- unreleased formulas / private engines
- private incident details
- private evidence stores
- internal HOLD mechanics unless explicitly marked public-safe
- unpublished commercial eligibility / payment / referral internals
- unreleased physical-device or deployment-hold rationale

If a fact cannot be sanitized, it stays **internal-only**.

---

## Allowed public-safe classes (when a later gate authorizes publication)

- public product names that are already intended to be public
- Steward-declared public domains (as *declared*, not as live DNS proof)
- coarse public status that does not leak HOLD internals (e.g. “not generally available”)
- public-safe category membership

Even then: **UNKNOWN stays UNKNOWN**. Do not publish inferred GREEN.

---

## Domain ownership (document only — no DNS edits)

From historical/source-worktree evidence (`docs/Z_MULTI_PROJECT_DEPLOYMENT_READINESS_MATRIX.md`, `docs/Z_WHEEL_CRACKER_EXTERNAL_SOVEREIGN_POINTER.md`; not included in this Atlas custody PR; not available as canonical-main links at this gate). Domain ownership/current DNS state was not re-verified by this Atlas slice:

| Domain | Declared role | Public-safe statement |
| --- | --- | --- |
| `zsanctuaryuniverse.com` | Z-Sanctuary umbrella | Declared umbrella. ownership state: NOT RE-VERIFIED IN THIS SLICE; DNS liveness: UNVERIFIED; deployment state: NOT INFERRED |
| `zsanctuaryuniverse.org` | Public-interest / governance | Declared. ownership state: NOT RE-VERIFIED IN THIS SLICE; DNS liveness: UNVERIFIED; deployment state: NOT INFERRED |
| `zgameintel.com` | Gaming SaaS umbrella | Declared. ownership state: NOT RE-VERIFIED IN THIS SLICE; DNS liveness: UNVERIFIED; deployment state: NOT INFERRED |
| `zwheelcracker.com` | ZWheel flagship | Declared. ownership state: NOT RE-VERIFIED IN THIS SLICE; DNS liveness: UNVERIFIED; deployment state: NOT INFERRED |

Atlas records **declared ownership intent**. Atlas does not change Cloudflare or DNS.

---

## Commercial overlay (do not activate)

Public commercial claims require Steward authorization. Phase 0 records only:

- ZWheel → ZGame Intelligence family (contract REGISTERED, `commercialEligibility: NOT_AUTHORIZED`)
- payment ABSENT / HOLD
- no ZGI Commercial Core activation
- no referral / entitlement enablement

---

## Health vs deployment vs commercial (must not collapse)

Internal Atlas may show three independent overlays at once. Public Atlas may show none of them if sanitization fails.

Example that must remain expressible internally:

| Overlay | Example (ZWheel hub view) |
| --- | --- |
| Health | Local file identity GREEN (ZW-v37; not recertified by hub) |
| Deployment | HOLD / hub authority NONE / physical proof INSUFFICIENT or UNVERIFIED |
| Commercial | Family documented; payment ABSENT; domain ownership NOT RE-VERIFIED IN THIS SLICE; DNS liveness UNVERIFIED; deployment state NOT INFERRED |

---

## Verdict

```text
PUBLIC_ATLAS_SANITIZATION_BOUNDARY: DEFINED
Z_ATLAS_HEALTH_OVERLAY_BOUNDARY: PASS
Z_ATLAS_DEPLOYMENT_OVERLAY_BOUNDARY: PASS
Z_ATLAS_COMMERCIAL_OVERLAY_BOUNDARY: PASS
```
