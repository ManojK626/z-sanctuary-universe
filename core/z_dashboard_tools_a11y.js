// Z: core/z_dashboard_tools_a11y.js
// Dashboard a11y toggles (Control Centre + top strip) share localStorage; delegated panel openers.
(function () {
  const KEYS = {
    large: 'zDashA11yLargeTargets',
    contrast: 'zDashA11yHighContrast',
    focus: 'zDashA11yStrongFocus',
    reduceDecor: 'zDashA11yReduceDecor'
  };

  /** @type {Record<string, string>} */
  const ATTR_TO_STORAGE = {
    large: KEYS.large,
    contrast: KEYS.contrast,
    focus: KEYS.focus,
    reduceDecor: KEYS.reduceDecor
  };

  function readBool(key) {
    try {
      return localStorage.getItem(key) === '1';
    } catch (e) {
      void e;
      return false;
    }
  }

  function writeBool(key, on) {
    try {
      localStorage.setItem(key, on ? '1' : '0');
    } catch (e) {
      void e;
    }
  }

  function applyAll() {
    const b = document.body;
    if (!b || !b.classList.contains('z-dashboard-organism')) return;
    b.classList.toggle('z-dash-a11y-large', readBool(KEYS.large));
    b.classList.toggle('z-dash-a11y-contrast', readBool(KEYS.contrast));
    b.classList.toggle('z-dash-a11y-focus', readBool(KEYS.focus));
    b.classList.toggle('z-dash-a11y-reduce-decor', readBool(KEYS.reduceDecor));
  }

  function syncCheckboxesFromStorage() {
    Object.keys(ATTR_TO_STORAGE).forEach((attr) => {
      const key = ATTR_TO_STORAGE[attr];
      const on = readBool(key);
      document.querySelectorAll(`[data-z-a11y="${attr}"]`).forEach((el) => {
        el.checked = on;
      });
    });
    applyAll();
  }

  function wireA11yInputs() {
    document.querySelectorAll('[data-z-a11y]').forEach((el) => {
      el.addEventListener('change', function () {
        const attr = el.getAttribute('data-z-a11y');
        const key = attr ? ATTR_TO_STORAGE[attr] : null;
        if (!key) return;
        writeBool(key, el.checked);
        document.querySelectorAll(`[data-z-a11y="${attr}"]`).forEach((o) => {
          if (o !== el) o.checked = el.checked;
        });
        applyAll();
      });
    });
  }

  function openPanelFromButton(btn) {
    const id = btn.getAttribute('data-z-open-panel');
    if (!id) return;
    const label = btn.getAttribute('data-z-open-label') || id;
    window.ZLayoutOS?.revealPanel?.(id, {
      userInitiated: true,
      label
    });
    const panel = document.getElementById(id);
    if (panel && typeof panel.focus === 'function') {
      try {
        panel.setAttribute('tabindex', '-1');
        panel.focus();
      } catch (e) {
        void e;
      }
    }
  }

  function init() {
    syncCheckboxesFromStorage();
    wireA11yInputs();
  }

  document.addEventListener(
    'click',
    function (ev) {
      const btn = ev.target && ev.target.closest && ev.target.closest('[data-z-open-panel]');
      if (!btn) return;
      openPanelFromButton(btn);
    },
    false
  );

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
