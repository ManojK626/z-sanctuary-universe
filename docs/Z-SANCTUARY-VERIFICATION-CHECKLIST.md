# Z-Sanctuary Verification Checklist

**Purpose:** Before celebrating or onboarding others, run through this checklist to confirm that all projects, content, AI design, and general structure work confidently with Cursor and the Z-Sanctuary stack.

**Run from:** ZSanctuary_Universe repo root (the hub).

---

## 1. Automated structure check

- [ ] **Run:** `node scripts/z_sanctuary_structure_verify.mjs`
  - Or use task **Z: Sanctuary Structure Verify** (if added in `.vscode/tasks.json`).
- [ ] **Expect:** All items show `[OK]`; result line says `PASS`.
- [ ] If any `[FAIL]`: fix the missing file or config, then re-run.

---

## 2. SSWS and workspace

- [ ] **Run:** `python scripts/z_ssws_verify.py` (or task **Z: SSWS Verify**).
- [ ] **Expect:** `[OK]` for VS Code settings, tasks, formula registry, vault manifest, security policy, Z_SSWS.code-workspace; formula count ≥ 1; result `OK`.
- [ ] Open **Z_SSWS.code-workspace** in Cursor (or open the repo root).
- [ ] **Settings:** Ensure **Allow Automatic Tasks** is on (`task.allowAutomaticTasks` = on) so Z: SSWS Auto Boot can run on folder open.

---

## 3. Dashboard and “All projects” block

- [ ] Start the static server from **repo root** (e.g. port 5502).
  - Task **Z: HTML Static Server (5502)** or your usual Live Server / static server.
- [ ] Open in browser: `http://127.0.0.1:5502/dashboard/Html/index-skk-rkpk.html` (or the path that serves the dashboard).
- [ ] **Control Centre panel:** Visible and shows Quick links, Compassion & truth.
- [ ] **“All projects” section:**
  - [ ] Shows “Loading…” then a list of projects (not “Projects list unavailable”).
  - [ ] Hub (Z-Sanctuary Universe) has a **Dashboard** link; members show role and (if set) launch task.
  - [ ] Link to “SSWS + All Projects blueprint” works.
- [ ] **Z-SSWS banner** (top): Shows “Z-SSWS: active” or “inactive” (active if server and report are present).

---

## 4. Hierarchy and AI behaviour

- [ ] **Hierarchy Chief:** Open `docs/Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md` — authority order and layer table are clear.
- [ ] **AGENTS.md:** At repo root; points any AI to the Hierarchy Chief when unsure.
- [ ] **Cursor rules:** `.cursor/rules/z-hierarchy-chief.mdc` and `z-canvas-sanctuary.mdc` exist and (when Cursor uses them) direct the AI to check the Hierarchy Chief first.

---

## 5. Key tasks (smoke check)

Run each at least once (or confirm they exist in **Terminal → Run Task**):

- [ ] **Z: Zuno State Report** — completes; `data/reports/zuno_system_state_report.json` (or legacy) updated.
- [ ] **Z: Module Registry Sync** — completes; `data/Z_module_registry.json` and audit updated.
- [ ] **Z: SSWS Daily Report** — completes; `data/reports/z_ssws_daily_report.json` updated.
- [ ] **Z: Workspace Root Guard** — prints “Z Workspace Root Guard: OK”.
- [ ] **Z: Folder Manager** (snapshot or status) — completes without error.

---

## 6. PC root projects list

- [ ] **File:** `data/z_pc_root_projects.json` exists.
- [ ] **Content:** `pc_root`, `hub`, and `projects` array match your machine (paths relative to `pc_root`).
- [ ] **Hub:** One project has `"role": "hub"` and `"ssws": true` (ZSanctuary_Universe).
- [ ] If you have other folders under PC root (e.g. Z-OMNI-Sanctuary, Amk-Goku), they are listed as members or add them and refresh the dashboard.

---

## 7. Optional: full SSWS Auto Boot

- [ ] Close Cursor and re-open the workspace (Z_SSWS or repo root).
- [ ] With **Allow Automatic Tasks** on, **Z: SSWS Auto Boot** may run on folder open (guards → server → open dashboard).
- [ ] If it runs: dashboard opens in browser and panels load; no red errors in console.
- [ ] If it does not run: check task.allowAutomaticTasks and guard tasks (Workspace Root Guard, etc.) for failures.

---

## 9. Full completions test run (workflows & communications flows)

**Rule:** See [.cursor/rules/z-completions-test-and-comms-flow.mdc](../.cursor/rules/z-completions-test-and-comms-flow.mdc) and [Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md](Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md). We perform a full completions test run so that **no AI, mini-AI, or project feels disconnected** — every part feels **one with the full core (PC/NAS > Cursor > AI)**; the **creator (AMK-Goku)** can operate the system from **even a smartphone, anywhere worldwide**, via **communications flows**.

**Hub npm verify (choose one):**

- [ ] **`npm run verify:full:technical`** (from repo root) — Full **technical** pipeline (hygiene, lint, workspace tests, guards, Python audits, Zuno, system-status, guardian, dashboard registry verify) **without** the execution enforcer gate. Use when you need maximum proof but release control is still on hold.
- [ ] **`npm run verify:full`** — Same technical chain **after** **`z_execution_enforcer_gate`**. Use before a **major release** when **`data/z_release_control.json`** / overseer intent allows the gate to pass.
- [ ] **`npm run verify:ci`** — Lighter checks (folders, structure, registry omni, comms syncs, freshness, guardian) but it **also begins with the execution enforcer gate**. If the gate blocks, run the same tasks via **Run Task** (e.g. **Z: Sanctuary Structure Verify**, **Z: Registry Omni Verify**) or use **`verify:full:technical`** for a deep pass without release sign-off.

- [ ] **Workflows:** Run key tasks (Zuno State Report, Module Registry Sync, SSWS Daily Report, Workspace Root Guard, Folder Manager); confirm completion and (where applicable) report/output updated. If Z-ASAC&CP approval gate is implemented, confirm completion → approval → sync path.
- [ ] **Communications flows:** With server running (e.g. 5502), open dashboard; confirm Control Centre, “All projects” (hub + members), and Quick links load; confirm state/reports are reachable (e.g. Zuno state, SSWS report). No component should feel orphaned — same registry (EAII), same dashboard (Z-HODP), same authority (Overseer).
- [ ] **One with core:** Confirm that from this single surface (dashboard + tasks + registry) the full stack is visible and operable — so that when remote/smartphone access is added, the same communications flows serve the creator anywhere.
- [ ] **Result:** Full workflows and communications flows verified; every AI and project is one with the core; system ready for creator to operate from anywhere (including smartphone) via communications flows.

---

## 10. Sign-off

- [ ] All sections above (§1–§9) are checked.
- [ ] **Result:** Structure and AI design are verified; all projects and content under PC root are aligned with the Z-Sanctuary structure and work confidently with Cursor. Full completions test run confirms workflows and communications flows; every AI and project is one with the core; creator can operate from smartphone anywhere via communications flows.

**Next:** Use [Z-CREATOR-MANUAL.md](Z-CREATOR-MANUAL.md) for full reference and to onboard others. See [Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md](Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md) for the full vision and confirmation.
