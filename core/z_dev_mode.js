// Z: core\z_dev_mode.js
// Development Mode helper (development-only)
// WARNING: This is NOT secure. It provides a simple gate for local testing only.

(() => {
  const devToggle = document.getElementById('devToggle');
  const devControls = document.getElementById('devControls');
  const devLogin = document.getElementById('devLogin');
  const devPass = document.getElementById('devPass');
  const devLoginBtn = document.getElementById('devLoginBtn');
  const devCancelBtn = document.getElementById('devCancelBtn');
  const devMsg = document.getElementById('devMsg');
  const startBtn = document.getElementById('startRecordBtn');
  const stopBtn = document.getElementById('stopRecordBtn');
  const quietOnBtn = document.getElementById('quietModeOnBtn');
  const quietOffBtn = document.getElementById('quietModeOffBtn');
  const quietAutoBtn = document.getElementById('quietModeAutoBtn');

  // Precomputed SHA-256 of the development passphrase (example: "zuno-dev")
  // To generate locally: in browser console:
  //   await (async s=>{const enc=new TextEncoder();const h=await crypto.subtle.digest('SHA-256',enc.encode(s));return Array.from(new Uint8Array(h)).map(b=>b.toString(16).padStart(2,'0')).join('')})('zuno-dev')
  const DEV_PASSPHRASE_HASH = '7bf3d4e6a6d153f19b6f3b199b2b6b2f0d529e1f6eb2cf1c7c7f3e6a8b9c0d4a';

  const toHex = (buffer) =>
    Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

  async function verifyPass(plain) {
    try {
      const enc = new TextEncoder();
      const hashBuf = await crypto.subtle.digest('SHA-256', enc.encode(plain));
      const hex = toHex(hashBuf);
      return hex === DEV_PASSPHRASE_HASH;
    } catch (e) {
      console.error('Dev mode crypto not available', e);
      return false;
    }
  }

  function showLogin() {
    devLogin.style.display = 'block';
    devPass.value = '';
    devMsg.style.display = 'none';
  }

  function hideLogin() {
    devLogin.style.display = 'none';
    devMsg.style.display = 'none';
  }

  devToggle.addEventListener('click', () => {
    // open login modal
    showLogin();
  });

  devLoginBtn.addEventListener('click', async () => {
    const val = devPass.value || '';
    devMsg.style.display = 'none';
    const ok = await verifyPass(val);
    if (ok) {
      devControls.style.display = 'block';
      hideLogin();
      if (window.ZStatusConsole && typeof window.ZStatusConsole.log === 'function') {
        window.ZStatusConsole.log('[SECURITY] Developer mode unlocked', 'status');
      } else {
        console.log('Developer mode unlocked');
      }
    } else {
      devMsg.textContent = 'Invalid passphrase (development only)';
      devMsg.style.display = 'block';
    }
  });

  devCancelBtn.addEventListener('click', () => {
    hideLogin();
  });

  // Wire control buttons to ZChronicle if available
  startBtn.addEventListener('click', () => {
    if (window.ZChronicle && typeof window.ZChronicle.startRecord === 'function') {
      window.ZChronicle.startRecord();
      if (window.ZStatusConsole)
        window.ZStatusConsole.log('[ON] Recording started (dev)', 'active');
    } else {
      alert('ZChronicle not available');
    }
  });

  stopBtn.addEventListener('click', () => {
    if (window.ZChronicle && typeof window.ZChronicle.stopRecord === 'function') {
      window.ZChronicle.stopRecord();
      if (window.ZStatusConsole)
        window.ZStatusConsole.log('[OFF] Recording stopped (dev)', 'status');
    } else {
      alert('ZChronicle not available');
    }
  });

  if (quietOnBtn && quietOffBtn && quietAutoBtn) {
    quietOnBtn.addEventListener('click', () => {
      window.ZQuietModeChip?.setOverride?.('on');
      if (window.ZStatusConsole)
        window.ZStatusConsole.log('[DEV] Quiet mode override: ON', 'status');
    });

    quietOffBtn.addEventListener('click', () => {
      window.ZQuietModeChip?.setOverride?.('off');
      if (window.ZStatusConsole)
        window.ZStatusConsole.log('[DEV] Quiet mode override: OFF', 'status');
    });

    quietAutoBtn.addEventListener('click', () => {
      window.ZQuietModeChip?.setOverride?.();
      if (window.ZStatusConsole)
        window.ZStatusConsole.log('[DEV] Quiet mode override: AUTO', 'status');
    });
  }

  // Optional: keyboard shortcut Ctrl+Shift+D to open login
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') showLogin();
  });
})();
