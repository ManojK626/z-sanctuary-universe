# Z-GitHub Fresh-Branch Merge Lane

**System ID:** Z-GITHUB-FRESH-BRANCH-1  
**Status:** Active operator law (Turtle Mode)  
**Authority:** Zuno verdict + AMK sacred moves

---

## Zuno verdict

**Stop rebasing old conflicted PR branches.** Rebuild stale work from **`origin/main`** on **new or already-clean** `cursor/zsanctuary/*` branches.

Fix and open **already-clean doctrine lanes first**, then rebuild stale PR content from fresh main. That prevents the old conflict jungle from eating the whole workflow.

---

## Locked law

```text
Rebase old conflict PR ≠ default safe move.
Fresh branch from origin/main = default for stale PRs.
Doctrine ≠ marketplace launch.
GREEN receipt ≠ merge permission.
AMK-Goku owns sacred merges.
Do not auto-merge. Do not auto-close old PRs without AMK ack.
```

---

## Lane priority (2026-06-06 wave)

| Order | Branch | Posture | Action |
| ----- | ------ | ------- | ------ |
| 1 | `cursor/zsanctuary/compassion-wellness-phase-0` | Clean (0 behind main) | **Open PR → merge first** |
| 2 | `cursor/zsanctuary/z-paradigm-1` | Clean | **Open PR → merge** |
| 3 | `cursor/zsanctuary/z-sanctuary-foundation-rulebook` | Clean | **Open PR → merge** |
| 4 | `cursor/zsanctuary/compassion-barter-phase-0` | Rebuild from fresh main | Push + open PR |
| 5+ | Stale open PRs (#1, #4–#9) | Conflict jungle | **HOLD rebase** — cherry-pick or recreate on fresh main |

---

## Stale PR handling (do not rebase by default)

| Old PR | Old branch | Safe replacement pattern |
| ------ | ---------- | ------------------------ |
| #1 | `copilot/update-charter-and-boost-docs` | Fresh `cursor/zsanctuary/z-powershell-operator-boost-1` from main |
| #4 | `cursor/zsanctuary/z-pgmo-phase-0-doctrine` | Fresh branch; copy `docs/z-pgmo/` only |
| #5–#6 | eslint + copilot fix chain | One fresh CI branch from main |
| #7–#8 | mde doctrine + copilot fix | Fresh doctrine branch; separate CI if needed |
| #9 | `z-work-pulse-phase-0-doctrine` (kitchen-sink) | **Split** into separate fresh branches per domain |

After a fresh PR merges, AMK may **close** the obsolete open PR with a comment pointing to the replacement.

---

## Fresh-branch recipe (Cursor / GitHub AI)

```bash
git fetch origin main
git checkout -b cursor/zsanctuary/<lane-name> origin/main
# copy or cherry-pick ONLY the intended domain files
npm run verify:md
npm run z:car2
npm run dashboard:registry-verify
git push -u origin cursor/zsanctuary/<lane-name>
# open PR via gh or GitHub compare URL — AMK merges
```

**Never** in this lane: auto-merge, force-push to `main`, or rebase a branch that is 10+ commits behind with INDEX/AI_BUILDER conflicts without AMK explicit choice.

---

## Open PR compare URLs (clean lanes)

Replace after push if branch names change:

- [compassion-wellness-phase-0](https://github.com/ManojK626/z-sanctuary-universe/compare/main...cursor/zsanctuary/compassion-wellness-phase-0?expand=1)
- [z-paradigm-1](https://github.com/ManojK626/z-sanctuary-universe/compare/main...cursor/zsanctuary/z-paradigm-1?expand=1)
- [z-sanctuary-foundation-rulebook](https://github.com/ManojK626/z-sanctuary-universe/compare/main...cursor/zsanctuary/z-sanctuary-foundation-rulebook?expand=1)
- [compassion-barter-phase-0](https://github.com/ManojK626/z-sanctuary-universe/compare/main...cursor/zsanctuary/compassion-barter-phase-0?expand=1) (after push)

---

## Verification before PR

| Command | When |
| ------- | ---- |
| `npm run verify:md` | Every docs PR |
| `npm run z:car2` | Doctrine packs |
| `npm run dashboard:registry-verify` | INDEX / builder context touched |
| `npm run z:traffic` | Optional advisory |

---

## Cross-links

- [Z_CURSOR_AGENT_RULES.md](Z_CURSOR_AGENT_RULES.md)
- [Z_HANDOFF_TEMPLATE.md](Z_HANDOFF_TEMPLATE.md)
- [../AI_BUILDER_CONTEXT.md](../AI_BUILDER_CONTEXT.md)
