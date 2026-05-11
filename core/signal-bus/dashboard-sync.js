// Z: core/signal-bus/dashboard-sync.js
import { sanctuaryBus } from './bus.js';
import { appendAudit } from './audit-log.js';

export function initSignalPipeline(onDashboardSignal) {
  sanctuaryBus.on((sig) => {
    appendAudit(sig);
    if (onDashboardSignal) onDashboardSignal(sig);
  });
}
