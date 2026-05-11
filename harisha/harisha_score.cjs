function calcScore({ errorRate = 0, retryLoops = 0, heartbeatPaused = false, manualOverrides = 0, jitter = 0 }) {
  let score = 100;
  score -= Math.min(30, errorRate * 100);
  score -= Math.min(20, retryLoops * 5);
  if (heartbeatPaused) score -= 25;
  score -= Math.min(20, manualOverrides * 5);
  score -= Math.min(10, jitter * 10);
  return Math.max(0, Math.min(100, score));
}

module.exports = { calcScore };
