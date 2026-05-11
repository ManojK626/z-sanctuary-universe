# Z-Formula Swarm Co-Design Engine

**Phase:** Z-SWARM-14DRP-1
**Mode:** symbolic formula + read-only classifier.

## Intent

Z-Formula is a **classification and routing engine**, not an execution engine.

Input signals:

- reports
- registries
- signal posture
- project identity
- route maps
- API/SSWS requirements
- AMK indicators

Output posture:

- `GREEN` / `YELLOW` / `BLUE` / `RED`
- smallest safe next action
- AMK-required decision list
- rollback note

## Formula steps

1. Identify project and repo root.
2. Read available reports.
3. Map project identity.
4. Classify current signal.
5. Detect forbidden lanes.
6. Detect missing evidence.
7. Detect cross-project drift.
8. Choose smallest reversible next step.
9. Assign AMK-required decisions.
10. Write report and rollback note.

## Symbolic map interpretation

| Symbol | Safe interpretation in this phase |
| --------------- | -------------------------------------------------------------- |
| Z-Stage | current phase/readiness stage |
| Mango Tree | growth branches and maturity |
| Tarzan Tree | safe movement path between branches |
| Quadruple Spine | API, data, build, oversight (+ identity/safety spine metadata) |
| Whale Bus | future event-bus registry only, not live runtime |
| Quantum Swarm | symbolic label for cooperating validators, not physics claim |

## Z-Troublemaker role

`z_troublemaker_ai` is a **misalignment finder**:

- catches contradictions between claims and evidence
- flags forbidden authority claims
- highlights drift and fake-readiness narratives

It does **not** attack, deploy, execute, or escalate outside report mode.

## Relation to existing lanes

- [Z_TRAFFIC_MINIBOTS.md](Z_TRAFFIC_MINIBOTS.md): report signals.
- [AMK_AUTONOMOUS_APPROVAL_LADDER.md](AMK_AUTONOMOUS_APPROVAL_LADDER.md): auto-safe vs AMK-required routing.
- [Z_AUTONOMOUS_GUARDIAN_LOOP.md](Z_AUTONOMOUS_GUARDIAN_LOOP.md): L0/L1 evidence-first posture.
- [Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md](Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md): universal legal boundary for all swarm helpers.

## Hard boundary

This phase adds no:

- runtime swarm execution
- provider/API calls
- deployment
- billing mutation
- bridge execution
- auto-launch
- secret handling
