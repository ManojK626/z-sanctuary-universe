// Z: core\audit-writer.js
// Audit Writer: Writes audit events to log
const fs = require('fs');
const crypto = require('crypto');
const AUDIT_FILE = './logs/audit.log.json';

function writeAudit(event) {
  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify(event.context || {}))
    .digest('hex');
  const audit = {
    audit_id: crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex'),
    timestamp: new Date().toISOString(),
    rule_id: event.rule_id,
    trigger_event_type: event.trigger?.event_type,
    risk_class: event.risk_class,
    consent_level: event.consent?.level,
    execution_result: event.execution_result,
    context_hash: hash,
  };
  fs.appendFileSync(AUDIT_FILE, JSON.stringify(audit) + '\n');
}

module.exports = { writeAudit };
