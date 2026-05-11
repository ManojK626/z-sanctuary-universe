// Z: core\super_ghost_panel.js
// Insight Lab panel renderer (Super Ghost / AMK Goku mindset).
(function () {
  const panel = document.getElementById('zInsightLabPanel');
  const summaryEl = document.getElementById('zInsightSummary');
  const listEl = document.getElementById('zInsightList');
  const reflectionEl = document.getElementById('zInsightReflection');
  const ethicsEl = document.getElementById('zEthicsWatcher');
  const refreshBtn = document.getElementById('zInsightRefreshBtn');
  const exportBtn = document.getElementById('zInsightExportBtn');

  if (!panel) return;

  let quietStatus = { active: null, reason: 'n/a', nextReview: 'n/a' };

  async function loadQuietStatus() {
    const urls = [
      '../Amk_Goku Worldwide Loterry/data/reports/system_status.json',
      '../Amk_Goku%20Worldwide%20Loterry/data/reports/system_status.json',
    ];
    for (const url of urls) {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) continue;
        const status = await res.json();
        quietStatus = {
          active: Boolean(status?.quiet_mode?.active),
          reason: status?.quiet_mode?.reason || 'n/a',
          nextReview: status?.quiet_mode?.next_review || 'n/a',
        };
        return;
      } catch {
        // try next
      }
    }
  }

  function renderInsight(insight) {
    if (!insight) {
      summaryEl.textContent = 'Insight engine warming up...';
      listEl.innerHTML = '';
      if (reflectionEl)
        reflectionEl.textContent = 'Reflection will appear once weekly reflection runs.';
      if (ethicsEl) ethicsEl.textContent = 'Ethics watch is waiting for drift.';
      return;
    }
    summaryEl.textContent = insight.summary;
    listEl.innerHTML = '';
    const metrics = document.createElement('li');
    metrics.className = 'z-insight-metric';
    metrics.textContent = `Metrics: stress ${insight.metrics.stress.toFixed(2)}, load ${insight.metrics.load.toFixed(
      2
    )}, risk ${insight.metrics.risk.toFixed(2)}, harmony ${insight.metrics.harmony?.toFixed(2) ?? 'n/a'}`;
    listEl.appendChild(metrics);
    const quietLine = document.createElement('li');
    quietLine.className = 'z-insight-metric';
    quietLine.textContent = `Quiet mode: ${quietStatus.active ? 'active' : 'inactive'} · ${
      quietStatus.reason
    } · review ${quietStatus.nextReview}`;
    listEl.appendChild(quietLine);
    if (insight.actions?.length) {
      insight.actions.forEach((action) => {
        const li = document.createElement('li');
        li.textContent = `${action.action}: ${action.count} times`;
        listEl.appendChild(li);
      });
    }
    if (insight.chainHeat?.length) {
      const heatHeader = document.createElement('li');
      heatHeader.textContent = 'Chain heat (week):';
      heatHeader.className = 'z-insight-section';
      listEl.appendChild(heatHeader);
      insight.chainHeat.slice(0, 3).forEach((heat) => {
        const li = document.createElement('li');
        li.textContent = `${heat.id}: avg ${heat.avgHeat.toFixed(2)} / peak ${heat.peakHeat.toFixed(2)}`;
        listEl.appendChild(li);
      });
    }
    if (insight.trends?.length) {
      const trendHeader = document.createElement('li');
      trendHeader.textContent = 'Chain trends:';
      trendHeader.className = 'z-insight-section';
      listEl.appendChild(trendHeader);
      insight.trends.slice(0, 2).forEach((trend) => {
        const li = document.createElement('li');
        li.textContent = `${trend.id}: ${trend.trend}`;
        listEl.appendChild(li);
      });
    }
    if (insight.sample?.length) {
      const sampleHeader = document.createElement('li');
      sampleHeader.textContent = 'Recent events:';
      sampleHeader.className = 'z-insight-section';
      listEl.appendChild(sampleHeader);
      insight.sample.forEach((event) => {
        const li = document.createElement('li');
        li.textContent = `${event.t}: ${event.action} ${event.value || ''}`.trim();
        listEl.appendChild(li);
      });
    }
    if (reflectionEl) {
      const quietNote = quietStatus.active
        ? 'Stillness is active — stabilization is intentional.'
        : 'Stillness is inactive — observation remains calm.';
      reflectionEl.textContent = `${insight.reflection || 'Reflection continues to learn.'} ${quietNote}`;
    }
    if (ethicsEl) {
      ethicsEl.textContent = insight.driftMessage || 'Ethics drift is not detected.';
    }
  }

  function render() {
    loadQuietStatus();
    const insight = window.ZSuperGhost?.getInsight?.() || window.ZSuperGhost?.generate?.();
    renderInsight(insight);
  }

  function exportInsight() {
    const insight = window.ZSuperGhost?.getInsight?.();
    if (!insight) return;
    const blob = new Blob([JSON.stringify(insight, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'z_super_ghost_insight.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      const insight = window.ZSuperGhost?.generate?.('manual');
      renderInsight(insight);
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', exportInsight);
  }

  render();
  setInterval(render, 20000);
  setInterval(loadQuietStatus, 60000);
  window.ZInsightLab = { render, export: exportInsight };
})();
