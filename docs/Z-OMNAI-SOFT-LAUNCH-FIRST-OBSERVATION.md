# OMNAI soft launch — first observation pass

**Purpose:** Read **reality carefully** after the Pages URL goes live — surface, console, network, feel — without rushing domain, scope, or monetization. Aligns with Task 008 soft launch in [MONOREPO_GUIDE.md](../MONOREPO_GUIDE.md).

**Zuno / awareness:** After you have **confirmed a real page load** (not 503), run `npm run zuno:external-observers-refresh` from hub root, then read `external_observers` + `external_observers_health` in `data/reports/zuno_system_state_report.json` (or at minimum `node scripts/z_zuno_state_report.mjs`). **Do not** run the refresh _before_ the URL serves the page—otherwise “fresh” can align with **stale reality** (timestamps updated without verifying live traffic).

**Flow you want:** Deploy → observe → verify → interpret — not deploy → assume → expand.

---

## Immediate loop (operator)

1. **Cloudflare:** Workers & Pages → project exists → latest deployment **Success** → URL is `https://<project-name>.pages.dev`. If not Success, fix settings and **Retry deployment** (see [503 section](#if-the-url-returns-503-service-unavailable) below).
2. **Still 503?** Quick static checks: `index.html` at published root · build command empty (if pure static) · output directory `/` or matches your bundle (see table below).
3. **First successful page load:** open the live URL in the browser and confirm the page actually serves (layout, assets, not 503). Quick peek at Console is fine here; full pass comes in step 6.
4. **Only after step 3:** from hub root run `npm run zuno:external-observers-refresh` (wires **post-load** reality into Zuno—ordering matters).
5. **Confirm:** open `data/reports/zuno_system_state_report.json` — `external_observers.cloudflare_observer_state` and `external_observers_health.status` (expect `synced` + `fresh` when manifests are current).
6. **Then** complete [three-layer verification](#understood--three-layer-verification) (sections 1–4 + observer JSON) and paste the [quick report template](#7-quick-report-template-paste-back).

---

## If the URL returns 503 Service Unavailable

**Meaning:** Cloudflare’s edge is reachable, but **this Pages project is not being served correctly** yet. At soft launch this is **common** and usually points to **deployment configuration**, not a bug in your hub repo logic.

**Fast diagnosis (dashboard):**

1. **Workers & Pages** → find the project (e.g. `zsanctuary-omnai` or the name Wrangler created).
2. Open **Deployments** — latest run should be **Success**. **Failed** or **no deployments** explains a 503.
3. **Retry deployment** after fixing settings; transient 503s sometimes clear after a successful redeploy.

**Typical static-site fixes (Pages):**

| Symptom / mistake | What to check |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Wrong publish directory | Output path matches your bundle (e.g. site root has `index.html`) |
| Unnecessary build command | For pure static, build can be **empty**; wrong build = failed deploy |
| No `index.html` at deployed root | Bundle step in [MONOREPO_GUIDE.md](../MONOREPO_GUIDE.md) Task 008 must produce files under the uploaded folder |
| Wrong branch | Production branch matches what Pages watches (often `main`) |
| URL typo | Live URL must match **`https://<pages-project-name>.pages.dev`** exactly |

**After deployment is green:** load the URL until the page renders, **then** run `npm run zuno:external-observers-refresh` and confirm `cloudflare_observer_state` and `external_observers_health` in `zuno_system_state_report.json` (refresh after load, not before).

**Report back (dashboard):** project visible? (Y/N) · last deployment Success / Failed / none · exact URL used · any error line in deployment logs.

---

## 1. Basic life signal

Open the live URL (replace with yours if different):

`https://zsanctuary-omnai.pages.dev`

- Page loads (no blank screen)
- Layout not obviously broken
- Assets load (no mass 404 for CSS/JS/images)

---

## 2. Console (DevTools)

- **Red errors:** triage before expanding scope
- **Yellow warnings:** note; fix if they affect behavior or privacy
- **Clean:** strong signal for static hosting

---

## 3. Performance feel (human test)

- First paint / perceived lag
- Interaction stutter (if any UI)
- Quick check on mobile vs desktop if relevant

---

## 4. Network isolation (boundary)

- Unexpected third-party calls (only what you expect for this surface)
- No accidental coupling to vault, private APIs, or unrelated hub endpoints unless **intentional** for this deploy

OMNAI should behave as an **independent static surface** unless you explicitly designed coupling.

---

## 5. External observer sync (hub)

From **ZSanctuary_Universe** root:

```bash
npm run zuno:external-observers-refresh
```

Or at minimum:

```bash
node scripts/z_zuno_state_report.mjs
```

Confirm in JSON:

- `external_observers.cloudflare_observer_state` — `synced` / `drift` / `unknown`
- `external_observers_health.status` — `fresh` / `stale` / `partial` / `unknown`

**Ordering:** Run `npm run zuno:external-observers-refresh` **after** the live URL has proven a real load. Refreshing first can produce misleading “fresh” observer timestamps while the edge is still failing or uncached.

---

## Between first load and expansion

The first time the URL renders, it is easy to assume **“it works — move on.”** Hold that until you have **understood** what is live.

Use this order:

```text
Works → Stable → Understood → then expand
```

- **Works:** page loads; no blocking errors.
- **Stable:** repeat visit or second device if you can; deployment stays Success in Cloudflare.
- **Understood:** verified signals, not a vague feeling — see **three-layer verification** below.

Skipping **Understood** is how hidden coupling and surprise regressions appear later (the failure mode is **Works → expand**, instead of **Works → understood → expand**).

---

## Understood = three-layer verification

**Understood** means you have checked all three layers; missing one means you are still guessing.

| Layer | What it is | Where in this doc |
| ---------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| **1. Surface** | What users see and feel: renders, no obvious breakage, acceptable speed | [Basic life signal](#1-basic-life-signal), [Performance feel](#3-performance-feel-human-test) |
| **2. Structure** | What the runtime is doing: console errors, network calls, assets loading | [Console](#2-console-devtools), [Network isolation](#4-network-isolation-boundary) |
| **3. Observer** | What the hub recorded for comms alignment: Zuno external observers | [External observer sync](#5-external-observer-sync-hub), `data/reports/zuno_system_state_report.json` |

**Target observer fields** (when manifests are current and Cloudflare comms verify passed):

```json
{
  "external_observers": {
    "cloudflare_observer_state": "synced"
  },
  "external_observers_health": {
    "status": "fresh"
  }
}
```

Full paths: `external_observers.cloudflare_observer_state` and top-level `external_observers_health` in `zuno_system_state_report.json` (open the file to confirm exact nesting).

**Control loop (for reference):** execution (deploy) · validation (browser) · awareness (Zuno JSON) · decision (expand only after Understood).

---

## 6. Do not do yet (stability first)

- Custom domain (unless already planned under release governance)
- Wiring more modules into this surface without review
- Monetization / analytics without policy check

---

## 7. Quick report template (paste back)

```text
1. Page load: OK / Issue (describe)
2. Console: Clean / Errors (paste)
3. Speed feel: Fast / Medium / Slow
4. Network: Clean / Unexpected calls (describe)
5. Observer: cloudflare_observer_state = … | health = …
```

---

_Theoretical system becomes real when a URL responds; observation turns response into understanding — only then widen the blast radius._
