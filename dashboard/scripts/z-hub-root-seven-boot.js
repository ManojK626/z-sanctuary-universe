/**
 * Unified SKK/RKPK hub — boot Z-ROOT-7 constellation (second layer below ZUNO-4ROOT companion).
 * Read-only JSON fetch only; matches hubPrefix used elsewhere for shadow vs main Html path.
 */
(function () {
  function hubPrefix() {
    var path = String(window.location.pathname || '').replace(/\\/g, '/');
    if (path.indexOf('/Html/shadow/') !== -1) return '../../..';
    return '../..';
  }

  function scrollPanelBodyToEl(panel, el) {
    if (!panel || !el) return false;
    var bodyEl = panel.querySelector('.z-panel-body');
    if (!bodyEl || !bodyEl.contains(el)) return false;
    var offset = el.offsetTop;
    bodyEl.scrollTo({ top: Math.max(0, offset - 10), behavior: 'smooth' });
    try {
      el.focus({ preventScroll: true });
    } catch (_) {}
    return true;
  }

  function scrollToRootSeven() {
    var panel = document.getElementById('zCompanion3dPanel');
    var layer = document.getElementById('zCompanionRootSevenLayer');
    if (!panel && !layer) return;
    if (panel) {
      if (panel.dataset.collapsed === 'true') {
        var collapseBtn = panel.querySelector('.z-panel-actions .z-panel-btn');
        if (collapseBtn) collapseBtn.click();
        else panel.classList.remove('z-panel-collapsed');
      }
      panel.classList.remove('z-panel-collapsed');
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    requestAnimationFrame(function () {
      if (scrollPanelBodyToEl(panel, layer)) return;
      var inner = layer || panel;
      if (!inner) return;
      inner.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    window.setTimeout(function () {
      scrollPanelBodyToEl(panel, layer);
    }, 180);
  }

  function boot() {
    if (typeof window.initZRoot7GuardianPanel !== 'function') return;
    window.initZRoot7GuardianPanel(hubPrefix(), 'amk_operator', {
      mountId: 'zHubRoot7GuardianMount',
      leadId: 'zHubRoot7Lead',
      detailMountId: 'zHubRoot7DetailMount',
      orbitToggleId: 'zHubRoot7OrbitToggle',
      cardsMountId: 'zHubRoot7CardStrip',
    });
    var fabSeven = document.getElementById('summonRoot7Fab');
    if (fabSeven) fabSeven.addEventListener('click', scrollToRootSeven);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
