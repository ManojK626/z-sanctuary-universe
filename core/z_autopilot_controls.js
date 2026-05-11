// Z: core\z_autopilot_controls.js
// Super Saiyan Autopilot Controls & Master Management
(function () {
  const STORAGE_KEY = 'zAutopilotState';
  // UI Elements
  const startBtn = document.getElementById('autopilotStartBtn');
  const stopBtn = document.getElementById('autopilotStopBtn');
  const statusSpan = document.getElementById('autopilotStatus');
  const checkBtn = document.getElementById('governanceCheckBtn');
  const viewAuditBtn = document.getElementById('viewAuditBtn');
  const statusPanel = document.getElementById('zAutopilotStatusPanel');
  const masterPanel = document.getElementById('zMasterControlPanel');
  const pauseBtn = document.getElementById('autopilotPauseBtn');
  const resumeBtn = document.getElementById('autopilotResumeBtn');
  const overrideBtn = document.getElementById('autopilotOverrideBtn');
  const activeSpan = document.getElementById('autopilotActive');
  const pausedSpan = document.getElementById('autopilotPaused');
  const overrideSpan = document.getElementById('autopilotOverride');
  const lastActionSpan = document.getElementById('autopilotLastAction');
  const masterPauseAllBtn = document.getElementById('masterPauseAllBtn');
  const masterResumeAllBtn = document.getElementById('masterResumeAllBtn');
  const masterShutdownBtn = document.getElementById('masterShutdownBtn');
  const heartbeatStatusDisplay = document.getElementById('heartbeatStatus');

  function setHeartbeatStatus(value) {
    if (!heartbeatStatusDisplay) return;
    heartbeatStatusDisplay.textContent = `Heartbeat: ${value}`;
  }

  // State
  let autopilotActive = false;
  let autopilotPaused = false;
  let lastAction = '--';

  function loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const saved = JSON.parse(raw);
      autopilotActive = Boolean(saved.active);
      autopilotPaused = Boolean(saved.paused);
      lastAction = saved.lastAction || lastAction;
    } catch (err) {
      // Ignore invalid saved state.
    }
  }

  function saveState() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        active: autopilotActive,
        paused: autopilotPaused,
        lastAction,
      })
    );
  }

  // Helper: update status panel
  function updateStatusPanel() {
    activeSpan.textContent = autopilotActive ? 'Yes' : 'No';
    pausedSpan.textContent = autopilotPaused ? 'Yes' : 'No';
    overrideSpan.textContent = 'Available';
    lastActionSpan.textContent = lastAction;
    statusSpan.textContent = autopilotActive ? (autopilotPaused ? 'Paused' : 'Active') : 'Idle';
    if (pauseBtn && resumeBtn) {
      pauseBtn.style.display = autopilotPaused ? 'none' : '';
      resumeBtn.style.display = autopilotPaused ? '' : 'none';
    }
    if (statusPanel && autopilotActive && statusPanel.style.display === 'none') {
      statusPanel.style.display = '';
    }
    const heartbeatState = autopilotActive ? (autopilotPaused ? 'paused' : 'beating') : 'idle';
    setHeartbeatStatus(heartbeatState);
    saveState();
  }

  // Autopilot activation
  startBtn.onclick = function () {
    autopilotActive = true;
    autopilotPaused = false;
    lastAction = 'Autopilot started';
    updateStatusPanel();
    statusPanel.style.display = '';
    window.ZStatusConsole &&
      window.ZStatusConsole.log('[AUTO] Super Saiyan Autopilot activated', 'active');
    window.ZHeartbeat?.start?.();
    setHeartbeatStatus('beating');
  };
  stopBtn.onclick = function () {
    autopilotActive = false;
    autopilotPaused = false;
    lastAction = 'Autopilot stopped';
    updateStatusPanel();
    statusPanel.style.display = '';
    window.ZStatusConsole && window.ZStatusConsole.log('[STOP] Autopilot deactivated', 'warning');
    window.ZHeartbeat?.stop?.();
    setHeartbeatStatus('idle');
  };
  pauseBtn.onclick = function () {
    if (!autopilotActive) return;
    autopilotPaused = true;
    lastAction = 'Autopilot paused';
    updateStatusPanel();
    pauseBtn.style.display = 'none';
    resumeBtn.style.display = '';
    window.ZStatusConsole && window.ZStatusConsole.log('[PAUSE] Autopilot paused', 'warning');
    window.ZHeartbeat?.stop?.();
    setHeartbeatStatus('paused');
  };
  resumeBtn.onclick = function () {
    if (!autopilotActive) return;
    autopilotPaused = false;
    lastAction = 'Autopilot resumed';
    updateStatusPanel();
    pauseBtn.style.display = '';
    resumeBtn.style.display = 'none';
    window.ZStatusConsole && window.ZStatusConsole.log('[RESUME] Autopilot resumed', 'active');
    window.ZHeartbeat?.resume?.();
    setHeartbeatStatus('beating');
  };
  overrideBtn.onclick = function () {
    autopilotActive = false;
    autopilotPaused = false;
    lastAction = 'Human override triggered';
    updateStatusPanel();
    window.ZStatusConsole &&
      window.ZStatusConsole.log('[OVERRIDE] Human override: Autopilot stopped', 'error');
    window.ZHeartbeat?.stop?.();
    setHeartbeatStatus('idle');
  };
  checkBtn.onclick = function () {
    if (window.ZGovernanceHUD) {
      if (window.ZAutoPilot?.governanceFreeze) {
        window.ZAutoPilot.governanceFreeze();
      }
      const state = window.ZGovernanceHUD.getState();
      window.ZStatusConsole &&
        window.ZStatusConsole.log(
          `[GOV] Governance Check: Risk=${state.riskClass}, Consent=${state.consent}`,
          'status'
        );
      lastAction = `Governance checked (${state.riskClass})`;
      updateStatusPanel();
    }
  };
  viewAuditBtn.onclick = function () {
    document.getElementById('zGovernance').scrollIntoView({ behavior: 'smooth' });
    lastAction = 'Audit log viewed';
    updateStatusPanel();
  };
  // Master Control logic
  masterPauseAllBtn.onclick = function () {
    autopilotPaused = true;
    lastAction = 'All modules paused';
    updateStatusPanel();
    window.ZStatusConsole &&
      window.ZStatusConsole.log('[PAUSE] All modules paused (Master Control)', 'warning');
  };
  masterResumeAllBtn.onclick = function () {
    autopilotPaused = false;
    lastAction = 'All modules resumed';
    updateStatusPanel();
    window.ZStatusConsole &&
      window.ZStatusConsole.log('[RESUME] All modules resumed (Master Control)', 'active');
  };
  masterShutdownBtn.onclick = function () {
    autopilotActive = false;
    autopilotPaused = false;
    lastAction = 'Sanctuary shutdown';
    updateStatusPanel();
    window.ZStatusConsole &&
      window.ZStatusConsole.log('[STOP] Sanctuary shutdown (Master Control)', 'error');
    alert('Sanctuary shutdown: All modules stopped.');
  };

  // Show/hide panels on status/audit button click
  statusSpan.onclick = function () {
    statusPanel.style.display = statusPanel.style.display === 'none' ? '' : 'none';
  };
  document.getElementById('autopilotStatus').title = 'Click to view Autopilot Status panel';
  checkBtn.addEventListener('dblclick', function () {
    masterPanel.style.display = masterPanel.style.display === 'none' ? '' : 'none';
  });

  // Tooltips/help links are static in index.html
  loadState();
  updateStatusPanel();
})();
