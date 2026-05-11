// Z: core\z_commit_core.js
import fs from 'fs';
import crypto from 'crypto';

export const ZCommitCore = {
  commit(file, note = '') {
    try {
      const data = fs.readFileSync(file, 'utf8');
      const hash = crypto.createHash('sha256').update(data).digest('hex');
      const entry = {
        file,
        hash,
        note,
        time: new Date().toISOString(),
        mood:
          (typeof localStorage !== 'undefined' && localStorage.getItem('lastDominantMood')) ||
          'neutral',
      };
      fs.appendFileSync('./data/commit_log.json', JSON.stringify(entry) + '\n');
      console.log(`🧾 Z-Commit recorded for ${file}`);
    } catch (err) {
      console.error('❌ Commit failed:', err.message);
    }
  },
};
