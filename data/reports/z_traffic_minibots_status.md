# Z-Traffic Minibots — status report

**Generated:** 2026-05-11T14:03:18.638Z

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
| Markdown Traffic Bot | `npm run verify:md` | fail | RED | 3548 |
| CAR² Traffic Bot | `npm run z:car2` | pass | GREEN | 3265 |
| Dashboard Traffic Bot | `npm run dashboard:registry-verify` | pass | GREEN | 384 |
| Cross-Project Bot | `npm run z:cross-project:sync` | pass | GREEN | 437 |
| Z-AWARE-1 Ecosystem Awareness Bot | `npm run z:ecosystem:awareness` | pass | GREEN | 397 |
| Z-API-SPINE-1 Power Cell Bot | `npm run z:api:spine` | pass | GREEN | 414 |
| Z-SSWS-LINK-1 Launch Requirements Bot | `npm run z:ssws:requirements` | pass | GREEN | 379 |
| DRP Gate Bot | `(next-lane hint analysis — read-only)` | advisory | GREEN | 0 |
| AI Builder Bot | `npm run z:ai-builder:refresh` | skipped | skipped | 0 |

## Reason detail (per bot)

### Markdown Traffic Bot

Exit code 1. See stderr_tail in JSON.

<details><summary>Output tail</summary>

```text
 same document [Context: "Allowed Autonomous Behavior"]
docs/docs/ai-governance/docs/ai-governance/docs/ai-governance/docs/ai-governance/docs/ai-governance/docs/ai-governance/Z_AUTONOMY_LIMITS.md:22 error MD025/single-title/single-h1 Multiple top-level headings in the same document [Context: "Forbidden Autonomous Behavior"]
docs/docs/ai-governance/docs/ai-governance/docs/ai-governance/docs/ai-governance/docs/ai-governance/docs/ai-governance/Z_AUTONOMY_LIMITS.md:38 error MD025/single-title/single-h1 Multiple top-level headings in the same document [Context: "Human Authority"]
docs/docs/ai-governance/docs/ai-governance/docs/ai-governance/docs/ai-governance/docs/ai-governance/Z_SECRET_AND_SECURITY_POLICY.md:15 error MD025/single-title/single-h1 Multiple top-level headings in the same document [Context: "Forbidden AI Actions"]
docs/docs/ai-governance/docs/ai-governance/docs/ai-governance/docs/ai-governance/docs/ai-governance/Z_SECRET_AND_SECURITY_POLICY.md:27 error MD025/single-title/single-h1 Multiple top-level headings in the same document [Context: "Environment Variables"]
docs/docs/ai-governance/docs/ai-governance/docs/ai-governance/docs/ai-governance/docs/ai-governance/Z_SECRET_AND_SECURITY_POLICY.md:39 error MD025/single-title/single-h1 Multiple top-level headings in the same document [Context: "Security Principle"]
docs/docs/ai-governance/docs/ai-governance/docs/ai-governance/docs/ai-governance/Z_DEPLOYMENT_BOUNDARIES.md:33 error MD025/single-title/single-h1 Multiple top-level headings in the same document [Context: "Deployment Classes"]
docs/docs/ai-governance/docs/ai-governance/docs/ai-governance/docs/ai-governance/Z_DEPLOYMENT_BOUNDARIES.md:45 error MD025/single-title/single-h1 Multiple top-level headings in the same document [Context: "Human Review Requirement"]
docs/docs/ai-governance/docs/ai-governance/docs/ai-governance/Z_TRUTH_LAYER_POLICY.md:17 error MD025/single-title/single-h1 Multiple top-level headings in the same document [Context: "Truth Categories"]
docs/docs/ai-governance/docs/ai-governance/docs/ai-governance/Z_TRUTH_LAYER_POLICY.md:29 error MD025/single-title/single-h1 Multiple top-level headings in the same document [Context: "Forbidden Behavior"]
docs/docs/ai-governance/docs/ai-governance/docs/ai-governance/Z_TRUTH_LAYER_POLICY.md:41 error MD025/single-title/single-h1 Multiple top-level headings in the same document [Context: "Required Language"]
docs/docs/ai-governance/docs/ai-governance/docs/ai-governance/Z_TRUTH_LAYER_POLICY.md:60
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
