// Z: core\consent-manager.js
// Consent Manager: In-memory queue for human approvals
const consentQueue = [];
let nextId = 1;

function requestConsent(event) {
  const id = nextId++;
  consentQueue.push({ id, event, status: 'pending', approvals: [] });
  return id;
}

function approveConsent(id, user = 'admin') {
  const req = consentQueue.find((r) => r.id === id);
  if (req && req.status === 'pending') {
    req.approvals.push(user);
    req.status = 'approved';
    return true;
  }
  return false;
}

function denyConsent(id, user = 'admin') {
  const req = consentQueue.find((r) => r.id === id);
  if (req && req.status === 'pending') {
    req.status = 'denied';
    req.approvals.push(user);
    return true;
  }
  return false;
}

function getPendingConsents() {
  return consentQueue.filter((r) => r.status === 'pending');
}

module.exports = { requestConsent, approveConsent, denyConsent, getPendingConsents };
