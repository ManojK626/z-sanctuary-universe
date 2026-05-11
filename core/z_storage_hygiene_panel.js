// Z: core/z_storage_hygiene_panel.js
// Read-only panel for storage hygiene posture.
(function () {
  const body = document.getElementById('zStorageHygieneBody');
  if (!body) return;

  function badgeClass(status) {
    const value = String(status || '').toLowerCase();
    if (value === 'green') return 'z-autorun-ok';
    if (value === 'hold') return 'z-autorun-warn';
    if (value === 'red') return 'z-autorun-critical';
    return 'z-autorun-unknown';
  }

  async function loadJson(path) {
    try {
      const res = await fetch(path, { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  function render(report) {
    if (!report) {
      body.innerHTML = '<div class="z-muted">Storage hygiene: run task <b>Z: Storage Hygiene Audit</b> to generate report.</div>';
      return;
    }

    const checks = Array.isArray(report.checks) ? report.checks : [];
    const failed = checks.filter((c) => c.pass === false).length;
    const metrics = report.metrics || {};

    const pollAt = new Date().toLocaleString();
    body.innerHTML = `
      <div>
        Status:
        <span class="z-autorun-badge ${badgeClass(report.status)}">${report.status || 'unknown'}</span>
        · Mode: <b>${report.mode || 'audit'}</b>
      </div>
      <div class="z-muted">Dashboard poll: ${pollAt}</div>
      <div class="z-muted">Generated: ${report.generated_at || '—'}</div>
      <div style="margin-top:0.25rem;">
        Actionable duplicate groups: <b>${metrics.duplicate_file_groups_actionable ?? '—'}</b>
      </div>
      <div>
        Empty files: <b>${metrics.empty_files ?? '—'}</b>
        · Empty dirs: <b>${metrics.empty_dirs ?? '—'}</b>
      </div>
      <div>
        Unrelated flags: <b>${metrics.unrelated_flags ?? '—'}</b>
        · Failed checks: <b>${failed}</b>
      </div>
      <div class="z-muted" style="margin-top:0.25rem;">
        <a href="/data/reports/z_storage_hygiene_audit.json" target="_blank">Open report JSON</a>
      </div>
    `;
  }

  async function refresh() {
    const report = await loadJson('/data/reports/z_storage_hygiene_audit.json');
    render(report);
  }

  refresh();
  setInterval(refresh, 60_000);
})();
