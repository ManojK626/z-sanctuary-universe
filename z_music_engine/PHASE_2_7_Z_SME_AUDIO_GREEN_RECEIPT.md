# Phase 2.7 — Z-SME Opt-In Audio · Green receipt

## Scope

Opt-in **local** audio consent, visible source labels, optional `<audio controls preload="none">` when `audioUrl` is set. **No** backend, Firestore SDK, streaming SDK, or external API calls.

## Delivered

| Item | Path |
| ------------------------- | ------------------------------------------------------- |
| Consent policy | `z_music_engine/audio_consent_policy.md` |
| Source contract | `z_music_engine/audio_source_contract.md` |
| Receipt | `z_music_engine/PHASE_2_7_Z_SME_AUDIO_GREEN_RECEIPT.md` |
| Consent API | `z-questra/src/lib/zMusicEngine/audioConsent.js` |
| Source catalog + resolver | `z-questra/src/lib/zMusicEngine/audioSources.js` |
| Tests | `audioConsent.test.js`, `audioSources.test.js` |
| UI | `ZMusicAudioConsent.jsx`, `ZMusicAudioPlayer.jsx` |
| Integration | `ZMusicPanel.jsx`, `ZMusicPanel.css` |
| Version | `z-questra/package.json` `0.2.11`, manifest `0.2.11` |

## Verify

```bash
cd z-questra
npm test

npm run verify:md
npm run z:cross-project:sync
```

## Manual checklist

| Check | Pass |
| -------------------------------- | ---- |
| Music opens with audio disabled | ☐ |
| No audio on load | ☐ |
| Enable shows player region | ☐ |
| Disable hides player | ☐ |
| Missing URL shows honest message | ☐ |
| Kids banner visible in kids mode | ☐ |
| Play intent logging still works | ☐ |

## Rollback

Remove v1.1 files and revert `ZMusicPanel.*`, `App.jsx`, `package.json`, manifest, and this receipt. Clear `localStorage` key `z-questra:z-sme-audio-consent-v1` if needed.
