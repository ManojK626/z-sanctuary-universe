// Z: core/z_security_gate.js
// Minimal-access gate for security/protection documentation.
(function () {
  const ACCESS_KEY = 'zSecureAccess';
  const SECURE_SELECTOR = '[data-secure-doc="true"], .z-secure-doc';

  function shouldReveal() {
    try {
      return localStorage.getItem(ACCESS_KEY) === '1';
    } catch (err) {
      return false;
    }
  }

  function applyGate() {
    const reveal = shouldReveal();
    document.querySelectorAll(SECURE_SELECTOR).forEach((node) => {
      if (reveal) {
        node.removeAttribute('aria-hidden');
        node.style.display = '';
      } else {
        node.setAttribute('aria-hidden', 'true');
        node.style.display = 'none';
      }
    });
  }

  window.ZSecurityGate = {
    grant: () => {
      try {
        localStorage.setItem(ACCESS_KEY, '1');
      } catch (err) {
        // ignore
      }
      applyGate();
    },
    revoke: () => {
      try {
        localStorage.setItem(ACCESS_KEY, '0');
      } catch (err) {
        // ignore
      }
      applyGate();
    },
    status: () => (shouldReveal() ? 'granted' : 'minimal'),
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyGate);
  } else {
    applyGate();
  }
})();
