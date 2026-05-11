# Z-UCCR — Universal Canvas Panel Requirements

**Purpose:** Specify **future** panels for the Universal Canvas. Each panel is a **planned surface**, not an implementation ticket. Read with [GUARDIAN_PANEL_REQUIREMENTS.md](GUARDIAN_PANEL_REQUIREMENTS.md) and [ETHICS_AND_CONSENT_GATES.md](ETHICS_AND_CONSENT_GATES.md).

**Template fields (repeat per panel):**

- **Purpose**
- **Data source** (reports, registry, sanctioned JSON—no Vault raw)
- **Allowed display**
- **Forbidden display**
- **Operator actions** (explicit only; dry-run mindset)
- **Consent requirements**
- **Phase requirement** (Z-UCCR-\*)
- **Visual state** (calm/storm/high-contrast—see [VISUAL_EFFECTS_AND_THEMES.md](VISUAL_EFFECTS_AND_THEMES.md))

---

## System Status Panel

- **Purpose:** One glance at hub health slices (structure, indicators, guardian summary pointers).
- **Data source:** Existing reports under `data/reports/`; `system-status.json` when present; verifier outputs—not secrets.
- **Allowed display:** Green/amber/hold summaries, timestamps, pointers to Markdown reports.
- **Forbidden display:** Narrated “everything is fine” without evidence; Vault paths; credentials.
- **Operator actions:** Open report; run sanctioned verify task names (copy-only until launcher exists).
- **Consent:** Read-only until Z-UCCR-2+; no auto-fix from panel.
- **Phase:** Z-UCCR-2 (read-only data).
- **Visual state:** Default calm; amber uses warm outline, not alarm sound by default.

---

## Trust Portal Panel

- **Purpose:** Consolidated **trust receipts** pointers (sentinel, leak audit aliases, guardian).
- **Data source:** `z_security_sentinel.json`, hygiene audits, guardian report JSON—summaries only.
- **Allowed display:** Status chips, links to sanctioned docs.
- **Forbidden display:** Detailed exploit steps; undisclosed vuln playbooks on screen.
- **Operator actions:** Open trust doc; escalate to humans.
- **Consent:** Operational read; edits off-panel.
- **Phase:** Z-UCCR-4+ for richer visualization.
- **Visual state:** Trust colors = posture, not marketing “verified” badges.

---

## Z-Trace / Audit Panel

- **Purpose:** Traceability of **who ran what verifier when**—evidence posture, not blame theater.
- **Data source:** Report metadata, receipts, optionally bridge logs if policy-approved.
- **Allowed display:** Run IDs, task names, pass/fail, links.
- **Forbidden display:** Raw PII; full chat transcripts; Vault excerpts.
- **Operator actions:** Open receipt; draft operator note—no automatic ticket creation.
- **Consent:** Sensitive environments may hide this panel until approved.
- **Phase:** Z-UCCR-4+.
- **Visual state:** Plain focus compatible.

---

## Guardian Panel

- **Purpose:** Operational + symbolic guardian posture (see dedicated doc).
- **Data source:** Governance docs, sanctioned guardian chips, STOP_GATE enums if defined in reports.

---

## AI Tower Panel

- **Purpose:** Spatial map of AI Tower / colony posture as **observe-only** metaphors plus live registry pointers.
- **Data source:** Master register excerpts, blueprint docs, module manifest summaries.
- **Allowed display:** Node labels “planned / staging / prod-adjacent”; links to blueprint.
- **Forbidden display:** Claims of live model weights or API keys; fake “tower online” ping.
- **Operator actions:** Open AI Tower blueprint; registry sync reminders as text-only.
- **Consent:** Expansion of autonomy requires Ethics gate.
- **Phase:** Z-UCCR-2–3.

---

## MiniAI Bot Panel

- **Purpose:** Show **routing doctrine**: which bot handles what signal (see [OPERATOR_WORKFLOW.md](OPERATOR_WORKFLOW.md)).
- **Data source:** Docs and manifest summaries—no unsolicited bot chatter.
- **Allowed display:** Read-only ladders: input → allowed output → escalation.
- **Forbidden display:** Buttons that SSH, commit, or post.
- **Operator actions:** Jump to doctrine markdown.
- **Phase:** Z-UCCR-5 for controlled routing UI.

---

## Product Readiness Panel

- **Purpose:** Sovereign product JSON / octave flags as **planning readiness**, not storefront.
- **Data source:** `z_sovereign_products_registry.json` and related lite panels’ data contracts.
- **Allowed display:** Status fields already in registry; disclaimers prominent.
- **Forbidden display:** Checkout, pricing activation, outbound marketing send.
- **Operator actions:** Link to Sovereign Lite panel/docs.
- **Phase:** Z-UCCR-2+.

---

## Sandbox / NAS Readiness Panel

- **Purpose:** Show **sandbox phase** and NAS posture where Folder Manager reports exist—not remote admin actions.
- **Data source:** `z_folder_manager_status.json`, phase guard artifacts, sanitized NAS checklist docs.
- **Allowed display:** “Hold / staged / cleared” summaries.
- **Forbidden display:** Credential fields; unrestricted remote shell.
- **Operator actions:** Follow runbook links only.
- **Phase:** Z-UCCR-4+.

---

## Reports Vault Panel

- **Purpose:** Navigator for **canonical report paths** and vault manifest pointers (not raw vault payloads).
- **Data source:** `reports_vault` refresh outputs and INDEX-style lists.
- **Allowed display:** File names, freshness, anchors to human-readable manifests.
- **Forbidden display:** Streaming entire sealed vault blobs into canvas.
- **Operator actions:** Open report in IDE/browser.
- **Phase:** Z-UCCR-2.

---

## Ethics Gate Panel

- **Purpose:** Surface **ethical posture** snippets and pending human approvals—not auto-ethical judgment.
- **Data source:** DRP/ethics excerpts from sanctioned docs; release control JSON summaries if present.
- **Allowed display:** Checklist state; reminders.
- **Forbidden display:** Automated “ethics PASSED” that bypasses Overseer/release gates.
- **Operator actions:** Open consent gate doc ([ETHICS_AND_CONSENT_GATES.md](ETHICS_AND_CONSENT_GATES.md)).
- **Phase:** Z-UCCR-4+.

---

## Creative Orchestra Panel

- **Purpose:** Entrance to **[Z-CREATOR-ORCHESTRA.md](../Z-CREATOR-ORCHESTRA.md)**—draft workflows, approvals, labeling.
- **Data source:** Orchestra doctrine; optional future brief JSON (read-only).
- **Allowed display:** Links and “draft discipline” summaries.
- **Forbidden display:** Auto-publish to streaming/social/CDN.

---

## Z-OCTAVE Product Panel

- **Purpose:** Link Octave docs/products with **movement and comfort posture** summaries.
- **Data source:** `docs/octave/`, products README, procurement checklist pointers.
- **Allowed display:** Roadmap excerpts; disclaimers (“not medical”).
- **Forbidden display:** Prescription UX; dosing claims beyond docs.

---

## Z-Gadget Mirrors Panel

- **Purpose:** Mirrors/gadget guardian posture visualization (observe-only)—align with existing mirror scripts where applicable.
- **Data source:** Sanctioned gadget guard reports (`z_gadget_mirrors` family when present).

---

## Formula / GGAESP Panel

- **Purpose:** **Conceptual** map of formulas and GGAESP memory posture—not formula execution playground.
- **Data source:** `Z-ULTRA`, GGAESP panel HTML references, capsules policy.
- **Allowed display:** “Where formulas live”; links to capsules append rules.
- **Forbidden display:** Automated memory append from canvas taps.

---

## Z-ANIMA Emotional Layer Panel

- **Purpose:** Reflect **ANIMA CORE** compassionate themes for operators (no fake animal cognition claims).
- **Data source:** [Z-ANIMA-CORE-HUMAN-ANIMAL-CONNECTION.md](../Z-ANIMA-CORE-HUMAN-ANIMAL-CONNECTION.md).

---

## Connection Tree Panel

- **Purpose:** Philosophy + Lite mock lineage—presence without surveillance ([Z-CONNECTION-TREE-PHILOSOPHY.md](../Z-CONNECTION-TREE-PHILOSOPHY.md)).

---

## Founder Command Panel

- **Purpose:** **Commander-aligned** capsule: today’s posture, receipts, next calm step—mirrors Commander discipline, not shadow authority.
- **Data source:** Commander-adjacent reports; Zuno digest lines when approved for display.
- **Allowed display:** AMK-forward guidance text already in sanctioned UI copy patterns.
- **Forbidden display:** Simulated impersonation of AMK signing decisions.
