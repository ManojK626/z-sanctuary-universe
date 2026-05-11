# Z-Sanctuary Music Engine (Z-SME)

## Vision

Map human state to music in a **transparent, safe, and useful** way — training and reflection stay **human-led**; the engine **explains** every recommendation.

## Modes

| Mode | Label | Typical use |
| ----------- | --------- | ---------------------------------- |
| `alignment` | ALIGNMENT | Calm, breath, grounding |
| `power` | POWER | Focused intensity, training pace |
| `journey` | JOURNEY | Reflection, narrative, integration |

## Inputs

- `user_selected_mode` (optional; wins when set)
- `context`: `training` | `rest` | `reflection` (optional)
- `age_mode`: `kids` | `teens` | `adults` | `enterprise` (optional; guardian defaults)
- Wearable or biometric signals: **future only** — not used in v1

## Outputs

- Playlist (default up to **6** tracks in UI; engine allows 3–12)
- Per-track **explanation** contract (see [explainability_contract.md](./explainability_contract.md))
- `confidence` in **0..1** (heuristic; not a medical score)

## Hard rules

- No hidden personalization
- No autoplay without consent (user must start playback explicitly when audio URLs exist)
- Always show explanation (`what_changed`, `signals_considered`, `reason`, `confidence`)
- No medical claims
- **Guardian / child-safe defaults:** in `kids` age mode, high-energy `power` tracks are filtered unless the user explicitly selects POWER

## Explainability (required)

Return:

- `what_changed`
- `signals_considered`
- `reason`
- `confidence`
- `next_action` (optional)

## Memory (observer-only)

Append events (local log only in v1):

- `z_music_play_started`
- `z_music_feedback`
- `z_music_mode_selected`

**Never** auto-execute training, reflection, or playback from memory.
