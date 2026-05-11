# New module & build discipline — safety and forward motion

**Canonical (this file, hub).** Backup copy: `Z_Sanctuary_Universe 2/docs/governance/Z-NEW-MODULE-DISCIPLINE-BACKUP.md` (sibling tree; same discipline text).
**As-of:** 2026-04-26. Does not override [AGENTS.md](../AGENTS.md) or the Hierarchy Chief.

Use this when adding **any** new module, creation, formula surface, web route, or partner touchpoint so the Sanctuary stays **one spine**, not a sprawl of special cases.

---

## 1. Before you build (5 minutes)

| Question | Why |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **What layer is this?** (product AI / governance visual / data pipeline / dev-only) | Sets trust and review bar. |
| **Advisory or actuating?** Default **advisory** | Money, health, law, vehicles, children → stricter; no silent auto-execution. |
| **Data in / out?** PII? Retention? | Default deny for PII; no raw PII in public builds or unredacted training. |
| **Kill switch or feature flag name?** | One place to turn the module off without a full redeploy. |
| **Registry / manifest line?** | So Overseer and `z_suc2` (or Master Register) stay honest about what is real vs spec. |

---

## 2. Safety (non-negotiables)

- **GGAESP / Z-ECR:** treat “high energy” and risk as **PREPARE / HOLD** until a human or approved build gate — not a blind **GO** on anything that can harm trust or people.
- **Append-only audit** where the hub already has it (e.g. GGAESP memory JSONL, operator logs) for anything that could be disputed later.
- **Jurisdiction:** payments, lotteries, health claims — follow the vault **Z-SUC-1 MODULE-BUILD-PLAN** and regional rules before live wiring (see `governance.relatedHubDocs` in `Z_Sanctuary_Universe 2/scripts/z_suc2_slice_product_module_hints.json` for the path).
- **B2B / IdP / webhooks:** do not ship live partner paths until [Z-B2B-PARTNER-AUTH-SKETCH](Z-B2B-PARTNER-AUTH-SKETCH.md) **P0** (paper) is satisfied; use stubs only until then.
- **Comms and secrets:** follow existing GitHub / Cloudflare / token policies in AGENTS; never commit long-lived secrets.

---

## 3. Keep moving forward (coherence)

- **One module, one manifest** — short owner, purpose, and where it lives in the registry.
- **API-first slices** — versioned surface (OpenAPI) + small demo; avoid monolith pastes.
- **Extend the spine** — QOSMEI, SSWS, registry, comms: **one** authority, not a forked “second brain.”
- **Big change?** [Z-SCTE](Z-SCTE-SELF-CREATIONS-TEST-ECOSYSTEM.md): Overseer surfaces, comms, **human** approval, then full verify.
- **Document the delta** — update `Z_Sanctuary_Universe 2/scripts/z_suc2_slice_product_module_hints.json` when slice ↔ hub reality changes.
- **Sealed vs sketch** — frozen semantics (e.g. GGAESP-360 v11–v19) stay versioned; future B2B / products use explicit sketches (e.g. B2B doc), not silent redefinition.

---

## 4. Which verify to run

- Day-to-day / pre-merge depth without release gate: **`npm run verify:full:technical`** (from hub root, per AGENTS).
- Release-tied or `manual_release` scenarios: use **`verify:full`** or CI only when the enforcer gate is appropriate.
- Do not let the wrong gate block you: use the task list in AGENTS for partial depth when the gate is on hold.

---

## 5. Related

- [AGENTS.md](../AGENTS.md)
- [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md)
- [Z-B2B-PARTNER-AUTH-SKETCH.md](Z-B2B-PARTNER-AUTH-SKETCH.md)
- GGAESP: [GGAESP-360-CODEX-POINTER.md](GGAESP-360-CODEX-POINTER.md) and continuation codex under `Z_Sanctuary_Universe 2/docs/codex/`

_End. Revise in place with a dated note when discipline rules change._
