# State Index — Experience State Contracts v1

| Experience | Terminal states | Gated transitions | Domain schema | Flow |
| ---------- | --------------- | ----------------- | ------------- | ---- |
| [Discovery Journey](states/DISCOVERY_JOURNEY_STATE.md) | archived | learning (Consent+Shadow), completed (Shadow) | `ai-discovery-session` | AI Discovery |
| [Connection Request](states/CONNECTION_REQUEST_STATE.md) | closed | sent (Consent), accepted (—) | `connection-request` | Connection Request |
| [Dream Baby Studio](states/DREAM_BABY_STATE.md) | archived | approved (all-party Consent+DRP), generating (Shadow) | `dream-baby-session` | Dream Baby |
| [Conversation](states/CONVERSATION_STATE.md) | closed | active (connection), ai_assist (Shadow) | `conversation` | Messaging |
| [Membership](states/MEMBERSHIP_STATE.md) | cancelled | active (DRP+Human — sacred) | `membership` | Premium Upgrade |
| [Consent Record](states/CONSENT_STATE.md) | withdrawn | granted (Consent), withdrawn (—) | `consent-record` | Consent |
| [Moderation & Appeal](states/MODERATION_APPEAL_STATE.md) | resolved | action_taken (DRP+Human), overturned (Human) | `report`, `appeal` | Moderation, Appeal |

## Gate legend

| Symbol | Gate |
| ------ | ---- |
| Consent | user permission |
| Security | trust boundary |
| DRP | sacred / child / payment / bulk |
| Shadow | AI output validation |
| Human | AMK/operator sign-off |

## Cross-experience note

State contracts reference each other where lifecycles connect — e.g. a Connection Request reaching `accepted` enables a Conversation `active`. These links are documented per contract, not enforced by runtime here.
