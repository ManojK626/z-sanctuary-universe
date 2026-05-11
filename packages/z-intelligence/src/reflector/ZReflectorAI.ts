/**
 * Z-Reflector AI
 *
 * Self-awareness without ego. Writes reflection observations to memory.
 * No self-judgment, only health indicators.
 *
 * Reflects on:
 * - System coherence
 * - Emotional stability
 * - Pattern consistency
 * - Recovery capacity
 *
 * Outputs: Reflection events to Z-Memory (audit trail)
 * No console noise. Pure data.
 *
 * Ethical lock: Never modifies core governance.
 * Only observes and records.
 */

import { sharedMemory } from '../memory/ZMemory';

export interface HealthIndicator {
  metric: string;
  value: number;
  range: [number, number]; // [min, max]
  status: 'healthy' | 'warning' | 'critical';
  timestamp: number;
}

export interface ReflectionSnapshot {
  id: string;
  timestamp: number;
  coherence: number;
  stability: number; // How steady is the system
  adaptability: number; // How well is it responding
  recovery: number; // Can it bounce back from stress
  indicators: HealthIndicator[];
  auditNotes: string; // What changed since last reflection
}

export interface ReflectorConfig {
  reflectionInterval?: number; // ms between reflections (default 30000 = 30s)
  auditTrail?: boolean; // Enable audit logging (default true)
}

export class ZReflectorAI {
  private reflectionInterval: number = 30000;
  private auditTrail: boolean = true;
  private lastReflection: ReflectionSnapshot | null = null;
  private reflectionHistory: ReflectionSnapshot[] = [];
  private reflexCount: number = 0;

  constructor(config?: ReflectorConfig) {
    this.reflectionInterval = config?.reflectionInterval ?? 30000;
    this.auditTrail = config?.auditTrail ?? true;
  }

  /**
   * Perform reflection cycle. Called by Commander on schedule.
   * No side effects, only observation and memory writes.
   */
  async reflect(): Promise<ReflectionSnapshot> {
    this.reflexCount++;

    // Gather memory data
    const recent = sharedMemory.read({ limit: 50 });
    const stats = sharedMemory.getStats();

    // Calculate health metrics
    const coherence = this.calculateCoherence(recent);
    const stability = this.calculateStability(recent);
    const adaptability = this.calculateAdaptability(recent);
    const recovery = this.calculateRecovery(recent);

    // Build indicators
    const indicators: HealthIndicator[] = [
      {
        metric: 'memory-utilization',
        value: stats.utilization,
        range: [0, 100],
        status: this.statusFromValue(stats.utilization, 0, 100, 80),
        timestamp: Date.now(),
      },
      {
        metric: 'coherence',
        value: coherence,
        range: [0, 100],
        status: this.statusFromValue(coherence, 0, 100, 60),
        timestamp: Date.now(),
      },
      {
        metric: 'stability',
        value: stability,
        range: [0, 100],
        status: this.statusFromValue(stability, 0, 100, 50),
        timestamp: Date.now(),
      },
      {
        metric: 'adaptability',
        value: adaptability,
        range: [0, 100],
        status: this.statusFromValue(adaptability, 0, 100, 40),
        timestamp: Date.now(),
      },
      {
        metric: 'recovery',
        value: recovery,
        range: [0, 100],
        status: this.statusFromValue(recovery, 0, 100, 50),
        timestamp: Date.now(),
      },
    ];

    // Generate audit notes
    let auditNotes = '';
    if (this.lastReflection) {
      const coherenceDelta = coherence - this.lastReflection.coherence;
      auditNotes = `Coherence delta: ${coherenceDelta > 0 ? '+' : ''}${coherenceDelta.toFixed(1)} | `;
      auditNotes += `Memory usage: ${stats.utilization.toFixed(1)}% | `;
      auditNotes += `Entry count: ${recent.length}`;
    } else {
      auditNotes = 'Initial reflection';
    }

    // Create snapshot
    const snapshot: ReflectionSnapshot = {
      id: `reflection-${Date.now()}`,
      timestamp: Date.now(),
      coherence,
      stability,
      adaptability,
      recovery,
      indicators,
      auditNotes,
    };

    // Store locally
    this.lastReflection = snapshot;
    this.reflectionHistory.push(snapshot);
    if (this.reflectionHistory.length > 50) {
      this.reflectionHistory = this.reflectionHistory.slice(-50);
    }

    // Write to shared memory
    await sharedMemory.write({
      source: 'reflector',
      type: 'reflection',
      data: {
        coherence,
        stability,
        adaptability,
        recovery,
        indicatorCount: indicators.length,
      },
      priority: 40, // Reflections are informational, lower priority
    });

    // Write audit trail if enabled
    if (this.auditTrail) {
      await sharedMemory.write({
        source: 'reflector',
        type: 'audit',
        data: {
          reflexCycle: this.reflexCount,
          notes: auditNotes,
        },
        priority: 30, // Audit is lowest priority (doesn't block)
      });
    }

    return snapshot;
  }

  private calculateCoherence(recent: any[]): number {
    // Average of emotional coherence values in recent entries
    const coherenceValues = recent
      .filter((e) => e.data?.coherence !== undefined)
      .map((e) => e.data.coherence as number);

    return coherenceValues.length > 0
      ? coherenceValues.reduce((a, b) => a + b) / coherenceValues.length
      : 50; // Neutral if no data
  }

  private calculateStability(recent: any[]): number {
    // How little variation is there in coherence?
    const coherenceValues = recent
      .filter((e) => e.data?.coherence !== undefined)
      .map((e) => e.data.coherence as number);

    if (coherenceValues.length < 2) return 50;

    const avg = coherenceValues.reduce((a, b) => a + b) / coherenceValues.length;
    const variance =
      coherenceValues.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / coherenceValues.length;
    const stdDev = Math.sqrt(variance);

    // Lower stdDev = more stable. Convert to 0-100 scale.
    return Math.max(0, 100 - stdDev);
  }

  private calculateAdaptability(recent: any[]): number {
    // How responsive is system to stimuli?
    const stimuli = recent.filter((e) => e.type === 'stimulus').length;
    const responses = recent.filter((e) => e.type === 'response' || e.data?.responseMode).length;

    if (stimuli === 0) return 50;
    return Math.min(100, (responses / stimuli) * 100);
  }

  private calculateRecovery(recent: any[]): number {
    // If there was a coherence dip, did it recover?
    const coherenceValues = recent
      .filter((e) => e.data?.coherence !== undefined)
      .map((e) => e.data.coherence as number);

    if (coherenceValues.length < 5) return 50;

    const first = coherenceValues[0];
    const last = coherenceValues[coherenceValues.length - 1];
    const min = Math.min(...coherenceValues);

    // Recovery score: if we're back near where we started after a dip
    if (last >= first || min > first - 10) {
      return 85; // Good recovery
    }

    return 40; // Not recovering well
  }

  private statusFromValue(
    value: number,
    min: number,
    max: number,
    warningThreshold: number
  ): 'healthy' | 'warning' | 'critical' {
    if (value >= warningThreshold) return 'healthy';
    if (value >= warningThreshold * 0.5) return 'warning';
    return 'critical';
  }

  /**
   * Get last reflection (current system state).
   */
  getLastReflection(): ReflectionSnapshot | null {
    return this.lastReflection;
  }

  /**
   * Get reflection history (for trend analysis).
   */
  getReflectionHistory(limit: number = 10): ReflectionSnapshot[] {
    return this.reflectionHistory.slice(-limit);
  }

  /**
   * Get reflexive count (how many times we've reflected).
   */
  getReflexCount(): number {
    return this.reflexCount;
  }
}

export const reflector = new ZReflectorAI({ auditTrail: true });
