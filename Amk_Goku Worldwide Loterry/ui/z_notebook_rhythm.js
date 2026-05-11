// Z: Amk_Goku Worldwide Loterry\ui\z_notebook_rhythm.js
// Z-Notebook Rhythm prompts (observer-only)

(function () {
  let shown = false;
  const STATUS_PATH = 'data/reports/system_status.json';

  function promptFor(state) {
    switch (state) {
      case 'CALM':
        return 'What are you noticing that’s working well?';
      case 'ADAPTIVE':
        return 'Small adjustments are happening. What feels worth refining—without urgency?';
      case 'REGENERATION':
        return 'The system is restoring balance. What can wait, and what deserves patience?';
      default:
        return null;
    }
  }

  async function getRhythm() {
    try {
      const res = await fetch(STATUS_PATH, { cache: 'no-store' });
      const s = await res.json();
      return s.rhythm_state || 'CALM';
    } catch {
      return 'CALM';
    }
  }

  function showPrompt(text) {
    if (!text || shown) return;
    shown = true;

    const el = document.createElement('div');
    el.style.cssText = `
      position: fixed;
      bottom: 64px;
      right: 14px;
      max-width: 320px;
      padding: 10px 12px;
      background: rgba(20,20,28,0.9);
      color: #e6e8ee;
      font-family: system-ui, sans-serif;
      font-size: 12px;
      border-radius: 10px;
      box-shadow: 0 6px 18px rgba(0,0,0,0.25);
      z-index: 9999;
    `;
    el.textContent = text;

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 12000);
  }

  async function onNotebookOpen() {
    const state = await getRhythm();
    const text = promptFor(state);
    showPrompt(text);

    if (window.ZChronicle?.record) {
      window.ZChronicle.record({
        source: 'z_notebooks',
        type: 'rhythm_prompt',
        state,
      });
    }
  }

  window.ZNotebookRhythm = { onNotebookOpen };
})();
