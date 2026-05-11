# Z-Traffic Minibots — status report

**Generated:** 2026-05-11T14:09:41.810Z

## Traffic Chief

| Field | Value |
|----|----|
| **Overall signal** | **RED** |
| Human decision required | no |
| Blocked categories (hint) | — |

### Recommended action

Stop: fix failing required checks before opening a new lane.

### Next lane advice

Run failing scripts individually; restore green markdown, CAR², dashboard registry, and cross-project sync.

*Minibots do not replace UI/manual acceptance. Reload Cursor if Problems panel looks stale.*

## Minibots

| MiniBot | Command | Status | Signal | Duration (ms) |
|----|----|----|----|----:|
| Markdown Traffic Bot | `npm run verify:md` | fail | RED | 3571 |
| CAR² Traffic Bot | `npm run z:car2` | pass | GREEN | 2959 |
| Dashboard Traffic Bot | `npm run dashboard:registry-verify` | pass | GREEN | 492 |
| Cross-Project Bot | `npm run z:cross-project:sync` | pass | GREEN | 398 |
| Z-AWARE-1 Ecosystem Awareness Bot | `npm run z:ecosystem:awareness` | pass | GREEN | 427 |
| Z-API-SPINE-1 Power Cell Bot | `npm run z:api:spine` | pass | GREEN | 434 |
| Z-SSWS-LINK-1 Launch Requirements Bot | `npm run z:ssws:requirements` | pass | GREEN | 438 |
| DRP Gate Bot | `(next-lane hint analysis — read-only)` | advisory | GREEN | 0 |
| AI Builder Bot | `npm run z:ai-builder:refresh` | skipped | skipped | 0 |

## Reason detail (per bot)

### Markdown Traffic Bot

Exit code 1. See stderr_tail in JSON.

<details><summary>Output tail</summary>

```text
docs/INDEX.md:106:1 error MD055/table-pipe-style Table pipe style [Expected: leading_and_trailing; Actual: no_leading_or_trailing; Missing leading pipe]
docs/INDEX.md:106:7 error MD055/table-pipe-style Table pipe style [Expected: leading_and_trailing; Actual: no_leading_or_trailing; Missing trailing pipe]
docs/INDEX.md:106:7 error MD056/table-column-count Table column count [Expected: 2; Actual: 1; Too few cells, row will be missing data]
docs/INDEX.md:106 error MD058/blanks-around-tables Tables should be surrounded by blank lines [Context: "======="]
docs/INDEX.md:107 error MD022/blanks-around-headings Headings should be surrounded by blank lines [Expected: 1; Actual: 0; Above] [Context: "# Z-Sanctuary Universe"]

```
</details>

### CAR² Traffic Bot

Check passed.

### Dashboard Traffic Bot

Check passed.

### Cross-Project Bot

Check passed.

### Z-AWARE-1 Ecosystem Awareness Bot

Check passed.

### Z-API-SPINE-1 Power Cell Bot

Check passed.

### Z-SSWS-LINK-1 Launch Requirements Bot

Check passed.

### DRP Gate Bot

No --next-lane hint. Operator still confirms Turtle scope before opening a lane.

### AI Builder Bot

Default mode: not run (regenerates many docs). Use --deep to execute.

---

*Read-only advisory tower: no auto-fix, no deploy, no bridge execution. AMK/human chooses the next lane.*
