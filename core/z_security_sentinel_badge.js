// Z: core/z_security_sentinel_badge.js
// Compact edge badge for security sentinel state.
(function () {
  const badgeEl = document.getElementById('zSecuritySentinelBadge');
  if (!badgeEl) return;

  async function loadJson(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  function applyTone(status) {
    badgeEl.classList.remove('edge-status-good', 'edge-status-warn', 'edge-status-bad');
    if (status === 'green') {
      badgeEl.classList.add('edge-status-good');
      return;
    }
    if (status === 'warn' || status === 'hold') {
      badgeEl.classList.add('edge-status-warn');
      return;
    }
    badgeEl.classList.add('edge-status-bad');
  }

  function render(report) {
    const status = String(report?.status || 'unknown').toLowerCase();
    const critical = Number(report?.critical_count || 0);
    const warn = Number(report?.warn_count || 0);
    badgeEl.textContent = `Sentinel: ${status} · C${critical}W${warn}`;
    badgeEl.title = `Security sentinel: status=${status}, critical=${critical}, warn=${warn}`;
    applyTone(status);
  }

  async function refresh() {
    try {
      const report = await loadJson('/data/reports/z_security_sentinel.json');
      render(report);
    } catch {
      badgeEl.textContent = 'Sentinel: unavailable';
      badgeEl.classList.remove('edge-status-good', 'edge-status-warn');
      badgeEl.classList.add('edge-status-bad');
    }
  }

  refresh();
  setInterval(refresh, 60_000);
})();
