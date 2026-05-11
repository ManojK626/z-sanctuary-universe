# Z-ACG / Acoustic Living Pulse — Phase 2 trust handoff receipt

**Date:** 2026-04-27  
**Scope:** Z-EAII acoustic pulse layer — consent-first, local-only Phase 2 mic path + documentation seals.

---

## Public truth (one sentence)

**A consent-first, local-only acoustic pulse layer that makes the dashboard feel alive without recording, uploading, transcribing, identifying speakers, or interpreting private conversation.**

---

## Not a recorder / not speech recognition

Phase 2 is **not** a voice recorder, dictation tool, or speech-recognition product. It measures **audio energy and onset-style posture signals** in the browser only. It does **not** transcribe speech, identify speakers, or interpret private conversations.

---

## What changed (milestone summary)

| Area | Change |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `core/z_soundscape_audio.js` | Consent-first mic; time-domain RMS; spectrum/onset; secure-context guard; `AudioContext.resume()`; cleanup on failure; optional `__Z_SOUNDSCAPE_ANOMALY_DEBUG__`; `z-soundscape-anomaly` event |
| `core/z_soundscape_pulse_panel.js` | Reduced-motion: no live mic blending / rapid live meter updates |
| Dashboard (`index-skk-rkpk.html`) + shadow workbench | Mic opt-in; privacy note; capability checklist; inline mic status for errors |
| `docs/Z-ACOUSTIC-LIVING-PULSE-ARCHITECTURE.md` | Phase 2 spec; mic checklist; privacy / retention / control boundaries; advisory confidence bands; trust principle |

---

## Mic privacy checklist (visible on dashboard)

- Mic works only on **HTTPS** or **localhost**.
- **Permission** is required (browser prompt).
- Audio is **analysed locally** in the browser only.
- **No recording** is created by this feature.
- **Reduced-motion** mode disables live mic blending on the meter.

---

## Boundaries (authoritative copy — see architecture doc)

**Privacy boundary:** Phase 2 measures local audio energy and onset features only. It does not record audio, upload audio, transcribe speech, identify speakers, or interpret private conversations.

**Retention boundary:** No raw audio is persisted. If future Z-ALD integrations persist anomaly events, they must store minimal metadata only and follow Z-ALD audit/retention rules.

**Control boundary:** Manual mic-off always wins. No dashboard, bot, panel, or automation may re-enable the microphone automatically.

**Advisory confidence bands:** `confidence < 0.4` — ignore/noise; `0.4`–`0.7` — watch; `> 0.7` — notable onset. Advisory only — **no** automatic enforcement.

**Trust principle:** Alive in feeling, limited by consent, governed by proof.

---

## Verification results (2026-04-27)

| Check | Result |
| ------------------------------------------------------------------------------------- | ------------------------ |
| `node scripts/z_sanctuary_structure_verify.mjs` | **PASS** — 52 ok, 0 fail |
| `npx markdownlint -c .markdownlint.json docs/Z-ACOUSTIC-LIVING-PULSE-ARCHITECTURE.md` | **PASS** |

Re-run these commands after any doc or wiring change affecting Z-ACG.

---

## References

- Architecture: `docs/Z-ACOUSTIC-LIVING-PULSE-ARCHITECTURE.md`
- Core scripts: `core/z_soundscape_audio.js`, `core/z_soundscape_pulse_panel.js`
- Posture report (JSON reports, no raw audio): `data/reports/z_soundscape_posture.json` (via task **Z: Soundscape Posture**)

---

_Z-ACG Phase 2 trust handoff — sealed._
