(function () {
  const RUNTIME_PATH = '/data/reports/z_autonomous_runtime.json';
  const WATCHDOG_PATH = '/data/reports/z_autonomous_watchdog.json';
  const bodyEl = document.getElementById('zAutonomousHealthBody');
  const badgeEl = document.getElementById('zAutonomousBadge');
  const STALE_MINUTES = 120;

  function appendIndicatorLog(panel, ok, detail) {
    const root = window;
    if (!root.ZIndicatorLog) root.ZIndicatorLog = [];
    root.ZIndicatorLog.push({
      ts: new Date().toISOString(),
      panel,
      ok: Boolean(ok),
      detail,
    });
    if (root.ZIndicatorLog.length > 200) root.ZIndicatorLog.shift();
  }

  function minutesSince(iso) {
    const t = Date.parse(String(iso || ''));
    if (Number.isNaN(t)) return null;
    return Math.floor((Date.now() - t) / 60000);
  }

  function freshnessBadge(ageMin) {
    if (ageMin === null) return '<span class="z-autorun-badge z-autorun-unknown">unknown</span>';
    if (ageMin <= STALE_MINUTES) return `<span class="z-autorun-badge z-autorun-ok">${ageMin}m</span>`;
    if (ageMin <= STALE_MINUTES * 2) return `<span class="z-autorun-badge z-autorun-warn">${ageMin}m</span>`;
    return `<span class="z-autorun-badge z-autorun-critical">${ageMin}m</span>`;
  }

  function toneFromStatus(status) {
    const s = String(status || '').toLowerCase();
    if (s === 'ok' || s === 'green' || s === 'healthy') return 'good';
    if (s === 'watch' || s === 'warn' || s === 'degraded') return 'warn';
    return 'bad';
  }

  function setTone(el, tone) {
    if (!el) return;
    el.classList.remove('edge-status-good', 'edge-status-warn', 'edge-status-bad');
    el.classList.add(tone === 'good' ? 'edge-status-good' : tone === 'warn' ? 'edge-status-warn' : 'edge-status-bad');
  }

  async function loadJson(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  function render(runtime, watchdog) {
    if (!bodyEl) return;
    const rtStatus = String(runtime?.status || 'unknown');
    const wdStatus = String(watchdog?.status || 'unknown');
    const rtTone = toneFromStatus(rtStatus);
    const wdTone = toneFromStatus(wdStatus);
    const finalTone = rtTone === 'bad' || wdTone === 'bad' ? 'bad' : rtTone === 'warn' || wdTone === 'warn' ? 'warn' : 'good';

    const pol = runtime?.policy || {};
    const polHint = `high-ok=${pol.approval_ready_high ? 'y' : 'n'} · sacred-ok=${pol.approval_ready_sacred ? 'y' : 'n'}`;
    if (badgeEl) {
      badgeEl.textContent = `Auto AI: ${rtStatus.toUpperCase()}`;
      badgeEl.title = `Watchdog=${wdStatus.toUpperCase()} · ran=${runtime?.totals?.ran ?? '--'} · policy-skip=${runtime?.totals?.skipped_policy ?? '--'} · hard=${runtime?.totals?.failed_hard ?? '--'} · soft=${runtime?.totals?.failed_soft ?? '--'} · ${polHint}`;
      setTone(badgeEl, finalTone);
    }

    const due = Array.isArray(runtime?.due_job_ids) ? runtime.due_job_ids : [];
    const failed = Array.isArray(watchdog?.hard_failed_jobs) ? watchdog.hard_failed_jobs : [];
    const runtimeAgeMin = minutesSince(runtime?.generated_at);
    const watchdogAgeMin = minutesSince(watchdog?.generated_at);
    bodyEl.innerHTML = `
      <div><span class="z-autorun-badge ${finalTone === 'good' ? 'z-autorun-ok' : finalTone === 'warn' ? 'z-autorun-warn' : 'z-autorun-critical'}">RUNTIME ${rtStatus.toUpperCase()}</span></div>
      <div>Ran: ${runtime?.totals?.ran ?? '--'} · Executed: ${runtime?.totals?.executed ?? '--'} · Due: ${runtime?.totals?.due ?? '--'} · Interval skip: ${runtime?.totals?.skipped ?? '--'} · Policy skip: ${runtime?.totals?.skipped_policy ?? '--'}</div>
      <div>Approval: high ${pol.approval_ready_high ? 'ready' : 'needs token'} · sacred ${pol.approval_ready_sacred ? 'ready' : 'needs longer token'} (${pol.approval_env || 'Z_AUTONOMOUS_APPROVAL_TOKEN'})</div>
      <div>Failures: hard ${runtime?.totals?.failed_hard ?? '--'} · soft ${runtime?.totals?.failed_soft ?? '--'}</div>
      <div>Runtime generated: ${runtime?.generated_at ?? '--'} · age ${freshnessBadge(runtimeAgeMin)}</div>
      <div>Watchdog generated: ${watchdog?.generated_at ?? '--'} · age ${freshnessBadge(watchdogAgeMin)}</div>
      <div>Watchdog: <strong>${wdStatus.toUpperCase()}</strong> · stale: ${watchdog?.stale ? 'yes' : 'no'} · age: ${watchdog?.runtime_age_sec ?? '--'}s</div>
      <div>Due jobs: ${due.length ? due.join(', ') : 'none'}</div>
      <div>Hard-failed jobs: ${failed.length ? failed.join(', ') : 'none'}</div>
    `;
    appendIndicatorLog('z_autonomous_health_panel', true, `runtime=${rtStatus} watchdog=${wdStatus}`);
  }

  async function refresh() {
    try {
      const [runtime, watchdog] = await Promise.all([loadJson(RUNTIME_PATH), loadJson(WATCHDOG_PATH).catch(() => ({}))]);
      render(runtime, watchdog);
    } catch {
      if (bodyEl) {
        bodyEl.innerHTML = '<div class="z-muted">Run `npm run autonomous:run:once` then `npm run autonomous:watchdog`.</div>';
      }
      if (badgeEl) {
        badgeEl.textContent = 'Auto AI: --';
        setTone(badgeEl, 'warn');
      }
      appendIndicatorLog('z_autonomous_health_panel', false, 'load_failed');
    }
  }

  refresh();
  setInterval(refresh, 60_000);
})();
