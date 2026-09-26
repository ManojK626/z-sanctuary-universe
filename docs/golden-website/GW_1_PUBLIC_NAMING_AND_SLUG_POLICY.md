# GW-1 — Public naming and slug policy

**Phase:** Golden Website GW-1
**Date:** 2026-08-27
**Steward names locked below.** Branding changes must not rewrite canonical IDs.

## Locked public names

| Role | Locked name |
| ---- | ----------- |
| Public umbrella | Z-Sanctuary Universe |
| Public website | The Golden Website |
| Website subtitle | Gateway to the Z-Sanctuary Universe |
| Public Q&A | Golden Guide AI |
| Q&A UI call-to-action | Ask Z-Sanctuary |
| Public map | Golden Universe Map |
| Map subtitle | Interactive Z-Sanctuary Canvas |

## Three layers (never collapse)

```text
canonical identity  ≠  public display name  ≠  public slug
```

| Field | Example | Rule |
| ----- | ------- | ---- |
| `canonical_id` | `univ_workstation_navigator` | Stable, boring, existing hub ID where it already exists. Do not change because the website title changed. |
| `temporary_id` | `ZS-AI-004` | Used only while `id_status` is `TEMPORARY_PENDING_CANONICAL_REVIEW`. Then `canonical_id` is **null**. |
| Public display name | Golden Guide AI | May evolve in later phases. |
| `public_slug` | `golden-guide-ai` | URL/token for generated views. May evolve. Must not be treated as the canonical ID. |

Example (canonical record, after a future promotion — **not done in GW-1**):

```json
{
  "canonical_id": "univ_workstation_navigator",
  "public_slug": "golden-universe-map",
  "id_status": "CANONICAL"
}
```

Example (temporary record — GW-1 mapping):

```json
{
  "canonical_id": null,
  "temporary_id": "ZS-AI-004",
  "public_slug": null,
  "id_status": "TEMPORARY_PENDING_CANONICAL_REVIEW"
}
```

Do not canonize all 25 temporary IDs because they survived inventory.

## Promotion (not in GW-1)

A temporary ID may become canonical only when **all** are true:

- unique identity
- resolved aliases / no collision
- stable parent
- stable type
- source-of-truth pointer
- Steward promotion decision

Queue: `data/golden-website/gw_identity_promotion_queue.json`. **Promoted this phase: 0.**

## What must not be a public brand

| Internal name | Public rule |
| ------------- | ----------- |
| Zuno | Not the public chatbot. Personal/Sanctuary guide only. |
| Z-EAII / Knowledge Ask / QADP / Z-Q&A&RP | Reuse as **inputs** to Golden Guide AI after sanitization. Do not ship four public Q&A products. |
| Universe 2 / `z-sanctuary-universe-2` | Internal/legacy alias. Not a competing public brand unless later evidence says it is a distinct product. |
| Z-HODP / Morning Cockpit | Operator surfaces. Not The Golden Website. |
| Bee Vision / ICIS-4 | Closed. Not a public product name. |

## Slug hygiene

- Lowercase kebab-case.
- No local IPs, no file paths, no secret tokens.
- Do not mint slugs for withheld/private rows in GW-1.
- GW-1 assigned a **proposed** slug only for `ZS-PROJECT-000` → `the-golden-website`. That does **not** publish the record.

## Stop

Naming is locked for GW-1 surfaces that do not exist yet. Do not build pages that use these names in GW-1.
