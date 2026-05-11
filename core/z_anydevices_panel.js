// Z: core/z_anydevices_panel.js
// Read-only AnyDevices posture panel (privacy-first, approval-required).
(function () {
  const body = document.getElementById('zAnyDevicesBody');
  if (!body) return;

  function badgeClass(status) {
    const value = String(status || '').toLowerCase();
    if (value === 'green') return 'z-autorun-ok';
    if (value === 'amber' || value === 'hold' || value === 'warn') return 'z-autorun-warn';
    if (value === 'red') return 'z-autorun-critical';
    return 'z-autorun-unknown';
  }

  async function loadJson(url) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  function buildSuggestedDevice(report) {
    const adapters = Array.isArray(report?.network?.adapters) ? report.network.adapters : [];
    const gpus = Array.isArray(report?.compute?.gpus) ? report.compute.gpus : [];
    const firstAdapter = adapters.find((a) => a?.Name)?.Name;
    const firstGpu = gpus.find((g) => g?.Name)?.Name;
    return firstAdapter || firstGpu || 'Generic Device';
  }

  function buildRequestCommand(report) {
    const device = String(buildSuggestedDevice(report)).replace(/"/g, '');
    return `node scripts/z_anydevices_approval_queue.mjs request --device "${device}" --intent "telemetry_read" --by "zuno" --risk low`;
  }

  function wireActions(report) {
    const toggleBtn = document.getElementById('zAnyDevicesRequestApprovalBtn');
    const helper = document.getElementById('zAnyDevicesCmdHelper');
    const cmdInput = document.getElementById('zAnyDevicesCmdInput');
    const copyBtn = document.getElementById('zAnyDevicesCopyCmdBtn');
    if (!toggleBtn || !helper || !cmdInput || !copyBtn) return;

    cmdInput.value = buildRequestCommand(report);

    toggleBtn.addEventListener('click', () => {
      const open = helper.style.display !== 'none';
      helper.style.display = open ? 'none' : 'block';
      toggleBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (!open) cmdInput.focus();
    });

    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(cmdInput.value);
        copyBtn.textContent = 'Copied';
      } catch {
        cmdInput.select();
        copyBtn.textContent = 'Select+Copy';
      }
      window.setTimeout(() => {
        copyBtn.textContent = 'Copy Cmd';
      }, 1200);
    });
  }

  function render(report, queue, security, monitor) {
    if (!report) {
      body.innerHTML = '<div class="z-muted">No AnyDevices report found.</div>';
      return;
    }

    const caps = Array.isArray(report.capabilities) ? report.capabilities : [];
    const passCount = caps.filter((c) => c && c.pass === true).length;
    const candidates = caps.filter((c) => /candidate$/i.test(String(c.id || ''))).length;
    const host = report.host || {};
    const cpu = host.cpu || {};
    const mem = host.memory_gb || {};
    const storage = report.storage || {};
    const approvals = Array.isArray(queue?.approvals) ? queue.approvals : [];
    const pending = approvals.filter((x) => x && x.status === 'pending').length;
    const approved = approvals.filter((x) => x && x.status === 'approved').length;
    const rejected = approvals.filter((x) => x && x.status === 'rejected').length;
    const securityStatus = String(security?.status || 'unknown').toLowerCase();
    const monitorStatus = String(monitor?.status || 'unknown').toLowerCase();
    const secAge = security?.generated_at
      ? `${Math.max(0, Math.floor((Date.now() - Date.parse(security.generated_at)) / 60000))}m`
      : 'n/a';
    const analyzerAge = report?.generated_at
      ? `${Math.max(0, Math.floor((Date.now() - Date.parse(report.generated_at)) / 60000))}m`
      : 'n/a';

    const pollAt = new Date().toLocaleString();
    body.innerHTML = `
      <div>
        Status:
        <span class="z-autorun-badge ${badgeClass(report.status)}">${String(report.status || 'unknown').toUpperCase()}</span>
        · Mode: <b>${report.mode || 'audit-only'}</b>
      </div>
      <div class="z-muted">Dashboard poll: ${pollAt}</div>
      <div class="z-muted">Generated: ${report.generated_at || '—'}</div>
      <div class="z-muted">Analyzer age: ${analyzerAge} · Monitor: ${monitorStatus}</div>
      <div>
        Security scan:
        <span class="z-autorun-badge ${badgeClass(securityStatus)}">${securityStatus.toUpperCase()}</span>
        · age: ${secAge}
      </div>
      <div style="margin-top:0.25rem;">
        Approval: <span class="z-autorun-badge z-autorun-warn">REQUIRED</span> (no auto-connect)
      </div>
      <div style="margin-top:0.25rem;">
        CPU: <b>${cpu.cores_logical ?? '—'}</b> cores · RAM: <b>${mem.total ?? '—'} GB</b>
      </div>
      <div>
        Free storage: <b>${storage.total_free_gb ?? '—'} GB</b>
      </div>
      <div>
        Capabilities pass: <b>${passCount}/${caps.length}</b> · candidates: <b>${candidates}</b>
      </div>
      <div>
        Queue: pending <b>${pending}</b> · approved <b>${approved}</b> · rejected <b>${rejected}</b>
      </div>
      <div style="margin-top:0.35rem;">
        <button id="zAnyDevicesRequestApprovalBtn" class="z-button z-button-subtle" type="button" aria-expanded="false">
          Request Approval Helper
        </button>
      </div>
      <div id="zAnyDevicesCmdHelper" class="z-anydevices-cmd-helper" style="display:none;">
        <input id="zAnyDevicesCmdInput" class="z-input" type="text" readonly />
        <button id="zAnyDevicesCopyCmdBtn" class="z-button z-button-subtle" type="button">Copy Cmd</button>
      </div>
      <div class="z-muted" style="margin-top:0.25rem;">
        <a href="/data/reports/z_anydevices_analyzer.json" target="_blank" rel="noopener noreferrer">Open report JSON</a>
        ·
        <a href="/data/reports/z_anydevices_security_scan.json" target="_blank" rel="noopener noreferrer">Open security scan</a>
        ·
        <a href="/data/reports/z_anydevices_monitor.json" target="_blank" rel="noopener noreferrer">Open monitor</a>
        ·
        <a href="/data/reports/z_anydevices_approval_queue.json" target="_blank" rel="noopener noreferrer">Open approval queue</a>
      </div>
    `;
    wireActions(report);
  }

  async function refresh() {
    const [report, queue, security, monitor] = await Promise.all([
      loadJson('/data/reports/z_anydevices_analyzer.json'),
      loadJson('/data/reports/z_anydevices_approval_queue.json'),
      loadJson('/data/reports/z_anydevices_security_scan.json'),
      loadJson('/data/reports/z_anydevices_monitor.json'),
    ]);
    render(report, queue, security, monitor);
  }

  refresh();
  setInterval(refresh, 60_000);
})();
