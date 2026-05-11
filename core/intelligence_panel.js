// Z: core\intelligence_panel.js
// Intelligence Engine dashboard panel
(function () {
  const panel = document.getElementById('zIntelligencePanel');
  if (!panel) return;
  const listEl = document.getElementById('zIntelligenceList');
  const exportBtn = document.getElementById('zIntelligenceExport');
  const webhookBtn = document.getElementById('zIntelligenceSend');
  const webhookInput = document.getElementById('zIntelligenceWebhook');
  const alertEl = document.getElementById('zIntelligenceAlerts');
  const predictionsEl = document.getElementById('zIntelligencePredictions');
  const pendingAlerts = [];

  function addRow(label, value) {
    const row = document.createElement('div');
    row.className = 'z-intel-row';
    row.innerHTML = `<span>${label}</span><span>${value}</span>`;
    listEl?.appendChild(row);
  }

  function renderRows(patterns, stats) {
    listEl.innerHTML = '';
    Object.entries(patterns.z || {})
      .slice(0, 6)
      .forEach(([key, pattern]) => {
        addRow(`${key} threshold`, `${pattern.threshold} spins / missing ${pattern.since}`);
      });
    Object.entries(patterns.zx || {})
      .slice(0, 6)
      .forEach(([key, pattern]) => {
        addRow(`${key} gap`, `${pattern.misses} misses / threshold ${pattern.threshold}`);
      });
    Object.entries(stats || {}).forEach(([key, bucket]) => {
      addRow(
        `Category ${key}`,
        `${bucket.percentage.toFixed(1)}% hits (${bucket.numbers.join(',')})`
      );
    });
  }

  function renderHistory() {
    const patterns = window.ZRouletteIntelligence?.getPatterns?.() || {};
    const history = window.ZRouletteIntelligence?.getHistory?.() || [];
    const stats = window.ZRouletteIntelligence?.getCategoryStats?.(history) || {};
    renderRows(patterns, stats);
    renderPredictions(history);
  }

  function renderAlerts() {
    if (!alertEl) return;
    alertEl.innerHTML = '';
    pendingAlerts
      .slice(-5)
      .reverse()
      .forEach((detail) => {
        const entry = document.createElement('div');
        entry.className = 'z-intel-alert';
        entry.textContent = `${detail.type.toUpperCase()} ${detail.key} (${detail.count}/${detail.threshold})`;
        alertEl.appendChild(entry);
      });
  }

  function renderPredictions(history) {
    if (!predictionsEl) return;
    const predictions = window.ZRouletteIntelligence?.getPredictionCandidates?.(history) || [];
    predictionsEl.innerHTML = predictions.length
      ? predictions.map((n) => `<span>${n}</span>`).join('')
      : 'Awaiting stats.';
  }

  function pushAlert(detail) {
    pendingAlerts.push(detail);
    renderAlerts();
  }

  function notifyWebhook() {
    if (!webhookBtn || !webhookInput) return;
    const url = webhookInput.value.trim();
    if (!url) return;
    const payload = {
      patterns: window.ZRouletteIntelligence.getPatterns(),
      history: window.ZRouletteIntelligence.getHistory(),
      alerts: pendingAlerts.slice(-5),
    };
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        webhookBtn.textContent = res.ok ? 'Sent' : 'Retry';
        setTimeout(() => (webhookBtn.textContent = 'Send Snapshot'), 2000);
      })
      .catch(() => {
        webhookBtn.textContent = 'Failed';
        setTimeout(() => (webhookBtn.textContent = 'Send Snapshot'), 2000);
      });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const payload = {
        patterns: window.ZRouletteIntelligence.getPatterns(),
        history: window.ZRouletteIntelligence.getHistory(),
        metadata: window.ZRouletteHistoryMetadata || {},
        insights: window.ZInsightFeed?.list?.(10) || [],
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'intelligence-engine.json';
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  if (webhookBtn) {
    webhookBtn.addEventListener('click', notifyWebhook);
  }

  renderHistory();
  setInterval(renderHistory, 20000);
  window.addEventListener('zRoulettePatternUpdate', renderHistory);
  window.addEventListener('zRouletteAlert', (event) => pushAlert(event.detail));
  window.ZIntelligencePanel = { render: renderHistory };
})();
