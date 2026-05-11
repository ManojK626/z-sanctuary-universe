# Z-MAOS — Multi-Project Registry Policy

**Purpose:** Rules for `tools/z-maos/project_registry.json` and related manifests.

---

## 1. Single source of truth (within MAOS)

- **Canonical file:** `tools/z-maos/project_registry.json` for MAOS-visible projects.
- **Hub PC root list** remains `data/z_pc_root_projects.json` (Z-EAII / Organiser truth)—MAOS **references** it; does not replace it.
- Edits to registry JSON require **human review** (no silent bot commits).

---

## 2. Required fields (per project entry)

| Field | Meaning |
| -------------------- | -------------------------------------------------------------- |
| `id` | Stable slug |
| `name` | Human label |
| `repoPath` | Absolute or `.` for hub; `null` if external / not in workspace |
| `status` | Phase label (e.g. hub_governance, standalone_private_pilot) |
| `allowedCoupling` | `canonical_root`, `reference_only`, `chartered` |
| `healthCommands` | Strings: suggested commands (may be other-repo) |
| `consentRequiredFor` | Array of gated action categories |

---

## 3. XL2 and standalone products

- **Default:** `allowedCoupling: reference_only`, `repoPath: null` with `repoPathNote` for operator-local path.
- Z-MAOS scripts **must not** assume XL2 exists on disk from hub cwd.

---

## 4. Drift detection

If `repoPath` points to a missing directory, status scripts report **missing_path**—no auto-fix.

---

## 5. Rollback

Revert JSON commits; MAOS scripts remain safe if registry is absent (they should print a clear error).
