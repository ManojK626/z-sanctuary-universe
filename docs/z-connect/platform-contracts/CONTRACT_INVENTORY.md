# Z-Connect Contract Inventory — v1

**Total schemas:** 61 (60 contracts + 1 definitions bundle)  
**Examples:** 5 non-executable fixtures

Legend: **R** = required governance · **AI** = includes confidence/explanation/limitations pattern

---

## Common (`common/schemas/v1/`)

| Schema | Title | Purpose |
| ------ | ----- | ------- |
| `_definitions.schema.json` | ZConnectCommonDefinitions | Shared `$defs`: Identifier, ConfidenceLevel, disclaimers, etc. |

---

## User (`user/schemas/v1/`)

| Schema | Purpose | Privacy notes |
| ------ | ------- | ------------- |
| `profile.schema.json` | Versioned approved profile | User-approved fields only |
| `preferences.schema.json` | Communication preferences | Self-stated |
| `languages.schema.json` | Spoken/learning languages | Optional learning array |
| `interests.schema.json` | Interest categories + entertainment lane | Entertainment requires `entertainment_not_scientific` label |
| `values.schema.json` | Values and goals | Optional spiritual — user wording |
| `lifestyle.schema.json` | Routines, hobbies, travel | Self-stated |
| `privacy-settings.schema.json` | Visibility controls | Default privacy-first enums |
| `notification-settings.schema.json` | Opt-in notifications | Marketing explicit opt-in |

---

## Connection (`connection/schemas/v1/`)

| Schema | Purpose | Forbidden |
| ------ | ------- | --------- |
| `connection-request.schema.json` | Invitation | Auto-accept |
| `connection-state.schema.json` | Link state | Ranking |
| `relationship-goal.schema.json` | User goal statement | Platform verdict |
| `compatibility-insight.schema.json` | Single dimension observation | **No percentage** |
| `connection-confidence.schema.json` | Insight bundle | **No percentage** |

---

## AI (`ai/schemas/v1/`) — **AI**

| Schema | Purpose |
| ------ | ------- |
| `ai-discovery-session.schema.json` | Journey session |
| `conversation-summary.schema.json` | Approved summary |
| `profile-summary.schema.json` | Proposed themes |
| `explanation.schema.json` | Standalone explanation |
| `insight.schema.json` | General insight |
| `reflection.schema.json` | Reflective prompt |
| `recommendation.schema.json` | Suggested next step — not auto-execute |
| `confidence-explanation.schema.json` | Dimension confidence rationale |

All AI artifacts require: `confidence`, `explanation`, `limitations`, `disclaimer` (where applicable per schema).

---

## Consent (`consent/schemas/v1/`)

| Schema | Purpose |
| ------ | ------- |
| `consent-record.schema.json` | Grant record |
| `consent-scope.schema.json` | Scope definition |
| `consent-version.schema.json` | Consent text version |
| `consent-withdrawal.schema.json` | Withdrawal |
| `shared-experience-consent.schema.json` | Multi-party |
| `dream-baby-consent.schema.json` | Dream Baby Studio gate |

---

## Messaging (`messaging/schemas/v1/`)

| Schema | Purpose |
| ------ | ------- |
| `conversation.schema.json` | Thread |
| `message.schema.json` | Message body |
| `attachment.schema.json` | Media metadata |
| `reaction.schema.json` | Reaction |
| `read-receipt.schema.json` | Read receipt — privacy-gated |
| `moderation-event.schema.json` | Moderation on message |

---

## Family (`family/schemas/v1/`)

| Schema | Purpose |
| ------ | ------- |
| `dream-baby-session.schema.json` | **Entertainment only** — mandatory disclaimer |
| `family-timeline.schema.json` | Shared timeline |
| `shared-journal.schema.json` | Consent-gated journal |
| `memory-collection.schema.json` | Memory collection |
| `reminder.schema.json` | Reminder |

---

## Subscription (`subscription/schemas/v1/`) — **HOLD runtime**

| Schema | Purpose |
| ------ | ------- |
| `membership.schema.json` | Membership record |
| `plan.schema.json` | Plan descriptor |
| `invoice-reference.schema.json` | External invoice ref only |
| `entitlement.schema.json` | Feature entitlement |
| `premium-feature.schema.json` | Feature catalog |

---

## Moderation (`moderation/schemas/v1/`)

| Schema | Purpose |
| ------ | ------- |
| `report.schema.json` | User report |
| `review.schema.json` | Review outcome |
| `appeal.schema.json` | Appeal |
| `safety-action.schema.json` | Enforced action |
| `user-block.schema.json` | User block |

---

## Governance (`governance/schemas/v1/`) — **R**

| Schema | Purpose |
| ------ | ------- |
| `audit-event.schema.json` | Audit envelope |
| `drp-decision-reference.schema.json` | Hub DRP link |
| `shadow-validation-reference.schema.json` | Shadow result link |
| `observability-reference.schema.json` | Observability link |
| `human-approval-reference.schema.json` | AMK gate reference |

---

## Discovery (`discovery/schemas/v1/`)

| Schema | Purpose |
| ------ | ------- |
| `ai-discovery-journey.schema.json` | Progressive journey container |
| `discovery-question.schema.json` | Question |
| `discovery-answer.schema.json` | User answer |
| `discovery-reflection.schema.json` | AI reflection — approval required to persist |
| `discovery-summary.schema.json` | Approved summary |
| `profile-evolution.schema.json` | Profile delta proposal |
| `connection-confidence-evolution.schema.json` | Confidence label change audit |

---

## Out of scope (v1 contracts)

- HTTP routes · SQL DDL · OAuth · payment execution · UI components
