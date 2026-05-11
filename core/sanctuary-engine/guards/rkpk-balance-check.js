// Z: core/sanctuary-engine/guards/rkpk-balance-check.js
import { sanctuaryBus } from '../../core/signal-bus/bus.js';

const now = () => new Date().toISOString();

export function rkpkOnSignal(sig) {
  if (sig.kind === 'PILOT_METRIC' && sig.product === 'Z-OCTAVE') {
    if (sig.metric === 'comfort_change' && sig.value === 'worse') {
      sanctuaryBus.emit({
        kind: 'STOP_GATE',
        product: 'Z-OCTAVE',
        gate: 'RKPK',
        state: 'BLOCK',
        reason: `Pilot discomfort reported (track=${sig.track}). Pause & review.`,
        timestamp: now(),
      });
    }
  }
}
