<!-- Z: docs\SANCTUARY_WORKSPACE_LENSES.md -->

# Z-Sanctuary Workspace Lenses

This page shows how Zuno interprets your workspace so Super Ghost can switch between **Citizen** and **Physics** views without confusing the system. It also documents the live lens cues that keep your focus aligned with the governance-ready dashboards.

---

## 1. Multi-Root Command Center

Because you treat each module as a living entity, open a **multi-root workspace** (`ZSanctuary.code-workspace`) that collects the folders you care about:

| Lens | Focus | VS Code Setup |
| ---------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Citizen View** | Role-based: all protector/navigator bots, safety layers, and UX companions. | Add folders like `miniai/`, `core/ai_tower/`, `dashboard/`. Create contexts such as “ProtectorOps” and “GovernanceLayer.” |
| **Physics View** | Function-based: formulas, rules, DRP documents, analytics trackers. | Add folders like `rules/`, `docs/`, `core/z_formulas/`, and `app/` (the core logic). |

Use `File → Add Folder to Workspace...` to register each domain, then `File → Save Workspace As...` and name it `ZSanctuary.code-workspace`. Store this file alongside the repo root and commit it once Git is available.

## 2. Workspace Lens Signals

Zuno watches:

- **Activity Density** (are you jumping between files and terminals rapidly?).
- **System Harmony/Coherence** (from `window.ZSystemMetrics`).
- **Autopilot Replay heat/trend data** (from `window.ZAutopilotReplay` and `window.ZChainHistory`).

The Citizen lens lights up when protector/governance folders dominate the workspace, while the Physics lens activates when you work inside formula or DRP directories. Each lens keeps audible cues ready: calm observations for Citizen mode, precise analysis for Physics mode.

### Lens UI cues

Add these artifacts to your status bar or scoreboard for clarity:

1. `Z-Lens`: shows `Citizen` or `Physics` depending on the workspace focus (detect folder names such as `miniai/`, `rules/`, `dashboard/`).
2. `Z-Trace`: a subtle glow or tooltip when both lenses are engaged (Symbiotic Governance).
3. `Z-Wake`: shifts to “Governance Gold” when Harmony is low, recommending a replay review with a calm tooltip.

## 3. Lens Ritual

1. Start in **Citizen Lens** when observing live bots or running the insight streams. Keep autopilot/replay ready.
2. Switch to **Physics Lens** before editing formulas, DRP rules, or autopilot logic.
3. Use Insight Lab and Chain View to confirm the lens matches the system state.

## 4. External Signals

When exporting layout or insight data, record the active lens in each payload:

```json
{
  "lens": "Citizen",
  "activePreset": "analysis",
  "insightId": "162836-1234-manual"
}
```

This lets downstream systems (SRAI, governance auditors, future autopilot modules) know the context of each decision.

---

Update this document whenever you add new partners, insights, or autopilot modules. The goal is to keep the Z-Sanctuary workspace readable, explainable, and calm.

### Lens Awareness Layer v2

With status chips and edge bars clarified, Lens Awareness Layer v2 adds perception filters without control logic.

- **Calm lens (button):** dims debug panels, replay logs, and module actions when stress is high. The page simply sets `data-lens-mode="calm"` so CSS can soften noise.
- **Focus lens:** lowers opacity for every panel except the one you hover or enter, emphasizing the point of attention without moving anything.
- **Governance lens:** warms the Governance Console, Insight Lab, and Replay timeline with a glow whenever ethics/risk should be reviewed before action.

Use the buttons near the status chips to toggle these modes; the state is recorded in `window.Z_LENS_STATE` so every tooltip, export, and automation knows which lens you were “wearing.”
