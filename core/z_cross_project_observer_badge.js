// Z: core/z_cross_project_observer_badge.js
// Read-only cross-project observer (data/reports/z_cross_project_observer.json).
(function () {
  const badgeEl = document.getElementById('zCrossProjectObserveBadge');
  if (!badgeEl) return;

  const BASE_MS = 90_000;
  const JITTER_MAX = 15_000;

  function nextDelayMs() {
    var m = typeof window.ZGrowthMode !== 'undefined' && window.ZGrowthMode.mult ? window.ZGrowthMode.mult() : 1;
    return Math.round(BASE_MS * m + Math.random() * JITTER_MAX);
  }

  async function loadJson(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  function applyTone(status) {
    const s = String(status || '').toLowerCase();
    badgeEl.classList.remove('edge-status-good', 'edge-status-warn', 'edge-status-bad');
    if (s === 'green') badgeEl.classList.add('edge-status-good');
    else if (s === 'watch') badgeEl.classList.add('edge-status-warn');
    else badgeEl.classList.add('edge-status-bad');
  }

  async function refresh() {
    try {
      const report = await loadJson('/data/reports/z_cross_project_observer.json');
      const st = String(report.status || 'unknown').toUpperCase();
      const sum = report.summary || {};
      badgeEl.textContent = `Observe: ${st} · ${sum.ok ?? 0}/${sum.total ?? 0}`;
      badgeEl.title =
        'Read-only PC-root observer (no member writes). ' +
        `bad=${sum.bad ?? 0} warn=${sum.warn ?? 0}. Run: Z: Cross-Project Health Probe (read-only)`;
      applyTone(String(report.status || '').toLowerCase());
    } catch {
      badgeEl.textContent = 'Observe: —';
      badgeEl.title = 'Run Z: Cross-Project Health Probe (read-only) to generate z_cross_project_observer.json';
      badgeEl.classList.remove('edge-status-good', 'edge-status-warn', 'edge-status-bad');
      badgeEl.classList.add('edge-status-warn');
    }
  }

  function schedule() {
    setTimeout(function () {
      refresh().finally(schedule);
    }, nextDelayMs());
  }

  window.addEventListener('z-growth-mode', function () {
    refresh();
  });

  refresh();
  schedule();
})();
