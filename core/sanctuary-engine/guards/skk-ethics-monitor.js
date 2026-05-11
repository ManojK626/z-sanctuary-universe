// Z: core/sanctuary-engine/guards/skk-ethics-monitor.js
import { sanctuaryBus } from '../../core/signal-bus/bus.js';

const now = () => new Date().toISOString();

export function skkOnSignal(sig) {
  if (sig.kind === 'ETHICS_FLAG' && sig.product === 'Z-OCTAVE') {
    if (sig.severity === 'critical') {
      sanctuaryBus.emit({
        kind: 'STOP_GATE',
        product: 'Z-OCTAVE',
        gate: 'SKK',
        state: 'BLOCK',
        reason: `Critical ethics flag: [${sig.tag}] ${sig.message}`,
        timestamp: now(),
      });
    }
  }
}
