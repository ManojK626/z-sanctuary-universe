# Z-Traffic Minibots — status report

**Generated:** 2026-06-06T16:44:53.258Z

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
| Markdown Traffic Bot | `npm run verify:md` | fail | RED | 3265 |
| CAR² Traffic Bot | `npm run z:car2` | pass | GREEN | 1859 |
| Dashboard Traffic Bot | `npm run dashboard:registry-verify` | pass | GREEN | 145 |
| Cross-Project Bot | `npm run z:cross-project:sync` | pass | GREEN | 148 |
| Z-AWARE-1 Ecosystem Awareness Bot | `npm run z:ecosystem:awareness` | pass | GREEN | 142 |
| Z-API-SPINE-1 Power Cell Bot | `npm run z:api:spine` | pass | GREEN | 173 |
| Z-SSWS-LINK-1 Launch Requirements Bot | `npm run z:ssws:requirements` | pass | GREEN | 144 |
| DRP Gate Bot | `(next-lane hint analysis — read-only)` | advisory | GREEN | 0 |
| AI Builder Bot | `npm run z:ai-builder:refresh` | skipped | skipped | 0 |

## Reason detail (per bot)

### Markdown Traffic Bot

Exit code 1. See stderr_tail in JSON.

<details><summary>Output tail</summary>

```text
t for style "compact"]
docs/compassion-wellness/TURTLE_MODE_ROADMAP.md:16:46 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/compassion-wellness/TURTLE_MODE_ROADMAP.md:16:104 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/compassion-wellness/TURTLE_MODE_ROADMAP.md:16:136 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/compassion-wellness/TURTLE_MODE_ROADMAP.md:17:10 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/compassion-wellness/TURTLE_MODE_ROADMAP.md:17:46 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/compassion-wellness/TURTLE_MODE_ROADMAP.md:17:104 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/compassion-wellness/TURTLE_MODE_ROADMAP.md:17:136 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/compassion-wellness/TURTLE_MODE_ROADMAP.md:18:10 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/compassion-wellness/TURTLE_MODE_ROADMAP.md:18:46 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/compassion-wellness/TURTLE_MODE_ROADMAP.md:18:104 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/compassion-wellness/TURTLE_MODE_ROADMAP.md:18:136 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/compassion-wellness/TURTLE_MODE_ROADMAP.md:19:10 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/compassion-wellness/TURTLE_MODE_ROADMAP.md:19:46 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/compassion-wellness/TURTLE_MODE_ROADMAP.md:19:104 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/compassion-wellness/TURTLE_MODE_ROADMAP.md:19:136 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "comp
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
