// Z: core/z_slo_badge.js
// Compact top-rail badge for SLO health.
(function () {
  const badgeEl = document.getElementById('zSloHealthBadge');
  if (!badgeEl) return;

  async function loadJson(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async function render(report) {
    const status = String(report?.status || 'unknown').toLowerCase();
    const failed = Number(report?.totals?.failed || 0);
    const targets = Number(report?.totals?.targets || 0);
    badgeEl.textContent = `SLO: ${status.toUpperCase()}${targets ? ` · ${targets - failed}/${targets}` : ''}`;
    badgeEl.title = `SLO guard status=${status}, failed=${failed}, targets=${targets}`;
    badgeEl.classList.remove('edge-status-good', 'edge-status-warn', 'edge-status-bad');
    if (status === 'green' && failed === 0) badgeEl.classList.add('edge-status-good');
    else if (status === 'hold') badgeEl.classList.add('edge-status-warn');
    else badgeEl.classList.add('edge-status-bad');
    const profileAttr = report?.checks?.[0]?.profile_name || report?.profile || '';
    if (profileAttr) {
      badgeEl.title = `${badgeEl.title} · profile=${profileAttr}`;
    }
  }

  async function refresh() {
    try {
      const report = await loadJson('/data/reports/z_slo_guard.json');
      await render(report);
    } catch {
      badgeEl.textContent = 'SLO: unavailable';
      badgeEl.classList.remove('edge-status-good', 'edge-status-warn');
      badgeEl.classList.add('edge-status-bad');
    }
  }

  refresh();
  setInterval(refresh, 60_000);
  (async function annotateIdentity() {
    try {
      const res = await fetch('../config/z_workspace_identity.json', { cache: 'no-store' });
      if (!res.ok) return;
      const identity = await res.json();
      const profile = identity.id || identity.role || '';
      if (profile) {
        badgeEl.dataset.workspaceProfile = profile;
        badgeEl.classList.add('with-profile');
      }
    } catch {
      // ignore
    }
  })();
})();
