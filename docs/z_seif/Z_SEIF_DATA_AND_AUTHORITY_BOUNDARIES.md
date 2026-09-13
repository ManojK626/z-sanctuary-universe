# Z-SEIF Data and Authority Boundaries

**Gate:** `Z-SEIF-0`  
**Posture:** CONCEPTUAL — NOT RUNTIME  
**Do not move any data in this phase.**

## Data classes

| Class | Meaning | Permitted destinations |
| --- | --- | --- |
| `PUBLIC` | Already public or deliberately publishable | Cloudflare public edge, public GitHub docs, public Atlas projection |
| `INTERNAL` | Organism operations, not public | Controlled cloud, internal Atlas, Access-protected surfaces |
| `PRIVATE_PRODUCT` | Sovereign product internals | Product repo + product runtime only; cloud only if that product’s Steward gate allows |
| `PRIVATE_USER` | User analytical history, images, device evidence | Local-first / strongly restricted. No convenience cloud ingest |
| `STEWARD_ONLY` | Operator / security / incident detail | Access-protected only |
| `SECRET` | Tokens, keys, credentials | Secret store only. Never receipts, git, or Atlas |
| `CREATOR_VAULT` | Creator-tier architecture / unpublished engines | No general cloud ingestion. No Vectorize. No public Atlas |

Example desired posture:

```text
PUBLIC            → Cloudflare permitted
INTERNAL          → controlled cloud permitted
PRIVATE_PRODUCT   → conditional
PRIVATE_USER      → local-first / strongly restricted
STEWARD_ONLY      → Access-protected only
SECRET            → secret store only
CREATOR_VAULT     → no general cloud ingestion
```

## AI data boundary

`LOCAL VERIFIED KNOWLEDGE FIRST`  
`OPTIONAL EXTERNAL AI SECOND`

External AI must not automatically receive:

- proprietary formulas
- raw roulette history
- private images
- user records
- Creator-tier architecture
- secrets
- unrelated project context

Future AI Gateway is **governed routing and observability only**. Do not configure it in Phase 0.

Product engines remain math/authority inside their sovereign trees. Graphics visualize. MiniBots observe. Local AI explains. User / Steward decides.

## Least-capability binding

`LEAST_CAPABILITY_BINDING`

A future Worker or Agent receives the smallest set of:

- storage
- AI
- queues
- workflow
- database
- secrets

required for its role.

```text
ZWheel Worker  ≠  Z-Learn Worker  ≠  Z-Sanctuary Control Worker
```

No universal unrestricted binding. No shared universal secrets. No cross-product unrestricted storage.

## Public vs internal Atlas

Preserve the [Z-Atlas projection boundary](../z_atlas/Z_ATLAS_INTERNAL_PUBLIC_PROJECTION_BOUNDARY.md):

| Surface | May contain |
| --- | --- |
| Internal Z-SEIF / Z-Atlas | Operational topology, worktrees, HOLD mechanics, security posture references |
| Public Atlas | Sanitized category → product → public-safe status only |

Public surfaces must not expose local paths, secret architecture, internal branch/worktree state, security controls, private formulas, internal incident mechanics, or Creator-tier material.

## Security doctrine

- Least privilege and least capability
- No raw private data replication
- No public internal Atlas
- No autonomous production release
- Access for internal Steward surfaces
- Secret values never written to receipts
- Every privileged mutation creates evidence

## Cost doctrine

Future **Z-Cost Guardian** (design only) should observe Workers requests, AI inference, storage, database, queues, vector indexes, browser rendering, containers, and egress.

No billing automation and no paid capability activation in Phase 0.

`DATA_CLASSIFICATION: DEFINED`  
`AI_DATA_BOUNDARY: DEFINED`
