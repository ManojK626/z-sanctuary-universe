// Z: Amk_Goku Worldwide Loterry\ui\z_teacher_panel.js
// Z-Teacher Panel (reflection UI)
(function () {
  const ID = 'zTeacherPanel';

  function create() {
    if (document.getElementById(ID)) return;

    const wrap = document.createElement('div');
    wrap.id = ID;
    wrap.style.cssText = [
      'position: fixed',
      'inset: 0',
      'background: rgba(10,12,18,0.7)',
      'display: none',
      'align-items: center',
      'justify-content: center',
      'z-index: 10000',
      'font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      'color: #e6e8ee',
    ].join(';');

    const card = window.ZTeacherCards ? window.ZTeacherCards.pick() : null;
    const cardHtml = card
      ? `
      <div style="background:#0f1219; border-radius:12px; padding:12px; margin:12px 0; font-size:13px;">
        <strong>${card.title}</strong><br>
        ${card.text}
      </div>
    `
      : '';

    wrap.innerHTML = `
      <div style="
        width:min(560px,92%); background:#141925; border-radius:16px;
        padding:18px 20px; border:1px solid rgba(255,255,255,.12)
      ">
        <h3 style="margin:0 0 8px;">Z-Teacher — Reflection Pause</h3>
        <p style="opacity:.85; font-size:13px;">
          ${(window.ZTeacher && window.ZTeacher.reason()) || 'Let’s pause and reflect.'}
        </p>

        ${cardHtml}

        <label style="display:flex; gap:8px; font-size:13px; margin:10px 0;">
          <input id="zTeacherAck" type="checkbox" />
          I understand the boundary and will proceed respectfully.
        </label>

        <div style="display:flex; gap:8px; justify-content:flex-end;">
          <button id="zTeacherContinue" disabled
            style="padding:6px 12px; border-radius:10px; border:0;
                   background:#2b7cff; color:#fff; cursor:pointer;">
            Continue
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(wrap);

    const ack = wrap.querySelector('#zTeacherAck');
    const btn = wrap.querySelector('#zTeacherContinue');

    ack.addEventListener('change', () => {
      btn.disabled = !ack.checked;
      btn.style.opacity = ack.checked ? '1' : '0.6';
    });

    btn.addEventListener('click', () => {
      window.ZTeacher.clearCooldown();
      hide();
    });
  }

  function show() {
    const el = document.getElementById(ID);
    if (el) el.style.display = 'flex';
  }

  function hide() {
    const el = document.getElementById(ID);
    if (el) el.style.display = 'none';
  }

  document.addEventListener('zteacher:cooldown', show);
  document.addEventListener('zteacher:restored', hide);

  document.addEventListener('DOMContentLoaded', create);
  document.addEventListener('DOMContentLoaded', () => {
    if (window.ZTeacher && window.ZTeacher.inCooldown()) show();
  });
})();
