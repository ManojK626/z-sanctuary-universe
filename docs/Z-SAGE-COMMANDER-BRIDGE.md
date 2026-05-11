# Z-SAGE → Commander (read-only bridge)

**Purpose:** Surface **Z-SAGE** observation summaries inside **AMK-Goku Commander** so evolution and drift are visible at a glance — **without** giving SAGE or Commander execution power.

## Flow

```text
Observe → summarize → display → stop
```

Human reads → human decides.

## Commander UI

Section title: **SAGE Signals (Read-Only)** — collapsed by default (`<details>`).

Shows only:

1. **Pulse** — up to five short rows from the `pulse` array (level, title, summary).
2. **Upgrade chronicle** — up to five rows from `upgrades`.
3. **Drift signals** — up to five rows from `drift`.

A **freshness** line uses `generated_at` when the payload is valid.

No action buttons, no auto-open panels, no links that trigger agents. Optional `links` on upgrade rows render as **plain text** only.

## Data source

Browser loads **`../../data/reports/z_sage_signals.json`** when served from hub root (same pattern as other Commander fetches).

If missing or invalid: show **doctrine placeholder** text — no fabricated metrics.

**Committed stub / example:** `docs/z-sage/z_sage_signals.example.json` — copy to `data/reports/z_sage_signals.json` locally when testing.

## JSON shape

Commander expects **Z-SAGE Signal Schema v1** only. Full field list, examples, and validation rules:

**[Z-SAGE-SIGNAL-SCHEMA-V1.md](Z-SAGE-SIGNAL-SCHEMA-V1.md)**

Summary of Commander acceptance (browser guard):

- `schema` === `Z_SAGE_SIGNALS_V1`
- `posture` === `observe_only`
- `actions_allowed` === `false`
- `pulse`, `upgrades`, and `drift` are arrays

## Input rules for whoever maintains the JSON

Only aggregate signals derived from **already-public** verification/receipt artefacts. No secrets, vault paths, or raw PII.

## UI behaviour

- Neutral colours; stronger emphasis only when pulse/drift `level` suggests attention (display-only).
- Max five items per list client-side.
- Respect `prefers-reduced-motion` — no decorative motion required.

## Hard limits

**SAGE / Commander must not:** trigger actions, create tasks, call agents, read private data outside fetch URL, write files from the browser.

## Related

- [Z-SAGE-SIGNAL-SCHEMA-V1.md](Z-SAGE-SIGNAL-SCHEMA-V1.md)
- [Z-SAGE-CORE-OBSERVATION-PROTOCOL.md](Z-SAGE-CORE-OBSERVATION-PROTOCOL.md)

## Rollback

Remove Commander HTML block for SAGE, remove `fetchSageSignals` from `dashboard/scripts/z-commander-panel.js`, delete stub JSON if undesired.
