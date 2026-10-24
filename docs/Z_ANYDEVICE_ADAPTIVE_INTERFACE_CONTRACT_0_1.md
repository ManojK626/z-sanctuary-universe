# Z-AnyDevice Adaptive Interface Contract 0.1

**Gate:** `Z-ANYDEVICE-ADAPTIVE-INTERFACE-CONTRACT-DOC-0.1`

**Mode:** `DOCUMENTATION_ONLY`

**Basis:** accepted findings of `Z-ANYDEVICE-ADAPTIVE-INTERFACE-RECONCILIATION-0.1`

**Lineage:** clean worktree of `3f02aa68810df3184ca073d15a8293f0e834bd22` on `cursor/zsanctuary/z-anydevice-adaptive-interface-contract-0-1`

**Authority of this file:** contract text only. It does not create a runtime, a registry row, a starter app, CSS, JavaScript, HTML, tests, or a migration.

## 1. Canonical principle

> AVAILABLE SPACE AND USER CAPABILITIES — NOT DEVICE BRAND OR MODEL.

Responsive presentation derives from:

- usable viewport
- zoom and effective scale
- orientation
- pointer capability
- hover capability
- keyboard accessibility
- reduced-motion preference
- safe-area insets
- component and container size
- online or offline presentation state, where the application has an offline presentation

Layout classification must not use:

- Samsung, iPhone, Android model, tablet brand, or monitor brand
- GPU, CPU, or RAM identity
- browser user-agent identity

One application may adapt its presentation. The same underlying business logic and semantic truth stay in force on every size.

## 2. Two independent layers

### A. Z-AnyDevice Governance

Existing Sanctuary responsibility. It already lives in policy, reports, the badge, and the panel. This contract does not redesign it.

- trust
- approval
- quarantine
- local-only posture
- device capability audit
- privacy and security posture

### B. Adaptive Interface Runtime

Proposed presentation responsibility. Not implemented by this gate.

- layout and sizing
- orientation
- safe area
- pointer and hover
- density
- zoom
- responsive navigation
- component reflow
- accessibility adaptation

Locked law:

`LAYOUT_CLASS_DOES_NOT_GRANT_TRUST`

`TRUST_STATUS_DOES_NOT_CHANGE_BUSINESS_TRUTH`

The adaptive layer must not approve, quarantine, or trust a device. The governance layer must not decide application business truth because a screen changed. Hosting both on the unified dashboard is allowed. Calling one from the other is not.

## 3. Four layout classes

These four names are the canonical layout contract. Thresholds below are the initial baseline, measured from available width after the measurement rules in section 5. They are not device profiles.

| Class | Available width |
| --- | --- |
| `mobile` | under 860 |
| `compact` | 860–1279 |
| `standard` | 1280–1599 |
| `wide` | 1600 and above |

Sanctuary compatibility classes stay. This contract does not delete them.

| Existing Sanctuary class | Canonical layout |
| --- | --- |
| `mobile` | `mobile` |
| `tablet` | `compact` |
| `compact-desktop` | `standard` |
| `desktop` | `standard` |
| `wide` | `wide` |
| selected `ultra` cases that were only a large width | `wide` |

`ultra` remains density and compatibility terminology. It is not a fifth canonical layout class.

Device pixel ratio must not choose the canonical layout class. A sharp display and a standard display with the same available width share one layout class. Density, type scale, and image sharpness may still respond to user settings and CSS.

The word `compact` on `z-layout` means the width class in the table above. It does not mean the density value `compact`.

## 4. Density is not layout

`z-layout` and `z-density` are independent signals.

Existing density values stay:

- `normal`
- `compact`
- `ultra`

Those words describe information density. They do not describe viewport size. A `wide` layout may use `normal`, `compact`, or `ultra` density. A `mobile` layout may do the same when the user has chosen it.

A manual density choice wins over an automatic suggestion. Automatic density must not be inferred from device pixel ratio.

## 5. Signal contract

Signals are specified here and are not implemented in this gate. No new attributes, CSS, or script are added by this document.

| Signal | Values | Source to use later |
| --- | --- | --- |
| `z-layout` | `mobile`, `compact`, `standard`, `wide` | available width after section 6 |
| `z-orientation` | `portrait`, `landscape` | viewport aspect or orientation media |
| `z-pointer` | `coarse`, `fine` | `pointer` media feature |
| `z-hover` | `hover`, `none` | `hover` media feature |
| `z-motion` | `reduce`, `no-preference` | `prefers-reduced-motion` |
| `z-density` | `normal`, `compact`, `ultra` | explicit user preference |
| `z-offline` | `online`, `offline` | `navigator.onLine`, presentation only |

Safe area is CSS, not a fingerprint signal. Use `env(safe-area-inset-*)`. Do not store a device inset database.

`z-offline` may change chrome that explains connectivity. It must not change business truth, hide required records, or grant trust.

## 6. Available space

Future measurement priority:

1. `visualViewport` width and height, when the browser provides them.
2. Viewport dimensions (`innerWidth` / `innerHeight`) when `visualViewport` is absent.
3. Zoom and effective scale, so a zoomed view classifies by the space the person can actually use.
4. `screen.width` and `screen.height` are not the layout authority.

Monitor hardware size is not available UI space. A window, a zoomed page, and a split view can all be smaller than the panel they sit on.

Screen color depth and pixel depth are not layout requirements. They must not be persisted or published as part of the adaptive contract.

## 7. Safe area

Future responsive surfaces that draw into the display edge use:

- `viewport-fit=cover` on the viewport meta, when edge-to-edge presentation is intended
- `env(safe-area-inset-top)`
- `env(safe-area-inset-right)`
- `env(safe-area-inset-bottom)`
- `env(safe-area-inset-left)`

Critical controls stay reachable beside notches, browser chrome, and cutouts. A control under a system inset fails `SAFE_AREA_RESPECTED`.

## 8. Dynamic viewport

Full-height shells should use modern viewport units where the browser supports them:

- `svh` as the small viewport
- `dvh` as the dynamic viewport
- a fallback for older engines

A mobile shell must not rely only on legacy `100vh`, which includes browser chrome that appears and disappears.

## 9. Typography and spacing

Preferred primitives, without a shared visual theme:

- `clamp()` for type and space that should scale and still have limits
- `min()`, `max()`, and `minmax()` for bounds
- fluid spacing
- wrapping text
- `min-width: 0` on grid and flex children that must be allowed to shrink
- overflow-safe containers

Each project keeps its own identity, color, and voice. This contract standardizes adaptation behavior, not a skin.

## 10. Touch and pointer

Critical controls target about `44px × 44px` where practical.

`mobile` is not a synonym for touch. `wide` is not a synonym for mouse. When behavior depends on input, use `z-pointer` and `z-hover`.

A required control must not depend only on hover. Hover may reveal a shortcut. The same action needs a visible or keyboard-reachable path.

## 11. Keyboard access

Where the application type supports a keyboard, every critical workflow has a keyboard path.

- visible focus
- logical tab order
- Escape closes a dismissible overlay
- focus returns to the control that opened the overlay
- no keyboard trap

A workflow that can be completed only by a pointer fails `KEYBOARD_PATH_AVAILABLE`.

## 12. Reduced motion

Non-essential animation respects `prefers-reduced-motion`.

Display Morph modes, including `low-sensory`, are user experience preferences. They do not replace the operating-system reduced-motion setting. Both may be honored. Neither is a layout class, and neither is a trust status.

## 13. Container queries

Container queries are the preferred future strategy when a component's internal layout depends on the component's width rather than the whole viewport.

Candidates:

- cards
- graphs
- AI panels
- analytics panels
- Mission Control widgets
- observatories
- Z-Connect modules

Outer application chrome, such as a rail or a drawer, may still use the viewport layout class. A card inside a narrow column on a `wide` page should follow the card's container, not the page class.

Declaring `container-type` without `@container` rules does not satisfy this section. This gate adds neither.

## 14. Responsive law

Acceptance laws for any later implementation:

- `NO_DOCUMENT_HORIZONTAL_OVERFLOW`
- `NO_UNREACHABLE_CRITICAL_CONTROLS`
- `NO_CRITICAL_TEXT_CLIPPING`
- `NO_HIDDEN_REQUIRED_INFORMATION`
- `TOUCH_TARGETS_USABLE`
- `KEYBOARD_PATH_AVAILABLE`
- `REDUCED_MOTION_RESPECTED`
- `SAFE_AREA_RESPECTED`
- `SAME_BUSINESS_TRUTH_ACROSS_VIEWPORTS`

> Presentation may adapt. Business logic and semantic truth must not change because the screen changes.

## 15. Viewport acceptance matrix

Synthetic browser matrix. Passing it is browser evidence. It is not physical-device proof.

| Width | Height |
| --- | --- |
| 320 | 568 |
| 360 | 640 |
| 390 | 844 |
| 430 | 932 |
| 600 | 960 |
| 768 | 1024 |
| 1024 | 768 |
| 1280 | 720 |
| 1366 | 768 |
| 1440 | 900 |
| 1920 | 1080 |
| 2560 | 1440 |

Also required when a later test gate exists:

- portrait and landscape
- zoom at 100%, 125%, 150%, and 200%
- coarse pointer and fine pointer
- keyboard-only
- reduced motion
- safe-area behavior where the harness can simulate insets

Label every such run `SYNTHETIC_BROWSER_EVIDENCE`. Do not relabel it as a phone, a tablet brand, or a monitor brand. A size that happens to match a known phone is still a viewport size.

## 16. Cross-browser contract

Proposed required families:

- Chromium
- Firefox
- WebKit

Cross-browser compliance is not claimed until the applicable project has verified passes on each required family. Chromium evidence from ZWheel may be cited as reference evidence only. ZWheel's Playwright configuration at the reconciled reference SHA is Chromium-only. Firefox and WebKit are not yet evidenced.

CSS `zoom` in one browser is not proof of browser-chrome zoom in the other two.

## 17. Physical device policy

Historical physical-device records stay as written. This contract does not edit them.

Steward historical label, preserved:

`PD14_FINAL_VERDICT: PARTIAL`

The physical Samsung Galaxy S21 was not operable for that acceptance. Browser simulation was not, and is not, a substitute.

Source wording that must remain untouched in the ZWheel tree:

- Committed `ZWHEEL_PD14_PHYSICAL_DEVICE_ACCEPTANCE.md` records `PD14_CURRENT_VERDICT: INSUFFICIENT` because the device session did not happen. Its `FAIL` rows mean missing hardware evidence, not a relabelled product defect.
- A later local note recorded `PD14: HOLD` for the same reason. That note is not rewritten here.

Proposed future policy, for Steward review, not in force until the conditions below are actually green:

`PHYSICAL_DEVICE_TEST = OPTIONAL_CONFIDENCE_LAYER`

Conditions before that proposal may be adopted:

- the universal responsive matrix is green
- Chromium is green
- Firefox is green
- WebKit is green
- accessibility acceptance is green

Physical hardware remains valuable evidence. It is not the sole release authority. One phone model is not a universal blocker once the matrix and the three browser families are green. Until those conditions exist, this paragraph is a proposal only.

## 18. Project status model

Design only. No Mission Control change and no registry write.

`ANYDEVICE_STATUS` means adaptive-interface evidence. It does not replace AnyDevice trust or security status.

| Status | Meaning |
| --- | --- |
| `GREEN` | required matrix and browser evidence passed for this contract version |
| `AMBER` | foundations exist and evidence is incomplete |
| `RED` | a required law failed on a tested surface |
| `NOT_TESTED` | no evidence against this contract |
| `LEGACY` | archive, snapshot, export, or shadow copy, not an adoption target |
| `EXEMPT` | governance, theme preference, or a special-purpose surface outside universal adaptation |

The canonical dashboard is `NOT_TESTED` against this contract. ZWheel reference suites do not transfer a `GREEN` onto Sanctuary.

## 19. Evidence fields

Proposed for a later evidence record. Not stored by this gate.

- contract version
- last tested SHA
- viewport coverage
- browser coverage
- zoom coverage
- pointer and touch coverage
- keyboard coverage
- safe-area coverage
- offline coverage
- accessibility coverage

## 20. Future project bootstrap

A new Z-Sanctuary web application is expected to start with:

- viewport meta, including `viewport-fit=cover` when the surface is edge-to-edge
- the four layout classes
- safe-area support
- dynamic viewport units
- responsive typography using the primitives in section 9
- usable critical touch targets
- a keyboard path
- reduced-motion support
- container-ready components
- the viewport matrix in section 15

No starter repository, template, CSS, or script is created by this gate.

## 21. Legacy policy

Migration order:

`INVENTORY` → `CLASSIFY` → `TEST` → `ADOPT` → `VERIFY`

Forbidden:

`GLOBAL SEARCH/REPLACE`

Do not automatically mutate:

- exports
- archives
- snapshots
- shadow copies
- historical builds
- receipts
- generated copies

Change a canonical source once. Regenerate a derivative only where that project already has a regeneration path, and only under a later gate.

Reconciled inventory counts, not a new scan: 266 committed HTML files, of which 166 were classed as legacy, archive, snapshot, shadow, or export. Those 166 are out of scope for automatic adoption.

## 22. First adoption candidate

Proposed only:

`dashboard/Html/index-skk-rkpk.html`

That is the canonical unified dashboard. Implementation is not authorized.

Snapshots, `dashboard/Html/shadow/`, release snapshots, and lab copies of that dashboard stay frozen.

ZWheel remains:

`REFERENCE_IMPLEMENTATION`

It is not a Sanctuary dependency. Sanctuary must not import the ZWheel repository, its service worker, its Orb, or roulette-specific layout. Reusable ideas already named in this contract are the shared part. Product chrome stays in each project.

## 23. Sanctuary engine notes for a later gate

Recorded from `core/z_layout_engine.js` and `interface/z_style.css` at the reconciliation. Not fixed here.

- Device pixel ratio currently helps choose `ultra`. Canonical layout must not do that.
- The branch `width >= 2400` returning `ultra` is unreachable, because `width >= 2200` already returns `wide`.
- The display fingerprint stores screen size, available size, device pixel ratio, color depth, and pixel depth. Adaptive layout does not need that record.
- JavaScript breakpoints (900, 1300, 1500, 1600, 2200) and the CSS status-rail rule at 1100px are different systems.
- Root attribute `z-viewport` collapses `compact-desktop` into `desktop`, while the body class keeps `compact-desktop`.
- The engine does not read `visualViewport`.
- There is no safe-area contract on the layout engine.
- There are no `z-pointer` or `z-hover` signals.
- There are no container-query rules on the canonical dashboard.
- There is no cross-browser matrix for this contract.
- There is no universal viewport harness for this contract.
- `--z-ui-zoom` is forced to `1`, so zoom is not an input.

Display Morph (`standard`, `classic`, `fusion`, `business`, `workstation`, `game`, `creator`, `presentation`, `eco`, `low-sensory`) stays a theme preference. It is not a layout class and it is not device trust.

`apps/web` already uses `clamp()`, `100dvh`, and horizontal safe-area padding on its own stylesheet. That is a separate surface. It does not implement this contract.

## 24. Privacy

Adaptive layout uses the smallest capability set that changes the interface.

Do not use for layout:

- GPU identity
- network-adapter identity
- RAM
- CPU model
- device model
- device name
- color depth
- pixel depth
- a persistent hardware fingerprint

AnyDevice governance may keep separately authorized capability data for trust, approval, quarantine, and audit. That data stays in the governance layer. It is not copied into layout signals.

A local layout preference and a local density preference may be stored as those two values. Storing a monitor fingerprint in order to remember them is outside this contract.

## 25. What this document does not do

- no runtime
- no HTML, CSS, or JavaScript edits
- no registry row and no `ANYDEVICE_STATUS` field in data
- no ZWheel edit and no ZWheel package dependency
- no dashboard edit
- no archive or snapshot update
- no deployment and no Cloudflare change
- no package installation
- no mass migration
- no claim that any current page is green against this contract

## Footer

```text
CONTRACT_VERSION: 0.1
IMPLEMENTATION_STATUS: NOT_STARTED
RUNTIME_AUTHORITY: NONE
REGISTRY_AUTHORITY: NONE
DEPLOYMENT_AUTHORITY: NONE
MIGRATION_AUTHORITY: NONE
ZWHEEL_DEPENDENCY: NONE
FIRST_ADOPTION_TARGET: PROPOSED_ONLY
```
