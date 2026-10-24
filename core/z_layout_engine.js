// Z: Adaptive layout engine (non-destructive, viewport + display-aware)
(function () {
  const CHRONICLE_AUTO_KEY = 'zLayoutChronicleAutoCollapsedV1';
  const DENSITY_KEY = 'zUiDensity';
  const DISPLAY_KEY = 'zDisplayFingerprintV1';
  const DISPLAY_DENSITY_MAP_KEY = 'zDisplayDensityMapV1';
  let currentDisplayKey = null;
  let densityObserver = null;

  function hasManualDensitySelection() {
    const raw = localStorage.getItem(DENSITY_KEY);
    return raw === 'normal' || raw === 'compact' || raw === 'ultra';
  }

  function readDisplayDensityMap() {
    try {
      const parsed = JSON.parse(localStorage.getItem(DISPLAY_DENSITY_MAP_KEY) || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function writeDisplayDensityMap(map) {
    localStorage.setItem(DISPLAY_DENSITY_MAP_KEY, JSON.stringify(map));
  }

  function getBodyDensityMode() {
    if (document.body.classList.contains('z-density-ultra')) return 'ultra';
    if (document.body.classList.contains('z-density-compact')) return 'compact';
    return 'normal';
  }

  function applyDensityClass(mode) {
    const normalized = mode === 'ultra' ? 'ultra' : mode === 'compact' ? 'compact' : 'normal';
    document.body.classList.toggle('z-density-compact', normalized === 'compact');
    document.body.classList.toggle('z-density-ultra', normalized === 'ultra');
    syncDensityControls(normalized);
  }

  function syncDensityControls(mode) {
    const compactToggle = document.getElementById('zCompactModeToggle');
    const ultraToggle = document.getElementById('zUltraCompactToggle');
    const label = document.getElementById('zDensityPresetLabel');
    if (compactToggle) compactToggle.checked = mode === 'compact';
    if (ultraToggle) ultraToggle.checked = mode === 'ultra';
    if (label) {
      label.textContent = `Density: ${mode === 'ultra' ? 'Ultra' : mode === 'compact' ? 'Compact' : 'Normal'}`;
    }
  }

  function rememberDensityForDisplay(mode) {
    if (!currentDisplayKey) return;
    const map = readDisplayDensityMap();
    map[currentDisplayKey] = mode;
    writeDisplayDensityMap(map);
  }

  function getDisplayFingerprint() {
    const scr = window.screen || {};
    const dpr = window.devicePixelRatio || 1;
    return {
      width: Number(scr.width || 0),
      height: Number(scr.height || 0),
      availWidth: Number(scr.availWidth || 0),
      availHeight: Number(scr.availHeight || 0),
      dpr: Number(dpr.toFixed(2)),
      colorDepth: Number(scr.colorDepth || 0),
      pixelDepth: Number(scr.pixelDepth || 0),
    };
  }

  function toDisplayKey(fp) {
    return [
      fp.width,
      fp.height,
      fp.availWidth,
      fp.availHeight,
      fp.dpr,
      fp.colorDepth,
      fp.pixelDepth,
    ].join('x');
  }

  function pickProfile(width, height, dpr, displayRatio) {
    if (width <= 900) return 'mobile';
    if (width <= 1300) return 'tablet';
    if (width >= 2200) return 'wide';
    if (displayRatio >= 2.1 && width <= 1900) return 'compact-desktop';
    if (width <= 1600) return 'compact-desktop';
    if (width >= 2400 || dpr >= 1.75 || (displayRatio >= 2.1 && height >= 1000)) return 'ultra';
    return 'desktop';
  }

  function toViewportClass(profile) {
    if (profile === 'ultra') return 'ultra';
    if (profile === 'wide') return 'wide';
    if (profile === 'tablet') return 'tablet';
    if (profile === 'mobile') return 'mobile';
    return 'desktop';
  }

  function applyProfile(profile, width, displayKey) {
    const body = document.body;
    const root = document.documentElement;
    if (!body || !root) return;
    const viewportClass = toViewportClass(profile);

    body.classList.remove(
      'zvp-mobile',
      'zvp-tablet',
      'zvp-compact-desktop',
      'zvp-desktop',
      'zvp-wide',
      'zvp-ultra'
    );
    body.classList.add(`zvp-${profile}`);
    body.classList.toggle('z-rail-compact', width <= 1500);
    body.classList.toggle('z-rail-ultra-compact', width <= 1300);
    root.setAttribute('z-profile', profile);
    root.setAttribute('z-viewport', viewportClass);
    root.setAttribute('z-display-key', displayKey);
    window.__Z_VIEWPORT_PROFILE__ = {
      viewport_class: viewportClass,
      width: window.innerWidth || 0,
      height: window.innerHeight || 0,
      dpi: window.devicePixelRatio || 1,
      ts: new Date().toISOString(),
    };

    // Keep browser-level zoom neutral; spacing adapts via CSS.
    root.style.setProperty('--z-ui-zoom', '1');
    root.style.setProperty(
      '--z-status-rail-width',
      profile === 'ultra'
        ? '300px'
        : profile === 'desktop'
          ? '268px'
          : profile === 'compact-desktop'
            ? '240px'
            : profile === 'tablet'
              ? '220px'
              : '0px'
    );

    const hasUserOverride =
      Boolean(window.__Z_USER_OVERRIDE_DENSITY__) || hasManualDensitySelection();
    if (hasUserOverride) {
      const raw = localStorage.getItem(DENSITY_KEY);
      applyDensityClass(raw);
      rememberDensityForDisplay(raw);
      return;
    }

    const autoDensityByViewport = {
      ultra: 'normal',
      wide: 'compact',
      desktop: 'compact',
      tablet: 'compact',
      mobile: 'ultra',
    };
    const autoMode = autoDensityByViewport[viewportClass] || 'compact';
    if (typeof window.setZDensity === 'function') {
      window.setZDensity(autoMode, { manual: false, persist: false });
    } else {
      applyDensityClass(autoMode);
    }
  }

  function autoCollapseChronicleOnce(width) {
    if (width > 1500) return;
    if (localStorage.getItem(CHRONICLE_AUTO_KEY) === '1') return;
    const panel = document.getElementById('zChroniclePanel');
    if (!panel || panel.dataset.collapsed === 'true') {
      localStorage.setItem(CHRONICLE_AUTO_KEY, '1');
      return;
    }
    const collapseBtn = panel.querySelector(
      '.z-panel-actions .z-panel-btn[data-action="collapse"]'
    );
    if (collapseBtn) {
      collapseBtn.click();
      localStorage.setItem(CHRONICLE_AUTO_KEY, '1');
    }
  }

  function isContractHost() {
    return Boolean(document.body && document.body.classList.contains('z-anydevice-adaptive'));
  }

  function contractApi() {
    return window.ZAdaptiveRuntime || null;
  }

  function applyContract(reading, displayKey) {
    const body = document.body;
    const root = document.documentElement;
    if (!body || !root) return;
    const layout = reading.layout;
    const width = reading.width;
    const compat = {
      mobile: { profile: 'mobile', viewport: 'mobile', classes: ['zvp-mobile'] },
      compact: { profile: 'tablet', viewport: 'tablet', classes: ['zvp-tablet'] },
      standard: {
        profile: 'compact-desktop',
        viewport: 'desktop',
        classes: ['zvp-compact-desktop', 'zvp-desktop'],
      },
      wide: { profile: 'wide', viewport: 'wide', classes: ['zvp-wide'] },
    }[layout];
    body.classList.remove(
      'zvp-mobile',
      'zvp-tablet',
      'zvp-compact-desktop',
      'zvp-desktop',
      'zvp-wide',
      'zvp-ultra',
      'z-layout-mobile',
      'z-layout-compact',
      'z-layout-standard',
      'z-layout-wide'
    );
    compat.classes.forEach((name) => body.classList.add(name));
    body.classList.add(`z-layout-${layout}`);
    body.classList.toggle('z-rail-compact', width <= 1500);
    body.classList.toggle('z-rail-ultra-compact', width <= 1300);
    root.setAttribute('z-profile', compat.profile);
    root.setAttribute('z-viewport', compat.viewport);
    root.setAttribute('z-layout', layout);
    root.setAttribute('z-display-key', displayKey);
    root.setAttribute('z-orientation', reading.orientation);
    root.setAttribute('z-pointer', reading.pointer);
    root.setAttribute('z-hover', reading.hover);
    root.setAttribute('z-motion', reading.motion);
    root.setAttribute('z-offline', reading.offline);
    window.__Z_VIEWPORT_PROFILE__ = {
      layout_class: layout,
      viewport_class: compat.viewport,
      width: reading.width,
      height: reading.height,
      measurement: reading.source,
      viewport_scale: reading.viewportScale,
      pointer_any: reading.pointerAny,
      hover_any: reading.hoverAny,
      dpi: window.devicePixelRatio || 1,
      ts: new Date().toISOString(),
    };
    root.style.setProperty('--z-ui-zoom', '1');
    const railWidth = {
      wide: '268px',
      standard: '240px',
      compact: '220px',
      mobile: '0px',
    }[layout];
    root.style.setProperty('--z-status-rail-width', railWidth);

    const hasUserOverride =
      Boolean(window.__Z_USER_OVERRIDE_DENSITY__) || hasManualDensitySelection();
    if (hasUserOverride) {
      const chosen = localStorage.getItem(DENSITY_KEY);
      applyDensityClass(chosen);
      rememberDensityForDisplay(chosen);
    } else {
      const autoDensityByLayout = {
        mobile: 'ultra',
        compact: 'compact',
        standard: 'compact',
        wide: 'compact',
      };
      const mode = autoDensityByLayout[layout] || 'compact';
      if (typeof window.setZDensity === 'function') {
        window.setZDensity(mode, { manual: false, persist: false });
      } else {
        applyDensityClass(mode);
      }
    }
    root.setAttribute('z-density', getBodyDensityMode());
    return compat.profile;
  }

  function runLegacy() {
    const width = window.innerWidth || document.documentElement.clientWidth || 0;
    const height = window.innerHeight || document.documentElement.clientHeight || 0;
    const dpr = window.devicePixelRatio || 1;
    const display = getDisplayFingerprint();
    const displayKey = toDisplayKey(display);
    currentDisplayKey = displayKey;
    const displayRatio = display.height ? display.width / display.height : 1.6;
    const profile = pickProfile(width, height, dpr, displayRatio);
    applyProfile(profile, width, displayKey);
    localStorage.setItem(DISPLAY_KEY, displayKey);
    window.dispatchEvent(
      new CustomEvent('z-display-profile-changed', {
        detail: { profile, width, height, dpr, displayKey, display },
      })
    );
  }

  function runContract() {
    const api = contractApi();
    if (!api) {
      runLegacy();
      return;
    }
    const reading = api.read(window);
    // LEGACY_COMPATIBILITY_DEBT: fingerprint is stored for older density memory.
    // Shared measurement does not read color depth, pixel depth, or screen size.
    const display = getDisplayFingerprint();
    const displayKey = toDisplayKey(display);
    currentDisplayKey = displayKey;
    const profile = applyContract(reading, displayKey);
    const width = reading.width;
    const height = reading.height;
    const layout = reading.layout;
    localStorage.setItem(DISPLAY_KEY, displayKey);
    window.dispatchEvent(
      new CustomEvent('z-display-profile-changed', {
        detail: {
          profile,
          layout,
          width,
          height,
          dpr: window.devicePixelRatio || 1,
          displayKey,
          display,
          contract: 'z-anydevice-adaptive-0.1',
        },
      })
    );
  }

  function run() {
    if (isContractHost()) runContract();
    else runLegacy();
  }

  let resizeTimer = null;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(run, 120);
  }

  function boot() {
    run();
    const api = contractApi();
    setTimeout(
      () =>
        autoCollapseChronicleOnce(
          isContractHost() && api ? api.read(window).width : window.innerWidth || 0
        ),
      650
    );
    initDensityDisplayMemory();
    if (!isContractHost()) return;
    if (api && typeof api.subscribe === 'function') api.subscribe(window, onResize);
    if (window.MutationObserver && document.body) {
      new MutationObserver(() => onResize()).observe(document.body, {
        attributes: true,
        attributeFilter: ['style'],
      });
    }
  }

  function initDensityDisplayMemory() {
    if (!document.body || densityObserver) return;
    densityObserver = new MutationObserver(() => {
      const mode = getBodyDensityMode();
      rememberDensityForDisplay(mode);
      if (isContractHost()) document.documentElement.setAttribute('z-density', mode);
    });
    densityObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  let lastWindowPos = `${window.screenX}|${window.screenY}|${window.outerWidth}|${window.outerHeight}`;
  setInterval(() => {
    const next = `${window.screenX}|${window.screenY}|${window.outerWidth}|${window.outerHeight}`;
    if (next !== lastWindowPos) {
      lastWindowPos = next;
      run();
    }
  }, 1200);

  window.addEventListener('resize', onResize, { passive: true });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
