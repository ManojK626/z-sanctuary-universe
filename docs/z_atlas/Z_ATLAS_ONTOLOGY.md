# Z-Atlas Ontology (v1 — semantics only)

**Gate:** `Z-ATLAS-0-LIVING-MULTI-PROJECT-TOPOLOGY-CONSTITUTION`  
**Companion schemas:** [z_atlas_node_v1.schema.json](../../schemas/z_atlas_node_v1.schema.json) · [z_atlas_edge_v1.schema.json](../../schemas/z_atlas_edge_v1.schema.json) · [z_atlas_fact_v1.schema.json](../../schemas/z_atlas_fact_v1.schema.json)  
**Runtime:** none. No graph database. No scanner.

---

## 1. Node types

Minimum vocabulary. Additional types require Steward review. Do not collapse distinct types because names are similar.

| Type | Meaning |
| --- | --- |
| `ECOSYSTEM` | The organism as a whole (Z-Sanctuary / Organiser room) |
| `CATEGORY` | Navigational family (multi-category allowed) |
| `PROJECT` | Named project folder / charter / satellite |
| `PRODUCT` | Distinct shippable or local product identity |
| `SERVICE` | Runtime or documented service surface |
| `ROOT` | Filesystem root that may own source or only hold evidence |
| `REPOSITORY` | Git (or proven non-git) source custody |
| `WORKTREE` | Additional checkout of a repository |
| `BRANCH` | Named git branch |
| `COMMIT` | Proven commit identity |
| `AI` | Named AI persona or agent class |
| `AGENT` | Cursor / hub agent with a documented role |
| `MINIBOT` | Narrow observer or traffic bot |
| `MENTOR` | Advisory / council role |
| `ENGINE` | Named engine (formula, routing, verify) |
| `FORMULA` | Registered formula / Ω doctrine item |
| `MODULE` | Hub module row or package |
| `REGISTRY` | Existing identity / module / PC-root registry |
| `DOMAIN` | Declared domain name (ownership documented only) |
| `DEPLOYMENT` | Deploy target or readiness claim |
| `ENVIRONMENT` | Local, staging, hub, archival, etc. |
| `GATE` | Named gate / phase / DRP hold |
| `EVIDENCE` | Report, receipt, sealed note |
| `REPORT` | Written audit or reconciliation |
| `RECEIPT` | Machine or human verify receipt |
| `HEALTH_SIGNAL` | Existing observer output |
| `ALERT` | Existing watchdog / sentinel signal |
| `DEPENDENCY` | Proven depends-on relation target |
| `COMMUNICATION_ROUTE` | Documented message path |
| `COMMERCIAL_SYSTEM` | Family, payment, entitlement, referral (do not activate) |
| `DATA_BOUNDARY` | What data may cross where |
| `SECURITY_BOUNDARY` | What must not be exposed or auto-ingested |

---

## 2. Edge vocabulary

Prefer a precise edge. Avoid vague `CONNECTED_TO` when one of these applies.

| Edge | Meaning |
| --- | --- |
| `CONTAINS` | Structural containment |
| `REFERENCES` | Pointer / citation without ownership |
| `OWNS_SOURCE` | Proven source ownership |
| `EXTERNAL_TO` | Lives outside the referring authority |
| `CANONICAL_FOR` | Proven canonical instance of a subject |
| `LEGACY_OF` | Predecessor evidence |
| `SUPERSEDED_BY` | Replaced by a later proven instance |
| `DEPENDS_ON` | Runtime or documentary dependency |
| `COMMUNICATES_WITH` | Documented communication route |
| `OBSERVED_BY` | Health / census observer |
| `SUPERVISED_BY` | Steward / mentor / overseer |
| `ORCHESTRATED_BY` | Coordination (e.g. AI Tower) — not Atlas command |
| `GOVERNED_BY` | Governance / DRP / charter |
| `PROTECTED_BY` | Security / sentinel / vault policy |
| `DEPLOYED_TO` | Proven or claimed deploy target |
| `HOSTED_AT` | Hosting location |
| `USES_DOMAIN` | Declared domain association |
| `HAS_WORKTREE` | Extra checkout |
| `HAS_BRANCH` | Named branch |
| `HAS_GATE` | Bound gate |
| `HAS_EVIDENCE` | Bound evidence |
| `HAS_HEALTH_SIGNAL` | Bound observer signal |
| `COMMERCIAL_MEMBER_OF` | Commercial family placement (not code merge) |
| `BELONGS_TO_CATEGORY` | Category membership (multi allowed) |
| `BLOCKED_BY` | Hold / missing precondition |
| `AUTHORIZED_BY` | Explicit authorization source |

---

## 3. Authority fields and vocabulary

See [Z_ATLAS_CONSTITUTION.md](Z_ATLAS_CONSTITUTION.md).

Authority values: `CANONICAL` · `EXTERNAL_SOVEREIGN` · `REFERENCE_ONLY` · `HISTORICAL` · `ARCHIVAL` · `SUPERSEDED` · `UNRESOLVED` · `MISSING`.

Root classifications (registry spec): `REGISTERED_ACTIVE` · `EXTERNAL_SOVEREIGN` · `LEGACY_READ_ONLY` · `ARCHIVAL_BACKUP` · `UNRESOLVED`.

---

## 4. Category families

A node may belong to more than one family. Assignment requires evidence.

| Family | Intent |
| --- | --- |
| `AI_AND_ORCHESTRATION` | Zuno, Tower, agents, minibots |
| `GAMING_INTELLIGENCE` | Distinct gaming products (never collapsed) |
| `LEARNING_AND_KNOWLEDGE` | Memory, observatory, docs |
| `HUMAN_RELATIONSHIP_TECHNOLOGY` | Soulmates / Z-Connect / compassion |
| `BUSINESS_AND_SERVICES` | WorkSphere, services |
| `CORE_ENGINES_AND_FORMULAS` | Ω, engines, formulas |
| `GOVERNANCE_AND_STEWARDSHIP` | Hierarchy, DRP, gates |
| `SECURITY_AND_TRUST` | Vault, sentinels, Triple-Check |
| `INFRASTRUCTURE_AND_DEPLOYMENT` | SSWS, hosting, Cloudflare (overlay only) |
| `HEALTH_AND_OBSERVABILITY` | Indicators, Zuno snapshots, alerts |
| `COMMERCIAL_SYSTEMS` | Families, domains, payment, referral |
| `RESEARCH_AND_EXPERIMENTATION` | Labs, stubs, unregistered research |

---

## 5. Overlay states (display only)

### Health

`GREEN` · `YELLOW` · `BLUE` · `RED` · `HOLD` · `QUARANTINE` · `UNKNOWN`

Atlas **displays** existing observer states. Atlas must not independently upgrade `UNKNOWN` to `GREEN`.

### Deployment

Independent from product health. Example that must remain expressible:

- health `GREEN`
- deployment `HOLD`
- physical proof `INSUFFICIENT`

### Commercial

Family · domain · payment · entitlement · provider eligibility · referral.

Example (proven by pointer + identity recovery, not activated here):

- ZWheel commercial family: **ZGame Intelligence**
- declared domain: `zwheelcracker.com` (not purchased)
- payment: **ABSENT** / `NOT_AUTHORIZED`
- deployment: **HOLD** / hub authority **NONE**

Do **not** activate ZGI Commercial Core from Atlas.

---

## 6. Provenance model

Every Atlas fact should be representable as:

| Field | Meaning |
| --- | --- |
| `factId` | Stable fact identity |
| `subjectId` | Node or path subject |
| `predicate` | Edge type or statement |
| `objectId` / `value` | Target or literal |
| `source` | Existing system that asserted it |
| `evidenceRef` | Report / receipt / file |
| `observedAt` | Observation time |
| `freshness` | `CURRENT` · `AGING` · `STALE` · `UNKNOWN` |
| `confidenceClass` | How strongly evidence supports it |
| `authority` | Authority vocabulary value |
| `status` | Accepted / deferred / conflicted / unverified |

Stale history is **retained**. Do not auto-delete stale facts.

---

## 7. Conflict model

| Conflict | Meaning |
| --- | --- |
| `IDENTITY_CONFLICT` | Two identities claimed as one, or one claimed as two |
| `PATH_CONFLICT` | Two paths claim the same canonical home |
| `VERSION_DRIFT` | Named build disagrees with on-disk identity |
| `DOMAIN_DRIFT` | Declared domain vs purchase/live proof |
| `BRANCH_DRIFT` | Branch / HEAD mismatch across checkouts |
| `OWNERSHIP_CONFLICT` | Hub pointer vs source owner |
| `STATUS_CONFLICT` | Ready/GREEN claim vs missing path or HOLD |
| `MISSING_REFERENCE` | Registry points at a missing expected path |

Each recorded conflict must include: **evidence**, **severity**, **owner**, **recommended next gate**.  
**No automatic fix.**

---

## 8. Gaming intelligence — required separation

Keep these **SEPARATE** unless a later gate proves sameness (none proven):

| Identity | Ontology class | Notes |
| --- | --- | --- |
| ZWheel Cracker | `PRODUCT` + `EXTERNAL_SOVEREIGN` | Root `C:\Z-Wheel Cracker` · family ZGame Intelligence |
| Super-Saiyan Roulette Pro App | Distinct `PRODUCT` | Organiser sibling clone |
| Roulette-Data-Analyzer | Distinct `PRODUCT` | Nested git under Replit folder |
| Hub roulette rows | `MODULE` `REFERENCES` only | Pointers / metadata / stale historical refs |

---

## Verdict

```text
Z_ATLAS_ONTOLOGY: PASS
Z_ATLAS_EDGE_VOCABULARY: PASS
Z_ATLAS_PROVENANCE_MODEL: PASS
Z_ATLAS_CONFLICT_MODEL: PASS
```
