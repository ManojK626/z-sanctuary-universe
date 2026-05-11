<!-- Z: docs\INSIGHT_FEED.md -->

# Insight Feed (Automation wiring)

The Insight Feed exposes a read-only stream of the data Detective-level tools (dashboard, regulators, automation) should trust. It is intentionally **non-intrusive**—nothing here controls the dashboard; it only reports.

## 1. Runtime API

Zuno publishes a global helper:

```ts
window.ZInsightFeed = {
  push(entry), // push new payload (Super Ghost/Replays call this automatically)
  list(limit = 20), // most recent entries (reverse chronological)
  getLatest(), // last pushed entry
};
```

Each payload contains:

- `id`: unique string
- `channel`: `insight` or `replay`
- `source`: e.g., `super-ghost`, `autopilot`
- `summary`: short text
- `metadata`: context (lens mode, reason, replay state)
- `reflection`: optional weekly/lens reflection text (Super Ghost learns what worked).
- `driftMessage`: optional ethics drift observation (“XRing: rising trend...”).

### Listening for updates

The system dispatches a DOM event for every entry:

```ts
window.addEventListener('zInsightFeed', (event) => {
  const payload = event.detail;
  // push to downstream dashboard, webhook, etc.
});
```

## 2. Build-time export

Whenever Super Ghost generates an insight or Autopilot logs a replay entry, the feed is automatically updated. Use the Insight Lab panel’s “Export JSON” button to download the latest feed or call `window.ZInsightFeed.list()` programmatically and forward it to your own API.

## 3. Consumption Patterns

Use this feed to:

- Feed downstream dashboards that expect JSON (wrap into HTTP POST).
- Trigger external processes when `metadata.reason` contains `governance` or `simulation`.
- Back up the feed by copying the exported JSON file to a safe storage bucket.

Connection requests from external tools should always treat this feed as **observational**—it never changes the system state or authority.
