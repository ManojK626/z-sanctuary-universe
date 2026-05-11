// Z: core\monetization_ui.js
// Monetization UI handling.
(function () {
  const panel = document.getElementById('zMonetizationPanel');
  if (!panel || !window.ZMonetization) return;
  const statusEl = document.getElementById('zSubscriptionStatus');
  const startTrialBtn = document.getElementById('zStartTrial');
  const startProBtn = document.getElementById('zStartPro');
  const cancelBtn = document.getElementById('zCancelPlan');
  const referralCode = document.getElementById('zReferralCode');
  const referralAmount = document.getElementById('zReferralAmount');
  const referralSubmit = document.getElementById('zReferralSubmit');
  const commissionInfo = document.getElementById('zCommissionInfo');
  const bankrollStatus = document.getElementById('zBankrollStatus');
  const resetBankroll = document.getElementById('zResetBankroll');

  const bankroll = { capital: 0, profit: 0, loss: 0 };

  function renderStatus() {
    const state = window.ZMonetization.getState();
    if (!state) return;
    const expires = state.trialEnds
      ? ` | expires ${new Date(state.trialEnds).toLocaleDateString()}`
      : '';
    statusEl.textContent = `Plan: ${state.plan} (${state.status})${expires}`;
    commissionInfo.textContent = `Commission: ${state.commission?.toFixed(2) || 0}`;
    bankrollStatus.textContent = `Capital: ${bankroll.capital} | Profit: ${bankroll.profit} | Loss: ${bankroll.loss}`;
  }

  function logReferral() {
    const code = referralCode?.value?.trim();
    const amount = Number(referralAmount?.value) || 0;
    if (!code || amount <= 0) return;
    window.ZMonetization.logReferral({ code, amount, commission: 0.15 });
    referralCode.value = '';
    referralAmount.value = '';
    renderStatus();
  }

  function personalToast(message) {
    const toast = document.createElement('div');
    toast.className = 'z-social-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2400);
  }

  startTrialBtn?.addEventListener('click', () => {
    window.ZMonetization.startTrial();
    renderStatus();
    personalToast('Trial activated.');
  });
  startProBtn?.addEventListener('click', () => {
    window.ZMonetization.startSubscription('pro');
    renderStatus();
    personalToast('Pro subscription active.');
  });
  cancelBtn?.addEventListener('click', () => {
    window.ZMonetization.cancelSubscription();
    renderStatus();
    personalToast('Plan canceled.');
  });
  referralSubmit?.addEventListener('click', logReferral);
  resetBankroll?.addEventListener('click', () => {
    bankroll.capital = bankroll.profit = bankroll.loss = 0;
    renderStatus();
  });

  window.addEventListener('zRouletteTip', () => {
    bankroll.profit += 10;
    renderStatus();
  });

  renderStatus();
  window.addEventListener('zMonetizationUpdate', renderStatus);
  window.ZMonetizationPanel = { render: renderStatus };
})();
