# Z-Sanctuary: Hierarchy Chief & Observer View

**Purpose:** Single **authority and architecture** view so all works and upgrades across projects are **bullet** (aligned) with Z-EAII, Z-Super Overseer, Z-HODP, Folder Manager AI, and the rest. **Cursor AI and any AI** working on any project must **check this document (the Hierarchy Chief) first when unsure** about where a change belongs, how modules relate, or whether a task conflicts with the operational roof.

**Role of this doc:** It is the **Observer of high-class architecture** — the one place that defines the hierarchy and the full picture so every contributor (human or AI) sees the same vision and defers to the chief when in doubt.

---

## 1. Rule for Cursor and Any AI

**When unsure** about any of the following, **read this document first**, then the linked doc for the relevant layer:

- Where a new module or feature belongs
- Whether a change conflicts with the operational roof (Z-Super Overseer, Z-EAII, Z-SSWS)
- How the dashboard, registry, vault, or state reports relate to each other
- Which project or repo owns a given capability (Organiser vs ZSanctuary vs Amk-Goku)
- How to keep upgrades aligned across Z-EAII, Z-HODP, Folder Manager, and Zuno

**Authority order (check in this order when resolving conflicts):**

1. **This document** (Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md) — defines the hierarchy and chief.
2. **Z-Super Overseer** spec (Organiser: `docs/Z-SUPER-OVERSEER-AI.md`) — operational roof; tasks, registry, launcher, auto-run.
3. **Z-HODP** (Head Organiser Dashboards) — Control Centre, Z Blueprint, Panel Directory; single dashboard surface.
4. **Z-EAII** — registry, ping, AIDFU, doorway; all projects report here.
5. **Folder Manager AI** — vault, snapshots, retention; no structural change without policy.
6. **Zuno** — state and reflection; reports and trends only; no execution authority.
7. **Master Register & Full Build Checklist** — module list and coverage; no new module without register.

---

## 2. Who Is the Hierarchy Chief?

The **Hierarchy Chief** is the **Z-Super Overseer AI** — the single operational roof that unifies:

- **Z-EAII** (registry, ping, launcher, watchdog)
- **Auto-run / full-load** (on-open tasks, task.allowAutomaticTasks)
- **Z-SSWS** (multi-workspace, server 5502, dashboard)

**Canonical spec:** `C:\Cursor Projects Organiser\docs\Z-SUPER-OVERSEER-AI.md` (when working from Organiser). In ZSanctuary_Universe, **this document** is the chief reference that points to the Overseer and defines the full hierarchy so that **even when the Overseer doc lives in another repo**, Cursor and any AI working **here** or in **any** Z-Sanctuary project know to check **this Observer View first**, then the Overseer doc for operational details.

---

## 3. Full Observer Architecture (One Picture)

```text
                    ┌─────────────────────────────────────────────────────────────────┐
                    │  HIERARCHY CHIEF: Z-Super Overseer AI                            │
                    │  (Operational roof: Z-EAII + auto-run + Z-SSWS)                   │
                    │  Spec: Organiser docs/Z-SUPER-OVERSEER-AI.md                       │
                    └───────────────────────────────┬───────────────────────────────────┘
                                                    │
        ┌───────────────────────────────────────────┼───────────────────────────────────────────┐
        │                                           │                                           │
        ▼                                           ▼                                           ▼
┌───────────────────┐                   ┌───────────────────┐                   ┌───────────────────┐
│  Z-HODP            │                   │  Z-EAII             │                   │  Z-SSWS           │
│  Head Organiser    │                   │  Registry, ping,    │                   │  Server 5502,     │
│  Dashboards        │                   │  AIDFU, launcher,   │                   │  multi-workspace,  │
│  · Control Centre  │                   │  watchdog           │                   │  dashboard host   │
│  · Z Blueprint     │                   │  z-eaii-registry    │                   │  Auto Boot task   │
│  · Panel Directory │                   │  Organiser + all    │                   └───────────────────┘
│  · Lens modes      │                   │  projects          │
│  Single surface    │                   └──────────┬──────────┘
└─────────┬─────────┘                              │
          │                                        │
          │         ┌─────────────────────────────┼─────────────────────────────┐
          │         │                             │                             │
          ▼         ▼                             ▼                             ▼
┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│  Folder Manager AI │  │  Zuno AI           │  │  Module Registry    │  │  Master Register &  │
│  Vault, snapshots, │  │  State, reflection │  │  Z_module_registry │  │  Full Build         │
│  retention, policy│  │  7-day trend,      │  │  Sync, audit        │  │  Checklist          │
│  z_folder_manager  │  │  weekly reflection │  │  Dashboard panels  │  │  No doc left out    │
└───────────────────┘  └───────────────────┘  └───────────────────┘  └───────────────────┘
          │                     │                         │                        │
          └─────────────────────┴─────────────────────────┴────────────────────────┘
                                                    │
                                    All works and upgrades must align with this stack.
                                    When unsure → check this doc (Hierarchy Chief) first.
```

---

## 4. Layer Definitions (Bullet Alignment)

| Layer | Name | Role | When to Check |
| ------------------ | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Chief** | Z-Super Overseer AI (**Z-OSHA** = Overseer Head Chief AI) | One roof: Z-EAII + auto-run + Z-SSWS. Confirmations/approvals for completion and sync. No task or port that conflicts with Overseer. | Any change to tasks, registry, launcher, or server. |
| **ASAC&CP** | Z-ASAC&CP (Auto-Sync After Completion & Confirmations/Approvals) | Sync runs only after completion is confirmed and approved by Z-EAII or Z-OSHA. See [Z-FULL-VISION-AND-REINFORCEMENT.md](Z-FULL-VISION-AND-REINFORCEMENT.md). | Post-completion sync, approval gates. |
| **ALD** | Z-ALD (Z-Alert-Leak-Detection) | Detects data leaks, misalignments, informal/malicious activity; feeds Z-Security; linked to Harisha, Vegeta, Angels, Ghosts. Observational and alert-only. | Security alerts, leak/misalignment checks. |
| **ACN/MTEH** | Z-ACN/MTEH (Auto Creations — New Modules, Tools, Extensions, HTML) | Single path for every new module, tool, extension, or HTML web app: register, manifest, control plane, §9 verification. See [Z-ACN-MTEH-AUTO-CREATIONS-NEW-MODULES-TOOLS-EXTENSIONS.md](Z-ACN-MTEH-AUTO-CREATIONS-NEW-MODULES-TOOLS-EXTENSIONS.md). | New module, tool, extension, or HTML web app. |
| **HODP** | Z-HODP (Head Organiser Dashboards) | Single dashboard surface: Control Centre (operator home), Z Blueprint (Register/Checklist/INDEX), Panel Directory (Show All, layout presets), Lens modes. All dashboard upgrades must stay under this roof. | Any new panel, tab, or dashboard behaviour. |
| **EAII** | Z-EAII | Registry of projects/apps, ping, AIDFU, doorway, launcher, watchdog. All projects register here; Cursor Organiser + SKYSCRAPER + aimanity. | New project, new app, new launch target. |
| **SSWS** | Z-SSWS | Auto multi-workspace, server on 5502, dashboard open. Z: SSWS Auto Boot on folder open. | Server port, dashboard URL, workspace list. |
| **Folder Manager** | Folder Manager AI | Vault (safe_pack/z_sanctuary_vault/folder_manager), snapshots, retention, policy. No structural move without policy. | Snapshot, restore, retention, vault layout. |
| **Zuno** | Zuno AI | State report, 7-day trend, weekly reflection. Observational only; no execution authority. | New metric, new report, dashboard trend panel. |
| **Registry** | Module Registry | Z_module_registry.json, sync from manifest, audit. Single list of modules for dashboard and scripts. | New module, status change, launch task. |
| **Register** | Master Register & Checklist | Z-MASTER-MODULES-REGISTER.md, Z-FULL-BUILD-CHECKLIST.md. Ideas from Huge file; no document left out. | New module idea, phase, or doc coverage. |
| **OctoNero** | 8-guardian orchestration | Z-formulas (Z-Octo-Ant Neuro Flex); applies across all projects. Layers: Zuno, Folder Manager, EAII, SSWS, Z-HODP, Module Registry, Security, Formula Registry. | Cross-project formula awareness; see [Z-SSWS-ALL-PROJECTS-AND-AI-COLONY-BLUEPRINT.md](Z-SSWS-ALL-PROJECTS-AND-AI-COLONY-BLUEPRINT.md). |

---

## 5. Making All Works and Upgrades Bullet (Aligned)

For every **work or upgrade** in any project (ZSanctuary_Universe, Organiser, Amk-Goku, SKYSCRAPER, etc.):

1. **Check this doc first** — confirm which layer is affected (Overseer, HODP, EAII, Folder Manager, Zuno, Registry, Register).
2. **Respect the chief** — no task, port, or behaviour that conflicts with Z-Super Overseer (Z-EAII, auto-run, Z-SSWS).
3. **Dashboard = HODP** — any dashboard change (new panel, new tab, new link) belongs under Head Organiser Dashboards; keep Control Centre, Blueprint, and Panel Directory as the single surface.
4. **EAII = single registry** — new projects or launch targets go through Z-EAII registry; do not duplicate registry logic elsewhere.
5. **Folder Manager = policy** — snapshot/restore/retention follow existing scripts and policy; no ad-hoc vault moves.
6. **Zuno = observe only** — new metrics or reports are fine; no execution or structural change from Zuno.
7. **Register & Checklist** — new modules or phases get an entry in the register and (if applicable) the checklist; keep both in sync.

---

## 6. Where Things Live (Quick Reference)

| Item | Location (ZSanctuary_Universe unless noted) |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **This doc (Hierarchy Chief)** | docs/Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md |
| **Z-Super Overseer spec** | Organiser: docs/Z-SUPER-OVERSEER-AI.md |
| **Z-HODP (dashboard)** | dashboard/Html/index-skk-rkpk.html (Control Centre, Blueprint, Panel Directory) |
| **Z-EAII** | Organiser: z-eaii-registry.json, tasks, launcher; refs in rules/docs |
| **Folder Manager** | scripts/z_folder_manager_guard.mjs, data/reports/z_folder_manager_status.json |
| **Zuno** | scripts/z_zuno_state_report.mjs, scripts/zuno_weekly_reflection.py, core/z_zuno_trend_panel.js |
| **Module Registry** | data/Z_module_registry.json, scripts/z_module_registry_sync.mjs |
| **Master Register** | docs/Z-MASTER-MODULES-REGISTER.md |
| **Full Build Checklist** | docs/Z-FULL-BUILD-CHECKLIST.md |
| **Cursor rule (check chief)** | .cursor/rules/z-hierarchy-chief.mdc |
| **Any-AI rule** | AGENTS.md (root) → points to this doc |
| **Z-SSWS + All Projects + AI Colony** | [Z-SSWS-ALL-PROJECTS-AND-AI-COLONY-BLUEPRINT.md](Z-SSWS-ALL-PROJECTS-AND-AI-COLONY-BLUEPRINT.md) — apply SSWS to all PC-root projects; EAII, Overseer, HODP, Folder Manager; OctoNero, Z-formulas, AI Tower, AI Skyscraper. |
| **Full Vision & Reinforcement (Z-OSHA, Z-ASAC&CP, Z-ALD, Formulas)** | [Z-FULL-VISION-AND-REINFORCEMENT.md](Z-FULL-VISION-AND-REINFORCEMENT.md) — Overseer Head Chief approvals; Auto-Sync after completion with confirmations; Alert/Leak/Detection linked to Z-Security and Harisha/Vegeta/Angels/Ghosts; Z-Formulas reinforce Z-SSWS, Z-OHDO, and all. |
| **Full completions test run & communications-flow unity** | [Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md](Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md) — Rule: full completions test run; every AI/project one with core (PC/NAS > Cursor > AI); creator operate from smartphone anywhere via communications flows. Verification checklist §9. |
| **Z-SCTE (Self Creations Test Ecosystem)** | [Z-SCTE-SELF-CREATIONS-TEST-ECOSYSTEM.md](Z-SCTE-SELF-CREATIONS-TEST-ECOSYSTEM.md) · [data/z_scte_manifest.json](../data/z_scte_manifest.json) — Comms-first to Overseer, HODP, EAII, AI Tower, Zuno; approval before full scans; communications-flow and future-proofing discipline. |
| **Z-OMNI Cursor Upgrade Manifest** | [Z-OMNI-CURSOR-UPGRADE-MANIFEST.md](Z-OMNI-CURSOR-UPGRADE-MANIFEST.md) — Cursor as core node in Z-OMNI; manifest in .cursor/rules/z-omni-unified-organism.mdc; Z: Registry Omni Verify for 100% PC/NAS & Omni-Heart sync. §9 and §10 = Moral and Technical Law. |
| **Z-ACN/MTEH** (Auto Creations — New Modules, Tools, Extensions, HTML) | [Z-ACN-MTEH-AUTO-CREATIONS-NEW-MODULES-TOOLS-EXTENSIONS.md](Z-ACN-MTEH-AUTO-CREATIONS-NEW-MODULES-TOOLS-EXTENSIONS.md) — Single path and checklist for every new module, tool, extension, or HTML web app; register, manifest, control plane, §9 verification. |
| **Z-ACG (Acoustic Living Pulse)** | [Z-ACOUSTIC-LIVING-PULSE-ARCHITECTURE.md](Z-ACOUSTIC-LIVING-PULSE-ARCHITECTURE.md) — Owl/dolphin-inspired passive+active posture; `scripts/z_soundscape_posture.mjs`, `data/reports/z_soundscape_posture.json`, `core/z_soundscape_pulse_panel.js` in **Z-Living Pulse** panel. |
| **Z-HOAI (Hand-On AI Pilot Intelligence)** | [Z_HOAI_PILOT_INTELLIGENCE_PLAN.md](ai-hand/Z_HOAI_PILOT_INTELLIGENCE_PLAN.md) — Related doc: hub **doctrine + triage templates** for pilot feedback; consumer app repos own execution gates and product scripts. Does not change Overseer, registry, or verify chains. |
| **Z-Connection Tree (philosophy)** | [Z-CONNECTION-TREE-PHILOSOPHY.md](Z-CONNECTION-TREE-PHILOSOPHY.md) — Related doc: **memory of presence**, not tracking or ranking; optional presence, anonymized public nodes, no leaderboard or referral pressure; Lite mock + receipt link here for implementation anchor. |
| **Z-UCCR (Universal Canvas Control Realm)** | [Z_UCCR_CHARTER.md](universal-canvas/Z_UCCR_CHARTER.md) — Doctrine: whole-hub visual command realm (panels, guardians, ethics gates, roadmap Z-UCCR-0…); **not** XL2-coupled; read-only doctrine phase until phased implementation; [README](universal-canvas/README.md). |
| **Z-MAOS (Multi-Project AI Operating Supervisor)** | [Z_MAOS_CHARTER.md](z-maos/Z_MAOS_CHARTER.md) — Operator coordination: registry, opening cycle, mini-bot routing, consent gates; read-only scripts (`z:maos-status`, `z:maos-open`, `z:maos-route`); no auto-merge/deploy/extension install; XL2 reference-only in hub manifests. |

---

## 7. Summary

- **Hierarchy Chief** = Z-Super Overseer; **this document** = the Observer View that every AI (Cursor or other) checks first when unsure.
- **Full view** = one architecture (Overseer/Z-OSHA → HODP, EAII, SSWS → Folder Manager, Zuno, Registry, Register); Z-ASAC&CP (sync after approval), Z-ALD (leak/misalignment detection → Z-Security + Angels/Ghosts), and Z-Formulas reinforce Z-SSWS, Z-OHDO, and all; all works and upgrades stay bullet with this stack.
- **Cursor and any AI:** When unsure about architecture, module placement, or cross-project impact → read **docs/Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md** first, then the doc for the relevant layer.

_This keeps the vision alive as one._
