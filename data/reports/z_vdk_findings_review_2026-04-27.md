# Z-VDK findings review (manual pass)

**Date:** 2026-04-27
**Source report:** `data/reports/z_vdk_scan_report.json`
**Scan generated (UTC):** 2026-04-27T19:18:00.4449563Z
**Posture:** Read-only review — no files were moved, deleted, quarantined, or changed.

**Label key**

| Label | Meaning |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| **Known safe** | Expected tool, installer, or in-repo script you trust. |
| **Needs hash check** | Unknown or unhashed; compare to a published or archived hash when available. |
| **Needs vendor/source check** | Confirm the binary came from the right vendor and channel. |
| **Move to Extras & Tools** | Safe but stored in a non-ideal place (optional cleanup). |
| **Quarantine candidate** | After review, still suspicious — candidate for a future quarantine _proposal_ only. |
| **False positive** | Heuristic misfire; consider refining scan rules. |

---

## Executive summary: high vs medium

| Tier | Count | Short read |
| ---------- | ----: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **High** | 2 | Both are **installers under `Downloads\`**: `Claude Setup.exe` and `CursorUserSetup-x64-2.6.14.exe`. That matches Phase 1 rules (downloaded executables) — not a malware verdict. |
| **Medium** | 11 | Mix of in-repo PowerShell/`.cmd` (flagged for path rules) and expected items under `Extras & Tools\`. |

### Immediate human attention

**No automatic emergency** is implied by this list. The two **high** items are typical for a workstation: vendor installers in Downloads. **Safe next step:** if you want operational certainty, confirm each file matches what you obtained from the official vendor site (or Windows SmartScreen/Defender history), and move or remove installers after installation if you do not need to keep them. Nothing here is labeled **Quarantine candidate** by default; the unknown binary name `thebcs.exe` in Extras is the one item that most deserves a conscious **source check** before you treat it as long-term trusted.

---

## Per-finding review

### 1 — `martial-platform\log_summary.ps1`

- **Path:** `C:\Cursor Projects Organiser\ZSanctuary_Universe\martial-platform\log_summary.ps1`
- **Risk:** medium
- **Reason (scan):** PowerShell script outside trusted `scripts\` or `.github\workflows\` trees.
- **SHA256:** `a04b9805e75ea129c8e470d4b60001a7e80e32ceb13b4857db73532f6564d479`
- **Suggested review label:** **False positive** (path rule) _or_ **Known safe** if you authored/committed this for martial-platform.
- **Safe next action:** Open the script and confirm it only does what you expect (read logs, no unexpected network or credential use). If it is first-party, optionally document it or add a future `martial-platform\scripts\` convention and refine Z-VDK trusted paths in a later release.

### 2 — `martial-platform\nas_backup.ps1`

- **Path:** `C:\Cursor Projects Organiser\ZSanctuary_Universe\martial-platform\nas_backup.ps1`
- **Risk:** medium
- **Reason (scan):** PowerShell outside trusted `scripts\` / `.github\workflows\`.
- **SHA256:** `1334adccd1751bbd056258d063afd93dec475cdda17193c8f7e5691ae9f93bd1`
- **Suggested review label:** **Known safe** (if this is your NAS backup script) _or_ **False positive** (heuristic only).
- **Safe next action:** Skim for backup targets and credentials handling; run only in environments you trust. No quarantine based on heuristics alone.

### 3 — `martial-platform\schedule_backup.ps1`

- **Path:** `C:\Cursor Projects Organiser\ZSanctuary_Universe\martial-platform\schedule_backup.ps1`
- **Risk:** medium
- **Reason (scan):** PowerShell outside trusted `scripts\` / `.github\workflows\`.
- **SHA256:** `ba0a9426af29f9a39567fc5674ddfdcf5d0f85792984d2b764bc1a8aca449c88`
- **Suggested review label:** Same as (2) — **Known safe** _or_ **False positive** (path rule).
- **Safe next action:** Pair-review with (2); confirm task scheduler or cron alignment matches your intent.

### 4 — `ops\zps\profile_snippet.ps1`

- **Path:** `C:\Cursor Projects Organiser\ZSanctuary_Universe\ops\zps\profile_snippet.ps1`
- **Risk:** medium
- **Reason (scan):** PowerShell outside trusted `scripts\` / `.github\workflows\`.
- **SHA256:** `d5df39deb6ec13a36947742a5e397689a7282e73e15421da37ca9119a502a7db`
- **Suggested review label:** **False positive** (ZPS ops path) _or_ **Known safe** if this is your shell profile fragment.
- **Safe next action:** Read once; if it only adjusts PS profile behavior as intended, no action.

### 5 — `ZSanctuary_Labs\sync_lab_registry.cmd`

- **Path:** `C:\Cursor Projects Organiser\ZSanctuary_Universe\ZSanctuary_Labs\sync_lab_registry.cmd`
- **Risk:** medium
- **Reason (scan):** `.cmd` under repo.
- **SHA256:** `1984edab2da53bac1d7d499dfd0f431f691ece228c54ec8575509bcfa4c39c8e`
- **Suggested review label:** **Known safe** (Labs tooling) _or_ **False positive** (extension-only rule on known lab batch).
- **Safe next action:** Open file; if it only syncs the lab registry as designed, mark mentally as trusted.

### 6 — `ZSanctuary_Labs\workspaces\launch_4_windows.cmd`

- **Path:** `C:\Cursor Projects Organiser\ZSanctuary_Universe\ZSanctuary_Labs\workspaces\launch_4_windows.cmd`
- **Risk:** medium
- **Reason (scan):** `.cmd` under scan root.
- **SHA256:** `593ebc5bc8ac353006f9da3069346765fea910cb121f18189121f4e85d9bd35e`
- **Suggested review label:** **Known safe** (lab launcher) _or_ **False positive**.
- **Safe next action:** Only run in dev contexts; confirm it launches the intended four windows and nothing else.

### 7 — `ZSanctuary_Labs\workspaces\launch_4_windows.ps1`

- **Path:** `C:\Cursor Projects Organiser\ZSanctuary_Universe\ZSanctuary_Labs\workspaces\launch_4_windows.ps1`
- **Risk:** medium
- **Reason (scan):** PowerShell outside `scripts\` / `.github\workflows\`.
- **SHA256:** `a36186d623186600f037f9d62c387877f93807637daa111f7b48eaf65c59d2be`
- **Suggested review label:** **False positive** _or_ **Known safe** (sibling to the `.cmd`).
- **Safe next action:** Read alongside (6); keep in repo if it matches your multi-window dev workflow.

### 8 — `Z_Labs\uvx.cmd`

- **Path:** `C:\Cursor Projects Organiser\ZSanctuary_Universe\Z_Labs\uvx.cmd`
- **Risk:** medium
- **Reason (scan):** `.cmd` under scan root.
- **SHA256:** `312f480c7535770d29beeab810fb4bad2910fe386b9a09af611971dbe753670d`
- **Suggested review label:** **Known safe** (likely uv/uvx wrapper) _or_ **Needs vendor/source check** if you do not recognize how it was added.
- **Safe next action:** Open and verify it only invokes the expected `uv`/`uvx` entrypoint on your machine.

### 9 — `Z_Labs\workspaces\launch_4_windows.cmd`

- **Path:** `C:\Cursor Projects Organiser\ZSanctuary_Universe\Z_Labs\workspaces\launch_4_windows.cmd`
- **Risk:** medium
- **Reason (scan):** `.cmd` under scan root.
- **SHA256:** `9341f39b9935c9bbfad4dc71e45be63d00ad88ed908e93970b3457b1a5fb08c6`
- **Suggested review label:** **Known safe** (duplicate of Labs pattern under `Z_Labs`) _or_ **False positive**.
- **Safe next action:** If byte-identical to the `ZSanctuary_Labs` copy, treat as the same review as (6).

### 10 — `Extras & Tools\thebcs.exe`

- **Path:** `C:\Cursor Projects Organiser\Extras & Tools\thebcs.exe`
- **Risk:** medium
- **Reason (scan):** Binary in tools sink; “verify origin.”
- **SHA256:** `59426caedeeb08c34f1a23daddc2294891932b4d92f6218224b6ae63df280ad1`
- **Suggested review label:** **Needs vendor/source check** (highest follow-up in this set if the name is unfamiliar).
- **Safe next action:** Do not run until you can tie it to a project you trust; compare hash with vendor docs if one exists, or move aside until explained. _Not_ a recommendation to quarantine from this file alone.

### 11 — `Extras & Tools\scripts\build-all-projects.ps1`

- **Path:** `C:\Cursor Projects Organiser\Extras & Tools\scripts\build-all-projects.ps1`
- **Risk:** medium
- **Reason (scan):** `.ps1` under Extras (worded as “suspicious” by extension in another root context).
- **SHA256:** `87b4e5ea36bb4638ab8c7fe81dc05f1a0c3fb7e3b4851f4c0d99439bb91388e8`
- **Suggested review label:** **Known safe** (expected helper under Extras) _or_ **False positive** (location is the intended tools tree).
- **Safe next action:** Skim the script; if it only builds your listed projects, treat as first-party build automation.

### 12 — `Downloads\Claude Setup.exe`

- **Path:** `C:\Users\manoj\Downloads\Claude Setup.exe`
- **Risk:** high
- **Reason (scan):** Executable/installer in Downloads.
- **SHA256:** `bb3299c619619b74d3b9aa7491a1edc3e59c40cf04043baa5cc9a64070151e9f`
- **Suggested review label:** **Known safe** (expected Anthropic Claude Desktop installer) _or_ **Needs vendor/source check** (confirm you downloaded it from the official source).
- **Safe next action:** If installed, you can delete the installer if you do not need to keep it, or file it in a personal archive with a note of origin. **Immediate attention:** only if you do not remember downloading it; otherwise low urgency.

### 13 — `Downloads\CursorUserSetup-x64-2.6.14.exe`

- **Path:** `C:\Users\manoj\Downloads\CursorUserSetup-x64-2.6.14.exe`
- **Risk:** high
- **Reason (scan):** Installer in Downloads; large file; **SHA256 not recorded** in scan (over 50 MB cap in Phase 1).
- **SHA256:** _(not captured in report — over hash cap)_
- **Suggested review label:** **Known safe** (expected Cursor setup) _or_ **Needs hash check** (compare to Cursor/official publish if you require proof).
- **Safe next action:** `Get-FileHash` locally if you need a stored hash for inventory; after install, remove from Downloads if policy prefers a clean download folder. **Immediate attention:** same as (12) — confirm it matches a deliberate download.

---

## Totals and labels at a glance

- **Quarantine candidate:** 0 (none recommended from this read-only pass).
- **Needs vendor/source check:** at least `thebcs.exe`; optional for installers if you want full provenance.
- **False positive (rule refinement):** several **medium** items are in-repo or Extras tools — good candidates to tune trusted subtrees in a later Z-VDK rule pass.

_Detect first. Preserve proof. Review calmly. Quarantine only with consent. Delete never by default._

---

## Appendix — `thebcs.exe` (finding 10) walkthrough

**On-disk facts (from Phase 1 scan):**

- **Full path:** `C:\Cursor Projects Organiser\Extras & Tools\thebcs.exe`
- **SHA256:** `59426caedeeb08c34f1a23daddc2294891932b4d92f6218224b6ae63df280ad1`
- **Why Z-VDK flagged it:** any `.exe` under Extras is listed so you can **confirm it matches a tool you intentionally keep**; medium risk is _attention_, not a malware verdict.

**Calm review steps (read-only; pick what you need):**

1. **Memory / intent** — Do you remember placing this file? Which project or vendor does `thebcs` refer to? If the name is unfamiliar, treat as **untrusted until linked** to a purpose you trust.
2. **Properties** — In Explorer: file → Properties → _Details_ / _Digital Signatures_ (if present). Unsigned or unknown publisher is common for small tools; it means you should still **tie the file to a source** you accept.
3. **PowerShell (no execution of the .exe as an app from this list):** optional signature read: `Get-AuthenticodeSignature -FilePath 'C:\Cursor Projects Organiser\Extras & Tools\thebcs.exe'` — note _Status_ and _SignerCertificate_; “NotSigned” is data, not a final judgment.
4. **Defender history** (optional) — One signal only: see if the path was ever listed in Protection history; not a replacement for your review.
5. **Vendor / web** — If you can name the product, compare to the publisher’s download or published hash, or re-download from the same official page and compare hashes. If you cannot name a safe source, keep the file **not treated as long-term trusted** until you can.
6. **If you confirm it is your tool** — Optional: add a one-line note in the table below: **Known safe** + source or project name.
7. **If you do not need it** — Remove or move aside **manually** when _you_ choose. Z-VDK Phase 1 does not delete or quarantine by itself.

**Operator resolution (fill in when you decide):**

| Date | Verdict | One-line note (optional) |
| --------- | --------------------------------------------------------------- | ------------------------ |
| _pending_ | _Needs vendor/source check / Known safe / Not needed (handled)_ | _—_ |
