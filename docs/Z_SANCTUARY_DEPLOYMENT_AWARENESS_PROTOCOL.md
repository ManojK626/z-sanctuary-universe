# Z-Sanctuary Deployment Awareness Protocol

**Phase:** Z-SANCTUARY-DEPLOYMENT-AWARENESS-PROTOCOL-1 (canonical checklist doctrine; see [PHASE_Z_SANCTUARY_DEPLOYMENT_AWARENESS_PROTOCOL_1_GREEN_RECEIPT.md](PHASE_Z_SANCTUARY_DEPLOYMENT_AWARENESS_PROTOCOL_1_GREEN_RECEIPT.md)).

**Scope:** Cross-ecosystem governance for the Z-Sanctuary Universe hub and related surfaces. This document is **larger than** any single Cursor rule, Cloudflare note, GitHub workflow, or deployment script: it defines **how observation, verification, suggestion, and human authority** relate before anything reaches production.

**Audience:** Cursor AI, GitHub AI / PR agents, Cloudflare dashboard AI, Chat and workspace assistants, future overseers, AMK operators, and any automation that **reads** hub doctrine.

## 1. Core philosophy (mandatory order)

1. **Observe** — read registries and `data/reports/`; classify posture; do not act.
2. **Verify** — run or cite allowlisted checks; record receipts; **do not** treat pass/fail as deploy permission.
3. **Suggest** — propose branches, doc updates, staged work, and risk callouts; **AMK / human** chooses.
4. **Deploy** — **only** with explicit AMK/human approval and governed gates (release control, legal/security where applicable).

**Observe → Verify → Suggest → Human decides deployment.** Treat the ecosystem as a **governed multi-project organism**, not a single autopilot repo.

## 2. Readiness and automation posture

- **Readiness scores are advisory only.** They compress posture; they **do not** certify production and **do not** grant execution permission.
- **96–100 “production-ready” readiness** requires explicit **human / legal / security** approval **outside** automated formulas. Hub deployment-readiness scripts use an **`automated_readiness_cap`** (see `data/z_deployment_readiness_scoring_policy.json`) so rollups alone **never** claim that band.
- **No autonomous production readiness claims** and **no fake approvals** — GREEN, percentages, and receipts are evidence for humans, not substitutes for human gates.

## 3. Subsystem law (one-liners)

| Subsystem | Law |
| --------- | --- |
| **Deployment Readiness Overseer** | **Read-only.** Writes only `z_deployment_readiness_status.{json,md}`; does not deploy, merge, or widen runtime authority. |
| **PC Activation Awareness** | A **receipt** (git + markers + report signals), **not permission** to run verify pipelines, merge, or deploy. |
| **Cycle Observe** | **Suggest-only** task queue; the observer **must not** execute queued tasks. |
| **Cloudflare** | **Edge guardian / contingency** — not autonomous deployment authority; no production bind from AI inference alone. |
| **GitHub AI** | May **review** and **summarize** in PR context; **must not** bypass PR governance, auto-merge, or ship without human merge discipline. |
| **Cursor AI** | May **suggest** Turtle Mode branches (`cursor/zsanctuary/…`) and safe next steps; **must not** self-execute protected actions (merge, deploy, secrets, DNS, Cloudflare production, uncontrolled watchers). |

## 4. Ecosystem map (roles, not authorities)

| Layer | Role | Canonical pointers |
| ----- | ---- | ------------------- |
| **Cursor AI** | Guided builder in Turtle Mode; reads reports; suggests branches. | `.cursor/rules/z-turtle-mode-cursor-agents.mdc`, `.cursor/rules/z_control_root_awareness.mdc` |
| **GitHub / GitHub AI** | PRs, CI, review/summarize — **not** autonomous deploy or merge. | `docs/Z-GITHUB-AI-COMMS-PRECAUTIONS.md`, `docs/Z-GITHUB-SANCTUARY-GATE.md` |
| **Cloudflare (optional)** | Edge guardian / preview; not command authority. | Section 6; `docs/Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md` |
| **Chat / workspace assistants** | Same suggestion-only posture; no silent hooks to production. | This protocol; `AGENTS.md` |
| **AMK dashboard** | Read-only indicators; advisory Go/No-Go. | `dashboard/data/amk_project_indicators.json` |
| **Deployment Readiness Overseer** | Registry-driven rollup; **read-only.** | `docs/Z_DEPLOYMENT_READINESS_OVERSEER.md`, `npm run z:deployment:readiness` |
| **PC Activation Awareness** | Manual receipt after hub/shell work. | `docs/Z_PC_ACTIVATION_AWARENESS.md`, `scripts/z_pc_activation_receipt.mjs` |
| **Z-Traffic Minibots** | Verify/traffic posture signals. | `docs/Z_TRAFFIC_MINIBOTS.md`, `data/reports/z_traffic_minibots_status.json` |
| **Cycle Observe** | Observation tower + **suggest-only** queue. | `docs/Z_CYCLE_OBSERVE_SYSTEM.md`, `npm run z:cycle:observe` |
| **CAR²** | Similarity / structure awareness; not auto-refactor authority. | `data/reports/z_car2_similarity_report.json` |
| **Ecosystem Growth Registry** | Sealed stages and comms posture. | `docs/Z_ECOSYSTEM_GROWTH_STATUS.md`, `data/z_ecosystem_growth_stage_registry.json` |

## 5. Deployment stages (shared vocabulary)

| Stage | Meaning |
| ----- | ------- |
| `LOCAL_ONLY` | Work on clone; no production bind; no public exposure. |
| `PREVIEW` | Contingency / local HTTP / dry-run; not production authority. |
| `STAGED` | Human-approved slice on a gated promotion path; not “live by default.” |
| `PUBLIC_SAFE` | **Only** after explicit governance + technical gates; never from scores alone. |
| `HOLD` | Defer; signals or policy require human decision. |
| `ARCHIVED` | Retired lane; read-only reference. |

## 6. Authority boundaries

| Allowed | Forbidden without explicit AMK/human charter + gates |
| ------- | ---------------------------------------------------- |
| Summarize / classify reports | Auto-deploy, auto-merge, production bind |
| Verify allowlisted receipts | DNS mutation, Cloudflare **production** changes |
| Suggest branches and docs | Secrets, billing, security-auth mutation |
| Readiness scoring (advisory) | Public exposure without AMK approval |
| Analyze risk and drift | Fake approvals; autonomous production readiness claims |

## 7. Ninety-five percent cap doctrine

**Automated systems may not self-certify production authority.** Formulas and scripts **do not** replace human, legal, or security sign-off for production exposure.

## 8. Cloudflare edge doctrine

**Cloudflare = edge guardian / contingency — not autonomous deployment authority.** Optional Task 008 / preview stays subordinate to hub governance and `manual_release`. Tokens and Account IDs stay **out of git**.

## 9. Turtle Mode deployment law

- Branches: **`cursor/zsanctuary/*`**; small slices; one domain per PR where possible.
- **PR first, review first** — no sacred moves on `main` without discipline.
- Reports **suggest**; they do **not** merge, deploy, or mutate external systems.

## 10. Hard forbidden actions (non-exhaustive)

- No **auto-deploy**; no **auto-merge**
- No **DNS mutation**; no **Cloudflare production** changes from automation or “because AI said so”
- No **secrets / billing / security** mutation without explicit governed approval
- No **public exposure** without AMK approval
- No **autonomous production readiness claims**; no **fake approvals**
- No **uncontrolled watchers / daemons** that execute queue items, verify pipelines, or mutate production

## When beginning work (operator + AI checklist)

1. Read current reports under `data/reports/`.
2. Check deployment readiness (`npm run z:deployment:readiness`).
3. Check PC activation receipt when present (`z_pc_activation_receipt.{json,md}`).
4. Review ecosystem / traffic / cycle signals and **HOLD** posture.
5. Respect Turtle Mode and Hierarchy Chief when unsure.

## Sacred authority (AMK / human)

Final authority over public deployment, production exposure, external integrations, secrets, billing, Cloudflare edge activation, DNS, AI bridges, and irreversible actions.

**Your role:** guided overseer — **not** autonomous ruler.

## Related

| Doc | Role |
| --- | ---- |
| [PHASE_Z_SANCTUARY_DEPLOYMENT_AWARENESS_PROTOCOL_1_GREEN_RECEIPT.md](PHASE_Z_SANCTUARY_DEPLOYMENT_AWARENESS_PROTOCOL_1_GREEN_RECEIPT.md) | Phase seal receipt for this protocol (Z-SANCTUARY-DEPLOYMENT-AWARENESS-PROTOCOL-1). |
| [Z_DEPLOYMENT_READINESS_OVERSEER.md](Z_DEPLOYMENT_READINESS_OVERSEER.md) | Read-only deployment readiness rollup. |
| [Z_PC_ACTIVATION_AWARENESS.md](Z_PC_ACTIVATION_AWARENESS.md) | PC activation receipt lane. |
| [Z_CYCLE_OBSERVE_SYSTEM.md](Z_CYCLE_OBSERVE_SYSTEM.md) | Cycle observation + suggest-only queue. |
| [AGENTS.md](../AGENTS.md) | Agent orchestration; deployment governance pointer. |
| [AI_BUILDER_CONTEXT.md](AI_BUILDER_CONTEXT.md) | Builder briefing. |
