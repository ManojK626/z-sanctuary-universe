// Z: core\action-executor.js
// Action Executor: Only runs actions after all gates are satisfied
function executeActions(rule, event) {
  void event;
  // For demo: just log actions
  if (!rule.action_set || !Array.isArray(rule.action_set.allowed_actions)) return;
  rule.action_set.allowed_actions.forEach((action) => {
    console.log(`Executing action: ${action.type}`, action.params);
    // Real system: dispatch to actual effectors here
  });
}

module.exports = { executeActions };
