// Z: core\monetization_layer.js
// Monetization & security state machine.
(function () {
  const STORAGE_KEY = 'zMonetizationState';
  const TRIAL_DAYS = 14;

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw
        ? JSON.parse(raw)
        : { plan: 'free', status: 'trial', trialEnds: null, commission: 0, referrals: [] };
    } catch {
      return { plan: 'free', status: 'trial', trialEnds: null, commission: 0, referrals: [] };
    }
  }

  function save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('zMonetizationUpdate', { detail: state }));
    return state;
  }

  function endTrial() {
    const state = load();
    state.status = 'expired';
    state.plan = 'free';
    state.trialEnds = null;
    return save(state);
  }

  function startTrial() {
    const state = load();
    if (state.status === 'trial' && state.trialEnds) return state;
    const now = Date.now();
    state.status = 'trial';
    state.plan = 'trial';
    state.trialEnds = now + TRIAL_DAYS * 24 * 60 * 60 * 1000;
    return save(state);
  }

  function startSubscription(plan = 'pro', durationDays = 30) {
    const state = load();
    const now = Date.now();
    state.plan = plan;
    state.status = 'subscribed';
    state.trialEnds = now + durationDays * 24 * 60 * 60 * 1000;
    return save(state);
  }

  function cancelSubscription() {
    const state = load();
    state.status = 'canceled';
    state.plan = 'free';
    state.trialEnds = null;
    return save(state);
  }

  function logReferral(referral) {
    const state = load();
    state.referrals = [...(state.referrals || []), referral];
    state.commission = (state.commission || 0) + referral.amount * (referral.commission || 0.1);
    return save(state);
  }

  function isPremium() {
    const state = load();
    if (state.status === 'subscribed') return true;
    if (state.status === 'trial' && state.trialEnds && state.trialEnds > Date.now()) return true;
    return false;
  }

  function getState() {
    const state = load();
    if (state.status === 'trial' && state.trialEnds && state.trialEnds < Date.now()) {
      return endTrial();
    }
    return state;
  }

  window.ZMonetization = {
    startTrial,
    startSubscription,
    cancelSubscription,
    logReferral,
    isPremium,
    getState,
    TRIAL_DAYS,
  };
})();
