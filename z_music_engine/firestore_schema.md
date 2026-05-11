# Firestore schema (optional — **not implemented in v1**)

If a future chartered cloud lane is approved, events could mirror the local observer log:

## Collection: `z_music_events`

| Field | Type | Notes |
| ----------- | -------------- | --------------------------------------------------- |
| `id` | string | Document id |
| `userId` | string or null | Optional; must follow auth policy |
| `type` | string | One of: `play_started`, `feedback`, `mode_selected` |
| `payload` | map | Opaque JSON-safe payload |
| `createdAt` | timestamp | Server or client per policy |

## Rules (sketch)

- Writes **append-only**; no silent personalization jobs.
- Reads scoped to owning user or admin role per charter.
- **v1:** no Firebase SDK in Z-QUESTRA; this file is design-only.
