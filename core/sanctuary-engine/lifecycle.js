// Z: core/sanctuary-engine/lifecycle.js
import { initSignalPipeline } from '../signal-bus/dashboard-sync.js';
import { skkOnSignal } from './guards/skk-ethics-monitor.js';
import { rkpkOnSignal } from './guards/rkpk-balance-check.js';

export function bootSanctuary() {
  initSignalPipeline((sig) => {
    skkOnSignal(sig);
    rkpkOnSignal(sig);
  });
}
