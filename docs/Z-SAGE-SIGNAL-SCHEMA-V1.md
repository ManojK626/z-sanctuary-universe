# Z-SAGE Signal Schema v1

**Purpose:** Define the **read-only** JSON shape for **Z-SAGE** signals consumed by **AMK-Goku Commander** (and any other human-visible, non-executing viewers). Signals summarize completed upgrades, drift observations, and health pulses. They inform the operator only; they **must not** trigger automation, agents, or cross-system commands.

**Authority:** Observe-only. Human interprets every signal.

## JSON file location

```text
data/reports/z_sage_signals.json
```

Serve the dashboard from the hub root so the browser can fetch `../../data/reports/z_sage_signals.json` on the same origin used by Commander.

**Example file (copy for local tests):** `docs/z-sage/z_sage_signals.example.json`

## Schema identifier

```text
Z_SAGE_SIGNALS_V1
```

Consumers should accept **only** payloads that declare this schema and satisfy the validation rules below (Commander enforces a subset in the browser).

## Full example (schema v1)

```json
{
  "schema": "Z_SAGE_SIGNALS_V1",
  "generated_at": "2026-05-02T00:00:00Z",
  "source": "z-sage-readonly",
  "posture": "observe_only",
  "pulse": [
    {
      "id": "pulse-001",
      "level": "info",
      "title": "System health refreshed",
      "summary": "Latest read-only status report is available.",
      "timestamp": "2026-05-02T00:00:00Z"
    }
  ],
  "upgrades": [
    {
      "id": "upgrade-001",
      "status": "completed",
      "title": "Commander SAGE panel added",
      "summary": "Read-only SAGE signals now appear in Commander.",
      "timestamp": "2026-05-02T00:00:00Z",
      "links": ["docs/Z-SAGE-COMMANDER-BRIDGE.md"]
    }
  ],
  "drift": [
    {
      "id": "drift-001",
      "level": "watch",
      "title": "No active drift",
      "summary": "No schema, doctrine, or boundary drift detected.",
      "timestamp": "2026-05-02T00:00:00Z"
    }
  ],
  "actions_allowed": false
}
```

## Required top-level fields

| Field | Type | Notes |
| ----------------- | ------- | ----------------------------------------------------------- |
| `schema` | string | Must be exactly `Z_SAGE_SIGNALS_V1`. |
| `generated_at` | string | ISO 8601 timestamp for report freshness. |
| `posture` | string | Must be exactly `observe_only` for v1 Commander acceptance. |
| `pulse` | array | Zero or more pulse objects (see below). |
| `upgrades` | array | Zero or more upgrade objects. |
| `drift` | array | Zero or more drift objects. |
| `actions_allowed` | boolean | Must be `false` for v1 Commander acceptance. |

## Recommended top-level fields

| Field | Type | Notes |
| -------- | ------ | ---------------------------------------------------------------------------------------------------- |
| `source` | string | Origin label for the report (e.g. `z-sage-readonly`). Not validated in Commander; useful for audits. |

## Pulse item fields

| Field | Type | Required | Notes |
| ----------- | ------ | ----------- | ---------------------------------------- |
| `id` | string | recommended | Stable id for the row. |
| `level` | string | recommended | e.g. `info`, `warn` — display-only hint. |
| `title` | string | recommended | Short headline. |
| `summary` | string | recommended | One line or short paragraph of text. |
| `timestamp` | string | recommended | ISO 8601 when the signal was recorded. |

## Upgrades item fields

| Field | Type | Required | Notes |
| ----------- | ---------------- | ----------- | ----------------------------------------------------------------------------- |
| `id` | string | recommended | Stable id. |
| `status` | string | recommended | e.g. `completed`, `verified`. |
| `title` | string | recommended | Short headline. |
| `summary` | string | recommended | What changed (human-readable). |
| `timestamp` | string | recommended | ISO 8601. |
| `links` | array of strings | optional | Doc paths or references; render as **plain text** in UI (no auto-navigation). |

## Drift item fields

| Field | Type | Required | Notes |
| ----------- | ------ | ----------- | ----------------------------------------------------- |
| `id` | string | recommended | Stable id. |
| `level` | string | recommended | e.g. `watch`, `review`; maps to emphasis in UI rules. |
| `title` | string | recommended | Short headline. |
| `summary` | string | recommended | Drift description. |
| `timestamp` | string | recommended | ISO 8601. |

## Validation rules

1. Document must parse as JSON.
2. Root value must be an object (not an array).
3. `schema` must equal `Z_SAGE_SIGNALS_V1`.
4. `posture` must equal `observe_only`.
5. `actions_allowed` must be exactly `false` (not omitted, not `true`).
6. `pulse`, `upgrades`, and `drift` must each be an array (may be empty).
7. `generated_at` must be present and a string; Commander treats non-parseable timestamps as a freshness warning only if other checks pass, but producers should use valid ISO strings.

If any required rule fails, viewers must show a **safe fallback** (message plus empty lists), never throw.

## Commander rendering rules

- **Read-only:** no buttons, no agent calls, no writes from the browser.
- **Cap lists:** at most **5** items each for pulse, upgrades, and drift.
- **Links:** if `links` is present on an upgrade, append paths as plain text only (no `href` injection from JSON).
- **Emphasis:** prefer neutral styling; if `level` or drift severity implies elevated attention (`warn`, `review`, or similar), allow slightly stronger emphasis only in CSS (no motion required).
- **Motion:** respect `prefers-reduced-motion` for any optional styling.
- **Missing file:** show doctrine placeholder text; do not break the panel.
- **Invalid schema:** show a single clear error line and empty lists.

## Forbidden behaviors

- Using this file to trigger automation, tasks, agents, deploys, merges, or payments.
- Setting `actions_allowed` to `true` or omitting it while expecting Commander to accept v1.
- Cross-system command authority or hidden execution based on file content.
- Embedding secrets, vault paths, or raw PII in signals.

## Related documents

- [Z-SAGE-COMMANDER-BRIDGE.md](Z-SAGE-COMMANDER-BRIDGE.md) — Commander wiring and bridge doctrine.
- [Z-SAGE-CORE-OBSERVATION-PROTOCOL.md](Z-SAGE-CORE-OBSERVATION-PROTOCOL.md) — what SAGE is allowed to observe.

## Rollback

- Delete or rename `data/reports/z_sage_signals.json` and rely on Commander fallback messaging.
- Remove Commander SAGE UI and `fetchSageSignals` from `dashboard/scripts/z-commander-panel.js` if the feature must be fully disabled (see bridge doc rollback).
- Schema version remains documented here for historical reference even if consumers are removed.
