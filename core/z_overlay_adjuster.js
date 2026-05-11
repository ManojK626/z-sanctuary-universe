// Z: Overlay Adjuster (auto duck + reveal for minor visibility conflicts)
(function () {
  const KEY = 'zOverlayAdjusterMode';
  const REVEAL_CLASS = 'z-overlay-reveal';
  const DUCK_CLASS = 'z-overlay-duck';
  const ENABLED_CLASS = 'z-overlay-adjust-enabled';
  const STRICT_CLASS = 'z-overlay-strict';

  function getMode() {
    const raw = localStorage.getItem(KEY);
    // Backward compatibility with old boolean key values.
    if (raw === '1' || raw === 'true') return 'auto';
    if (raw === '0' || raw === 'false') return 'off';
    if (raw === 'auto' || raw === 'strict' || raw === 'off') return raw;
    return 'auto';
  }

  function setMode(mode) {
    const normalized = mode === 'strict' ? 'strict' : mode === 'off' ? 'off' : 'auto';
    localStorage.setItem(KEY, normalized);
    applyState();
    syncButton();
  }

  function nextMode(mode) {
    if (mode === 'auto') return 'strict';
    if (mode === 'strict') return 'off';
    return 'auto';
  }

  function intersects(a, b) {
    return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
  }

  function visible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  }

  function shouldDuck() {
    const statusBar = document.getElementById('lens-status-bar');
    const legend = document.getElementById('lens-legend');
    if (!visible(statusBar) && !visible(legend)) return false;

    const overlayRects = [statusBar, legend]
      .filter(visible)
      .map((el) => el.getBoundingClientRect());
    if (!overlayRects.length) return false;

    const targets = Array.from(document.querySelectorAll('.z-panel-header'))
      .filter((el) => visible(el))
      .map((el) => el.getBoundingClientRect());

    return overlayRects.some((overlayRect) =>
      targets.some((targetRect) => intersects(overlayRect, targetRect))
    );
  }

  function applyState() {
    const mode = getMode();
    const on = mode !== 'off';
    document.body.classList.toggle(ENABLED_CLASS, on);
    document.body.classList.toggle(STRICT_CLASS, mode === 'strict');
    if (!on) {
      document.body.classList.remove(DUCK_CLASS, REVEAL_CLASS, STRICT_CLASS);
      return;
    }
    const duck = mode === 'strict' ? true : shouldDuck();
    document.body.classList.toggle(DUCK_CLASS, duck);
  }

  function bindReveal() {
    const nodes = [
      document.getElementById('lens-mode-toggle'),
      document.getElementById('lens-status-bar'),
      document.getElementById('lens-legend'),
    ].filter(Boolean);

    const show = () => document.body.classList.add(REVEAL_CLASS);
    const hide = () => document.body.classList.remove(REVEAL_CLASS);
    nodes.forEach((node) => {
      node.addEventListener('mouseenter', show);
      node.addEventListener('focusin', show);
      node.addEventListener('mouseleave', hide);
      node.addEventListener('focusout', hide);
    });
  }

  function ensureToggleButton() {
    const mount = document.getElementById('lens-mode-toggle');
    if (!mount || document.getElementById('zOverlayAdjusterBtn')) return;
    const btn = document.createElement('button');
    btn.id = 'zOverlayAdjusterBtn';
    btn.type = 'button';
    btn.title = 'Z Overlay Adjuster mode (Alt+O)';
    btn.addEventListener('click', () => {
      setMode(nextMode(getMode()));
    });
    mount.appendChild(btn);
    syncButton();
  }

  function syncButton() {
    const btn = document.getElementById('zOverlayAdjusterBtn');
    if (!btn) return;
    const mode = getMode();
    btn.textContent =
      mode === 'strict' ? 'Overlay: Strict' : mode === 'off' ? 'Overlay: Off' : 'Overlay: Auto';
  }

  function bindHotkey() {
    window.addEventListener('keydown', (event) => {
      if (!event.altKey || String(event.key).toLowerCase() !== 'o') return;
      event.preventDefault();
      setMode(nextMode(getMode()));
    });
  }

  function boot() {
    ensureToggleButton();
    bindReveal();
    bindHotkey();
    applyState();
    window.addEventListener('resize', applyState, { passive: true });
    window.addEventListener('scroll', applyState, { passive: true });
    setInterval(applyState, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
