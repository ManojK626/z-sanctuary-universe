# Zuno technology snapshot — Z-Sanctuary Universe

## 0. Snapshot identity

| Field | Value |
| -------------- | ------------------------------------------------------------------------------------------ |
| Snapshot ID | `ZUNO_SNAPSHOT_2026_05_03` |
| Source | Hub root + `z-questra` workspace |
| Integrity | Verified via `verify:md`, `z:car2`, `z:traffic`, `z:cross-project:sync` (at snapshot time) |
| Posture | Evidence-first / local-first / no runtime bridge |
| Autonomy level | L0–L2 only (observe / report / gated hygiene — no execution daemon) |

---

## 1. Executive summary

The ecosystem is in a **disciplined, evidence-first posture**:

- Markdown and metadata gates are green.
- Cross-project JSON is validated.
- Autonomy is **documented**, not daemonized.
- Music engine is **explainable** and **consent-first**.
- Magical UI layers are **free / local** only.

### Explicit constraints

- No runtime bridges from these slices.
- No Firestore or streaming SDK in Z-SME paths described here.
- No autoplay by default for audio.
- No silent personalization in the shipped patterns.

---

## 2. Hub — governance and gates

| Area | Status |
| ------------------ | ---------------------------------- |
| Markdown | GREEN (MD-HYGIENE-1 complete) |
| Drift detection | Z-CAR² active (read-only) |
| Cross-project sync | Validated (`z:cross-project:sync`) |
| Traffic monitoring | ZTR-1 active (`z:traffic`) |
| Autonomy doctrine | ZAG-1 (no daemon) |

---

## 3. Magical canvas and cross-project truth

- **ZMC-1** PlayKit present (`shared/magical-canvas/`).
- Registered in capability and entitlement registries.
- **Rule:** free visual layer only — no bridge or monetization inheritance from metadata alone.

---

## 4. Z-QUESTRA workstation

- **Version:** 0.2.11
- **Tests:** 76 passing (Vitest, at snapshot time)
- **Posture:** local-only; no runtime Z-Sanctuary bridge in this build

---

## 5. Z-SME (music engine)

### v1 core

- Mood model, playlist engine, explainability contract.
- Observer-based event logging (append-only, this device).
- Firestore = **design-only** (no SDK).

### v1.1 audio

- Consent-first (**default OFF**).
- Same-origin URLs only when attached (`audioSources.js`).
- No autoplay; `preload="none"` on `<audio>` when used.

### v1.2 (planned only)

- Same-origin directory `z-questra/public/audio/` — see `z_music_engine/PHASE_2_8_Z_SME_SAME_ORIGIN_AUDIO_RECEIPT.md`.
- **Rule:** if file missing → `audioUrl` stays empty; no guessed paths.

---

## 6. Verification rhythm

### Hub workspace

```bash
npm run verify:md
npm run z:car2
npm run z:traffic
npm run z:cross-project:sync
```

### Z-QUESTRA package

```bash
cd z-questra && npm test
```

---

## 7. Explicit non-claims

- No production deployment added by these slices.
- No billing integration.
- No provider execution.
- No streaming or CDN coupling in Z-SME.
- No autonomy executor or silent self-merge.
- No guaranteed audio playback without assets and consent.

---

## 8. Suggested next lanes

1. Add real MP3s per Phase 2.8 (same-origin only).
2. Optional ZAG-2 manual read-only loop script.
3. Read-only SME hub mirror (charter-gated if live).
4. Continue traffic monitoring after material edits.

---

## 9. Zuno inference hints

- **Planned** features are **not** runtime features until shipped with paths and tests.
- **Z-SME audio** is UI-ready but **data-empty** unless `audioUrl` is non-empty and the file exists.
- **Autonomy** in hub policy is **L0–L2 posture** in documentation — not autonomous execution.
- **Cross-project** rows are **metadata-only** — no live bridge implied.
- Treat the system as **controlled**, not autonomous.

---

## 10. Core system truth

### What Z-Sanctuary is

- Governance-first
- Evidence-first
- Non-extractive
- Consent-driven (where user-facing media applies)
- Modular and auditable

### What Z-Sanctuary is not

- AGI or unconstrained autonomy
- A self-modifying runtime without human lanes
- A provider-driven platform by default

---

## End of snapshot

Refresh this file when major phases close or when verify posture changes materially. Prefer updating the snapshot ID and the integrity row together.

**Structured ingest (ZUNO-A1):** after editing this file, run `npm run zuno:snapshot` so `data/zuno_state_snapshot.json` stays aligned. Slim read-only bundle: `npm run zuno:snapshot:awareness`. See [ZUNO_A1_SNAPSHOT_INGESTION.md](./ZUNO_A1_SNAPSHOT_INGESTION.md).

**Diff (ZUNO-A2):** **A2a** — seed baseline with `npm run zuno:snapshot:baseline`, then `npm run zuno:snapshot` and `npm run zuno:snapshot:diff`. **A2b** — after registry or MD edits, `npm run zuno:snapshot` and `npm run zuno:snapshot:truth-align` (Monster registry vs snapshot echo + narrative heuristics). See [ZUNO_A2_SNAPSHOT_DIFF.md](./ZUNO_A2_SNAPSHOT_DIFF.md).

**Awareness score (ZUNO-A3):** `npm run zuno:awareness-score` — one read-only band + score from verify + A2 + traffic + posture. See [ZUNO_A3_AWARENESS_SCORE.md](./ZUNO_A3_AWARENESS_SCORE.md).

**Recovery gate (ZUNO-A3R):** when A3 is RED, do not open A4 — `npm run zuno:a3r:receipt` (optional `-- --live`). See [ZUNO_A3R_AWARENESS_RECOVERY_RECEIPT.md](./ZUNO_A3R_AWARENESS_RECOVERY_RECEIPT.md).
