/**
 * Thin adaptive host adapter for AMK-Goku Main Control only.
 * Reads core/z_adaptive_runtime.cjs. Does not classify, certify, or write the registry.
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
    root.setAttribute('data-z-measurement', reading.source || '');
    if (reading.viewportScale == null) root.removeAttribute('data-z-viewport-scale');
    else root.setAttribute('data-z-viewport-scale', String(reading.viewportScale));
  }

  applyReading();
  api.subscribe(window, applyReading);
})();
