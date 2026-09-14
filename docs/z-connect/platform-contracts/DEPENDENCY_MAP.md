# Z-Connect Contract Dependency Map

**Version:** 1.0 · Phase 1.5 B1

## Master diagram

```mermaid
flowchart TB
  DEF[common / _definitions]

  subgraph user_domain [user]
    UP[profile]
    UI[interests]
    UPS[privacy-settings]
  end

  subgraph consent_domain [consent]
    CR[consent-record]
    CS[consent-scope]
    SEC[shared-experience-consent]
    DBC[dream-baby-consent]
  end

  subgraph ai_domain [ai]
    ADS[ai-discovery-session]
    CSUM[conversation-summary]
    CE[confidence-explanation]
  end

  subgraph discovery_domain [discovery]
    DJ[ai-discovery-journey]
    DS[discovery-summary]
    PE[profile-evolution]
    CCE[connection-confidence-evolution]
  end

  subgraph connection_domain [connection]
    CI[compatibility-insight]
    CC[connection-confidence]
    CQ[connection-request]
  end

  subgraph governance_domain [governance]
    AE[audit-event]
    DRP[drp-decision-reference]
    SH[shadow-validation-reference]
    OBS[observability-reference]
  end

  subgraph family_domain [family]
    DBS[dream-baby-session]
  end

  DEF --> user_domain
  DEF --> consent_domain
  DEF --> ai_domain
  DEF --> discovery_domain
  DEF --> connection_domain
  DEF --> governance_domain
  DEF --> family_domain

  CS --> CR
  CR --> ADS
  CR --> DJ
  SEC --> DBC
  DBC --> DBS

  UP --> PE
  ADS --> DJ
  DJ --> DS
  UP --> CI
  CI --> CC
  CC --> CCE

  ADS --> CSUM
  CI --> CE

  AE --> DRP
  AE --> SH
  AE --> OBS
```

## Dependency rules

| Rule | Detail |
| ---- | ------ |
| **Acyclic** | No schema `$ref` cycles detected in v1 |
| **Root** | All domain schemas `$ref` common `_definitions` only |
| **Cross-domain** | `connection-confidence` embeds `compatibility-insight` by `$id` URL |
| **Consent first** | AI sessions and shared family features reference consent records |
| **Governance refs** | Audit events link to hub DRP/Shadow/Observability — not embedded runtime |

## Hub package alignment (future)

| Z-Connect contract | Hub package |
| ------------------ | ----------- |
| `shadow-validation-reference` | `@z-sanctuary/zuno-shadow` |
| `drp-decision-reference` | `@z-sanctuary/zuno-drp` |
| `observability-reference` | `@z-sanctuary/zuno-observability` |
| `ZDRPDecision` shape | `zuno-orchestrator-contracts` |

## Verification

- No duplicate model IDs across domains  
- No circular `$ref` chains in v1 catalog  
- Forbidden keys absent from schemas and examples (validate script)
