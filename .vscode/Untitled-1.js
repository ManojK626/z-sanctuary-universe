// sentinel_observer.js

const CONFIG = {
    decayHours: 24,
    resolveHours: 48
};

class SentinelObserver {

    constructor() {
        this.events = [];
    }

    observe(systemState) {

        const now = Date.now();

        // 1. Detect anomalies
        const anomalies = this.detect(systemState);

        anomalies.forEach(a => {
            this.registerEvent(a);
        });

        // 2. Evaluate existing events
        this.events = this.events.map(e => this.evaluate(e, now));

        return this.events;
    }

    detect(system) {

        const alerts = [];

        if (system.formulaVault === "UNAVAILABLE") {
            alerts.push({
                type: "FORMULA_VAULT",
                severity: "critical",
                message: "Formula Vault unavailable"
            });
        }

        if (system.chronicleServer === "OFFLINE") {
            alerts.push({
                type: "CHRONICLE",
                severity: "warning",
                message: "Chronicle server offline"
            });
        }

        if (system.storageIntegrity === "FAIL") {
            alerts.push({
                type: "STORAGE",
                severity: "critical",
                message: "Storage integrity failure"
            });
        }

        return alerts;
    }

    registerEvent(alert) {

        const existing = this.events.find(e => e.type === alert.type);

        if (existing) {
            existing.retriggerCount++;
            existing.lastTrigger = Date.now();
        }
        else {
            this.events.push({
                ...alert,
                status: alert.severity,
                timestamp: Date.now(),
                lastTrigger: Date.now(),
                retriggerCount: 0,
                note: "Sentinel detected anomaly"
            });
        }
    }

    evaluate(event, now) {

        const ageHours = (now - event.timestamp) / (1000 * 60 * 60);

        if (event.status === "critical" && ageHours > CONFIG.decayHours) {

            if (event.retriggerCount === 0) {
                event.status = "monitor";
                event.note = "Auto-downgraded after stability window";
            }
        }

        if (event.status === "monitor" && ageHours > CONFIG.resolveHours) {

            event.status = "resolved";
            event.note = "Auto-resolved by Sentinel observer";
        }

        return event;
    }

}