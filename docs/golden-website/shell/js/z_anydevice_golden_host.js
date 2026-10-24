/**
 * Thin adaptive host for the Golden Website home page only.
 * Reads core/z_adaptive_runtime.cjs. Does not classify, filter records, or certify.
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
    ['nav.primary a', 'nav.primary button', 'a.cta', 'button.cta', 'a.skip'].forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        el.classList.add('z-adaptive-target');
      });
    });
  }

  applyReading();
  markTargets();
  api.subscribe(window, applyReading);
})();
