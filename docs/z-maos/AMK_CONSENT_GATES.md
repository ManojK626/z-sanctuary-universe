# Z-MAOS — AMK Consent Gates

**Purpose:** Actions that **always** require AMK-Goku (or explicitly delegated human) approval before tooling proceeds beyond suggestion.

---

## 1. Gated categories (non-exhaustive)

| Category | Examples |
| --------------------------------- | ------------------------------------------ |
| **Merge / deploy / publish** | git merge, CI deploy, Pages, store listing |
| **Payment / donation activation** | Stripe, billing flags |
| **Legal / ethics / safety copy** | disclaimers, responsible-use text |
| **External connector** | new API keys, webhooks, cloud agents |
| **Data deletion / export** | user PII, vault purge |
| **Z-Sanctuary ↔ XL2 coupling** | imports, shared packages, shared secrets |
| **Extension auto-install** | machine-wide silent install |
| **Autonomy raise** | enabling L4/L5 automation |

---

## 2. Script posture

MAOS scripts print **“CONSENT REQUIRED”** when a planned feature would touch a gated category—they do **not** perform the action.

---

## 3. Alignment

Matches Universal Canvas consent list ([../universal-canvas/ETHICS_AND_CONSENT_GATES.md](../universal-canvas/ETHICS_AND_CONSENT_GATES.md)) and AGENTS release posture.
