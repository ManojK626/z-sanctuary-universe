// Z: core/z_zuno_trend_panel.js
// Read-only trend widget for daily Zuno state report.
(function () {
  const reportPath = '/data/reports/zuno_system_state_report.json';
  const historyPath = '/data/reports/zuno_state_history.json';
  const bodyEl = document.getElementById('zZunoTrendBody');
  const badgeEl = document.getElementById('zZunoTrendBadge');

  function sparkline(values) {
    if (!Array.isArray(values) || !values.length) return '--';
    const bars = '▁▂▃▄▅▆▇█';
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    return values
      .map((v) => {
        const idx = Math.max(
          0,
          Math.min(bars.length - 1, Math.round(((v - min) / span) * (bars.length - 1)))
        );
        return bars[idx];
      })
      .join('');
  }

  function toneClass(status) {
    if (status === 'GREEN' || status === 'stable-green') return 'z-autorun-ok';
    if (status === 'HOLD' || status === 'hold') return 'z-autorun-warn';
    return 'z-autorun-unknown';
  }

  function deltaClass(delta, inverted) {
    if (typeof delta !== 'number' || delta === 0) return 'z-autorun-unknown';
    if (inverted) return delta < 0 ? 'z-autorun-ok' : 'z-autorun-warn';
    return delta > 0 ? 'z-autorun-ok' : 'z-autorun-warn';
  }

  async function loadJson(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  function render(report, history) {
    const current = report?.current?.metrics || {};
    const exec = report?.executive_status || {};
    const trend = report?.trend_7d || {};
    const rows = Array.isArray(history) ? history.slice(-7) : [];
    const moduleSeries = rows.map((r) => Number(r?.metrics?.module_completion_pct || 0));
    const pendingSeries = rows.map((r) => Number(r?.metrics?.pending_total || 0));
    const openSeries = rows.map((r) => Number(r?.metrics?.task_open || 0));
    const sparkModule = sparkline(moduleSeries);
    const sparkPending = sparkline(pendingSeries);
    const sparkOpen = sparkline(openSeries);
    const moduleDelta = trend.module_completion_delta_pct;
    const openDelta = trend.task_open_delta;
    const pendingDelta = trend.pending_delta;

    if (bodyEl) {
      bodyEl.innerHTML = `
        <div><span class="z-autorun-badge ${toneClass(exec.internal_operations)}">${exec.internal_operations || 'unknown'}</span></div>
        <div>Module ${current.module_completion_pct ?? '--'}% <span class="z-zuno-spark">${sparkModule}</span></div>
        <div>Open ${current.task_open ?? '--'} <span class="z-zuno-spark">${sparkOpen}</span></div>
        <div>Pending ${current.pending_total ?? '--'} <span class="z-zuno-spark">${sparkPending}</span></div>
        <div>Gates ${current.readiness_gates_pass ?? '--'}/${current.readiness_gates_total ?? '--'} · <span class="z-autorun-badge ${exec.public_launch === 'ready' ? 'z-autorun-ok' : 'z-autorun-warn'}">${exec.public_launch || 'unknown'}</span></div>
        <div class="z-muted" style="font-size:0.68rem;">
          7d:
          <span class="z-autorun-badge ${deltaClass(moduleDelta, false)}">module ${moduleDelta ?? 'n/a'} pt</span>
          <span class="z-autorun-badge ${deltaClass(openDelta, true)}">open ${openDelta ?? 'n/a'}</span>
          <span class="z-autorun-badge ${deltaClass(pendingDelta, true)}">pending ${pendingDelta ?? 'n/a'}</span>
        </div>
      `;
    }

    if (badgeEl) {
      const mod = current.module_completion_pct ?? '--';
      const greenDays = trend.hygiene_green_days ?? 0;
      const windowDays = trend.window_days ?? 0;
      badgeEl.textContent = `Zuno: ${mod}% · ${greenDays}/${windowDays}d`;
      badgeEl.classList.remove('edge-status-good', 'edge-status-warn', 'edge-status-bad');
      if (exec.internal_operations === 'stable-green') badgeEl.classList.add('edge-status-good');
      else if (exec.internal_operations === 'hold') badgeEl.classList.add('edge-status-warn');
      else badgeEl.classList.add('edge-status-bad');
    }
  }

  async function refresh() {
    try {
      const [report, history] = await Promise.all([loadJson(reportPath), loadJson(historyPath)]);
      render(report, history);
    } catch (error) {
      if (bodyEl) {
        bodyEl.innerHTML = '<div class="z-muted">Zuno trend: run task <b>Z: Zuno State Report</b> to generate.</div>';
      }
      if (badgeEl) {
        badgeEl.textContent = 'Zuno: --';
        badgeEl.classList.remove('edge-status-good', 'edge-status-warn', 'edge-status-bad');
        badgeEl.classList.add('edge-status-warn');
      }
    }
  }

  refresh();
  setInterval(refresh, 60_000);
})();
