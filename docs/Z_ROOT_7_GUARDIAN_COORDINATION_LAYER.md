# Z-ROOT-7 — Seven Guardian Coordination Layer

**Phase:** Z-ROOT-7
**Posture:** Symbolic guardian coordination — visual, ethical, personality-based, and advisory.
**Not in scope:** Religious proof, animal mysticism as factual claims, live research automation, medical advice, backend execution.

## Slice naming (visual evolution)

| Label | Meaning |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Z-ROOT-7 / 7A** | First symbolic slice: flat-ish SVG constellation (still advisory). |
| **Z-ROOT-7B** | **3D-lite** upgrade: CSS `perspective`, layered stars/mist, orbital rings, per-node **`tz` depth**, parallax tilt, optional slow orbit drift — **still not** WebGL. |
| **Z-ROOT-7C** (future) | Heavier WebGL / Three.js only if doctrine needs it — gated in coordination JSON (`z_root_7c_webgl`). |

**Panel copy reminder:** “3D constellation view is symbolic and advisory. It does not execute tasks, research the web, or control systems.”

## Purpose

Extend the Sanctuary **Root / companion** framing into a **seven-role coordination map** on the AMK main control dashboard **and** the unified SKK/RKPK hub (`dashboard/Html/index-skk-rkpk.html`), directly under the ZUNO-4ROOT companion canvas:

- Top decision and counsel posts (human core, Zuno, AT / Franed).
- Mid and bottom **companion guardians** (Princess AI, Blackie AI, JB Z-Irish Fox AI, Sister Aisling-Sol AI).
- A shared **ethical root law** stripe that bottom companions connect to softly in the visualization.

This layer **does not replace** ZUNO-4ROOT doctrine or SKK/RKPK parent framing; it is a **cousin visualization** focused on ethics copy and mascot-style roles for the AMK cockpit.

## Artefacts

| Artefact | Role |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| `data/z_root_guardian_coordination.json` | Registry of guardians, connections, laws, forbidden claims, future gates |
| `dashboard/styles/z-root-guardian-coordination.css` | Milky Way layers, orbital rings, 3D node cards, orbit + motion safety |
| `dashboard/scripts/z-root-guardian-coordination-readonly.js` | Loads JSON — SVG neon lines + HTML nodes with depth; orbit/parallax toggles |
| `dashboard/scripts/z-hub-root-seven-boot.js` | Boots constellation on unified hub with configurable mount IDs |
| `dashboard/Html/amk-goku-main-control.html` | Collapsible **Seven Guardian Coordination** section |
| `dashboard/Html/index-skk-rkpk.html` | Unified SKK/RKPK hub: constellation **below** ZUNO-4ROOT panel + **`7·ROOT`** FAB |

Unified hub stacks **four-root canvas** then **seven-guardian 3D-lite** without adding nets or execution — doctrine links tie Traffic, GTAI, VH100/MCBURB, and the ZUNO-4ROOT spine (`z-hub-root-seven-boot.js`).

## The seven coordinations (+ root law anchor)

| # | Guardian | Role (advisory) |
| --- | ------------------------------------ | ---------------------------------------------------------------- |
| 1 | **AMK-Goku** | Human sacred decision holder |
| 2 | **Zuno AI** | Strategy narrator and ethical guide |
| 3 | **AT / Franed AI** | “Always Ask Why” + French–English research compass |
| 4 | **Princess AI** | Gentle cat-inspired guardian: curiosity, comfort, soft attention |
| 5 | **Blackie AI** | Cat-inspired night watch: instinct, protective calm |
| 6 | **JB Z-Irish Fox AI** | Helpful Irish fox guide — clever but bounded |
| 7 | **Sister Aisling-Sol AI** | Soft companion — help with energy boundaries |
| — | **Ethical root law** (visual anchor) | Shared non-execution promise lines — not a certificate |

## Personality laws (symbolic)

### AT / Franed AI

- Copy on panel: _Always ask why; confirm important claims through trusted sources when research mode is opened._
- **Boundary:** Deep research ≠ automatic web scraping. Trusted checking requires an **approved research mode** and citations when that mode is opened.

### Princess AI and Blackie AI

- Princess: comfort, curiosity, gentle play.
- Blackie: night watch, instinct, protective calm.
- **Boundary:** Cat-inspired roles are **symbolic mascots**. They do **not** claim supernatural animal powers, medical truth, or real-world sensing.

### JB Z-Irish Fox AI and Sister Aisling-Sol AI

- They help softly within **time, energy, consent, and dignity**.
- **Boundary:** Helpfulness must not become exploitation; support stays **controlled, kind, and sustainable.**

## Root law (panel text)

Core lines used in registry and UI:

```text
No cruelty to any living being.
No bloodshed as doctrine.
The soil asks for water, not harm.
```

**Gentle public phrasing:** _This panel reflects Z-Sanctuary’s ethical promise: protect life, reduce harm, respect boundaries, and let help stay kind and sustainable._

## Locked law

```text
Guardian council ≠ executor.
Symbolic cats ≠ factual animal powers.
Research compass ≠ uncontrolled web scraping.
Helpful AI ≠ unlimited giving.
Ethical root law ≠ public certification.
AMK-Goku owns sacred moves.
```

## Relation to other hub layers

| Layer | How Z-ROOT-7 relates |
| ------------------------------ | --------------------------------------------------------------------------------- |
| AMK main control (`AMK-MAP-*`) | Host panel only — read-only |
| AMK indicators | Row `z_root_7_guardian_coordination` — **ADVISORY_VISUAL_ONLY** |
| Z-AMK-GTAI | Strategy reports remain separate evidence; guardians do not run GTAI |
| Z-AAL | Sacred vs auto-lane law still applies; panel adds **no** approval buttons |
| Z-Traffic | Traffic signals unchanged; panel does not read traffic JSON |
| Z-Sanctuary ethics / 14 DRP | Framing aligns with non-harm and consent themes — **not** a substitute for review |

## Kids and Public Visitor lenses

For **Kids** and **Public Visitor** domain views, the script uses **short gentle copy** for the lead and law list so operator, deploy, billing, and gate jargon stay out of the panel body. The full root-law list remains in JSON and operator doc for adults.

## Accessibility and motion

- Guardian nodes are keyboard-focusable (`Tab` / `Enter` / `Space` to emphasize).
- **Z-ROOT-7B:** `prefers-reduced-motion` disables **orbit drift**, **pointer parallax**, and the **Orbit** toggle stays disabled with an on-screen note. Far starfield drift also stops.

## Forbidden in this phase

- Live AI providers, web scraping, deployment, billing, secrets, accounts, tracking.
- Voice, camera, GPS, bridges, autonomous task execution from the panel.

## Verification

- [PHASE_Z_ROOT_7_GREEN_RECEIPT.md](PHASE_Z_ROOT_7_GREEN_RECEIPT.md) — first slice.
- [PHASE_Z_ROOT_7B_3D_GREEN_RECEIPT.md](PHASE_Z_ROOT_7B_3D_GREEN_RECEIPT.md) — 3D-lite constellation acceptance.
