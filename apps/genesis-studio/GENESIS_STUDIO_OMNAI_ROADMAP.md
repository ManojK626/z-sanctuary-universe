# Genesis Studio / OMNAI Creative Engine Roadmap

## Core Law

Genesis Studio must evolve in Turtle Mode.

Cursor may continue from phase to phase ONLY when:

- build passes
- no real providers are added unless the phase explicitly allows it
- no API keys are required unless explicitly approved
- no billing, deployment, crypto, token, social graph, or external automation is added
- governance receipts remain visible
- human review remains required for publish/export/provider actions

If any check fails:

- STOP
- do not continue
- write a phase report
- list risks and recommended fixes
- wait for AMK/Zuno review

---

# Current State

Branch:
`cursor/zsanctuary/genesis-studio-omnai-shell`

Implemented:

- Phase 1: Genesis Studio shell
- Phase 1B: OMNAI Creative Profile / Creative DNA
- Phase 2A: Storyboard Provider Shell
- Phase 2B: Narrative Audio Intelligence Shell
- Phase 2C: PR Review Hardening

Pipeline:

`script → creative_profile → scenes → storyboard → audio_plan → edit → publish → receipt`

Status:
Stub-only, governed, merge-ready.

---

# Phase 3A — Project Persistence Shell

## Goal

Allow users to create, save, load, and update Genesis projects using Supabase.

## Build

1. Add project persistence helpers:
   - `lib/projects.ts`
   - `lib/scenes.ts`

2. Support:
   - create project
   - list projects
   - load project
   - update project title/description/status
   - save scenes locally to Supabase

3. Update dashboard:
   - show projects from Supabase when logged in
   - keep mock fallback if Supabase env is missing
   - New Project creates draft project

4. Update Script page:
   - allow saving generated scenes to Supabase
   - preserve creativeProfile on project

5. Add receipt:
   - save status
   - last saved timestamp
   - provider status: none
   - storage status: Supabase or mock fallback

## Forbidden

- no media uploads
- no real providers
- no billing
- no deployment
- no background sync

## Verification

Run:
`npm run build`

## Report

Create:
`PHASE_3A_PROJECT_PERSISTENCE_REPORT.md`

Verdict:
GREEN / YELLOW / RED

---

# Phase 3B — Creative Timeline Intelligence

## Goal

Make Edit page understand scene order, timing, pacing, and transitions without real video rendering.

## Build

1. Create:
   - `lib/timeline-profile.ts`
   - `components/timeline-scene-card.tsx`
   - `components/timeline-receipt-card.tsx`

2. Add timeline metadata:
   - scene duration estimate
   - pacing: slow / balanced / fast
   - transition: cut / fade / dissolve / pause
   - emotional beat

3. Update Edit page:
   - show scene timeline
   - allow local reorder
   - allow duration edits
   - show total estimated runtime

4. Supabase:
   Add nullable scene columns:
   - duration_seconds
   - pacing_style
   - transition_style
   - emotional_beat

## Forbidden

- no video rendering
- no ffmpeg
- no Runway/Runpod
- no provider calls

## Verification

Run:
`npm run build`

## Report

Create:
`PHASE_3B_TIMELINE_INTELLIGENCE_REPORT.md`

---

# Phase 3C — Export Receipt System

## Goal

Create export manifests before any real export.

## Build

1. Create:
   - `lib/export-receipt.ts`
   - `components/export-receipt-card.tsx`

2. Publish page should generate a mock export receipt:
   - project id
   - scenes count
   - storyboard status
   - audio plan status
   - timeline status
   - human review required
   - export status: not exported
   - provider status: none

3. Add export checklist:
   - script reviewed
   - images reviewed
   - audio reviewed
   - publish platform selected
   - rights confirmed
   - human approval confirmed

4. Supabase:
   Add `export_receipts` table:
   - id
   - project_id
   - user_id
   - receipt_json
   - status
   - created_at

## Forbidden

- no real export
- no YouTube/TikTok API
- no file generation
- no publishing automation

## Verification

Run:
`npm run build`

## Report

Create:
`PHASE_3C_EXPORT_RECEIPT_REPORT.md`

---

# Phase 3D — Local Asset Vault Shell

## Goal

Prepare safe media storage architecture.

## Build

1. Create:
   - `lib/asset-vault.ts`
   - `components/asset-vault-card.tsx`

2. Add asset types:
   - image
   - audio
   - video
   - document
   - poster
   - receipt

3. Update assets table if needed:
   - storage_path
   - source_type
   - provider_name nullable
   - consent_status
   - review_status

4. UI:
   - show asset vault placeholder
   - upload button disabled or mock-only
   - explain future Supabase Storage gate

## Forbidden

- no real file upload unless explicitly approved
- no external URLs stored directly on scenes
- no provider-generated assets

## Verification

Run:
`npm run build`

## Report

Create:
`PHASE_3D_LOCAL_ASSET_VAULT_REPORT.md`

---

# Phase 4A — Provider Gate Registry

## Goal

Prepare safe provider activation without activating providers.

## Build

1. Create:
   - `lib/provider-registry.ts`
   - `components/provider-gate-card.tsx`

2. Registry must include:
   - OpenAI text
   - Replicate image
   - ElevenLabs voice
   - OpenAI audio
   - Runway video
   - Local models
   - Z-Music Engine

3. Each provider row must define:
   - status: disabled
   - env var required
   - cost warning
   - human approval required
   - receipt required
   - DRP safety required

4. Add provider readiness page or dashboard panel.

## Forbidden

- no SDK install
- no API keys
- no provider calls
- no billing

## Verification

Run:
`npm run build`

## Report

Create:
`PHASE_4A_PROVIDER_GATE_REGISTRY_REPORT.md`

---

# Phase 4B — Benchmark & Similarity Review

## Goal

Create internal benchmark readiness inspired by TrustHub/global benchmarking, without claiming market superiority.

## Build

1. Create:
   - `lib/benchmark-profile.ts`
   - `components/benchmark-readiness-card.tsx`

2. Track:
   - creativity coverage
   - governance coverage
   - provider safety
   - project persistence
   - asset safety
   - export readiness
   - human review visibility

3. Add report:
   - `PHASE_4B_BENCHMARK_READINESS_REPORT.md`

4. No external scraping.
5. No competitor claims.
6. No fake global ranking.

## Verification

Run:
`npm run build`

---

# Future Research Only

Do NOT build yet:

- crypto tokens
- ERC-20 incentives
- smart contracts
- IPFS/Filecoin
- decentralized identity
- homomorphic encryption
- social graph
- recommendations engine
- affiliate marketing
- ads
- public launch mechanics
- external social posting
- automated monetization

These require separate charters, legal review, privacy review, cost review, and AMK approval.

---

# Cursor Continuation Rule

After each phase:

1. Run verification.
2. Write the phase report.
3. If GREEN:
   - commit with phase message
   - push branch
   - continue to next phase only if it does not introduce providers, billing, deployment, crypto, or external publishing

4. If YELLOW or RED:
   - stop
   - do not commit risky changes
   - report findings
   - wait for review

---

# Commit Message Pattern

Use:

`feat(genesis-studio): add Phase 3A project persistence shell`

or

`docs(genesis-studio): add Phase 3A persistence report`

---

# Golden Summary

Genesis Studio is the OMNAI Creative Workstation Core.

It must grow as:

```text
script brain
→ creative DNA
→ storyboard eyes
→ audio heartbeat
→ timeline body
→ asset vault
→ export receipts
→ provider gates
→ future federation
```

Human decides.
Zuno guides.
Cursor builds safely.
Turtle Mode always.
