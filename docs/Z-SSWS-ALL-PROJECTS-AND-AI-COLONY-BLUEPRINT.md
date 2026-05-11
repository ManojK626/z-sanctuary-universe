# Z-SSWS, All Projects & AI Colony — Blueprint

**Purpose:** Use **Z-SSWS** and all Z-Sanctuary tools and extensions across **every project** under your PC root folder; link them with **Z-EAII, Z-Super Overseer, Z-HODP, and Folder Manager AI**; integrate **super mega Z-formulas**, **OctoNero**, and the **AI colony** (AI Tower, AI Skyscraper, and everything those projects contain) so the ecosystem is **self-organising**, **adapts**, **auto-upgrades**, **repairs**, and **launches** as one. Includes research on latest technology for success.

**Authority:** [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md) — when unsure, check the Hierarchy Chief first.

---

## 1. Vision in One Sentence

**One SSWS hub (ZSanctuary_Universe) + one EAII registry + one Overseer + one HODP dashboard + one Folder Manager policy + Z-formulas and OctoNero applied everywhere** so that all projects under your PC root are **discovered**, **launched**, **repaired**, **upgraded**, and **organised** by the same stack, with the AI colony (AI Tower, AI Skyscraper) as the brain.

---

## 2. Z-SSWS Capabilities (What We Already Have)

From the codebase, Z-SSWS today provides:

| Capability | Where | Role |
| ------------------------ | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Multi-root workspace** | `Z_SSWS.code-workspace` | Folders: `.`, `apps`, `core`, `docs`, `rules`. Live Server port 5504 (multiRoot). |
| **Auto Boot chain** | `.vscode/tasks.json` — "Z: SSWS Auto Boot" | On folder open: Workspace Root Guard → Multi-Workspace Guard → Lab Task Structure → Time Guard → SLO → Provenance → Workspace Auto Sweep → Hygiene Autofix → AnyDevices → Gadget Mirrors → Sandbox Phase → Reports Vault Refresh → **HTML Static Server (5502)** → Open HTML Cores → **Open Main Dashboard** → Watch Lens State. |
| **Server 5502** | Task "Z: HTML Static Server (5502)" | Serves dashboard and reports so panels load from `http://127.0.0.1:5502` (not file://). |
| **Dashboard** | `dashboard/Html/index-skk-rkpk.html` | Z-HODP (Control Centre, Blueprint, Panel Directory), Status Rail (Zuno, SSWS, Hygiene, etc.). |
| **SSWS verify** | `scripts/z_ssws_verify.py` | Checks: `.vscode/settings.json`, `.vscode/tasks.json`, `rules/Z_FORMULA_REGISTRY.json`, vault manifest, security policy, `Z_SSWS.code-workspace`. |
| **SSWS daily report** | `scripts/z_ssws_daily_report.py` | Writes `data/reports/z_ssws_daily_report.json` (workspace, formula_registry, system_status). |
| **Workspace root guard** | `scripts/z_workspace_root_guard.mjs` | Ensures cwd has package.json + registry or workspace file (canonical root). |
| **Banner & status** | `core/z_ssws_banner.js` | Dashboard shows "Z-SSWS: active/inactive" and fetches SSWS daily report. |

**Gap to close:** Today SSWS runs **inside ZSanctuary_Universe only**. We need to **extend** it so that **all projects under PC root** (e.g. `C:\Cursor Projects Organiser\...`) are **known** to SSWS, EAII, Overseer, and Folder Manager, and can **share** the same launch/repair/upgrade/organise behaviour.

### 2.1 Z-SSWSs — shadow workspaces (secure one-to-one assignment)

**Naming:** **Z-SSWS** = the single hub stack (this repo). **Z-SSWSs** (spoken “Z-SSWS shadows”) = generated **two-folder** workspaces at **PC root**: always **hub first**, **exactly one member project second**.

| Goal | How |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Same capabilities | Hub folder is `ZSanctuary_Universe`, so **Z: SSWS Auto Boot**, server **5502**, dashboard, formula registry, and guards still run from the hub’s `.vscode/tasks.json`. |
| One assignment per shadow | Each file is `Z_SSWS_Shadow__<project-id>.code-workspace` with **only** that member path alongside the hub — not the full `Z_All_Projects` list. |
| No mix-ups | Do deep work in **one** shadow workspace per Cursor window when you want isolation. Use `Z_All_Projects.code-workspace` when you intentionally need every root visible. |
| Opt-out | In `data/z_pc_root_projects.json`, set `"ssws_shadow": { "enabled": false }` on a member to exclude it from shadow emit. |
| Emit / verify | From hub: `npm run ssws:shadow-emit` (or `ssws:shadow-emit:dry-run`), then `npm run ssws:shadow-verify`. Manifest: `data/z_ssws_shadow_manifest.json` (v3: no embedded `pc_root`; verify resolves `pc_root` from `z_pc_root_projects.json`). |

**Default rule:** every **formula-aware** member with a non-empty `path` and an on-disk folder gets a shadow file, except `role: external` and the hub itself.

---

## 3. PC Root Layout and “All Projects”

**PC root** = the folder that contains all your Z and Amk-Goku projects (e.g. `C:\Cursor Projects Organiser`). From your earlier context it includes:

- **ZSanctuary_Universe** (this repo) — SSWS hub, dashboard, Zuno, Module Registry, Folder Manager, formulas.
- **Z-OMNI-Sanctuary** — OMNI stack.
- **Z-SANCTUARY AI SKYSCRAPER** — AI Skyscraper project (part of AI colony).
- **Amk-Goku Dashboards 2** — Dashboards.
- **scripts**, **docs**, **Backups**, **.vscode**, **Z-EAII** (registry, launcher, watchdog), etc. (some may live inside Organiser or alongside.)

**Strategy:**

1. **Single SSWS hub** = **ZSanctuary_Universe**. Server 5502 and the main dashboard run here. All other projects are **members**.
2. **Z-EAII registry** (in Organiser) lists every project/app with path, launch task, and ping target. Cursor and Overseer use this to **launch** and **watch** all projects.
3. **Multi-root at PC root:** Create (or maintain) a **parent** `.code-workspace` at PC root that includes **all** project folders (ZSanctuary_Universe, Z-OMNI-Sanctuary, Z-SANCTUARY AI SKYSCRAPER, Amk-Goku Dashboards, etc.). When you open that workspace, Cursor sees every project; the **first** or **designated** root runs SSWS Auto Boot (or a thin boot that delegates to ZSanctuary_Universe).
4. **Folder Manager AI** policy applies to ZSanctuary_Universe vault and snapshots; **backup/sync** can copy or mirror selected trees from other projects into `Z_Backups` / `Z_Archives` on NAS (see [Z-SANCTUARY-NAS-ARCHITECTURE-BLUEPRINT.md](Z-SANCTUARY-NAS-ARCHITECTURE-BLUEPRINT.md)).
5. **Z-HODP** dashboard stays the **single surface** for operator; it can show **links** or **badges** to other projects (via EAII registry) and open them or show their status.

A **config file** that lists “all projects under PC root” is defined in §7 so scripts and EAII can consume it.

---

## 4. Linking with Z-EAII, Z-Super Overseer, Z-HODP, Folder Manager AI

| System | How it links to “all projects” |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Z-EAII** | Registry (e.g. `z-eaii-registry.json` in Organiser) lists each project: path, name, launchTask, ping URL, watchdog. **All projects** register here; launcher and ping run from Organiser. When you add a new project under PC root, add an entry to the registry so Overseer and SSWS know it. |
| **Z-Super Overseer** | Overseer doc (Organiser) defines the **one roof**: EAII + auto-run + Z-SSWS. Auto-run tasks (Organiser, SKYSCRAPER, aimanity) and **Z: SSWS Auto Boot** (in ZSanctuary_Universe) stay aligned. No task or port that conflicts. **All projects** are “under” this roof; their tasks are either in the parent workspace or triggered via EAII. |
| **Z-HODP** | Dashboard (ZSanctuary_Universe) is the **Head Organiser**. Add a panel or Control Centre link: “All projects” that reads from EAII registry (or from `data/z_pc_root_projects.json`) and shows **Launch**, **Open folder**, **Status** per project. Single place to see and control everything. |
| **Folder Manager AI** | Today it manages **ZSanctuary_Universe** vault and snapshots. For “all projects”: (1) Keep vault/snapshot in this repo; (2) Optional: **backup** other projects’ key paths to NAS `Z_Backups/pc_mktiger/` or to a shared backup task that lists paths from the same config. Folder Manager **policy** (retention, entrypoints) applies to this repo; **backup** is the bridge to other projects. |

So: **EAII** = registry and launch; **Overseer** = one roof and task discipline; **HODP** = one dashboard with “all projects” view; **Folder Manager** = vault here + optional backup of other projects.

---

## 5. Super Mega Z-Formulas and OctoNero

**Z-Formulas** (from [Z-ULTRA-INSTINCTS-AND-FORMULAS.md](Z-ULTRA-INSTINCTS-AND-FORMULAS.md)):

- Core: Z-Mega Infinite Compassion, LPBS Infinite Progression, GGAESP 6 Chambers + 360° Ring, Multi-Dimensional Cubes, Z-OMNI Architecture.
- Z-OMNI includes **Z-Octo-Ant Neuro Flex Compassion Overseer** (8 gentle guardians) — the “Octo” layer.
- **OctoNero** in this blueprint = the **orchestration layer** that applies these formulas and the **8 guardians** (observe, protect, balance, report) across **all projects**. It is the “Neuro” (nervous system) that connects AI Tower, AI Skyscraper, Zuno, and SSWS so every project is **filtered** by the same compassion and DRP rules.

**Where they live:**

- **Formula registry:** `rules/Z_FORMULA_REGISTRY.json` (vault, formulas, integration_targets: core, dashboard, miniai, ai_tower, safe_pack, etc.).
- **Z-SSWS daily report** already reads the formula registry; **Zuno** and **Overseer** can treat “formula_registry OK” as a gate.
- **OctoNero** = not a single script but a **convention**: (1) Every project that joins the PC-root family **should** pass the same formula/vault/security checks (or be listed as “observer-only”); (2) AI Tower and AI Skyscraper **agents** use the same formula layer when making suggestions or reports; (3) The **8 guardians** are represented in code as: Zuno (state), Folder Manager (vault), EAII (registry), SSWS (workspace), Z-HODP (dashboard), Module Registry (modules), Security/Policy (rules), Z-Formulas (registry). So “OctoNero” = **apply Z-formulas and the eight-fold guard** across all projects.

**Apply to all projects:**

- In **ZSanctuary_Universe**: formulas and OctoNero already apply (SSWS verify, formula registry, guards).
- In **other projects**: (1) Add a **lightweight** check: e.g. a `z_sanctuary_link.json` in each project root that points to the hub (ZSanctuary_Universe) and says `"formula_aware": true`; (2) EAII registry marks which projects are “formula-aware”; (3) Overseer doc says “all formula-aware projects follow the same philosophical protection.” No need to copy the whole vault into every project — **link** and **registry** suffice.

---

## 6. AI Colony: AI Tower, AI Skyscraper, and Everything They Contain

| Component | Role in “all projects” |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AI Tower** | `core/ai_tower/` in ZSanctuary_Universe (z_ai_tower_core.js, z_ai_agent_base.js, z_super_ghost.js). Agents have owner, status; Zuno weekly reflection and z_ai_status.json report on AI Tower. **Apply to all projects:** AI Tower is the **single** colony in this repo; other projects do not duplicate it. They **call** or **show** the same dashboard (5502) for status, or they are **registered** in EAII so the Overseer knows “this app uses AI Tower” (read-only). |
| **AI Skyscraper** | Separate project **Z-SANCTUARY AI SKYSCRAPER** (or similar name). It **contains** its own modules and logic. Link it via **EAII registry** and **parent workspace**. It can **consume** Z-formulas and OctoNero by (1) being in the same workspace, (2) having a `z_sanctuary_link.json` that points to ZSanctuary_Universe, and (3) optional: calling the same dashboard or report endpoints (e.g. 5502) for state. So AI Skyscraper is **part of the colony** — same roof, same formulas, same “all projects” view. |
| **Miniai, Harisha, Super Ghost** | Already in ZSanctuary_Universe. They serve this repo and the dashboard. Other projects **see** them through the **single dashboard** (HODP) and the **single** AI status report. No duplication. |

**Self-organise / adapt / auto-upgrade / repair / launch:**

- **Launch:** EAII launcher + Overseer auto-run + SSWS Auto Boot. New project = add to EAII registry + optional task in parent workspace.
- **Repair:** Existing tasks: Hygiene Autofix, Sandbox Phase Guard, Reports Vault Refresh, Workspace Auto Sweep. For **all projects**: run hygiene or repair **from the hub** against a list of paths (from `z_pc_root_projects.json` or EAII registry); or each project can have a minimal `scripts/z_repair.mjs` that the hub invokes.
- **Upgrade:** Z-formulas and formula registry evolve in ZSanctuary_Universe. Other projects “upgrade” by (1) pulling latest hub repo or (2) re-running SSWS verify / formula check when they open. Optional: **Nx-style** or **Turborepo-style** task graph for “upgrade dependencies” across projects (see §8).
- **Structure/organise:** Module Registry (this repo) + Folder Manager (this repo) + **backup** of other projects to NAS. Structure = one register, one vault, one dashboard; other projects are **nodes** in the graph, not duplicate structures.

---

## 7. Config: PC Root Projects (Data File)

So that scripts and EAII can **discover** all projects under PC root without hardcoding, add a **data file** in ZSanctuary_Universe that lists them. Path:

- **`data/z_pc_root_projects.json`**

Schema (example):

```json
{
  "pc_root": "C:\\Cursor Projects Organiser",
  "hub": "ZSanctuary_Universe",
  "updated_at": "2026-03-17T00:00:00Z",
  "projects": [
    {
      "id": "zsanctuary",
      "name": "Z-Sanctuary Universe",
      "path": "ZSanctuary_Universe",
      "role": "hub",
      "ssws": true,
      "formula_aware": true,
      "eaii_launch_task": "",
      "dashboard_url": "http://127.0.0.1:5502"
    },
    {
      "id": "zomni",
      "name": "Z-OMNI-Sanctuary",
      "path": "Z-OMNI-Sanctuary",
      "role": "member",
      "ssws": false,
      "formula_aware": true,
      "eaii_launch_task": "Z: Open OMNI"
    },
    {
      "id": "skyscraper",
      "name": "Z-SANCTUARY AI SKYSCRAPER",
      "path": "Z-SANCTUARY AI SKYSCRAPER",
      "role": "member",
      "ssws": false,
      "formula_aware": true,
      "eaii_launch_task": "Z: Open SKYSCRAPER"
    },
    {
      "id": "amkgoku",
      "name": "Amk-Goku Dashboards 2",
      "path": "Amk-Goku Dashboards 2",
      "role": "member",
      "ssws": false,
      "formula_aware": false
    }
  ]
}
```

- **pc_root:** Parent folder (absolute or relative to hub).
- **hub:** Folder name of the SSWS hub (ZSanctuary_Universe).
- **projects[].path:** Relative to `pc_root`.
- **projects[].role:** `hub` | `member`.
- **projects[].ssws:** true only for hub (server 5502 and Auto Boot here).
- **projects[].formula_aware:** Uses Z-formulas and OctoNero convention.
- **eaii_launch_task:** Task label in Organiser or parent workspace to open/launch that project.

Use this file for: (1) Generating a **parent multi-root workspace** (e.g. `Z_All_Projects.code-workspace` at PC root); (2) **HODP “All projects” panel** (list with Launch links); (3) **Backup** script that iterates projects and copies key paths to NAS; (4) **EAII** sync (keep EAII registry in sync with this list or vice versa).

---

## 8. Latest Technology Research (Applied to Our Success)

Findings that support **self-organise**, **adapt**, **auto-upgrade**, **repair**, and **launch** across many projects:

| Technology | What it does | How we use the idea |
| ---------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nx (monorepo)** | Task graph, inferred tasks, **AI self-healing CI** (auto-fix broken PRs, flaky tests). | We don’t have to adopt Nx full stack. We **adopt the pattern**: (1) One graph of projects (our `z_pc_root_projects.json` + EAII); (2) Tasks that depend on other tasks (our SSWS Auto Boot chain); (3) “Repair” = run guards and autofix (we already have Hygiene Autofix, etc.); (4) Future: an optional “Z: Fix CI” task that runs a small set of fixes across repo or listed paths. |
| **Turborepo** | Remote cache, pipeline per task. | Single server (5502), single dashboard; “cache” = our reports and vault. We keep one hub and avoid redundant work by **not** duplicating SSWS in every project. |
| **oneRepo** | Strict validation, minimal config, change detection. | Our **guards** (Workspace Root, Multi-Workspace, Lab Task Structure, Time Guard, SLO, Provenance, etc.) are our “strict validation.” We can add a **change detection** step: e.g. “which projects changed since last run?” and run repair only there. |
| **Hypermod** | AI-powered dependency upgrades, codemods, security. | Idea: **auto-upgrade** can be (1) Dependabot or Renovate in each repo, or (2) a single “Z: Dependency Audit” task in the hub that reads `z_pc_root_projects.json` and runs `npm audit` or similar in each path. No need to buy Hypermod; the pattern is “one place that triggers upgrades across projects.” |
| **VS Code multi-root** | One workspace, many folders. | We **already** use multi-root in `Z_SSWS.code-workspace`. We extend to **parent** workspace at PC root with **all** projects as folders; SSWS hub remains the one that runs server and Auto Boot when that workspace is opened (e.g. first folder = hub, or a task that runs only in hub). |

**Summary:** Our success comes from (1) **one hub**, (2) **one registry** (EAII + z_pc_root_projects.json), (3) **one dashboard** (HODP), (4) **one formula/OctoNero layer**, (5) **chained tasks** for launch and repair, and (6) **optional** adoption of Nx/Turbo/oneRepo-style ideas (task graph, change detection, dependency audit) **without** rewriting everything — we already have 90% of the structure.

---

## 9. Implementation Phases

### Phase 1 — Register and link (no new repos)

- Add `data/z_pc_root_projects.json` with your real project list (paths relative to PC root).
- In **Z-EAII** (Organiser), ensure every project in that list has a registry entry (path, launch task).
- In **Z-HODP** dashboard, add a small “All projects” block in Control Centre or Blueprint: read `z_pc_root_projects.json` (or EAII), show name + “Open”/“Launch” link per project.
- Doc: **Z-Super Overseer** (Organiser) states that “all projects under PC root” are under the same roof and use EAII for launch.

#### Phase 2 — Parent workspace and SSWS for all

- Create **parent** `.code-workspace` at PC root (e.g. `Z_All_Projects.code-workspace`) with folders = each project from `z_pc_root_projects.json`.
- When opening that workspace, ensure **ZSanctuary_Universe** is the first folder (or designated hub) and that **Z: SSWS Auto Boot** runs from the hub (runOptions.runOn: folderOpen only for hub, or use a single “Z: All Projects Boot” task that runs hub’s SSWS Auto Boot).
- Optional: **Z: SSWS Verify** extended to accept a `--projects` flag that runs a lightweight check (e.g. presence of `z_sanctuary_link.json` or package.json) in each member project.

### Phase 3 — OctoNero and formulas everywhere

- Add **OctoNero** to [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md) as the “8-guardian orchestration layer” (Zuno, Folder Manager, EAII, SSWS, Z-HODP, Module Registry, Security, Formula Registry).
- In each **formula-aware** project (optional): add `z_sanctuary_link.json` with `"hub": "ZSanctuary_Universe"`, `"formula_aware": true`.
- **AI Tower** and **AI Skyscraper**: document that they are part of the same colony; AI Skyscraper consumes hub dashboard/state via URL or link file.

### Phase 4 — Backup and repair across projects

- **Folder Manager** (or a new task “Z: Backup All Projects”) reads `z_pc_root_projects.json` and copies key paths (e.g. each project’s `docs/`, `package.json`, or config) to NAS `Z_Backups/pc_mktiger/` or to a timestamped folder.
- **Repair:** “Z: Hygiene Autofix” stays in hub; add optional “Z: Repair Member Projects” that runs a minimal script (e.g. `npm ci` or `z_repair.mjs`) in each member path from the list.

### Phase 5 — Auto-upgrade and self-organise

- Optional: “Z: Dependency Audit” task that loops over `z_pc_root_projects.json` and runs `npm audit` or similar, writing a single report.
- **Self-organise:** Module Registry (hub) remains the single list of modules; **new** projects add their “module” entry to the hub’s manifest or to EAII registry so the dashboard and Overseer see them. No separate structure per project — **one** register, **one** dashboard, **one** graph.

---

## 10. Summary

- **Z-SSWS** capabilities (multi-root, Auto Boot, server 5502, dashboard, verify, daily report) stay in **ZSanctuary_Universe** as the **hub**.
- **All projects** under PC root are **registered** in `data/z_pc_root_projects.json` and in **Z-EAII**; they are **linked** to the same **Z-Super Overseer**, **Z-HODP**, and **Folder Manager AI** (vault + optional backup).
- **Z-formulas** and **OctoNero** (8 guardians) apply everywhere via formula registry, SSWS verify, and optional `z_sanctuary_link.json` in each project; **AI Tower** and **AI Skyscraper** are part of the **AI colony** with one dashboard and one state.
- **Self-organise, adapt, auto-upgrade, repair, launch** come from: one hub, one registry, one task chain, one dashboard, and optional cross-project backup/repair/audit tasks using the projects list.
- **Latest tech** (Nx self-healing, Turborepo cache, oneRepo validation, multi-root) is aligned with our approach; we use the **ideas** without mandatory new tooling.

When you are ready, start with **Phase 1** (data file + EAII + dashboard “All projects” block); then Phase 2 (parent workspace); then Phase 3–5 as needed.

_Blueprint for Z-Sanctuary Universe. Check [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md) when unsure._
