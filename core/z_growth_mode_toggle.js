// Z: core/z_growth_mode_toggle.js
(function () {
  function paint(btn) {
    if (!btn || !window.ZGrowthMode) return;
    var calm = window.ZGrowthMode.isCalm();
    btn.setAttribute('aria-pressed', calm ? 'true' : 'false');
    btn.textContent = calm ? 'Growth: Calm' : 'Growth: Normal';
    btn.title = calm
      ? 'Slower mirror polls (multi-root friendly). Click for Normal. Pair with npm run arrbce:bulk-refresh on heavy bulk-load days (Z-ARRBCE).'
      : 'Default poll cadence. Click for Calm during heavy work in member repos. Pair with npm run arrbce:bulk-refresh on heavy bulk-load days (Z-ARRBCE).';
  }

  function boot() {
    var btn = document.getElementById('zGrowthModeToggle');
    if (!btn || !window.ZGrowthMode) return;
    paint(btn);
    btn.addEventListener('click', function () {
      window.ZGrowthMode.toggle();
      paint(btn);
    });
    window.addEventListener('z-growth-mode', function () {
      paint(btn);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
