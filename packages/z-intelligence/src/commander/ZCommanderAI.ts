/**
 * Z-Commander AI
 *
 * The autopilot of autopilots, but governed.
 * Single scheduler that orchestrates all intelligence subsystems.
 *
 * Runs on:
 * - Node.js (server side)
 * - Or controlled client loop (web)
 *
 * Ownership:
 * - Timing (when things happen)
 * - Orchestration (what talks to what)
 * - Governance (ethical constraints)
 *
 * Ethical locks:
 * - No modifications to core governance rules
 * - All system changes are logged
 * - Can be paused/halted at any time
 * - User always has final say
 */

import { sharedMemory } from '../memory/ZMemory';
import { learner, Pattern } from '../learner/ZPatternLearner';
import { planner, Intent } from '../planner/ZPlannerAI';
import { reflector } from '../reflector/ZReflectorAI';

export interface CommanderConfig {
  learnerInterval?: number; // ms between learner cycles (default 10000)
  plannerInterval?: number; // ms between planner cycles (default 15000)
  reflectorInterval?: number; // ms between reflector cycles (default 30000)
  autoStart?: boolean; // Auto-start scheduler on init (default false)
  onIntentGenerated?: (intent: Intent) => void; // Callback for UI/external systems
}

export type CommanderState = 'idle' | 'running' | 'paused';

export interface CommanderStatus {
  state: CommanderState;
  cyclesCompleted: number;
  lastCycleTime: number;
  nextCycleTime: number;
  patternCount: number;
  intentCount: number;
  errorLog: string[];
}

export class ZCommanderAI {
  private learnerInterval: number = 10000;
  private plannerInterval: number = 15000;
  private reflectorInterval: number = 30000;

  private state: CommanderState = 'idle';
  private cyclesCompleted: number = 0;
  private lastCycleTime: number = 0;
  private nextCycleTime: number = 0;
  private errorLog: string[] = [];

  private patternCount: number = 0;
  private intentCount: number = 0;

  private timeouts: Map<string, ReturnType<typeof setTimeout>> = new Map();
  private onIntentGenerated?: (intent: Intent) => void;

  private lastPatterns: Pattern[] = [];
  private lastIntents: Intent[] = [];
  private plannerRunning: boolean = false;
  private plannerQueued: boolean = false;

  constructor(config?: CommanderConfig) {
    this.learnerInterval = config?.learnerInterval ?? 10000;
    this.plannerInterval = config?.plannerInterval ?? 15000;
    this.reflectorInterval = config?.reflectorInterval ?? 30000;
    this.onIntentGenerated = config?.onIntentGenerated;

    if (config?.autoStart) {
      this.start();
    }

    console.log('Z-Commander initialized (not running - call .start() to begin)');
  }

  /**
   * Start the command scheduler.
   * Governance: Cannot override core rules.
   */
  start(): void {
    if (this.state !== 'idle' && this.state !== 'paused') {
      console.warn(`Z-Commander: Cannot start from state "${this.state}"`);
      return;
    }

    this.state = 'running';
    console.log('Z-Commander: Starting autonomous cycle');

    // Schedule all subsystems
    this.scheduleReflector();
    this.scheduleLearner();
    this.schedulePlanner();
  }

  /**
   * Pause the scheduler (can be resumed).
   */
  pause(): void {
    if (this.state !== 'running') {
      console.warn(`Z-Commander: Cannot pause from state "${this.state}"`);
      return;
    }

    this.state = 'paused';
    console.log('Z-Commander: Paused');

    // Cancel pending cycles
    this.clearSchedules();
  }

  /**
   * Resume from pause.
   */
  resume(): void {
    if (this.state !== 'paused') {
      console.warn(`Z-Commander: Cannot resume from state "${this.state}"`);
      return;
    }

    console.log('Z-Commander: Resuming');
    this.start();
  }

  /**
   * Stop permanently (reset to idle).
   */
  stop(): void {
    this.state = 'idle';
    console.log('Z-Commander: Stopped');
    this.clearSchedules();
  }

  private scheduleReflector(): void {
    if (this.state !== 'running') return;

    const timeout = setTimeout(async () => {
      try {
        await reflector.reflect();
      } catch (err) {
        this.handleError('reflector', err);
      }

      // Reschedule
      this.scheduleReflector();
    }, this.reflectorInterval);

    this.timeouts.set('reflector', timeout);
  }

  private scheduleLearner(): void {
    if (this.state !== 'running') return;

    const timeout = setTimeout(async () => {
      try {
        this.lastPatterns = await learner.analyze();
        this.patternCount += this.lastPatterns.length;

        // If patterns found, trigger planner immediately
        if (this.lastPatterns.length > 0) {
          await this.triggerPlanner();
        }
      } catch (err) {
        this.handleError('learner', err);
      }

      // Reschedule
      this.scheduleLearner();
    }, this.learnerInterval);

    this.timeouts.set('learner', timeout);
  }

  private schedulePlanner(): void {
    if (this.state !== 'running') return;

    this.nextCycleTime = Date.now() + this.plannerInterval;
    const timeout = setTimeout(async () => {
      await this.triggerPlanner();
      // Reschedule
      this.schedulePlanner();
    }, this.plannerInterval);

    this.timeouts.set('planner', timeout);
  }

  private async triggerPlanner(): Promise<void> {
    if (this.plannerRunning) {
      this.plannerQueued = true;
      return;
    }

    this.plannerRunning = true;
    try {
      // Use latest patterns from learner (or empty if none)
      const patterns = this.lastPatterns.length > 0 ? this.lastPatterns : [];
      this.lastIntents = await planner.plan(patterns);
      this.intentCount += this.lastIntents.length;

      this.cyclesCompleted++;
      this.lastCycleTime = Date.now();

      // Callback for UI systems
      if (this.onIntentGenerated) {
        for (const intent of this.lastIntents) {
          this.onIntentGenerated(intent);
        }
      }

      // Log to memory
      await sharedMemory.write({
        source: 'commander',
        type: 'cycle',
        data: {
          patterns: patterns.length,
          intents: this.lastIntents.length,
          timestamp: Date.now(),
        },
        priority: 50,
      });
    } catch (err) {
      this.handleError('planner', err);
    } finally {
      this.plannerRunning = false;
      if (this.plannerQueued) {
        this.plannerQueued = false;
        if (this.state === 'running') {
          void this.triggerPlanner();
        }
      }
    }
  }

  private handleError(subsystem: string, err: unknown): void {
    const msg = err instanceof Error ? err.message : String(err);
    const errorMsg = `${subsystem}: ${msg}`;

    this.errorLog.push(errorMsg);
    if (this.errorLog.length > 20) {
      this.errorLog = this.errorLog.slice(-20);
    }

    console.error(`Z-Commander error in ${subsystem}:`, msg);

    // Don't stop on error; just log and continue
    // This keeps the system resilient
  }

  private clearSchedules(): void {
    for (const timeout of this.timeouts.values()) {
      clearTimeout(timeout);
    }
    this.timeouts.clear();
    this.nextCycleTime = 0;
  }

  /**
   * Get current commander status (for dashboards).
   */
  getStatus(): CommanderStatus {
    return {
      state: this.state,
      cyclesCompleted: this.cyclesCompleted,
      lastCycleTime: this.lastCycleTime,
      nextCycleTime: this.nextCycleTime,
      patternCount: this.patternCount,
      intentCount: this.intentCount,
      errorLog: [...this.errorLog],
    };
  }

  /**
   * Get last patterns (for debugging).
   */
  getLastPatterns(): Pattern[] {
    return this.lastPatterns;
  }

  /**
   * Get last intents (for UI).
   */
  getLastIntents(): Intent[] {
    return this.lastIntents;
  }

  /**
   * Manually trigger a full cycle (for testing).
   */
  async debugCycle(): Promise<void> {
    if (this.state === 'running') {
      console.warn('Z-Commander: Cannot debug while running. Pause first.');
      return;
    }

    console.log('Z-Commander: Debug cycle starting...');

    try {
      const patterns = await learner.analyze();
      console.log(`  Patterns found: ${patterns.length}`);

      const intents = await planner.plan(patterns);
      console.log(`  Intents generated: ${intents.length}`);

      const reflection = await reflector.reflect();
      console.log(`  Reflection: coherence=${reflection.coherence.toFixed(1)}`);

      console.log('Z-Commander: Debug cycle complete');
    } catch (err) {
      console.error('Z-Commander: Debug cycle failed:', err);
    }
  }
}

export const commander = new ZCommanderAI({
  learnerInterval: 10000,
  plannerInterval: 15000,
  reflectorInterval: 30000,
  autoStart: false,
});
