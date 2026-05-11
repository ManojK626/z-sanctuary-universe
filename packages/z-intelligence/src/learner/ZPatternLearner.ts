/**
 * Z-Pattern Learner
 *
 * Adaptive analysis system that identifies patterns in Z-Memory.
 * Called explicitly by Commander (no setInterval).
 * Returns pattern results, doesn't print.
 *
 * Learns from:
 * - Energy fluctuations
 * - Emotional state transitions
 * - User interactions
 * - Stimulus-response pairs
 *
 * Outputs: Pattern objects for Commander to act on
 */

import { MemoryEntry, sharedMemory } from '../memory/ZMemory';

export interface Pattern {
  id: string;
  type: string; // 'cyclic', 'causal', 'drift', 'anomaly', 'correlation'
  confidence: number; // 0-100
  description: string;
  evidence: MemoryEntry[];
  suggestedAction?: string;
  timestamp: number;
}

export interface LearnerConfig {
  minConfidence?: number; // Don't report patterns below this (default 60)
  windowSize?: number; // How many recent entries to analyze (default 30)
  maxPatternsPerAnalysis?: number; // Limit output (default 5)
}

export class ZPatternLearner {
  private minConfidence: number = 60;
  private windowSize: number = 30;
  private maxPatternsPerAnalysis: number = 5;
  private patternHistory: Pattern[] = [];

  constructor(config?: LearnerConfig) {
    this.minConfidence = config?.minConfidence ?? 60;
    this.windowSize = config?.windowSize ?? 30;
    this.maxPatternsPerAnalysis = config?.maxPatternsPerAnalysis ?? 5;
  }

  /**
   * Analyze memory for patterns. Called by Commander on schedule.
   * Returns array of discovered patterns ranked by confidence.
   */
  async analyze(): Promise<Pattern[]> {
    const recent = sharedMemory.read({ limit: this.windowSize });

    if (recent.length < 3) {
      return []; // Not enough data
    }

    const patterns: Pattern[] = [];

    // Pattern 1: Cyclic Detection (energy/harmony oscillations)
    const cyclicPattern = this.detectCyclic(recent);
    if (cyclicPattern && cyclicPattern.confidence >= this.minConfidence) {
      patterns.push(cyclicPattern);
    }

    // Pattern 2: Causal Chains (stimulus -> response sequences)
    const causalPattern = this.detectCausal(recent);
    if (causalPattern && causalPattern.confidence >= this.minConfidence) {
      patterns.push(causalPattern);
    }

    // Pattern 3: Emotional Drift (sustained state changes)
    const driftPattern = this.detectDrift(recent);
    if (driftPattern && driftPattern.confidence >= this.minConfidence) {
      patterns.push(driftPattern);
    }

    // Pattern 4: Anomalies (unexpected deviations)
    const anomalyPattern = this.detectAnomaly(recent);
    if (anomalyPattern && anomalyPattern.confidence >= this.minConfidence) {
      patterns.push(anomalyPattern);
    }

    // Sort by confidence, limit output
    const sorted = patterns.sort((a, b) => b.confidence - a.confidence);
    const results = sorted.slice(0, this.maxPatternsPerAnalysis);

    // Store in pattern history
    this.patternHistory.push(...results);
    if (this.patternHistory.length > 100) {
      this.patternHistory = this.patternHistory.slice(-100);
    }

    return results;
  }

  private detectCyclic(entries: MemoryEntry[]): Pattern | null {
    // Extract energy-like values from entries
    const values = entries
      .filter((e) => e.data.energy !== undefined)
      .map((e) => e.data.energy as number);

    if (values.length < 5) return null;

    // Simple: check if there's a repeating up-down pattern
    let upCount = 0;
    let downCount = 0;

    for (let i = 1; i < values.length; i++) {
      if (values[i] > values[i - 1]) upCount++;
      else if (values[i] < values[i - 1]) downCount++;
    }

    const ratio = Math.abs(upCount - downCount) / values.length;
    const confidence = Math.max(0, 100 * (1 - ratio)); // Higher if balanced up/down

    if (confidence > this.minConfidence) {
      return {
        id: `cyclic-${Date.now()}`,
        type: 'cyclic',
        confidence: Math.round(confidence),
        description: `Energy shows cyclic pattern (${upCount} ups, ${downCount} downs)`,
        evidence: entries.slice(-10),
        suggestedAction: 'Consider time-based interventions during low-energy phases',
        timestamp: Date.now(),
      };
    }

    return null;
  }

  private detectCausal(entries: MemoryEntry[]): Pattern | null {
    // Look for stimulus (from reflector) followed by state change (from energy)
    const stimuli = entries.filter((e) => e.type === 'stimulus');
    const stateChanges = entries.filter((e) => e.data.coherence !== undefined);

    if (stimuli.length < 2 || stateChanges.length < 2) return null;

    let causalPairs = 0;
    let total = 0;

    for (const stimulus of stimuli) {
      const afterStimulus = stateChanges.filter((s) => s.timestamp > stimulus.timestamp);
      if (afterStimulus.length > 0) {
        causalPairs++;
        total++;
      }
    }

    const confidence = total > 0 ? (causalPairs / total) * 100 : 0;

    if (confidence > this.minConfidence) {
      return {
        id: `causal-${Date.now()}`,
        type: 'causal',
        confidence: Math.round(confidence),
        description: `${causalPairs} of ${total} stimuli followed by state changes`,
        evidence: [...stimuli, ...stateChanges].slice(-10),
        suggestedAction: 'System is responsive to stimuli. Calibrate stimulus intensity.',
        timestamp: Date.now(),
      };
    }

    return null;
  }

  private detectDrift(entries: MemoryEntry[]): Pattern | null {
    // Check for sustained change in coherence over time window
    const coherenceEntries = entries.filter((e) => e.data.coherence !== undefined).slice(-15);

    if (coherenceEntries.length < 10) return null;

    const firstHalf = coherenceEntries.slice(0, 5);
    const secondHalf = coherenceEntries.slice(-5);

    const avgFirst =
      firstHalf.reduce((sum, e) => sum + (e.data.coherence as number), 0) / firstHalf.length;
    const avgSecond =
      secondHalf.reduce((sum, e) => sum + (e.data.coherence as number), 0) / secondHalf.length;

    const drift = avgSecond - avgFirst;
    const driftPercent = Math.abs(drift) / 100; // coherence is 0-100

    if (driftPercent > 0.15) {
      // >15% change = significant drift
      return {
        id: `drift-${Date.now()}`,
        type: 'drift',
        confidence: Math.min(100, 50 + driftPercent * 200), // Confidence correlates with magnitude
        description: `Coherence drifted ${drift > 0 ? 'up' : 'down'} by ${Math.abs(drift).toFixed(1)} points`,
        evidence: coherenceEntries,
        suggestedAction:
          drift > 0
            ? 'System improving. Maintain current trajectory.'
            : 'System degrading. Consider recovery protocol.',
        timestamp: Date.now(),
      };
    }

    return null;
  }

  private detectAnomaly(entries: MemoryEntry[]): Pattern | null {
    // Simple anomaly: extreme values that deviate from recent average
    const energies = entries
      .filter((e) => e.data.energy !== undefined)
      .map((e) => e.data.energy as number)
      .slice(-10);

    if (energies.length < 5) return null;

    const avg = energies.reduce((a, b) => a + b) / energies.length;
    const stdDev = Math.sqrt(
      energies.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / energies.length
    );

    const anomalies = energies.filter((e) => Math.abs(e - avg) > stdDev * 2);

    if (anomalies.length > 0) {
      return {
        id: `anomaly-${Date.now()}`,
        type: 'anomaly',
        confidence: Math.min(100, 60 + anomalies.length * 15),
        description: `${anomalies.length} anomalous energy values detected (avg: ${avg.toFixed(1)}, sigma: ${stdDev.toFixed(1)})`,
        evidence: entries.slice(-10),
        suggestedAction:
          'Investigate energy spike. May indicate system stress or external stimulus.',
        timestamp: Date.now(),
      };
    }

    return null;
  }

  /**
   * Get pattern history (for debugging/analysis).
   */
  getPatternHistory(limit: number = 20): Pattern[] {
    return this.patternHistory.slice(-limit);
  }

  /**
   * Clear pattern history (system reset).
   */
  clearHistory(): void {
    this.patternHistory = [];
  }
}

export const learner = new ZPatternLearner();
