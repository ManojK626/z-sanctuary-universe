# Z-Acoustic Living Pulse Architecture (Z-ACG — Acoustic Cognition Gene)

**Purpose:** Define how the Z-Sanctuary treats **sound, rhythm, and “living” UI** as a **first-class organism layer**—inspired by honest biology (owls, dolphins), aligned with **DRP**, **Z-ALD**, **Z-Living Pulse**, and the **single control plane** (PC/NAS > Cursor > AI).

**Gene name:** **Z-ACG** = **Z-Acoustic Cognition Gene** — the cross-cutting capability that binds passive listening, active probing, visual pulse, and governance.

---

## 1. Biological anchors (accurate, not mystical)

| Model | Mechanism | Engineering mirror |
| ----------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Owl** | Asymmetric hearing, spectral + timing cues → localize **transient** sounds in darkness | **Passive mode:** anomaly detection on time-series, logs, metrics, user events; “what changed?” |
| **Dolphin** | Echolocation: emit click → interpret echo (time, spectrum, multipath) | **Active mode:** synthetic health checks, probes, scheduled sweeps; “did the echo match expectation?” |
| **Both** | Adapt sampling / attention under noise | **Salt-tolerant processing:** denoise, baselines, confidence scores, rollback |

We do **not** claim animals “praise”; we use their **signal-processing strategies** as design metaphors.

---

## 2. Three operating modes

| Mode | Description | Typical inputs |
| --------- | ------------------------- | ----------------------------------------------- |
| `passive` | Owl — listen only | Reports, watchdogs, drift |
| `active` | Dolphin — probe + compare | Web readiness, auto-sweep, SLO targets |
| `hybrid` | Default for Z-Sanctuary | Passive baseline + periodic active confirmation |

The dashboard **Z-Living Pulse** + **Soundscape Posture** report (`data/reports/z_soundscape_posture.json`) summarize **hybrid** posture for operators.

---

## 3. Slug / salt-tolerant sound engine (future core)

**“Salt”** = harsh environments: noise, multipath, sensor degradation, compliance friction.

Planned pipeline (incremental):

1. **Consent & policy** — microphone or audio features only with explicit user consent; local-first where possible.
2. **Baseline** — learn normal per channel / deployment.
3. **Features** — envelope, coarse spectrum, rhythm (invariant under light reverb).
4. **Confidence** — every output carries uncertainty; no silent “max aggression” adaptation.
5. **Governance** — Z-ALD + Z-Security hooks; Z-ASAC&CP for any auto-upgrade of parameters.

**MVP in repo today:** posture is derived from **existing JSON reports** (no raw audio) so the **same math and UX** can extend later to real audio without rewriting the dashboard contract.

---

## 3.1 Phase 2: Real microphone and live features (implemented)

| Artifact | Role |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `core/z_soundscape_audio.js` | Consent-first mic pipeline: `getUserMedia` + Web Audio API `AnalyserNode`. **RMS** from time-domain samples (`getByteTimeDomainData`); **spectrum peak** and onset use frequency data. `AudioContext.resume()` after the user grants access (suspended state on some browsers). If the page is not a **secure context** and is not `localhost` / `127.0.0.1`, start fails with a clear message. All processing local; no raw audio leaves the page. |
| Living Pulse panel | “Enable Z-Soundscape Mic (optional)” + short **privacy** line; **inline status** for errors (denied, unsupported, insecure context). When enabled, drives meter and (when motion is not reduced) particle intensity from live RMS. |
| `z-soundscape-anomaly` event | Custom event fired on onset/anomaly detection; payload `{ type, confidence, rms, delta, spectrumPeak, timestamp, source }`. **Z-ALD integration point** — listeners (Harisha, Security Sentinel, Super Ghost) can subscribe. Set `window.__Z_SOUNDSCAPE_ANOMALY_DEBUG__ = true` to log events to the console. |

**Reduced motion:** When `prefers-reduced-motion: reduce`, the soundscape **meter** does not follow live mic (report vitality only); particles are already hidden by the Living Pulse script.

**Mic capability checklist (support / operators):**

- Mic works only on **HTTPS** or **localhost**.
- **Permission** is required (browser prompt).
- Audio is **analysed locally** in the browser only.
- **No recording** is created by this feature.
- **Reduced-motion** mode disables live mic blending on the meter.

### Privacy boundary

Phase 2 measures local audio energy and onset features only. It does not record audio, upload audio, transcribe speech, identify speakers, or interpret private conversations.

### Retention boundary

No raw audio is persisted. If future Z-ALD integrations persist anomaly events, they must store minimal metadata only and follow Z-ALD audit/retention rules.

### Control boundary

Manual mic-off always wins. No dashboard, bot, panel, or automation may re-enable the microphone automatically.

### Advisory confidence bands

- `confidence < 0.4` — ignore / noise
- `0.4`–`0.7` — watch
- `> 0.7` — notable onset

These bands are **advisory only**; they do **not** trigger automatic action.

**Trust principle:** Alive in feeling, limited by consent, governed by proof.

**Z-ALD hook:**

```js
window.addEventListener('z-soundscape-anomaly', function (e) {
  // e.detail: { type: 'onset', confidence, rms, delta, spectrumPeak, timestamp, source: 'z_soundscape_audio' }
  // Optional: feed to Z-ALD report, Harisha, or Security Sentinel
});
```

---

## 3.2 WebGL / neon layers (roadmap)

Planned extension for richer visual pulse:

- **WebGL-style layers** — offscreen canvas or WebGL overlay for glow, trails, or neon patterns driven by posture + live mic features.
- **STFT / onset refinements** — finer spectral bins, transient detection for more precise “owl” passive listening.
- **Z-ALD integration** — persist onset events to `data/reports` for audit; optional feed to `z_ald_report.json` and Harisha/Super Ghost.

---

## 4. Living / futuristic UI principles

- **Motion = data** — particle intensity, glow hue, pulse rate map to **posture** and **confidence**, not decoration alone.
- **Accessibility** — respect `prefers-reduced-motion`; optional theme hints via CSS variables (see `core/z_soundscape_pulse_panel.js`).
- **Cross-device** — touch-friendly targets; Living Pulse panel uses the same **On / Off / Auto / Read** pattern as other surfaces.
- **Self-upgrade (responsible)** — parameter tuning and feature flags **gated** by Overseer / Z-ACN/MTEH / §9 verification; no silent binary replacement.

---

## 5. Files and tasks (this repo)

| Artifact | Role |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `docs/Z-ACOUSTIC-LIVING-PULSE-ARCHITECTURE.md` | This spec |
| `scripts/z_soundscape_posture.mjs` | Builds `data/reports/z_soundscape_posture.json` (+ `.md`) from existing reports |
| `core/z_soundscape_pulse_panel.js` | Dashboard: **Z-Living Pulse** panel — reads posture, meter, optional CSS hints; blends live mic when enabled |
| `core/z_soundscape_audio.js` | Phase 2: mic capture, RMS/spectrum/onset, consent, `z-soundscape-anomaly` event |
| Task **Z: Soundscape Posture** | Run generator from VS Code / Cursor |

**Related:** [Z-LIVING-PULSE.md](Z-LIVING-PULSE.md), [Z-AUTO-SCREENSHOTS-SOUNDS-DETECTORS.md](Z-AUTO-SCREENSHOTS-SOUNDS-DETECTORS.md), [Z-FULL-VISION-AND-REINFORCEMENT.md](Z-FULL-VISION-AND-REINFORCEMENT.md) (Z-ALD).

---

## 6. Z-ACN/MTEH path for extensions

Any new **audio ingest**, **game-tech renderer**, or **neon pattern layer** must:

1. Update this doc or a child spec.
2. Add scripts/panels under `scripts/` and `core/`; wire dashboard if user-visible.
3. Register in `data/z_module_manifest.json` and run **Z: Module Registry Sync**.
4. Run **Z: Sanctuary Structure Verify** and **§9** completions flow as usual.

---

_Z-Acoustic Living Pulse Architecture — organism-aligned, measurable, kind._
