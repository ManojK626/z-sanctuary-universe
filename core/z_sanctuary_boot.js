// Z: core/z_sanctuary_boot.js
// Guard: Critical boot file. Review -> Verify -> Apply required.
import { bootSanctuary } from './sanctuary-engine/lifecycle.js';
import { createKairoCellEngine } from './z_kairocell_engine.js';

function bootRingAndCubeObservatory() {
  if (typeof window === 'undefined') return;

  // Bind once: world pulse expects window.ZKairoCell.
  let kairoBound = Boolean(window.ZKairoCell);
  if (!kairoBound) {
    window.ZKairoCell = createKairoCellEngine({
      defaultSpace: 'voxel',
      defaultCellUnit: 'cm',
      defaultCellSize: 4.5,
    });
    kairoBound = true;
  }

  // Safe start in read-only observational mode.
  let worldPulseRunning = false;
  if (window.ZWorldPulsePanel && typeof window.ZWorldPulsePanel.init === 'function') {
    window.ZWorldPulsePanel.init();
  }
  if (window.ZWorldPulse && typeof window.ZWorldPulse.start === 'function') {
    window.ZWorldPulse.start();
    worldPulseRunning = true;
  }

  if (window.ZWorldPulsePanel && typeof window.ZWorldPulsePanel.setRuntimeStatus === 'function') {
    window.ZWorldPulsePanel.setRuntimeStatus({
      kairoBound,
      worldPulseRunning,
    });
  }
}

try {
  bootSanctuary();
  bootRingAndCubeObservatory();
  console.log('[Z][BOOT] Sanctuary signal bus online');
} catch (err) {
  console.warn('[Z][BOOT] Sanctuary boot failed', err);
}
