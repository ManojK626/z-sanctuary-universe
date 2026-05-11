// Z: core\z_super_ghost_ingest.js
(function () {
  function ingest(event) {
    if (!event) return;
    window.ZChronicle?.record?.({ source: 'super_ghost', type: 'ingest', payload: event });
    console.info('[SuperGhost] Observed:', event);
  }

  window.ZSuperGhost = {
    ingest,
  };
})();
