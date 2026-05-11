# Z-Future Platform Modules Gate (advisory)

**Purpose:** classify high-vision platform modules through the hub gate labels in `docs/Z-BUILD-GATE-MATRIX.md` before heavy implementation.
**Scope:** advisory only; no auto-execution, no payment wiring, no ROM flashing, no mesh deployment, no release changes in this document.

## Gate labels (source of truth)

- `BUILD NOW`
- `PREPARE ONLY`
- `WAIT`
- `ARCHIVE`
- `REJECT / BLOCK`

Use meanings from `docs/Z-BUILD-GATE-MATRIX.md`.

---

## Priority order (next safe flow)

1. Z-Safety Core + Lifeline (supportive-only posture)
2. MirrorSoul Slice 1 integrations
3. Z-Stack Lite shell
4. Z-Office Lite visibility cards
5. Zero->Movie demo storyboard
6. Relay / Z-OS / Android ROM / HoloDesk (later)

---

## Module classifications

### 1) Z-Safety Core v1.7

- **Gate status:** `BUILD NOW` (high priority)
- **Dependencies:** MirrorSoul advisory boundaries, copy standards, escalation wording, safe-mode policy, audit logging
- **Risks:** overclaiming diagnosis/therapy/legal role; panic-inducing wording; missing emergency signposts
- **Safe first prototype:** static spec + lite UI cards + supportive grounding flow + emergency signpost links; no diagnosis claims
- **Required verification before promotion:** `npm test`, `npm run build`, `npm run verify:full:technical`, copy/legal review for claims language

### 2) Z-Ampoule / Z-TripOff / Lifeline Flow

- **Gate status:** `BUILD NOW` (carefully, supportive-only)
- **Dependencies:** safety copy pack, crisis disclaimer standard, regional hotline placeholders
- **Risks:** implied crisis-response replacement, legal exposure from medical/clinical language
- **Safe first prototype:** guided calming actions, pause screen, signposting; no “we treat/fix/diagnose”
- **Required verification before promotion:** same as above + human wording review from safety owner

### 3) Z-Stack Dashboard v1.8 + Aura Pulse

- **Gate status:** `PREPARE ONLY` -> lite build allowed
- **Dependencies:** current web shell (`apps/web`), route registry, module cards from gate matrix
- **Risks:** feature-sprawl and false readiness perception
- **Safe first prototype:** navigation-only cards (`Life`, `Power`, `Creation`, `Future`, `Expansion`) with clear gate badges
- **Required verification before promotion:** route smoke tests + `npm run build` + no hidden execution paths

### 4) Z-OS Shell Home

- **Gate status:** `PREPARE ONLY`
- **Dependencies:** mature auth, modular navigation, fallback strategy across OSes
- **Risks:** scope explosion; competing with full desktop shell expectations
- **Safe first prototype:** visual shell mock in web with static links and gate labels
- **Required verification before promotion:** architecture review + rollback plan + performance baseline

### 5) Z-Office v1.6/v1.7/v1.8

- **Gate status:** `PREPARE ONLY`
- **Dependencies:** identity, collaboration model, doc storage policy, conflict resolution, security model
- **Risks:** data loss, privacy leaks, overpromising live collaboration
- **Safe first prototype:** Z-Office Lite cards (`Z-Text`, `Z-Sheet`, `Z-Slide`, `Z-Draw`) with mock data only
- **Required verification before promotion:** data model tests, auth review, storage/encryption plan, build verification

### 6) Zero -> First Movie -> Earn

- **Gate status:** `PREPARE ONLY` (demo later)
- **Dependencies:** creator workflow UX, content policy, portfolio routes
- **Risks:** guaranteed-income claims, legal/consumer trust risk
- **Safe first prototype:** storyboard/demo flow with wording: “possible earning paths”, “portfolio support”
- **Required verification before promotion:** claims language review, creator flow tests, policy sign-off

### 7) HeartPulse Engine

- **Gate status:** `PREPARE ONLY`
- **Dependencies:** consent model, reflection boundaries, dignity/safety wording
- **Risks:** people scoring/prediction misuse, relationship-control interpretation
- **Safe first prototype:** reflection-only prompts and journaling insights
- **Required verification before promotion:** boundary tests + explicit no-scoring/no-control checks

### 8) Z-Relay / mesh / offline collaboration

- **Gate status:** `WAIT` / research
- **Dependencies:** identity, encryption/mTLS, key rotation, conflict-sync strategy, legal/security review
- **Risks:** data exfiltration, sync corruption, high operational complexity
- **Safe first prototype:** architecture docs and threat model only; no live mesh
- **Required verification before promotion:** security architecture review, staged pilot plan, incident/rollback runbook

### 9) Z-OS / Android ROM / full OS shell

- **Gate status:** `ARCHIVE` / research
- **Dependencies:** vendor blobs, flashing safety, legal/warranty path, device lab
- **Risks:** device bricking, warranty/legal issues, support burden
- **Safe first prototype:** research notes and comparison matrix only
- **Required verification before promotion:** explicit governance decision to move from archive -> prepare

### 10) Z-Android custom ROM

- **Gate status:** `WAIT` (high governance)
- **Dependencies:** device support matrix, verified boot strategy, recoverability, legal/vendor requirements
- **Risks:** brick/security/warranty risk
- **Safe first prototype:** no flashing; only compatibility matrix + Waydroid alternative analysis
- **Required verification before promotion:** dedicated governance approval + recovery test evidence

### 11) Waydroid integration

- **Gate status:** `PREPARE ONLY`
- **Dependencies:** desktop environment support, resource profile, app-compat checks
- **Risks:** user confusion and security boundaries between host and containerized Android
- **Safe first prototype:** read-only launcher bridge concept + docs
- **Required verification before promotion:** host security checks and UX fallback path

### 12) Z-App Suite APK

- **Gate status:** `PREPARE ONLY` -> later build
- **Dependencies:** stable MirrorSoul/ZES APIs, mobile auth, privacy notices
- **Risks:** shipping thin wrappers without stable backend contracts
- **Safe first prototype:** debug APK with mock/staging API only
- **Required verification before promotion:** `flutter test`, `flutter build web`, `flutter build apk --debug` and API contract checks

### 13) Z-HoloDesk v2

- **Gate status:** `ARCHIVE` / concept
- **Dependencies:** graphics pipeline maturity, device requirements, narrative cohesion with current stack
- **Risks:** large effort with low near-term user signal
- **Safe first prototype:** concept deck and route mock only
- **Required verification before promotion:** product priority review against slice goals

### 14) Z-Economy Wallet

- **Gate status:** `WAIT`
- **Dependencies:** legal/compliance, identity/KYC where required, audit ledger, refund/dispute policy
- **Risks:** high legal and trust exposure
- **Safe first prototype:** non-monetary trust points and explanatory UI only
- **Required verification before promotion:** legal sign-off + security audit + payment operations readiness

### 15) Z_Legacy_Glowing_Master_Bible_v7_3_7 bundle

- **Gate status:** `ARCHIVE` / `PREPARE ONLY`
- **Dependencies:** explicit module slicing, safety claim boundaries, owner assignment, rollback path
- **Risks:** speculative/cosmic scope bleed into active product shell; uncontrolled feature flags from legacy bundle
- **Safe first prototype:** intake + classification only (`docs/Z-LEGACY-GLOWING-MASTER-BIBLE-v7_3_7-INTAKE.md`)
- **Required verification before promotion:** gate reclassification + standard verify trio + human claims review

### 16) PRM-Delta transparency card (legacy extract)

- **Gate status:** `PREPARE ONLY`
- **Dependencies:** UI copy guardrails, non-financial claims, display-only data source
- **Risks:** being misread as trading/compliance engine
- **Safe first prototype:** card in `Z-Stack Lite` + explanatory copy only
- **Required verification before promotion:** standard verify trio + claims review

### 17) CRI index explainer card (legacy extract)

- **Gate status:** `PREPARE ONLY`
- **Dependencies:** educational framing and “illustrative data” labels
- **Risks:** policy/compliance overreach if interpreted as official scoring
- **Safe first prototype:** explainer card with sample values only
- **Required verification before promotion:** standard verify trio + governance wording check

---

## Implementation constraints (must remain true)

- Keep outputs **advisory** unless governance explicitly promotes a module.
- Do not add registry/disk auto-write behavior outside existing reviewed paths.
- Do not add deployment/release policy changes from this gate document.
- Use feature flags and kill switches for any future promotion.

---

## Verification rule for any promotion candidate

Minimum evidence:

```text
npm test
npm run build
npm run verify:full:technical
```

If Flutter/mobile slice applies:

```text
flutter test
flutter build web
flutter build apk --debug
```

No proof = concept.
Proof + review = eligible for next gate.

---

**Last reviewed:** 2026-04-27
**Owner intent:** Zuno advisory classification aligned to Build Gate Matrix and Hierarchy Chief.
