# Lint debt clearance plan (2026-04-27)

**Purpose:** Unblock `npm run verify:full:technical` without a blind mass-edit. This document is a **plan and ordering guide** only. Execute in small batches with review after each.

**Primary evidence:** `data/reports/z_verify_full_technical_lint_debt_2026-04-27.log` and `data/reports/z_verify_full_technical_lint_debt_2026-04-27.md`

**Principle:** Fix **release-gate path** and **source-of-truth** first; treat generated output and out-of-gate trees via **scope** (ignore/exclude) or build-step consistency—not hand-fixing thousands of lines in one shot.

---

## 1) Failure profile (from last run)

| Metric | Value |
| ------------------ | ----------------------------------------------------- |
| Total findings | 890 |
| Errors | 879 |
| Warnings | 11 |
| Fixable (reported) | 879 with `--fix` (where rule allows) |
| Failing step | `lint` → `lint:root` (`eslint . --ext .js,.mjs,.cjs`) |

**Dominant rule:** `quotes` (Strings must use singlequote)

**Other:** `no-unused-vars` (warnings), Next/eslint noise about `pages` directory (informational in log)

---

## 2) Grouping by path / scope (recommended order)

### Group A — Root ESLint reach (must decide first)

**What:** `eslint .` at repo root lints the entire tree, including things that should not gate releases.

**Plan:**

1. **Inventory** `.eslintignore` / `package.json` eslint config (if any) and confirm what is _intended_ to be linted for release.
2. **Proposed exclusions (plan-level, not yet applied without human OK):**
   - `**/node_modules/**`, `**/.next/**`, `**/dist/**`, `safe_pack/**` (if not already)
   - Generated GGAESP JS (see Group B)
   - Optional: `Z_Sanctuary_Universe 2/**` if that tree is a backup/sibling and not part of the hub release surface

**Why first:** Stops the gate from being dominated by non-product paths.

---

### Group B — Generated / transpiled JS (GGAESP + heatmap shims)

**Paths observed in log (examples):**

- `core_engine/browser/*.js` (e.g. `ggaesp_pipeline.js`, `ggaesp_test.js`, shims)
- `core_engine/dist_heatmap/*.js`
- `core_engine/node/ggaesp_memory.js`

**Plan:**

- **Preferred:** add these paths to **eslint ignore** for `lint:root` _or_ lint only the **TypeScript sources** in `core_engine` and treat emitted JS as build artifacts.
- **Alternative:** add a `npm run` post-build `eslint --fix` on generated output _only_ if the team wants artifacts lint-clean (usually not worth it; ignore is cheaper).

**Rule:** `quotes` on emitted files is not a product bug; it is a **tooling scope** problem.

---

### Group C — `packages/*` (source packages, not generated)

**Paths observed in log (examples):**

- `packages/z-sanctuary-mirrorsoul-slice/**/*.mjs`
- `packages/z-sanctuary-zuno-transformation-slice/**/*.mjs`

**Plan:**

- One package at a time: `eslint <package> --fix` **or** `prettier` alignment if the team standardizes on formatter for `.mjs`.
- **Order:** `z-sanctuary-mirrorsoul-slice` first (MirrorSoul slice dependency), then zuno slice if in release path.

**Rule:** still mostly `quotes`; low semantic risk, but do **per-package** PR-sized batches.

---

### Group D — `apps/api` and `scripts` hub scripts

**Paths observed in log (examples):**

- `apps/api/src/mirrorsoul_routes.mjs`, `zuno_flow_routes.mjs`
- `scripts/_inject_ggaesp_npm.mjs`, `scripts/z_ggaesp_memory_append.mjs`, `scripts/z_mirrorsoul_*.mjs`, `scripts/z_prediction_validator.mjs`

**Plan:**

- After Groups A–B, run a **small** `eslint --fix` on `apps/api/src` and `scripts` only, then review diff.
- **Warnings** (`no-unused-vars`): fix manually in tiny commits (remove unused imports/vars).

---

### Group E — Sibling / duplicate tree `Z_Sanctuary_Universe 2`

**Paths observed in log (examples):**

- `Z_Sanctuary_Universe 2/scripts/z_suc*.mjs` (large error counts)

**Plan:**

- Confirm with **Hierarchy / operator** whether this path must be in root lint.
- If **not** a release surface: **exclude from eslint** in root config/ignore.
- If **must** be linted: treat as a **separate workstream** (dedicated task), not part of MirrorSoul gate.

---

## 3) Grouping by rule (priority)

| Rule | Priority | Plan |
| ------------------------------ | ----------------------- | ------------------------------------------------------------------------------ |
| `quotes` | High volume, mechanical | Fix in scoped directories or `eslint --fix` per package after scope is correct |
| `no-unused-vars` | Medium (warnings) | Small manual cleanups; avoid auto-fix on whole repo |
| Next `pages` directory message | Low | Config note only unless Next app uses non-default pages path |

---

## 4) Smallest release-gate batch (suggested)

**Goal:** get `lint:root` to pass **or** reduce failure to a single controlled directory set.

1. Tighten **eslint scope** (Group A) + **ignore generated GGAESP JS** (Group B).
2. If still red: `eslint --fix` on **`packages/z-sanctuary-mirrorsoul-slice` only** (Group C, first).
3. Then **`apps/api/src` only** (Group D, partial).
4. Re-run: `npm run verify:full:technical` then `npm run zuno:state`.

**Do not** mass-fix the entire repo in one step.

---

## 5) Re-verify ritual (after each batch)

```powershell
npm run lint:root
# When stable:
npm run verify:full:technical
npm run zuno:state
```

---

## 6) Out of scope (for this plan)

- New product features (HeartPulse, Z-Office, Z-Movie, social) **until** gate strategy above is decided.
- Rewriting `Z_Sanctuary_Universe 2` unless explicitly in scope for release.

---

## 7) Reference docs

- `data/reports/z_verify_full_technical_lint_debt_2026-04-27.md` — A/B/C/D snapshot
- `data/reports/z_zuno_handoff_mirrorsoul_slice1_2026-04-27.md` — slice status + trust language

_Plan only. No code changes in this file._
