# First PR — pipeline observation (runbook)

Use this for **Stage 1** in [Z-GITHUB-SANCTUARY-GATE.md](Z-GITHUB-SANCTUARY-GATE.md) (section 3). **Do not** mark **Sanctuary GitHub PR** as a **required** check until you have watched **2–3** greens.

## Before you start

- This folder is a **clone** of your **private** GitHub repo; **`origin`** points at GitHub.
- **Git** (and optionally **GitHub CLI** `gh`) is installed and on your `PATH`.
- Branch protection on **`main`** can require PRs and reviews **without** listing every status check yet (see gate doc).

## One tiny observation PR (suggested branch name)

```text
cursor/zsanctuary/observation-pipeline-001
```

This runbook file is intentionally small — you can commit it alone for a neutral “observation” change set.

### Commands (PowerShell)

```powershell
cd "C:\Cursor Projects Organiser\ZSanctuary_Universe"
git checkout main
git pull origin main
git checkout -b cursor/zsanctuary/observation-pipeline-001
git add docs/Z-GITHUB-FIRST-PR-OBSERVATION.md
git status
git commit -m "docs: add first PR pipeline observation runbook"
git push -u origin cursor/zsanctuary/observation-pipeline-001
```

### Open the PR

- In the browser: GitHub should offer **Compare & pull request** after push; base **`main`**, compare your branch.
- Or: `gh pr create --base main --title "docs: pipeline observation runbook" --body "Stage 1 observation — watch CI + Sanctuary GitHub PR before making checks mandatory."`

## What to watch (before anything is mandatory)

| Check (typical name) | Workflow file | What it runs |
| ----------------------- | ------------------------- | ------------------------------------------------------------------------ |
| **CI** | `ci.yml` | `npm run verify:ci` (includes execution enforcer gate first) |
| **Sanctuary GitHub PR** | `sanctuary-github-pr.yml` | `npm run verify:sanctuary-github-pr` (long: full technical + Twin Roots) |

Open **Actions** on the PR or repo, click each run, and expand **failed** steps first. If the heavy job fails on Python, Node, or path assumptions, fix in **Stage 2** (deps, workflow, or docs) — not by forcing the check as required.

## After 2–3 green runs

Then add **CI** and **Sanctuary GitHub PR** to **required status checks** under branch protection, per the gate doc.
