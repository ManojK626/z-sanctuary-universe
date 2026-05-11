// Z: products/Z-OCTAVE/integration/sanctuary-hooks.js
import { sanctuaryBus } from '../../../core/signal-bus/bus.js';

const now = () => new Date().toISOString();

export function zOctaveEmitReadiness(readiness, reason) {
  sanctuaryBus.emit({
    kind: 'PRODUCT_READINESS',
    product: 'Z-OCTAVE',
    readiness,
    reason,
    timestamp: now(),
  });
}

export function zOctaveEthicsFlag(severity, tag, message) {
  sanctuaryBus.emit({
    kind: 'ETHICS_FLAG',
    product: 'Z-OCTAVE',
    severity,
    tag,
    message,
    timestamp: now(),
  });
}

export function zOctavePilotMetric({ track, metric, value }) {
  sanctuaryBus.emit({
    kind: 'PILOT_METRIC',
    product: 'Z-OCTAVE',
    track,
    metric,
    value,
    timestamp: now(),
  });
}
