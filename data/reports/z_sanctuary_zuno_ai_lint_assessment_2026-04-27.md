# Z-SANCTUARY_ZUNO_AI — lint assessment (read-only, 2026-04-27)

**Purpose:** Classify remaining `lint:root` issues for `Z-SANCTUARY_ZUNO_AI/` before any edits. **No files in that folder were changed** to produce this report.

**Evidence:** `npx eslint Z-SANCTUARY_ZUNO_AI --ext .js,.mjs,.cjs` (hub root), plus source review.

## Summary

| Category | Count (approx.) | Notes |
| ------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| **`quotes` (double → single)** | **~143** auto-fixable with `eslint --fix` on that tree | Mechanical; no logic change. |
| **`no-undef`** | **1** | `ProtocolEnforcer_Instance` at `SECURITY_VERIFICATION.js` (line ~179 in current file). |
| **Warnings (`no-unused-vars`)** | **2** | See below. |

**Folder total (ESLint):** **146** problems (**144** errors, **2** warnings) within `Z-SANCTUARY_ZUNO_AI` only (matches current root gate when the rest of the repo is clean).

## Files with any finding (4)

1. `Z-SANCTUARY_ZUNO_AI/SECURITY_VERIFICATION.js` — largest file; **quotes** + **one `no-undef`**.
2. `Z-SANCTUARY_ZUNO_AI/SETUP_GUIDE.js` — **quotes** only (small tail section).
3. `Z-SANCTUARY_ZUNO_AI/protocols/ai-identifier.js` — **quotes** only.
4. `Z-SANCTUARY_ZUNO_AI/protocols/protocol-enforcer.js` — **quotes** + **2** warnings.

## Quote-only (safe first pass)

Apply **only** to this directory (no cross-repo mass-fix):

```bash
npx eslint Z-SANCTUARY_ZUNO_AI --ext .js,.mjs,.cjs --fix
```

Then re-run lint; expect **3** non-auto issues left: **1** `no-undef` + **2** warnings (until addressed).

## `no-undef`: `ProtocolEnforcer_Instance` (SECURITY_VERIFICATION.js)

**What it is:** The file header states it is meant to be **pasted in the browser console** to audit isolation. It defines `class SecurityAudit` and references **`ProtocolEnforcer_Instance`** as a **global** created in **`protocols/protocol-enforcer.js`**:

```text
// protocol-enforcer.js (end)
const ProtocolEnforcer_Instance = new ProtocolEnforcer();
```

**Classification:** **Browser-console prototype / audit script**, not a Node entrypoint. In real use, the user is expected to load `protocol-enforcer.js` first so the global exists. ESLint does not know that and flags **direct** use of `ProtocolEnforcer_Instance` (e.g. `const auditLog = ProtocolEnforcer_Instance.getAuditLog()`) as **`no-undef`** even though `typeof ProtocolEnforcer_Instance === 'undefined'` checks appear earlier.

**Safer fix paths (pick one; human review first):**

1. **`/* global ProtocolEnforcer_Instance */`** at the top of `SECURITY_VERIFICATION.js` (documents intentional browser global; pair with a comment that enforcer must load first).
2. **`globalThis.ProtocolEnforcer_Instance`** for reads (explicit global object; may still need one-line comment for load order).
3. **ESLint `overrides`** in `.eslintrc.json` for `Z-SANCTUARY_ZUNO_AI/**/*.js` with `env: { browser: true }` and `globals: { ProtocolEnforcer_Instance: 'readonly' }` — centralizes the contract.
4. **Do not** “fix” by inventing a Node `require` unless this tree is repackaged as a module; that would change runtime assumptions.

**Not recommended without operator sign-off:** deleting or stubbing the audit; merging files blindly.

## Warnings (protocol-enforcer.js)

- **`operationScope`** (e.g. `authorizeOperation(operationName, operationScope)`) — parameter **never read**; safe to prefix `_operationScope` or omit name if the signature must stay for callers.
- **`ProtocolEnforcer_Instance`** assigned at module end — **intentional side effect** to expose the singleton; ESLint sees “assigned but never used” because the **binding** is not read in this file. Safer than deleting: `void ProtocolEnforcer_Instance;` or attach to `globalThis` explicitly and reference once, or `eslint-disable-next-line` with a one-line justification.

## SECURITY_VERIFICATION.js: executable vs demo

| Aspect | Verdict |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Executable?** | **Yes** — it is **runnable** JS (classes, `document`, `window`, `console.log`). |
| **Intended host** | **Browser** (not Node `test` or hub `node scripts/...`). |
| **Role** | **Operator / dev audit** pasted in console, per file comments — **prototype** quality, not the ZSanctuary hub release gate. |

## SETUP_GUIDE.js

- Mostly a **large template literal** printed to the console (documentation as script) plus `window.ZUNO_SETUP_CONFIG`.
- **Quote issues** are in the final object at the bottom (`"..."` → `'...'`) and are **mechanical** under `--fix`.

## ai-identifier.js

- **Browser-oriented** protocol helpers; **quote-only** findings in the current run.

## Recommended order (next session)

1. **Human** confirms: global + load-order story is still desired (or mark folder `legacy` / `browser-only` in a one-line README).
2. **`eslint --fix` on `Z-SANCTUARY_ZUNO_AI` only** (or scoped npm script).
3. **Fix `no-undef` + 2 warnings** with one of the safe paths above — **no** blind rename of `ProtocolEnforcer` API until a human checks consumers.
4. **`npm run verify:full:technical`** from hub root.

---

_Z-Sanctuary — assessment only; no `Z-SANCTUARY_ZUNO_AI` source edits in this change._
