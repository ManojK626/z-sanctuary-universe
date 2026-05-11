// Z: miniai\protector_bot.js
/**
 * ProtectorBot
 * Monitors system state for strain.
 */
(function () {
  const base = window.ZBaseBot || {};

  const ProtectorBot = Object.assign({}, base, {
    name: 'ProtectorBot',
    scan(state) {
      if (!state) return;
      const energy = Number(state.energy || 0);
      const load = Number(state.load || 0);
      if (energy < 30 || load > 85) {
        this.log('warning', { energy, load, message: 'System strain detected' }, 'warning');
      } else {
        this.log('scan', { energy, load });
      }
    },
  });

  window.ZProtectorBot = ProtectorBot;
})();
