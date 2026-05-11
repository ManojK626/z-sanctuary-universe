# Playlist engine (Z-SME)

## Behavior

1. Filter catalog tracks where `track.mode === activeMode`.
2. Sort by stable order (catalog order) or by `energy` ascending when in guardian-soft mode.
3. Slice to `maxTracks` (default 6 in UI; max 12 in API).

## Explainability

The engine attaches a playlist-level explanation:

- `what_changed` — mode and filters applied
- `signals_considered` — e.g. `user_selected_mode`, `context`, `age_mode`
- `reason` — short human-readable justification
- `confidence` — heuristic 0..1 from match count and guardian constraints

## Audio

v1 does **not** ship licensed audio URLs. The UI explains intent; operators may attach a library in a later phase under charter and licensing review.
