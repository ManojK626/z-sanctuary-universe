# data/ide-fusion

Local shared evidence spine for IDE coordination.

## Files

- `active_sessions.json` (optional, local): current active IDE sessions.
- `handoff_journal.jsonl` (optional, local): one JSON object per handoff event.
- `active_sessions.example.json`: starter template.
- `handoff_journal.example.jsonl`: example handoff row.

## Rules

- This folder stores local coordination evidence only.
- No secrets, no telemetry, no provider credentials.
- Missing local files should produce UNKNOWN/YELLOW advisory in fusion reports, not hard RED.
