# Z-Sanctuary Universe Constitution v1.3

**Status:** **FROZEN architecture** · Intelligence + Freshness + Stewardship Principles permanent  
**Edition:** 1.3 (was 1.2)  
**Opened:** 2026-07-24  
**Frozen at:** 2026-07-24 (v1.0 architecture)  
**Amended:** 2026-08-01 — Art. XII · 2026-08-03 — Art. XIII Freshness · Art. XIV Stewardship (AMK-Goku)  
**Authority:** AMK-Goku  
**Posture:** Architecture freeze · **not** auto-enforced by code · **not** a deploy grant  
**Depends on:** [State of the Universe Report 2026](../Z_SANCTUARY_STATE_OF_THE_UNIVERSE_REPORT_2026.md) (accepted)  
**Parallel lane:** [Backup Readiness Operation](../Z_BACKUP_READINESS_OPERATION.md) · [Wave 1 Runbook](../Z_BACKUP_WAVE1_RUNBOOK.md)  
**Ops Center spine:** [Z_SANCTUARY_OPERATIONS_CENTER_LAYERS.md](../Z_SANCTUARY_OPERATIONS_CENTER_LAYERS.md)  
**Registry Atlas:** [Z_SANCTUARY_REGISTRY_ATLAS.md](../Z_SANCTUARY_REGISTRY_ATLAS.md)  
**Quality Gate ritual:** [Z_SANCTUARY_QUALITY_GATE_TAKEOFF_CHECKLIST.md](../Z_SANCTUARY_QUALITY_GATE_TAKEOFF_CHECKLIST.md)

---

## Preamble

This Constitution freezes the **stewardship architecture** of Z-Sanctuary Universe after the Observation Era (Great Awakening Ω-1 · Living Brain Ω-2 · State of the Universe 2026).

It exists so the ecosystem can evolve through **modules and plugins** without structural drift, orphan folders, or accidental erasure of years of work.

**Freeze means:** core identities, hierarchy, registries, naming, and change-control rules are stable. New work must register itself. It does **not** mean the organism stops growing — see Article III (Evolution Principle).

Edition **1.1** added the **Intelligence Principle** (evidence).  
Edition **1.2** adds the **Freshness Principle** (time) — evidence without time can become stale.  
Edition **1.3** adds the **Stewardship Principle** (deliberate human review before significant action).

---

## Article I — The Steward's Oath

Not legal text. Guiding philosophy for every human steward and every AI contributor:

> We preserve before we replace.
> We observe before we modify.
> We verify before we trust.
> We document before we automate.
> We strengthen before we expand.
> We build technology that serves people, protects knowledge, and can be responsibly stewarded for generations.

---

## Article II — The Preservation Principle

**Permanent rule:**

> No major refactor, deployment, archive, merge, or deletion may occur unless at least one verified backup exists and the affected project is present in the Master Registry.

### Clarifications

| Term | Meaning |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Verified backup | Off-working-copy protection confirmed by human (e.g. remote git push, cloud archive, or NAS copy with receipt) — empty `Backups/` folder does **not** count |
| Master Registry | At minimum: `data/z_pc_root_projects.json` and/or `data/z_universe_project_registry.json` for PC/universe citizens; module work also requires `data/z_module_manifest.json` |
| Major refactor | Multi-domain structural change, mass rename, cross-repo move, or deletion of product trees |
| Deployment | Any production or public edge bind (including Cloudflare production) |
| Archive / merge / deletion | Retiring, combining, or removing project trees or canonical registries |

**Sacred moves** (merge to `main`, deploy, payment, legal/pricing copy, public launch, bulk user-data) still require **AMK-Goku** consent in addition to this Principle.

---

## Article III — The Evolution Principle

**Permanent rule:**

> The Constitution safeguards the structure, stewardship, and safety of the Z-Sanctuary Universe ecosystem. It is not intended to prevent innovation. New projects, AI systems, technologies, workflows, and ideas are encouraged, provided they first pass Observation, Registration, Governance, and Stewardship before becoming part of the canonical ecosystem.

### Clarifications

| Gate | Meaning |
| ------------ | ------------------------------------------------------------------------------------------- |
| Observation | Discover and document before assuming citizenship |
| Registration | Register-or-don't (Article V) — Master Registry entry |
| Governance | Hierarchy Chief · Turtle Mode · 14 DRP · sacred gates |
| Stewardship | Preservation Principle · verified backup where required · Mission Control / docs visibility |

Innovation without those gates remains **experiment or orphan** — not canonical.

---

## Article IV — Locked architecture

### IV.1 Control root

| Element | Frozen identity |
| ------------- | ------------------------------------------------------------------------------- |
| Canonical hub | `Z_Sanctuary_Universe` under `C:\Cursor Projects Organiser\` |
| Role | Governance and control root for satellite links · SSWS heart · verify authority |
| Not | Runtime owner of ASTRALIS, KazaFood, or XL2 without separate charter |

### IV.2 Six builder laws (unchanged)

```text
federation ≠ authority
topology ≠ ownership
observe → verify → suggest → human decides
readiness ≠ deploy
organization ≠ control
layered tools ≠ the soul
```

### IV.3 Operational roof

Hierarchy Chief defines authority order. Z-Super Overseer remains the operational roof (Z-EAII + auto-run discipline + Z-SSWS). Zuno observes only. Folder Manager governs vault policy. Mission Control observes/orchestrates — it does **not** execute sacred moves.

### IV.4 Z-SSWS heart

Z-SSWS is the **heart** of the hub organism. Stewardship preference: **awaken, strengthen, modernize** — do not replace with a parallel control plane unless AMK charters retirement.

### IV.5 Operations Center stewardship spine (recognized)

Permanent operating model (detail: [Z_SANCTUARY_OPERATIONS_CENTER_LAYERS.md](../Z_SANCTUARY_OPERATIONS_CENTER_LAYERS.md)):

| Layer | Core question |
| --- | --- |
| AMK-Goku | What shall we decide? |
| Z-SSWS | What is happening? |
| Z-EAII | Why / where / what relates? |
| AMK Indicators | How healthy? |
| Steward Intelligence | What deserves attention? (functional layer — **not** an AI personality) |

---

## Article V — Register-or-don't

### V.1 Rule

No new project folder, dashboard surface, AI role, engine, or durable module may be treated as part of the civilization unless it is registered in the appropriate Master Registry (and linked from docs index or Mission Control when applicable).

### V.2 Orphans

Unregistered disk folders are **candidates for inventory**, not citizens. They must be: registered, archived with memory, or explicitly marked external/link-only — after AMK decision.

### V.3 ACN/MTEH path

New modules, tools, extensions, and HTML web apps follow Z-ACN/MTEH: register → manifest → assets → control plane → §9 verification → completion/approval.

---

## Article VI — Canonical AI hierarchy

| Layer | Identity | Authority |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Human | AMK-Goku | Sacred gate |
| Index | Hierarchy Chief (Observer View) | Check-first when unsure |
| Roof | Z-Super Overseer / Z-OSHA | EAII + SSWS + auto-run discipline |
| Registry / doorway | Z-EAII | PC project roster |
| Heart / workspace | Z-SSWS | Hub cockpit · local server culture |
| Dashboard | Z-HODP | Single surface (Control Centre / Blueprint / panels) |
| Observer | Zuno | State/reflection · no execution |
| Vault | Folder Manager AI | Snapshots / retention / policy |
| Sealed observe lanes | Cycle Observe · Crystal DNA · Deployment Readiness Overseer · Doorway · Control-Link · AnyDevice · PC Activation | Report-only unless chartered otherwise |
| Planned | AI Tower colony | Docs/stub until gradual activation charter |

**Steward Intelligence** is a **functional synthesis layer** (evidence → recommendations), not a row that competes with Zuno/EAII/SSWS as a personality.

External models (Claude, Gemini, OpenAI, Replit, etc.) are **assistive tools**, not constitutional authorities.

**AI advises. Humans decide.**

---

## Article VII — Canonical project registry

### VII.1 Sources of truth

| Concern | Canonical artifact |
| --------------------------------- | -------------------------------------------------------- |
| PC-root roster | `data/z_pc_root_projects.json` |
| Universe census / Mission Control | `data/z_universe_project_registry.json` |
| Modules | `data/z_module_manifest.json` (+ synced module registry) |
| Sealed systems | `data/z_ecosystem_growth_stage_registry.json` |
| Dashboards (MDGEV) | `data/z_mdg_dashboard_registry.json` |
| Autonomy levels | `data/z_autonomy_task_policy.json` |
| Control-link satellites | `data/z_satellite_control_link_manifest.json` |
| Stewardship certificates | `data/z_stewardship_certificate_registry.json` |

### VII.2 Sister ecosystems

| Ecosystem | Relation |
| -------------------- | --------------------------------------------------------------- |
| ASTRALIS | Independent · governance inheritance only · no runtime coupling |
| KazaFood | Independent venture · may interface · not absorbed |
| XL2 / other charters | Separate unless approved coupling charter |

---

## Article VIII — Canonical naming

| Rule | Example |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Hub folder | `Z_Sanctuary_Universe` |
| Turtle branches | `cursor/zsanctuary/<topic>` |
| Phase receipts | `docs/PHASE_*_GREEN_RECEIPT.md` |
| Reports | `data/reports/z_*_{status,report}.{json,md}` |
| Prefer registry `id` over informal nicknames in automation | `z-labs` not ad-hoc aliases |
| Typos in legacy paths | Preserve until chartered rename (e.g. Pets Care path) — document, do not silent-fix |

---

## Article IX — Change-control protocol

### IX.1 Turtle Mode (default)

1. Never edit `main` directly.
2. Small branches: `cursor/zsanctuary/…`
3. One domain per change set (UI · scripts · registry · docs).
4. State files before edit; tests + rollback after.
5. Human review before merge.
6. No auto-merge · no auto-deploy · no unsolicited external connections.

### IX.2 Autonomy ladder (summary)

| Level | Automatic? | Examples |
| ------------------- | ---------------------- | -------------------------------------- |
| L0 Observe | Yes (read-only) | Scans, diffs |
| L1 Report | Yes (controlled paths) | Traffic, CAR², readiness JSON |
| L2 Safe hygiene | Opt-in | Lint autofix when invoked |
| L3 Patch suggestion | Human review | PRs, plans |
| L4 Controlled apply | AMK per slice | Scoped approved edits |
| L5 Sacred | Charter + DRP | Deploy, secrets, live bridges, billing |

### IX.3 Constitution amendments

Amendments require: AMK consent · dated edition bump · update to State of the Universe errata or next Annual Review · no silent rewrite of frozen articles without edition note.

---

## Article X — Stewardship rules

1. **Preserve before replace** — Preservation Principle (Article II).
2. **Evolve with gates** — Evolution Principle (Article III).
3. **Observe before modify** — prefer Cycle Observe / reports / dry-runs.
4. **Verify before trust** — triple sources when material; mark Needs Human Verification when incomplete.
5. **Document before automate** — no new silent automation without registry + docs.
6. **Strengthen before expand** — awaken SSWS and backups before new product sprawl.
7. **JSON leads generated Markdown** for readiness-class reports (sync lane after Wave 1).
8. **Readiness ≠ deploy** — advisory signals never authorize production alone.
9. **Compassion and 14 DRP** outrank convenience when in conflict.
10. **Trace recommendations** — Intelligence Principle (Article XII).
11. **Trace signals in time** — Freshness Principle (Article XIII).
12. **Review before significant action** — Stewardship Principle (Article XIV).

---

## Article XI — Freeze seal

| Item | State |
| -------------------------------- | ------------- |
| Architecture identities | **FROZEN** |
| Register-or-don't | **FROZEN** |
| AI hierarchy | **FROZEN** |
| Project registries listed herein | **FROZEN** |
| Naming conventions | **FROZEN** |
| Change-control / Turtle / ZAG | **FROZEN** |
| Preservation Principle | **PERMANENT** |
| Evolution Principle | **PERMANENT** |
| Steward's Oath | **PERMANENT** |
| Intelligence Principle | **PERMANENT** (v1.1) |
| Freshness Principle | **PERMANENT** (v1.2) |
| Stewardship Principle | **PERMANENT** (v1.3) |

**AMK acceptance**

- [x] Wording accepted — Constitution v1.0 **FROZEN** (Option 3 · 2026-07-24 · includes Evolution Principle)
- [x] Amendment accepted — Constitution **v1.1** Intelligence Principle + Ops Center spine recognition (2026-08-01)
- [x] Amendment accepted — Constitution **v1.2** Freshness Principle (2026-08-03)
- [x] Amendment accepted — Constitution **v1.3** Stewardship Principle (2026-08-03) · Quality Gate ritual · *deliberate human review before significant action*

---

## Article XII — The Intelligence Principle

**Permanent rule (edition 1.1 · AMK-Goku 2026-08-01):**

> Every recommendation must be traceable to evidence.

### Clarifications

| Term | Meaning |
| --- | --- |
| Recommendation | Any prioritized action, morning insight, steward alert ranking, or “best next step” offered to the human steward |
| Traceable to evidence | Explainable via cited reports, registries, governance documents, stewardship certificates, or verified observations |
| Summarize / prioritize / connect | Allowed — invention is not |
| Low confidence | Mark **Needs Human Verification**; do not present as proven fact |
| Steward Intelligence | Functional synthesis layer — **not** another AI personality; does not decide, deploy, or override SSWS/EAII/Indicators |

**AI advises. Humans decide.** Evidence keeps advice honest as the ecosystem grows.

---

## Article XIII — The Freshness Principle

**Permanent rule (edition 1.2 · AMK-Goku 2026-08-03):**

> Every operational signal must be traceable in time.

### Clarifications

| Term | Meaning |
| --- | --- |
| Operational signal | Status lights, readiness bands, observe/deploy rollups, health pulses, morning briefing claims drawn from reports |
| Traceable in time | Display or cite `generated_at` / equivalent age (e.g. “Updated 2 hours ago”) so stewards know currency before acting |
| Stale ≠ false | An old BLUE/GREEN may still describe a past truth — it is **untrustworthy for action** until refreshed or explicitly accepted with NHV |
| Freshness is part of trust | Color without age is incomplete stewardship information |
| Relation to Art. XII | Evidence answers *what*; Freshness answers *when* — both required for responsible decisions |

**Practice:** Morning Cockpit Report Age (Turtle Step 1) is the reference implementation of this Principle for Mission Control pulses.

---

## Article XIV — The Stewardship Principle

**Permanent rule (edition 1.3 · AMK-Goku 2026-08-03):**

> Every significant action should be preceded by deliberate human review.

### Clarifications

| Term | Meaning |
| --- | --- |
| Significant action | Merge to protected branches · deploy · public launch · payment/legal/pricing · major refactor · archive/delete · new canonical citizen (project/module/AI/dashboard) · material registry or governance change |
| Deliberate human review | A named human steward pauses and uses the [Quality Gate / Takeoff Checklist](../Z_SANCTUARY_QUALITY_GATE_TAKEOFF_CHECKLIST.md) (or equivalent care) before acting |
| Ritual ≠ software | The Quality Gate informs; it **never** auto-authorizes or replaces judgment |
| Ready for Steward Decision | Checklist outcome wording — prepares; does not say PASS |
| First filter | *Does this strengthen stewardship?* If unclear, wait |

**AI advises. Humans decide.** Culture outlasts any single dashboard.

---

## Related documents

- [State of the Universe Report 2026](../Z_SANCTUARY_STATE_OF_THE_UNIVERSE_REPORT_2026.md)
- [Operations Center layers](../Z_SANCTUARY_OPERATIONS_CENTER_LAYERS.md)
- [Registry Atlas](../Z_SANCTUARY_REGISTRY_ATLAS.md)
- [Quality Gate Takeoff Checklist](../Z_SANCTUARY_QUALITY_GATE_TAKEOFF_CHECKLIST.md)
- [Stewardship is the Center](../Z_SANCTUARY_STEWARDSHIP_IS_THE_CENTER.md)
- [Backup Readiness Operation](../Z_BACKUP_READINESS_OPERATION.md)
- [Wave 1 Runbook](../Z_BACKUP_WAVE1_RUNBOOK.md)
- [Stewardship Certificate Protocol](Z_STEWARDSHIP_CERTIFICATE_PROTOCOL.md)
- [Hierarchy Chief](../Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md)
- [Foundation Doctrines](Z_SANCTUARY_FOUNDATION_DOCTRINES.md)
- [Annual Universe Review](Z_SANCTUARY_ANNUAL_UNIVERSE_REVIEW.md)
- [AI Builder Context](../AI_BUILDER_CONTEXT.md)
- Turtle Mode: `.cursor/rules/z-turtle-mode-cursor-agents.mdc`

---

_Z-Sanctuary Universe Constitution v1.3 — FROZEN architecture · Intelligence + Freshness + Stewardship Principles PERMANENT · Stewardship Era_
