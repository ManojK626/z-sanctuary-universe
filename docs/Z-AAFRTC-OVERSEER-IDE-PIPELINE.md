# AAFRTC — Auto-Approved Full Run Test Cursor (overseer-gated IDE pipeline)

**Purpose:** Give you **one clear way** in Cursor / VS Code to run the **full hub verification stack** with **automatic gate ordering** (execution enforcer → folder verify → structure → registry omni → comms sync → …) **without** mixing up **multi-project** workspaces or bypassing **overseer / Z-EAII alignment** that already lives in scripts and policy files.

**Policy (machine-readable):** [data/z_aafrtc_policy.json](../data/z_aafrtc_policy.json)
**Context report (after resolve):** [data/reports/z_aafrtc_context.json](../data/reports/z_aafrtc_context.json)

---

## 1. What “auto-approve” means here (important)

| Term | Meaning |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Auto-approved full run** | The **IDE runs the predefined npm pipeline** without you hand-picking each step — **gates inside that pipeline** (enforcer, structure, registry, etc.) still **pass or fail** the run. |
| **Not** | Automatic approval to **ship production**, change **vault**, or set **`manual_release`** — those stay under [data/z_release_control.json](../data/z_release_control.json) and human / Z-OSHA rhythm. |

Authority order is unchanged: [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md), Z-EAII/registry, Z-Super Overseer roof.

---

## 2. Hub root only (no multi-project mix-up)

AAFRTC **refuses** to run if the shell’s **current working directory** is not **ZSanctuary_Universe** hub root (detected via `package.json` name `z-sanctuary-universe` and/or `data/z_pc_root_projects.json` hub row).

**Multi-root Cursor / VS Code:** Use **Tasks → Run Task** with **ZSanctuary_Universe** as the focused folder, or open the hub as a **single-folder** workspace when running AAFRTC. If `${workspaceFolder}` points at a sibling project, the task will **fail fast** — that is intentional.

---

## 3. npm scripts (from hub root)

| Script | Runs |
| -------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `npm run aafrtc:resolve` | Writes `z_aafrtc_context.json` (optional `--strict` via direct `node scripts/z_aafrtc_resolve.mjs --strict`) |
| `npm run aafrtc:ci` | Hub guard → **`npm run verify:ci`** |
| `npm run aafrtc:full-core` | Hub guard → **`npm run verify:full:core`** |
| `npm run aafrtc:full` | Hub guard → **`npm run verify:full`** (includes Z-Bridge log line) |

---

## 4. VS Code / Cursor tasks

Search tasks for **`Z: AAFRTC`**:

- **Z: AAFRTC — resolve hub context (anti mix-up)** — validates folder; use before trusting any long run.
- **Z: AAFRTC — overseer gate (CI pipeline)** — same stack as **`verify:ci`** (EAII/registry/comms aligned).
- **Z: AAFRTC — full core** — **`verify:full:core`**.
- **Z: AAFRTC — full + bridge log** — **`verify:full`**.

---

## 5. Relation to Z-EAII and multi-project ecosystem

- **Z-EAII** remains the **registry / roster** authority; AAFRTC does **not** replace `data/z_pc_root_projects.json` or sibling repos.
- **Sibling projects** under the PC root are **listed** by the hub, not **mutated** by these pipelines.
- **Overseer** behavior is **encoded** in existing scripts (`z_execution_enforcer_gate.mjs`, registry omni verify, release governance). AAFRTC is a **safe runner + naming**, not a new approval server.

---

## 6. Cursor rule

See [.cursor/rules/z-aafrtc.mdc](../.cursor/rules/z-aafrtc.mdc) — AI must not invent alternate “full verify” paths that skip hub detection in multi-root setups.
