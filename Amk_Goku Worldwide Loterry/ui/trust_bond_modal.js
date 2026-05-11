// Z: Amk_Goku Worldwide Loterry\ui\trust_bond_modal.js
// Trust Bond Modal (UI only)
(function () {
  const MODAL_ID = 'zTrustBondModal';

  function createModal() {
    if (document.getElementById(MODAL_ID)) return;

    const wrap = document.createElement('div');
    wrap.id = MODAL_ID;
    wrap.style.cssText = [
      'position: fixed',
      'inset: 0',
      'background: rgba(10,12,18,0.75)',
      'display: flex',
      'align-items: center',
      'justify-content: center',
      'z-index: 9999',
    ].join(';');

    wrap.innerHTML = `
      <div style="
        width: min(520px, 92%);
        background: #141925;
        color: #e6e8ee;
        border-radius: 14px;
        padding: 18px 20px;
        border: 1px solid rgba(255,255,255,0.12);
        font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      ">
        <h3 style="margin:0 0 8px;">Trust Bond Required</h3>
        <p style="opacity:.85; font-size:13px;">
          This area is protected. Please acknowledge the Trust Bond to proceed.
        </p>

        <div style="background:#0f1219; padding:10px; border-radius:10px; font-size:12px; opacity:.9;">
          Respect authorship • No misuse • Auditable access
        </div>

        <label style="display:flex; gap:8px; margin:12px 0; font-size:13px;">
          <input id="zTrustBondCheck" type="checkbox" />
          I acknowledge and accept the Trust Bond
        </label>

        <div style="display:flex; gap:8px; justify-content:flex-end;">
          <button id="zTrustBondEnter" disabled
            style="padding:6px 10px; border-radius:8px; border:0;
                   background:#2b7cff; color:#fff; cursor:pointer;">
            Enter
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(wrap);

    const check = wrap.querySelector('#zTrustBondCheck');
    const enter = wrap.querySelector('#zTrustBondEnter');

    check.addEventListener('change', () => {
      enter.disabled = !check.checked;
      enter.style.opacity = check.checked ? '1' : '0.6';
    });

    enter.addEventListener('click', () => {
      window.ZTrustBond.accept('verified');
      destroy();
    });
  }

  function destroy() {
    const el = document.getElementById(MODAL_ID);
    if (el) el.remove();
  }

  function guard() {
    const isPublic =
      document.body && document.body.dataset && document.body.dataset.public === 'true';
    if (isPublic) return;
    if (!window.ZTrustBond || !window.ZTrustBond.accepted()) {
      createModal();
    }
  }

  window.ZTrustBondModal = { guard };
})();
