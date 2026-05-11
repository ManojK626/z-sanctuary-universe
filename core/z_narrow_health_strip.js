// Z: core/z_narrow_health_strip.js
// When the status rail is hidden (narrow viewport), mirror key edge badges so signals stay visible.
(function () {
  const PAIRS = [
    ['zSloHealthBadge', 'zNarrowBadgeSlo'],
    ['zZunoTrendBadge', 'zNarrowBadgeZuno'],
    ['zSSWSEcosystemHealthBadge', 'zNarrowBadgeSSWSLink'],
    ['zStorageHygieneBadge', 'zNarrowBadgeStorage'],
    ['zAnyDevicesBadge', 'zNarrowBadgeDevices'],
    ['zCycleIndicatorBadge', 'zNarrowBadgeCycles'],
    ['zSecuritySentinelBadge', 'zNarrowBadgeSentinel'],
    ['zAutonomousBadge', 'zNarrowBadgeAutonomous'],
    ['zFormulaPostureBadge', 'zNarrowBadgeFormula'],
    ['zARRBCEBadge', 'zNarrowBadgeARRBCE'],
    ['zCrossProjectObserveBadge', 'zNarrowBadgeObserve'],
    ['zTwinRootsBadge', 'zNarrowBadgeTwinRoots'],
    ['zZunoHandBadge', 'zNarrowBadgeZunoHand'],
  ];
  const TONE = ['edge-status-good', 'edge-status-warn', 'edge-status-bad'];

  function sync() {
    PAIRS.forEach(([srcId, destId]) => {
      const src = document.getElementById(srcId);
      const dest = document.getElementById(destId);
      if (!src || !dest) return;
      dest.textContent = src.textContent;
      TONE.forEach((c) => dest.classList.remove(c));
      TONE.forEach((c) => {
        if (src.classList.contains(c)) dest.classList.add(c);
      });
    });
  }

  function tick() {
    if (window.matchMedia('(max-width: 1100px)').matches) sync();
  }

  var stripTimer = null;

  function stripIntervalMs() {
    var base = 3000;
    var m = typeof window.ZGrowthMode !== 'undefined' && window.ZGrowthMode.mult ? window.ZGrowthMode.mult() : 1;
    return Math.round(base * m);
  }

  function restartStripTimer() {
    if (stripTimer) clearInterval(stripTimer);
    stripTimer = setInterval(tick, stripIntervalMs());
  }

  function boot() {
    sync();
    restartStripTimer();
    window.addEventListener('z-growth-mode', restartStripTimer);
    const mq = window.matchMedia('(max-width: 1100px)');
    const onViewport = () => sync();
    if (mq.addEventListener) {
      mq.addEventListener('change', onViewport);
    } else if (mq.addListener) {
      mq.addListener(onViewport);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
