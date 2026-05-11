// Z: core\lens_status.js
(function () {
  const STATUS_BAR_ID = 'lens-status-bar';
  const GP = {
    manual: 'Manual',
    preset: 'Preset',
    autopilot: 'Autopilot',
    governance: 'Governance',
  };
  let currentAuthority = 'preset';
  let governanceHold = false;

  function refreshStatus() {
    const container = document.getElementById(STATUS_BAR_ID);
    if (!container) return;
    container.querySelectorAll('.lens-chip').forEach((chip) => {
      const lens = chip.getAttribute('data-lens');
      if (!lens) return;
      chip.classList.toggle('active', lens === currentAuthority);
      chip.style.opacity = lens === currentAuthority ? '1' : '0.35';
    });
    const govChip = container.querySelector('.lens-chip[data-lens="governance"]');
    if (govChip) {
      govChip.classList.toggle('active', governanceHold);
      govChip.style.opacity = governanceHold ? '1' : '0.35';
    }
  }

  function setLens(authority = 'preset', hold = false) {
    currentAuthority = GP[authority] ? authority : 'preset';
    governanceHold = Boolean(hold);
    refreshStatus();
  }

  function setGovernanceHold(state) {
    governanceHold = Boolean(state);
    refreshStatus();
  }

  window.ZLensStatus = {
    set: setLens,
    hold: setGovernanceHold,
    current: () => ({ authority: currentAuthority, hold: governanceHold }),
  };

  document.addEventListener('DOMContentLoaded', refreshStatus);
})();
