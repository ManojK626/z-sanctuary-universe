<!-- Z: docs\co_autopilot_preview.md -->

# Co‑Autopilot Preview Mode (Read‑Only)

## Purpose

Provide a safe preview of Autopilot suggestions without execution. The preview is observational only.

## Rules

- Read‑only: no writes, no network, no execution.
- No side effects.
- Always logged as preview.

## UI Surface (Minimal)

- Toggle: "Co‑Autopilot Preview"
- Badge: "Preview Only"
- Panel: suggested actions list (disabled actions)

## Data Flow

1. Collect candidates (same as Autopilot)
2. Strip execution capability
3. Log to Chronicle with `preview_only: true`

## Exit Criteria

- Preview visible
- No actions executed
- Chronicle entry recorded
