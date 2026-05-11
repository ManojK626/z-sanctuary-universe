# Z-LEGAL-BENCH-1 — Global Benchmark and Legal Readiness Panel

This document defines an **internal, read-only** benchmark surface inside the **Z-Lawyer Command Workstation (UX-2)**. It helps operators and retained lawyers **see where the ecosystem stands on governance readiness** — without claiming certification, valuation, compliance, legal advice, or permission to launch.

## Non-goals (hard boundaries)

| Do not claim | Do not ship in this phase |
| ---------------------------------------------------- | -------------------------------------------------- |
| “Certified,” “approved,” “compliant,” “audit passed” | Automatic scoring from user behaviour or telemetry |
| Legal conclusions or mandates | Evidence submission or client intake |
| Valuation or investment grade | Payments, subscriptions, billing |
| A substitute for human lawyers | External APIs, live AI providers, deploy buttons |

Companion gate: Hub rules in `AGENTS.md` and Turtle Mode remain authoritative. No autonomous merge, deploy, or launch.

## What the panel shows

The HTML workstation loads **`dashboard/data/z_legal_benchmark_readiness.json`**. Editors (AMK/operators) assign **signals** and **categories** deliberately. Rendering is deterministic: **`dashboard/scripts/z-legal-benchmark-readonly.js`** plus **`dashboard/scripts/z-legal-lawyer-workstation-readonly.js`**.

### Categories (baseline set)

| Area | Readiness lens |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| AI governance | AI Act awareness, literacy and prohibited-practice posture (as applicable); human gates; provider boundaries — checklist only |
| Data protection | GDPR-aligned documentation posture; controller–processor contracts where personal data is processed on behalf of a controller |
| Product / IP | Invention trails, trademarks, copyrights, patents where relevant; manufacturer and claims discipline |
| Commercial | Pricing, refunds, entitlement boundaries across projects |
| Accessibility | WCAG / EAA / EN 301 549-style readiness — not a certification badge |
| Deployment | Pre-launch checklist: domain, privacy/terms, rollback, staged release (e.g. Cloudflare Pages via Git integration, Direct Upload, or C3) |
| Evidence / audit | Receipts, reports, traffic/registry signals traceable to humans |
| Risk queue | Items explicitly flagged for lawyer review before public claims |

Official regulatory text and authoritative guidance evolve; **primary sources and counsel decide** applicability to your facts.

### Signal vocabulary

| Signal | Meaning |
| ------ | ------------------------------------------------------------------------- |
| GREEN | Artifacts appear ready for the **next internal or legal review step** |
| BLUE | **Human/legal decision** needed — not treated as launch-safe alone |
| YELLOW | Gaps or clarifications recommended before progressing |
| RED | Treat as blocking **strong public/marketing posture** until reviewed |
| PURPLE | Roadmap-only / speculative — not operational claim |
| GOLD | Narrative or receipts **internally strong** — still **not** certification |

## Files

| Path | Role |
| ---------------------------------------------------------- | ------------------------------------------------- |
| `dashboard/data/z_legal_benchmark_readiness.json` | Editable readiness content (signals, copy, links) |
| `dashboard/scripts/z-legal-benchmark-readonly.js` | Renders benchmark HTML from JSON |
| `dashboard/scripts/z-legal-lawyer-workstation-readonly.js` | Workstation bootstrap; new tab `Global Benchmark` |
| `dashboard/styles/z-legal-lawyer-workstation.css` | Layout and caution styling |
| `dashboard/Html/z-legal-lawyer-workstation.html` | Loads benchmark script before workstation script |

## Operator instructions

1. Edit JSON only — no code change required for copy/signal/link tweaks.
2. Keep disclaimer lines visible at the top of the panel.
3. Prefer **BLUE** where law or facts are unclear; never mark **GREEN** as “fine to market worldwide” unless counsel agrees in writing outside this tool.
4. Link categories to receipts and doctrines that exist in-repo; avoid orphan links.

## Verification

From hub root:

- `npm run verify:md`
- `npm run dashboard:registry-verify`
- `npm run z:traffic`

Manual: Open `dashboard/Html/z-legal-lawyer-workstation.html` in the browser via the hub’s usual static-server flow; activate **Global Benchmark** tab.

## Rollback

Remove the tab wiring and scripts from `z-legal-lawyer-workstation-readonly.js`, delete or restore `z-legal-benchmark-readonly.js`, `z_legal_benchmark_readiness.json`, and related CSS blocks; revert HTML script tags. Restore docs if needed from Git history.
