/* Z-Adaptive runtime — presentation measurement and signals only.
 * Coordinated by core/z_layout_engine.js. No cockpit selectors.
 * No trust, approval, quarantine, CPU, RAM, GPU, or display fingerprint.
 *
 * Primary pointer: (pointer: coarse) without (pointer: fine) → coarse;
 * (pointer: fine) without (pointer: coarse) → fine; otherwise unknown.
 * any-pointer is diagnostic only and does not override that result.
 *
 * Primary hover: (hover: hover) without (hover: none) → hover;
 * (hover: none) without (hover: hover) → none; otherwise unknown.
 *
 * visualViewport width and height are available space.
 * visualViewport.scale is returned as diagnostic context and is not applied.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.ZAdaptiveRuntime = api;
})(typeof window !== 'undefined' ? window : null, function () {
  const MOBILE_MAX = 860;
  const COMPACT_MAX = 1280;
  const STANDARD_MAX = 1600;

  function layoutFromWidth(width) {
    const n = Number(width);
    if (!Number.isFinite(n)) return 'mobile';
    if (n >= STANDARD_MAX) return 'wide';
    if (n >= COMPACT_MAX) return 'standard';
    if (n >= MOBILE_MAX) return 'compact';
    return 'mobile';
  }

  function availableBox(win) {
    const target = win || {};
    let width = 0;
    let height = 0;
    let source = 'none';
    let scale = null;
    try {
      const viewport = target.visualViewport;
      if (viewport && viewport.width > 0) {
        width = viewport.width;
        height = viewport.height > 0 ? viewport.height : 0;
        source = 'visualViewport';
        if (Number.isFinite(viewport.scale)) scale = viewport.scale;
      }
    } catch {
      /* visualViewport is optional */
    }
    const doc = target.document && target.document.documentElement;
    if (!(width > 0)) {
      width = target.innerWidth || (doc && doc.clientWidth) || 0;
      if (width > 0) source = 'innerWidth';
    }
    if (!(height > 0)) {
      height = target.innerHeight || (doc && doc.clientHeight) || 0;
    }
    return { width, height, source, scale };
  }

  function orientationFromBox(box) {
    if (!box || !(box.width > 0) || !(box.height > 0)) return 'unknown';
    return box.height >= box.width ? 'portrait' : 'landscape';
  }

  function query(matchMedia, expression) {
    if (typeof matchMedia !== 'function') return null;
    try {
      const media = matchMedia(expression);
      if (!media || typeof media.matches !== 'boolean') return null;
      return media.matches;
    } catch {
      return null;
    }
  }

  function primaryPointer(matchMedia) {
    const coarse = query(matchMedia, '(pointer: coarse)');
    const fine = query(matchMedia, '(pointer: fine)');
    if (coarse === true && fine !== true) return 'coarse';
    if (fine === true && coarse !== true) return 'fine';
    return 'unknown';
  }

  function anyPointer(matchMedia) {
    const coarse = query(matchMedia, '(any-pointer: coarse)');
    const fine = query(matchMedia, '(any-pointer: fine)');
    if (coarse === null && fine === null) return 'unknown';
    if (coarse === true && fine === true) return 'mixed';
    if (coarse === true) return 'coarse';
    if (fine === true) return 'fine';
    return 'unknown';
  }

  function primaryHover(matchMedia) {
    const hover = query(matchMedia, '(hover: hover)');
    const none = query(matchMedia, '(hover: none)');
    if (hover === true && none !== true) return 'hover';
    if (none === true && hover !== true) return 'none';
    return 'unknown';
  }

  function anyHover(matchMedia) {
    const hover = query(matchMedia, '(any-hover: hover)');
    const none = query(matchMedia, '(any-hover: none)');
    if (hover === null && none === null) return 'unknown';
    if (hover === true && none === true) return 'mixed';
    if (hover === true) return 'hover';
    if (none === true) return 'none';
    return 'unknown';
  }

  function motion(matchMedia) {
    const reduce = query(matchMedia, '(prefers-reduced-motion: reduce)');
    if (reduce === null) return 'unknown';
    return reduce ? 'reduce' : 'no-preference';
  }

  function connectivity(nav) {
    if (!nav || typeof nav.onLine !== 'boolean') return 'unknown';
    return nav.onLine ? 'online' : 'offline';
  }

  function read(win) {
    const target = win || {};
    const box = availableBox(target);
    const matchMedia = typeof target.matchMedia === 'function' ? target.matchMedia.bind(target) : null;
    return {
      width: box.width,
      height: box.height,
      source: box.source,
      viewportScale: box.scale,
      layout: layoutFromWidth(box.width),
      orientation: orientationFromBox(box),
      pointer: primaryPointer(matchMedia),
      pointerAny: anyPointer(matchMedia),
      hover: primaryHover(matchMedia),
      hoverAny: anyHover(matchMedia),
      motion: motion(matchMedia),
      offline: connectivity(target.navigator),
    };
  }

  function subscribe(win, onChange) {
    const target = win || {};
    const cleanups = [];
    function listen(host, event) {
      if (!host || typeof host.addEventListener !== 'function') return;
      host.addEventListener(event, onChange);
      cleanups.push(function () {
        host.removeEventListener(event, onChange);
      });
    }
    listen(target, 'resize');
    listen(target.visualViewport, 'resize');
    listen(target, 'online');
    listen(target, 'offline');
    if (typeof target.matchMedia === 'function') {
      [
        '(pointer: coarse)',
        '(pointer: fine)',
        '(hover: hover)',
        '(hover: none)',
        '(prefers-reduced-motion: reduce)',
      ].forEach(function (expression) {
        try {
          const media = target.matchMedia(expression);
          if (!media) return;
          if (typeof media.addEventListener === 'function') {
            media.addEventListener('change', onChange);
            cleanups.push(function () {
              media.removeEventListener('change', onChange);
            });
          } else if (typeof media.addListener === 'function') {
            media.addListener(onChange);
            cleanups.push(function () {
              media.removeListener(onChange);
            });
          }
        } catch {
          /* optional signal */
        }
      });
    }
    return function unsubscribe() {
      cleanups.splice(0).forEach(function (fn) {
        fn();
      });
    };
  }

  return {
    MOBILE_MAX,
    COMPACT_MAX,
    STANDARD_MAX,
    layoutFromWidth,
    availableBox,
    orientationFromBox,
    primaryPointer,
    anyPointer,
    primaryHover,
    anyHover,
    motion,
    connectivity,
    read,
    subscribe,
  };
});
