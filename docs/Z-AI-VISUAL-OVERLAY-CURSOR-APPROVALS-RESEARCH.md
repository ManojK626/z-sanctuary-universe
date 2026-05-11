# Research brief — on-screen HTML overlays, “human-like” AI input, and Cursor Allowlist / Run

**Audience:** Z-Sanctuary operators and AI — aligning **advanced UI ideas** with **real platform limits** and the **14 DRP** compassion anchor ([Z-ULTRA-INSTINCTS-AND-FORMULAS.md](Z-ULTRA-INSTINCTS-AND-FORMULAS.md), [Z-DRP-VERIFIER-CHECKLIST.md](Z-DRP-VERIFIER-CHECKLIST.md)).

**Machine boundary record:** [data/z_visual_automation_boundary.json](../data/z_visual_automation_boundary.json)

---

## 1. What the screenshot is showing (Cursor)

- **Allowlist / Run** on agent terminal proposals and **Approve terminal command** dialogs are **deliberate safety gates**. They exist so **you** (or an explicitly trusted operator) confirm shell access, file reads, and similar actions before execution.
- Cursor does **not** publish a supported API for an extension, webview, or HTML overlay inside the IDE to **programmatically click** “Accept,” “Run,” or “Allowlist” on behalf of the user. Doing so would **defeat the security model** (supply chain, prompt injection, malware).

**Conclusion:** “Super advanced” **full automation** that moves the mouse or fakes clicks **inside Cursor’s approval UI** is **not** something we should implement or rely on in this ecosystem — it conflicts with **consent**, **transparency**, and **non-harm** under the 14 DRP.

---

## 2. Research landscape (honest summary)

| Approach | What it is | Fit for Z-Sanctuary |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **IDE approval UX (Cursor)** | Human-in-the-loop for commands | **Primary** — keep as the real gate for risky actions |
| **VS Code / Cursor extension WebViews** | HTML panels **you** open; can show status, links, run **pre-approved** tasks | **Good** — supervision and clarity, not approval bypass |
| **Cursor Hooks** | Lifecycle events (e.g. logging around agent steps) | **Good** for **telemetry and ritual**, not for auto-approving terminals |
| **RPA / OS automation** (AutoHotkey, UIAutomation, “AI driver” clicking the desktop) | Synthetic mouse/keyboard | **Reject** for Cursor approvals — high abuse risk, breaks operator trust, hard to audit under DRP |
| **“Computer use” APIs** (sandboxed browser/OS VMs run by **cloud** providers) | Model acts in an **isolated** environment | **Interesting for research sandboxes**, not for silently driving **your** host IDE |
| **Your hub dashboard (HTML on 5502, Z-Bridge, shadow workbench)** | **Your** HTML surfaces for **read-only** or **policy-governed** actions | **Best match** — “visual self-organisation” **without** hijacking Cursor chrome |

---

## 3. What we _can_ accomplish “at our best” (aligned with 14 DRP)

These **enhance workflows** without pretending to be a human clicking Cursor buttons:

1. **Rich supervisory overlays in _your_ stack** — Dashboard / Z-Bridge / Creator Manual panels that show **pipeline state**, **AAFRTC** readiness, **registry**, **Zuno**, and **next safe steps** ([MONOREPO_GUIDE.md](../MONOREPO_GUIDE.md), [Z-AAFRTC-OVERSEER-IDE-PIPELINE.md](Z-AAFRTC-OVERSEER-IDE-PIPELINE.md)).
2. **Fewer ad-hoc approvals** — Prefer **named tasks** (`Z: AAFRTC — …`, `verify:ci`) and **slash commands** (`/z-aafrtc`, `/z-full-verify`) so the agent proposes **known-safe** bundles instead of random PowerShell slices.
3. **Self-monitoring ecosystem** — Append-only **Z-Bridge logs**, **guardian reports**, **operator digest** — visibility is “self-organising” **information**, not hidden input injection.
4. **DRP as the boundary layer** — Any future automation must pass: **consent** (operator knows what runs), **transparency** (logs and manifests), **non-harm** (no bypass of security UX), **protection of the innocent** (no undisclosed control of the operator’s machine).

---

## 4. If you want “more visual” without unsafe automation

- **Split layout:** Hub repo window + **browser** to `127.0.0.1:5502` (or Z-Bridge static preview) — human sees **one glance** at ecosystem health while the agent works in the editor.
- **Workbench HTML** (e.g. shadow workbench files): use for **layout and links**, not for driving Cursor’s internal approval APIs (they are not exposed for that).
- **Future (platform-dependent):** If Cursor ever ships **explicit** “approved command profiles” or **enterprise policy** APIs, revisit this doc — still under DRP review before adoption.

---

## 5. Deeper: legitimate levers (reduce friction **without** bypassing approvals)

These are **allowed** paths that feel “smoother” while keeping you in control:

| Lever | Why it helps | DRP note |
| ----------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **VS Code / Cursor Tasks** (`Z: AAFRTC — …`, `npm run aafrtc:ci`) | One explicit run replaces many tiny terminal snippets | Transparent, repeatable, auditable |
| **Slash commands** (`/z-aafrtc`, `/z-full-verify`, `/z-chief`) | Agent and you share the same **named** ritual | Consent — you choose to run the command |
| **Hub dashboard + browser** (`127.0.0.1:5502`) | Second surface for health — no interaction with Cursor’s approval API | Separation of “observe” vs “execute in IDE” |
| **Cursor Hooks** (where available) | **Logging / sidecar** around steps — not auto-approve | Audit trails only; see Cursor hooks docs and any `.cursor/hooks` in this repo — never hook “auto-approve” |
| **Cursor / VS Code settings** | You may tune agent or terminal **defaults** per your comfort | Re-read when Cursor updates; never substitute for vault policy |

**Still out of scope:** anything that **injects input** into Cursor’s approval UI or **hides** who approved.

---

## 6. Future platform watchlist (adopt only after DRP review)

When Cursor or VS Code documents **official** mechanisms (e.g. org policies, explicit allowlists managed by admins), **re-open** this section and check against [data/z_visual_automation_boundary.json](../data/z_visual_automation_boundary.json):

- [ ] **Enterprise / team command policies** — if they appear, document scope and who can edit.
- [ ] **Hooks API expansion** — confirm whether new events touch approvals; default remains **log-only** unless policy says otherwise.
- [ ] **Third-party “AI driver” integrations** — treat as **untrusted** until reviewed with [Z-DRP-VERIFIER-CHECKLIST.md](Z-DRP-VERIFIER-CHECKLIST.md).

**Cadence:** Review quarterly or after any major Cursor upgrade.

---

## 7. Operator checklist (quick)

- [ ] Prefer **hub root** + **AAFRTC** when running full gates — avoids wrong-folder approvals.
- [ ] Keep **dashboard** open in a second window for **read-only** situational awareness.
- [ ] After a heavy agent session, run **`npm run verify:ci`** or **`aafrtc:ci`** when you want a **clean** overseer-aligned snapshot.
- [ ] If friction feels high, **narrow the task** (smaller change, smaller command) instead of seeking auto-click tools.
- [ ] Re-read **one-line policy** (below) before experimenting with any external automation product.

---

## 8. One-line policy

**We do not build or endorse tooling that automates Cursor/VS Code approval dialogs or simulates human input to bypass them.** We **do** build **hub-side** HTML, JSON reports, tasks, and rituals that make approvals **rarer, clearer, and more aligned** with Overseer and Z-EAII.

---

_Z-Brother alignment: clarity over hype — the Sanctuary stays compassionate, auditable, and operator-sovereign._
