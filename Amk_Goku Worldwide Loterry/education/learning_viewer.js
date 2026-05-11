// Z: Amk_Goku Worldwide Loterry\education\learning_viewer.js
// Learning Viewer (read-only modal)
(function () {
  const ID = 'zLearningViewer';

  function ensure() {
    if (document.getElementById(ID)) return;
    const wrap = document.createElement('div');
    wrap.id = ID;
    wrap.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(10,12,18,0.7);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      color: #e6e8ee;
    `;
    wrap.innerHTML = `
      <div style="
        width:min(520px,92%);
        background:#141925;
        border-radius:16px;
        padding:18px 20px;
        border:1px solid rgba(255,255,255,.12)
      ">
        <div id="zLearningTitle" style="font-weight:600; margin-bottom:8px;"></div>
        <div id="zLearningBody" style="opacity:.9; font-size:13px; line-height:1.5;"></div>
        <div id="zLearningPrompt" style="margin-top:10px; font-size:12px; opacity:.7;"></div>
        <div style="text-align:right; margin-top:12px;">
          <button id="zLearningClose"
            style="background:#2a2e3a;color:#e6e8ee;border:0;padding:6px 10px;border-radius:8px;cursor:pointer;">
            Close
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);
    document.getElementById('zLearningClose').onclick = () => hide();
  }

  function show(card) {
    if (!card) return;
    ensure();
    const wrap = document.getElementById(ID);
    const title = document.getElementById('zLearningTitle');
    const body = document.getElementById('zLearningBody');
    const prompt = document.getElementById('zLearningPrompt');
    if (!wrap || !title || !body || !prompt) return;
    title.textContent = card.title || 'Learning';
    body.textContent = card.body || card.summary || '';
    prompt.textContent = card.reflection_prompt ? `Reflection: ${card.reflection_prompt}` : '';
    wrap.style.display = 'flex';
  }

  function hide() {
    const wrap = document.getElementById(ID);
    if (wrap) wrap.style.display = 'none';
  }

  window.ZLearningViewer = { open: show, close: hide };
  window.openLearningCard = async function (id) {
    if (!window.ZLearningRegistryLoad) return;
    await window.ZLearningRegistryLoad();
    const card = window.ZLearningRegistryGet?.(id) || window.ZLearningRegistry?.[id];
    window.ZLearningViewer.open(card);
  };
})();
