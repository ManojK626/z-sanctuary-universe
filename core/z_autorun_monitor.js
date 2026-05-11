// Z: core/z_autorun_monitor.js
// Auto-run monitor (read-only): reflects background runs and last log status.
(function () {
  const panel = document.getElementById('zAutoRunStatusBody');
  const alertBanner = document.getElementById('zAutoRunAlert');
  const auditBtn = document.getElementById('zAutoRunAuditBtn');
  if (!panel) return;

  function appendIndicatorLog(panelId, ok, detail) {
    const root = window;
    if (!root.ZIndicatorLog) root.ZIndicatorLog = [];
    root.ZIndicatorLog.push({ ts: new Date().toISOString(), panel: panelId, ok: Boolean(ok), detail });
    if (root.ZIndicatorLog.length > 200) root.ZIndicatorLog.shift();
  }

  async function loadText(path) {
    try {
      const res = await fetch(path, { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.text();
    } catch {
      return null;
    }
  }

  function lastNonEmptyLine(text) {
    if (!text) return null;
    const lines = text.trim().split(/\r?\n/);
    for (let i = lines.length - 1; i >= 0; i -= 1) {
      const line = lines[i].trim();
      if (line) return line;
    }
    return null;
  }

  function parseTimestamp(line) {
    if (!line) return null;
    const match = line.match(/\[(.+?)\]/);
    if (!match) return null;
    return Date.parse(match[1]);
  }

  function minutesSince(ms) {
    if (!ms || Number.isNaN(ms)) return null;
    return Math.floor((Date.now() - ms) / 60000);
  }

  function statusFromLine(line) {
    if (!line) return 'unknown';
    if (line.includes('complete')) return 'complete';
    if (line.includes('skipped')) return 'skipped';
    if (line.includes('start')) return 'running';
    return 'unknown';
  }

  function statusClass(status) {
    if (status === 'complete') return 'z-autorun-ok';
    if (status === 'running') return 'z-autorun-warn';
    if (status === 'skipped') return 'z-autorun-skip';
    return 'z-autorun-unknown';
  }

  function ageClass(ageMin) {
    if (ageMin === null) return 'z-autorun-unknown';
    if (ageMin <= 60) return 'z-autorun-ok';
    if (ageMin <= 240) return 'z-autorun-warn';
    return 'z-autorun-critical';
  }

  function lastLines(text, count) {
    if (!text) return [];
    const lines = text.trim().split(/\r?\n/).filter(Boolean);
    return lines.slice(-count);
  }

  async function refresh() {
    const lastTag = await loadText('/logs/background_run.last');
    const meta = await loadText('/logs/background_run.meta');
    const log = await loadText('/logs/background_run.log');
    const audit = await (async () => {
      try {
        const res = await fetch('/data/reports/z_autorun_audit.json', { cache: 'no-store' });
        if (!res.ok) return null;
        return await res.json();
      } catch {
        return null;
      }
    })();

    const lastLine = lastNonEmptyLine(log);
    const status = statusFromLine(lastLine);
    const ts = parseTimestamp(lastLine);
    const ageMin = minutesSince(ts);
    const tail = lastLines(log, 3);
    const autoSetting = audit?.auto_tasks_setting || 'unknown';
    const autoTasks = audit?.auto_tasks?.length ? audit.auto_tasks.join(', ') : '—';
    const checks = Array.isArray(audit?.checks) ? audit.checks : [];
    const auditBlocked = audit && checks.some((c) => c.pass === false);

    panel.innerHTML = `
      <div>Last tag: <b>${lastTag ? lastTag.trim() : '—'}</b></div>
      <div>Status: <span class="z-autorun-badge ${statusClass(status)}">${status}</span></div>
      <div>Last log: ${lastLine || '—'}</div>
      <div class="z-muted" style="margin-top:0.25rem;">Last 3 lines:</div>
      <div class="z-autorun-tail">${tail.length ? tail.map((line) => `<div>${line}</div>`).join('') : '—'}</div>
      <div class="z-muted">Age: <span class="z-autorun-badge ${ageClass(ageMin)}">${ageMin === null ? '—' : `${ageMin}m`}</span> · Meta: ${meta ? meta.trim() : '—'}</div>
      <div class="z-muted">Auto tasks: <b>${autoSetting}</b> · ${autoTasks}</div>
    `;
    appendIndicatorLog('z_autorun_monitor', true, `status=${status} age=${ageMin === null ? 'unknown' : `${ageMin}m`}`);

    if (alertBanner) {
      alertBanner.style.display = auditBlocked ? 'block' : 'none';
    }
  }

  if (auditBtn) {
    auditBtn.addEventListener('click', async () => {
      const cmd = 'node scripts/z_autorun_audit.mjs';
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(cmd);
          auditBtn.textContent = 'Command Copied';
        } else {
          auditBtn.textContent = 'Copy Command';
        }
      } catch {
        auditBtn.textContent = 'Copy Command';
      }
      setTimeout(() => {
        auditBtn.textContent = 'Run Audit Now';
      }, 2000);
    });
  }

  refresh();
  setInterval(refresh, 60000);
})();
