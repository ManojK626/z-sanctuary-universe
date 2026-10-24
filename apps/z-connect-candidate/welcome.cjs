'use strict';

(function () {
  if (typeof document === 'undefined' || !globalThis.ZConnectCandidate) return;

  var api = globalThis.ZConnectCandidate;
  var visit = api.createVisit(new Date().toISOString());
  var consentBox = document.getElementById('discovery-consent');
  var grantButton = document.getElementById('grant-discovery');
  var declineButton = document.getElementById('decline-discovery');
  var backButton = document.getElementById('back-welcome');
  var note = document.getElementById('consent-note');
  var boundary = document.getElementById('discovery-boundary');
  var welcome = document.getElementById('welcome-panel');

  globalThis.ZConnectCandidateView = function () {
    var record = visit.consentRecord;
    return {
      authority: visit.authority,
      allowDiscoveryJourney: visit.privacySettings.allowDiscoveryJourney === true,
      scopeId: record && record.scope ? record.scope.scopeId : null,
      surface: visit.surface,
      discoveryStatus: visit.discoveryStatus,
      penalty: visit.penalty,
      persistence: visit.persistence,
      dataClass: visit.dataClass,
    };
  };

  function paint() {
    var open = api.formalDiscoveryAllowed(visit) && visit.surface === 'discovery_boundary';
    boundary.hidden = !open;
    welcome.hidden = false;
    consentBox.checked = Boolean(visit.consentRecord);
  }

  grantButton.addEventListener('click', function () {
    if (!consentBox.checked) {
      note.textContent = 'Discovery stays closed until you choose it. You can remain on Welcome.';
      return;
    }
    api.grantDiscovery(visit, new Date().toISOString());
    note.textContent = 'Formal Discovery consent is recorded for this visit only. The journey is not implemented.';
    paint();
  });

  declineButton.addEventListener('click', function () {
    api.declineDiscovery(visit);
    consentBox.checked = false;
    note.textContent = 'Discovery stays unavailable. Welcome remains open. There is no penalty.';
    paint();
  });

  backButton.addEventListener('click', function () {
    api.returnToWelcome(visit);
    note.textContent = 'You are back on Welcome. The visit is still only in memory.';
    paint();
  });

  paint();
})();
