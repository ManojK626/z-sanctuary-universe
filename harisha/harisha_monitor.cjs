const { update, getScore } = require('./harisha_core.cjs');

function gatherSignals() {
  const heartbeat = global.ZHeartbeat?.getState?.() || {};
  const safePackStats = global.ZSafePack?.getSummary?.() || {};
  const retries = safePackStats.retries || 0;

  return {
    errorRate: (safePackStats.errors || 0) / Math.max(1, safePackStats.total || 1),
    retryLoops: retries,
    heartbeatPaused: heartbeat.state !== 'running',
    manualOverrides: safePackStats.manual || 0,
    jitter: Math.max(0, (heartbeat.bpm || 0) / 60 - 1),
  };
}

function tick() {
  const signals = gatherSignals();
  const score = update(signals);
  global.ZChronicle?.log('harisha.update', { score, signals, ts: new Date().toISOString() });
  return score;
}

function startHarishaLoop() {
  tick();
  setInterval(tick, 5 * 60 * 1000);
}

module.exports = { startHarishaLoop, getScore };
