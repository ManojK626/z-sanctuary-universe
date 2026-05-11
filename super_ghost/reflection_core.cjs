const { collect } = require('./reflection_collector.cjs');
const { synthesize } = require('./reflection_weaver.cjs');
const { narrate } = require('./reflection_narrator.cjs');

function runReflection() {
  const data = collect();
  const reflection = synthesize(data);
  const narration = narrate(reflection);

  global.ZChronicle?.log('super_ghost.weekly_reflection', { reflection, narration });
  global.ZInsight?.ingest?.({ type: 'weekly_reflection', data: narration });

  return narration;
}

module.exports = { runReflection };
