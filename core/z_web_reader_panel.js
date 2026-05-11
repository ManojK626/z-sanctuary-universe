/**
 * Z Web Reader Panel
 * Complete reading tool set with voice, speed, language, and style controls
 * Applied to all large data panels: Chronicle, Mirror, Awareness, Insight
 * Uses Z-color styles throughout
 */

(function initWebReaderPanel() {
  'use strict';

  // Create comprehensive Web Reader Panel HTML
  const webReaderHTML = `
    <div id="zWebReaderPanel" class="z-panel" data-title="Z Web Reader" style="left: 20px; top: 500px; width: 600px; height: 450px; display: none; z-index: 10000; overflow: hidden; background: rgba(10,14,39,0.98);">
      <h3 style="color: var(--z-harmony); margin: 0 0 0.5rem 0">Z Web Reader - Full Reading Suite</h3>

      <!-- PRIMARY READING CONTROLS ROW -->
      <div style="display: flex; gap: 0.6rem; margin-bottom: 0.8rem; flex-wrap: wrap; padding: 0.6rem; background: rgba(0,212,255,0.08); border: 1px solid rgba(0,212,255,0.2); border-radius: 4px;">
        <button id="zWebReaderVoiceToggle" class="z-button z-button-subtle" style="padding: 0.4rem 0.8rem; font-size: 0.8em; background: rgba(0,255,200,0.15); border: 1px solid rgba(0,255,200,0.3)">🎤 Voice On</button>

        <button id="zWebReaderReadBtn" class="z-button z-button-subtle" style="padding: 0.4rem 0.8rem; font-size: 0.8em; background: rgba(100,150,255,0.15); border: 1px solid rgba(100,150,255,0.3)">📖 Read Page</button>

        <button id="zWebReaderReadSelectionBtn" class="z-button z-button-subtle" style="padding: 0.4rem 0.8rem; font-size: 0.8em; background: rgba(150,200,255,0.15); border: 1px solid rgba(150,200,255,0.3)">📌 Read Selection</button>

        <button id="zWebReaderStopBtn" class="z-button z-button-subtle" style="padding: 0.4rem 0.8rem; font-size: 0.8em; background: rgba(255,100,100,0.15); border: 1px solid rgba(255,100,100,0.3); display: none">⏹ Stop</button>

        <button id="zWebReaderPauseBtn" class="z-button z-button-subtle" style="padding: 0.4rem 0.8rem; font-size: 0.8em; background: rgba(255,150,100,0.15); border: 1px solid rgba(255,150,100,0.3); display: none">⏸ Pause</button>
      </div>

      <!-- SECONDARY CONTROLS ROW -->
      <div style="display: flex; gap: 0.6rem; margin-bottom: 0.8rem; flex-wrap: wrap; padding: 0.6rem; background: rgba(0,212,255,0.08); border: 1px solid rgba(0,212,255,0.2); border-radius: 4px;">

        <label style="display: flex; align-items: center; gap: 0.3rem; color: var(--z-light); font-size: 0.8em;">
          <span style="color: var(--z-accent)">Translate:</span>
          <span id="zTranslateStatus" style="color: var(--z-harmony)">Idle</span>
        </label>

        <label style="display: flex; align-items: center; gap: 0.3rem; color: var(--z-light); font-size: 0.8em;">
          Speed:
          <select id="zWebReaderSpeed" class="z-input" style="padding: 0.3rem 0.4rem; font-size: 0.8em; width: 60px; background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.3); color: var(--z-light);">
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1" selected>1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </label>

        <label style="display: flex; align-items: center; gap: 0.3rem; color: var(--z-light); font-size: 0.8em; margin-left: auto;">
          Style:
          <select id="zWebReaderTextStyle" class="z-input" style="padding: 0.3rem 0.4rem; font-size: 0.8em; width: 100px; background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.3); color: var(--z-light);">
            <option value="normal" selected>Normal</option>
            <option value="enhanced">Enhanced</option>
            <option value="minimal">Minimal</option>
            <option value="journal">Journal</option>
          </select>
        </label>

        <label style="display: flex; align-items: center; gap: 0.3rem; color: var(--z-light); font-size: 0.8em;">
          Lang:
          <select id="zWebReaderLanguage" class="z-input" style="padding: 0.3rem 0.4rem; font-size: 0.8em; width: 100px; background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.3); color: var(--z-light);">
            <option value="en-US" selected>English</option>
            <option value="es-ES">Español</option>
            <option value="fr-FR">Français</option>
            <option value="de-DE">Deutsch</option>
            <option value="ja-JP">日本語</option>
          </select>
        </label>
      </div>

      <!-- DISPLAY OPTIONS ROW -->
      <div style="display: flex; gap: 0.6rem; margin-bottom: 0.8rem; flex-wrap: wrap; padding: 0.6rem; background: rgba(0,212,255,0.08); border: 1px solid rgba(0,212,255,0.2); border-radius: 4px;">
        <label style="display: flex; align-items: center; gap: 0.3rem; color: var(--z-light); font-size: 0.8em; cursor: pointer;">
          <input id="zWebReaderDarkMode" type="checkbox" checked style="cursor: pointer;" /> 🌙 Dark
        </label>
        <label style="display: flex; align-items: center; gap: 0.3rem; color: var(--z-light); font-size: 0.8em; cursor: pointer;">
          <input id="zWebReaderHighContrast" type="checkbox" style="cursor: pointer;" /> ⚡ Contrast
        </label>
        <label style="display: flex; align-items: center; gap: 0.3rem; color: var(--z-light); font-size: 0.8em; cursor: pointer;">
          <input id="zWebReaderLineSpacing" type="checkbox" style="cursor: pointer;" /> 📏 Spacing
        </label>
        <label style="display: flex; align-items: center; gap: 0.3rem; color: var(--z-light); font-size: 0.8em; cursor: pointer;">
          <input id="zWebReaderFocusMode" type="checkbox" style="cursor: pointer;" /> 🎯 Focus
        </label>

        <label style="display: flex; align-items: center; gap: 0.3rem; color: var(--z-light); font-size: 0.8em; margin-left: auto;">
          Font:
          <select id="zWebReaderFontSize" class="z-input" style="padding: 0.3rem 0.4rem; font-size: 0.8em; width: 70px; background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.3); color: var(--z-light);">
            <option value="13">13px</option>
            <option value="14">14px</option>
            <option value="16" selected>16px</option>
            <option value="18">18px</option>
            <option value="20">20px</option>
            <option value="24">24px</option>
          </select>
        </label>
      </div>

      <!-- URL/CONTENT INPUT -->
      <div style="display: flex; gap: 0.4rem; margin-bottom: 0.6rem;">
        <input id="zWebReaderUrl" class="z-input" type="text" placeholder="Enter URL or paste HTML content..." style="flex: 1; padding: 0.4rem; font-size: 0.8em; background: rgba(0,212,255,0.05); border: 1px solid rgba(0,212,255,0.2); color: var(--z-light);" />
        <button id="zWebReaderLoadBtn" class="z-button" style="padding: 0.3rem 0.8rem; font-size: 0.8em; white-space: nowrap; background: rgba(0,212,255,0.15); border: 1px solid rgba(0,212,255,0.3);">Load</button>
      </div>

      <!-- CONTENT DISPLAY AREA -->
      <div id="zWebReaderContent" style="
        flex: 1;
        background: #0a0e27;
        border: 1px solid rgba(0,212,255,0.2);
        border-radius: 4px;
        padding: 1.2rem;
        overflow-y: auto;
        font-size: 16px;
        line-height: 1.6;
        color: var(--z-light);
        max-height: 250px;
        font-family: 'Segoe UI', 'Exo 2', system-ui, sans-serif;
      ">
        <div style="color: var(--z-muted); text-align: center; padding: 2rem;">
          Ready to read. Enter URL or paste content above.
        </div>
      </div>

      <!-- STATUS BAR -->
      <div id="zWebReaderStatus" style="margin-top: 0.5rem; font-size: 0.75em; color: var(--z-accent); padding: 0.4rem; background: rgba(0,212,255,0.05); border-radius: 3px;">
        Status: Ready
      </div>
    </div>
  `;

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    // Insert panel into page
    const bodyTag = document.querySelector('body');
    if (bodyTag && !document.getElementById('zWebReaderPanel')) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = webReaderHTML;
      bodyTag.appendChild(tempDiv.firstElementChild);
    }

    // Setup event listeners
    setupWebReaderControls();

    // Apply reading controls to all large data panels
    applyReadingControlsToDataPanels();
  });

  function setupWebReaderControls() {
    const readBtn = document.getElementById('zWebReaderReadBtn');
    const readSelBtn = document.getElementById('zWebReaderReadSelectionBtn');
    const stopBtn = document.getElementById('zWebReaderStopBtn');
    const pauseBtn = document.getElementById('zWebReaderPauseBtn');
    const voiceToggle = document.getElementById('zWebReaderVoiceToggle');
    const loadBtn = document.getElementById('zWebReaderLoadBtn');
    const urlInput = document.getElementById('zWebReaderUrl');
    const contentDiv = document.getElementById('zWebReaderContent');
    const statusDiv = document.getElementById('zWebReaderStatus');
    const fontSizeSelect = document.getElementById('zWebReaderFontSize');
    const darkModeCheckbox = document.getElementById('zWebReaderDarkMode');
    const highContrastCheckbox = document.getElementById('zWebReaderHighContrast');
    const lineSpacingCheckbox = document.getElementById('zWebReaderLineSpacing');
    const focusModeCheckbox = document.getElementById('zWebReaderFocusMode');
    const speedSelect = document.getElementById('zWebReaderSpeed');
    const styleSelect = document.getElementById('zWebReaderTextStyle');

    const TEXT_STYLE_PRESETS = {
      normal: {
        fontFamily: '\'Segoe UI\', \'Exo 2\', system-ui, sans-serif',
        letterSpacing: 'normal',
        fontWeight: '400',
        fontStyle: 'normal',
      },
      enhanced: {
        fontFamily: '\'Georgia\', \'Palatino Linotype\', \'Book Antiqua\', serif',
        letterSpacing: '0.03em',
        fontWeight: '400',
        fontStyle: 'normal',
      },
      minimal: {
        fontFamily: 'system-ui, -apple-system, \'Segoe UI\', sans-serif',
        letterSpacing: 'normal',
        fontWeight: '400',
        fontStyle: 'normal',
      },
      journal: {
        fontFamily: '\'Georgia\', \'Times New Roman\', serif',
        letterSpacing: '0.02em',
        fontWeight: '400',
        fontStyle: 'italic',
      },
    };

    function applyReaderTextStyle(key) {
      if (!contentDiv) return;
      const preset = TEXT_STYLE_PRESETS[key] || TEXT_STYLE_PRESETS.normal;
      contentDiv.style.fontFamily = preset.fontFamily;
      contentDiv.style.letterSpacing = preset.letterSpacing;
      contentDiv.style.fontWeight = preset.fontWeight;
      contentDiv.style.fontStyle = preset.fontStyle;
    }

    applyReaderTextStyle(styleSelect?.value || 'normal');

    let isReading = false;
    let voiceEnabled = true;
    let currentUtterance = null;

    // Voice toggle
    voiceToggle?.addEventListener('click', () => {
      voiceEnabled = !voiceEnabled;
      voiceToggle.style.background = voiceEnabled
        ? 'rgba(0,255,200,0.15)'
        : 'rgba(100,100,100,0.15)';
      voiceToggle.textContent = voiceEnabled ? '🎤 Voice On' : '🔇 Voice Off';
      statusDiv.textContent = `Status: Voice ${voiceEnabled ? 'enabled' : 'disabled'}`;
    });

    // Load URL or content
    loadBtn?.addEventListener('click', async () => {
      const urlOrContent = urlInput?.value || '';
      if (!urlOrContent) {
        statusDiv.textContent = 'Status: Enter URL or content';
        return;
      }

      statusDiv.textContent = 'Status: Loading...';
      try {
        let content = '';

        if (urlOrContent.startsWith('http://') || urlOrContent.startsWith('https://')) {
          const response = await fetch(urlOrContent);
          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          content = doc.body.innerText;
        } else {
          content = urlOrContent;
        }

        contentDiv.innerHTML = `<p>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;').substring(0, 3000)}</p>`;
        applyReaderTextStyle(styleSelect?.value || 'normal');
        const wordCount = content.split(/\s+/).length;
        statusDiv.textContent = `Status: Loaded. Words: ${wordCount}`;
      } catch (err) {
        statusDiv.textContent = `Status: Error - ${err.message}`;
        contentDiv.innerHTML = `<p style="color: var(--z-error);">Error: ${err.message}</p>`;
      }
    });

    // Font size
    fontSizeSelect?.addEventListener('change', (e) => {
      const fontSize = e.target.value;
      if (contentDiv) contentDiv.style.fontSize = fontSize + 'px';
    });

    // Text style (typography preset)
    styleSelect?.addEventListener('change', (e) => {
      applyReaderTextStyle(e.target.value);
    });

    // Dark mode
    darkModeCheckbox?.addEventListener('change', (e) => {
      if (contentDiv) {
        contentDiv.style.background = e.target.checked ? '#0a0e27' : '#f5f5f5';
        contentDiv.style.color = e.target.checked ? 'var(--z-light)' : '#333';
      }
    });

    // High contrast
    highContrastCheckbox?.addEventListener('change', (e) => {
      if (contentDiv) {
        if (e.target.checked) {
          contentDiv.style.background = '#000';
          contentDiv.style.color = '#ffff00';
          contentDiv.style.fontWeight = 'bold';
        } else {
          contentDiv.style.background = '#0a0e27';
          contentDiv.style.color = 'var(--z-light)';
          contentDiv.style.fontWeight = 'normal';
        }
      }
    });

    // Line spacing
    lineSpacingCheckbox?.addEventListener('change', (e) => {
      if (contentDiv) {
        contentDiv.style.lineHeight = e.target.checked ? '2' : '1.6';
      }
    });

    // Focus mode
    focusModeCheckbox?.addEventListener('change', (e) => {
      if (contentDiv) {
        contentDiv.style.opacity = e.target.checked ? '0.8' : '1';
        contentDiv.style.filter = e.target.checked ? 'blur(0.3px)' : 'none';
      }
    });

    // Read Page
    readBtn?.addEventListener('click', () => {
      if (!voiceEnabled || typeof window.speechSynthesis === 'undefined') {
        statusDiv.textContent = 'Status: Speech synthesis unavailable or voice disabled';
        return;
      }

      const text = contentDiv?.innerText || '';
      if (!text) {
        statusDiv.textContent = 'Status: No content to read';
        return;
      }

      if (isReading) {
        window.speechSynthesis.cancel();
        isReading = false;
        readBtn.style.display = 'block';
        stopBtn.style.display = 'none';
        pauseBtn.style.display = 'none';
        statusDiv.textContent = 'Status: Stopped';
        return;
      }

      currentUtterance = new SpeechSynthesisUtterance(text);
      const speed = parseFloat(speedSelect?.value || 1);
      const lang = document.getElementById('zWebReaderLanguage')?.value || 'en-US';

      currentUtterance.rate = speed;
      currentUtterance.lang = lang;

      currentUtterance.onstart = () => {
        isReading = true;
        readBtn.style.display = 'none';
        stopBtn.style.display = 'block';
        pauseBtn.style.display = 'block';
        pauseBtn.textContent = '⏸ Pause';
        statusDiv.textContent = 'Status: Reading aloud...';
      };

      currentUtterance.onend = () => {
        isReading = false;
        readBtn.style.display = 'block';
        stopBtn.style.display = 'none';
        pauseBtn.style.display = 'none';
        statusDiv.textContent = 'Status: Finished';
      };

      window.speechSynthesis.speak(currentUtterance);
    });

    // Read Selection
    readSelBtn?.addEventListener('click', () => {
      if (!voiceEnabled) {
        statusDiv.textContent = 'Status: Voice disabled';
        return;
      }

      const selectedText = window.getSelection().toString();
      if (!selectedText) {
        statusDiv.textContent = 'Status: No text selected';
        return;
      }

      const utterance = new SpeechSynthesisUtterance(selectedText);
      const speed = parseFloat(speedSelect?.value || 1);
      utterance.rate = speed;

      statusDiv.textContent = 'Status: Reading selection...';
      window.speechSynthesis.speak(utterance);
    });

    // Stop
    stopBtn?.addEventListener('click', () => {
      window.speechSynthesis.cancel();
      isReading = false;
      readBtn.style.display = 'block';
      stopBtn.style.display = 'none';
      pauseBtn.style.display = 'none';
      statusDiv.textContent = 'Status: Stopped';
    });

    // Pause/Resume
    pauseBtn?.addEventListener('click', () => {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        pauseBtn.textContent = '⏸ Pause';
        statusDiv.textContent = 'Status: Resumed';
      } else {
        window.speechSynthesis.pause();
        pauseBtn.textContent = '▶ Resume';
        statusDiv.textContent = 'Status: Paused';
      }
    });
  }

  function applyReadingControlsToDataPanels() {
    // This function will apply reading tools to Chronicle, Mirror, Awareness, Insight panels
    // when they're opened
    const panels = ['zChroniclePanel', 'zPublicMirrorPanel', 'zAwarenessPanel', 'zInsightLabPanel'];

    panels.forEach((panelId) => {
      const panel = document.getElementById(panelId);
      if (panel) {
        // Add reading controls toolbar to each panel
        addReadingToolbarToPanel(panelId);
      }
    });
  }

  function addReadingToolbarToPanel(panelId) {
    const panel = document.getElementById(panelId);
    if (!panel) return;

    const existingToolbar = panel.querySelector('[data-reading-toolbar]');
    if (existingToolbar) return; // Already has toolbar

    const toolbar = document.createElement('div');
    toolbar.setAttribute('data-reading-toolbar', 'true');
    toolbar.style.cssText = `
      display: flex;
      gap: 0.4rem;
      padding: 0.4rem;
      margin-bottom: 0.6rem;
      background: rgba(0,212,255,0.08);
      border: 1px solid rgba(0,212,255,0.2);
      border-radius: 4px;
      flex-wrap: wrap;
    `;

    toolbar.innerHTML = `
      <button class="z-button z-button-subtle panel-read-btn" style="padding: 0.3rem 0.6rem; font-size: 0.75em; background: rgba(100,150,255,0.15); border: 1px solid rgba(100,150,255,0.3)">📖 Read</button>
      <button class="z-button z-button-subtle panel-stop-btn" style="padding: 0.3rem 0.6rem; font-size: 0.75em; background: rgba(255,100,100,0.15); border: 1px solid rgba(255,100,100,0.3); display: none">⏹ Stop</button>
      <select class="z-input panel-speed-select" style="padding: 0.2rem 0.3rem; font-size: 0.75em; width: 55px; background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.3); color: var(--z-light);">
        <option value="1" selected>1x</option>
        <option value="0.75">0.75x</option>
        <option value="1.25">1.25x</option>
        <option value="1.5">1.5x</option>
      </select>
      <span style="color: var(--z-light); font-size: 0.75em; margin-left: auto;">Status: Ready</span>
    `;

    const h3 = panel.querySelector('h3');
    if (h3) {
      h3.insertAdjacentElement('afterend', toolbar);
    } else {
      panel.insertBefore(toolbar, panel.firstChild);
    }

    // Setup reading controls for this panel
    setupPanelReadingControls(panelId, toolbar);
  }

  function setupPanelReadingControls(panelId, toolbar) {
    const panel = document.getElementById(panelId);
    if (!panel) return;

    const readBtn = toolbar.querySelector('.panel-read-btn');
    const stopBtn = toolbar.querySelector('.panel-stop-btn');
    const speedSelect = toolbar.querySelector('.panel-speed-select');
    const statusSpan = toolbar.querySelector('span:last-child');

    let isReading = false;

    readBtn?.addEventListener('click', () => {
      const contentDiv =
        panel.querySelector('.feed') || panel.querySelector('div:not([style*="display: flex"])');
      const text = contentDiv?.innerText || panel.innerText;

      if (!text) {
        statusSpan.textContent = 'Status: No content';
        return;
      }

      if (isReading) {
        window.speechSynthesis.cancel();
        isReading = false;
        readBtn.style.display = 'block';
        stopBtn.style.display = 'none';
        statusSpan.textContent = 'Status: Stopped';
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const speed = parseFloat(speedSelect?.value || 1);
      utterance.rate = speed;

      utterance.onstart = () => {
        isReading = true;
        readBtn.style.display = 'none';
        stopBtn.style.display = 'block';
        statusSpan.textContent = 'Status: Reading...';
      };

      utterance.onend = () => {
        isReading = false;
        readBtn.style.display = 'block';
        stopBtn.style.display = 'none';
        statusSpan.textContent = 'Status: Done';
      };

      window.speechSynthesis.speak(utterance);
    });

    stopBtn?.addEventListener('click', () => {
      window.speechSynthesis.cancel();
      isReading = false;
      readBtn.style.display = 'block';
      stopBtn.style.display = 'none';
      statusSpan.textContent = 'Status: Stopped';
    });
  }

  // Expose toggle function
  window.ZWebReader = {
    toggle: (show) => {
      const panel = document.getElementById('zWebReaderPanel');
      if (panel) {
        panel.style.display =
          show !== undefined
            ? show
              ? 'block'
              : 'none'
            : panel.style.display === 'none'
              ? 'block'
              : 'none';
      }
    },
    applyToPanel: (panelId) => {
      addReadingToolbarToPanel(panelId);
    },
  };
})();
