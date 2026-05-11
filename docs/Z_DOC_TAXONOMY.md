<!-- Z: docs\Z_DOC_TAXONOMY.md -->

# Z-Documentation Taxonomy

Z-Sanctuary treats documentation as a living system. Different doc types serve different roles,
so lint rules are governed by purpose, not one-size-fits-all.

## Doc Roles

| Doc Type | Purpose | Lint Philosophy | Location |
| ------------------ | ---------------------- | --------------------- | ---------------- |
| README, GUIDE | Onboarding + clarity | Strict, clean | Repo root, docs/ |
| CODEX, MANIFEST | Living doctrine | Flexible, intentional | docs/codex/ |
| REPORT, LOG | Machine-narrated truth | Minimal noise | docs/ |
| RITUAL, PHILOSOPHY | Reflective, symbolic | Expressive freedom | docs/codex/ |

## Lint Governance

- Root config keeps baseline clarity (line length off, core rules on).
- docs/ enforces strict headings and structure.
- docs/codex relaxes duplicate headings and single-H1 constraints.

See:

- `.markdownlint.json`
- `docs/.markdownlint.jsonc`
- `docs/codex/.markdownlint.jsonc`

## Doctrine

Documentation is not static text.
It is a cognitive system that must align with intent.
Tools adapt to truth; truth does not adapt to tools.

## Z BGC Reference

- `docs/bgc/INDEX.md`

## Z OCTAVE Reference

- `docs/octave/INDEX.md`
- `products/Z-OCTAVE/README.md`
- `docs/ZALS_DELIVERABLE_1_SHOPPING_CHECKLIST.md`
- `docs/ZALS_DELIVERABLE_2_PROCUREMENT_PLAN.md`

## Z Gadget Mirrors Reference

- `apps/z_gadget_mirrors/docs/MDE_OVERVIEW.md`
- `apps/z_gadget_mirrors/docs/MODULE_CONTRACT.md`

## Governance Blueprint Reference

- `docs/z_zero_trust_governance_v1.md`
- `rules/Z_REQUEST_ONLY_ACCESS_POLICY.md`
- `docs/Z_RESEARCH_REVIEW_PROTOCOL.md`
- `docs/Z_REQUEST_ACCESS_TOKENS.md`
- `docs/Z_PROOF_30_ROADMAP.md`
- `config/z_data_leak_policy.json`
- `config/z_extension_guard_policy.json`
- `docs/Z_SECURITY_SENTINEL_PACK.md`
