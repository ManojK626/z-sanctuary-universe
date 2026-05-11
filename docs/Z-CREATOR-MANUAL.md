# Z-Creator Manual

**Purpose:** Full reference for the Z-Sanctuary technology structure, AI design, tasks, and workflows so that **anyone** can follow and understand how everything fits together — and work confidently with Cursor and all projects under the PC root.

**Audience:** Creators, operators, and AI (Cursor or other) working in or onboarding to the Z-Sanctuary Universe.

**Web app:** [Z-Creator Manual (HTML)](../public/creator_manual/index.html) — same content as this manual plus **Q&A** and **Z-Note Taker**. Open when the server runs from repo root (e.g. `http://127.0.0.1:5502/docs/public/creator_manual/index.html`).

---

## 1. What the Z-Sanctuary Is

The **Z-Sanctuary Universe** is:

- A **single hub repo** (this repository) that holds the dashboard, Zuno state, module registry, folder manager, Z-formulas, and AI colony (AI Tower, Super Ghost).
- The **SSWS hub**: one server (port 5502), one workspace file (`Z_SSWS.code-workspace`), and one auto-boot chain that starts the server and opens the dashboard when you open the workspace.
- Linked to **all other projects** under your **PC root folder** (e.g. `C:\Cursor Projects Organiser`) via a **project list** (`data/z_pc_root_projects.json`) and **Z-EAII** (registry and launcher in the Organiser).
- Governed by a **single authority** (Hierarchy Chief) and **one operational roof** (Z-Super Overseer: Z-EAII + auto-run + Z-SSWS) so that every change and every project stays aligned.

**In one sentence:** One hub, one dashboard, one registry, one authority — and all projects under your PC root are known, launchable, and organised by the same stack.

---

## 2. Technology Structure (High Level)

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  HIERARCHY CHIEF: Z-Super Overseer AI                                     │
│  (One roof: Z-EAII + auto-run + Z-SSWS)                                  │
│  Spec: Organiser docs/Z-SUPER-OVERSEER-AI.md                             │
└─────────────────────────────────────┬───────────────────────────────────┘
                                      │
     ┌────────────────────────────────┼────────────────────────────────┐
     │                                │                                │
     ▼                                ▼                                ▼
┌─────────────┐              ┌─────────────┐              ┌─────────────┐
│  Z-HODP     │              │  Z-EAII     │              │  Z-SSWS     │
│  Head       │              │  Registry,  │              │  Server     │
│  Organiser  │              │  ping,      │              │  5502,      │
│  Dashboards │              │  launcher   │              │  dashboard  │
│  (Control   │              │  All        │              │  Auto Boot  │
│   Centre,   │              │  projects   │              │             │
│   Blueprint,│              │  register   │              │             │
│   All       │              │  here       │              │             │
│   projects) │              │             │              │             │
└──────┬──────┘              └──────┬──────┘              └─────────────┘
       │                             │
       │    ┌────────────────────────┼────────────────────────┐
       │    │                        │                        │
       ▼    ▼                        ▼                        ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Folder     │  │  Zuno AI    │  │  Module     │  │  Master     │
│  Manager AI │  │  State,     │  │  Registry   │  │  Register & │
│  Vault,     │  │  reflection │  │  Sync,      │  │  Full Build │
│  snapshots  │  │  7-day      │  │  audit      │  │  Checklist  │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
       │
       │  OctoNero = 8 guardians (Z-formulas applied across all projects)
       │  AI Colony = AI Tower (hub) + AI Skyscraper (member project)
       ▼
  All projects under PC root: hub (ZSanctuary_Universe) + members
  (Z-OMNI, Skyscraper, Amk-Goku, …) in data/z_pc_root_projects.json
```

---

## 3. PC Root and All Projects

**PC root** = the folder on your machine that contains all Z and related projects (e.g. `C:\Cursor Projects Organiser`).

**Hub** = **ZSanctuary_Universe** (this repo). It runs:

- The dashboard (Z-HODP)
- The server on port 5502
- Z-SSWS Auto Boot when you open the workspace
- Zuno, Module Registry, Folder Manager, formula registry

**Members** = Other folders under PC root (e.g. Z-OMNI-Sanctuary, Z-SANCTUARY AI SKYSCRAPER, Amk-Goku Dashboards 2). They do **not** run their own SSWS; they are **registered** in:

- **data/z_pc_root_projects.json** — used by the dashboard “All projects” block and by future backup/repair tasks.
- **Z-EAII** (in Cursor Projects Organiser) — registry and launcher so you can open or launch each project from one place.

**Extras & Tools (PC root sink):** Installers, portable tools, and non-repo clutter belong under **`Extras & Tools`** at PC root (registered in the same JSON). Hub **Z-Folder Manager** rules apply only inside **ZSanctuary_Universe**; see [Z-PC-ROOT-EXTRAS-AND-TOOLS-SINK.md](Z-PC-ROOT-EXTRAS-AND-TOOLS-SINK.md).

**How it works:**

- You open **ZSanctuary_Universe** (or a parent workspace that includes it) in Cursor.
- The dashboard at `http://127.0.0.1:5502` shows **All projects** in the Control Centre; the hub has a “Dashboard” link, members show their launch task.
- All projects and their content are intended to work **in accordance** with this structure: one authority, one registry, one dashboard.

---

## 4. Hierarchy Chief and Authority

**When unsure** (about where a change belongs, whether something conflicts with the operational roof, or how modules relate), **check the Hierarchy Chief first.**

**Canonical doc:** [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md)

**Authority order:**

1. **This doc (Observer View)** — defines hierarchy and chief.
2. **Z-Super Overseer** (Organiser: docs/Z-SUPER-OVERSEER-AI.md) — operational roof.
3. **Z-HODP** — single dashboard surface.
4. **Z-EAII** — registry and launch.
5. **Folder Manager AI** — vault and snapshots.
6. **Zuno** — state and reflection only.
7. **Master Register & Full Build Checklist** — module and doc coverage.

**Cursor and any AI:** The project includes:

- **AGENTS.md** (repo root) — tells any AI to read the Hierarchy Chief first when unsure.
- **.cursor/rules/z-hierarchy-chief.mdc** — tells Cursor to check the Hierarchy Chief first when unsure.
- **.cursor/rules/z-canvas-sanctuary.mdc** — Canvas and Register/Checklist; also references the Hierarchy Chief.

So the **general structure** and **AI design** are aligned: one authority, one place to look when in doubt.

---

## 5. Z-SSWS (Workspace, Server, Dashboard)

**Z-SSWS** = the system that ties workspace, server, and dashboard together.

| Piece | What it is |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Z_SSWS.code-workspace** | Multi-root workspace file (e.g. ., apps, core, docs, rules). Open this (or the repo root) in Cursor. |
| **Server 5502** | Static server from repo root so the dashboard and reports are served at `http://127.0.0.1:5502` (not file://). |
| **Z: SSWS Auto Boot** | Task that runs on folder open (if automatic tasks are allowed): runs guards → starts server → opens dashboard. |
| **Z: SSWS Verify** | Python script that checks .vscode/settings, .vscode/tasks, formula registry, vault manifest, security policy, workspace file. |
| **Z: SSWS Daily Report** | Writes `data/reports/z_ssws_daily_report.json` (workspace name, formula registry status, system status). |

**To use confidently:** Open the workspace, ensure **Allow Automatic Tasks** is on, and run **Z: SSWS Verify** periodically. The dashboard “Z-SSWS” banner shows active/inactive based on the daily report.

---

## 6. Z-EAII, Z-Super Overseer, Z-HODP, Folder Manager

**Z-EAII** (lives in Cursor Projects Organiser):

- **Registry** of all projects/apps (paths, launch tasks, ping targets).
- **Launcher** and **watchdog** so every project is known and launchable from one place.
- **Align:** Keep `data/z_pc_root_projects.json` in the hub in sync with the EAII registry (same list of projects).

**Z-Super Overseer:**

- **One roof** for operations: Z-EAII + auto-run + Z-SSWS.
- No task or port should conflict with the Overseer spec (Organiser: docs/Z-SUPER-OVERSEER-AI.md).

**Z-HODP (Head Organiser Dashboards):**

- **Single dashboard** = `dashboard/Html/index-skk-rkpk.html`.
- **Control Centre** = operator home: quick links (Hierarchy Chief, Register, Checklist, INDEX, etc.), Quiet/Trust badges, **All projects** block.
- **Z Blueprint** = links to Register, Checklist, Hierarchy Chief, Canvas guide.
- **Panel Directory** = Show All / Hide All, layout presets (Focus, Analysis, Governance).

**Folder Manager AI:**

- **Vault:** `safe_pack/z_sanctuary_vault/folder_manager` — snapshots, retention, policy.
- **Scripts:** `scripts/z_folder_manager_guard.mjs` (snapshot, recreate, status), `scripts/z_folder_manager_weekly_retention.mjs`.
- **Reports:** `data/reports/z_folder_manager_status.json` / `.md`.
- **Role:** No structural move without policy; backup of other projects (when implemented) uses the project list.

---

## 7. Z-Formulas and OctoNero

**Z-Formulas** (see [Z-ULTRA-INSTINCTS-AND-FORMULAS.md](Z-ULTRA-INSTINCTS-AND-FORMULAS.md)):

- Core formulas (Z-Mega Infinite Compassion, LPBS, GGAESP 360, Multi-Dimensional Cubes, Z-OMNI).
- **Z-OMNI** includes the **Z-Octo-Ant Neuro Flex Compassion Overseer** (8 gentle guardians).

**OctoNero** = the orchestration layer that applies these formulas and the **8 guardians** across all projects. The eight are represented as:

- Zuno, Folder Manager, EAII, SSWS, Z-HODP, Module Registry, Security/Policy, Formula Registry.

**Where it lives:**

- **rules/Z_FORMULA_REGISTRY.json** — formulas, vault path, integration targets (core, dashboard, miniai, ai_tower, etc.).
- **Z-SSWS verify** and **Zuno** use the formula registry as a gate.
- **Formula-aware projects** (in `z_pc_root_projects.json`) can optionally have a `z_sanctuary_link.json` pointing to the hub; the convention is “same formula layer everywhere.”

---

## 8. AI Colony: AI Tower and AI Skyscraper

**AI Tower** (in the hub):

- **Location:** `core/ai_tower/` (z_ai_tower_core.js, z_ai_agent_base.js, z_super_ghost.js).
- **Role:** Single AI colony in this repo; agents have owner, status; Zuno weekly reflection and `data/reports/z_ai_status.json` report on it.
- Other projects **do not duplicate** AI Tower; they use the **same dashboard** (5502) for status or are registered in EAII as “uses AI Tower.”

**AI Skyscraper:**

- **Separate project** (e.g. Z-SANCTUARY AI SKYSCRAPER) under PC root.
- **Role:** Member of the same “colony” — registered in EAII and in `z_pc_root_projects.json`; can consume Z-formulas and the same dashboard/state.
- Linked via **same workspace** (when using a parent multi-root workspace) and **same authority** (Hierarchy Chief).

---

## 9. Tasks Reference (Key Tasks)

Run from Cursor: **Terminal → Run Task** (or command palette “Tasks: Run Task”).

| Task | What it does |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Z: Sanctuary Structure Verify** | Runs `node scripts/z_sanctuary_structure_verify.mjs` — checks PC root config, key docs, dashboard, tasks, Zuno, Module Registry, Folder Manager. |
| **Z: SSWS Verify** | Python check: workspace, formula registry, vault, security policy. |
| **Z: SSWS Auto Boot** | On folder open: guards → server 5502 → open dashboard. |
| **Z: SSWS Daily Report** | Writes z_ssws_daily_report.json. |
| **Z: Zuno State Report** | Generates zuno_system_state_report.json/md, updates history. |
| **Z: Zuno Weekly Reflection** | Generates z_weekly_reflection.md from daily + audits. |
| **Z: Module Registry Sync** | Builds Z_module_registry.json and audit from manifest. |
| **Z: Workspace Root Guard** | Ensures cwd is canonical root (package.json + registry or workspace file). |
| **Z: Folder Manager** (snapshot / status / recreate) | Vault snapshots and status. |
| **Z: HTML Static Server (5502)** | Starts static server on port 5502 from repo root. |
| **Z: Open Main Dashboard (Z-Sanctuary)** | Opens dashboard in browser. |

**Allow Automatic Tasks:** In VS Code/Cursor, set `task.allowAutomaticTasks` to **on** so that **Z: SSWS Auto Boot** can run when you open the workspace.

---

## 10. Dashboard Guide

**URL:** `http://127.0.0.1:5502/dashboard/Html/index-skk-rkpk.html` (when server runs from repo root).

**Tabs / panels (summary):**

- **Control Centre** — operator home: summary, badges, Quick links (Hierarchy Chief, Register, Checklist, INDEX, etc.), Compassion & truth, **All projects** (from `z_pc_root_projects.json`), link to SSWS + All Projects blueprint.
- **Panel Directory** — Show All / Hide All, layout presets, split layout.
- **Z Blueprint** — Register, Checklist, Hierarchy Chief, priorities, Canvas guide.
- **Status Rail** — Zuno 7-Day Trend, SSWS status, Auto-Run, Pending Audit, Storage Hygiene, etc.
- **Module Registry, Governance, Autopilot, Legal & Help, Benchmarks, etc.** — as per the register and Panel Directory.

**All projects block:**

- Fetches `/data/z_pc_root_projects.json`.
- Shows each project with role (hub/member), formula badge if applicable, name, and Dashboard link (hub) or launch task label (members).

---

## 11. Adding a New Project Under PC Root

1. **Create or clone** the project folder under your PC root (e.g. `C:\Cursor Projects Organiser\MyNewProject`).
2. **Edit** `data/z_pc_root_projects.json` in ZSanctuary_Universe: add an entry to `projects` with `id`, `name`, `path` (relative to `pc_root`), `role: "member"`, `ssws: false`, `formula_aware` (true/false), and optionally `eaii_launch_task`.
3. **Register** the project in **Z-EAII** (Organiser) so it appears in the launcher and watchdog.
4. **Optional:** In the new project root, add `z_sanctuary_link.json` with `"hub": "ZSanctuary_Universe"`, `"formula_aware": true` if it should follow the formula layer.
5. **Refresh** the dashboard — the new project appears in **All projects**.
6. **Optional:** Add the folder to a **parent multi-root workspace** at PC root so all projects open together in Cursor.

---

## 12. NAS (Brief)

When you introduce the NAS (e.g. UGREEN NASync DXP4800 Plus):

- **Layout** on NAS: Sanctuary_Core, Z_AI_Engines, Z_Projects, Z_Backups, Z_Archives, Z_Datasets (see [Z-SANCTUARY-NAS-ARCHITECTURE-BLUEPRINT.md](Z-SANCTUARY-NAS-ARCHITECTURE-BLUEPRINT.md)).
- **Hub** (ZSanctuary_Universe) can live on NAS; your PC remains the **terminal** that runs Cursor and tasks.
- **Backup:** Folder Manager snapshots and optional backup of all projects (from `z_pc_root_projects.json`) to NAS.
- **Authority and AI design** stay the same: one Hierarchy Chief, one Overseer, one dashboard, one registry.

---

## 13. Verification Before Celebrating

To **test success** and ensure all projects and AI design work confidently:

1. **Run:** `node scripts/z_sanctuary_structure_verify.mjs` (or task **Z: Sanctuary Structure Verify**).
   - Expect: **PASS** (all [OK]).
2. **Run:** [Z-SANCTUARY-VERIFICATION-CHECKLIST.md](Z-SANCTUARY-VERIFICATION-CHECKLIST.md) — step-by-step human checklist (SSWS verify, dashboard, All projects block, tasks, PC root list, optional Auto Boot).
3. **Fix** any [FAIL] or unchecked item, then re-run until everything passes.

---

## 14. Document Map (Where to Read More)

| Topic | Document |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Authority and hierarchy** | [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md) |
| **All projects + SSWS + AI colony** | [Z-SSWS-ALL-PROJECTS-AND-AI-COLONY-BLUEPRINT.md](Z-SSWS-ALL-PROJECTS-AND-AI-COLONY-BLUEPRINT.md) |
| **NAS and PC vs NAS** | [Z-SANCTUARY-NAS-ARCHITECTURE-BLUEPRINT.md](Z-SANCTUARY-NAS-ARCHITECTURE-BLUEPRINT.md) |
| **Verification** | [Z-SANCTUARY-VERIFICATION-CHECKLIST.md](Z-SANCTUARY-VERIFICATION-CHECKLIST.md) |
| **Modules and phases** | [Z-MASTER-MODULES-REGISTER.md](Z-MASTER-MODULES-REGISTER.md), [Z-FULL-BUILD-CHECKLIST.md](Z-FULL-BUILD-CHECKLIST.md) |
| **New modules, tools, extensions, HTML (Z-ACN/MTEH)** | [Z-ACN-MTEH-AUTO-CREATIONS-NEW-MODULES-TOOLS-EXTENSIONS.md](Z-ACN-MTEH-AUTO-CREATIONS-NEW-MODULES-TOOLS-EXTENSIONS.md) |
| **Cursor Canvas and Blueprint** | [Z-CURSOR-CANVAS-GUIDE.md](Z-CURSOR-CANVAS-GUIDE.md) |
| **Z-Formulas** | [Z-ULTRA-INSTINCTS-AND-FORMULAS.md](Z-ULTRA-INSTINCTS-AND-FORMULAS.md) |
| **Z-Living Pulse + Z-ACG (soundscape)** | [Z-LIVING-PULSE.md](Z-LIVING-PULSE.md), [Z-ACOUSTIC-LIVING-PULSE-ARCHITECTURE.md](Z-ACOUSTIC-LIVING-PULSE-ARCHITECTURE.md) — task **Z: Soundscape Posture** |
| **Zuno AI** | [Z-ZUNO-AI-FULL-REPORT.md](Z-ZUNO-AI-FULL-REPORT.md) |
| **Entry point** | [INDEX.md](../INDEX.md) |

---

## 15. Summary

- **Z-Sanctuary** = one hub (this repo), one dashboard, one registry, one authority (Hierarchy Chief), one operational roof (Z-Super Overseer).
- **All projects** under your PC root are listed in `data/z_pc_root_projects.json` and (in sync) in Z-EAII; they appear in the dashboard **All projects** block and work in accordance with this structure.
- **AI design** = Zuno (state), AI Tower (colony), OctoNero (8 guardians), formula registry, and Cursor/any-AI rules that say “check Hierarchy Chief when unsure.”
- **Tasks** = SSWS (verify, daily report, Auto Boot), Zuno (state report, weekly reflection), Module Registry sync, Folder Manager, Structure Verify, and server/dashboard launch.
- **To follow:** Open the workspace, run **Z: Sanctuary Structure Verify** and the verification checklist, use the dashboard and Control Centre (including All projects), and add new projects via the project list and EAII. When adding **new modules, tools, extensions, or HTML web apps**, follow **Z-ACN/MTEH** ([Z-ACN-MTEH-AUTO-CREATIONS-NEW-MODULES-TOOLS-EXTENSIONS.md](Z-ACN-MTEH-AUTO-CREATIONS-NEW-MODULES-TOOLS-EXTENSIONS.md)). Use this manual and the document map for full detail.

_Z-Creator Manual — for everyone who builds and operates the Z-Sanctuary._
