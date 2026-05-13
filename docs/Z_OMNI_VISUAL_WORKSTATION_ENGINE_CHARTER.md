# Z-OMNI Visual Workstation Engine — Master charter (Z-OMNI-CHARTER-1)

**Status:** foundational charter for Cursor AI builders, GitHub review posture, and future overseers.  
**Scope:** documentation and architecture intent for a **governed visual operating layer** across Z-Sanctuary.  
**Non-scope:** autonomous self-governance, undeclared runtime bridges, auto-deploy, or deceptive “AGI / quantum / no human audit” product claims.

---

## 1. Purpose

The **Z-OMNI Visual Workstation Engine** is the name for a **universal, modular, governance-first** layer that can **compose** operator-facing surfaces (dashboards, workstations, observability panels, ecosystem maps) from:

- shared **visual tokens** and layout primitives,
- **panel manifests** (declarative structure + data bindings to approved paths),
- **read-only** observability and receipts,
- **human-gated** changes to anything that touches production, secrets, billing, or cross-repo execution.

It is **not** a low-code “generate anything live” control plane. It is a **presentation and composition engine** under existing Z-Sanctuary gates.

---

## 2. Governance-first architecture

**Authority order** stays aligned with the hub:

1. [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md)
2. [AGENTS.md](../AGENTS.md) and Cursor Turtle Mode rules
3. [Z_SANCTUARY_BUILD_RULES.md](Z_SANCTUARY_BUILD_RULES.md) and related safety law docs

**Sacred moves** (merge, deploy, secrets, NAS mutation, production edge bind, billing, bulk user data) remain **human / AMK-Goku** gated. The engine **may surface** posture; it **must not** silently execute or imply permission.

**Symbolic and narrative concepts** (for example “quantum shards,” “neural dampening,” “no human audits,” “predictive outages” as absolute promises) belong in **fiction, training, or labeled simulation** — never as factual product claims or compliance substitutes.

---

## 3. What already exists in Z-Sanctuary (grounded mapping)

| Charter concept | Hub-aligned reality (today) |
| ----------------- | ----------------------------- |
| Shadow AI guilds / swarm coordination | Z-Traffic, Z-OMNAI surfaces, MAOS / overseer **read-only** posture |
| Rule contracts | 14 DRP, sanctuary security policy, completion / comms doctrine |
| Z-Creator / AMK lane | AMK-Goku operator surfaces + **explicit approval** for sacred moves |
| Deployment awareness | [Z_DEPLOYMENT_READINESS_OVERSEER.md](Z_DEPLOYMENT_READINESS_OVERSEER.md), readiness rollup scripts |
| Truth tree / DAG | Registries, receipts, `data/reports/*`, verification scripts |
| Cross-project index | EAII / capability indexes, control link manifest |
| Enterprise dashboards | AMK main control, cycle dashboard (read-only), legal workstation docs |
| Cursor builder protocol | Turtle Mode, branch prefix `cursor/zsanctuary/`, AAFRTC / verify intents in AGENTS |

The engine **formalizes and unifies presentation**; it does not replace governance truth in JSON and docs.

---

## 4. Universal visual runtime philosophy

### Principles

1. **Observability-first:** panels consume receipts and registries; ambiguity renders as UNKNOWN, not green-wash.
2. **Calm / compact / tactical density** (and similar) as **operator UX modes**, not permission to auto-act.
3. **One spine of tokens** (color, radius, motion, elevation) shared across HTML dashboards and future panels.
4. **Progressive disclosure:** ribbons, docks, and rails collapse to icons; deep doctrine stays in docs.
5. **Accessibility and emotional clarity:** readable contrast, reduced-motion respect, no shame-based urgency copy for real safety signals.

### Runtime posture

Default **static or hub-served HTTP** with `fetch` to **known JSON paths** only; no undeclared third-party telemetry from the engine shell.

---

## 5. Panel manifest system (target shape)

A **panel manifest** (versioned JSON, hub-owned) should describe:

| Field | Intent |
| ----- | ------ |
| `id` | Stable machine id |
| `title` | Operator-visible label |
| `tier` | Governance tier (read-only, copy-only, gated-write-never-from-browser, etc.) |
| `layout` | Region graph (grid / rail / stack), not arbitrary executable layout DSL |
| `data_sources` | Allow-listed relative paths or named report keys |
| `actions` | UI-only: scroll, expand, filter, copy-to-clipboard — **no** npm/deploy/cross-repo execution from the panel unless explicitly chartered elsewhere |
| `lens` | Optional domain view id (e.g. operator vs enterprise) aligning with `amk_control_dashboard_map` style views |

Manifests are **validated** by hub scripts (pattern similar to dashboard registry verify) before being treated as “green.”

---

## 6. Adaptive workstation engine direction

### Adaptation

- density modes, collapsible rails, Z-dock style quick tools, focus filters,
- domain lenses that **hide** sections by policy,
- **not** autonomous layout mutation based on opaque model output without human-visible diffs and approval.

AI-assisted composition may **propose** manifest diffs or CSS token patches as **files in a PR**; operators merge after review.

---

## 7. Cloudflare / GitHub / Cursor governance rules

**Cloudflare:** preview and contingency posture only unless a separate human-approved charter promotes runtime; see [Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md](Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md) and hub identity JSON.

**GitHub:** change control, private-first posture, PR technical proof — see [Z-GITHUB-SANCTUARY-GATE.md](Z-GITHUB-SANCTUARY-GATE.md) and AGENTS.md verify intents.

**Cursor:** Turtle Mode, guarded agents, no auto-merge / auto-deploy; engine docs must not instruct otherwise.

---

## 8. Cursor AI Builder protocol (summary)

When building toward this engine:

1. **Branch:** `cursor/zsanctuary/…` — one domain per change set (UI vs scripts vs docs).
2. **Receipts:** prefer existing verify commands; do not declare green without the hub’s defined gates.
3. **No secrets** in manifests, HTML, or sample JSON.
4. **No new external services** without explicit charter.
5. **Docs before hype:** if a feature is symbolic or future, label it as such in UI and manifest metadata.

---

## 9. Enterprise workstation roadmap (phased)

### Phase A — Shared visual token system

Extract and document tokens from existing dashboards (e.g. AMK main control styles) into a **single** shared source (CSS variables + short README). No new runtime.

### Phase B — Panel renderer contract

Define manifest schema v0.1 + one **read-only** reference renderer (static HTML or small script) that consumes **fake fixture JSON** in-repo.

### Phase C — AI-assisted composition

Assistants generate **manifest + HTML partials** as PR artifacts; humans review. Still no silent deploy.

### Phase D — Enterprise ecosystem packaging

Optional templates for verticals (legal, cloud posture, education) — all **governed** and **data-path allow-listed**.

Phases **may** overlap only where receipts prove safety; never skip human gates for sacred moves.

---

## 10. Observability-first doctrine

- Panels **read** traffic, cycle observe, deployment readiness, registry verify, and related JSON.
- **BLUE** and similar informational signals are **not** “go deploy.”
- Unknown or stale JSON is visible to the operator, not hidden.

---

## 11. Turtle Mode implementation posture

- Small PRs; docs-only charters land without touching production dashboards unless the same PR scope requires it.
- Engine evolution is **incremental**: token extract → manifest spec → one pilot panel → broaden.

---

## 12. Human approval boundaries (non-negotiable)

The engine must never imply that:

- merge, deploy, or edge bind is automatic,
- legal or medical advice is given,
- child safety or crisis handling is automated,
- “AI civilization” operates without humans.

All such lanes require **explicit doctrine + human approval** beyond this charter.

---

## 13. Verification habits (when touching engine docs or panels)

From hub root, use the smallest proof that matches intent, for example:

```bash
npm run verify:md
```

Broader bundles (traffic, cycle observe, CAR²) are for when ecosystem receipts need refresh — see AGENTS.md for enforcer-gated vs technical-only pipelines.

---

## 14. Revision

| Version | Note |
| ------- | ---- |
| Z-OMNI-CHARTER-1 | Initial hub charter landing — docs only |

Amend via PR with rationale; keep **one** canonical path: this file.
