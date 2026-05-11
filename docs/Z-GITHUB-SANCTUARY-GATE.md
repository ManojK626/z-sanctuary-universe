# Z-Sanctuary — GitHub as backup, review gate, and history

**Role model:**

```text
Cursor = builder arm
GitHub = vault + review gate + backup history
Local / NAS = main sovereign storage
```

**Rule for Cursor and GitHub:**

```text
Cursor may create branches and PRs.
GitHub must verify, review, and preserve.
Human approves merge.
```

**End-to-end flow:**

```text
Cursor builds → GitHub verifies → Human approves → Sanctuary records
```

This doc is governance for **how GitHub complements** Turtle Mode (`.cursor/rules/z-turtle-mode-cursor-agents.mdc`). It does **not** replace Hierarchy Chief authority or vault policy.

---

## 1. Repo posture

| Step | Recommendation |
| ------------------------- | -------------------------------------------------------------------------------------------- |
| **Visibility** | Start with a **private** repo until you consciously choose what (if anything) becomes public |
| **`main`** | Treat as **protected truth** — no direct edits from Cursor agents; merges via reviewed PR |
| **`dev`** | Optional **integration branch** for batching work before stabilizing onto `main` |
| **`cursor/zsanctuary/*`** | **AI builder branches** (aligned with Turtle Mode branch prefix) |
| **`release/*`** | Optional **stable milestone** lines for tagged snapshots aligned with Releases |

Links: [Managing a branch protection rule](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule) · [About code owners](https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners).

---

## 2. Protect `main` (GitHub manual settings)

### Settings → Branches → Add branch protection rule

- **Branch name pattern:** `main`

Enable (align with your comfort level; tighten over time):

- **Require a pull request before merging**
- **Require approvals:** 1 (or more for critical repos)
- **Require review from Code Owners** (once CODEOWNERS is in place and you want enforcement)
- **Require status checks to pass before merging** (start with lighter checks; see section 3)
- **Do not allow bypassing the above settings** (admins included), when you are ready for strict mode

**Required status checks — staged rollout:** Do **not** make the heavy **Sanctuary GitHub PR** workflow a **required** check on day one. See **section 3**. When stable, typical required checks are **`CI`** and **`Sanctuary GitHub PR`** (exact names match the workflow `name:` fields in **`.github/workflows/`**).

---

## 3. First PR trial rule and heavy-check rollout

### First PR trial rule

The **first 2–3** Cursor PRs **must** be **observation PRs**: let workflows run, read logs, and fix gaps (for example Python or environment assumptions on the runner). **Do not** mark the heavy **Sanctuary GitHub PR** gate as **required** until it has passed **repeatedly** on real PRs. That keeps the vault strong without trapping the builder arm.

### Rollout (heavy gate)

```text
Stage 1: Let Sanctuary GitHub PR run and observe failures (optional: workflow_dispatch only at first).
Stage 2: Fix missing CI deps or workflow steps if needed.
Stage 3: After 2–3 green runs on real PRs, add “Sanctuary GitHub PR” to required status checks alongside “CI” (or your chosen minimum set).
```

You can still use **branch protection** with PRs and approvals **before** the heavy check is required—only the **required checks** list should ramp slowly.

**Step-by-step (local branch, push, what to watch):** [Z-GITHUB-FIRST-PR-OBSERVATION.md](Z-GITHUB-FIRST-PR-OBSERVATION.md).

---

## 4. CODEOWNERS

The repo includes **[.github/CODEOWNERS](../.github/CODEOWNERS)** so GitHub can request reviews from accountable owners when those paths change. Adjust patterns and `@` handles when you add collaborators.

---

## 5. Security features (GitHub)

Enable as available for your plan:

- **Secret scanning** and **push protection** (reduce accidental credential commits)
- **Dependabot** (dependency updates/alerts where appropriate)
- **Code scanning** (static analysis — enable when workflows and tooling are ready)

Operational guidance: **[Z-ECOSYSTEM-GITHUB-INTEGRATION.md](Z-ECOSYSTEM-GITHUB-INTEGRATION.md)** (identity, PAT hygiene, Actions secrets).

---

## 6. CI as verifier (GitHub Actions)

### Two layers (important)

The hub distinguishes:

- **`verify:ci`** — includes **`z_execution_enforcer_gate`** and structural gates (see **`package.json`**). Suitable when you **want** overseer/release alignment active; **can block merges** when execution enforcer is not green.
- **`verify:sanctuary-github-pr`** — **`verify:full:technical`** followed by **`twin-roots:status`** (no gate prepended). This matches **“technical proof without release enforcement”** (`AGENTS.md`: use `verify:full:technical` when the release gate is on hold).

**Recommended default for Cursor PR CI:** **`npm run verify:sanctuary-github-pr`**

Equivalent to your documented intent:

```text
npm run verify:full:technical
npm run twin-roots:status
```

Shortcut (single command):

```text
npm run verify:sanctuary-github-pr
```

The shorthand **`npm run verify:all`** is aliased in **`package.json`** to **`verify:sanctuary-github-pr`** (same compound check). Use **`npm run verify:ci`** as a separate, explicit job only when you want enforcer-aligned CI on pushes or specialized branches — not blindly doubled with `verify:full:technical` on every PR.

### Workflows in this repo

| Workflow | Typical use |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **[.github/workflows/ci.yml](../.github/workflows/ci.yml)** | Fast structural gate (`verify:ci`) on push / PR |
| **[.github/workflows/sanctuary-github-pr.yml](../.github/workflows/sanctuary-github-pr.yml)** | Optional **technical + Twin Roots** PR gate (`verify:sanctuary-github-pr`) |

If runtimes are tight, enable **sanctuary-github-pr.yml** selectively (for example workflow dispatch first, then wire to required checks when stable per **section 3**).

---

## 7. Releases — safe snapshots

After a consciously reviewed green milestone:

1. Confirm **restore drill**, governance, and logs per your Turtle Mode checklist (never “flip green” casually).
2. Create a **[GitHub Release](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)** with a predictable tag label, for example:

   **`ZSANCTUARY_PHASE_1_GREEN_v0.1`**

3. Optionally attach manifests, checksums, or report exports appropriate to your accountability model.

---

## 8. Verification after doc changes

Operators may run **`node scripts/z_registry_omni_verify.mjs`** and the hub verify path appropriate to the intent (`verify:sanctuary-github-pr` vs `verify:ci`), per **`AGENTS.md`**.
