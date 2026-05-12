# Z-PC activation awareness (Z-PC-ACTIVATION-AWARENESS-1)

When AMK uses the **Z_Sanctuary_Universe PowerShell route** (or any manual hub shell) to run upgrades and verifications, the ecosystem should leave a **local, read-only receipt** so **Cursor AI Builder**, **AI Tower**, **overseers**, **Z-SSWS**, **Z-CYCLE-DASHBOARD**, **Z-CYCLE-OBSERVE**, and future **symbolic knowledge-tree metaphors** (see policy) can see **what just happened** without AMK re-explaining every time.

## Scope

| In scope | Out of scope |
| ---------------------------------------------------------- | ---------------------------------------------------- |
| Docs, policy JSON, manual receipt script, two report files | Autonomous execution, watcher, daemon |
| Read-only integration into cycle observe + dashboard (GET) | Auto-merge, deploy, secrets |
| Summarize git + phase markers + on-disk report signals | PC-wide scanning, NAS mutation, real device scanning |

## Law

- **Manual only:** `npm run z:pc:activation` records a receipt when the operator runs it after a PowerShell / hub session — **not** a background watcher.
- **Writes only:** `data/reports/z_pc_activation_receipt.json` and `data/reports/z_pc_activation_receipt.md`.
- **Does not run** `npm run verify:*`, `z:traffic`, or other verify pipelines unless a **future human-approved** phase adds that explicitly.
- **No** auto-merge, deploy, secrets, NAS mutation, or mystical execution claims.

## Artifacts

| Artifact | Role |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data/z_pc_activation_awareness_policy.json` | Law, Turtle posture, Cursor guidance, optional **Mango Tree / Starzan Tree** metaphor notes (**docs/registry only**). |
| `scripts/z_pc_activation_receipt.mjs` | Builds the receipt from **git**, `docs/PHASE_*_GREEN_RECEIPT.md` mtimes, `package.json` script sample, on-disk report JSON, growth registry sealed list. |
| `data/reports/z_pc_activation_receipt.json` | Machine receipt (`z_pc_activation_receipt_v1`). |
| `data/reports/z_pc_activation_receipt.md` | Human skim. |

## Command

```bash
npm run z:pc:activation
```

Run after meaningful operator work (e.g. after PowerShell upgrade or verify batch) so receipts stay fresh.

## Cursor / AI ecosystem use

- **Check** `z_pc_activation_receipt.md` or `.json` when starting work to see branch, HEAD, working tree summary, and which phase receipts exist on disk.
- **Summarize** and **suggest** a Turtle Mode branch — **not** permission to execute queue items or verify scripts.
- **AMK / human** still chooses the next lane.

## Optional symbolic metaphors (policy only)

- **Mango Tree** — fruitful project knowledge and growth receipts (future doc/registry metaphor).
- **Starzan Tree** — star-map / cosmic relation memory (future metaphor).

No runtime behavior; no execution claims.

## Related

| Doc / system | Role |
| -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [Z_CYCLE_OBSERVE_SYSTEM.md](Z_CYCLE_OBSERVE_SYSTEM.md) | Embeds `latest_pc_activation` summary when receipt exists. |
| [Z_CYCLE_DASHBOARD_SYSTEM.md](Z_CYCLE_DASHBOARD_SYSTEM.md) | Dashboard may GET the receipt JSON for a card. |
| [PHASE_Z_PC_ACTIVATION_AWARENESS_1_GREEN_RECEIPT.md](PHASE_Z_PC_ACTIVATION_AWARENESS_1_GREEN_RECEIPT.md) | Phase receipt. |
