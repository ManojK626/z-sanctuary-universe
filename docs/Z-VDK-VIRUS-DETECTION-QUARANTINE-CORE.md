# Z-VDK — Z-Virus Detection & Quarantine Core

**Official name:** Z-Virus Detection & Quarantine Core (Z-VDK).
**Not** the public technical phrase “Virus Detector Killer” — the spirit may live in internal language only; outward posture is **detect, preserve evidence, isolate with consent**.

## Role in the stack

Z-VDK is a **defensive immune system**: advisory-first, receipt-oriented, aligned with existing Sanctuary layers (storage map, Guardian/mini-bots, Vegeta Defense Ring, Z-Proof/Merkle-style receipts, human gates, Zuno/QOSMEI summaries).

**Motto:** Detect first. Preserve proof. Quarantine only with consent. Delete never by default.

## Phase 1 (current) — READ ONLY

Phase 1 is **observation only**:

- Scan configured roots (hub repo, PC-root “Extras & Tools” if present, user Downloads — shallow).
- Flag suspicious executable/script extensions with **transparent** reasons.
- Compute **SHA256** when file size is within a safe cap (large binaries: hash omitted, noted in reason).
- **Risk** tiers: `low` | `medium` | `high` | `critical`.
- Write `data/reports/z_vdk_scan_report.json` and (via `npm run vdk:report`) `data/reports/z_vdk_scan_report.md`.

### Phase 1 does **not**

- Delete, move, or quarantine files automatically
- Kill processes
- Edit the registry
- Change Windows Defender settings
- Upload files
- “Clean” system folders (Windows, Program Files, etc. are not scan roots)
- Modify release gates or execution enforcer policy

**Defender remains the antivirus engine.** Z-VDK is the Sanctuary **observer, classifier, and receipt layer** — not a replacement AV.

## 14-gate alignment (design)

| Gate | Z-VDK Phase 1 |
| --------------------------------- | --------------------------------------------------------------- |
| 1. Detect | Extension + path heuristics |
| 2. Classify | Risk + reason string |
| 3. Verify | SHA256 where safe |
| 4–6. Isolate / preserve / explain | Report only; no isolate in Phase 1 |
| 7. Cross-check | Allowlist-style skips (e.g. `scripts\` `.ps1`) |
| 8. Reduce harm | No destructive actions |
| 9. Human gate | All future quarantine/delete behind explicit confirm (Phase 2+) |
| 10–14 | Rollback / log / report / learn / release — phased |

## Scripts & data

| Path | Purpose |
| ------------------------------------- | ------------------------------------------------------- |
| `scripts/powershell/z_vdk_scan.ps1` | Read-only scan → JSON report |
| `scripts/powershell/z_vdk_report.ps1` | JSON → markdown summary |
| `data/reports/z_vdk_scan_report.json` | Machine-readable findings |
| `data/reports/z_vdk_scan_report.md` | Human-readable summary |
| `data/quarantine/` | Reserved for Phase 2+ (proposal + confirmed moves only) |

## npm

- `npm run vdk:scan` — run scan
- `npm run vdk:report` — refresh markdown from JSON

## Phase 2+ (not implemented here)

- Quarantine **proposal** JSON, `--confirm`, move to `data/quarantine/` with receipt and restore metadata — **still no permanent delete by default.**
- Optional **read-only** Defender orchestration (`Get-MpComputerStatus`, `Get-MpThreat`, optional `Start-MpScan`) — never disable or replace Defender.

---

_Z-Sanctuary — powerful, compassionate, controlled._
