// Z: interface/z_auto_compass.js
// Pointer-centered directional navigator for fast movement in dense pages.
(function () {
  const STYLE_ID = 'zAutoCompassStyles';
  const ROOT_ID = 'zAutoCompassRoot';
  const PORTAL_ID = 'zNeutralOverlayRoot';
  const HOTKEY_LABEL_ID = 'zAutoCompassHint';
  const GHOST_MODE = true;
  const SETTINGS_KEY = 'zAutoCompassSettingsV1';
  const RADIUS = 48;
  const SPEED_PRESETS = [
    { id: 'slow', label: 'SLOW', value: 12 },
    { id: 'normal', label: 'NORMAL', value: 22 },
    { id: 'fast', label: 'FAST', value: 34 },
  ];

  let root = null;
  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let targetScroller = null;
  let activeVector = null;
  let rafId = null;
  let mouseDriveRafId = null;
  let altHeld = false;
  let visible = false;
  let keyboardVector = null;
  let settings = {
    speedPreset: 'normal',
    keyboardMode: true,
    handedness: 'right',
    mouseDrive: true,
  };

  const directions = [
    { id: 'n', dx: 0, dy: -1, label: 'N' },
    { id: 'ne', dx: 0.7, dy: -0.7, label: 'NE' },
    { id: 'e', dx: 1, dy: 0, label: 'E' },
    { id: 'se', dx: 0.7, dy: 0.7, label: 'SE' },
    { id: 's', dx: 0, dy: 1, label: 'S' },
    { id: 'sw', dx: -0.7, dy: 0.7, label: 'SW' },
    { id: 'w', dx: -1, dy: 0, label: 'W' },
    { id: 'nw', dx: -0.7, dy: -0.7, label: 'NW' },
  ];

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${ROOT_ID} {
        position: fixed;
        left: 0;
        top: 0;
        width: 0;
        height: 0;
        z-index: 13020;
        pointer-events: none;
        display: none !important;
      }
      #${ROOT_ID}.is-visible {
        display: ${GHOST_MODE ? 'none' : 'block'};
      }
      #${PORTAL_ID} {
        position: fixed;
        inset: 0;
        z-index: 13020;
        pointer-events: none;
      }
      #${ROOT_ID} .z-ac-ring {
        position: absolute;
        left: 0;
        top: 0;
        width: 124px;
        height: 124px;
        transform: translate(-50%, -50%);
        border-radius: 999px;
        border: 1px solid rgba(122, 211, 255, 0.4);
        background: radial-gradient(circle, rgba(8, 14, 30, 0.7), rgba(8, 14, 30, 0.12));
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45);
        pointer-events: none;
      }
      #${ROOT_ID} .z-ac-btn {
        position: absolute;
        width: 30px;
        height: 30px;
        border-radius: 999px;
        border: 1px solid rgba(122, 211, 255, 0.55);
        background: rgba(10, 18, 34, 0.9);
        color: #dff4ff;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.03em;
        cursor: pointer;
        pointer-events: auto;
        transform: translate(-50%, -50%);
        user-select: none;
      }
      #${ROOT_ID} .z-ac-btn:hover,
      #${ROOT_ID} .z-ac-btn.is-active {
        background: rgba(0, 212, 255, 0.2);
        border-color: rgba(127, 230, 255, 0.9);
      }
      #${ROOT_ID} .z-ac-center {
        position: absolute;
        width: 34px;
        height: 34px;
        border-radius: 999px;
        border: 1px solid rgba(166, 255, 216, 0.6);
        background: rgba(11, 22, 36, 0.95);
        color: #a6ffd8;
        font-size: 9px;
        font-weight: 700;
        transform: translate(-50%, -50%);
        pointer-events: auto;
      }
      #${ROOT_ID} .z-ac-meta {
        position: absolute;
        left: 0;
        top: 40px;
        transform: translateX(-50%);
        font-size: 9px;
        color: #9fd7ff;
        background: rgba(7, 12, 22, 0.9);
        border: 1px solid rgba(122, 211, 255, 0.28);
        border-radius: 999px;
        padding: 1px 6px;
        pointer-events: none;
      }
      #${ROOT_ID} .z-ac-control {
        position: absolute;
        height: 22px;
        min-width: 34px;
        border-radius: 999px;
        border: 1px solid rgba(122, 211, 255, 0.45);
        background: rgba(8, 16, 30, 0.95);
        color: #dff4ff;
        font-size: 9px;
        font-weight: 700;
        padding: 0 8px;
        cursor: pointer;
        pointer-events: auto;
        transform: translate(-50%, -50%);
      }
      #${ROOT_ID} .z-ac-control:hover {
        background: rgba(0, 212, 255, 0.15);
      }
      #${ROOT_ID} .z-ac-control.is-off {
        opacity: 0.55;
      }
      #${HOTKEY_LABEL_ID} {
        position: fixed;
        top: 0.62rem;
        right: 0.85rem;
        z-index: 13015;
        font-size: 0.68rem;
        color: #9fd7ff;
        background: rgba(10, 14, 24, 0.82);
        border: 1px solid rgba(122, 211, 255, 0.28);
        border-radius: 999px;
        padding: 0.14rem 0.46rem;
        pointer-events: none;
      }
      @media (max-width: 980px) {
        #${HOTKEY_LABEL_ID} {
          font-size: 0.62rem;
          right: 0.6rem;
        }
      }
      ${GHOST_MODE ? `#${HOTKEY_LABEL_ID} { display: none !important; }` : ''}
    `;
    document.head.appendChild(style);
  }

  function readSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        settings = { ...settings, ...parsed };
      }
    } catch (err) {
      // ignore
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (err) {
      // ignore
    }
  }

  function getSpeedPreset() {
    return SPEED_PRESETS.find((x) => x.id === settings.speedPreset) || SPEED_PRESETS[1];
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function canScroll(el) {
    if (!el || el === document.body || el === document.documentElement) return false;
    const cs = window.getComputedStyle(el);
    const yScrollable =
      /(auto|scroll|overlay)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 2;
    const xScrollable =
      /(auto|scroll|overlay)/.test(cs.overflowX) && el.scrollWidth > el.clientWidth + 2;
    return yScrollable || xScrollable;
  }

  function resolveScrollerFromPoint(x, y) {
    const elements = document.elementsFromPoint(x, y);
    for (const el of elements) {
      let cur = el;
      while (cur) {
        if (canScroll(cur)) return cur;
        cur = cur.parentElement;
      }
    }
    return document.scrollingElement || document.documentElement;
  }

  function refreshMeta() {
    if (!root) return;
    const speed = getSpeedPreset();
    const meta = root.querySelector('#zAcMeta');
    if (meta) meta.textContent = `${speed.label} • ${settings.handedness.toUpperCase()}H`;
    const speedBtn = root.querySelector('#zAcSpeedBtn');
    if (speedBtn) speedBtn.textContent = speed.label;
    const kbBtn = root.querySelector('#zAcKbBtn');
    if (kbBtn) {
      kbBtn.textContent = settings.keyboardMode ? 'KB ON' : 'KB OFF';
      kbBtn.classList.toggle('is-off', !settings.keyboardMode);
    }
    const handBtn = root.querySelector('#zAcHandBtn');
    if (handBtn) handBtn.textContent = settings.handedness === 'left' ? 'LH' : 'RH';
  }

  function updatePosition() {
    if (!root) return;
    const x = clamp(pointerX, 70, window.innerWidth - 70);
    const y = clamp(pointerY, 70, window.innerHeight - 70);
    root.style.left = `${x}px`;
    root.style.top = `${y}px`;
  }

  function stopScroll() {
    activeVector = null;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (!root) return;
    root.querySelectorAll('.z-ac-btn').forEach((btn) => btn.classList.remove('is-active'));
  }

  function stepScroll() {
    if (!activeVector) return;
    const speed = getSpeedPreset().value;
    const scroller = targetScroller || document.scrollingElement || document.documentElement;
    const dx = activeVector.dx * speed;
    const dy = activeVector.dy * speed;
    if (
      scroller === document.body ||
      scroller === document.documentElement ||
      scroller === document.scrollingElement
    ) {
      window.scrollBy(dx, dy);
    } else {
      scroller.scrollBy(dx, dy);
    }
    rafId = requestAnimationFrame(stepScroll);
  }

  function stopMouseDrive() {
    if (mouseDriveRafId) {
      cancelAnimationFrame(mouseDriveRafId);
      mouseDriveRafId = null;
    }
  }

  function stepMouseDrive() {
    if (!altHeld || !settings.mouseDrive || activeVector || keyboardVector) {
      stopMouseDrive();
      return;
    }
    const scroller = resolveScrollerFromPoint(pointerX, pointerY);
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const nx = (pointerX - cx) / Math.max(1, cx);
    const ny = (pointerY - cy) / Math.max(1, cy);
    const deadZone = 0.08;
    const vx = Math.abs(nx) < deadZone ? 0 : nx;
    const vy = Math.abs(ny) < deadZone ? 0 : ny;
    if (vx !== 0 || vy !== 0) {
      const base = getSpeedPreset().value * 1.35;
      const scaleBoost =
        scroller && scroller !== document.scrollingElement && scroller.scrollHeight > 4000
          ? 1.25
          : 1;
      const dx = vx * base * scaleBoost;
      const dy = vy * base * scaleBoost;
      if (
        scroller === document.body ||
        scroller === document.documentElement ||
        scroller === document.scrollingElement
      ) {
        window.scrollBy(dx, dy);
      } else {
        scroller.scrollBy(dx, dy);
      }
    }
    mouseDriveRafId = requestAnimationFrame(stepMouseDrive);
  }

  function startMouseDrive() {
    if (mouseDriveRafId || !settings.mouseDrive) return;
    mouseDriveRafId = requestAnimationFrame(stepMouseDrive);
  }

  function startScroll(vector, btnEl) {
    stopScroll();
    activeVector = vector;
    if (btnEl) btnEl.classList.add('is-active');
    targetScroller = resolveScrollerFromPoint(pointerX, pointerY);
    rafId = requestAnimationFrame(stepScroll);
  }

  function cycleSpeed() {
    const idx = SPEED_PRESETS.findIndex((x) => x.id === settings.speedPreset);
    settings.speedPreset = SPEED_PRESETS[(idx + 1) % SPEED_PRESETS.length].id;
    saveSettings();
    refreshMeta();
  }

  function toggleKeyboardMode() {
    settings.keyboardMode = !settings.keyboardMode;
    saveSettings();
    refreshMeta();
  }

  function toggleHandedness() {
    settings.handedness = settings.handedness === 'left' ? 'right' : 'left';
    saveSettings();
    refreshMeta();
    if (visible) updatePosition();
  }

  function showCompass() {
    if (!root || visible) return;
    visible = true;
    if (!GHOST_MODE) root.classList.add('is-visible');
    refreshMeta();
    updatePosition();
  }

  function hideCompass() {
    visible = false;
    keyboardVector = null;
    if (!root) return;
    stopScroll();
    stopMouseDrive();
    if (!GHOST_MODE) root.classList.remove('is-visible');
  }

  function buildCompass() {
    if (document.getElementById(ROOT_ID)) return document.getElementById(ROOT_ID);
    let portal = document.getElementById(PORTAL_ID);
    if (!portal) {
      portal = document.createElement('div');
      portal.id = PORTAL_ID;
      document.documentElement.appendChild(portal);
    }

    const host = document.createElement('div');
    host.id = ROOT_ID;

    if (GHOST_MODE) {
      portal.appendChild(host);
      return host;
    }

    const ring = document.createElement('div');
    ring.className = 'z-ac-ring';
    host.appendChild(ring);

    for (const dir of directions) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'z-ac-btn';
      btn.dataset.dir = dir.id;
      btn.textContent = dir.label;
      btn.style.left = `${dir.dx * RADIUS}px`;
      btn.style.top = `${dir.dy * RADIUS}px`;
      btn.addEventListener('mousedown', (event) => {
        event.preventDefault();
        startScroll(dir, btn);
      });
      btn.addEventListener('mouseup', stopScroll);
      btn.addEventListener('mouseleave', stopScroll);
      host.appendChild(btn);
    }

    const center = document.createElement('button');
    center.type = 'button';
    center.className = 'z-ac-center';
    center.textContent = 'STOP';
    center.style.left = '0';
    center.style.top = '0';
    center.addEventListener('mousedown', (event) => {
      event.preventDefault();
      stopScroll();
    });
    host.appendChild(center);

    const meta = document.createElement('div');
    meta.className = 'z-ac-meta';
    meta.id = 'zAcMeta';
    host.appendChild(meta);

    const speedBtn = document.createElement('button');
    speedBtn.type = 'button';
    speedBtn.className = 'z-ac-control';
    speedBtn.id = 'zAcSpeedBtn';
    speedBtn.style.left = '-42px';
    speedBtn.style.top = '-56px';
    speedBtn.addEventListener('click', (event) => {
      event.preventDefault();
      cycleSpeed();
    });
    host.appendChild(speedBtn);

    const kbBtn = document.createElement('button');
    kbBtn.type = 'button';
    kbBtn.className = 'z-ac-control';
    kbBtn.id = 'zAcKbBtn';
    kbBtn.style.left = '0';
    kbBtn.style.top = '-56px';
    kbBtn.addEventListener('click', (event) => {
      event.preventDefault();
      toggleKeyboardMode();
    });
    host.appendChild(kbBtn);

    const handBtn = document.createElement('button');
    handBtn.type = 'button';
    handBtn.className = 'z-ac-control';
    handBtn.id = 'zAcHandBtn';
    handBtn.style.left = '42px';
    handBtn.style.top = '-56px';
    handBtn.addEventListener('click', (event) => {
      event.preventDefault();
      toggleHandedness();
    });
    host.appendChild(handBtn);

    portal.appendChild(host);
    return host;
  }

  function ensureHotkeyHint() {
    if (GHOST_MODE) return;
    if (document.getElementById(HOTKEY_LABEL_ID)) return;
    const portal = document.getElementById(PORTAL_ID) || document.documentElement;
    const hint = document.createElement('div');
    hint.id = HOTKEY_LABEL_ID;
    hint.textContent = 'Auto-Compass: hold Alt | WASD/Arrows';
    portal.appendChild(hint);
  }

  function isEditableTarget(target) {
    if (!target) return false;
    const tag = String(target.tagName || '').toLowerCase();
    if (['input', 'textarea', 'select', 'button'].includes(tag)) return true;
    return !!target.closest?.('[contenteditable="true"]');
  }

  function keyToVector(key) {
    const k = String(key || '').toLowerCase();
    if (k === 'w' || k === 'arrowup') return { dx: 0, dy: -1 };
    if (k === 's' || k === 'arrowdown') return { dx: 0, dy: 1 };
    if (k === 'a' || k === 'arrowleft') return { dx: -1, dy: 0 };
    if (k === 'd' || k === 'arrowright') return { dx: 1, dy: 0 };
    if (k === 'q') return { dx: -0.7, dy: -0.7 };
    if (k === 'e') return { dx: 0.7, dy: -0.7 };
    if (k === 'z') return { dx: -0.7, dy: 0.7 };
    if (k === 'c') return { dx: 0.7, dy: 0.7 };
    return null;
  }

  function bindEvents() {
    window.addEventListener('mousemove', (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      if (visible) updatePosition();
    });

    window.addEventListener(
      'scroll',
      () => {
        if (visible) updatePosition();
      },
      { passive: true }
    );

    window.addEventListener('resize', () => {
      if (visible) updatePosition();
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        hideCompass();
        return;
      }
      if (event.key !== 'Alt') return;
      if (altHeld) return;
      if (isEditableTarget(document.activeElement)) return;
      altHeld = true;
      showCompass();
      startMouseDrive();
    });

    window.addEventListener('keydown', (event) => {
      if (!visible || !altHeld || !settings.keyboardMode) return;
      const vector = keyToVector(event.key);
      if (!vector) return;
      event.preventDefault();
      keyboardVector = vector;
      startScroll(vector, null);
    });

    window.addEventListener('keyup', (event) => {
      if (event.key === 'Alt') {
        altHeld = false;
        hideCompass();
        return;
      }
      if (!keyboardVector) return;
      const vector = keyToVector(event.key);
      if (!vector) return;
      keyboardVector = null;
      stopScroll();
    });

    window.addEventListener('blur', () => {
      altHeld = false;
      hideCompass();
    });

    window.addEventListener('mouseup', stopScroll);
  }

  function init() {
    if (!document.body) return;
    readSettings();
    ensureStyles();
    root = buildCompass();
    ensureHotkeyHint();
    refreshMeta();
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
