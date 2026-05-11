// Z: core\z_branch_bridge.js
import fs from 'fs';
import path from 'path';
import { ZCommitCore } from './z_commit_core.js';
import { ZAutoBranch } from './z_autobranch.js';

export const ZBranchBridge = {
  /**
   * Called each time a file is saved.
   * - creates branch backup
   * - records commit receipt
   * - logs event for dashboard
   */
  async recordEvent(file, note = 'auto-save') {
    try {
      // 1. Auto-branch backup
      ZAutoBranch.backup(file);

      // 2. Commit receipt
      ZCommitCore.commit(file, note);

      // 3. Chronicle entry
      const entry = {
        time: new Date().toISOString(),
        file,
        note,
        mood:
          (typeof localStorage !== 'undefined' && localStorage.getItem('lastDominantMood')) ||
          'neutral',
      };
      fs.appendFileSync('./data/chronicle_events.json', JSON.stringify(entry) + '\n');

      // 4. Signal dashboard update (browser only)
      if (typeof window !== 'undefined' && window.ZDashboard) {
        window.ZDashboard.refreshLastEvent(entry);
      }

      console.log(`🕊️ Z-Bridge event recorded for ${path.basename(file)}`);
    } catch (err) {
      console.error('❌ Bridge failed:', err.message);
    }
  },
};
