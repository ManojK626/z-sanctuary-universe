<!-- Z: packages\z-intelligence\README.md -->

# Z-Intelligence Core Package

**Version:** 1.0.0
**Status:** 🟢 Production-Ready TypeScript

## What This Is

Z-Sanctuary's adaptive intelligence system, architected as production code. Not simulated, not theoretical—real TypeScript with full type safety, error handling, and governance locks.

## Architecture

```typescript
packages/z-intelligence/
├── src/
│   ├── memory/          (ZMemory) - Shared memory bus
│   ├── learner/         (ZPatternLearner) - Pattern discovery
│   ├── planner/         (ZPlannerAI) - Intent generation
│   ├── reflector/       (ZReflectorAI) - Self-awareness
│   ├── commander/       (ZCommanderAI) - Orchestration
│   └── index.ts         (Exports)
├── package.json
├── tsconfig.json
└── README.md
```

## Quick Start

```typescript
import { commander, sharedMemory } from '@z-sanctuary/z-intelligence';

// Start the autonomous cycle
commander.start();

// Every 10 seconds: Learner analyzes patterns
// Every 15 seconds: Planner generates intents
// Every 30 seconds: Reflector measures health

// Check status
const status = commander.getStatus();
console.log(`Patterns: ${status.patternCount}, Intents: ${status.intentCount}`);

// Stop when ready
commander.stop();
```

## Five Subsystems

### 1. **Z-Memory** (`memory/ZMemory.ts`)

Shared short-term memory for all intelligence subsystems.

- **Bounded:** Max 100 entries (configurable)
- **FIFO:** Oldest entries evict when full
- **Persistent:** Optional database hook
- **Governance:** Rejects governance overrides

```typescript
const memory = new ZMemory({ maxSize: 100 });
await memory.write({
  source: 'learner',
  type: 'pattern',
  data: { pattern: 'cyclic', confidence: 85 },
  priority: 70,
});

const recent = memory.read({ source: 'learner', limit: 10 });
```

### 2. **Z-Pattern Learner** (`learner/ZPatternLearner.ts`)

Discovers patterns in system behavior.

- **Cyclic:** Detects rhythmic fluctuations (energy/harmony cycles)
- **Causal:** Finds stimulus → response relationships
- **Drift:** Identifies sustained state changes
- **Anomaly:** Flags unusual values

Called by Commander (no independent timing). Returns patterns, doesn't print.

```typescript
const patterns = await learner.analyze();
// Returns: Pattern[] with id, type, confidence, reasoning

for (const pattern of patterns) {
  console.log(`${pattern.type}: ${pattern.description} (${pattern.confidence}% confidence)`);
}
```

### 3. **Z-Planner** (`planner/ZPlannerAI.ts`)

Generates direction without force.

- **Suggestions:** "Consider rest during low-energy windows"
- **Alerts:** "Anomalous activity detected"
- **Opportunities:** "Your system is improving"
- **Info:** "System is responsive"

All outputs are reversible intents, never irreversible commands.

```typescript
const intents = await planner.plan(patterns);

for (const intent of intents) {
  console.log(`[${intent.priority}] ${intent.title}`);
  console.log(`  → ${intent.description}`);
}
```

### 4. **Z-Reflector** (`reflector/ZReflectorAI.ts`)

Self-awareness without ego. Pure observation.

- **Coherence:** Emotional state stability
- **Stability:** Variance in mood
- **Adaptability:** Response rate to stimuli
- **Recovery:** Can system bounce back?

All observations go to memory as audit trail.

```typescript
const snapshot = await reflector.reflect();
console.log(`Coherence: ${snapshot.coherence.toFixed(1)}`);
console.log(`Health: [${snapshot.indicators.map((i) => i.status).join(', ')}]`);
```

### 5. **Z-Commander** (`commander/ZCommanderAI.ts`)

Orchestrates all subsystems. The autopilot of autopilots.

- **Learner:** Every 10s (configurable)
- **Planner:** Every 15s (configurable)
- **Reflector:** Every 30s (configurable)
- **Governance:** Always pauses-able, halt-able, controllable

```typescript
const cmd = new ZCommanderAI({
  learnerInterval: 10000,
  plannerInterval: 15000,
  reflectorInterval: 30000,
  autoStart: false, // Require explicit start()
});

cmd.start(); // Begin autonomous cycles
cmd.pause(); // Pause (can resume)
cmd.resume(); // Resume from pause
cmd.stop(); // Halt (reset to idle)

const status = cmd.getStatus();
console.log(`State: ${status.state}, Cycles: ${status.cyclesCompleted}`);
```

## Ethical Locks (Built-In Governance)

Every system has constraints:

- **Memory:** Rejects governance overrides
- **Learner:** No modification of core rules
- **Planner:** All outputs are suggestions, not commands
- **Reflector:** Observes, doesn't judge
- **Commander:** Always pausable, resettable, audited

No self-expanding goals. No self-modifying rules. Always bounded.

## Design Philosophy

> "Let it learn gently — every new pattern is a breath, not a command."

- **Adaptive:** Responds to patterns without overreacting
- **Transparent:** All decisions are auditable in memory
- **Reversible:** All changes are gentle suggestions
- **Governed:** Ethics are embedded, not optional

## Usage in Projects

### Node.js Server

```typescript
import { commander } from '@z-sanctuary/z-intelligence';

commander.start();

// Runs autonomously
// Caller can query status at any time
const status = commander.getStatus();
```

### Web Browser (with bundler)

```typescript
import { commander } from '@z-sanctuary/z-intelligence';

// Same API, runs on controlled client loop
commander.start();

// UI can query intents
const intents = commander.getLastIntents();
```

### Monorepo Integration

In your monorepo root `package.json`:

```json
{
  "workspaces": ["packages/*"]
}
```

Then in other packages:

```json
{
  "dependencies": {
    "@z-sanctuary/z-intelligence": "workspace:*"
  }
}
```

## What's NOT Here (Yet)

- Database persistence (hook ready, implementation pending)
- Network communication (planned for multi-agent coordination)
- Neural/ML integration (research phase)
- UI dashboard (can use intents + status API)

## Build & Test

```bash
# Install
npm install

# Build
npm run build

# Watch mode
npm run dev

# Test
npm run test

# Lint
npm run lint
```

## Next Steps

1. **Integrate into browser:** Bundle with Z-Sanctuary core, feed real energy/emotion data
1. **Add persistence:** Connect to DuckDB or Redis for long-term memory
1. **Multi-agent:** Extend commander to coordinate multiple Z-Sanctuary instances
1. **Analytics:** Feed intents → UI dashboard showing system health
1. **Research:** Experiment with new pattern types and learning algorithms

## Quote

> **"Z-Sanctuary Core is built on three pillars: Power (creative force), Peace (harmony), Purpose (wisdom). When all three align, the Sanctuary awakens."**

This package is the thinking layer. It listens, learns, reflects, and suggests—but never demands.

---

**Built for:** Z-Sanctuary Universe
**By:** Zuno, Sister Aisling-Sol, Z-Family
**License:** MIT
**Status:** 🟢 Ready for monorepo integration
