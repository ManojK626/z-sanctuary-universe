# Project Lifeboat — Key Ceremony One-Pager

**Status:** STAGE 1 PROCESS DOC — fill offline · **never commit secrets**  
**Date:** 2026-08-07  
**Authority:** AMK-Goku (human steward)  
**Parents:** [Success Criteria](Z_PROJECT_LIFEBOAT_SUCCESS_CRITERIA.md) · [DR Playbook](Z_DISASTER_RECOVERY_PLAYBOOK.md) · [Architecture](Z_SANCTUARY_PRESERVATION_ARCHITECTURE.md)

**Law:** Encryption keys / repository passwords / cloud API secrets **must not** appear in git, chat logs, dashboards, or this file’s filled copy if that copy is synced to the hub. Keep the **completed** ceremony sheet offline (paper sealed envelope, password manager vault, or air-gapped note — AMK chooses).

---

## Why this exists

Cloud choice is secondary. **Key custody is the silent single point of failure.**

If ciphertext survives and keys are lost → the organism is gone.  
If keys live only in one person’s undocumented memory → future stewards fail criterion 6.

---

## What we protect (classes)

| Class | Examples | Rule |
| --- | --- | --- |
| A — Repo master secret | Restic/Kopia repository password; rclone crypt password | Offline primary + one sealed secondary |
| B — Cloud API credentials | B2 applicationKey · R2 access key (when/if created) | Least privilege · rotatable · not on laptop desktop plaintext |
| C — NAS / Hyper Backup encryption password | When Synology arrives | Separate from Class A if possible |
| D — GitHub / hub access | Existing identity — out of Lifeboat blob scope but steward-critical | MFA on; recovery codes sealed |

---

## Ceremony checklist (AMK completes offline)

### 1. Generate

- [ ] Create Class A secret with a password manager or diceware (long, unique)  
- [ ] Do **not** reuse personal email passwords  
- [ ] Do **not** paste into Cursor chat or commit  

### 2. Dual custody (minimum)

- [ ] **Primary** sealed location: ________________________ (e.g. password manager vault name — not the secret)  
- [ ] **Secondary** sealed location: ________________________ (e.g. paper envelope / safe / trusted offline)  
- [ ] Secondary is physically independent of the PC disk  

### 3. Successor path

- [ ] Designated future steward (name/role): ________________________  
- [ ] How they learn the *location* of secondary (not the secret in email): ________________________  
- [ ] Review date for this ceremony: ________________________ (suggest annual with restore drill)  

### 4. Rotation

- [ ] If cloud API keys ever exist: rotate after suspected compromise or annually  
- [ ] Changing Class A (repo password) requires a **planned** re-encrypt / new repo — never casual  

### 5. Prove without exposing

- [ ] After first encrypted archive exists: unlock on a clean temp path once (restore drill)  
- [ ] Record **pass/fail + date** in Stewardship Certificate / decision log — **not** the secret  

---

## Explicit non-locations (never store Class A/B here)

- Hub git repo · PR descriptions · `data/reports/` · dashboard panels  
- Unencrypted USB left in the PC  
- Phone photos of passwords  
- Shared family chat threads  

---

## Link to Success Criteria

| Criterion | Key ceremony contribution |
| --- | --- |
| 1 Constitution survives hardware loss | Keys not only on that hardware |
| 2 Annual restore | Ceremony unlock is part of the drill |
| 3 Migration without data loss | Same Class A opens repo on new provider |
| 4 No single company SPOF | Keys independent of vendor |
| 6 Future stewards recover | Successor path written |

---

## Standing

```text
Secrets in this markdown ........ NONE (template only)
Accounts created ............... NO
Wave 1B named .................. NO
Next ............................ AMK fills offline copy · then R2/B2 evidence continues
```

---

_One-pager · custody before cloud · evidence before destination_
