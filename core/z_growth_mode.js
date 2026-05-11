// Z: core/z_growth_mode.js
// Operator "Calm growth" — lengthens light client polling so huge multi-root workspaces stay smooth.
(function () {
  var STORAGE_KEY = 'zSanctuaryGrowthMode';

  function isCalm() {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'calm';
    } catch {
      return false;
    }
  }

  window.ZGrowthMode = {
    isCalm: isCalm,
    /** Dashboard client poll multiplier (narrow strip, observer badge base interval). */
    mult: function () {
      return isCalm() ? 2.5 : 1;
    },
    get: function () {
      return isCalm() ? 'calm' : 'normal';
    },
    set: function (mode) {
      try {
        localStorage.setItem(STORAGE_KEY, mode === 'calm' ? 'calm' : 'normal');
      } catch (_) {
        void 0;
      }
      try {
        window.dispatchEvent(new CustomEvent('z-growth-mode'));
      } catch (_) {
        void 0;
      }
    },
    toggle: function () {
      this.set(isCalm() ? 'normal' : 'calm');
    },
  };
})();
