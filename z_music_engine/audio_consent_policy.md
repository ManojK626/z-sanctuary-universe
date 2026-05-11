# Z-SME Audio Consent Policy

## Hard rules

- Audio playback is **disabled** by default.
- **No autoplay.**
- User must press **Enable audio playback** before any `<audio>` element is shown.
- Consent is **local-only** (`localStorage` on this device).
- User can **Disable audio** anytime; player UI is removed when disabled.
- Track **source** must be visible (type + label + URL status).
- Kids mode keeps **low-intensity** defaults in the playlist engine; volume guidance is shown in the player.
- **No medical** or mood-cure claims.

## Allowed sources

- Local demo files shipped with the app (when chartered and licensed)
- User-provided URL (explicit paste field — future slice)
- Approved generated track URL (operator-attached)
- Future backend-owned signed media URL (charter + DRP gate)

## Forbidden

- Hidden playback
- Auto-start on page load
- Unknown or undeclared external source
- Audio used as manipulation or coercion
- Firestore or streaming SDK in Z-SME v1.1 (not implemented)

## Related

- [audio_source_contract.md](./audio_source_contract.md)
- [PHASE_2_7_Z_SME_AUDIO_GREEN_RECEIPT.md](./PHASE_2_7_Z_SME_AUDIO_GREEN_RECEIPT.md)
