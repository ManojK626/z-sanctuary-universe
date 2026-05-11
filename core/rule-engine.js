// Z: core\rule-engine.js
// Rule Engine: Evaluates rules, requests consent, executes actions
const fs = require('fs');
const path = require('path');
const { requestConsent } = require('./consent-manager');
const { executeActions } = require('./action-executor');
const { writeAudit } = require('./audit-writer');

const RULES_DIR = path.join(__dirname, '../zflow/rules');

function evaluateRules(event) {
  const rules = fs
    .readdirSync(RULES_DIR)
    .filter((f) => f.endsWith('.zrule.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(RULES_DIR, f), 'utf8')));

  rules.forEach((rule) => {
    if (rule.trigger.event_type !== event.type) return;
    // Only support gte for demo
    const cond = rule.conditions[0];
    const value = event.context?.wellbeing_state?.fatigue_index;
    if (cond && cond.op === 'gte' && value >= cond.value) {
      if (rule.consent.level === 'require_human') {
        requestConsent({ rule, event });
        writeAudit({
          rule_id: rule.rule_id,
          trigger: rule.trigger,
          risk_class: rule.risk_class,
          consent: rule.consent,
          execution_result: 'pending_consent',
          context: event.context,
        });
      } else {
        executeActions(rule, event);
        writeAudit({
          rule_id: rule.rule_id,
          trigger: rule.trigger,
          risk_class: rule.risk_class,
          consent: rule.consent,
          execution_result: 'executed',
          context: event.context,
        });
      }
    }
  });
}

module.exports = { evaluateRules };
