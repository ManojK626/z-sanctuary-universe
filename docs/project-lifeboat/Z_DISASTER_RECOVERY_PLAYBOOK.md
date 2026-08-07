# Disaster Recovery Playbook — Project Lifeboat

**Initiative:** Z-Sanctuary Preservation & Continuity  
**Phase:** 0 playbook (procedures) — drills execute only under AMK gate  
**Date:** 2026-08-07  

**Does not:** auto-run recovery · auto-deploy · connect NAS without path verify · spend without approval  

---

## 1. Purpose

Step-by-step recovery when stewardship truth is threatened by:

- Hardware loss (PC / drive failure)  
- Accidental deletion  
- Ransomware / destructive malware  
- Cloud-provider failure or lockout  
- Key/password loss (special case — may be unrecoverable)

Success = **restored, verified, certificate-noted** — not “something uploaded once.”

---

## 2. Severity classes

| Class | Example | First move |
| --- | --- | --- |
| S1 | Single file / folder deleted locally | Restore from NAS snapshot or last good backup |
| S2 | PC disk failure; NAS healthy | Rebuild PC · pull from NAS · verify checksums |
| S3 | NAS + PC loss; cloud intact | Restore from off-site encrypted archive |
| S4 | Provider outage / account issue | Fail over to alternate copy (NAS / second cloud / external) |
| S5 | Suspected ransomware | **Isolate** · do not pay from hub automation · restore from clean offline copy |

---

## 3. Universal recovery order

1. **Stop writing** to suspect volumes  
2. **Declare** incident in Steward Decision Log (date · class · scope)  
3. **Identify** newest known-good independent copy  
4. **Verify** checksums / engine integrity **before** promoting  
5. **Restore** to a clean target path  
6. **Spot-check** Constitution · SOTU · key registries · `SHA256MANIFEST`  
7. **Record** Stewardship Certificate / incident receipt  
8. **Rotate** credentials if compromise suspected  
9. **Schedule** post-incident drill within 30 days  

---

## 4. Scenario playbooks

### 4.1 Hardware loss (PC)

1. Do not salvage-write if disk is failing unpredictably  
2. Boot replacement PC · install only needed tools  
3. Restore from **NAS** if available; else from **off-site archive**  
4. Re-clone GitHub hub for living history  
5. Re-run structure / registry verifies when AMK authorizes  
6. Do **not** merge or deploy during recovery unless AMK gates  

### 4.2 Accidental deletion

1. Check recycle / Previous Versions / NAS snapshots first  
2. If gone: restore path from latest encrypted backup  
3. Confirm no silent “re-sync delete” loop from a bad client  

### 4.3 Ransomware / destructive malware

1. Disconnect network if safe for containment  
2. Prefer restore from **immutable / offline** copy (external drive offline, or object-store versioning if enabled)  
3. Never mount suspect volume as the restore *source* of truth  
4. Rebuild OS when integrity unsure  
5. Rotate all cloud keys after clean rebuild  

### 4.4 Cloud-provider failure

1. Confirm outage vs account/credential issue  
2. Switch restore source to NAS or alternate provider  
3. If data stuck at failing provider: open support; keep local copies authoritative  
4. Begin migration rehearsal (rclone/Restic rewrite to new endpoint) under AMK gate  
5. Update provider scores after incident  

### 4.5 Key / password loss

1. Attempt sealed recovery key path (human-only)  
2. If keys are gone and ciphertext-only remains → treat archive as **unrecoverable**  
3. Document loss honestly in certificate registry  
4. Rebuild preservation chain from remaining plaintext sources (GitHub · NAS · paper doctrines)  
5. Immediate key ceremony for all new archives  

---

## 5. Minimum annual drills (Phase 4 posture — start early)

| Drill | Cadence | Pass criteria |
| --- | --- | --- |
| Sample restore | Quarterly | Manifest + one governance doc round-trip |
| Full restore (size-class limited) | Annually | Checksums match; hub boots for read-only verify |
| Provider exit rehearsal | Every 3 years | Copy to alternate endpoint; verify |
| Cost review | Annually | Update 20-year projection |

---

## 6. Communication during incidents

- Single steward authority: **AMK-Goku**  
- Cursor / agents: **observe → suggest → wait** — no silent external connections  
- Do not post secrets, vault contents, or recovery keys into chat logs  

---

## 7. Links

- [Charter](Z_PROJECT_LIFEBOAT_CHARTER.md)  
- [Architecture](Z_SANCTUARY_PRESERVATION_ARCHITECTURE.md)  
- [Wave 1B Decision Guide](Z_WAVE_1B_DECISION_GUIDE.md)  
- [Stewardship Certificate Protocol](../governance/Z_STEWARDSHIP_CERTIFICATE_PROTOCOL.md) (when present on branch)  
- [Backup Wave 1 Runbook](../Z_BACKUP_WAVE1_RUNBOOK.md)  

---

_Playbook · isolate · verify · restore · certificate · rotate · re-drill_
