# Z-ECO-MAP — Ecosystem Knowledge Topology Engine (Phase 0)

**Lane:** Z-ECO-MAP-0 (doctrine + topology registry; advisory only)  
**Hub:** Z-Sanctuary Universe

## Mission

Z-ECO-MAP makes the **governed AI universe understandable**: how hubs, satellites, assistants, gateways, payment lanes, deploy zones, and backup lanes relate — without becoming an orchestrator.

It answers: *who touches what, what may share a layer, what must stay isolated, and where resilience lives.*

## Non-mission

Z-ECO-MAP is **not**:

- an autonomous controller or deployment brain
- an auto-merger of repos, registries, or branches
- payment, legal, or infrastructure authority
- an AI execution layer or minibot runner
- a Cloudflare or NAS mutator

**Standing law:**

```text
observe → classify → suggest → human decides
```

Machine roster: `data/z_eco_map_topology_registry.json`.

---

## Inputs (read-only)

| Class | Sources |
| --- | --- |
| PC / EAII roster | `data/z_pc_root_projects.json` |
| Monster catalog | `data/z_sanctuary_monster_project_registry.json`, [Z_SANCTUARY_MONSTER_PROJECT_MASTER_MAP.md](./Z_SANCTUARY_MONSTER_PROJECT_MASTER_MAP.md) |
| Satellite bridges | `data/z_satellite_control_link_manifest.json` |
| Module / dashboard | `data/z_module_manifest.json`, `data/z_mdg_dashboard_registry.json`, `dashboard/data/z_universe_service_catalog.json` |
| Gateway | `data/z_local_gateway_registry.json` (when present), E2 gateway docs |
| Deduplication | [Z_MODULE_DEDUPLICATION_EVOLUTION_ENGINE.md](./Z_MODULE_DEDUPLICATION_EVOLUTION_ENGINE.md) |
| Fusion co-design | [Z_FUSION_CO_DESIGN_ENGINE.md](./Z_FUSION_CO_DESIGN_ENGINE.md) |
| Backup lanes | [Z_SAFE_BACKUP_AND_SOURCE_ARCHIVE_POLICY.md](./Z_SAFE_BACKUP_AND_SOURCE_ARCHIVE_POLICY.md) |
| Payment ownership | [Z_PAYMENT_OWNERSHIP_AND_BUSINESS_AI_GOVERNANCE.md](./Z_PAYMENT_OWNERSHIP_AND_BUSINESS_AI_GOVERNANCE.md) |
| Traffic / overseers | [Z_TRAFFIC_MINIBOTS.md](./Z_TRAFFIC_MINIBOTS.md), Hierarchy Chief |
| Cloudflare posture | [Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md](./Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md) |

Z-ECO-MAP **reads** these; updates happen only via human-reviewed PRs.

---

## Classifications (project posture)

| Label | Meaning |
| --- | --- |
| `hub_governance` | Canonical control root (Z-Sanctuary hub) |
| `member_workspace` | PC-root sibling repo |
| `external_hosted` | Link-only or off-PC host (Replit, etc.) |
| `analytics_platform` | Data/analysis surface (e.g. Roulette) |
| `creative_production` | OMNAI / media doctrine lanes |
| `quest_narrative` | Z-QUESTRA and narrative stacks |
| `device_ai_lane` | Z-DAIO / device-trust posture |
| `knowledge_companion` | ÉirMind / Aisling-style companions |
| `companion_creative` | Franed / AT Princess & Blackie |
| `lab_capsule` | Z_Labs sibling (supervised analysis) |
| `skyscraper_surface` | Large dashboard / tower surfaces |
| `vault_member` | Vault-adjacent folders |
| `governance_engine` | Read-only hub engines (MDE, FUSION, ECO-MAP, Traffic) |
| `research_only` | Experimental; no production bind |
| `blocked_unsafe` | Must not auto-link or auto-deploy |

---

## Relationship types (controlled labels)

| Label | Meaning |
| --- | --- |
| `SHARED_SERVICE_LAYER` | Shared utility (registry, gateway catalog, identity docs) |
| `FUSION_CANDIDATE` | May combine under Z-FUSION charter |
| `VISUAL_COMPANION` | UI/design relationship only |
| `KNOWLEDGE_PEER` | Shares advisory AI knowledge patterns |
| `DEPLOYMENT_ISOLATED` | Must deploy on separate targets |
| `PAYMENT_ISOLATED` | Separate Stripe/PayPal/business ownership |
| `GATEWAY_VISIBLE` | Observable via local gateway / doorway; read-only |
| `RESEARCH_ONLY` | Experimental edge |
| `BLOCKED_UNSAFE` | Never auto-link |

Edges live in the registry `relationships[]` array.

---

## Ownership boundaries

- **Payment:** per [Z_PAYMENT_OWNERSHIP_AND_BUSINESS_AI_GOVERNANCE.md](./Z_PAYMENT_OWNERSHIP_AND_BUSINESS_AI_GOVERNANCE.md) — topology **documents** lanes; does not merge them.
- **Legal / evidence (Z-LGR posture):** legal cores stay `PAYMENT_ISOLATED` + `DEPLOYMENT_ISOLATED` from marketing and analytics unless chartered.
- **Vault / personal:** READ-ONLY sincerity frequency; never GitHub-commit vault exports.
- **Hub authority:** `Z_Sanctuary_Universe` is governance root; satellites carry thin bridge only.

---

## Deployment topology

Future-safe **resilience stack** (observability, not execution order):

```text
Local PC (working tree)
    ↓
Z-Lab (supervised capsule — optional sibling)
    ↓
Z-Sanctuary Hub (governance + registries + read-only dashboards)
    ↓
GitHub Mirror (versioned source + docs + receipts)
    ↓
Cloudflare Edge (deployed apps — charter + HOLD default)
    ↓
NAS Sovereign Archive (private encrypted backups — NAS_WAIT until verified)
```

| Zone | Typical content | Z-ECO-MAP posture |
| --- | --- | --- |
| `local_pc` | Active repos, local reports | Operator-controlled |
| `z_lab` | Analysis capsule | Bridge sync; no hub authority inversion |
| `hub` | Doctrine, manifests, dashboards | Canonical |
| `github` | Source, registries, scripts | PR + human merge |
| `cloudflare_pages` | Static / Pages | HOLD until receipt |
| `cloudflare_containers` | API containers | Charter only |
| `replit_external` | Legacy / parallel host | Link-only until migrated |
| `nas_sovereign` | Cold backup | `NAS_WAIT` default |

---

## AI relationships

| Layer | Examples | Topology note |
| --- | --- | --- |
| **Assistants** | Cursor, Claude core, Copilot members | `KNOWLEDGE_PEER` or `VISUAL_COMPANION`; separate forbiddens |
| **Minibots** | Z-Traffic, CAR², pattern-safe | `GATEWAY_VISIBLE`; read-only signals |
| **Overseers** | Z-Super Overseer, EAII, deployment readiness | Hub-scoped; suggest only |
| **Guardian interpretation** | Guardian loop, QOSMEI fusion (advisory) | No override of human sacred moves |

Z-ECO-MAP links AI rows to projects; it does **not** fuse runtime agents.

---

## Fusion pathways (Z-FUSION interaction)

```text
Z-ECO-MAP (topology map)
    ↑ reads
Z-MDE (exists / overlap?)
    ↓ if overlap
Z-FUSION (combine better?)
    ↓
Human approval → Turtle PRs
```

Topology edges marked `FUSION_CANDIDATE` are **hints** for Z-FUSION proposals, not merge orders.

---

## MDE interaction (overlap → fusion pipeline)

1. New or growing project enters roster.
2. **Z-MDE** scans registries → `NEW` / `OVERLAP` / …
3. **Z-ECO-MAP** places node on resilience stack + relationship edges.
4. If overlap + strategic combine → **Z-FUSION** co-design with full proposal template.
5. Human verdict: SAFE / NEEDS HUMAN DECISION / BLOCKED.

---

## Backup topology

Align every project row with [Z_SAFE_BACKUP_AND_SOURCE_ARCHIVE_POLICY.md](./Z_SAFE_BACKUP_AND_SOURCE_ARCHIVE_POLICY.md):

| `backup_priority` | Guidance |
| --- | --- |
| `critical` | Hub + payment-adjacent + production-adjacent docs |
| `high` | Active member repos, Roulette, Replit satellite |
| `medium` | Creative / quest / lab capsules |
| `low` | Research-only or link-only externals |

Code → GitHub. Private dumps → NAS. Edge runtime → Cloudflare secrets dashboard only.

---

## Gateway topology

- Local gateway registry (E2) lists **read-only** local URLs (e.g. Roulette `127.0.0.1:5190`).
- Doorway (`Z-DOORWAY-2/3`) opens or logs; ECO-MAP does not open IDEs.
- Cross-repo runtime bridges require charter — default `BLOCKED_UNSAFE` edge.

---

## Forbidden actions

Z-ECO-MAP must **not**:

- auto-merge repositories, modules, or branches
- deploy or bind Cloudflare production
- move secrets or payment credentials
- rewrite registries without PR
- execute AI or minibots
- treat topology as permission to bypass Turtle Mode or sacred gates

---

## Future roadmap

| Phase | Scope |
| --- | --- |
| **0 (now)** | This doctrine + `z_eco_map_topology_registry.json` manual seed |
| **1** | Operator expands roster; receipt MD after monthly review |
| **2** | Optional read-only report script (aggregate registries → topology diff) |
| **3** | Optional dashboard panel / mermaid graph (GET JSON only) |
| **4+** | Live bridges only with per-lane charter |

No runtime in Phase 0.

---

## Verdict template

```text
VERDICT: SAFE | NEEDS HUMAN DECISION | BLOCKED

Scope: topology doc/registry update only?

Summary: <one paragraph>

Edges changed: <list or none>

Sacred moves required: yes/no
```

| Verdict | When |
| --- | --- |
| **SAFE** | Phase 0 docs/registry; read-only classification |
| **NEEDS HUMAN DECISION** | New `FUSION_CANDIDATE` edges affecting payment/deploy; NAS enable |
| **BLOCKED** | Using map to justify auto-deploy, auto-merge, or mixed payment lanes |

---

## Related

- [Z_MODULE_DEDUPLICATION_EVOLUTION_ENGINE.md](./Z_MODULE_DEDUPLICATION_EVOLUTION_ENGINE.md)
- [Z_FUSION_CO_DESIGN_ENGINE.md](./Z_FUSION_CO_DESIGN_ENGINE.md)
- [Z_SAFE_BACKUP_AND_SOURCE_ARCHIVE_POLICY.md](./Z_SAFE_BACKUP_AND_SOURCE_ARCHIVE_POLICY.md)
- [Z_OPERATIONAL_TECHNOLOGY_LAYERS.md](./Z_OPERATIONAL_TECHNOLOGY_LAYERS.md)
- [data/z_eco_map_topology_registry.json](../data/z_eco_map_topology_registry.json)
