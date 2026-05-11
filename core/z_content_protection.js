// Z: core/z_content_protection.js
// Request-only content protection for sensitive read-only surfaces.
(function () {
  const script = document.currentScript;
  const mode = (script?.dataset?.zProtect || 'strict').toLowerCase();
  const allowSelector = script?.dataset?.zAllowSelector || '';
  const notice = script?.dataset?.zNotice || 'Content is request-only.';

  const guardState = {
    blocked: 0,
    mode,
  };

  function isAllowedTarget(target) {
    if (!allowSelector || !target || !(target instanceof Element)) return false;
    return Boolean(target.closest(allowSelector));
  }

  function blockEvent(event) {
    if (event.defaultPrevented) return;
    if (isAllowedTarget(event.target)) return;

    if (mode === 'monitor') {
      guardState.blocked += 1;
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    guardState.blocked += 1;
    showNotice();
  }

  function blockKeyShortcut(event) {
    const key = String(event.key || '').toLowerCase();
    const blockedCombo =
      (event.ctrlKey || event.metaKey) &&
      (key === 'c' || key === 'x' || key === 'a' || key === 's');
    if (!blockedCombo) return;
    blockEvent(event);
  }

  function showNotice() {
    const existing = document.getElementById('zContentProtectionNotice');
    if (existing) {
      existing.classList.add('visible');
      window.clearTimeout(existing._hideTimer);
      existing._hideTimer = window.setTimeout(() => existing.classList.remove('visible'), 1600);
      return;
    }
    const el = document.createElement('div');
    el.id = 'zContentProtectionNotice';
    el.textContent = notice;
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.style.cssText = [
      'position:fixed',
      'right:12px',
      'bottom:12px',
      'z-index:2147483647',
      'padding:8px 10px',
      'border:1px solid rgba(96,165,250,0.45)',
      'border-radius:10px',
      'background:rgba(2,6,23,0.95)',
      'color:#dbeafe',
      'font:12px/1.3 system-ui,-apple-system,Segoe UI,Roboto,sans-serif',
      'opacity:0',
      'transform:translateY(4px)',
      'transition:opacity .2s ease, transform .2s ease',
      'pointer-events:none',
    ].join(';');
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.classList.add('visible');
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    el._hideTimer = window.setTimeout(() => {
      el.classList.remove('visible');
      el.style.opacity = '0';
      el.style.transform = 'translateY(4px)';
    }, 1600);
  }

  function install() {
    if (mode === 'off') return;

    document.documentElement.classList.add('z-content-protected');
    if (mode === 'strict') {
      document.addEventListener('copy', blockEvent, true);
      document.addEventListener('cut', blockEvent, true);
      document.addEventListener('dragstart', blockEvent, true);
      document.addEventListener('selectstart', blockEvent, true);
      document.addEventListener('contextmenu', blockEvent, true);
      document.addEventListener('keydown', blockKeyShortcut, true);
    } else {
      document.addEventListener('copy', blockEvent, true);
      document.addEventListener('cut', blockEvent, true);
      document.addEventListener('selectstart', blockEvent, true);
      document.addEventListener('keydown', blockKeyShortcut, true);
    }

    window.ZContentProtection = {
      status: () => ({ ...guardState }),
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else {
    install();
  }
})();
