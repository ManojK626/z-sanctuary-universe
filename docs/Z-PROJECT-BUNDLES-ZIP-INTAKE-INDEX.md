# Project ZIP bundles — intake index (Z_Sanctuary_Universe 2)

**Scan date:** 2026-04-27
**Folder:** `C:\Cursor Projects Organiser\ZSanctuary_Universe\Z_Sanctuary_Universe 2\`
**Purpose:** Classify every project-local ZIP (except items already covered elsewhere) so “completion” means **governed evidence**, not unbounded integration.

**Related:** `Z-BUILD-GATE-MATRIX.md`, `Z-FUTURE-PLATFORM-MODULES-GATE.md`, `Z-LEGACY-GLOWING-MASTER-BIBLE-v7_3_7-INTAKE.md` (separate legacy bible bundle).

| Bundle | Files (count) | Gate now | “Full complete” in a safe sense |
| ---------------------------------- | ------------: | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `skillradar_dashboard_v1.zip` | 5 | `PREPARE ONLY` | Static open `index.html` locally; treat `z-gca-v1.json` as **reference** data, not a live trust signal. |
| `skillradar_dashboard_v2.zip` | 8 | `PREPARE ONLY` | Same as v1, plus `*.receipt.json` — verify Merkle/roots **offline** if you use Vegeta; no auto-wire to production. |
| `skillradar_dashboard_v2_1.zip` | 10 | `PREPARE ONLY` | Adds `bias_report.json` + receipts; good for **bias review demos**; not a compliance or safety certification. |
| `ssif-v1-tuned-params.zip` | 4 | `ARCHIVE` / `PREPARE ONLY` | `API_NOTES.json` describes **fictional** HTTP surfaces; `ssif-v1.params.json` is a **tuning story** for named cores. “Complete” = documented + checksummed reference only. |
| `vegeta_merkle_tool_v1.zip` | 4 | `PREPARE ONLY` → optional `BUILD LITE` | `vegeta_merkle.js` is a small Node Merkle helper over `*.receipt.json`. “Complete” = copy into `scripts/` under review, run on a **dev** receipt folder, commit `vegeta_root.merkle.json` as an artifact if needed. **Do not** treat root as product attestation without process. |
| `z-global-capability-atlas-v1.zip` | 6 | `PREPARE ONLY` | Canonical `z-gca-v1.json` + HOW_TO; same atlas file also appears in SkillRadar zips. “Complete” = treat as **data + docs** for Z-Stack / internal planning; no automatic core updates. |
| `z-office_v1_5_wired.zip` | 31 | `PREPARE ONLY` / `WAIT` for collab | Flutter **z-text / z-sheet / z-slide / z-draw** stubs, CRDT/presence/Whis TTS **concepts**, relay client. “Complete” = `flutter pub get` + `flutter run` **locally** after starting relay; not merged into `apps/web` without a product slice. |
| `z-relay_v1_5_sync.zip` | 7 | `WAIT` / research prototype | Node server + Docker for topics (`doc.patch`, `presence.state`, `tts.play`, `vault.chunk`, etc.). “Complete” = `npm install`, `npm start` or `docker compose` in a **lab**; no production deploy until `Z-B2B` + security + ops sign-off. |

**Cross-reference — already intaken:** `Z_Legacy_Glowing_Master_Bible_v7_3_7.zip` → `Z-LEGACY-GLOWING-MASTER-BIBLE-v7_3_7-INTAKE.md` and `Z-LEGACY-EXTRACT-PREP-01.md`.

---

## 1. SkillRadar dashboard (v1, v2, v2.1)

**Contents:** `index.html`, `assets/app.js`, `assets/style.css`, `z-gca-v1.json`; v2+ add per-file `*.receipt.json`; v2.1 adds `bias_report.json` + receipt.

**Classification:** `PREPARE ONLY` — static visualization and reference atlas data.

**Risks:** Interpreting charts or numbers as real-world org or model certification; connecting to user PII or live APIs without a contract.

**Safe use:** Open locally or host as a **static** demo; keep advisory language; do not pass dashboard output into GGAESP “GO” for money/health without human review.

---

## 2. SSIF v1 tuned params

**Contents:** `ssif-v1.params.json` (+ sha256), `API_NOTES.json` (+ sha256) describing notional `POST` routes to “Z-Tuner” and “Z-core/update”.

**Classification:** `ARCHIVE` / `PREPARE ONLY` — design-time parameters and API **sketch**, not a deployed service in this repo.

**Risks:** Accidental script or agent calling fictional endpoints; treating params as automatically safe for any runtime.

**Safe use:** Compare against hub **real** OpenAPI and MODULE-BUILD-PLAN; use only as narrative/tuning reference.

---

## 3. Vegeta Merkle tool v1

**Contents:** `README.md`, `vegeta_merkle.js`, receipts for those files.

**Classification:** `PREPARE ONLY`; optional small **dev** promotion to `scripts/` after read of `vegeta_merkle.js` (no network, local folder only).

**Risks:** Merkle root presented as “proof” without chain-of-custody or governance.

**Safe use:** Integrity checks over **known** receipt sets in CI or manual audit; document what the root does **not** prove.

---

## 4. Z-Global Capability Atlas v1 (standalone)

**Contents:** `z-gca-v1.json`, `README.md`, `HOW_TO_USE.md`, receipts.

**Classification:** `PREPARE ONLY` — same atlas concept as embedded in SkillRadar; useful for Z-Stack Lite “capability” language.

**Risks:** Treated as exhaustive world truth; overfitting product roadmap to static JSON.

**Safe use:** Link from internal docs or a **read-only** UI card; version and diff when you change narrative.

---

## 5. Z-Office v1.5 wired

**Contents:** Four Flutter apps under `apps/z-*`, `core/collab` (RGA-like, relay client), audio Whis, adapters, policy JSON, config for relay and TTS.

**Classification:** `PREPARE ONLY` for UI/collab story; **dependencies** on relay + optional TTS bridge → effectively `WAIT` for “real” office product claims.

**Risks:** CRDT/relay without auth, key rotation, and abuse review; TTS and “mood” paths touching sensitive use cases.

**Safe use:** Local dev demo only; align with `Z-FUTURE-PLATFORM-MODULES-GATE.md` (Z-Office Lite cards on web first if you need visibility without Flutter scope).

---

## 6. Z-Relay v1.5 sync

**Contents:** `package.json`, `server/index.js`, `Dockerfile`, `docker-compose.yml`, `docs/README.md`.

**Classification:** `WAIT` / research — matches relay/mesh gating; fine for an isolated **lab** with fake data.

**Risks:** Exposed WebSocket/HTTP, no production hardening in the sketch; `vault.*` topics imply security expectations.

**Safe use:** Run on localhost; firewall; no public ingress; pair with `Z-B2B-PARTNER-AUTH-SKETCH.md` before any B2B story.

---

## Suggested order of “completion” (evidence, not code explosion)

1. **Static + data:** Open SkillRadar v2.1 and standalone Z-GCA zip; confirm atlas JSON is consistent; keep receipts in git only if policy allows.
2. **Tooling:** Optionally add Vegeta Merkle as a vetted `scripts/*` one-off; document input/output.
3. **Lab only:** `z-relay` then `z-office` Flutter, same machine, two browser windows — capture screenshots/logs as **prototype evidence**, not shipping.
4. **No lift:** SSIF params and fictional API notes stay **documentary** until real Z-Tuner / core APIs exist in hub with tests.

This index is the **step-by-step gate map** for “completing” the ZIPs under Z-Sanctuary governance: each bundle has a clear finish line that is **intake + classification + optional local verification**, not implicit merge into `apps/web` or production.
