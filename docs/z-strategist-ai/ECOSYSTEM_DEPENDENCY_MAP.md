# Ecosystem Dependency Map — Z-Strategist AI

**Posture:** Read-only dependency visibility · not execution graph  
**Date:** 2026-06-11 · Wave 2

## Legend

| Edge | Meaning |
| ---- | ------- |
| **→** | Downstream depends on upstream readiness |
| **EDR** | Ecosystem Dependency Readiness indicator on card |
| Signal | GREEN / AMBER / HOLD / UNKNOWN (from Wave 1B + Wave 2) |

---

## Control root (upstream of all)

```text
Z-Sanctuary Universe Core (AMBER, EDR GREEN as root)
    │
    ├── ZILWA Living Experiences (HOLD overall, EDR AMBER)
    │       ├── Z-Tourism (AMBER) — doctrine via ZILWA; no standalone pack
    │       └── Z-Academy workshops pattern (AMBER) — static Master of Life
    │
    ├── Z-Nexus Engine (AMBER, EDR GREEN)
    │       ├── Z-CIVD (AMBER) — life-first ethics frame
    │       └── Z-EarthConscience / Z-PEE (AMBER) — environmental ethics metadata
    │
    ├── Compassion Wellness (AMBER) — scattered stubs; high legal sensitivity if advanced
    │
    └── MirrorSoul (AMBER) — reflection lane; depends on core governance
```

---

## Dependency matrix (Wave 2)

| Downstream | Upstream dependencies | EDR | Blocks Stage 3 if upstream… |
| ---------- | --------------------- | --- | --------------------------- |
| Z-Tourism | ZILWA 2B listening, Core verify | AMBER | ZILWA HOLD without AMK scope cut |
| ZILWA | Core, steward consent doctrine | AMBER | Core RED deploy; premature public claims |
| Z-Nexus mock UI | Core, CIVD charter, data ethics pack | GREEN→AMBER | Ethics pack drift; live API charter |
| Z-CIVD exhibits | Nexus, Core | AMBER | Missing privacy note for stories |
| Z-EarthConscience | ZILWA env exhibits, Nexus, Core | AMBER | Unverified impact claims |
| Z-Academy | Core, build gate, ZILWA static pattern | AMBER | Youth content without child-safety charter |
| Compassion Wellness | Core, Monster recovery family, build gate | AMBER | Health/coaching blur without legal pass |
| MirrorSoul | Core, vault policy | AMBER | Identity-adjacent sensing charter |
| Core (hub) | — (root) | GREEN | — |

---

## Critical paths (honest)

### Path A — Low-risk public **awareness** pilot

`Core (stable)` → `Z-EarthConscience / Z-PEE` **or** `Z-Nexus static mock` → Stage 3 **static** exhibit only

- No payments, no accounts, no subscriptions
- Privacy naturally lower (education / ethics framing)
- **Does not require** ZILWA merge or tourism registration

### Path B — Cultural / tourism pilot (higher gate)

`Core` → `ZILWA 2B listening complete` → `Z-Tourism standalone doctrine` → Mauritius field evidence → Stage 3

- Longer human path; steward and worker consent central
- **Not** the fastest technical path

### Path C — High sensitivity (slow by design)

`Compassion Wellness` → unified charter → legal review → explicit non-clinical boundaries

- **Do not rush** — Legal Review AMBER is intentional

---

## Broken-reference audit (Wave 2)

| Reference | Status (Wave 2) |
| --------- | --------------- |
| `docs/z-civd/Z_CIVD_CHARTER.md` | **Restored** — was RED; now on disk |
| `docs/z-tourism/` | Still missing — Z-Tourism Doc AMBER |
| `docs/compassion-wellness/` | Still missing — Compassion Doc AMBER |
| `docs/z-academy/` | Still missing — Academy Doc AMBER |

No other **RED** documentation signals on strategist cards after CIVD restore.

---

## UNKNOWN reduction targets (Wave 2)

| Project | UNKNOWN remaining | Wave 2 action |
| ------- | ----------------- | ------------- |
| All five 1B cards + CIVD | Technical Readiness | Label **UNKNOWN (Stage 0–1 expected)** — not a governance failure |
| Z-CIVD | Privacy | **→ AMBER** after charter privacy section |
| Compassion Wellness | Legal Review | Stays **AMBER** until umbrella charter |

---

## Rule

**EDR AMBER or HOLD upstream** means downstream cannot mark deployment-ready without AMK documented decoupling. See [AMK_GOKU_INDICATORS.md](AMK_GOKU_INDICATORS.md).
