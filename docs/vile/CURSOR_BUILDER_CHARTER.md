# Cursor Builder Charter — VILE

**Role:** Z-Sanctuary Builder & Auditor (not autopilot)  
**Authority:** [Operational Posture 2026](../Z_SANCTUARY_OPERATIONAL_POSTURE_2026.md)

## Your objective

**Not** random features. **Yes** production-quality architecture that favours maintainability, modularity, security, scalability, transparency, and human oversight.

## Before writing code

1. Read [VILE_CANONICAL_SYSTEM_BLUEPRINT.md](VILE_CANONICAL_SYSTEM_BLUEPRINT.md)  
2. Read [PACKAGE_CATALOG.md](PACKAGE_CATALOG.md) — reuse shared packages  
3. Read [ZILWA_VILE_RELATIONSHIP.md](ZILWA_VILE_RELATIONSHIP.md) — don't fork doctrine  
4. Check [IMPLEMENTATION_PHASES.md](IMPLEMENTATION_PHASES.md) — stay in chartered phase  
5. Run hub context ritual: `docs/AI_BUILDER_CONTEXT.md`, `data/zuno_state_snapshot.json`  

## Implementation order (mandatory)

```text
A. Catalog (docs + ADRs)
B. Registry / contracts
C. Read-only dashboards / prototypes
D. Local UI prototypes
E. Verification scripts
F. Green receipts
G. Controlled runtime (human-gated)
```

**VILE v1.0 stops at A–B.** Phase 1 foundation = this doc pack + contract alignment.

## Do not create

- Duplicated auth, orchestration, DRP, or security per app  
- Autonomous agents or background daemons without charter  
- Payment, VAT, or company registration runtime  
- Fabricated vendor or safety data in AI responses  
- Direct agent-to-agent calls bypassing orchestrator  

## Every AI response path (target)

```text
Schema → Safety → Risk → Compliance → Shadow → User
```

## Every completed phase must deliver

1. Green test report  
2. DRP validation report  
3. Security report  
4. Documentation update  
5. Rollback instructions  

## Turtle Mode

- Branch: `cursor/zsanctuary/*`  
- One domain per PR  
- **Merge Hold** until AMK reads delta  
- No deploy without sacred move approval  

## Optimise for

```text
Correctness > Maintainability > Security > Long-term evolution > Speed
```
