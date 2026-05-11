/**
 * Example: How to Use Z-Intelligence in Your Project
 *
 * This shows a complete minimal integration.
 * Copy and adapt for your own use case.
 */

import { commander, sharedMemory, Intent, CommanderStatus } from '@z-sanctuary/z-intelligence';

// ============================================================================
// SCENARIO 1: Standalone Server (Node.js)
// ============================================================================

async function runStandaloneServer() {
  console.log('[START] Z-Intelligence Standalone Server Starting...\n');

  // Initialize
  commander.start();

  // Check status every 5 seconds
  const statusInterval = setInterval(() => {
    const status = commander.getStatus();
    console.log(`
    State: ${status.state}
    Cycles: ${status.cyclesCompleted}
    Patterns: ${status.patternCount}
    Intents: ${status.intentCount}
    Last cycle: ${new Date(status.lastCycleTime).toISOString()}
    `);
  }, 5000);

  // Log intents as they're generated
  const originalOnIntent = commander['onIntentGenerated'];
  // commander['onIntentGenerated'] = (intent: Intent) => {
  //   console.log(`\n[TIP] New Intent: ${intent.title} [Priority: ${intent.priority}]`);
  //   console.log(`   ${intent.description}`);
  // };

  // Run for 60 seconds then stop
  setTimeout(() => {
    console.log('\n[STOP] Stopping commander...');
    commander.stop();
    clearInterval(statusInterval);
    process.exit(0);
  }, 60000);
}

// ============================================================================
// SCENARIO 2: Integration with Z-Core (Browser)
// ============================================================================

async function integrateBrowserZ() {
  console.log('[API] Z-Intelligence + Z-Core (Browser) Integration\n');

  // Assume Z-Core modules are available on window:
  // - window.ZEnergyResponse.getEnergy()
  // - window.ZEnergyResponse.getHarmony()
  // - window.ZEmotionFilter.getEmotionalState()

  interface WindowWithZ extends Window {
    ZEnergyResponse?: any;
    ZEmotionFilter?: any;
  }

  const w = window as unknown as WindowWithZ;

  // Feed Z-Core data into Z-Memory continuously
  const feedInterval = setInterval(async () => {
    try {
      const energy = w.ZEnergyResponse?.getEnergy?.() ?? 0;
      const harmony = w.ZEnergyResponse?.getHarmony?.() ?? 0;
      const emotion = w.ZEmotionFilter?.getEmotionalState?.() ?? {};

      await sharedMemory.write({
        source: 'z-core',
        type: 'energy-state',
        data: {
          energy,
          harmony,
          coherence: emotion.coherence,
          responseMode: emotion.responseMode,
        },
        priority: 60,
      });
    } catch (err) {
      console.error('Error feeding Z-Core data:', err);
    }
  }, 2000); // Match Z-Core pulse cycle

  // Start commander
  commander.start();

  // Display intents in UI
  const displayIntents = () => {
    const intents = commander.getLastIntents();
    if (intents.length > 0) {
      console.log(`\n[LIST] Current Intents (${intents.length}):`);
      for (const intent of intents) {
        console.log(`  [${intent.priority}] ${intent.title}`);
      }
    }
  };

  // Update UI every 3 seconds
  const uiInterval = setInterval(displayIntents, 3000);

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(feedInterval);
    clearInterval(uiInterval);
    commander.stop();
  });
}

// ============================================================================
// SCENARIO 3: Test/Debug Mode
// ============================================================================

async function debugMode() {
  console.log('[DEBUG] Z-Intelligence Debug Mode\n');

  // Don't auto-start
  // commander.start();

  // Simulate some memory entries
  console.log('Adding test memory entries...');
  for (let i = 0; i < 10; i++) {
    await sharedMemory.write({
      source: 'test',
      type: 'energy',
      data: { energy: 50 + Math.random() * 50 },
      priority: 50,
    });
  }

  console.log('Memory stats:', sharedMemory.getStats());

  // Run a single debug cycle
  console.log('\nRunning debug cycle...');
  await commander.debugCycle();

  // Show results
  console.log('\nLast patterns:', commander.getLastPatterns());
  console.log('Last intents:', commander.getLastIntents());
}

// ============================================================================
// SCENARIO 4: Custom Integration
// ============================================================================

class MyApp {
  private intentHandlers: Map<string, (intent: Intent) => void> = new Map();

  constructor() {
    // Register intent handlers
    this.on('cyclic', (intent: Intent) => {
      console.log('[CYCLE] Cyclic pattern - updating UI...');
      this.updateEnergyChart();
    });

    this.on('drift', (intent: Intent) => {
      console.log('[TREND] Drift detected - showing notification...');
      this.showNotification(intent);
    });

    this.on('anomaly', (intent: Intent) => {
      console.log('[WARN]  Anomaly - logging investigation...');
      this.logAnomaly(intent);
    });
  }

  on(type: string, handler: (intent: Intent) => void) {
    this.intentHandlers.set(type, handler);
  }

  handleIntent(intent: Intent) {
    const handler = this.intentHandlers.get(intent.type);
    if (handler) {
      handler(intent);
    }
  }

  updateEnergyChart() {
    console.log('  -> Updating energy visualization...');
  }

  showNotification(intent: Intent) {
    console.log(`  -> Notification: ${intent.title}`);
  }

  logAnomaly(intent: Intent) {
    console.log(`  -> Logged: ${intent.description}`);
  }

  start() {
    console.log('MyApp starting Z-Commander...');

    // Custom callback
    const origOnIntent = commander['onIntentGenerated'];
    commander['onIntentGenerated'] = (intent: Intent) => {
      this.handleIntent(intent);
      if (origOnIntent) origOnIntent(intent);
    };

    commander.start();
  }

  stop() {
    commander.stop();
    console.log('MyApp stopped.');
  }
}

// ============================================================================
// USAGE
// ============================================================================

// Choose one:

// runStandaloneServer();           // Node.js standalone
// integrateBrowserZ();             // Browser with Z-Core
// debugMode();                     // Debug/testing
const app = new MyApp();
app.start();
// app.stop();

// ============================================================================
// OUTPUT EXAMPLE
// ============================================================================

/*

[START] Z-Intelligence Standalone Server Starting...

State: running
Cycles: 1
Patterns: 2
Intents: 1
Last cycle: 2026-01-16T10:34:22.123Z

[TIP] New Intent: Cyclic Pattern Detected [Priority: 60]
   Your system shows rhythmic energy fluctuations...

State: running
Cycles: 2
Patterns: 3
Intents: 2
Last cycle: 2026-01-16T10:34:27.456Z

[TIP] New Intent: System Improving [Priority: 70]
   Emotional coherence is improving...

*/
