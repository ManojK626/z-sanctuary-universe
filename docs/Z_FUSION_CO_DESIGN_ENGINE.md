# Z-FUSION — Co-Design Engine (safe fusion doctrine)

**Lane:** Z-FUSION (doctrine + policy registry; advisory only)  
**Hub:** Z-Sanctuary Universe

## Core distinction

| Engine | Question |
| --- | --- |
| **Z-MDE** | “Does this already exist?” |
| **Z-FUSION** | “Can these existing things combine into something better?” |

Both are **advisory**. Neither has final authority.

**Standing law:**

```text
Observe → Verify → Suggest → Human decides
```

Fusion proposal ≠ merge permission.  
Overlap ≠ automatic consolidation.  
Combined UI concept ≠ shared runtime.

Machine policy: `data/z_fusion_co_design_policy.json`.

---

## 1. Mission

Z-FUSION is a **co-design governance engine** that helps the ecosystem decide when two or more existing parts — AI assistants, modules, projects, dashboards, capability engines, service lanes, business workflows, or data concepts — should **combine**, **share a layer**, or **stay separate**.

Z-FUSION produces structured proposals so AMK-Goku and human reviewers can choose cleaner, stronger, more useful system shapes **without** silent repo collapse or authority drift.

---

## 2. Non-mission

Z-FUSION is **not**:

- a repo merger or branch auto-merger
- a registry writer or project renamer
- a deploy or Cloudflare control plane
- a payment or legal ownership decider
- a secrets or user-data mover
- a service auto-provisioner

If the only answer is “delete duplicate,” route to **Z-MDE** first; if the answer is “combine thoughtfully,” Z-FUSION applies.

---

## 3. Inputs

Z-FUSION **reads** (does not mutate without human-approved PRs):

| Input class | Sources |
| --- | --- |
| MDE outcome | [Z_MODULE_DEDUPLICATION_EVOLUTION_ENGINE.md](./Z_MODULE_DEDUPLICATION_EVOLUTION_ENGINE.md), `data/z_module_deduplication_policy.json` |
| AI capability overlap | [Z_AI_FUSION_CAPABILITY_MAP.md](./Z_AI_FUSION_CAPABILITY_MAP.md), `npm run z:ai:fusion-map` |
| AI fusion dedup framing | [Z_AI_FUSION_DEDUP_AND_ROLE_POLICY.md](./Z_AI_FUSION_DEDUP_AND_ROLE_POLICY.md) |
| Module / project registries | `data/z_module_manifest.json`, `data/z_pc_root_projects.json`, `data/z_sanctuary_monster_project_registry.json` |
| Dashboard / service lanes | `data/z_mdg_dashboard_registry.json`, `dashboard/data/z_universe_service_catalog.json` |
| Engines | `data/z_core_engines_registry.json` |
| Traffic posture | [Z_TRAFFIC_MINIBOTS.md](./Z_TRAFFIC_MINIBOTS.md), `npm run z:traffic` |
| Visual / workstation | [Z_OMNI_VISUAL_WORKSTATION_ENGINE_CHARTER.md](./Z_OMNI_VISUAL_WORKSTATION_ENGINE_CHARTER.md) |
| Payment / business | [Z_PAYMENT_OWNERSHIP_AND_BUSINESS_AI_GOVERNANCE.md](./Z_PAYMENT_OWNERSHIP_AND_BUSINESS_AI_GOVERNANCE.md), `data/z_payment_project_ownership_registry.json` |
| Module placement | [Z_MOD_DIST_MODULE_DISTRIBUTOR.md](./Z_MOD_DIST_MODULE_DISTRIBUTOR.md) (`Z-MOD-DIST-1`) |
| Monster catalog alignment | [Z_SANCTUARY_MONSTER_PROJECT_MASTER_MAP.md](./Z_SANCTUARY_MONSTER_PROJECT_MASTER_MAP.md), `npm run z:monster:registry-verify` (**Z-MCR-A** posture) |
| Legal / evidence lanes | [Z_LEGAL_EVIDENCE_CORE.md](./Z_LEGAL_EVIDENCE_CORE.md) (**Z-LGR** posture) |
| Similarity (optional) | `npm run z:car2` → `data/reports/z_car2_similarity_report.json` |

**Order:** Z-MDE (existence/overlap) → Z-FUSION (co-design) → human gate.

---

## 4. Outputs

Z-FUSION **may** output (manual receipt or future scripted report under `data/reports/` when chartered):

- fusion proposal (structured template below)
- overlap diagram (mermaid or markdown sketch)
- shared service layer recommendation
- combined UI / workstation concept (docs/mock only by default)
- capability map delta
- **keep separate** warning
- payment ownership warning
- data boundary / privacy warning
- project identity warning
- branch strategy suggestion (`cursor/zsanctuary/…`, separate PRs per domain)

Default approval on every proposal: **`HUMAN_REVIEW_REQUIRED`**.

---

## 5. Fusion classifications

| Label | Meaning | Typical human action |
| --- | --- | --- |
| `FUSION_CANDIDATE` | Combining adds clear value with bounded risk | Charter + phased Turtle PRs |
| `KEEP_SEPARATE` | Overlap is tolerable; identities must not merge | Document lead/support only |
| `SHARED_SERVICE_LAYER` | Shared API/registry/docs layer; separate brands/repos | Shared package or hub registry row only |
| `VISUAL_ONLY_FUSION` | Shared design language; no shared runtime/data | Tokens/panels charter under Z-OMNI |
| `DATA_BRIDGE_CANDIDATE` | Read-together registries; no auto-write bridge | Read-only bridge + receipt |
| `BUSINESS_LANE_SPLIT` | Shared reporting OK; payment lanes stay split | Payment governance sign-off |
| `RESEARCH_ONLY` | Concept/mock/simulation | No production bind |
| `BLOCKED_UNSAFE` | Mixing would violate safety, payment, privacy, deploy law | Stop; Hierarchy Chief review |

---

## 6. Project fusion rules

- **Repos stay separate** unless AMK charters an explicit repo consolidation (rare; not Z-FUSION default).
- **Brands and project IDs** remain distinct in registries until human PR updates.
- **Shared service layer** means one documented owner for the shared lane; satellites keep thin bridge files ([Z_SANCTUARY_CANONICAL_CONTROL_ROOT.md](./Z_SANCTUARY_CANONICAL_CONTROL_ROOT.md)).
- **Hub** remains governance root; fusion does not make a satellite authoritative over hub JSON.
- **Z-MCR-A posture:** monster catalog + `z:monster:registry-verify` must stay aligned before cross-project fusion is advertised as GREEN.
- **Rollback:** each fusion phase needs a revert path (branch revert, registry row removal, disable catalog entry).

---

## 7. AI assistant fusion rules

- Two assistants may share an **advisory cockpit** (docs, dashboard grouping, routing hints) while keeping **separate identities** and forbiddens.
- Use **Z-AI-FUSION-MAP** for lead/support/alias; Z-FUSION adds **co-design** shape (shared cockpit vs merge docs only).
- **No** auto-merge of indicator rows, runtime agents, or sacred-move authority.
- Conflicting advice → `KEEP_SEPARATE` or `BLOCKED_UNSAFE`, never silent override.
- Stillness/learning pathways remain **read-only** orientation ([Z_STILLNESS_MODE_AI_LEARNING_PATHWAY.md](./Z_STILLNESS_MODE_AI_LEARNING_PATHWAY.md)).

---

## 8. Data / service fusion rules

| Fusion type | Allowed default | Forbidden default |
| --- | --- | --- |
| **Data fusion** | Read-together views, linked docs, dual-registry compare | Auto-write sync across repos |
| **Service fusion** | Shared catalog entry pointing to one lead service | Auto-create Cloudflare Workers/Pages |
| **Registry fusion** | Docs-only merge PR; alias rows | Silent rewrite of `z_module_manifest.json` |
| **Gateway fusion** | Document shared local port policy | Collapse payment webhooks without charter |

**Z-LGR posture:** legal/evidence lanes do not fuse with marketing or payment surfaces without explicit legal ops charter.

---

## 9. Governance gates

Every fusion proposal must pass:

| Gate | Check |
| --- | --- |
| **14 DRP / swarm law** | [Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md](./Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md) |
| **Turtle Mode** | One domain per PR; `cursor/zsanctuary/*`; no direct `main` |
| **Sacred moves** | Merge, deploy, payment, NAS, public launch → AMK only |
| **Payment** | [Z_PAYMENT_OWNERSHIP_AND_BUSINESS_AI_GOVERNANCE.md](./Z_PAYMENT_OWNERSHIP_AND_BUSINESS_AI_GOVERNANCE.md) |
| **Backup** | [Z_SAFE_BACKUP_AND_SOURCE_ARCHIVE_POLICY.md](./Z_SAFE_BACKUP_AND_SOURCE_ARCHIVE_POLICY.md) — no secrets in GitHub |
| **Traffic signal** | YELLOW/RED from Z-Traffic → hold execution; BLUE → AMK review |

Z-FUSION **suggests** gate status; it does not clear gates.

---

## 10. Human approval flow

```text
1. Run Z-MDE on incoming or overlapping parts
2. If OVERLAP / MERGE_CANDIDATE / multi-entity idea → open Z-FUSION co-design
3. Fill fusion proposal template (section below)
4. Assign fusion classification label
5. AMK / delegated reviewer: APPROVE | DEFER | REJECT | SPLIT_LANES
6. If APPROVE → charter + Turtle branch(es) per domain
7. Receipt (phase doc or green receipt) before runtime expansion
```

**Proposal template (required fields):**

| Field | Content |
| --- | --- |
| `source_projects` | IDs / repos / modules involved |
| `intended_benefit` | Why combine |
| `overlapping_capability` | What overlaps |
| `shared_vs_separate` | Boundaries table |
| `owner_payment_impact` | Stripe/PayPal/business lane notes |
| `data_privacy_impact` | PII, vault, user data boundaries |
| `deployment_impact` | Cloudflare/local/NAS — usually HOLD |
| `rollback_plan` | How to undo |
| `human_approval_status` | Default: `HUMAN_REVIEW_REQUIRED` |

---

## 11. Relationship to peer systems

| System | Role relative to Z-FUSION |
| --- | --- |
| **Z-MDE** | Runs **first** — duplicate/overlap detection |
| **Z-FUSION** | Runs **second** — reuse vs shared layer vs new combined capability vs unsafe mix |
| **Z-AI-FUSION-MAP** | AI role overlap scorer; feeds fusion proposals |
| **Z-MOD-DIST** | Where modules should live; fusion does not replace routing |
| **Z-MCR-A** | Monster catalog/registry alignment (`z:monster:registry-verify`) before cross-project fusion claims |
| **Z-LGR** | Legal/evidence governance; blocks unsafe doc/runtime mixing |
| **Z-OMNI** | Visual/workstation composition; `VISUAL_ONLY_FUSION` lane |
| **Z-Traffic** | Read-only signals; fusion holds when tower is YELLOW/RED |
| **Payment governance** | Separate ownership lanes; `BUSINESS_LANE_SPLIT` default |

---

## 12. Phase roadmap

| Phase | Scope | Authority |
| --- | --- | --- |
| **0 (now)** | This doctrine + `data/z_fusion_co_design_policy.json` | Docs/registry planning only |
| **1** | Manual fusion proposal receipts in `data/reports/` (template MD/JSON) | Human-written; no auto-merge |
| **2** | Optional read-only script: aggregate MDE + fusion-map + traffic into one report | Advisory exit codes only |
| **3** | Dashboard **read-only** fusion proposal panel | GET JSON; no execution |
| **4+** | Runtime shared services | Separate charter per lane; not implied by Phase 0 |

---

## 13. Verdict template (operator return)

Use after each co-design review:

```text
VERDICT: SAFE | NEEDS HUMAN DECISION | BLOCKED

Classification: <FUSION_CANDIDATE | KEEP_SEPARATE | ...>

Summary: <one paragraph>

Human approval status: HUMAN_REVIEW_REQUIRED | APPROVED | REJECTED | DEFERRED

Next safe action: <e.g. docs-only PR, keep separate, escalate to Hierarchy Chief>

Sacred moves required: yes/no — list if yes
```

| Verdict | When |
| --- | --- |
| **SAFE** | Phase 0 doctrine only; or approved proposal limited to docs/registry/mock |
| **NEEDS HUMAN DECISION** | Any runtime bridge, payment lane change, registry rewrite, or multi-repo work |
| **BLOCKED** | Auto-merge, mixed payment ownership, mixed user data, deploy bind, secrets move |

---

## Example fusion types

### AI fusion

Two assistants combine **knowledge patterns** into one shared **advisory cockpit**, while preserving separate identities and forbiddens.

### Project fusion

Two projects share a **common service layer** (documented API or hub registry), but keep **separate repos, brands, and payment lanes**.

### Visual fusion

Two dashboards share **design language** (Z-OMNI tokens/panels); they do **not** share runtime or user data stores.

### Data fusion

Two registries may be **read together** (compare reports); they are **not** automatically written together.

### Business fusion

Two services may share **reporting** posture; they do **not** share Stripe/PayPal ownership unless explicitly approved under payment governance.

---

## Z-FUSION must not

- merge code or repositories automatically
- collapse project identities or rename projects
- mix payment ownership or user data
- decide legal or business ownership
- change deployment targets or create Cloudflare resources
- write secrets or auto-merge branches

---

## Related

- [Z_MODULE_DEDUPLICATION_EVOLUTION_ENGINE.md](./Z_MODULE_DEDUPLICATION_EVOLUTION_ENGINE.md)
- [Z_AI_FUSION_DEDUP_AND_ROLE_POLICY.md](./Z_AI_FUSION_DEDUP_AND_ROLE_POLICY.md)
- [Z_SAFE_BACKUP_AND_SOURCE_ARCHIVE_POLICY.md](./Z_SAFE_BACKUP_AND_SOURCE_ARCHIVE_POLICY.md)
- [data/z_fusion_co_design_policy.json](../data/z_fusion_co_design_policy.json)
