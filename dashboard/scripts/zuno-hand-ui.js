(function () {
  var BLOCKED_KEYWORDS = [
    'payment',
    'contract',
    'email send',
    'post',
    'delet',
    'account',
    'purchase',
  ];

  var MODES = {
    observe: 'OBSERVE · SAFE',
    assist: 'ASSIST · READY',
    draft: 'DRAFT · READY',
    approval: 'AWAIT · APPROVAL',
    admin: 'ADMIN · RESTRICTED',
    paused: 'PAUSED',
    blocked: 'BLOCKED',
  };

  function toneFor(status) {
    if (status.indexOf('BLOCKED') !== -1) return 'edge-status-bad';
    if (status.indexOf('PAUSED') !== -1 || status.indexOf('DRAFT') !== -1 || status.indexOf('APPROVAL') !== -1) return 'edge-status-warn';
    return 'edge-status-good';
  }

  function applyBadge(statusText) {
    var top = document.getElementById('zZunoHandBadge');
    if (!top) return;
    top.textContent = 'ZunoHand: ' + statusText;
    ['edge-status-good', 'edge-status-warn', 'edge-status-bad'].forEach(function (c) {
      top.classList.remove(c);
    });
    top.classList.add(toneFor(statusText));
  }

  function showModal(open) {
    var modal = document.getElementById('zunoHandApprovalModal');
    if (!modal) return;
    modal.classList.toggle('is-open', !!open);
    modal.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  function logMockReceipt(action, details) {
    try {
      window.__zTwinRootsMockLog = window.__zTwinRootsMockLog || [];
      window.__zTwinRootsMockLog.push({
        ts: new Date().toISOString(),
        actor: 'zuno-hand',
        action: action,
        details: details || null,
      });
    } catch (e) {
      // ignore logging issues in UI-only mock
    }
  }

  function init() {
    var panel = document.getElementById('zunoHandPanel');
    var statusText = document.getElementById('zunoHandStatusText');
    var modeSelect = document.getElementById('zunoHandModeSelect');
    var collapseBtn = document.getElementById('zunoHandCollapseBtn');
    var previewBtn = document.getElementById('zunoHandPreviewBtn');
    var ignoreBtn = document.getElementById('zunoHandIgnoreBtn');
    var pauseBtn = document.getElementById('zunoHandPauseBtn');
    var stopBtn = document.getElementById('zunoHandStopBtn');
    var approveBtn = document.getElementById('zunoHandApproveBtn');
    var cancelBtn = document.getElementById('zunoHandCancelBtn');
    var modalSummary = document.getElementById('zunoHandModalSummary');
    var suggestion = document.getElementById('zunoHandSuggestionText');

    if (!panel || !statusText || !modeSelect) return;

    var paused = false;
    var blocked = false;
    var collapsed = false;

    function refreshStatus() {
      var mode = modeSelect.value;
      var status = blocked ? MODES.blocked : paused ? MODES.paused : MODES[mode] || MODES.observe;
      statusText.textContent = status;
      applyBadge(status);
    }

    modeSelect.addEventListener('change', refreshStatus);

    if (collapseBtn) {
      collapseBtn.addEventListener('click', function () {
        collapsed = !collapsed;
        panel.classList.toggle('is-collapsed', collapsed);
        collapseBtn.textContent = collapsed ? '+' : '—';
      });
    }

    if (previewBtn) {
      previewBtn.addEventListener('click', function () {
        var text = (suggestion && suggestion.textContent ? suggestion.textContent : '').toLowerCase();
        var blockedByRule = BLOCKED_KEYWORDS.some(function (k) {
          return text.indexOf(k) !== -1;
        });
        if (blockedByRule) {
          blocked = true;
          paused = false;
          if (modalSummary) modalSummary.textContent = 'Blocked action category detected by policy.';
          refreshStatus();
          return;
        }
        blocked = false;
        if (modalSummary) modalSummary.textContent = 'You are about to run a draft/assist action. No blocked operations will auto-execute.';
        showModal(true);
      });
    }

    if (ignoreBtn) {
      ignoreBtn.addEventListener('click', function () {
        logMockReceipt('ignore_suggestion', { mode: modeSelect.value });
      });
    }

    if (pauseBtn) {
      pauseBtn.addEventListener('click', function () {
        paused = !paused;
        if (paused) blocked = false;
        pauseBtn.textContent = paused ? 'Resume AI' : 'Pause AI';
        refreshStatus();
      });
    }

    if (stopBtn) {
      stopBtn.addEventListener('click', function () {
        paused = false;
        blocked = true;
        refreshStatus();
        logMockReceipt('stop_all_actions', { mode: modeSelect.value });
      });
    }

    if (approveBtn) {
      approveBtn.addEventListener('click', function () {
        showModal(false);
        logMockReceipt('approved_assist_action', { mode: modeSelect.value });
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', function () {
        showModal(false);
        logMockReceipt('cancelled_assist_action', { mode: modeSelect.value });
      });
    }

    refreshStatus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
