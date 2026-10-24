'use strict';

var SYNTHETIC_USER_ID = '00000000-0000-4000-8000-000000000001';
var SYNTHETIC_CONSENT_ID = '00000000-0000-4000-8000-000000000002';

function createVisit(nowIso) {
  var stamp = nowIso || '1970-01-01T00:00:00.000Z';
  return {
    authority: 'LOCAL_RUNTIME_CANDIDATE',
    surface: 'welcome',
    dataClass: 'SYNTHETIC_ONLY',
    persistence: 'in_memory',
    guideMode: 'scripted',
    privacySettings: {
      schemaVersion: 'v1',
      userId: SYNTHETIC_USER_ID,
      profileVisibility: 'private',
      allowDiscoveryJourney: false,
      updatedAtIso: stamp,
    },
    consentRecord: null,
    discoveryStatus: 'locked',
    reflectStatus: 'not_implemented',
    penalty: null,
  };
}

function formalDiscoveryAllowed(visit) {
  var record = visit && visit.consentRecord;
  var settings = visit && visit.privacySettings;
  return Boolean(
    settings
    && settings.allowDiscoveryJourney === true
    && record
    && record.scope
    && record.scope.scopeId === 'discovery_journey'
    && record.version === 'v1'
    && !record.withdrawnAtIso
  );
}

function declineDiscovery(visit) {
  visit.privacySettings.allowDiscoveryJourney = false;
  visit.consentRecord = null;
  visit.discoveryStatus = 'unavailable_no_penalty';
  visit.surface = 'welcome';
  visit.penalty = null;
  return visit;
}

function grantDiscovery(visit, nowIso) {
  var stamp = nowIso || new Date().toISOString();
  visit.privacySettings.allowDiscoveryJourney = true;
  visit.privacySettings.updatedAtIso = stamp;
  visit.consentRecord = {
    schemaVersion: 'v1',
    consentId: SYNTHETIC_CONSENT_ID,
    userId: SYNTHETIC_USER_ID,
    scope: {
      schemaVersion: 'v1',
      scopeId: 'discovery_journey',
      label: 'AI Discovery Journey',
      dataCategories: [],
    },
    version: 'v1',
    grantedAtIso: stamp,
    purpose: 'Visit-local gate only. This foundation does not store a profile or call a model.',
  };
  visit.discoveryStatus = 'boundary_only';
  visit.surface = 'discovery_boundary';
  visit.penalty = null;
  return visit;
}

function returnToWelcome(visit) {
  visit.surface = 'welcome';
  return visit;
}

var api = {
  SYNTHETIC_USER_ID: SYNTHETIC_USER_ID,
  createVisit: createVisit,
  formalDiscoveryAllowed: formalDiscoveryAllowed,
  declineDiscovery: declineDiscovery,
  grantDiscovery: grantDiscovery,
  returnToWelcome: returnToWelcome,
};

if (typeof module === 'object' && module.exports) module.exports = api;
if (typeof globalThis !== 'undefined') globalThis.ZConnectCandidate = api;
