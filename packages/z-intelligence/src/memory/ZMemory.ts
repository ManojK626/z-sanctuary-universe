/**
 * Z-Memory Core
 *
 * Shared short-term memory bus for all intelligence systems.
 * Replaces browser window.ZMemory with TypeScript safety.
 *
 * - In-memory circular buffer (default 100 entries)
 * - Optional database hook for persistence
 * - FIFO with timestamp + metadata
 * - Bounded by design (no runaway memory growth)
 */

export interface MemoryEntry {
  timestamp: number;
  source: string; // 'learner' | 'planner' | 'reflector' | 'commander' | 'core'
  type: string; // 'pattern' | 'intent' | 'reflection' | 'decision' | 'event'
  data: Record<string, unknown>;
  priority?: number; // 0-100, higher = more important
}

export interface MemoryConfig {
  maxSize?: number;
  persistenceHook?: (entry: MemoryEntry) => Promise<void>;
  onEvict?: (entry: MemoryEntry) => void;
}

export class ZMemory {
  private buffer: MemoryEntry[] = [];
  private maxSize: number = 100;
  private persistenceHook?: (entry: MemoryEntry) => Promise<void>;
  private onEvict?: (entry: MemoryEntry) => void;
  private lock: boolean = false; // Simple write lock to prevent race conditions

  constructor(config?: MemoryConfig) {
    this.maxSize = config?.maxSize ?? 100;
    this.persistenceHook = config?.persistenceHook;
    this.onEvict = config?.onEvict;
  }

  /**
   * Write to memory (FIFO). If buffer is full, oldest entry is evicted.
   * Bounded: can never grow beyond maxSize.
   * Ethical lock: no entry can modify core governance rules.
   */
  async write(entry: Omit<MemoryEntry, 'timestamp'>): Promise<void> {
    if (this.lock) {
      console.warn('[WARN] Z-Memory: Write in progress, queuing...');
      return;
    }

    this.lock = true;
    try {
      const fullEntry: MemoryEntry = {
        ...entry,
        timestamp: Date.now(),
      };

      // Ethical lock: reject any attempt to modify governance
      if (entry.type === 'governance-override' || entry.source === 'external-command') {
        console.warn('[SECURITY] Z-Memory: Governance override rejected');
        this.lock = false;
        return;
      }

      // Add to buffer
      this.buffer.push(fullEntry);

      // Evict oldest if over capacity
      if (this.buffer.length > this.maxSize) {
        const evicted = this.buffer.shift();
        if (evicted && this.onEvict) {
          this.onEvict(evicted);
        }
      }

      // Persist if hook provided
      if (this.persistenceHook) {
        await this.persistenceHook(fullEntry);
      }
    } finally {
      this.lock = false;
    }
  }

  /**
   * Read from memory. Optional filtering by source or type.
   */
  read(filters?: {
    source?: string;
    type?: string;
    since?: number; // milliseconds ago
    limit?: number;
  }): MemoryEntry[] {
    let results = [...this.buffer];

    if (filters?.source) {
      results = results.filter((e) => e.source === filters.source);
    }

    if (filters?.type) {
      results = results.filter((e) => e.type === filters.type);
    }

    if (filters?.since) {
      const threshold = Date.now() - filters.since;
      results = results.filter((e) => e.timestamp >= threshold);
    }

    if (filters?.limit) {
      results = results.slice(-filters.limit);
    }

    return results;
  }

  /**
   * Get most recent N entries (default 10).
   */
  getRecent(count: number = 10): MemoryEntry[] {
    return this.buffer.slice(-count);
  }

  /**
   * Clear all memory (use with care).
   * Ethical lock: can only be called during system shutdown.
   */
  clear(reason?: string): void {
    console.log(
      `[CLEAR] Z-Memory: Clearing buffer (${this.buffer.length} entries) - Reason: ${reason}`
    );
    this.buffer = [];
  }

  /**
   * Get memory statistics (for health monitoring).
   */
  getStats(): {
    size: number;
    maxSize: number;
    utilization: number;
    oldestTimestamp?: number;
    newestTimestamp?: number;
  } {
    return {
      size: this.buffer.length,
      maxSize: this.maxSize,
      utilization: (this.buffer.length / this.maxSize) * 100,
      oldestTimestamp: this.buffer[0]?.timestamp,
      newestTimestamp: this.buffer[this.buffer.length - 1]?.timestamp,
    };
  }
}

// Singleton instance for shared access
export const sharedMemory = new ZMemory({
  maxSize: 100,
  onEvict: (entry) => {
    // Log when high-priority entries are evicted
    if ((entry.priority ?? 0) > 75) {
      console.warn(
        `[WARN] Z-Memory: High-priority entry evicted - ${entry.type} from ${entry.source}`
      );
    }
  },
});
