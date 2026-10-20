# Stale authority boundary 0

**Date:** 2026-10-20
**Base:** `origin/main` `489d299bffc478ad6d0bbfefd123368e56bca351`
**Mode:** documentation only

This note separates stored reports from a fresh readiness derivation, a technical gate pass, human approval, and deployment permission. It does not rewrite those reports, change gates, or grant any authority.

A timestamp on a report records when that file was written. It does not prove the claim is still true. The readiness gate also does not treat an old `generated_at` as an automatic block. Currency comes from a new source-relative attestation, not from the age of a JSON or Markdown file.

## Five authority classes

| Class | Meaning |
| --- | --- |
| `HISTORICAL_EVIDENCE` | A stored file. Kept as written. Not present permission. |
| `CURRENT_DERIVED_STATE` | A fresh attestation from the current gates module and override file. |
| `TECHNICAL_AUTHORIZATION` | The default execution gate accepts only an exact fresh `ALLOW_PROGRESS`. |
| `HUMAN_APPROVAL` | Release control names a person, a time, and a binding to that exact attestation. |
| `DEPLOYMENT_AUTHORITY` | `evaluateDeployment` returns `deploy_allowed: true` and code `AUTHORIZED`. |

These classes are not interchangeable. A file can sit in the first class while the later classes remain closed.

## What the stored files say

| Source | Written | Stored claim | Class |
| --- | --- | --- | --- |
| `data/reports/zuno_state_of_system_latest.md` | 2026-02-13 | Overall state GREEN, with lint and tests marked PASS | `HISTORICAL_EVIDENCE` |
| `data/reports/z_execution_enforcer.json` | 2026-04-26 | `action` `ALLOW_PROGRESS`, `enforcement.deploy_allowed` `true`, and a nested readiness line of 4/4 | `HISTORICAL_EVIDENCE` |
| `data/reports/z_octave_readiness.json` | 2026-02-13 | `ready` `false`, four gates, none passing | `HISTORICAL_EVIDENCE` |
| `data/reports/z_cycle_observe_status.md` | 2026-05-12 | Observation tower only. It suggests and classifies. It does not execute the task queue. | `HISTORICAL_EVIDENCE` |
| `data/z_release_control.json` | timestamp 2026-04-26 | `manual_release` `true`, a named approver, a timestamp, and no `bound_attestation` object | `HISTORICAL_EVIDENCE` until a binding exists |
| `docs/octave/INDEX.md` | index status line | Status word Active, comfort and support only | Product-index wording, not the readiness gate |

Stored GREEN is not current system health. Stored `ALLOW_PROGRESS` is not current execution authority. Stored `deploy_allowed: true` is not deployment permission.

## What a fresh derivation says

On this base, `deriveAttestation` from `scripts/z_readiness_attestation.mjs` reads the current Z-OCTAVE gates module. The result observed for this note is:

- `ok` `true`
- `ready` `false`
- `gates_pass` `0`
- `gates_total` `4`

That is the current derived state. Z-OCTAVE remains 0/4. The accepted continuity decision of 2026-10-20 holds it there. `docs/octave/INDEX.md` saying Active does not change this vector.

`computeOctaveBridgeMetrics` in `scripts/z_zuno_state_report.mjs` keeps bridge counts in separate fields. A bridge pass does not fill the octave gate vector and does not make Z-OCTAVE ready.

Passing the same derived attestation to `evaluateDeployment` with the stored release control, and with technical pass forced only as a check, returns `UNBOUND` and `deploy_allowed: false`. The stored control has no `bound_attestation`. With technical pass left false, because the product is not ready, the same function returns `TECHNICAL_BLOCK`.

## How the gate uses those facts

`scripts/z_execution_enforcer_gate.mjs` recomputes a decision from the stored report plus a fresh attestation.

`--verify-only` is observation. `assessVerifyOnly` keeps `deploy_allowed` false and `execution_authority` at `none`. It refuses a decision whose `accept` is true, whose action is `ALLOW_PROGRESS`, or whose `deploy_allowed` is true. A successful verify-only run prints that no execution authority was granted. It does not print `Gate passed`.

The default path is stricter. It exits with a block unless the recomputed decision has action `ALLOW_PROGRESS` and `accept` true. `acceptProgress` gives that result only when all of the following hold:

1. The stored action is exactly `ALLOW_PROGRESS`.
2. The fresh derivation succeeds.
3. The stored attestation matches the fresh attestation.
4. `assessTechnical` passes: every gate in the vector passes, `ready` is true, and the pass count equals the total.

Anything else stays `BLOCK` with `deploy_allowed` false. A stored allow that claims 4/4 while the fresh vector is 0/4 does not match, so it does not pass.

`Gate passed` is technical authorization of that exact fresh allow. It is not deployment authority. The gate does not treat `deploy_allowed` as the condition for that line.

## What deployment still requires

Deployment is a separate check in `evaluateDeployment` and `requireDeployment`:

1. Technical pass on the fresh attestation.
2. `manual_release` true.
3. A non-empty approver string.
4. A timestamp.
5. A `bound_attestation` object whose gates-module hash, override hash, override state, ready flag, and gate vector equal that fresh attestation.

Only then is `deploy_allowed` true and the code `AUTHORIZED`. The preview and production Wrangler scripts in `package.json` call `scripts/z_readiness_attestation.mjs --require-deployment` before Wrangler. This note does not run those scripts.

## Which source answers which question

| Question | Authoritative source | Not sufficient |
| --- | --- | --- |
| What did a past run record? | The stored report, read as `HISTORICAL_EVIDENCE` | Using that record as today's permission |
| Is Z-OCTAVE ready now? | Fresh `deriveAttestation` (`CURRENT_DERIVED_STATE`) | `zuno_state_of_system_latest.md`, the April enforcer 4/4 line, or the octave index status word |
| May the technical gate pass? | Recomputed `ALLOW_PROGRESS` with `accept` true (`TECHNICAL_AUTHORIZATION`) | A stored `ALLOW_PROGRESS` field, or `--verify-only` |
| Has a person approved this exact attestation? | `bound_attestation` on release control (`HUMAN_APPROVAL`) | `manual_release` alone, or a historical approver and timestamp |
| May a deploy start? | `evaluateDeployment` code `AUTHORIZED` (`DEPLOYMENT_AUTHORITY`) | `enforcement.deploy_allowed` inside the April enforcer report |

## Consumer risk

A person or a script that reads `deploy_allowed` or GREEN from the stored files can mistake a historical claim for current permission. The safeguard is to derive again from the gates module and then apply the gate and the deployment check. The historical files stay as evidence of what they recorded on their own dates.
