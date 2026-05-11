# Z-OMNAI media letter gate (Z-OMNAI-LETTER-GATE-1)

## Purpose

The **media letter gate** turns options **A–E** into **tracked, read-only readiness lanes** so AMK can see which letter is suggested next, which is **BLUE** (human commercial lane), which is **YELLOW** (missing input), and which is **GOLD** (safe hold) — without the hub **executing** recommendations or overriding AMK.

| Letter | Lane |
| ---- | ---- |
| **A** | Master media concept seed (`BUILD-2A`) |
| **B** | Marketing campaign bundle (public or commercial claims) |
| **C** | Tool or dashboard prototype bundle (internal-first) |
| **D** | Dashboard deep-link or visibility (low risk when scoped) |
| **E** | Hold baseline (rest) |

## How it works

1. **`data/z_omnai_media_letter_gate.json`** — Baseline titles, forbidden actions, and doc links per letter.
2. **`npm run z:omnai:letter-gate`** — Reads the gate file, the **master media seed**, and existing **reports**, detects **`[AMK:`** placeholders in the seed, and writes **`data/reports/z_omnai_media_letter_gate_report.{json,md}`**.
3. **AMK** — Chooses whether to follow the recommendation; **indicator ≠ permission** (see [AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md](../AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md)).

## Auto-lane vs AMK

**Auto-lane may:** read JSON, read reports, detect placeholders, emit readiness reports, recommend a next letter.

**Auto-lane may not:** choose public release, generate media, call AI providers, publish marketing, set prices, deploy, bridge services, merge, or override AMK.

## Placeholder detection

If **`data/z_omnai_master_media_concept_seed.json`** still contains the substring **`[AMK:`**, letter **A** is typically **YELLOW** — fill fields, run **`npm run z:omnai:media-seed`**, then re-run **`npm run z:omnai:letter-gate`**.

## Colour logic (summary)

| Signal | Meaning |
| ---- | ---- |
| **GREEN** | Safe internal next step |
| **YELLOW** | Missing inputs or minor gap |
| **BLUE** | Human decision for public or commercial lane |
| **RED** | Blocked — fix before moving |
| **GOLD** | Sealed hold baseline (letter **E**) |
| **PURPLE** | Future-gated (not used in default gate file) |

## Law

- Letter recommendation ≠ execution.
- Auto readiness ≠ permission.
- **GREEN** internal ≠ public release.
- **BLUE** requires AMK or human.
- **RED** blocks movement.
- AMK-Goku owns sacred moves.

## Commands

```bash
npm run z:omnai:media-seed
npm run z:omnai:letter-gate
```

See [PHASE_Z_OMNAI_LETTER_GATE_1_GREEN_RECEIPT.md](./PHASE_Z_OMNAI_LETTER_GATE_1_GREEN_RECEIPT.md) for acceptance and rollback.
