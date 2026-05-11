// Z: core/z_pending_audit_monitor.js
// Pending audit monitor (read-only): shows outstanding TODO/FIXME markers.
(function () {
  const panel = document.getElementById('zPendingAuditBody');
  if (!panel) return;

  function appendIndicatorLog(panelId, ok, detail) {
    const root = window;
    if (!root.ZIndicatorLog) root.ZIndicatorLog = [];
    root.ZIndicatorLog.push({ ts: new Date().toISOString(), panel: panelId, ok: Boolean(ok), detail });
    if (root.ZIndicatorLog.length > 200) root.ZIndicatorLog.shift();
  }

  async function loadJSON(path) {
    try {
      const res = await fetch(path, { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  function minutesSince(ts) {
    if (!ts) return null;
    const parsed = Date.parse(ts);
    if (Number.isNaN(parsed)) return null;
    return Math.floor((Date.now() - parsed) / 60000);
  }

  async function refresh() {
    const audit = await loadJSON('/data/reports/z_pending_audit.json');
    const ageMin = minutesSince(audit?.generated_at);
    const total = audit?.total ?? '—';
    const totalNum = typeof audit?.total === 'number' ? audit.total : null;
    const topFiles = Array.isArray(audit?.top_files) ? audit.top_files.slice(0, 5) : [];

    panel.innerHTML = `
      <div>Generated: <b>${audit?.generated_at || '—'}</b></div>
      <div>Age: <b>${ageMin === null ? '—' : `${ageMin}m`}</b></div>
      <div>Total markers: <span class="z-autorun-badge ${totalNum !== null && totalNum > 0 ? 'z-autorun-critical' : 'z-autorun-ok'}">${total}</span></div>
      <div class="z-muted" style="margin-top:0.25rem;">Top files:</div>
      <div class="z-autorun-tail">${
        topFiles.length ? topFiles.map((f) => `<div>${f.file}: ${f.count}</div>`).join('') : '—'
      }</div>
      <div class="z-muted"><a href="/data/reports/z_pending_audit.md" target="_blank">Open Pending Audit</a></div>
    `;
    appendIndicatorLog(
      'z_pending_audit_monitor',
      Boolean(audit),
      `total=${totalNum === null ? 'unknown' : totalNum} age=${ageMin === null ? 'unknown' : `${ageMin}m`}`
    );
  }

  refresh();
  setInterval(refresh, 60000);
})();
