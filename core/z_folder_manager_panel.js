// Z: core/z_folder_manager_panel.js
// Read-only Folder Manager panel.
(function () {
  const bodyEl = document.getElementById('zFolderManagerBody');
  const metaEl = document.getElementById('zFolderManagerMeta');
  if (!bodyEl || !metaEl) return;

  const STATUS_URL = '/data/reports/z_folder_manager_status.json';
  const REFRESH_MS = 30000;

  function fmt(ts) {
    if (!ts) return '--';
    const d = new Date(ts);
    return Number.isNaN(d.getTime()) ? '--' : d.toLocaleString();
  }

  function render(payload) {
    const status = payload?.status || 'unknown';
    const mode = payload?.mode || 'status';
    const candidate = Number(payload?.candidate_changes || 0);
    const threshold = payload?.drift_warn_threshold ?? 'n/a';
    const drift = payload?.drift_warning === true;
    const checks = Array.isArray(payload?.guard_checks) ? payload.guard_checks : [];
    const failed = checks.filter((c) => !c.pass).length;
    const latest = payload?.latest_snapshot || payload?.source_snapshot || '--';

    metaEl.textContent = `Updated: ${fmt(payload?.generated_at)} | mode=${mode}`;
    bodyEl.innerHTML = `
      <div class="z-kv"><span>Status</span><span>${status}</span></div>
      <div class="z-kv"><span>Latest Snapshot</span><span title="${latest}">${latest}</span></div>
      <div class="z-kv"><span>Candidate Changes</span><span>${candidate}</span></div>
      <div class="z-kv"><span>Drift Threshold</span><span>${threshold}</span></div>
      <div class="z-kv"><span>Drift Warning</span><span>${drift ? 'yes' : 'no'}</span></div>
      <div class="z-kv"><span>Guard Failures</span><span>${failed}</span></div>
      <div class="z-muted" style="margin-top:0.4rem;">Read-only panel. No apply actions.</div>
    `;
  }

  async function refresh() {
    try {
      const resp = await fetch(`${STATUS_URL}?ts=${Date.now()}`, { cache: 'no-store' });
      if (!resp.ok) throw new Error('status unavailable');
      const payload = await resp.json();
      render(payload);
    } catch {
      metaEl.textContent = 'Updated: --';
      bodyEl.innerHTML = '<div class="z-muted">Folder manager status unavailable.</div>';
    }
  }

  refresh();
  setInterval(refresh, REFRESH_MS);
})();
