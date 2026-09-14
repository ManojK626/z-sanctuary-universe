#!/usr/bin/env node
/**
 * One-shot generator for Z-Connect Phase 1.5 B1 JSON Schema contracts.
 * Committed output is source of truth; re-run only when charter changes.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEF = '../../common/schemas/v1/_definitions.schema.json#/$defs';

function ref(name) {
  return { $ref: `${DEF}/${name}` };
}

function base(id, title, desc, props, required, extra = {}) {
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: `https://z-sanctuary.local/z-connect/schemas/v1/${id}.json`,
    title,
    description: desc,
    type: 'object',
    additionalProperties: false,
    required,
    properties: props,
    ...extra,
  };
}

function aiEnvelope(props, required) {
  return {
    confidence: ref('ConfidenceLevel'),
    explanation: ref('AiExplanation'),
    limitations: ref('AiLimitations'),
    disclaimer: ref('InsightDisclaimer'),
    ...props,
  };
}

const schemas = [
  // USER
  ['user/schemas/v1/profile.schema.json', base(
    'user-profile', 'ZConnectUserProfile', 'Versioned user profile — user-approved fields only.',
    {
      schemaVersion: ref('SchemaVersion'),
      profileId: ref('Identifier'),
      userId: ref('UserId'),
      displayName: { type: 'string', minLength: 1, maxLength: 120 },
      bio: { type: 'string', maxLength: 2000 },
      locale: ref('Locale'),
      branchInterests: { type: 'array', items: ref('RelationshipBranch') },
      profileVersion: { type: 'integer', minimum: 1 },
      approvedAtIso: ref('TimestampIso'),
      updatedAtIso: ref('TimestampIso'),
      metadata: ref('Metadata'),
    },
    ['schemaVersion', 'profileId', 'userId', 'displayName', 'profileVersion', 'approvedAtIso', 'updatedAtIso'],
  )],
  ['user/schemas/v1/preferences.schema.json', base(
    'user-preferences', 'ZConnectUserPreferences', 'Communication and relationship preference selections.',
    {
      schemaVersion: ref('SchemaVersion'),
      userId: ref('UserId'),
      communicationFrequency: { type: 'string', enum: ['daily', 'few_times_week', 'weekly', 'as_needed'] },
      affectionStyle: { type: 'string', maxLength: 200 },
      conflictStyle: { type: 'string', maxLength: 200 },
      socialEnergy: { type: 'string', enum: ['introvert', 'ambivert', 'extrovert', 'context_dependent'] },
      updatedAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'userId', 'updatedAtIso'],
  )],
  ['user/schemas/v1/languages.schema.json', base(
    'user-languages', 'ZConnectUserLanguages', 'Languages spoken or preferred.',
    {
      schemaVersion: ref('SchemaVersion'),
      userId: ref('UserId'),
      spoken: { type: 'array', items: ref('Locale'), minItems: 1 },
      learning: { type: 'array', items: ref('Locale') },
    },
    ['schemaVersion', 'userId', 'spoken'],
  )],
  ['user/schemas/v1/interests.schema.json', base(
    'user-interests', 'ZConnectUserInterests', 'User-stated interests by category.',
    {
      schemaVersion: ref('SchemaVersion'),
      userId: ref('UserId'),
      categories: {
        type: 'object',
        additionalProperties: {
          type: 'array',
          items: { type: 'string', minLength: 1, maxLength: 80 },
        },
        description: 'e.g. music, sports, reading',
      },
      entertainmentInterests: {
        type: 'object',
        additionalProperties: false,
        properties: {
          label: ref('EntertainmentLabel'),
          zodiacSign: { type: 'string', maxLength: 32 },
          astrologyInterest: { type: 'boolean' },
          numerologyInterest: { type: 'boolean' },
        },
        required: ['label'],
      },
    },
    ['schemaVersion', 'userId', 'categories'],
  )],
  ['user/schemas/v1/values.schema.json', base(
    'user-values', 'ZConnectUserValues', 'Self-stated values and life goals.',
    {
      schemaVersion: ref('SchemaVersion'),
      userId: ref('UserId'),
      familyPriorities: { type: 'string', maxLength: 500 },
      personalGoals: { type: 'array', items: { type: 'string', maxLength: 200 } },
      communityInvolvement: { type: 'string', maxLength: 500 },
      environmentalValues: { type: 'string', maxLength: 500 },
      spiritualInterest: { type: 'string', maxLength: 500, description: 'Optional — user-owned wording' },
    },
    ['schemaVersion', 'userId'],
  )],
  ['user/schemas/v1/lifestyle.schema.json', base(
    'user-lifestyle', 'ZConnectUserLifestyle', 'Daily life and habit preferences.',
    {
      schemaVersion: ref('SchemaVersion'),
      userId: ref('UserId'),
      routines: { type: 'string', maxLength: 1000 },
      career: { type: 'string', maxLength: 200 },
      hobbies: { type: 'array', items: { type: 'string', maxLength: 80 } },
      travelInterests: { type: 'string', maxLength: 500 },
      fitness: { type: 'string', maxLength: 200 },
      foodPreferences: { type: 'string', maxLength: 500 },
    },
    ['schemaVersion', 'userId'],
  )],
  ['user/schemas/v1/privacy-settings.schema.json', base(
    'user-privacy-settings', 'ZConnectPrivacySettings', 'Privacy-first visibility controls.',
    {
      schemaVersion: ref('SchemaVersion'),
      userId: ref('UserId'),
      profileVisibility: { type: 'string', enum: ['private', 'connections_only', 'community', 'public_preview'] },
      showOnlineStatus: { type: 'boolean' },
      allowDiscoveryJourney: { type: 'boolean' },
      allowInsightGeneration: { type: 'boolean' },
      updatedAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'userId', 'profileVisibility', 'updatedAtIso'],
  )],
  ['user/schemas/v1/notification-settings.schema.json', base(
    'user-notification-settings', 'ZConnectNotificationSettings', 'Notification opt-in preferences.',
    {
      schemaVersion: ref('SchemaVersion'),
      userId: ref('UserId'),
      emailEnabled: { type: 'boolean' },
      pushEnabled: { type: 'boolean' },
      connectionRequests: { type: 'boolean' },
      journeyReminders: { type: 'boolean' },
      marketingOptIn: { type: 'boolean', description: 'Explicit opt-in only' },
      updatedAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'userId', 'updatedAtIso'],
  )],

  // CONNECTION
  ['connection/schemas/v1/connection-request.schema.json', base(
    'connection-request', 'ZConnectConnectionRequest', 'Consent-based connection invitation.',
    {
      schemaVersion: ref('SchemaVersion'),
      requestId: ref('Identifier'),
      fromUserId: ref('UserId'),
      toUserId: ref('UserId'),
      branch: ref('RelationshipBranch'),
      message: { type: 'string', maxLength: 500 },
      requestedAtIso: ref('TimestampIso'),
      status: { type: 'string', enum: ['pending', 'accepted', 'declined', 'withdrawn'] },
    },
    ['schemaVersion', 'requestId', 'fromUserId', 'toUserId', 'branch', 'requestedAtIso', 'status'],
  )],
  ['connection/schemas/v1/connection-state.schema.json', base(
    'connection-state', 'ZConnectConnectionState', 'State of a relationship link between two users.',
    {
      schemaVersion: ref('SchemaVersion'),
      connectionId: ref('Identifier'),
      userAId: ref('UserId'),
      userBId: ref('UserId'),
      branch: ref('RelationshipBranch'),
      state: ref('ConnectionStateEnum'),
      sinceIso: ref('TimestampIso'),
      updatedAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'connectionId', 'userAId', 'userBId', 'branch', 'state', 'sinceIso', 'updatedAtIso'],
  )],
  ['connection/schemas/v1/relationship-goal.schema.json', base(
    'relationship-goal', 'ZConnectRelationshipGoal', 'User-stated goal for a branch — not a platform verdict.',
    {
      schemaVersion: ref('SchemaVersion'),
      userId: ref('UserId'),
      branch: ref('RelationshipBranch'),
      goalStatement: { type: 'string', minLength: 1, maxLength: 500 },
      updatedAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'userId', 'branch', 'goalStatement', 'updatedAtIso'],
  )],
  ['connection/schemas/v1/compatibility-insight.schema.json', base(
    'compatibility-insight', 'ZConnectCompatibilityInsight',
    'Multi-dimensional observation — never a percentage or destiny verdict.',
    {
      schemaVersion: ref('SchemaVersion'),
      insightId: ref('Identifier'),
      viewerUserId: ref('UserId'),
      subjectUserId: ref('UserId'),
      dimensionId: { type: 'string', pattern: '^[a-z][a-z0-9_]{1,63}$' },
      narrative: { type: 'string', minLength: 1, maxLength: 2000 },
      confidence: ref('ConfidenceLevel'),
      sourceFieldRefs: { type: 'array', items: ref('SourceFieldRef') },
      disclaimer: ref('InsightDisclaimer'),
      conversationStarter: { type: 'string', maxLength: 500 },
      generatedAtIso: ref('TimestampIso'),
      correlationId: ref('CorrelationId'),
    },
    ['schemaVersion', 'insightId', 'viewerUserId', 'subjectUserId', 'dimensionId', 'narrative', 'confidence', 'sourceFieldRefs', 'disclaimer', 'generatedAtIso'],
  )],
  ['connection/schemas/v1/connection-confidence.schema.json', base(
    'connection-confidence', 'ZConnectConnectionConfidence',
    'Bundle of dimension-level confidence observations between two users.',
    {
      schemaVersion: ref('SchemaVersion'),
      bundleId: ref('Identifier'),
      viewerUserId: ref('UserId'),
      subjectUserId: ref('UserId'),
      insights: {
        type: 'array',
        items: { $ref: 'https://z-sanctuary.local/z-connect/schemas/v1/compatibility-insight.json' },
        minItems: 1,
      },
      overallDisclaimer: ref('InsightDisclaimer'),
      generatedAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'bundleId', 'viewerUserId', 'subjectUserId', 'insights', 'overallDisclaimer', 'generatedAtIso'],
  )],

  // AI
  ['ai/schemas/v1/ai-discovery-session.schema.json', base(
    'ai-discovery-session', 'ZConnectAiDiscoverySession', 'Consent-paced AI Discovery Journey session.',
    {
      schemaVersion: ref('SchemaVersion'),
      sessionId: ref('Identifier'),
      userId: ref('UserId'),
      status: { type: 'string', enum: ['active', 'paused', 'completed', 'cancelled'] },
      startedAtIso: ref('TimestampIso'),
      completedAtIso: ref('TimestampIso'),
      consentRecordId: ref('Identifier'),
      correlationId: ref('CorrelationId'),
    },
    ['schemaVersion', 'sessionId', 'userId', 'status', 'startedAtIso', 'consentRecordId'],
  )],
  ['ai/schemas/v1/conversation-summary.schema.json', base(
    'ai-conversation-summary', 'ZConnectConversationSummary', 'Approved summary of a discovery conversation.',
    {
      schemaVersion: ref('SchemaVersion'),
      summaryId: ref('Identifier'),
      sessionId: ref('Identifier'),
      userId: ref('UserId'),
      summaryText: { type: 'string', minLength: 1, maxLength: 4000 },
      approvedByUser: { type: 'boolean', const: true },
      approvedAtIso: ref('TimestampIso'),
      ...aiEnvelope({}, []),
    },
    ['schemaVersion', 'summaryId', 'sessionId', 'userId', 'summaryText', 'approvedByUser', 'approvedAtIso', 'confidence', 'explanation', 'limitations', 'disclaimer'],
  )],
  ['ai/schemas/v1/profile-summary.schema.json', base(
    'ai-profile-summary', 'ZConnectProfileSummary', 'AI-proposed profile themes awaiting user approval.',
    {
      schemaVersion: ref('SchemaVersion'),
      summaryId: ref('Identifier'),
      userId: ref('UserId'),
      proposedThemes: { type: 'array', items: { type: 'string', maxLength: 120 } },
      approved: { type: 'boolean' },
      ...aiEnvelope({}, []),
    },
    ['schemaVersion', 'summaryId', 'userId', 'proposedThemes', 'approved', 'confidence', 'explanation', 'limitations', 'disclaimer'],
  )],
  ['ai/schemas/v1/explanation.schema.json', base(
    'ai-explanation', 'ZConnectAiExplanation', 'Standalone AI explanation artifact.',
    {
      schemaVersion: ref('SchemaVersion'),
      explanationId: ref('Identifier'),
      topic: { type: 'string', maxLength: 200 },
      body: { type: 'string', minLength: 1, maxLength: 4000 },
      ...aiEnvelope({}, []),
    },
    ['schemaVersion', 'explanationId', 'topic', 'body', 'confidence', 'explanation', 'limitations', 'disclaimer'],
  )],
  ['ai/schemas/v1/insight.schema.json', base(
    'ai-insight', 'ZConnectAiInsight', 'General AI insight — observational not verdict.',
    {
      schemaVersion: ref('SchemaVersion'),
      insightId: ref('Identifier'),
      userId: ref('UserId'),
      narrative: { type: 'string', minLength: 1, maxLength: 2000 },
      ...aiEnvelope({}, []),
    },
    ['schemaVersion', 'insightId', 'userId', 'narrative', 'confidence', 'explanation', 'limitations', 'disclaimer'],
  )],
  ['ai/schemas/v1/reflection.schema.json', base(
    'ai-reflection', 'ZConnectAiReflection', 'Reflective prompt or mirror-back — encourages human choice.',
    {
      schemaVersion: ref('SchemaVersion'),
      reflectionId: ref('Identifier'),
      userId: ref('UserId'),
      prompt: { type: 'string', minLength: 1, maxLength: 1000 },
      ...aiEnvelope({}, []),
    },
    ['schemaVersion', 'reflectionId', 'userId', 'prompt', 'confidence', 'explanation', 'limitations', 'disclaimer'],
  )],
  ['ai/schemas/v1/recommendation.schema.json', base(
    'ai-recommendation', 'ZConnectAiRecommendation', 'Suggested next step — user must act explicitly.',
    {
      schemaVersion: ref('SchemaVersion'),
      recommendationId: ref('Identifier'),
      userId: ref('UserId'),
      actionHint: { type: 'string', maxLength: 500, description: 'e.g. explore a conversation starter — not auto-execute' },
      ...aiEnvelope({}, []),
    },
    ['schemaVersion', 'recommendationId', 'userId', 'actionHint', 'confidence', 'explanation', 'limitations', 'disclaimer'],
  )],
  ['ai/schemas/v1/confidence-explanation.schema.json', base(
    'ai-confidence-explanation', 'ZConnectConfidenceExplanation', 'Explains confidence level for a dimension.',
    {
      schemaVersion: ref('SchemaVersion'),
      explanationId: ref('Identifier'),
      dimensionId: { type: 'string', pattern: '^[a-z][a-z0-9_]{1,63}$' },
      confidence: ref('ConfidenceLevel'),
      because: { type: 'string', maxLength: 1000 },
      unknown: { type: 'string', maxLength: 1000 },
      disclaimer: ref('InsightDisclaimer'),
    },
    ['schemaVersion', 'explanationId', 'dimensionId', 'confidence', 'because', 'disclaimer'],
  )],

  // CONSENT
  ['consent/schemas/v1/consent-record.schema.json', base(
    'consent-record', 'ZConnectConsentRecord', 'Append-only consent grant record.',
    {
      schemaVersion: ref('SchemaVersion'),
      consentId: ref('Identifier'),
      userId: ref('UserId'),
      scope: { $ref: 'https://z-sanctuary.local/z-connect/schemas/v1/consent-scope.json' },
      version: { type: 'string', const: 'v1' },
      grantedAtIso: ref('TimestampIso'),
      withdrawnAtIso: ref('TimestampIso'),
      purpose: { type: 'string', maxLength: 500 },
    },
    ['schemaVersion', 'consentId', 'userId', 'scope', 'version', 'grantedAtIso', 'purpose'],
  )],
  ['consent/schemas/v1/consent-scope.schema.json', base(
    'consent-scope', 'ZConnectConsentScope', 'Granular consent scope definition.',
    {
      schemaVersion: ref('SchemaVersion'),
      scopeId: { type: 'string', pattern: '^[a-z][a-z0-9_]{1,63}$' },
      label: { type: 'string', maxLength: 200 },
      dataCategories: { type: 'array', items: { type: 'string', maxLength: 80 } },
      retentionDays: { type: 'integer', minimum: 1 },
    },
    ['schemaVersion', 'scopeId', 'label', 'dataCategories'],
  )],
  ['consent/schemas/v1/consent-version.schema.json', base(
    'consent-version', 'ZConnectConsentVersion', 'Version marker for consent text shown to user.',
    {
      schemaVersion: ref('SchemaVersion'),
      versionId: { type: 'string', pattern: '^v[0-9]+(\\.[0-9]+)?$' },
      effectiveAtIso: ref('TimestampIso'),
      documentRef: { type: 'string', description: 'Path or URL to human-readable consent copy' },
    },
    ['schemaVersion', 'versionId', 'effectiveAtIso', 'documentRef'],
  )],
  ['consent/schemas/v1/consent-withdrawal.schema.json', base(
    'consent-withdrawal', 'ZConnectConsentWithdrawal', 'User withdrawal of prior consent.',
    {
      schemaVersion: ref('SchemaVersion'),
      withdrawalId: ref('Identifier'),
      consentId: ref('Identifier'),
      userId: ref('UserId'),
      withdrawnAtIso: ref('TimestampIso'),
      reason: { type: 'string', maxLength: 500 },
    },
    ['schemaVersion', 'withdrawalId', 'consentId', 'userId', 'withdrawnAtIso'],
  )],
  ['consent/schemas/v1/shared-experience-consent.schema.json', base(
    'shared-experience-consent', 'ZConnectSharedExperienceConsent', 'All-party consent for shared features.',
    {
      schemaVersion: ref('SchemaVersion'),
      experienceId: ref('Identifier'),
      experienceType: { type: 'string', enum: ['dream_baby_studio', 'shared_journal', 'couples_timeline', 'event_together'] },
      participantUserIds: { type: 'array', items: ref('UserId'), minItems: 2 },
      consents: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['userId', 'consentId', 'grantedAtIso'],
          properties: {
            userId: ref('UserId'),
            consentId: ref('Identifier'),
            grantedAtIso: ref('TimestampIso'),
          },
        },
        minItems: 2,
      },
    },
    ['schemaVersion', 'experienceId', 'experienceType', 'participantUserIds', 'consents'],
  )],
  ['consent/schemas/v1/dream-baby-consent.schema.json', base(
    'dream-baby-consent', 'ZConnectDreamBabyConsent', 'Explicit all-party consent for Dream Baby Studio.',
    {
      schemaVersion: ref('SchemaVersion'),
      sessionId: ref('Identifier'),
      participantUserIds: { type: 'array', items: ref('UserId'), minItems: 2 },
      entertainmentDisclaimer: {
        type: 'string',
        const: 'This is an imaginative AI-generated creation for entertainment and inspiration. It is not a prediction of a real child\'s appearance.',
      },
      sharedExperienceConsentId: ref('Identifier'),
      grantedAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'sessionId', 'participantUserIds', 'entertainmentDisclaimer', 'sharedExperienceConsentId', 'grantedAtIso'],
  )],

  // MESSAGING
  ['messaging/schemas/v1/conversation.schema.json', base(
    'messaging-conversation', 'ZConnectConversation', 'Messaging thread between connected users.',
    {
      schemaVersion: ref('SchemaVersion'),
      conversationId: ref('Identifier'),
      participantUserIds: { type: 'array', items: ref('UserId'), minItems: 2, maxItems: 8 },
      createdAtIso: ref('TimestampIso'),
      branch: ref('RelationshipBranch'),
    },
    ['schemaVersion', 'conversationId', 'participantUserIds', 'createdAtIso'],
  )],
  ['messaging/schemas/v1/message.schema.json', base(
    'messaging-message', 'ZConnectMessage', 'Single message in a conversation.',
    {
      schemaVersion: ref('SchemaVersion'),
      messageId: ref('Identifier'),
      conversationId: ref('Identifier'),
      senderUserId: ref('UserId'),
      body: { type: 'string', maxLength: 10000 },
      sentAtIso: ref('TimestampIso'),
      editedAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'messageId', 'conversationId', 'senderUserId', 'body', 'sentAtIso'],
  )],
  ['messaging/schemas/v1/attachment.schema.json', base(
    'messaging-attachment', 'ZConnectMessageAttachment', 'Media attachment metadata.',
    {
      schemaVersion: ref('SchemaVersion'),
      attachmentId: ref('Identifier'),
      messageId: ref('Identifier'),
      image: ref('ImageReference'),
      contentLengthBytes: { type: 'integer', minimum: 0 },
    },
    ['schemaVersion', 'attachmentId', 'messageId', 'image'],
  )],
  ['messaging/schemas/v1/reaction.schema.json', base(
    'messaging-reaction', 'ZConnectMessageReaction', 'Emoji or typed reaction.',
    {
      schemaVersion: ref('SchemaVersion'),
      reactionId: ref('Identifier'),
      messageId: ref('Identifier'),
      userId: ref('UserId'),
      reactionCode: { type: 'string', maxLength: 32 },
      reactedAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'reactionId', 'messageId', 'userId', 'reactionCode', 'reactedAtIso'],
  )],
  ['messaging/schemas/v1/read-receipt.schema.json', base(
    'messaging-read-receipt', 'ZConnectReadReceipt', 'Read receipt — opt-in visibility in privacy settings.',
    {
      schemaVersion: ref('SchemaVersion'),
      receiptId: ref('Identifier'),
      messageId: ref('Identifier'),
      userId: ref('UserId'),
      readAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'receiptId', 'messageId', 'userId', 'readAtIso'],
  )],
  ['messaging/schemas/v1/moderation-event.schema.json', base(
    'messaging-moderation-event', 'ZConnectMessagingModerationEvent', 'Moderation action on messaging content.',
    {
      schemaVersion: ref('SchemaVersion'),
      eventId: ref('Identifier'),
      messageId: ref('Identifier'),
      action: { type: 'string', enum: ['flagged', 'hidden', 'removed', 'escalated'] },
      occurredAtIso: ref('TimestampIso'),
      correlationId: ref('CorrelationId'),
    },
    ['schemaVersion', 'eventId', 'messageId', 'action', 'occurredAtIso'],
  )],

  // FAMILY
  ['family/schemas/v1/dream-baby-session.schema.json', base(
    'dream-baby-session', 'ZConnectDreamBabySession', 'Creative AI session — entertainment only.',
    {
      schemaVersion: ref('SchemaVersion'),
      sessionId: ref('Identifier'),
      dreamBabyConsentId: ref('Identifier'),
      entertainmentDisclaimer: {
        type: 'string',
        const: 'This is an imaginative AI-generated creation for entertainment and inspiration. It is not a prediction of a real child\'s appearance.',
      },
      outputImage: ref('ImageReference'),
      createdAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'sessionId', 'dreamBabyConsentId', 'entertainmentDisclaimer', 'createdAtIso'],
  )],
  ['family/schemas/v1/family-timeline.schema.json', base(
    'family-timeline', 'ZConnectFamilyTimeline', 'Shared family milestone timeline.',
    {
      schemaVersion: ref('SchemaVersion'),
      timelineId: ref('Identifier'),
      ownerUserIds: { type: 'array', items: ref('UserId'), minItems: 1 },
      title: { type: 'string', maxLength: 200 },
      createdAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'timelineId', 'ownerUserIds', 'title', 'createdAtIso'],
  )],
  ['family/schemas/v1/shared-journal.schema.json', base(
    'shared-journal', 'ZConnectSharedJournal', 'Consent-gated shared journal.',
    {
      schemaVersion: ref('SchemaVersion'),
      journalId: ref('Identifier'),
      sharedExperienceConsentId: ref('Identifier'),
      entryIds: { type: 'array', items: ref('Identifier') },
    },
    ['schemaVersion', 'journalId', 'sharedExperienceConsentId'],
  )],
  ['family/schemas/v1/memory-collection.schema.json', base(
    'memory-collection', 'ZConnectMemoryCollection', 'Curated memory collection.',
    {
      schemaVersion: ref('SchemaVersion'),
      collectionId: ref('Identifier'),
      ownerUserId: ref('UserId'),
      title: { type: 'string', maxLength: 200 },
      imageRefs: { type: 'array', items: ref('ImageReference') },
    },
    ['schemaVersion', 'collectionId', 'ownerUserId', 'title'],
  )],
  ['family/schemas/v1/reminder.schema.json', base(
    'family-reminder', 'ZConnectFamilyReminder', 'Optional reminder for shared events.',
    {
      schemaVersion: ref('SchemaVersion'),
      reminderId: ref('Identifier'),
      userId: ref('UserId'),
      remindAtIso: ref('TimestampIso'),
      label: { type: 'string', maxLength: 200 },
    },
    ['schemaVersion', 'reminderId', 'userId', 'remindAtIso', 'label'],
  )],

  // SUBSCRIPTION
  ['subscription/schemas/v1/membership.schema.json', base(
    'membership', 'ZConnectMembership', 'Membership record — payment runtime HOLD.',
    {
      schemaVersion: ref('SchemaVersion'),
      membershipId: ref('Identifier'),
      userId: ref('UserId'),
      planId: ref('Identifier'),
      status: { type: 'string', enum: ['trialing', 'active', 'paused', 'cancelled'] },
      startedAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'membershipId', 'userId', 'planId', 'status', 'startedAtIso'],
  )],
  ['subscription/schemas/v1/plan.schema.json', base(
    'subscription-plan', 'ZConnectPlan', 'Plan descriptor — prices not live until sacred gate.',
    {
      schemaVersion: ref('SchemaVersion'),
      planId: ref('Identifier'),
      code: { type: 'string', pattern: '^[a-z][a-z0-9_]{1,31}$' },
      displayName: { type: 'string', maxLength: 120 },
      tier: { type: 'string', enum: ['explorer', 'member', 'supporter'] },
    },
    ['schemaVersion', 'planId', 'code', 'displayName', 'tier'],
  )],
  ['subscription/schemas/v1/invoice-reference.schema.json', base(
    'invoice-reference', 'ZConnectInvoiceReference', 'Reference to external invoice — no payment execution.',
    {
      schemaVersion: ref('SchemaVersion'),
      invoiceRefId: ref('Identifier'),
      membershipId: ref('Identifier'),
      externalInvoiceId: { type: 'string', maxLength: 128 },
      issuedAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'invoiceRefId', 'membershipId', 'externalInvoiceId', 'issuedAtIso'],
  )],
  ['subscription/schemas/v1/entitlement.schema.json', base(
    'entitlement', 'ZConnectEntitlement', 'Feature entitlement granted by plan.',
    {
      schemaVersion: ref('SchemaVersion'),
      entitlementId: ref('Identifier'),
      userId: ref('UserId'),
      featureCode: { type: 'string', maxLength: 64 },
      active: { type: 'boolean' },
      expiresAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'entitlementId', 'userId', 'featureCode', 'active'],
  )],
  ['subscription/schemas/v1/premium-feature.schema.json', base(
    'premium-feature', 'ZConnectPremiumFeature', 'Catalog entry for premium capability.',
    {
      schemaVersion: ref('SchemaVersion'),
      featureCode: { type: 'string', maxLength: 64 },
      label: { type: 'string', maxLength: 120 },
      description: { type: 'string', maxLength: 500 },
    },
    ['schemaVersion', 'featureCode', 'label'],
  )],

  // MODERATION
  ['moderation/schemas/v1/report.schema.json', base(
    'moderation-report', 'ZConnectModerationReport', 'User-submitted safety report.',
    {
      schemaVersion: ref('SchemaVersion'),
      reportId: ref('Identifier'),
      reporterUserId: ref('UserId'),
      subjectUserId: ref('UserId'),
      category: { type: 'string', enum: ['harassment', 'spam', 'impersonation', 'child_safety', 'other'] },
      detail: { type: 'string', maxLength: 2000 },
      reportedAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'reportId', 'reporterUserId', 'category', 'reportedAtIso'],
  )],
  ['moderation/schemas/v1/review.schema.json', base(
    'moderation-review', 'ZConnectModerationReview', 'Human or policy review of a report.',
    {
      schemaVersion: ref('SchemaVersion'),
      reviewId: ref('Identifier'),
      reportId: ref('Identifier'),
      outcome: { type: 'string', enum: ['dismissed', 'action_taken', 'escalated'] },
      reviewedAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'reviewId', 'reportId', 'outcome', 'reviewedAtIso'],
  )],
  ['moderation/schemas/v1/appeal.schema.json', base(
    'moderation-appeal', 'ZConnectModerationAppeal', 'User appeal of moderation action.',
    {
      schemaVersion: ref('SchemaVersion'),
      appealId: ref('Identifier'),
      reviewId: ref('Identifier'),
      appellantUserId: ref('UserId'),
      statement: { type: 'string', maxLength: 2000 },
      submittedAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'appealId', 'reviewId', 'appellantUserId', 'statement', 'submittedAtIso'],
  )],
  ['moderation/schemas/v1/safety-action.schema.json', base(
    'safety-action', 'ZConnectSafetyAction', 'Enforced safety action.',
    {
      schemaVersion: ref('SchemaVersion'),
      actionId: ref('Identifier'),
      subjectUserId: ref('UserId'),
      actionType: { type: 'string', enum: ['warn', 'mute', 'suspend', 'ban'] },
      effectiveAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'actionId', 'subjectUserId', 'actionType', 'effectiveAtIso'],
  )],
  ['moderation/schemas/v1/user-block.schema.json', base(
    'user-block', 'ZConnectUserBlock', 'User-initiated block.',
    {
      schemaVersion: ref('SchemaVersion'),
      blockId: ref('Identifier'),
      blockerUserId: ref('UserId'),
      blockedUserId: ref('UserId'),
      blockedAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'blockId', 'blockerUserId', 'blockedUserId', 'blockedAtIso'],
  )],

  // GOVERNANCE
  ['governance/schemas/v1/audit-event.schema.json', base(
    'governance-audit-event', 'ZConnectAuditEvent', 'Immutable audit envelope.',
    {
      schemaVersion: ref('SchemaVersion'),
      eventId: ref('Identifier'),
      eventType: { type: 'string', pattern: '^zconnect\\.[a-z]+\\.[a-z0-9_]+$' },
      occurredAtIso: ref('TimestampIso'),
      correlationId: ref('CorrelationId'),
      actorUserId: ref('UserId'),
      payloadRef: { type: 'string', maxLength: 256 },
    },
    ['schemaVersion', 'eventId', 'eventType', 'occurredAtIso', 'correlationId'],
  )],
  ['governance/schemas/v1/drp-decision-reference.schema.json', base(
    'drp-decision-reference', 'ZConnectDrpDecisionReference', 'Link to hub ZDRPDecision record.',
    {
      schemaVersion: ref('SchemaVersion'),
      decisionId: ref('Identifier'),
      overall: { type: 'string', enum: ['pass', 'pending_human', 'blocked'] },
      recordedAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'decisionId', 'overall', 'recordedAtIso'],
  )],
  ['governance/schemas/v1/shadow-validation-reference.schema.json', base(
    'shadow-validation-reference', 'ZConnectShadowValidationReference', 'Link to Shadow pipeline result.',
    {
      schemaVersion: ref('SchemaVersion'),
      validationId: ref('Identifier'),
      approved: { type: 'boolean' },
      status: { type: 'string', enum: ['approved', 'rejected', 'degraded'] },
      recordedAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'validationId', 'approved', 'status', 'recordedAtIso'],
  )],
  ['governance/schemas/v1/observability-reference.schema.json', base(
    'observability-reference', 'ZConnectObservabilityReference', 'Link to observability event.',
    {
      schemaVersion: ref('SchemaVersion'),
      eventId: ref('Identifier'),
      correlationId: ref('CorrelationId'),
      recordedAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'eventId', 'correlationId', 'recordedAtIso'],
  )],
  ['governance/schemas/v1/human-approval-reference.schema.json', base(
    'human-approval-reference', 'ZConnectHumanApprovalReference', 'AMK or operator approval gate.',
    {
      schemaVersion: ref('SchemaVersion'),
      approvalId: ref('Identifier'),
      purpose: { type: 'string', maxLength: 200 },
      approvedByLabel: { type: 'string', maxLength: 120 },
      approvedAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'approvalId', 'purpose', 'approvedAtIso'],
  )],

  // DISCOVERY
  ['discovery/schemas/v1/ai-discovery-journey.schema.json', base(
    'discovery-journey', 'ZConnectDiscoveryJourney', 'Progressive Discovery journey container.',
    {
      schemaVersion: ref('SchemaVersion'),
      journeyId: ref('Identifier'),
      userId: ref('UserId'),
      phase: { type: 'string', enum: ['day_1', 'week_1', 'month_1', 'ongoing'] },
      sessionIds: { type: 'array', items: ref('Identifier') },
      startedAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'journeyId', 'userId', 'phase', 'startedAtIso'],
  )],
  ['discovery/schemas/v1/discovery-question.schema.json', base(
    'discovery-question', 'ZConnectDiscoveryQuestion', 'Question in a discovery session.',
    {
      schemaVersion: ref('SchemaVersion'),
      questionId: ref('Identifier'),
      sessionId: ref('Identifier'),
      prompt: { type: 'string', maxLength: 1000 },
      askedAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'questionId', 'sessionId', 'prompt', 'askedAtIso'],
  )],
  ['discovery/schemas/v1/discovery-answer.schema.json', base(
    'discovery-answer', 'ZConnectDiscoveryAnswer', 'User answer — explicitly provided.',
    {
      schemaVersion: ref('SchemaVersion'),
      answerId: ref('Identifier'),
      questionId: ref('Identifier'),
      userId: ref('UserId'),
      answerText: { type: 'string', maxLength: 4000 },
      answeredAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'answerId', 'questionId', 'userId', 'answerText', 'answeredAtIso'],
  )],
  ['discovery/schemas/v1/discovery-reflection.schema.json', base(
    'discovery-reflection', 'ZConnectDiscoveryReflection', 'AI reflection on answers — requires approval to persist.',
    {
      schemaVersion: ref('SchemaVersion'),
      reflectionId: ref('Identifier'),
      sessionId: ref('Identifier'),
      reflectionText: { type: 'string', maxLength: 2000 },
      confidence: ref('ConfidenceLevel'),
      explanation: ref('AiExplanation'),
      limitations: ref('AiLimitations'),
      disclaimer: ref('InsightDisclaimer'),
    },
    ['schemaVersion', 'reflectionId', 'sessionId', 'reflectionText', 'confidence', 'explanation', 'limitations', 'disclaimer'],
  )],
  ['discovery/schemas/v1/discovery-summary.schema.json', base(
    'discovery-summary', 'ZConnectDiscoverySummary', 'User-approved journey summary.',
    {
      schemaVersion: ref('SchemaVersion'),
      summaryId: ref('Identifier'),
      journeyId: ref('Identifier'),
      userId: ref('UserId'),
      summaryText: { type: 'string', maxLength: 4000 },
      approvedAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'summaryId', 'journeyId', 'userId', 'summaryText', 'approvedAtIso'],
  )],
  ['discovery/schemas/v1/profile-evolution.schema.json', base(
    'profile-evolution', 'ZConnectProfileEvolution', 'Proposed profile delta awaiting approval.',
    {
      schemaVersion: ref('SchemaVersion'),
      evolutionId: ref('Identifier'),
      userId: ref('UserId'),
      fromProfileVersion: { type: 'integer', minimum: 1 },
      toProfileVersion: { type: 'integer', minimum: 1 },
      proposedFieldPaths: { type: 'array', items: ref('SourceFieldRef') },
      status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
      proposedAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'evolutionId', 'userId', 'fromProfileVersion', 'proposedFieldPaths', 'status', 'proposedAtIso'],
  )],
  ['discovery/schemas/v1/connection-confidence-evolution.schema.json', base(
    'connection-confidence-evolution', 'ZConnectConnectionConfidenceEvolution',
    'How confidence labels changed as Progressive Discovery added data.',
    {
      schemaVersion: ref('SchemaVersion'),
      evolutionId: ref('Identifier'),
      bundleId: ref('Identifier'),
      dimensionId: { type: 'string', pattern: '^[a-z][a-z0-9_]{1,63}$' },
      previousConfidence: ref('ConfidenceLevel'),
      currentConfidence: ref('ConfidenceLevel'),
      reason: { type: 'string', maxLength: 500 },
      recordedAtIso: ref('TimestampIso'),
    },
    ['schemaVersion', 'evolutionId', 'bundleId', 'dimensionId', 'previousConfidence', 'currentConfidence', 'reason', 'recordedAtIso'],
  )],
];

for (const [rel, schema] of schemas) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, JSON.stringify(schema, null, 2) + '\n');
}

console.log(`Generated ${schemas.length} schema files under ${ROOT}`);
