/**
 * Thin adaptive host for the local Z-Connect Welcome candidate only.
 * Reads core/z_adaptive_runtime.cjs. Does not grant, withdraw, or read consent.
 */
(function () {
  var api = window.ZAdaptiveRuntime;
  if (!api || typeof api.read !== 'function' || typeof api.subscribe !== 'function') return;

  function applyReading() {
    var reading = api.read(window);
    var root = document.documentElement;
    document.body.classList.add('z-anydevice-adaptive');
    root.setAttribute('z-layout', reading.layout);
    root.setAttribute('z-orientation', reading.orientation);
    root.setAttribute('z-pointer', reading.pointer);
    root.setAttribute('z-hover', reading.hover);
    root.setAttribute('z-motion', reading.motion);
    root.setAttribute('z-offline', reading.offline);
  }

  function markTargets() {
    [
      'a.skip',
      '#discovery-consent-control',
      '#grant-discovery',
      '#decline-discovery',
      '#back-welcome',
    ].forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        el.classList.add('z-adaptive-target');
      });
    });
  }

  applyReading();
  markTargets();
  api.subscribe(window, applyReading);
})();
