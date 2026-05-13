# Z-PowerShell Operator Boost (Z-POWERSHELL-OPERATOR-BOOST-1)

**Purpose:** A **governed operator cockpit** for PowerShell on Windows: clearer commands, copy-paste bundles, and a steady **read-only observation rhythm** for Z-Sanctuary hub work.

**Non-purpose:** This lane is **not** autopilot. It does **not** auto-deploy, auto-merge, write secrets, mutate Cloudflare, install extensions silently, or run queued observer tasks.

---

## 1. Hub root (always `cd` here first)

```powershell
Set-Location "C:\Cursor Projects Organiser\Z_Sanctuary_Universe"
```

Use the same path in every bundle below. If your clone lives elsewhere, change the string once and reuse.

---

## 2. What this boost gives you

| Need | Safe PowerShell boost |
| ---- | ---------------------- |
| Start day | [Status bundle](#31-status-bundle-git--branch) |
| Verify repo | [Verify bundle](#32-verify-bundle-markdown--structure) |
| Open branches | [Guided Git](#33-guided-git-branches-pr-flow) |
| Run reports | [Observation bundle](#34-observation-bundle-read-only-reports) |
| Clean MD060 / tables | [Markdown hygiene](#35-markdown-hygiene) |
| Deployment readiness | [Read-only rollup](#36-deployment-readiness-read-only) |
| Cloudflare prep | [Docs-only checklist](#37-cloudflare-prep-docs-only) |

---

## 3. Command bundles

### 3.1 Status bundle (Git + branch)

```powershell
Set-Location "C:\Cursor Projects Organiser\Z_Sanctuary_Universe"
git status -sb
git branch --show-current
git remote -v
```

Use before and after verify/report runs so you know what changed locally.

### 3.2 Verify bundle (markdown + structure)

```powershell
Set-Location "C:\Cursor Projects Organiser\Z_Sanctuary_Universe"
npm run verify:md
```

For a wider hub doc pass (when chartered / time allows), see [AGENTS.md](../AGENTS.md) for `verify:hub:metadata` and enforcer-aware vs technical-only pipelines.

### 3.3 Guided Git (branches, PR flow)

```powershell
Set-Location "C:\Cursor Projects Organiser\Z_Sanctuary_Universe"
git fetch origin
git branch -a | Select-String "cursor/zsanctuary"
```

Turtle Mode: branch prefix `cursor/zsanctuary/`, small PRs, human merge. No auto-merge from agents.

### 3.4 Observation bundle (read-only reports)

These scripts **write** under `data/reports/` only (receipt posture). They do **not** deploy, bind edge, or execute queue items.

```powershell
Set-Location "C:\Cursor Projects Organiser\Z_Sanctuary_Universe"
npm run z:traffic
npm run z:deployment:readiness
npm run z:cycle:observe
npm run z:car2
```

Run when you need fresh posture chips or overseer rollups—not on every trivial doc edit unless CI asks.

### 3.5 Markdown hygiene

```powershell
Set-Location "C:\Cursor Projects Organiser\Z_Sanctuary_Universe"
npm run verify:md
node scripts/z_markdown_table_compact.mjs --dry-run
```

Use `--dry-run` first to see whether table compaction would touch files; apply only after review (`npm run md:table-compact` per hub docs).

### 3.6 Deployment readiness (read-only)

```powershell
Set-Location "C:\Cursor Projects Organiser\Z_Sanctuary_Universe"
npm run z:deployment:readiness
```

Read output: `data/reports/z_deployment_readiness_status.md` (and JSON). **Not** deploy authority.

### 3.7 Cloudflare prep (docs-only)

No Cloudflare API calls from this doc. Preparation = read policy and identity JSON, then human actions in the Cloudflare dashboard if chartered.

- [Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md](Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md)
- `data/z_cloudflare_contingency_identity.json` (no secrets in chat; read locally)
- `npm run comms:cloudflare-ai` when policy rows change (see AGENTS.md)

---

## 4. Daily command pack (operator rhythm)

End-of-block `git status` bookends help you see report churn vs intentional edits.

```powershell
Set-Location "C:\Cursor Projects Organiser\Z_Sanctuary_Universe"

git status -sb
npm run verify:md
npm run z:traffic
npm run z:deployment:readiness
npm run z:cycle:observe
npm run z:car2
git status -sb
```

---

## 5. Relationship to other lanes

- **Z-CYCLE-OBSERVE-1:** observer writes queue lines only; PowerShell must not “drain” the queue automatically.
- **Z-OMNI-CHARTER-1** (when merged): visual workstation engine stays presentation-first; PowerShell remains the **operator shell**, not a generator runtime.
- **Z-CLOUDFLARE-OVERSEER-1** (future): read-only posture map; this doc stays **docs + commands** until a separate phase adds an optional read-only helper script with the same gates.

---

## 6. Later slices (not in BOOST-1)

Optional follow-ups (separate branches / receipts):

- One **read-only** helper script under `scripts/` (e.g. print hub-relative paths or validate `cd` target)—only if AMK approves and it stays side-effect free by default.
- VS Code / Cursor task entries that **invoke** the same npm targets (still operator-triggered).

---

## 7. Receipt

Phase doc: [PHASE_Z_POWERSHELL_OPERATOR_BOOST_1_GREEN_RECEIPT.md](PHASE_Z_POWERSHELL_OPERATOR_BOOST_1_GREEN_RECEIPT.md).
