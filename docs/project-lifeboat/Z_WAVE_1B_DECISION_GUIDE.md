# Wave 1B Decision Guide — Independent Destination

**Initiative:** Project Lifeboat  
**Ops parent:** [Z_BACKUP_WAVE1_RUNBOOK.md](../Z_BACKUP_WAVE1_RUNBOOK.md)  
**Research parents:** [Provider Matrix](Z_LIFEBOAT_PROVIDER_COMPARISON_MATRIX.md) · [Cost Projection](Z_LIFEBOAT_20_YEAR_COST_PROJECTION.md)  
**Date:** 2026-08-07  

**Law:** AMK **names** the destination **only after Phase 0 evidence earns it**. Cursor may prepare checklists — **must not** invent a path, create accounts, or upload without explicit approval. Naming D1/D2/D3 “because it is available” is out of posture.

North Star: [Z_PROJECT_LIFEBOAT_SUCCESS_CRITERIA.md](Z_PROJECT_LIFEBOAT_SUCCESS_CRITERIA.md)

---

## 1. What Wave 1B must prove

Completeness (from stewardship certificate culture):

1. Checksums match  
2. Store is **independent** of the staging PC drive alone  
3. Restore test succeeds (sample minimum; full preferred for prototype)  
4. Stewardship Certificate Registry entry updated  

Until then: do **not** claim Preservation-complete.

---

## 2. Destination classes (from Wave 1 runbook)

| ID | Class | Lifeboat Phase 0 preference |
| --- | --- | --- |
| D1 | Cloud encrypted archive | Tier S shortlist: **B2** or **R2** (or Tier A if AMK prefers) |
| D2 | External drive | Valid interim if path named; plan cloud/NAS follow-on |
| D3 | Private git remote hygiene | Complements GitHub layer — **not** bulk encrypted archive alone |

---

## 3. Pre-decision checklist (research → choose)

- [ ] Re-read [Charter principles](Z_PROJECT_LIFEBOAT_CHARTER.md)  
- [ ] Re-open provider pricing **same day** as decision  
- [ ] Choose steady-state size (S/M/L from cost doc)  
- [ ] Confirm client tool: Restic / Kopia / rclone crypt / other  
- [ ] Confirm MFA available on provider account  
- [ ] Confirm Synology path later (Hyper Backup or rclone) — or accept “NAS later”  
- [ ] Confirm exit story (S3-compatible export / second provider)  
- [ ] Confirm **no secrets** in hub git for keys  
- [ ] Write chosen path/class in Steward Decision Log  

---

## 4. Selection scorecard (AMK fills at gate)

Score each shortlisted option 0–10; pick highest that also passes hard gates.

| Criterion | Option A ______ | Option B ______ |
| --- | --- | --- |
| 20-year cost comfort | | |
| Restore confidence | | |
| Vendor independence | | |
| Synology readiness | | |
| Governance / receipts | | |
| Personal trust / UX | | |
| **Hard gate: encryption before upload** | pass/fail | pass/fail |
| **Hard gate: independent of PC disk** | pass/fail | pass/fail |

Hard-gate fail ⇒ disqualified regardless of composite score.

---

## 5. Validation sequence (after AMK names destination)

1. **Account & MFA** (human) — create only after naming  
2. **Bucket / folder** with least privilege keys  
3. **Encrypt locally** — produce archive from Wave 1A package or approved subset  
4. **Upload** to named destination  
5. **Recompute SHA-256** vs `SHA256MANIFEST.txt` (or engine-native check)  
6. **Restore** to a clean temp path · open at least one governance doc + manifest  
7. **Certificate** — update `data/z_stewardship_certificate_registry.json` toward `VERIFIED_OFF_PC` / `COMPLETE`  
8. **STOP on any mismatch** — failure certificate; do not continue  

---

## 6. Decision record template

```text
Date:
Steward: AMK-Goku
Destination class: D1 / D2 / D3
Provider or path: (named by AMK — no invention)
Tooling: Restic | Kopia | rclone crypt | other
Size class: S | M | L | XL
Why this choice (3 bullets):
Exit plan if provider fails:
Next drill date:
```

Paste into [Z_SANCTUARY_STEWARD_DECISION_LOG.md](../Z_SANCTUARY_STEWARD_DECISION_LOG.md) when ready.

---

## 7. Explicit non-actions for Cursor

- Do not create Cloudflare R2 buckets / API tokens  
- Do not create Backblaze accounts  
- Do not copy Wave 1A packages off-PC without AMK path  
- Do not claim Wave 1B complete from research alone  

---

## 8. After Wave 1B

1. Prefer foundation commit/PR hygiene only when AMK schedules it  
2. Wave 2 inventories stay blocked until Wave 1B certificate maturity preference met  
3. Advance Lifeboat Phase 1→2 officially in a sealed receipt  

---

_Guide · name the path · encrypt · upload · checksum · restore · certificate_
