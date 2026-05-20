# Z-ATE — Autonomy Trust Engine (Z-TRUST-LAYER Phase 0)

**Formal lane:** Z-ATE-0 / Z-TRUST-LAYER-0  
**Alias:** Autonomy Trust Engine, dynamic trust-and-approval intelligence  
**Hub:** Z-Sanctuary Universe

## Core shift

The ecosystem evolves from **manual approval everywhere** to **graduated trust with bounded autonomy**:

```text
low-risk        → auto-flow (evidence-gated)
medium-risk     → supervised-flow
high-risk       → AMK gate
critical-risk   → hard stop
```

**Not** uncontrolled autonomy. **Not** bottlenecking AMK on every tiny action. **Civilization-style** governance where automation never equals authority.

**Standing law:**

```text
observe → verify → suggest → bounded auto-flow (L2 only when gated) → human decides on L3+
AUTOMATION ≠ AUTHORITY
```

Machine policy: `data/z_autonomy_trust_policy.json`.  
Complements (does not replace): `data/z_autonomy_task_policy.json` (L0–L5 task levels).

---

## Mission

Z-ATE is the **orchestration intelligence** that scores whether a proposed action may:

- proceed as **AUTO_APPROVED** (low-risk, all gates pass),
- pause as **SUPERVISED_REQUIRED** (AI prepares; AMK reviews),
- stop as **AMK_REQUIRED** (sacred / commercial / deploy class),
- or halt as **BLOCKED** (never proceed).

Z-ATE **calculates and recommends**. It does **not** execute merges, deploys, payments, or registry writes.

---

## Non-mission

Z-ATE is **not**:

- giant AGI or dangerous self-modification
- permission to bypass 14 DRP or Turtle Mode
- a replacement for AMK-Goku on sacred moves
- auto-merge, auto-deploy, or auto-payment authority
- confusion of **indicator GREEN** with **deploy GREEN**

---

## Trust layers (0–5)

| Layer | Name | AI may | AI must not |
| --- | --- | --- | --- |
| **0** | Observation | Read CI, topology, receipts, DRP, gateway, payment lanes | Take any mutating action |
| **1** | Suggestion | Propose merge order, cleanup, topology, low-risk fixes | Execute proposals |
| **2** | Auto-approved low risk | Flow **only** when all conditions pass (see matrix) | Expand scope without re-score |
| **3** | Supervised workflow | Prepare PRs, deploy plans, fusion drafts, backup plans | Apply without AMK review |
| **4** | Hard AMK gate | Surface checklist and receipts | Proceed without human |
| **5** | Blocked | Report BLOCKED with reason | Any bypass attempt |

Layer 2 is **bounded auto-flow** — the genius addition to existing observe → suggest → human decides.

---

## Output labels (required)

| Label | Meaning | Typical operator posture |
| --- | --- | --- |
| `AUTO_APPROVED` | All trust signals pass; L2-class action may proceed without AMK for this slice | Still logged; reversible; no sacred scope |
| `SUPERVISED_REQUIRED` | Prepare only; AMK reviews before apply | PR draft, plan, charter review |
| `AMK_REQUIRED` | Human gate mandatory | Deploy, payment, NAS, legal, ownership |
| `BLOCKED` | Must not proceed | Unsafe fusion, secret move, authority drift |

Default when uncertain: **`SUPERVISED_REQUIRED`** or **`AMK_REQUIRED`** — never default to AUTO_APPROVED.

---

## Input signals (read-only)

| Signal | Source |
| --- | --- |
| DRP / swarm posture | `npm run z:swarm:14drp`, [Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md](./Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md) |
| Repo / CI health | GitHub checks, `npm run z:traffic` |
| Topology integrity | [Z_ECO_MAP_TOPOLOGY_ENGINE.md](./Z_ECO_MAP_TOPOLOGY_ENGINE.md), `data/z_eco_map_topology_registry.json` |
| Duplication | [Z_MODULE_DEDUPLICATION_EVOLUTION_ENGINE.md](./Z_MODULE_DEDUPLICATION_EVOLUTION_ENGINE.md) |
| Fusion safety | [Z_FUSION_CO_DESIGN_ENGINE.md](./Z_FUSION_CO_DESIGN_ENGINE.md) |
| Work in flight | [Z_BACKGROUND_WORK_WITNESS.md](./Z_BACKGROUND_WORK_WITNESS.md) |
| Payment isolation | [Z_PAYMENT_OWNERSHIP_AND_BUSINESS_AI_GOVERNANCE.md](./Z_PAYMENT_OWNERSHIP_AND_BUSINESS_AI_GOVERNANCE.md) |
| Backup / deploy class | [Z_SAFE_BACKUP_AND_SOURCE_ARCHIVE_POLICY.md](./Z_SAFE_BACKUP_AND_SOURCE_ARCHIVE_POLICY.md), Cloudflare HOLD |
| Autonomy level | `data/z_autonomy_task_policy.json` L0–L5 |
| Rollback posture | Turtle branch + receipt docs |

---

## Layer 2 — Auto-approved low risk (conditions)

ALL must pass for `AUTO_APPROVED`:

```text
DRP pass
No secrets in diff
No payment / billing mutation
No deploy / Cloudflare production bind
No governance JSON silent rewrite
No ownership conflict
No fusion of payment or user-data lanes
CI lint/evidence stable or improving (not RED)
Rollback path documented
```

### Examples (L2 candidates when gated)

| Action | L2 eligible? |
| --- | --- |
| Markdown formatting (lint:md / table compact) | Yes, when operator or CI invokes |
| JSON schema normalization (read-only validate) | Yes |
| Docs index link update (Turtle PR) | Supervised (L3) unless AMK pre-opens lane |
| Read-only report generation (`z:traffic`, `z:cycle:observe`) | L1 evidence, not L2 apply |
| Topology / trust policy refresh (reports only) | L1 |
| CI lint fix on allowlisted files | Supervised (L3) — PR still human merge |

---

## Layer 4 — Hard AMK gate (never bypass)

| Area | Mandatory human |
| --- | --- |
| Payments / Stripe / PayPal | YES |
| Ownership transfer | YES |
| Production deploy | YES |
| Billing changes | YES |
| Cloudflare live mutation | YES |
| Security rules / secrets | YES |
| NAS activation | YES |
| Legal / evidence docs | YES |
| User data movement | YES |
| AI autonomy escalation | YES |

---

## Layer 5 — Blocked (never proceed)

- Auto payment mixing or cross-owner fusion
- Secret exfiltration or commit of `.env` / keys
- Destructive merges or force-push to protected `main`
- Silent infra / NAS / Cloudflare mutation
- AI claiming final authority over registries
- Executing Z-Cycle `task_queue` because trust score is high
- Confusing **work_progress_pct** or **growth_percent** with permission

---

## Relationship to peer engines

| Engine | Role |
| --- | --- |
| **Z-Traffic** | Ecosystem posture signals feed trust score |
| **Z-ECO-MAP** | Topology + isolation boundaries |
| **Z-MDE** | Duplication before trust upgrade |
| **Z-FUSION** | Co-design; default SUPERVISED or AMK |
| **Z-WORK-PULSE** | Witness in flight → hold L2 auto-flow |
| **Z-MCR-A** | Merge conflict intelligence → SUPERVISED |
| **Z-SAFE-BACKUP** | Resilience lane class |
| **Z-Cycle Observe** | Queue suggests; Z-ATE never runs queue |
| **AMK indicators** | Future `z_ate_trust` overlay (Phase 2+) |
| **14 DRP** | Supreme; BLOCKED on violation |

```text
Observe (L0) → Suggest (L1) → Z-ATE score →
  AUTO_APPROVED (L2) | SUPERVISED (L3) | AMK (L4) | BLOCKED (L5)
```

---

## Dashboard future (read-only)

| Surface | Function |
| --- | --- |
| Z-Traffic | Posture |
| Z-ECO-MAP | Where things sit |
| Z-MDE | Duplication |
| Z-FUSION | Combine opportunities |
| Z-WORK-PULSE | Live work |
| **Z-ATE** | Trust / approval tier |
| Z-SAFE-BACKUP | Resilience |
| Overseer / Eagle Eye | Escalation |

Phase 0: doctrine only — no new dashboard panel until receipt.

---

## Forbidden actions

Z-ATE must **not**:

- auto-merge PRs or auto-push
- auto-deploy or bind Cloudflare production
- auto-escalate its own authority level
- waive L4/L5 for payment, legal, NAS, secrets
- treat AUTO_APPROVED as merge/deploy permission

---

## Phase roadmap

| Phase | Scope |
| --- | --- |
| **0 (now)** | This doctrine + `z_autonomy_trust_policy.json` |
| **1** | Manual trust decision receipts in `data/reports/` |
| **2** | Read-only rollup script (aggregate signals → recommendation) |
| **3** | AMK indicator row + dashboard trust chip |
| **4** | Supervised auto-flow charters per lane (still no L4/L5 auto) |

No daemon. No silent executor in Phase 0–1.

---

## Operator checklist (before trusting L2 auto-flow)

1. Confirm action is listed in Layer 2 matrix.
2. Run Z-ATE inputs (traffic, DRP, eco-map isolation).
3. If any RED / payment / deploy / secret → **AMK_REQUIRED** or **BLOCKED**.
4. Log receipt; keep Turtle branch + PR for applies.
5. AMK remains merge authority on `main`.

---

## Verdict template

```text
VERDICT: SAFE | NEEDS HUMAN DECISION | BLOCKED

Trust label: AUTO_APPROVED | SUPERVISED_REQUIRED | AMK_REQUIRED | BLOCKED

Autonomy level (L0-L5): <level>

Summary: <one paragraph>
```

| Verdict | When |
| --- | --- |
| **SAFE** | Phase 0 doctrine; read-only scoring design |
| **NEEDS HUMAN DECISION** | Enabling L2 auto-flow scripts or indicator wiring |
| **BLOCKED** | Auto L4/L5 or authority without human |

---

## Related

- [data/z_autonomy_trust_policy.json](../data/z_autonomy_trust_policy.json)
- [data/z_autonomy_task_policy.json](../data/z_autonomy_task_policy.json)
- [AMK_AUTONOMOUS_APPROVAL_LADDER.md](./AMK_AUTONOMOUS_APPROVAL_LADDER.md)
- [AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md](./AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md)
