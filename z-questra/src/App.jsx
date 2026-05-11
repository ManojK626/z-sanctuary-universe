import React, { useEffect, useState } from 'react';
import ComfortBar from './components/ComfortBar.jsx';
import LocalNotebookPanel from './components/LocalNotebookPanel.jsx';
import ZPlayGardenPanel from './components/ZPlayGardenPanel.jsx';
import ZZebrasFamilyPanel from './components/ZZebrasFamilyPanel.jsx';
import GradientTitle from './components/GradientTitle.jsx';
import PanelFrame from './components/PanelFrame.jsx';
import VisualStructurePanel from './components/VisualStructurePanel.jsx';
import ZMusicPanel from './components/ZMusicPanel.jsx';
import { normalizeComfortPrefs, comfortClassNames } from './theme/accessibilityPrefs.js';
import { AGE_MODES, applyCssVars, buildCssVariableMap, SEMANTIC_ACCENTS } from './theme/themeTokens.js';
import { clearShellPrefs, readShellPrefs, writeShellPrefs } from './storage/shellPrefs.js';

const FOCUS_PRIMARY_PANEL = 'zuno-guide';

function PanelFocusWrap({ panelId, focusMode, children }) {
  const dim = focusMode && panelId !== FOCUS_PRIMARY_PANEL;
  return (
    <div
      className={dim ? 'zq-focus-dim' : undefined}
      aria-hidden={dim ? true : undefined}
      style={dim ? { pointerEvents: 'none' } : undefined}
    >
      {children}
    </div>
  );
}

export default function App() {
  const stored = typeof localStorage !== 'undefined' ? readShellPrefs() : null;
  const storedOk = stored?.remember === true && stored?.ageMode && AGE_MODES.includes(stored.ageMode);

  const [rememberLocal, setRememberLocal] = useState(storedOk);
  const [ageMode, setAgeMode] = useState(storedOk ? stored.ageMode : 'adults');
  const [comfort, setComfort] = useState(() =>
    normalizeComfortPrefs(storedOk && stored.comfort && typeof stored.comfort === 'object' ? stored.comfort : {}),
  );
  const [notebookMeta, setNotebookMeta] = useState({
    pageCount: 1,
    highlightTones: [],
    firstPageTitle: 'Page 1',
  });

  useEffect(() => {
    const root = document.documentElement;
    const shellHue = SEMANTIC_ACCENTS.guardian.hue;
    const map = buildCssVariableMap(ageMode, comfort, shellHue);
    applyCssVars(root, map);
    root.dataset.zqBrightness = comfort.brightness;
    root.dataset.zqMotion = comfort.motion;

    const cls = ['zq-root', comfortClassNames(comfort), `zq-age-${ageMode}`].filter(Boolean).join(' ');
    document.body.className = cls;
  }, [ageMode, comfort]);

  useEffect(() => {
    if (!rememberLocal) return;
    writeShellPrefs({ remember: true, ageMode, comfort });
  }, [rememberLocal, ageMode, comfort]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const applyOs = () => {
      document.documentElement.dataset.zqOsReducedMotion = mq.matches ? '1' : '0';
    };
    applyOs();
    mq.addEventListener('change', applyOs);
    return () => mq.removeEventListener('change', applyOs);
  }, []);

  const focusMode = comfort.panelView === 'focus';

  function onRememberChange(e) {
    const checked = e.target.checked;
    setRememberLocal(checked);
    if (checked) {
      writeShellPrefs({ remember: true, ageMode, comfort });
    } else {
      clearShellPrefs();
    }
  }

  return (
    <div className="zq-shell">
      <header style={{ marginBottom: '1rem' }}>
        <GradientTitle as="h1" variant="platform" style={{ margin: '0 0 0.35rem', fontSize: '1.45rem' }}>
          Z-QUESTRA
        </GradientTitle>
        <p className="zq-shell-lead">
          Living color workstation — Phase <strong>2.5 PlayGarden</strong> (kaleidoscope + receipt) · 2.4 Notebook · 2.3B
          Zebras · <strong>2.7 Z-SME Audio</strong> (opt-in playback) · local only · no external bridge
        </p>
        <p className="zq-platform-chips" aria-label="Major zones">
          <span className="zq-chip zq-chip--guide">Zuno Guide</span>
          <span className="zq-chip zq-chip--learn">Learning Cards</span>
          <span className="zq-chip zq-chip--guardian">Guardian Mode</span>
          <span className="zq-chip zq-chip--routes">Sanctuary Route Map</span>
          <span className="zq-chip zq-chip--zebra">Z-Zebras Family</span>
          <span className="zq-chip zq-chip--notes">Notes</span>
          <span className="zq-chip zq-chip--playgarden">PlayGarden</span>
          <span className="zq-chip zq-chip--music">Music (SME)</span>
        </p>
      </header>

      <div className="zq-zuno-note" role="status">
        <strong>Zuno-style guide:</strong> Z-QUESTRA is running in{' '}
        <strong className="zq-guardian-words">local Guardian mode</strong>. No external Z-Sanctuary bridge is active in
        this phase. Route metadata is frontend-only for future alignment.
      </div>

      <div className="zq-age-toolbar" role="toolbar" aria-label="Age or workspace theme">
        <span>Age / mode:</span>
        {AGE_MODES.map((m) => (
          <button
            key={m}
            type="button"
            className="zq-btn-age"
            aria-pressed={ageMode === m}
            onClick={() => setAgeMode(m)}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <label className="zq-remember-local">
        <input type="checkbox" checked={rememberLocal} onChange={onRememberChange} />
        <span>
          Remember theme and Comfort bar on <strong>this device only</strong> (browser localStorage). Uncheck to clear.
          No Z-Sanctuary sync.
        </span>
      </label>

      <section className="zq-toolset-comfort-zone" aria-labelledby="zq-toolset-comfort-h">
        <h2 id="zq-toolset-comfort-h" className="zq-toolset-comfort-title">
          Z Toolset Comfort Zone
        </h2>
        <ComfortBar prefs={comfort} onChange={setComfort} />
        <ZMusicPanel ageMode={ageMode} />
        <LocalNotebookPanel onNotebookMetaChange={setNotebookMeta} />
        <ZPlayGardenPanel notebookMeta={notebookMeta} comfort={comfort} ageMode={ageMode} />
        <ZZebrasFamilyPanel />
      </section>

      <div className="zq-grid-panels">
        <PanelFocusWrap panelId="zuno-guide" focusMode={focusMode}>
          <PanelFrame
            panelId="zuno-guide"
            title="Local guidance lane"
            highlight="Ground answers in what you can verify locally — no hub calls in this build."
          >
            <p style={{ marginTop: 0 }}>
              This panel uses Sanctuary-style labels (Observe) while staying disconnected from Z-Sanctuary runtime.
            </p>
          </PanelFrame>
        </PanelFocusWrap>
        <PanelFocusWrap panelId="learning-cards" focusMode={focusMode}>
          <PanelFrame
            panelId="learning-cards"
            title="Learning cards"
            highlight="Education-oriented layout: clearer sections and calm motion defaults."
          >
            <p style={{ marginTop: 0 }}>Cards and pathways stay local until a bridge is explicitly chartered.</p>
          </PanelFrame>
        </PanelFocusWrap>
      </div>

      <PanelFocusWrap panelId="workstation-shell" focusMode={focusMode}>
        <div style={{ marginTop: '1rem' }}>
          <PanelFrame
            panelId="workstation-shell"
            title="Workstation blueprint"
            highlight="Enterprise and Adults modes tighten density; Kids increases warmth and type scale."
            defaultCollapsed
          >
            <p style={{ marginTop: 0 }}>
              Panel identity metadata lives in <code>sanctuaryRouteMap.js</code> — names only, no network.
            </p>
          </PanelFrame>
        </div>
      </PanelFocusWrap>

      <PanelFocusWrap panelId="visual-structure" focusMode={focusMode}>
        <div style={{ marginTop: '1rem' }}>
          <PanelFrame
            panelId="visual-structure"
            title="Visual Structure View"
            highlight="Map meaning locally before action — sample flow below; not AI-generated."
          >
            <VisualStructurePanel />
          </PanelFrame>
        </div>
      </PanelFocusWrap>
    </div>
  );
}
