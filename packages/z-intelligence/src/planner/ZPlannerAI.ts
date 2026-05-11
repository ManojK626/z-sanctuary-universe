/**
 * Z-Planner AI
 *
 * Direction without force. Outputs intent objects that suggest actions
 * without commanding them. Later triggers:
 * - UI changes
 * - Sound/feedback
 * - AI prompts
 * - System recommendations
 *
 * Planner:
 * - Receives patterns from Learner
 * - Creates intents (goals/recommendations)
 * - Returns intents to Commander
 * - Never directly modifies state
 *
 * Ethical alignment: Respects autonomy. Suggests, not forces.
 */

import { Pattern } from '../learner/ZPatternLearner';
import { sharedMemory } from '../memory/ZMemory';

export interface Intent {
  id: string;
  priority: number; // 0-100
  type: string; // 'suggestion' | 'alert' | 'opportunity' | 'intervention' | 'info'
  title: string;
  description: string;
  actions: Action[];
  reasoning: string; // Why this intent was generated
  targetAudience: 'user' | 'system' | 'both';
  timestamp: number;
}

export interface Action {
  type: string; // 'ui-update' | 'sound' | 'prompt' | 'log' | 'recommendation'
  payload: Record<string, unknown>;
  optional?: boolean; // User can ignore
}

export interface PlannerConfig {
  maxIntentsPerCycle?: number;
  conservatism?: number; // 0-100, how aggressive with suggestions (default 50)
}

export class ZPlannerAI {
  private maxIntentsPerCycle: number = 3;
  private conservatism: number = 50; // 50 = balanced
  private intentHistory: Intent[] = [];

  constructor(config?: PlannerConfig) {
    this.maxIntentsPerCycle = config?.maxIntentsPerCycle ?? 3;
    this.conservatism = Math.max(0, Math.min(100, config?.conservatism ?? 50));
  }

  /**
   * Generate intents from patterns. Called by Commander.
   * Returns suggested actions, not commands.
   *
   * Ethical lock: All outputs are reversible suggestions, not irreversible changes.
   */
  async plan(patterns: Pattern[]): Promise<Intent[]> {
    const intents: Intent[] = [];

    for (const pattern of patterns) {
      const intent = this.patternToIntent(pattern);
      if (intent) {
        intents.push(intent);
      }
    }

    // Rank by priority, limit output
    const sorted = intents.sort((a, b) => b.priority - a.priority);
    const results = sorted.slice(0, this.maxIntentsPerCycle);

    // Store history
    this.intentHistory.push(...results);
    if (this.intentHistory.length > 100) {
      this.intentHistory = this.intentHistory.slice(-100);
    }

    // Log to memory
    for (const intent of results) {
      await sharedMemory.write({
        source: 'planner',
        type: 'intent',
        data: { intent: intent.id, priority: intent.priority },
        priority: intent.priority,
      });
    }

    return results;
  }

  private patternToIntent(pattern: Pattern): Intent | null {
    let intent: Intent | null = null;

    switch (pattern.type) {
      case 'cyclic':
        intent = this.intentFromCyclicPattern(pattern);
        break;
      case 'causal':
        intent = this.intentFromCausalPattern(pattern);
        break;
      case 'drift':
        intent = this.intentFromDriftPattern(pattern);
        break;
      case 'anomaly':
        intent = this.intentFromAnomalyPattern(pattern);
        break;
    }

    return intent;
  }

  private intentFromCyclicPattern(pattern: Pattern): Intent {
    const conservismAdjustment = this.conservatism / 100;

    return {
      id: `intent-cyclic-${Date.now()}`,
      priority: Math.round(60 * conservismAdjustment),
      type: 'opportunity',
      title: 'Cyclic Pattern Detected',
      description:
        'Your system shows rhythmic energy fluctuations. Consider scheduling demanding tasks during high-energy windows.',
      actions: [
        {
          type: 'ui-update',
          payload: {
            component: 'energy-chart',
            annotation: 'Cyclic pattern identified',
            color: '#a0e4cb',
          },
        },
        {
          type: 'prompt',
          payload: {
            title: 'Peak Energy Window',
            message: 'High energy expected in ~4 hours. Good time for creative work?',
            optional: true,
          },
        },
      ],
      reasoning: `Pattern confidence: ${pattern.confidence}%. Suggests natural rhythm in system behavior.`,
      targetAudience: 'user',
      timestamp: Date.now(),
    };
  }

  private intentFromCausalPattern(pattern: Pattern): Intent {
    return {
      id: `intent-causal-${Date.now()}`,
      priority: Math.round(70 * (this.conservatism / 100)),
      type: 'info',
      title: 'System Responsiveness Confirmed',
      description:
        'Your system consistently responds to stimuli. This is healthy adaptation. Consider varying stimulus types to expand response repertoire.',
      actions: [
        {
          type: 'log',
          payload: {
            event: 'causal-pattern-confirmed',
            suggestion: 'Adaptive behavior is working. System is learning.',
          },
        },
        {
          type: 'recommendation',
          payload: {
            title: 'Stimulus Diversity',
            text: 'Try new types of interactions to explore wider emotional range.',
            optional: true,
          },
        },
      ],
      reasoning: `${pattern.description}. Indicates functional feedback loop.`,
      targetAudience: 'user',
      timestamp: Date.now(),
    };
  }

  private intentFromDriftPattern(pattern: Pattern): Intent {
    const isDriftingUp = (pattern.description ?? '').includes('up');
    const intenseConservatism = this.conservatism / 100;

    return {
      id: `intent-drift-${Date.now()}`,
      priority: Math.round(80 * intenseConservatism),
      type: isDriftingUp ? 'opportunity' : 'alert',
      title: isDriftingUp ? 'Improving Coherence' : 'Coherence Declining',
      description: isDriftingUp
        ? 'Your emotional coherence is improving. Maintain current practices.'
        : 'Emotional coherence is declining. Consider rest or reset.',
      actions: isDriftingUp
        ? [
            {
              type: 'sound',
              payload: { sample: 'positive_chime', volume: 0.5 },
            },
          ]
        : [
            {
              type: 'prompt',
              payload: {
                title: 'Rest Suggested',
                message: 'Consider a pause. Even 5 minutes of breathing helps.',
                optional: true,
              },
            },
          ],
      reasoning: 'Drift magnitude warrants attention. This is adaptive feedback, not alarm.',
      targetAudience: 'user',
      timestamp: Date.now(),
    };
  }

  private intentFromAnomalyPattern(pattern: Pattern): Intent {
    return {
      id: `intent-anomaly-${Date.now()}`,
      priority: Math.round(90 * (this.conservatism / 100)),
      type: 'alert',
      title: 'Anomalous Activity Detected',
      description: `${pattern.description} Investigate if this was intentional or unexpected.`,
      actions: [
        {
          type: 'ui-update',
          payload: {
            component: 'status-indicator',
            status: 'investigating',
            color: '#ff006e',
          },
        },
        {
          type: 'log',
          payload: {
            event: 'anomaly-detected',
            evidence: pattern.evidence.length,
          },
        },
      ],
      reasoning: 'Anomalies may indicate external stimulus, system stress, or unexpected state.',
      targetAudience: 'both',
      timestamp: Date.now(),
    };
  }

  /**
   * Get intent history (for audit/review).
   */
  getIntentHistory(limit: number = 20): Intent[] {
    return this.intentHistory.slice(-limit);
  }

  /**
   * Update conservatism dynamically (user preference).
   */
  setConservatism(value: number): void {
    this.conservatism = Math.max(0, Math.min(100, value));
    console.log(`[STATS] Planner conservatism: ${this.conservatism}% (0=aggressive, 100=cautious)`);
  }
}

export const planner = new ZPlannerAI({ conservatism: 50 });
