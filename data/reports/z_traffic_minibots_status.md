# Z-Traffic Minibots — status report

**Generated:** 2026-05-12T17:09:23.279Z

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
| Markdown Traffic Bot | `npm run verify:md` | fail | RED | 3524 |
| CAR² Traffic Bot | `npm run z:car2` | pass | GREEN | 3274 |
| Dashboard Traffic Bot | `npm run dashboard:registry-verify` | pass | GREEN | 457 |
| Cross-Project Bot | `npm run z:cross-project:sync` | pass | GREEN | 440 |
| Z-AWARE-1 Ecosystem Awareness Bot | `npm run z:ecosystem:awareness` | pass | GREEN | 441 |
| Z-API-SPINE-1 Power Cell Bot | `npm run z:api:spine` | pass | GREEN | 470 |
| Z-SSWS-LINK-1 Launch Requirements Bot | `npm run z:ssws:requirements` | pass | GREEN | 467 |
| DRP Gate Bot | `(next-lane hint analysis — read-only)` | advisory | GREEN | 0 |
| AI Builder Bot | `npm run z:ai-builder:refresh` | skipped | skipped | 0 |

## Reason detail (per bot)

### Markdown Traffic Bot

Exit code 1. See stderr_tail in JSON.

<details><summary>Output tail</summary>

```text
 style "compact"]
docs/Z_ANYDEVICE_SYNTHETIC_SIMULATION.md:34:31 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/Z_ANYDEVICE_SYNTHETIC_SIMULATION.md:34:92 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/Z_ANYDEVICE_SYNTHETIC_SIMULATION.md:35:31 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/Z_ANYDEVICE_SYNTHETIC_SIMULATION.md:35:92 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/Z_ANYDEVICE_SYNTHETIC_SIMULATION.md:36:31 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/Z_ANYDEVICE_SYNTHETIC_SIMULATION.md:36:92 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/Z_ANYDEVICE_SYNTHETIC_SIMULATION.md:40:105 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/Z_ANYDEVICE_SYNTHETIC_SIMULATION.md:42:18 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/Z_ANYDEVICE_SYNTHETIC_SIMULATION.md:43:18 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/Z_ANYDEVICE_SYNTHETIC_SIMULATION.md:43:105 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/Z_ANYDEVICE_SYNTHETIC_SIMULATION.md:44:18 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/Z_ANYDEVICE_SYNTHETIC_SIMULATION.md:44:105 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/Z_ANYDEVICE_SYNTHETIC_SIMULATION.md:45:18 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/Z_ANYDEVICE_SYNTHETIC_SIMULATION.md:45:105 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/Z_ANYDEVICE_SYNTHETIC_SIMULATION.md:46:18 error MD060/table-column-style Table column style [Table pipe has extra space to the left for style "compact"]
docs/Z_ANYDEVICE_SYNTHETIC_SIMULATION.md:46:105 error MD060/table-column-style Table column style [Table pip
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
