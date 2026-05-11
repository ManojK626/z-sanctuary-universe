# Z Learning Log Quickstart (STIL + EML)

Use this when you want to log real outcomes so `ai:self:tuning` and `ai:experience:memory` can learn from reality.

## 1) Generate a starter event

```bash
npm run ai:learning:flow -- --out data/my_event.json --strategy increase_signal --domain signal --success true --impact 12
```

This creates `data/my_event.json` and validates it (dry-run).

## 2) Edit the event with real before/after values

Required:

- `timestamp` (ISO)
- `successful` (true/false)
- `strategy` or `domain`

Strongly recommended:

- `before.coherence_score`, `before.signal_health`, `before.flow_status`
- `after.coherence_score`, `after.signal_health`, `after.flow_status`
- `impact_score`

## 3) Append event to learning log

```bash
npm run ai:learning:flow -- --event-file data/my_event.json --apply
```

Then refresh intelligence layers:

```bash
npm run z:garage:full-scan
```

---

## Copy-paste example: signal improvement

```json
{
  "timestamp": "2026-04-21T13:00:00Z",
  "strategy": "increase_signal",
  "domain": "signal",
  "source": "manual",
  "action_taken": "Added 3 creator entries and 3 business entries",
  "successful": true,
  "impact_score": 14,
  "before": {
    "coherence_score": 53,
    "signal_health": "low",
    "flow_status": "degraded"
  },
  "after": {
    "coherence_score": 68,
    "signal_health": "medium",
    "flow_status": "degraded"
  },
  "notes": "Signal recovered after fresh activity input."
}
```

## Copy-paste example: communication recovery

```json
{
  "timestamp": "2026-04-21T13:20:00Z",
  "strategy": "fix_communication",
  "domain": "communication",
  "source": "manual",
  "action_taken": "Refreshed GitHub/Cloudflare manifests and AAFRTC context",
  "successful": true,
  "impact_score": 18,
  "before": {
    "coherence_score": 58,
    "signal_health": "medium",
    "flow_status": "degraded"
  },
  "after": {
    "coherence_score": 74,
    "signal_health": "medium",
    "flow_status": "healthy"
  },
  "notes": "Comms freshness + manifest alignment restored healthy flow."
}
```

## Copy-paste example: consistency remediation

```json
{
  "timestamp": "2026-04-21T13:40:00Z",
  "strategy": "resolve_consistency",
  "domain": "consistency",
  "source": "manual",
  "action_taken": "Resolved outstanding consistency alerts and re-ran consistency check",
  "successful": true,
  "impact_score": 10,
  "before": {
    "coherence_score": 61,
    "signal_health": "medium",
    "flow_status": "healthy"
  },
  "after": {
    "coherence_score": 71,
    "signal_health": "medium",
    "flow_status": "healthy"
  },
  "notes": "Cross-layer contradictions reduced after consistency cleanup."
}
```
