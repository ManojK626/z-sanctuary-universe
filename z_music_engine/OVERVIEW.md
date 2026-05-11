# Z-Sanctuary Music Engine (Z-SME) — overview

**Z-SME v1** is a mood-aware, **explainable** audio _intent_ layer: state → mode → playlist → explanation → optional feedback → **append-only observer memory** on this device only.

**v1.1** adds **opt-in** local audio playback (no autoplay, visible sources) — see [audio_consent_policy.md](./audio_consent_policy.md) and [PHASE_2_7_Z_SME_AUDIO_GREEN_RECEIPT.md](./PHASE_2_7_Z_SME_AUDIO_GREEN_RECEIPT.md).

**v1.2 (planned micro-step):** same-origin files under `z-questra/public/audio/` + `audioUrl` only when files exist — [PHASE_2_8_Z_SME_SAME_ORIGIN_AUDIO_RECEIPT.md](./PHASE_2_8_Z_SME_SAME_ORIGIN_AUDIO_RECEIPT.md).

## Layout

| Doc | Role |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [Z_MUSIC_ENGINE.md](./Z_MUSIC_ENGINE.md) | Cursor / builder brief |
| [mood_model.md](./mood_model.md) | State and mode rules |
| [playlist_engine.md](./playlist_engine.md) | Selection and caps |
| [explainability_contract.md](./explainability_contract.md) | Required explanation fields |
| [integration_amk_goku.md](./integration_amk_goku.md) | Training ↔ mode mapping |
| [firestore_schema.md](./firestore_schema.md) | **Optional** cloud schema (not wired in v1) |
| [ui_flow.md](./ui_flow.md) | Operator UI flow |
| [audio_consent_policy.md](./audio_consent_policy.md) | Opt-in playback rules |
| [audio_source_contract.md](./audio_source_contract.md) | Source metadata shape |
| [PHASE_2_7_Z_SME_AUDIO_GREEN_RECEIPT.md](./PHASE_2_7_Z_SME_AUDIO_GREEN_RECEIPT.md) | v1.1 receipt |
| [PHASE_2_8_Z_SME_SAME_ORIGIN_AUDIO_RECEIPT.md](./PHASE_2_8_Z_SME_SAME_ORIGIN_AUDIO_RECEIPT.md) | v1.2 same-origin plan |
| [bots/z_music_curator_bot.md](./bots/z_music_curator_bot.md) | Curator assist-only |
| [bots/z_music_guardian_bot.md](./bots/z_music_guardian_bot.md) | Safety / disclaimers |

## Reference implementation

Local UI and engine code live under **`z-questra`** (JavaScript, no hub bridge):

- `z-questra/src/lib/zMusicEngine/`
- `z-questra/src/components/ZMusicPanel.jsx`

## Hard rules (v1)

- No hidden personalization
- No autoplay without explicit user action
- Always show **why this track**
- No medical or therapeutic claims
- Child-aware defaults when age mode is **kids** (softer energy caps)
- Observer memory is **append-only** and **never** triggers automatic playback or training
