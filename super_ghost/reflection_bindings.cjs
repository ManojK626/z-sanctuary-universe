const { startScheduler } = require('./reflection_scheduler.cjs');

function initReflection() {
  startScheduler();
}

module.exports = { initReflection };
