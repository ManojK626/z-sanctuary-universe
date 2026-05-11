// Z: Amk_Goku Worldwide Loterry\exports\lottery_app_pack_20260130T225320Z\ui\z_bootstrap.js
// Z-Sanctuary UI bootstrap (auto-wire shared scripts)
// Use data attributes on the script tag to control modules:
// data-z-root="../" data-z-education="true" data-z-apicon="true" data-z-jailcell="true"

(function () {
  const current = document.currentScript;
  if (!current) {
    return;
  }

  const root = current.dataset.zRoot || './';
  const education = current.dataset.zEducation === 'true';
  const apicon = current.dataset.zApicon === 'true';
  const jailcell = current.dataset.zJailcell === 'true';
  const rhythm = current.dataset.zRhythm === 'true';
  const feeling = current.dataset.zFeeling === 'true';
  const notebook = current.dataset.zNotebook === 'true';

  const base = new URL(root, current.src);

  function resolveUrl(path) {
    return new URL(path, base).toString();
  }

  function loadScript(path) {
    const src = resolveUrl(path);
    if (document.querySelector(`script[data-z-loaded="${src}"]`)) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.dataset.zLoaded = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  }
  function loadStyle(path) {
    const href = resolveUrl(path);
    if (document.querySelector(`link[data-z-loaded="${href}"]`)) {
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.zLoaded = href;
    document.head.appendChild(link);
  }

  const queue = [
    'core/z_trust_bond.js',
    'core/z_teacher.js',
    'education/z_teacher_cards.js',
    'education/learning_registry.js',
    'education/learning_viewer.js',
    'ui/trust_bond_modal.js',
    'ui/role_badge.js',
    'ui/z_teacher_panel.js',
  ];

  if (education) {
    queue.push(
      'core/z_education_mode.js',
      'ui/education_mode_toggle.js',
      'ui/explanation_overlay.js',
      'ui/bias_lens.js'
    );
  }

  if (apicon) {
    queue.push('ui/z_apicon_panel.js');
  }

  if (jailcell) {
    queue.push('ui/internal/jailcell_panel.js');
  }
  if (rhythm) {
    queue.push('core/z_rhythm_engine.js', 'ui/z_rhythm_indicator.js');
  }
  if (feeling) {
    loadStyle('core/feeling/feeling_panel.css');
    queue.push('core/feeling/z_feeling_analyzer.js', 'core/feeling/feeling_panel.js');
  }
  if (notebook) {
    queue.push('core/circles/circles_store.js');
    queue.push('ui/z_notebook_rhythm.js');
  }

  queue
    .reduce((p, script) => p.then(() => loadScript(script)), Promise.resolve())
    .then(() => {
      if (window.ZTrustBondModal && window.ZTrustBondModal.guard) {
        window.ZTrustBondModal.guard();
      }
      if (apicon && window.ZApiConPanel?.init) {
        window.ZApiConPanel.init();
      }
      if (feeling && window.ZFeelingPanel?.init) {
        window.ZFeelingPanel.init();
      }
      if (jailcell && window.ZJailCellPanel?.init) {
        window.ZJailCellPanel.init();
      }
    })
    .catch((err) => {
      console.error('[ZBootstrap] Failed to load scripts', err);
    });
})();
