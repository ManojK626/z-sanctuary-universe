# Z-PowerShell Operator Boost (Z-PS-BOOST-1)

**Status:** active operator guidance for local Windows / PowerShell use under Turtle Mode.  
**Scope:** hub-root command rhythm, dry-run doorway posture, receipts, and approval-safe shell habits.  
**Non-scope:** approval bypass, profile self-install, secret handling, auto-deploy, auto-merge, NAS mutation, or “one command rules the universe” claims.

---

## 1. Purpose

The **Z-PowerShell Operator Boost** defines how **PowerShell** (or `pwsh`) can be used as a **local operator acceleration lane** for Z-Sanctuary **without** becoming an unsafe automation channel.

It is a **discipline doc**, not a promise of more authority. The boost is:

- faster access to the **real hub root**,
- repeatable **named commands** instead of random ad-hoc shell slices,
- **dry-run first** doorway and workspace opening,
- **receipts** after meaningful sessions so overseer surfaces stay informed.

---

## 2. Core law

```text
PowerShell boost ≠ autonomous operator.
Fast shell rhythm ≠ permission.
Dry-run ≠ deploy.
Named command ≠ sacred move approval.
Hub root ≠ .cursor archive.
AMK-Goku / human gate stays above the shell.
```

If a command touches **deploy, secrets, billing, production binds, cross-repo mutation, or synthetic approval behavior**, this document does **not** authorize it.

---

## 3. Where this fits

| Concern | Canonical source |
| ------- | ---------------- |
| Authority when unsure | [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md) |
| Agent and builder rules | [../AGENTS.md](../AGENTS.md) |
| Visual workstation composition | [Z_OMNI_VISUAL_WORKSTATION_ENGINE_CHARTER.md](Z_OMNI_VISUAL_WORKSTATION_ENGINE_CHARTER.md) |
| Safe VS Code / terminal fallback | [VS_FALLBACK_1_VSCODE_OPERATING_MODE.md](VS_FALLBACK_1_VSCODE_OPERATING_MODE.md) |
| Workspace opening posture | [AMK_WORKSPACE_DOORWAY.md](AMK_WORKSPACE_DOORWAY.md) |
| IDE path proof | [Z_PC_IDE_PATH_HEALTH_CHECK.md](Z_PC_IDE_PATH_HEALTH_CHECK.md) |
| Post-session receipt | [Z_PC_ACTIVATION_AWARENESS.md](Z_PC_ACTIVATION_AWARENESS.md) |
| Approval-boundary research | [Z-AI-VISUAL-OVERLAY-CURSOR-APPROVALS-RESEARCH.md](Z-AI-VISUAL-OVERLAY-CURSOR-APPROVALS-RESEARCH.md) |

This boost complements those docs; it does not replace them.

---

## 4. Operator boost ladder

### Lane A — enter the real hub

Use the real repository root, not archive/cache turf:

```powershell
cd "C:\Cursor Projects Organiser\Z_Sanctuary_Universe"
dir package.json
```

### Lane B — fast read-only confidence

Use the smallest proof that matches intent:

```powershell
npm run verify:md
npm run z:pc:ide-path
npm run amk:doorway:status
```

### Lane C — doorway, but dry-run first

```powershell
powershell -ExecutionPolicy Bypass -File scripts/amk_open_workspace_doors.ps1 -Profile morning -DryRun
npm run amk:doorway:open -- -Profile franed -DryRun
```

Dry-run is the boost because it reduces guesswork **without** silently opening unsafe lanes.

### Lane D — receipts after meaningful work

```powershell
npm run z:pc:activation
```

This keeps hub-side awareness aligned after verification or operator sessions.

---

## 5. Approved command classes

| Class | Typical examples | Posture |
| ----- | ---------------- | ------- |
| Read-only verification | `npm run verify:md`, `npm run z:pc:ide-path`, `npm run amk:doorway:status` | Default safe lane |
| Controlled local opening | `amk:doorway:open -- -Profile ... -DryRun` | Human-run; dry-run first |
| Receipt refresh | `npm run z:pc:activation` | Safe after real work |
| Broader technical proof | `npm run verify:hub:metadata`, `npm run verify:full:technical` | Use when scope truly needs wider evidence |
| Enforcer / release-aligned proof | `npm run verify:ci`, `npm run verify:full` | Only when release governance and human posture allow it |

**Rule:** prefer **named repo commands** over long improvised shell chains so intent stays inspectable.

---

## 6. What the boost must never become

- **Not** a script that auto-clicks Cursor / VS Code approvals.
- **Not** a hidden profile installer that writes PowerShell functions without consent.
- **Not** a place to stash secrets, tokens, or account IDs.
- **Not** a justification for running giant verify bundles when a smaller proof is enough.
- **Not** a vague “AI shell autopilot” that outranks AGENTS, 14 DRP, or human review.

If someone proposes those moves, route back to the authority stack first.

---

## 7. Practical rhythm for operators and AI builders

1. Start in the **hub root**.
2. Use **one named command** at a time.
3. Prefer **dry-run** for openers and workspace helpers.
4. Keep a second surface (dashboard / report / markdown) for awareness, not approval bypass.
5. Leave a **receipt** when the session meaningfully changed system understanding.

This is the “boost”: less confusion, fewer ad-hoc commands, cleaner approvals.

---

## 8. Future posture

Future enhancements may include:

- optional **documented** PowerShell shortcut functions,
- clearer command bundles for doorway / cockpit profiles,
- better report surfacing in dashboards and workstations.

Any such step remains **opt-in, documented, reviewable, and human-gated**.

---

## 9. Revision

| Version | Note |
| ------- | ---- |
| Z-PS-BOOST-1 | Initial hub operator-boost charter for PowerShell posture |
