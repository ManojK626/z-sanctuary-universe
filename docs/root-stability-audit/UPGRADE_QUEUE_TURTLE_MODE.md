# Upgrade Queue — Turtle Mode

**Posture:** Suggest only · **no auto-execute**  
**Date:** 2026-07-01  
**Law:** One domain per branch · `cursor/zsanctuary/*` · Merge Hold

---

## Wave 0 — Complete (this pass)

| Item | Status |
| ---- | ------ |
| ROOT_SYSTEM_STABILITY_REPORT | Done |
| Registry: 6 disk folders added | Done |
| Browser → `path_missing` | Done |
| Aimanity path casing aligned | Done |
| Dual Universe 2 documented | Done |
| Safe hub verifies run | Done |

---

## Wave 1 — Hub hygiene (next safe PRs)

| ID | Task | Domain | Risk |
| -- | ---- | ------ | ---- |
| W1-1 | Refresh `npm run zuno:snapshot` after registry PR merge | Reports | Low |
| W1-2 | Operator run `npm run z:traffic` + `z:car2` (report refresh) | Reports | Low |
| W1-3 | Triage open PRs: strategist #20, alignment, operational posture, **this pass** | GitHub | Low — review only |
| W1-4 | Consolidate duplicate AT Princess registry id | Registry | Low |

**Not in Wave 1:** merge to `main` without AMK.

---

## Wave 2 — Federation bridges (human-gated)

| ID | Task | Operator command | Gate |
| -- | ---- | ---------------- | ---- |
| W2-1 | Emit sanctuary links to members missing `z_sanctuary_link.json` | Organiser: `npm run emit:sanctuary-links` | AMK |
| W2-2 | Control-link dry-run for Z_Labs | Hub: `npm run z:control-links:dry` | AMK |
| W2-3 | Control-link apply (if dry-run ok) | `npm run z:control-links:apply` | AMK |
| W2-4 | Sync EAII workspace if roster changed | Organiser: `npm run build:pc-workspace` | AMK |

---

## Wave 3 — Active learning lanes (no deploy)

| ID | Lane | Task |
| -- | ---- | ---- |
| W3-1 | C — Questra | GO-3 discovery conversations; update discovery docs only |
| W3-2 | B — ZILWA | Private listening; steward notes in `zilwa-living-experiences/` |
| W3-3 | A — Z-PEE | Hold HTML; learning scope docs only |
| W3-4 | ÉirMind | Wait EMK-* decision |

---

## Wave 4 — Per-project upgrades (charter each)

| Project | Upgrade type | Hold until |
| ------- | ------------ | ---------- |
| Z-QUESTRA | Facilitator kit packaging (docs + static) | Commercial discovery complete |
| ZILWA | Static exhibit subset post-listening | Lane B consent receipts |
| Hub dashboard | Read-only public slice design | Cloudflare audit + AMK |
| Z-OMNI / Claude / Aisling | README + runtime manifest alignment | Per-project AMK |
| Roulette / Lottery | Governance narrative + edu framing | Legal/ethics review |
| WorkSphere / External PaaS | Register in monster manifest or archive | Strategist card |

---

## Wave 5 — Infrastructure reality (read-only)

| ID | Task | Output |
| -- | ---- | ------ |
| W5-1 | Cloudflare reality audit | DNS · SSL · tunnels · static assets map |
| W5-2 | Cross-check with `z_cloudflare_contingency_identity.json` | Delta doc only |
| W5-3 | No bind · no deploy | — |

Charter when AMK ready (Operational Posture Priority 5).

---

## Wave 6 — Sacred moves (explicit AMK only)

- Merge strategist PR #20  
- Stripe / payments  
- VAT / company registration  
- Autonomy activation  
- NAS remote admin  
- Production Cloudflare bind  

---

## Suggested branch map (as work proceeds)

```text
cursor/zsanctuary/root-system-stability-pass     ← this pass
cursor/zsanctuary/registry-at-princess-dedup       ← W1-4
cursor/zsanctuary/federation-links-emit-plan       ← W2 docs-only plan first
cursor/zsanctuary/cloudflare-reality-audit         ← W5 read-only
```

---

## Rollback

Revert registry commit or docs-only PR. No runtime was added; disk folders untouched.
