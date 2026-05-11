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
 *   correlationKey?: string,
 *   clusterId?: string
 * }} SentinelEvent
 */

/**
 * @typedef {Object} SentinelStore
 * @property {() => Promise<SentinelEvent[]>} loadEvents
 * @property {(events: SentinelEvent[]) => Promise<void>} saveEvents
 */

/**
 * Simple in-memory store (default).
 * Replace with file/DB/redis/etc by implementing the same interface.
 */
export class InMemorySentinelStore {
    constructor() {
        /** @type {SentinelEvent[]} */
        this._events = [];
    }

    /** @returns {Promise<SentinelEvent[]>} */
    async loadEvents() {
        return [...this._events];
    }

    /** @param {SentinelEvent[]} events */
    async saveEvents(events) {
        this._events = [...events];
    }
}

export class SentinelBrain {
    /**
     * @param {{ store?: SentinelStore, decayHours?: number, resolveHours?: number, expirationDays?: number }} [options]
     */
    constructor(options = {}) {
        this.store = options.store || new InMemorySentinelStore();

        this.config = {
            decayHours: options.decayHours ?? 24,
            resolveHours: options.resolveHours ?? 48,
            expirationDays: options.expirationDays ?? 14
        };

        /** @type {SentinelEvent[]} */
        this.events = [];
        this._initialized = false;
    }

    async _ensureLoaded() {
        if (this._initialized) return;
        this.events = await this.store.loadEvents();
        this._initialized = true;
    }

    /**
     * Main entry point: observe system state and update event lifecycle.
     * @param {SystemState} systemState
     * @returns {Promise<SentinelEvent[]>}
     */
    async observe(systemState) {
        await this._ensureLoaded();

        const now = Date.now();

        const anomalies = this.detect(systemState);
        anomalies.forEach(a => this.registerEvent(a));

        this.events = this.events
            .map(e => this.evaluate(e, now))
            .filter(e => !this.shouldExpire(e, now));

        this.events = this.correlate(this.events);

        await this.store.saveEvents(this.events);

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
                note: "Sentinel detected anomaly",
                correlationKey: this.buildCorrelationKey(alert)
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
     * Build a correlation key for an alert.
     * @param {Alert} alert
     * @returns {string}
     */
    buildCorrelationKey(alert) {
        return alert.type;
    }

    /**
     * Correlation intelligence: group related events into clusters.
     * @param {SentinelEvent[]} events
     * @returns {SentinelEvent[]}
     */
    correlate(events) {
        /** @type {Record<string, SentinelEvent[]>} */
        const groups = {};

        for (const e of events) {
            const key = e.correlationKey || e.type;
            if (!groups[key]) groups[key] = [];
            groups[key].push(e);
        }

        Object.entries(groups).forEach(([key, group]) => {
            const clusterId = `cluster:${key}`;
            group.forEach(e => {
                e.clusterId = clusterId;
            });
        });

        return events;
    }
}
