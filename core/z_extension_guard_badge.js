// Z: core/z_extension_guard_badge.js
(function () {
  const badgeEl = document.getElementById('zExtensionGuardBadge');
  if (!badgeEl) return;

  async function loadReport() {
    const res = await fetch('/data/reports/z_extension_guard.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('extension guard report missing');
    return res.json();
  }

  function render(report) {
    const status = String(report?.status || 'unknown').toLowerCase();
    const settings = report?.metrics?.required_settings ?? 0;
    const recs = report?.metrics?.required_recommendations ?? 0;
    badgeEl.textContent = `Ext Guard: ${status.toUpperCase()} · settings ${settings} · recs ${recs}`;
    badgeEl.title = `Extension guard status=${status}, settings=${settings}, recommendations=${recs}`;
    badgeEl.classList.remove('edge-status-good', 'edge-status-warn', 'edge-status-bad');
    if (status === 'green') badgeEl.classList.add('edge-status-good');
    else if (status === 'hold') badgeEl.classList.add('edge-status-warn');
    else badgeEl.classList.add('edge-status-bad');
  }

  async function refresh() {
    try {
      const report = await loadReport();
      render(report);
    } catch {
      badgeEl.textContent = 'Ext Guard: unavailable';
      badgeEl.classList.remove('edge-status-good', 'edge-status-warn');
      badgeEl.classList.add('edge-status-bad');
    }
  }

  refresh();
  setInterval(refresh, 60_000);
})();
