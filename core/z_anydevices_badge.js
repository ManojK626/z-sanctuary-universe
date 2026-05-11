// Z: core/z_anydevices_badge.js
// Edge badge for AnyDevices analyzer posture (read-only).
(function () {
  const badgeEl = document.getElementById('zAnyDevicesBadge');
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
    if (status === 'amber' || status === 'hold' || status === 'warn') {
      badgeEl.classList.add('edge-status-warn');
      return;
    }
    badgeEl.classList.add('edge-status-bad');
  }

  function render(report, queue, security) {
    const status = String(report?.status || 'unknown').toLowerCase();
    const secStatus = String(security?.status || 'unknown').toLowerCase();
    const caps = Array.isArray(report?.capabilities) ? report.capabilities : [];
    const pass = caps.filter((c) => c && c.pass === true).length;
    const approvals = Array.isArray(queue?.approvals) ? queue.approvals : [];
    const pending = approvals.filter((x) => x && x.status === 'pending').length;
    const tone = secStatus === 'green' ? status : secStatus === 'blocked' ? 'red' : 'warn';
    badgeEl.textContent = `Devices: ${status} · Sec:${secStatus} · ${pass}/${caps.length} · P${pending}`;
    badgeEl.title = `AnyDevices posture: status=${status}, security=${secStatus}, capabilities=${pass}/${caps.length}, pending approvals=${pending}, approval required`;
    applyTone(tone);
  }

  async function refresh() {
    try {
      const [report, queue, security] = await Promise.all([
        loadJson('/data/reports/z_anydevices_analyzer.json'),
        loadJson('/data/reports/z_anydevices_approval_queue.json'),
        loadJson('/data/reports/z_anydevices_security_scan.json'),
      ]);
      render(report, queue, security);
    } catch {
      badgeEl.textContent = 'Devices: unavailable';
      badgeEl.classList.remove('edge-status-good', 'edge-status-warn');
      badgeEl.classList.add('edge-status-bad');
    }
  }

  refresh();
  setInterval(refresh, 60_000);
})();
