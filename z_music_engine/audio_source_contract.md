# Z-SME Audio Source Contract

## Shape (JavaScript)

Each row in `Z_SME_AUDIO_SOURCES` includes:

| Field | Meaning |
| ------------- | ------------------------------------------------------------- |
| `trackId` | Stable catalog id (e.g. generated title slug) |
| `seedTrackId` | Link to playlist seed row (`al-1`, `pw-1`, …) |
| `title` | Display title for source card |
| `mode` | One of: alignment, power, journey |
| `sourceType` | One of: user_generated, local_demo, user_url, approved_signed |
| `audioUrl` | Empty until operator attaches a file or URL |
| `sourceLabel` | Human-visible provenance string |
| `intensity` | One of: low, medium, high (product label, not medical) |

## Rules

- Empty `audioUrl` → UI shows **honest** “not attached yet” copy; **no** silent fetch.
- Non-empty `audioUrl` must be **same-origin** or an explicitly approved origin list in a future charter (not v1.1).
- Resolver: `getAudioSourceForSeedTrack(seedTrackId)` maps the active playlist row to metadata.

## v1.1 posture

- Default catalog ships with **empty** URLs — consent flow and UI are real; bytes are opt-in when you add them.
