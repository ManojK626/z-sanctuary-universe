# Track B — Next generation surface (audit)

Lane: **INACCORDANCE** (risks) with engineering actions recorded.

## Intent

Prepare `apps/web` for a future **Next 15+** upgrade without mixing formal correspondence: isolate **R3F/Three** from SSR/prerender, keep **React 18** aligned with `@react-three/fiber` v8 until a deliberate React 19 + R3F upgrade, and add a **direct ESLint CLI** entry point before `next lint` removal (Next 16 direction).

## Risks (open until Next upgrade branch is merged)

- **Dual React**: upgrading to React 19 before **drei/fiber** peers allow a single tree can reproduce prerender failures.
- **SSR + WebGL**: any route that statically imports R3F/Three can break static generation; use **`next/dynamic` + `ssr: false`** for those subtrees.
- **Lint**: `next lint` is deprecated in Next 15+; **`npm run lint:eslint`** uses the same `.eslintrc.json` via ESLint CLI for migration rehearsal.

## Actions applied (this report)

- Home `/`: **`SKKRKPKOverlay`** loaded with **`dynamic(..., { ssr: false })`** so the Fiber canvas is not pulled into the server bundle for prerender.
- **`package.json`**: script **`lint:eslint`** invokes the **hoisted** ESLint at repo root (`node ../../node_modules/eslint/bin/eslint.js src --ext .js,.jsx`) so it works under npm workspaces where `eslint` is not duplicated under `apps/web/node_modules`.

## Next steps (when you open a Next 15 branch)

1. Bump `next` / `eslint-config-next` in lockstep; keep **ESLint 8** + `.eslintrc.json` until you choose ESLint 9 + flat config.
2. Run **`npm run build`** and fix any remaining prerender errors route by route.
3. Optionally upgrade **@react-three/fiber** / **drei** for React 19 **after** React alignment is explicit in `package.json` and `npm ls react` shows one version.
