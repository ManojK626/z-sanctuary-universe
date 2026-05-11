# Z-ROOT-7 Visual Integration Profile (Z-ROOT-7C hub repair)

Canonical hub surface: **`dashboard/Html/index-skk-rkpk.html`** — **ZUNO-4ROOT** companion panel (`#zCompanion3dPanel`). Shadow copy: **`dashboard/Html/shadow/index-skk-rkpk.workbench.html`**.

## Accepted visual contract

Z-ROOT-7 must be **clearly visible** as the **seven-guardian coordination layer** directly under the **four-root doctrine canvas**, inside the **same** floating panel—not treated as optional metadata.

- **It is not enough** for `data/z_root_guardian_coordination.json` to exist.
- **It is not enough** for the constellation to render only below a long block of SKK/RKPK/Zuno per-root prose that pushes it off-screen.
- **It is not enough** for the operator to see only AMK-Goku · Zuno · SKK · RKPK on the 2D canvas while the seven-role council hides in a cramped inner scroll trap.

### Required operator-visible checklist

1. A labelled section **`Z-ROOT-7 · Seven Guardian Coordination`** with subline **`Symbolic advisory council — visual ethics map only.`**
2. The **seven roster names** plus **ethical root anchor** appearing in BOTH:
   - the **constellation stage** (`#zHubRoot7GuardianMount`), and
   - the **card roster** fallback (`#zHubRoot7CardStrip`) keyed from the same JSON.
3. Neon connection lines driven from JSON **`connections`**; **ethical root** uses soft root styling to companions.
4. **Kids / Public** lenses: gentle wording only (see guardian JSON **`public_lens_one_liner`** and law strip in script).
5. **`prefers-reduced-motion`** disables orbit drift and pointer parallax; no flashing or strobe UX.
6. **No execution affordances**: no tasks, scraping, deploy, research-automation buttons, live AI bridges from this UI.
7. **JSON load failure**: `console.warn` plus **visible** degraded copy plus **named card roster still rendered** from static fallback.

### DOM anchors (canonical)

- **Panel** — `#zCompanion3dPanel` — merged guardian council chrome.
- **Seven layer region** — `#zCompanionRootSevenLayer` — scroll target and section landmark.
- **Constellation mount** — `#zHubRoot7GuardianMount` — SVG and CSS 3D-lite stage.
- **Card strip mount** — `#zHubRoot7CardStrip` — roster chips (always wired on hub boot).
- **Lead copy** — `#zHubRoot7Lead` — JSON intro and Kids intro.
- **Orbit preference (non-sacred UI)** — `#zHubRoot7OrbitToggle` — preference only; disabled under reduced motion.
- **FAB** — `#summonRoot7Fab` — expands companion and scrolls **inner** `#zCompanionRootSevenLayer` into view.

### Layout discipline

Long **four-root** per-root prose and doctrine links live in **`<details class="z-companion-four-root-details">`** so opening the panel foregrounds **Z-ROOT-7** instead of drowning it.

### Related code

- `dashboard/scripts/z-root-guardian-coordination-readonly.js` — data binding, chips, degraded path.
- `dashboard/scripts/z-hub-root-seven-boot.js` — hub bootstrap + FAB scroll targeting **`.z-panel-body`**.
- `dashboard/styles/z-root-guardian-coordination.css` — council chrome, roster strip, companion panel body height overrides.
