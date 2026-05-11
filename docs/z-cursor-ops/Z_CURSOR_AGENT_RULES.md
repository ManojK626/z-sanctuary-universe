# Z Cursor agent rules (Cursor Ops)

**Binding style:** Treat every prompt in `docs/z-cursor-ops/prompts/` as a **scoped contract**. If the prompt says read-only, stay read-only.

## Always

- Read [Z_MASTER_REQUIREMENTS_QUEUE.md](Z_MASTER_REQUIREMENTS_QUEUE.md) and obey **READY / BLOCKED** posture.
- Prefer hub truth: `data/z_master_module_registry.json`, MAOS manifests, [AI_BUILDER_CONTEXT.md](../AI_BUILDER_CONTEXT.md).
- State **exact files** you will touch before editing; keep one domain per change set when possible (per Turtle Mode).
- Run only **verification commands listed in the prompt** or standard hub read-only scripts.

## Never (unless explicit human charter says otherwise)

- Auto-merge, auto-deploy, auto-publish.
- Payment, pricing, checkout, or responsible-use/legal copy changes from a “workflow” prompt.
- New external network services or connector credentials in repo files.
- XL2 code coupling beyond **reference** docs and registry pointers.
- Flipping governance “amber” to “green” without documented restore drill and human sign-off (hub policy).

## Sacred moves (human-gated)

Merge, deploy, payment, legal/safety wording, public launch, external connections, Z-Sanctuary ↔ XL2 coupling, user data deletion/export, NGO/investor dispatch — **stop** and request AMK approval path documented in [docs/z-maos/AMK_CONSENT_GATES.md](../z-maos/AMK_CONSENT_GATES.md).

## Escalation

If evidence conflicts with the prompt, **do not proceed** — update handoff with `REVIEW_NEEDED` and cite paths.
