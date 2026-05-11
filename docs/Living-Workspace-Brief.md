<!-- Z: docs\Living-Workspace-Brief.md -->

# Living Workspace Brief — Z-Sanctuary Universe

This is the living‑workspace reference for anyone who steps into the system. It explains what is currently running, how mental guardrails behave, and which signals everyone should watch before acting.

## Current Layers

- **Harisha guard**  
  Every automation button or shortcut (Safe Pack, autopilot, reflections, tooling) now has `data-harisha-action`. Tooltips, overlays, and linked badges display the current Harisha score/state. When the score drops below 60, the guidance shifts to “observe-only,” so humans keep control.

- **World Pulse**  
  Hourly, read-only snapshots capture heartbeat, Safe Pack activity, and module health. The World Pulse panel renders those signals plus the additional Harisha chip so the rail and pulse share one story.

- **Super Ghost reflections**  
  A weekly card in the Insight stack narrates how the system remained stable or learned from anomalies. The “Run reflection now” and “Export reflection” buttons trigger Chronicle entries and reuse the Harisha guard.

- **Z-Colour palette**  
  The UI palette listens to Harisha + World Pulse moods and shifts to the `focus`, `calm`, `alert`, or `fatigue_protect` profile accordingly. Each transition logs a `z_colour.shift` entry for later narration.

- **Automation overlay**  
  The Harisha overlay badge beside the automation rail shows the current mental tone. Every `data-harisha-action` button tooltip updates instantly via the shared helper.

- **Pattern Constellation**  
  Hourly pattern detection writes Chronicle entries summarizing repeating signals. The reflection card also reports how many patterns were stored, giving a steady sense of system health.

## How to Use

1. **Read the overlay before you act.** If it says “observe-only,” pause and let the score recover.
2. **Use the reflection card.** Run a manual reflection anytime you finish a major change; exports produce shareable JSON snapshots.
3. **Follow the tooltips.** Every automation button and shortcut now explains the current Harisha score and recommended action.
4. **Revisit this guide.** The living workspace evolves, so revisit the briefing whenever major new automation or observability layers arrive.

## Why It Matters

This workspace is audited, reversible, and human-first. Harisha, Safe Pack, World Pulse, and Super Ghost form the observability stack, and this doc keeps their story consistent when you share it with collaborators, doctors, or regulators.
