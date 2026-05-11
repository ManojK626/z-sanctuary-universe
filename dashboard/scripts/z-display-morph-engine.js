/**
 * Z-Display Morph Engine — client-side display modes (localStorage + body dataset).
 * Mock/local receipt only; does not change backend or verification scripts.
 */
(function (global) {
  var STORAGE_KEY = 'zSanctuaryDisplayMorphMode';
  var MSG_TYPE = 'z-display-morph';

  /** @type {readonly string[]} */
  var VALID_MODES = [
    'standard',
    'classic',
    'fusion',
    'business',
    'workstation',
    'game',
    'creator',
    'presentation',
    'eco',
    'low-sensory'
  ];

  var LABELS = {
    standard: 'Standard',
    classic: 'Classic',
    fusion: 'Fusion',
    business: 'Business',
    workstation: 'Workstation',
    game: 'Game Mode',
    creator: 'Creator Mode',
    presentation: 'Presentation Mode',
    eco: 'Eco Mode',
    'low-sensory': 'Low-Sensory Mode'
  };

  function isValid(mode) {
    return VALID_MODES.indexOf(mode) !== -1;
  }

  function normalizeMode(mode) {
    var m = String(mode || '').toLowerCase();
    return isValid(m) ? m : 'standard';
  }

  function setBodyMode(mode) {
    var normalized = normalizeMode(mode);
    if (document.body) {
      document.body.dataset.displayMode = normalized;
      document.body.classList.toggle('z-morph-low-sensory-active', normalized === 'low-sensory');
    }
    return normalized;
  }

  function persist(mode) {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (_) {
      /* quota / privacy */
    }
  }

  function readStored() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      return v ? normalizeMode(v) : 'standard';
    } catch (_) {
      return 'standard';
    }
  }

  /** @param {string} normalized */
  function broadcastToIframes(normalized) {
    var ifrs = document.querySelectorAll('iframe');
    for (var i = 0; i < ifrs.length; i++) {
      try {
        if (ifrs[i].contentWindow) {
          ifrs[i].contentWindow.postMessage({ type: MSG_TYPE, mode: normalized }, '*');
        }
      } catch (_) {
        /* cross-origin */
      }
    }
  }

  /** @param {string} normalized */
  function receipt(normalized, context) {
    var label = LABELS[normalized] || normalized;
    var detail =
      'Display morph (mock / local only): switched to «' +
      label +
      '» — preference saved in this browser. Context: ' +
      (context || 'host') +
      '.';

    try {
      // eslint-disable-next-line no-console
      console.info('[Z-Display Morph Engine]', detail);
    } catch (_) {
      /* no console */
    }

    var el = document.getElementById('zDisplayMorphReceipt');
    if (!el) return;
    el.textContent = detail;
    el.hidden = false;
    clearTimeout(el._zMorphHide);
    el._zMorphHide = setTimeout(function () {
      el.hidden = true;
    }, 5200);

    /** @type {HTMLElement | null} */
    var badge = document.getElementById('zDisplayMorphBadge');
    if (badge) {
      badge.textContent = 'Display: ' + label;
      badge.title = 'Z-Display Morph — ' + label;
    }
  }

  /**
   * @param {string} mode
   * @param {{ silent?: boolean; context?: string; skipIframeBroadcast?: boolean }} [opts]
   */
  function applyMode(mode, opts) {
    var silent = !!(opts && opts.silent);
    var context = (opts && opts.context) || 'host';
    var skipIframeBroadcast = !!(opts && opts.skipIframeBroadcast);
    var normalized = setBodyMode(mode);
    persist(normalized);

    if (!skipIframeBroadcast) broadcastToIframes(normalized);

    if (!silent) receipt(normalized, context);
    else {
      /** @type {HTMLElement | null} */
      var badgeQuiet = document.getElementById('zDisplayMorphBadge');
      if (badgeQuiet) {
        badgeQuiet.textContent = 'Display: ' + (LABELS[normalized] || normalized);
        badgeQuiet.title = 'Z-Display Morph — ' + (LABELS[normalized] || normalized);
      }
    }

    /** @type {HTMLSelectElement | null} */
    var sel = /** @type {HTMLSelectElement | null} */ (
      document.getElementById('zDisplayMorphSelect')
    );
    if (sel && sel.value !== normalized) sel.value = normalized;

    try {
      var ev = new CustomEvent('z-display-morph-change', {
        detail: { mode: normalized, labels: LABELS }
      });
      document.dispatchEvent(ev);
    } catch (_) {
      /* IE */
    }
  }

  function readParentMode() {
    try {
      if (global.parent && global.parent !== global && global.parent.document.body) {
        var ds = global.parent.document.body.dataset;
        if (ds && ds.displayMode) {
          return normalizeMode(ds.displayMode);
        }
      }
    } catch (_) {
      /* cross-origin */
    }
    return null;
  }

  function wireHost() {
    /** @type {HTMLSelectElement | null} */
    var sel = /** @type {HTMLSelectElement | null} */ (document.getElementById('zDisplayMorphSelect'));
    if (!sel) return;

    sel.addEventListener('change', function () {
      applyMode(sel.value, { context: 'host' });
    });
  }

  function wireIframeMorph() {
    global.addEventListener('message', function (e) {
      var d = e && e.data;
      if (!d || d.type !== MSG_TYPE || !d.mode) return;
      applyMode(String(d.mode), { silent: true, context: 'iframe-message', skipIframeBroadcast: true });
    });
  }

  function initIframeMorph() {
    wireIframeMorph();
    var fromParent = readParentMode();
    var initial = fromParent !== null ? fromParent : readStored();
    applyMode(initial, {
      silent: true,
      context: fromParent !== null ? 'iframe-parent-sync' : 'iframe-storage',
      skipIframeBroadcast: true
    });
  }

  function initStandaloneMorph() {
    /** @type {HTMLSelectElement | null} */
    var sel = /** @type {HTMLSelectElement | null} */ (document.getElementById('zDisplayMorphSelect'));
    if (sel && !sel.getAttribute('data-morph-wired')) {
      sel.setAttribute('data-morph-wired', '1');
      sel.addEventListener('change', function () {
        applyMode(sel.value, { context: 'standalone' });
      });
    }
    applyMode(readStored(), { silent: true, context: 'standalone-init' });
  }

  /** @returns {HTMLElement | null} */
  function findMorphBootstrapScript() {
    if (typeof document === 'undefined') return null;
    return (
      /** @type {HTMLElement | null} */ (document.querySelector('script[src*="z-display-morph-engine"]')) ||
      /** @type {HTMLElement | null} */ (document.currentScript || null)
    );
  }

  /**
   * @param {string} [explicit]
   */
  function initMorph(explicit) {
    var boot = findMorphBootstrapScript();
    var scriptInit =
      explicit !== undefined && explicit !== null && explicit !== ''
        ? explicit
        : (boot && boot.getAttribute('data-morph-init')) || '';

    var hasSelect = !!document.getElementById('zDisplayMorphSelect');
    var isIframe = global.parent !== global;
    var standalonePage =
      document.body && document.body.getAttribute('data-morph-page') === 'standalone';

    /** @type {'host'|'iframe'|'standalone'|'none'} */
    var role = 'none';
    if (scriptInit === 'iframe') role = 'iframe';
    else if (scriptInit === 'standalone') role = 'standalone';
    else if (scriptInit === 'host') role = 'host';
    else if (standalonePage) role = 'standalone';
    else if (isIframe) role = 'iframe';
    else if (hasSelect) role = 'host';

    if (role === 'none') return;

    if (role === 'iframe') {
      if (document.body) initIframeMorph();
      else {
        document.addEventListener('DOMContentLoaded', initIframeMorph);
      }
      return;
    }

    if (role === 'standalone') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStandaloneMorph);
      } else {
        initStandaloneMorph();
      }
      return;
    }

    if (role === 'host') {
      wireHost();
      applyMode(readStored(), { silent: true, context: 'host-init' });
    }
  }

  global.ZDisplayMorphEngine = {
    VALID_MODES: VALID_MODES,
    LABELS: LABELS,
    STORAGE_KEY: STORAGE_KEY,
    init: initMorph,
    applyMode: applyMode,
    normalizeMode: normalizeMode,
    broadcastToIframes: broadcastToIframes
  };

  var autoOff = false;
  var bootstrap = findMorphBootstrapScript();
  if (bootstrap && bootstrap.getAttribute('data-morph-auto') === 'off') autoOff = true;

  if (!autoOff && typeof document !== 'undefined') {
    var scriptedBoot = bootstrap && bootstrap.getAttribute('data-morph-init');
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        initMorph(scriptedBoot || '');
      });
    } else {
      initMorph(scriptedBoot || '');
    }
  }
})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
