# Phase 2.8 — Z-SME same-origin demo audio · Receipt (plan)

## Intent (v1.2 micro-step)

Add **real playback** only when **bytes exist** on disk — same-origin, one config surface, consent unchanged.

```txt
same-origin audio only
one config file (audioSources.js)
no autoplay
no broken src
manual consent stays king
```

## Golden rule

```txt
If the file is missing → audioUrl stays empty.
No guessing paths.
```

Do not set `audioUrl` to `/audio/...` until the matching file is present under `z-questra/public/audio/`. The UI already treats empty URL as an honest “not attached yet” state.

## Expected layout (when you add bytes)

```txt
z-questra/public/audio/
  aligned-with-nature-demo.mp3   (or your licensed name)
  awakened-energy-demo.mp3
  inner-journey-demo.mp3
```

Vite serves `public/` at site root — URLs look like `/audio/<filename>`.

## Wiring (operator checklist)

1. Add licensed or self-owned demo files to `public/audio/`.
2. In `z-questra/src/lib/zMusicEngine/audioSources.js`, set `audioUrl` only for rows whose file exists (e.g. `'/audio/aligned-with-nature-demo.mp3'`).
3. Update `sourceType` / `sourceLabel` to reflect reality (e.g. `local_demo` + short provenance).
4. Run `cd z-questra && npm test`.
5. Manual: disable audio → reload → no sound; enable → play → pause; disable again.

## Out of scope

- No CDN guess, no streaming SDK, no Firestore, no remote URL without explicit charter.
- No autoplay change; `preload="none"` stays.

## Verify

```bash
cd z-questra
npm test

npm run verify:md
```

## Rollback

Remove demo files and clear `audioUrl` fields again; delete this receipt if the plan is dropped.
