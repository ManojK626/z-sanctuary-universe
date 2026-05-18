# Z-PGMO — Operator queue policy

PGMO **respects** Turtle Mode merge order. It does not reorder, auto-merge, or bypass branch protection.

## Queue principles

1. **One domain per PR** — docs, UI, registry, or scripts; not combined without charter
2. **Small branches** — prefix `cursor/zsanctuary/` on hub; satellite repos use their own prefix
3. **`main` is protected** — PR + human approval required
4. **Sacred moves** — deploy, merge to prod, secrets, billing: AMK only
5. **Parked lanes** stay parked until receipts exist (e.g. Z-ADTF)

## Recommended hub merge order (May 2026)

Use this when PGMO advises on sequencing. Operator may override with documented reason.

```text
1. MD060 hygiene (narrow branch or scoped table compact)
2. Operational Technology Layers (PR #3 cursor — close duplicate #2)
3. LinguaCore Phase 0
4. Rebase LinguaCore Phase 1 → PR → merge
5. Mauritius continuity / validation tests (human)
6. Z-PGMO Phase 0 doctrine (this lane — after OTL on main)
7. E2 Local Gateway (when hub spine stable)
8. Z-CPSR continuity (optional; stash pop → commit → PR)
9. Z-ADTF — PARKED until validation receipts
```

## Parallel tracks (separate repos)

| Repo | Branches (examples) | PGMO note |
| --- | --- | --- |
| Roulette-Data-Analyzer | `cursor/roulette/turtle-deployment-governance`, `cursor/roulette/phase-a-d-stabilization` | Merge on Roulette GitHub; not blocked by hub OTL |
| Z-Sanctuary Universe | lanes above | Hub queue order |

## Duplicate PR handling

When two PRs target the same scope (e.g. OTL #2 Copilot vs #3 Cursor):

- Merge **one** canonical PR (prefer `cursor/zsanctuary/*`)
- Close the other as duplicate
- PGMO receipts should note which was merged

## Pre-merge checklist (operator)

- [ ] Files changed match lane scope (docs-only vs runtime)
- [ ] No secrets in diff
- [ ] No auto-deploy or Cloudflare mutation implied
- [ ] `verify:md` or scoped lint run where applicable (informational if legacy MD060 remains)
- [ ] **Indicator posture reviewed** (dashboard or docs) — posture is advisory, not approval
- [ ] Optional: `npm run amk:ai-sync` — read Z-Team routing packet; do not treat as merge authority
- [ ] Human approval recorded
- [ ] Post-merge: `git checkout main && git pull origin main`

## AMK Indicators + Z-Team AI at queue time (Phase 0.1)

Before merging a hub lane, PGMO recommends the operator **look** at readiness — not delegate the merge:

| Check | Command / surface | Not a substitute for |
| --- | --- | --- |
| Indicator cards | Hub dashboard AMK indicators (HTTP from repo root) | PR approval or CI green |
| AI team sync | `npm run amk:ai-sync` → `data/reports/amk_ai_team_sync_report.json` | Auto-routing execution |
| PGMO receipt | Manual note in chat or future report lane | GitHub Merge button |

```text
indicator ≠ permission
AI team advice ≠ approval
```

PGMO may suggest: “YELLOW on traffic — have Z-Team hygiene role review before merge.” AMK still clicks Merge.

## Post-merge rebase (LinguaCore Phase 1 example)

```powershell
cd "C:\Cursor Projects Organiser\Z_Sanctuary_Universe"
git fetch origin
git checkout cursor/zsanctuary/linguacore-phase-1-nexus-language-cockpit
git rebase origin/main
git push --force-with-lease origin cursor/zsanctuary/linguacore-phase-1-nexus-language-cockpit
```

PGMO documents this; **operator runs** rebase and push.

## What PGMO does not do to the queue

- Does not click Merge on GitHub
- Does not force-push without operator
- Does not skip parked lanes
- Does not promote “open PGMO before OTL” unless operator explicitly reorders

## Related

- [Z_PGMO_IMPROVEMENT_RADAR.md](./Z_PGMO_IMPROVEMENT_RADAR.md)
- [Z_PGMO_MASTER_DOCTRINE.md](./Z_PGMO_MASTER_DOCTRINE.md)
