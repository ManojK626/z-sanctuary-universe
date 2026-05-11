// Z: Untitled-4.js
import { narrateWeekly } from './super_ghost/super_ghost_narrator.js';

function scheduleReflection() {
  setInterval(() => {
    const narration = narrateWeekly();
    window.ZChronicle?.log('super_ghost.reflection', narration);
  }, 7 * 24 * 60 * 60 * 1000);
}

scheduleReflection();
