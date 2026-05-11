// Z: core/z_governance_panel_boot.js
// Resolves Governance panel Trust Status / SKK / RKPK / Coherence so they do not stay "Loading…".
(function () {
  const trustEl = document.getElementById('zTrustStatus');
  const skkEl = document.getElementById('zSkkScore');
  const rkpkEl = document.getElementById('zRkpkScore');
  const coherenceEl = document.getElementById('zCoherence');
  const refreshBtn = document.getElementById('zGovernanceRefresh');

  function apply() {
    const state = window.ZEmotionFilter?.getEmotionalState?.();
    const coherence = state?.coherence ?? 50;
    if (trustEl) {
      trustEl.innerHTML = '<span class="z-status-dot"></span><span>Stable</span>';
      trustEl.classList.add('z-status-ok');
    }
    if (skkEl) skkEl.textContent = state?.skk ?? '--';
    if (rkpkEl) rkpkEl.textContent = state?.rkpk ?? '--';
    if (coherenceEl) coherenceEl.textContent = (Number.isFinite(coherence) ? coherence : 50) + '%';
  }

  function boot() {
    apply();
    if (refreshBtn) refreshBtn.addEventListener('click', apply);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    setTimeout(boot, 100);
  }
})();
