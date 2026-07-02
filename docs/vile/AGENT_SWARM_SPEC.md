# VILE Agent Swarm Specification

**Status:** Specification only · **no runtime**  
**Law:** All agents route through Universal Swarm Orchestrator

## Orchestration rule

```text
Client → API → DRP → Orchestrator → Single Agent Task → Shadow → Response
```

**Forbidden:** Agent ↔ Agent direct channels, shared memory without audit, or silent tool execution.

## Agent roster

| Agent | Domain | Outputs (examples) |
| ----- | ------ | ------------------- |
| **PlannerAgent** | Itineraries, trip structure | Day plans, constraints |
| **LogisticsAgent** | Transport, timing | Routes, connections |
| **KnowledgeAgent** | Destination facts | Sourced summaries — cite or abstain |
| **CultureAgent** | Heritage, etiquette | Respectful cultural context |
| **KidsSafetyAgent** | Child protection | Age-appropriate filters, escalation |
| **MedicalAgent** | Health guidance | **Information only** — not diagnosis |
| **RiskAgent** | Weather, geopolitical, site risk | Risk scores + disclaimers |
| **FinanceAgent** | Pricing estimates | Abstracted money — no settlement |
| **AccessibilityAgent** | Mobility, sensory needs | Inclusive alternatives |
| **SustainabilityAgent** | Environmental impact | Low-impact options |
| **LegalComplianceAgent** | Permits, visas (info) | Flag professional review |
| **ShadowValidator** | Pipeline gate | Pass/fail + reasons |
| **DRPGuardian** | 14 DRP enforcement | Block / allow / escalate |
| **LearningAgent** | Feedback loops | Anonymised learning proposals — human approve |

## Contract alignment

Use types from `packages/zuno-orchestrator-contracts`:

- `ZunoRequest`  
- `ZunoTaskPlan`  
- `ZDRPDecision`  
- `ZVerificationResult`  

## Autonomy posture

```text
Documented ≠ Implemented ≠ Running
```

Swarm is **not** enabled in hub today. Enabling runtime requires AMK gate + phase receipt.

## Ethical constraints

- Never fabricate vendors, permits, or medical clearance  
- Escalate child safety and medical edge cases to human review  
- Respect [ETHICAL_AI_CHARTER.md](ETHICAL_AI_CHARTER.md)  

## Related

- [SHADOW_VALIDATION_PIPELINE.md](SHADOW_VALIDATION_PIPELINE.md)  
- [Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md](../Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md)
