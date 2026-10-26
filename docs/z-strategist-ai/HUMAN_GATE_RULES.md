# Z-Strategist AI — Human Gate Rules

**Posture:** AMK-Goku authority preserved · no AI auto-approval

## Principle

Readiness indicators inform. **Humans decide** sacred moves.

## AMK-Goku Final Gate

Every project readiness card ends with:

| Status | Meaning |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| **Approved** | AMK explicitly approved a **named, scoped** action only (e.g. "merge PR #X", "static exhibit review") |
| **Hold** | Default — no deploy, no revenue, no registration filing |
| **Needs review** | Steward, legal, accounting, or partner input required |

**Approved** never means blanket permission for all future stages.

## Sacred moves (always Hold until AMK)

- Merge to `main` on high-governance repos
- Deploy or bind production domains
- Payment, subscription, or booking activation
- Business registration or VAT filing
- Banking / merchant account setup
- Public launch with real users
- Bulk user data actions
- NAS production exposure
- Cross-repo runtime bridges without charter

## AI and automation boundaries

| Allowed | Not allowed |
| ----------------------------------- | -------------------------------------- |
| Suggest next readiness card to fill | Auto-set Human Gate to Approved |
| Summarize indicator gaps | Auto-merge or auto-deploy |
| Draft PR checklist from readiness | Claim legal/tax clearance |
| Read-only rollup suggestions | Execute queue items from Cycle Observe |

## Deployment-ready rule

A project **must not** be marked deployment-ready unless:

- [ ] Clear project owner
- [ ] Clear purpose
- [ ] Clear user group
- [ ] Privacy/safety note
- [ ] Revenue status documented
- [ ] Registration review status documented
- [ ] Human gate status documented
- [ ] No RED on Deployment Risk or Revenue Activation Risk without explicit AMK exception

## Stage advance gates

| Transition | Minimum gate |
| ------------ | ----------------------------------------- |
| → Stage 3 | Security + privacy review recommended |
| → Stage 4 | Registration + banking review recommended |
| → Stage 5 | Tax/VAT + accounting review recommended |
| → Any deploy | AMK-Goku Final Gate = Approved (scoped) |

## Turtle Mode alignment

- Branch prefix: `cursor/zsanctuary/`
- PR workflow — no direct `main` edits
- One domain per PR where possible
- Docs/mock-first unless receipt charters more

## ZILWA-specific hold

ZILWA PRs #16–#19 remain **Draft · HOLD** until steward listening (2B) and impact framework (3A) gates clear.

## Receipt linkage

Phase 0 Z-Strategist implementation: [GREEN_RECEIPT.md](GREEN_RECEIPT.md)
