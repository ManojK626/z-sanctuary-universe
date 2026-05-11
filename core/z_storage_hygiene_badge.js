// Z: core/z_storage_hygiene_badge.js
// Compact edge badge for storage hygiene posture.
(function () {
  const badgeEl = document.getElementById('zStorageHygieneBadge');
  if (!badgeEl) return;

  async function loadJson(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  function applyTone(status, actionable, unrelated) {
    badgeEl.classList.remove('edge-status-good', 'edge-status-warn', 'edge-status-bad');
    if (status === 'green' && Number(actionable || 0) === 0 && Number(unrelated || 0) === 0) {
      badgeEl.classList.add('edge-status-good');
      return;
    }
    if (status === 'green' || status === 'hold') {
      badgeEl.classList.add('edge-status-warn');
      return;
    }
    badgeEl.classList.add('edge-status-bad');
  }

  function render(report) {
    const status = String(report?.status || 'unknown').toLowerCase();
    const actionable = Number(report?.metrics?.duplicate_file_groups_actionable || 0);
    const unrelated = Number(report?.metrics?.unrelated_flags || 0);
    badgeEl.textContent = `Storage: ${status} · A${actionable}`;
    badgeEl.title = `Storage hygiene: status=${status}, actionable_duplicates=${actionable}, unrelated=${unrelated}`;
    applyTone(status, actionable, unrelated);
  }

  async function refresh() {
    try {
      const report = await loadJson('/data/reports/z_storage_hygiene_audit.json');
      render(report);
    } catch {
      badgeEl.textContent = 'Storage: unavailable';
      badgeEl.classList.remove('edge-status-good', 'edge-status-warn');
      badgeEl.classList.add('edge-status-bad');
    }
  }

  refresh();
  setInterval(refresh, 60_000);
})();
