// Z: core\z_status_console.js
/**
 * Z-Status Console
 * Primary interface for Sanctuary system status and logging
 */

const ZStatusConsole = (() => {
  let consoleElement = null;

  const ensureConsole = () => {
    if (!consoleElement) {
      consoleElement = document.getElementById('zConsole');
    }
    return !!consoleElement;
  };

  const log = (message, type = 'status') => {
    const timestamp = new Date().toLocaleTimeString();
    const p = document.createElement('p');
    p.className = `z-${type}`;
    p.innerHTML = `<span class="z-timestamp">[${timestamp}]</span> ${message}`;

    if (ensureConsole()) {
      consoleElement.appendChild(p);
      // Auto-scroll to bottom
      consoleElement.scrollTop = consoleElement.scrollHeight;
    }

    // Feed event to ZAwareness (browser)
    if (window.ZAwareness && typeof window.ZAwareness.saveEvent === 'function') {
      window.ZAwareness.saveEvent({
        time: new Date().toISOString(),
        message,
        type,
        mood:
          type === 'active'
            ? 'joy'
            : type === 'warning'
              ? 'focused'
              : type === 'error'
                ? 'sorrow'
                : 'neutral',
      });
    }

    console.log(`[${type.toUpperCase()}] ${message}`);
  };

  const init = () => {
    consoleElement = document.getElementById('zConsole');
    log('[OK] Z-Sanctuary Universe initializing...', 'active');
    log('[STATUS] Status Console online', 'status');
    log('[SETTINGS] Loading core modules...', 'status');
  };

  return {
    log,
    init,
  };
})();

window.ZStatusConsole = ZStatusConsole;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  ZStatusConsole.init();
});
