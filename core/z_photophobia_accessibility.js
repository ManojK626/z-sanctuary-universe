/**
 * Z-Sanctuary Photophobia & Light Sensitivity Accessibility Features
 * Provides comprehensive controls for light-sensitive and photophobic users
 */
(function () {
  const storagePrefix = 'z.accessibility.';

  // ============ LOW LIGHT MODE (Photophobia) ============
  function initLowLightMode() {
    const btn = document.getElementById('zLowLightToggle');
    if (!btn) return;

    const storageKey = storagePrefix + 'lowLight';
    const body = document.body;

    function applyLowLight(enabled) {
      if (enabled) {
        body.classList.add('low-light-mode');
        body.style.filter = 'brightness(0.7) contrast(1.1)';
        btn.textContent = '🌙 Low Light On';
        btn.style.background = 'rgba(255,215,0,0.25)';
        btn.style.borderColor = 'rgba(255,215,0,0.6)';
        btn.setAttribute('aria-pressed', 'true');
      } else {
        body.classList.remove('low-light-mode');
        body.style.filter = '';
        btn.textContent = '🌙 Low Light Off';
        btn.style.background = 'rgba(255,215,0,0.1)';
        btn.style.borderColor = 'rgba(255,215,0,0.3)';
        btn.setAttribute('aria-pressed', 'false');
      }
      localStorage.setItem(storageKey, enabled ? 'on' : 'off');
    }

    let initial = localStorage.getItem(storageKey) === 'on';
    applyLowLight(initial);
    btn.addEventListener('click', () => applyLowLight(!body.classList.contains('low-light-mode')));
  }

  // ============ HIGH CONTRAST MODE ============
  function initHighContrast() {
    const btn = document.getElementById('zHighContrastToggle');
    if (!btn) return;

    const storageKey = storagePrefix + 'highContrast';
    const body = document.body;

    function applyHighContrast(enabled) {
      if (enabled) {
        body.classList.add('high-contrast-mode');
        document.documentElement.style.setProperty('--z-accent', '#ffff00');
        document.documentElement.style.setProperty('--z-harmony', '#00ffff');
        document.documentElement.style.setProperty('--z-primary', '#ffffff');
        document.documentElement.style.setProperty('--z-light', '#ffffff');
        document.body.style.background = '#000000';
        btn.textContent = '⚡ Contrast On';
        btn.style.background = 'rgba(255,255,255,0.15)';
        btn.style.borderColor = 'rgba(255,255,255,0.5)';
        btn.setAttribute('aria-pressed', 'true');
      } else {
        body.classList.remove('high-contrast-mode');
        document.documentElement.style.setProperty('--z-accent', '');
        document.documentElement.style.setProperty('--z-harmony', '');
        document.documentElement.style.setProperty('--z-primary', '');
        document.documentElement.style.setProperty('--z-light', '');
        document.body.style.background = '';
        btn.textContent = '⚡ Contrast';
        btn.style.background = 'rgba(255,255,255,0.05)';
        btn.style.borderColor = 'rgba(255,255,255,0.2)';
        btn.setAttribute('aria-pressed', 'false');
      }
      localStorage.setItem(storageKey, enabled ? 'on' : 'off');
    }

    let initial = localStorage.getItem(storageKey) === 'on';
    applyHighContrast(initial);
    btn.addEventListener('click', () =>
      applyHighContrast(!body.classList.contains('high-contrast-mode'))
    );
  }

  // ============ REDUCE MOTION (Vestibular Sensitivity) ============
  function initReduceMotion() {
    const btn = document.getElementById('zReduceMotionToggle');
    if (!btn) return;

    const storageKey = storagePrefix + 'reduceMotion';
    const body = document.body;

    function applyReduceMotion(enabled) {
      if (enabled) {
        body.classList.add('reduce-motion-mode');
        const style = document.createElement('style');
        style.id = 'z-reduce-motion-style';
        style.textContent = `
          * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
          @media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; } }
        `;
        if (!document.getElementById('z-reduce-motion-style')) {
          document.head.appendChild(style);
        }
        btn.textContent = '◉ Motion Off';
        btn.style.background = 'rgba(0,255,200,0.2)';
        btn.style.borderColor = 'rgba(0,255,200,0.6)';
        btn.setAttribute('aria-pressed', 'true');
      } else {
        body.classList.remove('reduce-motion-mode');
        const style = document.getElementById('z-reduce-motion-style');
        if (style) style.remove();
        btn.textContent = '◉ Motion';
        btn.style.background = 'rgba(0,255,200,0.1)';
        btn.style.borderColor = 'rgba(0,255,200,0.3)';
        btn.setAttribute('aria-pressed', 'false');
      }
      localStorage.setItem(storageKey, enabled ? 'on' : 'off');
    }

    let initial = localStorage.getItem(storageKey) === 'on';
    applyReduceMotion(initial);
    btn.addEventListener('click', () =>
      applyReduceMotion(!body.classList.contains('reduce-motion-mode'))
    );
  }

  // ============ FONT SIZE ADJUSTMENT (Dyslexia, Vision Issues) ============
  function initFontSizeToggle() {
    const btn = document.getElementById('zFontSizeToggle');
    if (!btn) return;

    const storageKey = storagePrefix + 'fontSize';
    const body = document.body;
    let sizeLevel = 0;

    function applyFontSize(level) {
      sizeLevel = level;
      let scale = 1;
      let fontSize = '1em';

      switch (level) {
        case 1:
          scale = 1.15;
          fontSize = '1.15em';
          btn.textContent = 'A+ Text (1.15x)';
          break;
        case 2:
          scale = 1.3;
          fontSize = '1.3em';
          btn.textContent = 'A++ Text (1.3x)';
          break;
        case 3:
          scale = 1.5;
          fontSize = '1.5em';
          btn.textContent = 'A+++ Text (1.5x)';
          break;
        default:
          scale = 1;
          fontSize = '1em';
          btn.textContent = 'A+ Text';
      }

      body.style.fontSize = fontSize;
      document.documentElement.style.setProperty('--font-scale', scale);
      localStorage.setItem(storageKey, level);

      if (level > 0) {
        btn.style.background = 'rgba(100,200,255,0.2)';
        btn.style.borderColor = 'rgba(100,200,255,0.6)';
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.style.background = 'rgba(100,200,255,0.1)';
        btn.style.borderColor = 'rgba(100,200,255,0.3)';
        btn.setAttribute('aria-pressed', 'false');
      }
    }

    let initial = parseInt(localStorage.getItem(storageKey) || '0', 10);
    applyFontSize(initial);

    btn.addEventListener('click', () => {
      const nextLevel = (sizeLevel + 1) % 4;
      applyFontSize(nextLevel);
    });
  }

  // ============ INITIALIZATION ============
  document.addEventListener('DOMContentLoaded', () => {
    initLowLightMode();
    initHighContrast();
    initReduceMotion();
    initFontSizeToggle();

    // Log that accessibility features are ready
    console.log('✅ Z-Sanctuary Photophobia & Accessibility Features loaded');
  });

  // Fallback if DOM already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        initLowLightMode();
        initHighContrast();
        initReduceMotion();
        initFontSizeToggle();
      }, 100);
    });
  } else {
    setTimeout(() => {
      initLowLightMode();
      initHighContrast();
      initReduceMotion();
      initFontSizeToggle();
    }, 100);
  }
})();
