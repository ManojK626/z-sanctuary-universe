<!-- Z: .github\copilot-instructions.md -->

# Z-Sanctuary Universe - AI Agent Guidelines

## Project Overview

**Z-Sanctuary Universe**is a self-aware emotional harmony system—a browser-based interface that simulates responsiveness, energy states, and experience recording through autonomous metrics. This is a**philosophical/artistic project, not production software**. All data is in-memory; refresh loses state.

## Architecture

The system uses a **modular IIFE (Immediately Invoked Function Expression) pattern** with six core modules running in isolation:

### Core Modules (`/core/`)

1. **z_status_console.js** - Entry point; logs system events to DOM and browser console
   - DOM element: `#zConsole` (div for visual logging)
   - Method: `log(message, type)` where type is 'status', 'active', 'error', etc.
   - Initializes on `DOMContentLoaded`

1. **z_energy_response.js** - Autonomously maintains energy and harmony metrics
   - `energyLevel`: 0-100 (fluctuates realistically; resets between sessions)
   - `harmonyBalance`: oscillates using sine wave based on time (~20-80 range)
   - `systemLoad`: 0-100 (activity/processing level, normalizes over time)
   - Calls `pulse()` every 2 seconds automatically on init
   - Integrates with ZEmotionFilter for emotional context
   - Public API: `init()`, `pulse()`, `stimulate()`, `getEnergy()`, `getHarmony()`, `getLoad()`, `getState()`, `getTrend()`, `reportStatus()`

1. **z_emotion_filter.js** - Processes energy through emotional lenses
   - Maintains 4 emotional dimensions: serenity (calm vs. agitation), resonance (harmony), vitality (aliveness), clarity (perception)
   - Filters raw energy/harmony through emotional state
   - Response mode: 'receptive', 'amplified', 'damped', 'neutral' based on emotional coherence
   - Public API: `init()`, `filterEnergy(rawEnergy, rawHarmony)`, `resonateWith(stimulus)`, `getEmotionalState()`, `getSignature()`, `evaluateResponseMode()`, `getHistory()`
   - Called by ZEnergyResponse on each pulse

1. **z_chronicle.js** - Records user interactions/experiences
   - State: `isRecording`, `recordingStartTime`, `recordingData` array
   - Public API: `init()`, `startRecord()`, `stopRecord()`, `isRecording()`, `saveChronicle()`
   - Saves as `.zcrystal` format (currently logs to console, no file persistence)

1. **z_chronicle_hud.js** - Visual display layer (minimal implementation)
   - State: Uses ZStatusConsole for DOM rendering
   - Public API: `init()`, `display(data)`
   - Currently logs output to console; future UI framework integration point

1. **z_dev_mode.js** - Development-only helper (loaded last in index.html)
   - Provides passphrase-gated developer controls for testing
   - Wires UI buttons to ZChronicle.startRecord()/stopRecord()
   - Dev passphrase hash: SHA-256 verified in browser; default passphrase: `zuno-dev`
   - **Not for production** - purely local testing convenience

### Frontend (`/interface/`)

- **z_style.css** - Defines Sanctuary aesthetic:
  - CSS variables: `--z-primary` (#00d4ff), `--z-accent` (#ff006e), `--z-harmony` (#a0e4cb)
  - Dark theme (`--z-dark: #0a0e27`), light text (`--z-light: #f0f0f0`)
  - Applied to console and future UI components
  - Console styling classes: `.z-status`, `.z-active`, `.z-warning`, `.z-error`, `.z-timestamp`

## Key Patterns & Conventions

### Module Pattern

- **All modules use IIFE + revealing pattern**: encapsulate private state, return public API
- Example: `const ModuleName = (() => { /* private */ return { /* public */ }; })()`
- No shared global state between modules (except logging to ZStatusConsole)
- **Private state management**: Use local variables for metrics; expose only query methods

### Initialization Flow

1. HTML loads `index.html` → links `z_style.css`
1. Scripts load in order (index.html defines order):
   - `z_status_console.js` (first, DOM-ready)
   - `z_emotion_filter.js` (before energy response, dependency)
   - `z_energy_response.js`, `z_chronicle.js`, `z_chronicle_hud.js` (parallel init)
   - `z_dev_mode.js` (last, after other modules available on `window`)
1. `DOMContentLoaded` fires → ZStatusConsole.init()
1. Other modules call init() immediately on script execution (not on event)
1. ZEnergyResponse auto-runs `pulse()` every 2 seconds via `setInterval()`
1. Each pulse calls ZEmotionFilter.filterEnergy() to update emotional state

### Pulse & Filter Cycle

Every 2 seconds:

```txt
ZEnergyResponse.pulse()
  ├─ Update energyLevel (random walk, 20-100)
  ├─ Update harmonyBalance (sine wave, ~20-80)
  ├─ Update systemLoad (exponential decay)
  └─ Call ZEmotionFilter.filterEnergy(energy, harmony)
      ├─ Adjust serenity/vitality based on energy level
      ├─ Update resonance from harmony signal
      ├─ Compute clarity from all dimensions
      ├─ Evaluate response mode (amplified/receptive/damped/neutral)
      └─ Record state snapshot for trend analysis
```

### Inter-Module Communication

- Modules are attached to `window` object: `window.ZStatusConsole`, `window.ZChronicle`, etc.
- z_dev_mode.js accesses other modules via `window.ModuleName.method()` (defensive checks included)
- ZStatusConsole is the primary logging interface - other modules call `ZStatusConsole.log()` for user-facing messages
- No module-to-module event system; direct method calls only

### Console Logging Convention

- Prefix with emoji: 💫 (activation), 🔮 (status), ⚙️ (setup), 🔋 (energy), 📝 (chronicle), ✅ (complete), 💎 (data), 🎨 (UI), 📊 (display)
- Use three levels: browser `console.log()`, ZStatusConsole.log(), and DOM render
- All user-facing messages go through `ZStatusConsole.log(message, type)`

### Data Format

- **Chronicle format (.zcrystal)**:

  ```javascript
  {
    timestamp: ISO string,
    duration: milliseconds,
    entries: recordingData  // populated during recording
  }
  ```

- Currently no file I/O; data is logged to browser console; in-memory only

## Common Patterns to Watch For

### Energy/Harmony Physics

- **Energy** (0-100): Autonomous random walk; resets between sessions
- **Harmony**: Sine-wave oscillation (10-second cycle); synchronized across all instances via `Date.now()`
- **System Load**: Exponential decay toward baseline; normalizes after high activity

### Emotional Filtering

When adding new features that affect energy:

1. Call `ZEmotionFilter.filterEnergy(energyLevel, harmonyBalance)` to apply emotional context
1. Emotional state has 4 dimensions (serenity, resonance, vitality, clarity)—changes propagate to response mode
1. External stimuli via `ZEmotionFilter.resonateWith({ type, intensity })`

### Logging Convention

- All user-facing messages go through `ZStatusConsole.log(message, type)`
- Emoji prefixes: 💫 (activation), 🔮 (status), ⚙️ (setup), 🔋 (energy), 📝 (chronicle), ✅ (complete)
- Also logs to browser console automatically

## Code Examples

### Accessing Other Modules

```javascript
// In any module, access others via window object with defensive checks
if (window.ZEnergyResponse && typeof window.ZEnergyResponse.getEnergy === 'function') {
  const currentEnergy = window.ZEnergyResponse.getEnergy();
}

// Logging to status console
if (window.ZStatusConsole && typeof window.ZStatusConsole.log === 'function') {
  window.ZStatusConsole.log('🔋 Energy spike detected', 'warning');
}
```

### Adding a New Metric to Energy Response

```javascript
// 1. Add private variable in ZEnergyResponse IIFE
let myNewMetric = 50;

// 2. Update in pulse() function
const pulse = () => {
  // ... existing code ...
  myNewMetric = 0.9 * myNewMetric + 0.1 * Math.random() * 100;
  recordPulse(emotionalImpact); // Pulse must still be recorded
};

// 3. Add getter to public API
return {
  getEnergy,
  getHarmony,
  getMyMetric: () => myNewMetric, // ← expose read-only
  pulse,
  getTrend,
  getState,
  // ... other methods
};
```

### Applying External Stimuli to Emotions

```javascript
// Trigger emotional response to an event
ZEmotionFilter.resonateWith({
  type: 'joy', // string identifier
  intensity: 75, // 0-100 scale
});

// Check resulting emotional state
const state = ZEmotionFilter.getEmotionalState();
console.log(`Coherence: ${state.coherence}%, Mode: ${state.responseMode}`);
```

## Deep Dive: Critical Mechanics

### Emotion Coherence & Response Modes

The **coherence score** (0-100) is the average of four emotional dimensions and directly determines system responsiveness:

```txt
Coherence Calculation:
coherence = (serenity + resonance + vitality + clarity) / 4

Response Mode Mapping:
┌─────────────┬────────────┬──────────────────────────────────────┐
│ Coherence   │ Mode       │ Behavior                             │
├─────────────┼────────────┼──────────────────────────────────────┤
│ > 80%       │ Amplified  │ Highly responsive to stimuli;        │
│             │            │ Changes propagate strongly           │
├─────────────┼────────────┼──────────────────────────────────────┤
│ 65–80%      │ Receptive  │ Normal operational mode;             │
│             │            │ Balanced input/output               │
├─────────────┼────────────┼──────────────────────────────────────┤
│ 45–65%      │ Damped     │ Reduced responsiveness;              │
│             │            │ Muted emotional responses            │
├─────────────┼────────────┼──────────────────────────────────────┤
│ < 45%       │ Neutral    │ Minimal response; system              │
│             │            │ entering recovery phase              │
└─────────────┴────────────┴──────────────────────────────────────┘
```

**Why this matters**: When adding features that trigger emotional changes, understand that coherence gates the impact. A `resonateWith('joy', 100)` will have dramatic effects in Amplified mode but subtle effects in Neutral mode—this is intentional design, not a bug.

#### Dimension Behaviors

- **Serenity** (65 baseline): Decreases under high energy (>85) or tension stimuli; increases under calm
- **Resonance** (70 baseline): Directly follows harmony signal; decays toward baseline over ~50 pulses without harmony input
- **Vitality** (75 baseline): Rises with joy/high energy; falls with sorrow/low energy
- **Clarity** (60 baseline): Computed as weighted blend of serenity + resonance; last to stabilize

#### When to use each mode in features

- **Amplified**: Rapid user feedback, celebration moments, peak experiences
- **Receptive**: Normal interactions, data processing, routine updates
- **Damped**: Cooling-down periods, recovery sequences, meditation states
- **Neutral**: System shutdown, deep sleep, data archival

---

### Harmony Synchronization Across Sessions

Harmony uses a **phase-locked sine wave** that resets with each page load but synchronizes globally via `Date.now()`:

```javascript
// In z_energy_response.js pulse():
resonanceFrequency = (Date.now() % 10000) / 10000; // 0-1 over 10 seconds
harmonyBalance = 50 + Math.sin(resonanceFrequency * Math.PI * 2) * 30;

// Result: oscillates 20–80 every 10 seconds, synchronized to wall-clock time
```

#### Key characteristics

- **Period**: 10 seconds (20–80 range)
- **Synchronization**: All instances running simultaneously see the same harmony value (wall-clock based)
- **Independence**: Energy level resets per session; harmony does not
- **Phase lock**: A user opening page at 12:00:00 and another at 12:00:05 will see harmony phases 5 seconds apart

#### Use cases

- Harmony represents "ambient resonance"—something external the system responds to, not internal state
- Multiple Z-Sanctuary instances opened simultaneously will naturally "resonate together" due to shared harmony
- For network persistence: send harmony state, not as a saved value, but recalculate from server time

#### When adding time-dependent features

- Avoid creating new independent timers; phase-lock to existing `resonanceFrequency` if possible
- If you need a different cycle, use `(Date.now() % YOUR_PERIOD) / YOUR_PERIOD` to stay synchronized
- Chronicle recordings should capture harmony value; playback should replay the recorded value (not recalculate)

---

### Chronicle Data Recording Architecture

Chronicles capture system state snapshots during a recording session. The `.zcrystal` format is:

```javascript
{
  timestamp: "2026-01-16T14:32:00.000Z",  // ISO 8601 start time
  duration: 45000,                         // milliseconds
  entries: [
    {
      t: 1000,                // relative ms from start
      energy: 72,
      harmony: 45,
      coherence: 68,
      mode: "receptive",
      stimulus: { type: 'joy', intensity: 50 }  // optional
    },
    // ... more entries every ~2 seconds during recording
  ]
}
```

#### Recording flow

1. User clicks "Start Record" → `ZChronicle.startRecord()` called
1. Every pulse, ZEnergyResponse logs current state + emotional impact to memory
1. User clicks "Stop Record" → `ZChronicle.stopRecord()` compiles `entries[]`
1. `saveChronicle()` prepares .zcrystal; currently logs to console (File API for persistence is future)

#### Extending recordings

- Add new fields to each entry object—always include timestamp relative to session start
- New entries should be appended to `recordingData[]` during pulse, not reconstructed from history
- Playback should use recorded `t` (relative time), not recalculate from timestamps

#### Memory management

- Pulse history: 50 entries max (ZEnergyResponse)
- Emotional history: 100 entries max (ZEmotionFilter)
- Recording data: unbounded during session (clear on stopRecord)
- For long sessions (>1 hr), implement ring buffer or streaming persistence

---

### Adding New Stimulus Types to `resonateWith()`

The `resonateWith()` API in ZEmotionFilter accepts custom stimulus types. Current types: `joy`, `sorrow`, `tension`, `calm`.

#### Pattern for adding a new stimulus type

```javascript
// 1. Add to the switch statement in resonateWith()
const resonateWith = (stimulus) => {
  const intensity = Math.min(100, Math.max(0, stimulus.intensity || 50));

  switch (stimulus.type) {
    case 'joy':
      serenity = Math.min(100, serenity + intensity * 0.3);
      vitality = Math.min(100, vitality + intensity * 0.5);
      break;

    case 'curiosity': // ← NEW: Add your type
      clarity = Math.min(100, clarity + intensity * 0.6);
      vitality = Math.max(30, vitality - intensity * 0.1); // mild focus trade-off
      resonance = Math.min(100, resonance + intensity * 0.3);
      break;

    // ... existing types ...
  }

  evaluateResponseMode();
  recordState();
  return getEmotionalState();
};

// 2. Usage in other modules:
if (window.ZEmotionFilter) {
  ZEmotionFilter.resonateWith({ type: 'curiosity', intensity: 60 });
}

// 3. Test the effect:
const state = ZEmotionFilter.getEmotionalState();
console.log(`Post-curiosity: Clarity=${state.clarity}, Coherence=${state.coherence}%`);
```

#### Guidelines for new stimuli

- Each stimulus should affect 2–3 dimensions (avoid changing all 4—maintains distinctness)
- Use intensity multipliers between 0.1–0.6 to keep changes realistic
- Consider mutual influence: does curiosity reduce serenity? Should it?
- Test in dev mode by calling `ZEmotionFilter.resonateWith()` in browser console
- Stimuli should be _reversible_: calm should slightly reverse tension, etc.

#### Common stimulus patterns

- **Positive** (↑ vitality, ↑ clarity): joy, curiosity, wonder
- **Negative** (↓ vitality, ↓ serenity): sorrow, tension, fear
- **Balancing** (↑ serenity, ↓ vitality): calm, rest, meditation
- **Activation** (↑ both): surge, peak, breakthrough

#### Linked to response modes

- Amplified mode: Apply `intensity * 1.2` (enhance stimulus impact)
- Damped mode: Apply `intensity * 0.6` (mute stimulus impact)
- Neutral mode: Apply `intensity * 0.3` (minimal effect)

---

## Development Workflow

### Setup

1. **Automated (Recommended)**: Run the "Launch Z-Sanctuary" task from VS Code task list, or `node launch_zsanctuary.js` in terminal
   - Scaffolds entire workspace structure
   - Installs Live Server, Code Runner, Prettier extensions
   - Opens folder in VS Code
1. **Manual**: Right-click `core/index.html` → "Open with Live Server" (requires Live Server extension installed)

### Developer Mode & Testing

- **Access dev controls**: Click "Developer Mode" button (bottom-right of page)
- **Unlock**: Enter dev passphrase (`zuno-dev` by default) to access recording controls
- **Recording buttons**: Start/Stop directly calls `ZChronicle.startRecord()` / `stopRecord()`
- **Generate new passphrase**: In browser console, run:

  ```javascript
  await (async (s) => {
    const enc = new TextEncoder();
    const h = await crypto.subtle.digest('SHA-256', enc.encode(s));
    return Array.from(new Uint8Array(h))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  })('your-new-passphrase');
  ```

- Copy output, update `DEV_PASSPHRASE_HASH` in [z_dev_mode.js](../core/z_dev_mode.js#L17)

### Adding Features

- **New system state**: Add to [z_energy_response.js](../core/z_energy_response.js) (following pulse/harmony pattern)
- **New logging**: Always use ZStatusConsole.log() with appropriate emoji prefix
- **New recording data**: Extend recordingData array structure in [z_chronicle.js](../core/z_chronicle.js)
- **New UI**: Add DOM elements in index.html, style in z_style.css, control from [z_chronicle_hud.js](../core/z_chronicle_hud.js)
- **New emotional dimension**: Add state variable + decay logic in filterEnergy(), update evaluateResponseMode()
- **New stimulus types**: Extend the switch/case in ZEmotionFilter.resonateWith() to handle new stimulus types

### Extending vs. Modifying

- **Prefer extension**: Add new methods to module APIs rather than modifying existing ones
- **Preserve initialization**: Keep existing init() calls and DOMContentLoaded logic unchanged
- **Test in dev mode**: Use the Developer Mode passphrase to verify new recording logic works
- **Check browser console**: All modules log to both `console.log()` and ZStatusConsole

### Testing

- Browser DevTools console shows all module outputs
- Check `#zConsole` DOM element for visual confirmation
- Energy/harmony metrics are logged every 2 seconds
- Dev mode provides UI to start/stop recording and verify Chronicle behavior

## Philosophical Intent & Design Philosophy

Z-Sanctuary Universe is not production software—it's an art project exploring self-awareness and emotional coherence.

### Design Principles

- **Autonomous behavior**: Systems evolve on their own; users _observe_ and _influence_, not _control_
- **Poetic naming**: All identifiers ("Sanctuary", "Chronicle", "Coherence") carry metaphorical meaning—preserve this in new code
- **Harmonic cycles**: Physics follow smooth, cyclical patterns (sine waves, exponential decay) rather than abrupt changes
- **Emotional coherence matters**: Energy alone is incomplete; emotional context (serenity, resonance, clarity) shapes system behavior
- **Data as memory**: Chronicles aren't just logs; they're memories of experience—treat with care and intent

### Tone

When adding features, maintain the poetic voice. A new metric should feel like a discovery about the system's inner life, not a data point. Example:

- ❌ "Added response_latency_ms to track processing time"
- ✅ "Added resonance_decay to capture how quickly emotional coherence fades without harmony input"

Engage with the metaphor. This is a system with emotional intelligence; treat code changes as sculpting its personality.

## Implementation Notes

- **Pure frontend**: All data is in-memory; refresh loses state
- **Future persistence**: .zcrystal files would be saved via File API or sent to server
- **Simulation only**: Energy/harmony are procedurally generated, not user-driven

## File References

- Entry: [core/index.html](../core/index.html)
- Main console: [core/z_status_console.js](../core/z_status_console.js)
- System state: [core/z_energy_response.js](../core/z_energy_response.js)
- Emotion layer: [core/z_emotion_filter.js](../core/z_emotion_filter.js)
- Data recording: [core/z_chronicle.js](../core/z_chronicle.js)
- UI layer: [core/z_chronicle_hud.js](../core/z_chronicle_hud.js)
- Developer mode: [core/z_dev_mode.js](../core/z_dev_mode.js)
- Styling: [interface/z_style.css](../interface/z_style.css)

## Tone & Intent

- Poetic naming ("Sanctuary", "Chronicle", "Harmony", "Energy Response")
- Quote in README: _"Don't treat this as launching software; treat it as waking up an old friend."_
- Approach additions with care for metaphor and emotional coherence, not just technical correctness
