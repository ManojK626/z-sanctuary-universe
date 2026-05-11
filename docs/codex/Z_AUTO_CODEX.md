<!-- Z: docs\codex\Z_AUTO_CODEX.md -->

# 🧠 Z-AUTO CODEX — Repeating Issues Resolution

This codex exists to eliminate repeated cognitive load.
If an issue matches a rule below, apply the fix without debate.

---

## MD040 — Fenced Code Blocks Without Language

### Symptom (MD040)

markdownlint(MD040)

### Rule (MD040)

Every ``` block MUST declare a language.

### Default Fix (MD040)

- Unknown language -> ```txt
- Commands -> ```bash
- JS -> ```js
- HTML -> ```html
- JSON -> ```json

### Status (MD040)

AUTO-FIX — no discussion required

---

## MD036 - Emphasis Used as Heading

### Symptom (MD036)

markdownlint(MD036)

### Rule (MD036)

Headings MUST use # syntax.
Bold text is not a heading.

### Default Fix (MD036)

Replace:

```md
**Title**
```

With:

```md
## Title
```

### Status – UI Controls

AUTO-FIX - no discussion required

---

## UI Control Reliability (Collapse / Buttons / Toggles)

### Symptom

UI controls (collapse, checkboxes, locate) do not respond or revert state.

### Causes to Check

- Drag handle intercepting button clicks
- Focus/preset/autopilot overriding manual visibility
- Hidden state derived from display instead of stored authority
- `z-freeze` / locked state blocking pointer events
- Overlays capturing pointer events

### Resolution Strategy

1. Verify `z-freeze` and locked states.
2. Stop propagation on panel action buttons to avoid drag capture.
3. Enforce visibility authority: manual -> preset -> autopilot.
4. Persist state before applying layout.
5. Provide an explicit "Reset Overrides" control for consent.

### Status

PREVENTION - apply before adding new panels or controls

---

## JS/TS Lint - Core Auto-Fixes

### no-unused-vars / @typescript-eslint/no-unused-vars

#### Symptom (no-unused-vars / @typescript-eslint/no-unused-vars)

eslint(no-unused-vars) or @typescript-eslint/no-unused-vars

#### Rule (no-unused-vars / @typescript-eslint/no-unused-vars)

Unused variables are noise and must be removed or marked intentional.

#### Default Fix (no-unused-vars / @typescript-eslint/no-unused-vars)

- Remove the unused binding, or
- Prefix with `_` if required for API symmetry, or
- Add a single-line disable comment for that line only.

#### Status (no-unused-vars / @typescript-eslint/no-unused-vars)

AUTO-FIX - prefer remove, otherwise prefix `_`

---

### no-undef

#### Symptom (no-undef)

eslint(no-undef)

#### Rule (no-undef)

All identifiers must be declared or imported.

#### Default Fix (no-undef)

- Add the missing import, or
- Declare with `const`/`let`.

#### Status (no-undef)

AUTO-FIX - no discussion required

---

### eqeqeq

#### Symptom (eqeqeq)

eslint(eqeqeq)

#### Rule (eqeqeq)

Use strict equality except for intentional nullish checks.

#### Default Fix (eqeqeq)

- Replace `==` with `===`
- Replace `!=` with `!==`
- If intentionally checking nullish values, use `x == null` and add a brief comment.

#### Status (eqeqeq)

AUTO-FIX - unless explicitly a nullish check

---

### prefer-const

#### Symptom (prefer-const)

eslint(prefer-const)

#### Rule (prefer-const)

Use `const` for values that are not reassigned.

#### Default Fix (prefer-const)

Replace `let` with `const` when safe.

#### Status (prefer-const)

AUTO-FIX - no discussion required

---

## TypeScript Strict - Quick Fixes

### TS7006 - Parameter implicitly has an 'any' type

#### Rule (TS7006)

Every parameter must be typed.

#### Default Fix (TS7006)

- Add an explicit type, or
- Use `unknown` and narrow with a guard.

#### Status (TS7006)

AUTO-FIX - add a type or `unknown` + guard

---

### TS2339 - Property does not exist on type

#### Rule (TS2339)

Fix the type, not the usage.

#### Default Fix (TS2339)

- Update the interface/type definition, or
- Narrow the type with `in` or a type guard.

#### Status (TS2339)

FIX - prefer type update or narrowing

---

### TS2322 - Type is not assignable

#### Rule (TS2322)

Assignments must match the declared type.

#### Default Fix (TS2322)

- Adjust the type, or
- Convert the value, or
- Use a safe cast with a brief comment.

#### Status (TS2322)

FIX - avoid `as any`

---

### TS18048 / TS2532 - Object is possibly 'undefined'

#### Rule (TS18048/TS2532)

Prove existence before use.

#### Default Fix (TS18048/TS2532)

- Add a guard, or
- Use optional chaining with a default.

#### Status (TS18048/TS2532)

AUTO-FIX - guard or default

---

### TS2571 - Object is of type 'unknown'

#### Rule (TS2571)

Narrow before access.

#### Default Fix (TS2571)

- Use `typeof`, `instanceof`, or custom type guard.

#### Status (TS2571)

FIX - narrow before use

---

## ESLint - Intentional Exceptions

### no-console

#### Rule (no-console)

Console output is allowed for local dev modules, but avoid it in production packages.

#### Default Fix (no-console)

- Prefer `ZStatusConsole.log` in core UI, or
- Guard console output behind a debug flag.

#### Status (no-console)

IGNORE in dev modules, FIX in production packages

---

## Z-Sanctuary Lint Integration

### Lint Intent

Keep docs clean without manual effort.

### Lint Standard

- `markdownlint-cli` is a devDependency (local tool).
- `npm run lint:md` runs markdownlint with `.markdownlint.json`.
- `npm run lint` includes `lint:md` before workspace lint.

### Lint Ritual

```bash
npm install
npm run lint:md
```

---

## Documentation Lint Warnings

### Principle

Documentation lint errors do not block runtime.
They should be resolved in calm maintenance passes.

### Priority

LOW unless publishing externally.

---

## Zuno's Rule

If an issue:

- repeats more than twice
- is non-destructive
- has a deterministic fix

it belongs in this Codex.

---

## Z-PRIORITY RULE - Fix or Ignore?

If an issue is:

- non-blocking
- visual or documentation only
- repetitive
- already understood

It may be safely ignored until a calm maintenance phase.
Founder energy > perfect formatting.

### Severity Levels

- BLOCKER -> Fix immediately (build, runtime, security)
- MAINTENANCE -> Fix later (lint, docs, style)
- NOISE -> Ignore consciously

Conscious ignoring is not laziness.
It is strategy.

---

## Super Saiyan Autopilot Story

### Autopilot Replay — explainable narratives

The Replay timeline (`core/autopilot/z_autopilot_replay.js` + `core/autopilot/z_autopilot_replay_ui.js`) is the “why” channel:

- Every Autopilot action is logged with `action`, `value`, `reason`, and `state`.
- The UI panel lists the last 30 records, filters by type, and lets SKK recite the full path before you act.
- Export or clear the log from the panel—this is your audit trail before talking to regulators.
- The detail pane now adds SKK/RKPK companion narration, a concise “reason” summary, and a state snapshot alongside the raw JSON so auditors and operators can read the tension without guessing.

### Simulation Mode — safe rehearsal

The Simulation panel (`core/autopilot/z_autopilot_simulator.js`) runs in a sandbox:

- It blocks network/localStorage writes but still records events through the Replay log so you can inspect consequences.
- Stress, chaos, and freeze trigger buttons mimic future states without touching production binaries.
- Scenarios encode how RKPK & SKK should react; every tick writes `simulated: true` entries so the Replay timeline knows this was a dry run.

### Insight Lab / Super Ghost

The Insight Lab panel (`core/super_ghost_panel.js`) streams Super Ghost intelligence:

- The `Super Ghost` engine (`core/ai_tower/z_super_ghost.js`) reads the Replay log, Chain History, and Z-System metrics to produce human-friendly insights.
- It registers itself in the Module Registry and rebroadcasts the “micro → macro” signals the dashboard drinks from.
- The panel surfaces metrics, chain heat, trends, and recent events alongside refresh/export buttons so SKK can keep teaching.
- Every insight entry is sent to the **Insight Feed** (`core/insight_feed.js`), exposes `window.ZInsightFeed`, and emits a `zInsightFeed` event so automation/webhooks can observe without acting; feed payloads now include the `reflection`, `driftMessage`, and active `lens` context that drove the insight.
- The weekly reflection slot now quotes which lens (Calm, Focus, Governance) the human accepted most often, plus a companion ethics message pulled from `Super Ghost` while the Ethics Watcher text reports `driftMessage` details (the weekly summary persists in `localStorage` for audits).

### Insight Feed (Automation wiring)

The `window.ZInsightFeed` API is your read-only nerve:

- `push(entry)` pushes the latest summary (auto-called by Super Ghost and Autopilot replay).
- `list(limit)` returns the most recent entries (reverse chronological).
- `getLatest()` returns the last published entry.

### Intelligence Engine & Calibration

- The Intelligence Engine panel (`core/intelligence_panel.js`) renders the live pattern store, highlighting every Zk/Zkx threshold, multiplier gap, and category heat (and emits a `zRouletteAlert` event when an alert fires).
- Each alert also reaches downstream listeners via `window.ZInsightFeed`, supplying `reflection`, `driftMessage`, and the active `lens` so investors/webhooks know the exact context.
- To calibrate with your real data (`XXXTremeLighting Roulette`, `Goku Combo board`, etc.), import the CSV/ODS history into `/data/roulette_history.json` (converter scripts live in `scripts/`), rerun the engine, and watch the Intelligence panel show when predictions/intervals finally match reality. Run `node scripts/import_history.js --input=path/to/your_file.xlsx --output=data/roulette_history.json` after installing `xlsx` (`npm install xlsx`) so the import process generates the summary JSON this engine consumes. After the import finishes, run `node scripts/validate_history.js` to produce a quick validation report (source, total hits, top patterns) you can include in investor briefs.

### Social Arena

- The Social Arena (`core/social_ui.js` + `core/social_layer.js`) stores player profiles, chat, tips, and stream events locally (`window.ZSocial`) while emitting `zSocialChatUpdate`, `zSocialTip`, and `zSocialStreamUpdate` so the AI layer can monitor sentiment and spotlight helpful viewers.
- Chat and tip actions are accessible through the panel (`core/index.html`) and trigger small toast confirmations plus webhook-ready payload exports. Live-stream toggles log stream state so moderation/affiliate dashboards know who is broadcasting.
  You can listen for `window.addEventListener('zInsightFeed', ...)` to stream data downstream, or call `ZInsightFeed.list()` before posting to an external endpoint. The Insight Lab export button downloads the JSON for a complete audit-ready payload.

### Governance Reports & Reviews

Governance Reports (`core/autopilot/z_governance_reports.js`) summarize Replay actions:

- Run once a week (auto) or on-demand, then publish JSON/Markdown exports for auditors.
- The companion Review panel (`core/autopilot/z_governance_review.js`) translates those numbers into SKK summary + RKPK reflection—calm, contextual, action-oriented.

### Registry + Chain Intelligence

The Module Registry and Chain View (`core/z_module_registry_panel.js`, `core/z_chain_view.js`, `core/z_chain_registry.js`, `core/z_chain_history.js`) keep relationships explainable:

- Every module registers with `window.ZModuleRegistry`, earns a layer/owner/status, and feeds the chain overlay.
- Chain edges carry SKK-friendly explanations, RKPK-friendly safety checks, ethics scores, and heat color coding.
- Chain History snapshots heat/trend data, powering weekly governance reports and timelapse playback for retrospectives.

### Multilayer Awareness & Super Ghost Ethics

- The Insight Lab’s Super Ghost engine is the “voice of AMK Goku”: micro-details → macro modules.
- Multi-root workspace guidance, calm mode lenses, and buddy-led voice cues (ZSKKVoice/ZRKPKWhisper) keep governance humane.
- When you need to “show the system you care,” the Insight Lab is the interface that reveals why, how, and what to do next.
- Lens interactions are captured in `window.Z_LENS_MEMORY` so weekly reflections, calm/focus/governance suggestions, and ethics drift warnings are driven by what actually worked; the Ethics Drift Watcher surfaces only multi-week trends so you can pause before the pattern becomes a problem.
