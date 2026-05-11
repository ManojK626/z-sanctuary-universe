// Z: Amk_Goku Worldwide Loterry\core\z_education_mode.js
// Z-Education Mode (presentation flag)
(function () {
  const KEY = 'zEducationMode.enabled';

  function isEnabled() {
    return localStorage.getItem(KEY) === 'true';
  }

  function setEnabled(value) {
    localStorage.setItem(KEY, value ? 'true' : 'false');

    const event = {
      source: 'education_mode',
      enabled: value,
      reason: value
        ? 'User enabled Education Mode (non-predictive framing)'
        : 'User disabled Education Mode',
    };

    if (window.ZChronicle) window.ZChronicle.record(event);
    if (window.ZSuperGhost) window.ZSuperGhost.ingest(event);

    document.dispatchEvent(new CustomEvent('education:toggle', { detail: { enabled: value } }));
  }

  window.ZEducationMode = {
    isEnabled,
    setEnabled,
    toggle() {
      setEnabled(!isEnabled());
    },
  };
})();
