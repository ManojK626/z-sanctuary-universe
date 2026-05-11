(function () {
  const BOOT_REPORT_PATH = '/data/reports/z_ssws_boot_report.json';
  const COMMFLOW_PATH = '/data/reports/z_ecosystem_commflow_verifier.json';
  const OBSERVER_PATH = '/data/reports/z_cross_project_observer.json';
  const LAB_STATUS_PATH = '/data/reports/z_lab_status.json';
  const bodyEl = document.getElementById('zSSWSEcosystemHealthBody');
  const badgeEl = document.getElementById('zSSWSEcosystemHealthBadge');
  const STALE_MINUTES = 180;

  function appendIndicatorLog(panel, ok, detail) {
    const root = window;
    if (!root.ZIndicatorLog) root.ZIndicatorLog = [];
    root.ZIndicatorLog.push({ ts: new Date().toISOString(), panel, ok: Boolean(ok), detail });
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

  function setBadgeTone(tone) {
    if (!badgeEl) return;
    badgeEl.classList.remove('edge-status-good', 'edge-status-warn', 'edge-status-bad');
    badgeEl.classList.add(tone === 'good' ? 'edge-status-good' : tone === 'warn' ? 'edge-status-warn' : 'edge-status-bad');
  }

  function toneFrom(status) {
    const value = String(status || '').toLowerCase();
    if (value === 'green' || value === 'ok' || value === 'ready') return 'good';
    if (value === 'watch' || value === 'amber' || value === 'warn') return 'warn';
    return 'bad';
  }

  function parseBootStatus(bootReport) {
    const summary = bootReport?.summary || {};
    const warnings = Number(summary.warnings || 0);
    const failed = Number(summary.failed || 0);
    const total = Number(summary.total_steps || 0);
    const status = String(bootReport?.status || '').toLowerCase();
    const tone = failed > 0 ? 'bad' : warnings > 0 ? 'warn' : status === 'ok' ? 'good' : 'warn';
    return {
      tone,
      warnings,
      failed,
      total,
      profile: bootReport?.profile || 'unknown',
      generatedAt: bootReport?.generated_at || '--',
    };
  }

  function parseCommflowStatus(commflow) {
    const colors = commflow?.summary?.colors || {};
    const red = Number(colors.red || 0);
    const amber = Number(colors.amber || 0);
    const green = Number(colors.green || 0);
    return {
      overall: String(commflow?.overall_status || 'unknown'),
      red,
      amber,
      green,
      readiness: commflow?.gates_snapshot?.readiness || '--',
      p1Open: commflow?.gates_snapshot?.p1_open ?? '--',
    };
  }

  function parseObserver(observer) {
    const summary = observer?.summary || {};
    return {
      status: String(observer?.status || 'unknown'),
      total: Number(summary.total || 0),
      warn: Number(summary.warn || 0),
      bad: Number(summary.bad || 0),
      ok: Number(summary.ok || 0),
    };
  }

  function parseLabStatus(lab) {
    const rawRoot = String(lab?.lab_root || '');
    const rootName = rawRoot ? rawRoot.split('/').pop() : '--';
    const policy = String(lab?.lab_policy?.mode || 'unknown').toLowerCase();
    return {
      rootName,
      policy,
      status: String(lab?.status || 'unknown'),
    };
  }

  async function loadJson(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  function render(boot, commflow, observer, lab) {
    if (!bodyEl) return;
    const bootStatus = parseBootStatus(boot);
    const commflowStatus = parseCommflowStatus(commflow);
    const observerStatus = parseObserver(observer);
    const labStatus = parseLabStatus(lab);

    const finalTone =
      bootStatus.tone === 'bad' || toneFrom(commflowStatus.overall) === 'bad'
        ? 'bad'
        : bootStatus.tone === 'warn' || toneFrom(commflowStatus.overall) === 'warn'
          ? 'warn'
          : 'good';

    if (badgeEl) {
      badgeEl.textContent = `SSWS Link: ${String(commflowStatus.overall || '--').toUpperCase()}`;
      badgeEl.title = `Boot warnings=${bootStatus.warnings}, failed=${bootStatus.failed} · Observe warn=${observerStatus.warn}, bad=${observerStatus.bad} · Lab root=${labStatus.rootName} (${labStatus.policy})`;
      setBadgeTone(finalTone);
    }

    const bootLabelClass =
      bootStatus.tone === 'good' ? 'z-autorun-ok' : bootStatus.tone === 'warn' ? 'z-autorun-warn' : 'z-autorun-critical';
    const commflowLabelClass =
      toneFrom(commflowStatus.overall) === 'good'
        ? 'z-autorun-ok'
        : toneFrom(commflowStatus.overall) === 'warn'
          ? 'z-autorun-warn'
          : 'z-autorun-critical';
    const observeLabelClass =
      toneFrom(observerStatus.status) === 'good'
        ? 'z-autorun-ok'
        : toneFrom(observerStatus.status) === 'warn'
          ? 'z-autorun-warn'
          : 'z-autorun-critical';

    bodyEl.innerHTML = `
      <div><span class="z-autorun-badge ${bootLabelClass}">BOOT ${String(boot?.status || 'unknown').toUpperCase()}</span></div>
      <div>Profile: ${bootStatus.profile} · Steps: ${bootStatus.total} · Warnings: ${bootStatus.warnings} · Failed: ${bootStatus.failed}</div>
      <div><span class="z-autorun-badge ${commflowLabelClass}">COMMFLOW ${String(commflowStatus.overall || '--').toUpperCase()}</span></div>
      <div>Signals: green ${commflowStatus.green} · amber ${commflowStatus.amber} · red ${commflowStatus.red}</div>
      <div>Readiness: ${commflowStatus.readiness} · P1 open: ${commflowStatus.p1Open}</div>
      <div><span class="z-autorun-badge ${observeLabelClass}">OBSERVE ${String(observerStatus.status || '--').toUpperCase()}</span></div>
      <div>Projects: ${observerStatus.ok}/${observerStatus.total} ok · warn ${observerStatus.warn} · bad ${observerStatus.bad}</div>
      <div>Lab Root: <strong>${labStatus.rootName}</strong> · policy: ${labStatus.policy} · status: ${labStatus.status}</div>
      <div class="z-muted" style="margin-top:0.25rem;">Boot ts: ${boot?.generated_at || '--'} · ${freshnessBadge(minutesSince(boot?.generated_at))}</div>
      <div class="z-muted">Commflow ts: ${commflow?.generated_at || '--'} · ${freshnessBadge(minutesSince(commflow?.generated_at))}</div>
      <div class="z-muted">Observer ts: ${observer?.generated_at || '--'} · ${freshnessBadge(minutesSince(observer?.generated_at))}</div>
    `;
    appendIndicatorLog(
      'z_ssws_ecosystem_health_card',
      finalTone !== 'bad',
      `boot=${boot?.status || 'unknown'} commflow=${commflowStatus.overall}`
    );
  }

  async function refresh() {
    try {
      const [boot, commflow, observer, lab] = await Promise.all([
        loadJson(BOOT_REPORT_PATH),
        loadJson(COMMFLOW_PATH),
        loadJson(OBSERVER_PATH),
        loadJson(LAB_STATUS_PATH).catch(() => ({})),
      ]);
      render(boot, commflow, observer, lab);
    } catch {
      if (bodyEl) {
        bodyEl.innerHTML =
          '<div class="z-muted">Run `npm run ssws:boot:full-ui -- --no-open` to refresh SSWS ecosystem health artifacts.</div>';
      }
      if (badgeEl) {
        badgeEl.textContent = 'SSWS Link: --';
        setBadgeTone('warn');
      }
      appendIndicatorLog('z_ssws_ecosystem_health_card', false, 'load_failed');
    }
  }

  refresh();
  setInterval(refresh, 60_000);
})();
