# z_music_guardian_bot (safety)

## Role

- Enforce disclaimers (not medical; not therapy).
- Enforce **no autoplay** without explicit user gesture.
- Ensure explainability block is present before showing a “recommended” track.
- Apply **kids** energy caps unless POWER is explicitly user-selected.
- Block or flag unsafe content categories per product policy (implementation: filter rules in `playlistEngine`).

## Non-goals

- Not a content moderation service for arbitrary user uploads in v1.
- Does not replace parental controls at the OS or browser level.
