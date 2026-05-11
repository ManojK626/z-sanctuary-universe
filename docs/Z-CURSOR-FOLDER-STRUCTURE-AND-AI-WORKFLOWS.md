# Z-Cursor folder structure and AI workflows (cross-version)

**Purpose:** Give humans, **Zuno**, and any Cursor AI the same **spine layout** and **rituals** so work stays aligned across Cursor updates, multi-root workspaces, and sibling repos under the PC root.

**Authority when unsure:** [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md).

---

## 1. Canonical ritual

Use this phrase in chat or notes when you want the hub skeleton checked or repaired:

> **Zuno, create full folder structure for Cursor.**

Then run from **ZSanctuary_Universe** repo root:

| Step | Command | What it does |
| ------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Preview | `npm run cursor:folders` | Lists directories that would be created (usually none on a full hub). |
| Apply | `npm run cursor:folders:apply` | Creates any missing **spine** folders from [data/z_cursor_folder_blueprint.json](../data/z_cursor_folder_blueprint.json). |
| Gate | `npm run cursor:folders:verify` | Exits with error if a **verify** path is missing (CI-friendly). |

**After structural changes:** `node scripts/z_sanctuary_structure_verify.mjs` and `node scripts/z_registry_omni_verify.mjs`.

**CI / pre-merge (GitHub Actions):** `.github/workflows/ci.yml` runs `npm run verify:ci`, which chains `cursor:folders:verify`, sanctuary structure verify, and registry omni. **`npm run verify:full:core`** (used by `verify:full`) starts with **`cursor:folders:verify`** so missing hub dirs fail fast before lint and tests.

---

## 2. Single source of truth (SSOT)

- **Machine list:** [data/z_cursor_folder_blueprint.json](../data/z_cursor_folder_blueprint.json) — `directories[]` with `verify` and `mkdirOnApply`.
- **Implementation:** [scripts/z_cursor_folder_bootstrap.mjs](../scripts/z_cursor_folder_bootstrap.mjs).

The blueprint intentionally covers the **hub spine** (Cursor config, docs, data, dashboard, workspaces), not every optional top-level folder (e.g. `archive`, `Z_Labs`). Those remain documented in [MONOREPO_GUIDE.md](../MONOREPO_GUIDE.md) and the live tree.

---

## 3. How Cursor AI should use this (all versions)

1. **Assume repo root** is `ZSanctuary_Universe` when running npm/node commands unless the task explicitly targets a workspace package (`apps/*`, `packages/*`).
2. **Prefer project rules** in `.cursor/rules/*.mdc` over ad-hoc style; rules load across Cursor versions that support project rules.
3. **Slash commands** in `.cursor/commands/` stay version-agnostic text; they encode exact shell commands so the model does not invent paths.
4. **Multi-root:** If `Z_All_Projects.code-workspace` or `Z_SSWS.code-workspace` is open, still run bootstrap and verify from the **hub** root when the task is hub-scoped.
5. **User-level skills** (e.g. under the user profile `skills/` folder) complement but do not replace hub **AGENTS.md** and rules; when instructions conflict, **Hierarchy Chief** and hub docs win for Z-Sanctuary work.
6. **Agent vs Ask mode:** Folder creation and registry edits need Agent (write) mode; verification scripts can be read-only in either mode from the terminal.
7. **Hooks and MCP:** Optional per environment; do not hard-require them in the blueprint. If hooks exist, keep them out of the default verify spine unless promoted later.

---

## 4. Sibling repos and PC root

To copy hub slash commands and agents to the Organiser (PC root) without manual duplication:

- `npm run cursor:sync-pc-root-config` (dry-run)
- `npm run cursor:sync-pc-root-config:apply`

See [AGENTS.md](../AGENTS.md). After copying, run that repo’s own verify tasks if present.

---

## 5. Related docs

- [AGENTS.md](../AGENTS.md) — any-AI entry, slash commands, sync to PC root.
- [docs/Z-OMNI-CURSOR-UPGRADE-MANIFEST.md](Z-OMNI-CURSOR-UPGRADE-MANIFEST.md) — manifest summary and registry verify.
- [docs/Z-ACN-MTEH-AUTO-CREATIONS-NEW-MODULES-TOOLS-EXTENSIONS.md](Z-ACN-MTEH-AUTO-CREATIONS-NEW-MODULES-TOOLS-EXTENSIONS.md) — new modules: register, manifest, verify.

---

_Last updated: 2026-04-14._
