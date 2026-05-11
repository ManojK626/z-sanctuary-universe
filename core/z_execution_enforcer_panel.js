(function () {
  const REPORT_PATH = '/data/reports/z_execution_enforcer.json';
  const bodyEl = document.getElementById('zExecutionEnforcerBody');
  const badgeEl = document.getElementById('zExecutionEnforcerBadge');
  const modeToggleBtn = document.getElementById('zOnlyFixModeToggle');
  const MODE_KEY = 'z_only_fix_mode';
  const DISABLED_BUTTON_IDS = ['autopilotStartBtn', 'governanceCheckBtn'];
  const STALE_MINUTES = 240;

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

  function readOnlyFixMode() {
    try {
      return localStorage.getItem(MODE_KEY) === 'true';
    } catch {
      return false;
    }
  }

  function writeOnlyFixMode(value) {
    try {
      localStorage.setItem(MODE_KEY, value ? 'true' : 'false');
    } catch {
      // no-op
    }
  }

  function setBadgeTone(target, tone) {
    if (!target) return;
    target.classList.remove('edge-status-good', 'edge-status-warn', 'edge-status-bad');
    if (tone === 'good') target.classList.add('edge-status-good');
    else if (tone === 'warn') target.classList.add('edge-status-warn');
    else target.classList.add('edge-status-bad');
  }

  function actionTone(action) {
    if (action === 'ALLOW_PROGRESS') return 'good';
    if (action === 'FORCE_DIAGNOSTICS') return 'warn';
    return 'bad';
  }

  function applyDiscipline(report, onlyFixMode) {
    const action = String(report?.action || 'unknown').toUpperCase();
    const blockedByReport = action === 'BLOCK';
    const blocked = blockedByReport || onlyFixMode;
    document.body.classList.toggle('z-ee-only-fix-mode', blocked);

    DISABLED_BUTTON_IDS.forEach((id) => {
      const button = document.getElementById(id);
      if (!button) return;
      button.disabled = blocked;
      button.title = blocked
        ? 'Disabled by Z-Execution Enforcer discipline layer.'
        : button.getAttribute('data-z-default-title') || button.title || '';
      if (!button.getAttribute('data-z-default-title')) {
        button.setAttribute('data-z-default-title', button.title || '');
      }
    });
  }

  function renderToggle(report) {
    if (!modeToggleBtn) return;
    const action = String(report?.action || '').toUpperCase();
    const onlyFixMode = readOnlyFixMode();
    modeToggleBtn.textContent = `Only Fix: ${onlyFixMode ? 'On' : 'Off'}`;
    modeToggleBtn.setAttribute('aria-pressed', onlyFixMode ? 'true' : 'false');
    modeToggleBtn.classList.toggle('is-active', onlyFixMode);
    modeToggleBtn.title =
      action === 'BLOCK'
        ? 'Execution Enforcer is blocking progress. Keep Only Fix mode ON until blockers clear.'
        : 'Only Fix mode blocks non-fix actions in dashboard controls.';
  }

  function renderPanel(report) {
    const action = String(report?.action || 'UNKNOWN').toUpperCase();
    const checks = report?.checks || {};
    const directives = Array.isArray(report?.directives) ? report.directives : [];
    const onlyFixMode = readOnlyFixMode();
    const blocked = action === 'BLOCK' || onlyFixMode;

    if (bodyEl) {
      const toneClass =
        action === 'ALLOW_PROGRESS'
          ? 'z-autorun-ok'
          : action === 'FORCE_DIAGNOSTICS'
            ? 'z-autorun-warn'
            : 'z-autorun-critical';
      const listHtml = directives.length
        ? directives
            .slice(0, 3)
            .map((item) => `<div class="z-muted" style="font-size:0.68rem;">- ${item}</div>`)
            .join('')
        : '<div class="z-muted" style="font-size:0.68rem;">No directives.</div>';

      bodyEl.innerHTML = `
        <div><span class="z-autorun-badge ${toneClass}">${action}</span></div>
        <div>P1 open: ${checks.p1_open ?? '--'} · Gates: ${checks.readiness_pass ?? '--'}/${checks.readiness_total ?? '--'}</div>
        <div>Release: ${checks.release_gate ?? '--'} · Disturbance: ${checks.disturbance_watch ?? '--'}</div>
        <div>Planned modules: ${checks.planned_modules ?? '--'} · Promotion: ${checks.promotion_allowed ? 'allowed' : 'blocked'}</div>
        <div class="z-muted" style="font-size:0.68rem;">Report generated: ${report?.generated_at ?? '--'} · age ${freshnessBadge(minutesSince(report?.generated_at))}</div>
        <div class="z-muted" style="font-size:0.68rem;">Only Fix Mode: ${onlyFixMode ? 'ON' : 'OFF'} · Build controls: ${blocked ? 'LOCKED' : 'UNLOCKED'}</div>
        <div style="margin-top:0.25rem;">${listHtml}</div>
      `;
    }

    if (badgeEl) {
      badgeEl.textContent = blocked ? 'Z-EE: BLOCK' : `Z-EE: ${action}`;
      setBadgeTone(badgeEl, blocked ? 'bad' : actionTone(action));
    }

    renderToggle(report);
    applyDiscipline(report, onlyFixMode);
    appendIndicatorLog('z_execution_enforcer_panel', true, `action=${action} blocked=${blocked}`);
  }

  async function loadReport() {
    const response = await fetch(REPORT_PATH, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  }

  async function refresh() {
    try {
      const report = await loadReport();
      renderPanel(report);
      window.ZExecutionEnforcer = {
        report,
        refresh,
        setOnlyFixMode(value) {
          writeOnlyFixMode(Boolean(value));
          renderPanel(report);
        },
      };
    } catch {
      if (bodyEl) {
        bodyEl.innerHTML =
          '<div class="z-muted">Z-Execution Enforcer: run task <b>Z: Execution Enforcer</b>.</div>';
      }
      if (badgeEl) {
        badgeEl.textContent = 'Z-EE: --';
        setBadgeTone(badgeEl, 'warn');
      }
      renderToggle({});
      applyDiscipline({}, readOnlyFixMode());
      appendIndicatorLog('z_execution_enforcer_panel', false, 'load_failed');
    }
  }

  function wireToggle() {
    if (!modeToggleBtn) return;
    modeToggleBtn.addEventListener('click', function () {
      const next = !readOnlyFixMode();
      writeOnlyFixMode(next);
      refresh();
    });
  }

  wireToggle();
  refresh();
  setInterval(refresh, 60_000);
})();
