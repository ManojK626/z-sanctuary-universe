# Z-ACN/MTEH — Auto Creations or New Modules / Tools / Extensions / HTML Web Apps

**Purpose:** Single path and checklist for **any new creation** in the Z-Sanctuary — whether a **module**, **tool**, **extension**, or **HTML web app** — so every addition stays aligned with the Hierarchy Chief, §9 communications flows, Z-OMNI formulas, Module Registry, and the single control plane. **Use this so we successfully complete all we did** and keep the stack bullet.

**Full name:** **Z-ACN/MTEH** = **Auto Creations or New** [**M**odules / **T**ools / **E**xtensions / **H**tml web apps] (and related assets).

**Authority:** [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md) — when unsure, check the Hierarchy Chief first.

---

## 1. What Z-ACN/MTEH Covers

| Type | Examples | Where they live (ZSanctuary) |
| ----------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Modules** | Dashboard panels, core engines, governance blocks | `core/*.js`, `dashboard/`, entries in Module Registry |
| **Tools** | Scripts, CLI, automation (e.g. Zuno report, Registry sync, Structure Verify) | `scripts/*.mjs`, `scripts/*.py`; tasks in `.vscode/tasks.json` |
| **Extensions** | VS Code / Cursor extensions, browser extensions (if any) | Repo-specific extension folders or Organiser; documented in register |
| **HTML web apps** | Creator Manual app, snapshot viewer, standalone pages | `docs/public/*/`, `dashboard/Html/`, or `dashboard/*.html` |
| **Etc.** | New docs, new tasks, new config that affects the stack | Per layer: docs in `docs/`, tasks in `.vscode/tasks.json`, config in `data/` or `config/` |

Every **auto-creation** or **new** item of the above kinds must follow the Z-ACN/MTEH path so the system stays **one with the core** (PC/NAS > Cursor > AI) and passes §9 workflows and communications flows.

---

## 2. Z-ACN/MTEH Path (Step-by-Step)

Use this path whenever you add a **new module, tool, extension, or HTML web app** (or equivalent).

### Step 1 — Align with authority and register

- **Check [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md)** — confirm which layer owns the new item (HODP, EAII, SSWS, Folder Manager, Zuno, Module Registry, etc.).
- **Master Register:** If the idea comes from the Huge file or is a named module/phase, add or update an entry in [Z-MASTER-MODULES-REGISTER.md](Z-MASTER-MODULES-REGISTER.md).
- **Full Build Checklist:** If the item is a doc or phase from the Huge file, add or tick the row in [Z-FULL-BUILD-CHECKLIST.md](Z-FULL-BUILD-CHECKLIST.md).

### Step 2 — Add to Module Manifest (if it is a module or surface)

- **File:** `data/z_module_manifest.json` (or `data/Z_module_manifest.json`). The sync script reads `ZModules` (or `modules`).
- **Entry shape:** `ZId`, `ZName`, `ZLayer`, `ZOwner`, `ZStatus`, `ZDescription`, and optionally `ZLaunchTask`, `ZOpenMode`, `ZEntry`.
- **Layers:** e.g. `core`, `governance`, `ai`, `tools`, `docs`, `public` — match the existing style in the manifest.
- After editing the manifest, **run Z: Module Registry Sync** so `data/Z_module_registry.json` and the audit are updated.

### Step 3 — Create code or assets in the right place

- **Dashboard panels / core JS:** `core/<name>_panel.js` or similar; wire into `dashboard/Html/index-skk-rkpk.html` (or the panel directory) per Z-HODP.
- **Scripts / tools:** `scripts/<name>.mjs` or `scripts/<name>.py`; add a task in `.vscode/tasks.json` if it should be runnable from the workspace (e.g. **Z: My New Tool**).
- **HTML web apps:** `docs/public/<app_name>/index.html` (like Creator Manual, snapshot) or under `dashboard/Html/`; ensure they are reachable when the server runs (e.g. port 5502) and, if needed, linked from the Control Centre or Panel Directory.
- **Extensions:** In the repo or Organiser as per existing extension pattern; document in Master Register and, if applicable, in the module manifest.
- **New docs:** `docs/<name>.md`; link from INDEX and, if relevant, from the Creator Manual document map or Hierarchy Chief “Where Things Live.”

### Step 4 — Wire into the single control plane (if user-facing)

- **Dashboard (Z-HODP):** If the new item is a panel or a link, add it to the Control Centre, Panel Directory, or the appropriate tab so it appears on the single dashboard surface.
- **Tasks:** If it is a runnable tool or workflow, add a task to `.vscode/tasks.json` with a clear label (e.g. **Z: …**).
- **PC root projects:** If the new item is a whole project under PC root, add it to `data/z_pc_root_projects.json` and register in Z-EAII (Organiser) so it appears in “All projects.”

### Step 5 — Run completions test and verification (§9)

- **Z: Module Registry Sync** — run so the registry and audit reflect the new manifest.
- **Z: Sanctuary Structure Verify** — run `node scripts/z_sanctuary_structure_verify.mjs` (or task **Z: Sanctuary Structure Verify**); expect PASS.
- **Z: Registry Omni Verify** — run `node scripts/z_registry_omni_verify.mjs` (or task **Z: Registry Omni Verify**); expect 100% SYNCED.
- **Verification checklist §9** — confirm full completions test (workflows and communications flows); ensure no AI or project feels disconnected; single control plane and smartphone-anywhere readiness.

### Step 6 — Completion and approval (Z-ASAC&CP)

- Treat the new creation as **complete** only after the above steps and the §9 run.
- Per [Z-FULL-VISION-AND-REINFORCEMENT.md](Z-FULL-VISION-AND-REINFORCEMENT.md), **sync** (e.g. state reports, registry, dashboard) after **confirmation/approval** from Z-EAII or Z-OSHA (Overseer Head Chief AI). So: complete the Z-ACN/MTEH path → run §9 → then confirmation/approval → then final sync.

---

### Example — Z-Soundscape & Living Pulse (Z-ACG)

A concrete pattern already in the hub:

| Step | What we did |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Authority / spec | [Z-ACOUSTIC-LIVING-PULSE-ARCHITECTURE.md](Z-ACOUSTIC-LIVING-PULSE-ARCHITECTURE.md) + link from [Z-LIVING-PULSE.md](Z-LIVING-PULSE.md) |
| Tool | `scripts/z_soundscape_posture.mjs` → `data/reports/z_soundscape_posture.json`; task **Z: Soundscape Posture** |
| Dashboard | `core/z_soundscape_pulse_panel.js` + **Z-Living Pulse** panel in `dashboard/Html/index-skk-rkpk.html` |
| Manifest | Entry `z-soundscape-living-pulse` in `data/z_module_manifest.json`; run **Z: Module Registry Sync** |
| Verify | **Z: Sanctuary Structure Verify** (expects doc, script, panel wire) |

---

## 3. Checklist Summary (Quick Reference)

When adding a **new module, tool, extension, or HTML web app**:

- [ ] **Authority:** Check Hierarchy Chief; confirm which layer owns it.
- [ ] **Register:** Add or update Master Register (and Full Build Checklist if from Huge file).
- [ ] **Manifest:** If it’s a module/surface, add an entry to `data/z_module_manifest.json`; run **Z: Module Registry Sync**.
- [ ] **Code/assets:** Create in the correct place (`core/`, `scripts/`, `docs/public/`, `dashboard/`, etc.).
- [ ] **Control plane:** Wire into dashboard/tasks/PC root list as needed (Z-HODP, tasks.json, z_pc_root_projects.json).
- [ ] **Docs/INDEX:** Add or link new docs from INDEX and, if relevant, Creator Manual or Hierarchy Chief.
- [ ] **§9:** Run Z: Module Registry Sync, Z: Sanctuary Structure Verify, Z: Registry Omni Verify; complete verification checklist §9 (workflows & communications flows).
- [ ] **Completion/approval:** Per Z-ASAC&CP, confirm completion and approval path before final sync.

---

## 4. Deep Research — Where Things Come From

- **Module list source:** [Z-MASTER-MODULES-REGISTER.md](Z-MASTER-MODULES-REGISTER.md) and the Huge file (`C:\Users\manoj\OneDrive\Documents\Huge Mutiple Modules and App projects.txt`). New ideas can be added to the register first, then implemented.
- **Runtime module list:** `data/z_module_manifest.json` → **Z: Module Registry Sync** → `data/Z_module_registry.json` + `data/reports/z_module_registry_audit.json|.md`. Dashboard and panels can consume the registry.
- **Dashboard surface:** Single entry = [Z-HODP](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md) — `dashboard/Html/index-skk-rkpk.html`, Control Centre, Panel Directory, “All projects” from `data/z_pc_root_projects.json`. New panels or links must stay under this roof.
- **Tasks:** All runnable workflows live in `.vscode/tasks.json`; use labels like **Z: …** for Z-Sanctuary tasks. SSWS Auto Boot, Zuno State Report, Module Registry Sync, Structure Verify, Registry Omni Verify are core.
- **HTML web apps:** Creator Manual at `docs/public/creator_manual/index.html`; snapshot at `docs/public/snapshot/`. Served when the static server runs from repo root (e.g. port 5502). New web apps can follow the same pattern under `docs/public/<name>/`.
- **Formulas and safety:** Every creation should align with [Z-ULTRA-INSTINCTS-AND-FORMULAS.md](Z-ULTRA-INSTINCTS-AND-FORMULAS.md) and the 14 DRP Rules; no logic that conflicts with compassion anchor. Z-OMNI manifest ([.cursor/rules/z-omni-unified-organism.mdc](../.cursor/rules/z-omni-unified-organism.mdc)) applies to all code and architecture.

---

## 5. Links

| Item | Location |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **This doc** | docs/Z-ACN-MTEH-AUTO-CREATIONS-NEW-MODULES-TOOLS-EXTENSIONS.md |
| **Cursor rule** | .cursor/rules/z-acn-mteh.mdc |
| **Hierarchy Chief** | [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md) |
| **Master Register** | [Z-MASTER-MODULES-REGISTER.md](Z-MASTER-MODULES-REGISTER.md) |
| **Full Build Checklist** | [Z-FULL-BUILD-CHECKLIST.md](Z-FULL-BUILD-CHECKLIST.md) |
| **Module manifest** | data/z_module_manifest.json |
| **Module Registry sync** | scripts/z_module_registry_sync.mjs — task **Z: Module Registry Sync** |
| **Structure Verify** | scripts/z_sanctuary_structure_verify.mjs — task **Z: Sanctuary Structure Verify** |
| **Registry Omni Verify** | scripts/z_registry_omni_verify.mjs — task **Z: Registry Omni Verify** |
| **§9 & Completions test** | [Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md](Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md), [Z-SANCTUARY-VERIFICATION-CHECKLIST.md](Z-SANCTUARY-VERIFICATION-CHECKLIST.md) |
| **Z-ASAC&CP (approval)** | [Z-FULL-VISION-AND-REINFORCEMENT.md](Z-FULL-VISION-AND-REINFORCEMENT.md) |

---

## 6. Outcome

Using Z-ACN/MTEH for **every auto-creation or new module, tool, extension, or HTML web app** keeps the stack **complete and bullet**: one register, one manifest, one registry, one dashboard, one authority, and §9 workflows and communications flows so we **successfully complete all we did**. Thanks Brother.

_Z-ACN/MTEH — Auto Creations or New Modules / Tools / Extensions / HTML web apps. One path, one stack._
