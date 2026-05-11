const { runReflection } = require('./reflection_core.cjs');

function startScheduler() {
  // Run immediately
  runReflection();
  // Weekly interval
  setInterval(runReflection, 7 * 24 * 60 * 60 * 1000);
}

module.exports = { startScheduler };
