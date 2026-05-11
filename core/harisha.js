// Z: core\harisha.js
(function () {
  const chip = document.getElementById('harishaChip');
  if (!chip) return;

  function computeScore() {
    const heartbeat = window.ZHeartbeat?.getState?.() || {};
    const safePack = window.ZSafePack?.getSummary?.() || {};
    const retries = safePack.retryLoops || 0;
    const manual = safePack.manual || 0;
    const jitter = Math.max(0, (heartbeat.bpm || 60) / 60 - 1);
    let score = 100;
    score -= Math.min(30, (safePack.errors || 0) * 10);
    score -= Math.min(20, retries * 5);
    if (heartbeat.state !== 'running') score -= 25;
    score -= Math.min(20, manual * 5);
    score -= Math.min(10, jitter * 10);
    return Math.max(0, Math.min(100, score));
  }

  function tone(score) {
    if (score >= 80) return 'calm';
    if (score >= 60) return 'alert';
    if (score >= 40) return 'tense';
    return 'critical';
  }

  function render(score) {
    chip.textContent = `Harisha score ${score}`;
    chip.className = `harisha-chip harisha-${tone(score)}`;
  }

  function tick() {
    const score = computeScore();
    render(score);
    window.ZChronicle?.log('harisha.score', { score, ts: new Date().toISOString() });
    window.dispatchEvent(
      new CustomEvent('harisha:update', {
        detail: { score, state: tone(score) },
      })
    );
  }

  tick();
  setInterval(tick, 5 * 60 * 1000);
})();
