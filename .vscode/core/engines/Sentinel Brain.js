/**
 * @typedef {"critical" | "warning" | "monitor" | "resolved"} Severity
 */

/**
 * @typedef {Object} SystemState
 * @property {string} formulaVault
 * @property {string} chronicleServer
 * @property {string} storageIntegrity
 */

/**
 * @typedef {Object} Alert
 * @property {string} type
 * @property {Severity} severity
 * @property {string} message
 */

/**
 * @typedef {Alert & {
 *   status: Severity,
 *   timestamp: number,
 *   lastTrigger: number,
 *   retriggerCount: number,
 *   note: string,
 *   correlationKey?: string
 * }} SentinelEvent
 */

export class SentinelBrain {
    /** @type {SentinelEvent[]} */
    events = [];

    /** configuration for decay + resolution windows */
    config = {
        decayHours: 24,
        resolveHours: 48,
        expirationDays: 14
    };

    /**
     * Main entry point: observe system state and update event lifecycle.
     * @param {SystemState} systemState
     * @returns {SentinelEvent[]}
     */
    observe(systemState) {
        const now = Date.now();

        const anomalies = this.detect(systemState);
        anomalies.forEach(a => this.registerEvent(a));

        this.events = this.events
            .map(e => this.evaluate(e, now))
            .filter(e => !this.shouldExpire(e, now));

        return this.events;
    }

    /**
     * Detect anomalies from system state.
     * @param {SystemState} system
     * @returns {Alert[]}
     */
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

    /**
     * Register or retrigger an event.
     * @param {Alert} alert
     */
    registerEvent(alert) {
        const existing = this.events.find(e => e.type === alert.type);

        if (existing) {
            existing.retriggerCount++;
            existing.lastTrigger = Date.now();
        } else {
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

    /**
     * Evaluate lifecycle transitions.
     * @param {SentinelEvent} event
     * @param {number} now
     * @returns {SentinelEvent}
     */
    evaluate(event, now) {
        const ageHours = (now - event.timestamp) / 3600000;

        if (event.status === "critical" && ageHours > this.config.decayHours) {
            if (event.retriggerCount === 0) {
                event.status = "monitor";
                event.note = "Auto-downgraded after stability window";
            }
        }

        if (event.status === "monitor" && ageHours > this.config.resolveHours) {
            event.status = "resolved";
            event.note = "Auto-resolved by Sentinel";
        }

        return event;
    }

    /**
     * Expire old resolved events.
     * @param {SentinelEvent} event
     * @param {number} now
     * @returns {boolean}
     */
    shouldExpire(event, now) {
        if (event.status !== "resolved") return false;

        const ageDays = (now - event.timestamp) / 86400000;
        return ageDays > this.config.expirationDays;
    }

    /**
     * Optional: correlation hook for future clustering logic.
     * @param {SentinelEvent[]} events
     * @returns {SentinelEvent[]}
     */
    correlate(events) {
        return events;
    }
}
