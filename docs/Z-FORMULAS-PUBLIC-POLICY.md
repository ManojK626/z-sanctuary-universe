# Z-Formulas — Public tier policy (all Z-Sanctuary root projects)

_Governance for hubs, panels, chatbots, APIs, and docs that face operators or the public._

---

## Scope

This policy applies to **every Z-Sanctuary root repository** in the ecosystem (including this one and sibling roots under the same Organiser). Where a product has a user-facing surface (HTML hub, dashboard, chat, generated email, or public API text), **Z-Formulas content stays at the public tier** unless an explicit, separate Creator workflow says otherwise.

---

## Public tier (allowed)

- **Short orientation only** — plain-language role of the living engine, DRP alignment, heart-first / Z-Ultra Instincts _as concepts_, and links to trust and compliance material.
- **Canonical public doc:** [Z-FORMULAS-SHORT-EXPLANATIONS.md](Z-FORMULAS-SHORT-EXPLANATIONS.md) (and summaries consistent with it).
- **Disclosure rules:** [Z-PROTOCOLS-DISCLOSURE.md](Z-PROTOCOLS-DISCLOSURE.md).

---

## Creator-reserved (not for public surfaces)

- **Full definitions, derivations, variable lists, proofs, or line-by-line reproduction** of the internal formulas document (e.g. **Z-FORMULAS-AND-ULTRA-INSTINCTS.md** and any successor or fork marked Creator-reserved).
- **Embedding or deep-linking** that document from consumer UIs where end users could obtain full text without a controlled Creator path.
- **LLM system prompts or RAG corpora** that include the full Creator document for unrestricted chat — use the short doc and this policy instead; instruct models to **refuse** full-formula dumps and point to the public docs.

---

## Implementation checklist (per repo)

1. Hub and dashboard **panels** state clearly: brief explanations only; full engine reserved for the Creator.
2. **Chat** (fallback knowledge + OpenAI-style system prompts): refuse “full / complete / paste / derive / all variables”; link to short explanations + this policy + protocols.
3. **Docs index** lists this file next to the short explanations and protocols.
4. **MODULES-EXPANDED** (or equivalent) does not treat the public site as a host for the full formula file.

---

## Why

Protects the integrity of the engine, reduces misuse and shallow copying, and keeps a single **trust boundary**: the public sees _enough_ to align with ethics and product direction; the Creator path holds _complete_ specification.

We Are One.
