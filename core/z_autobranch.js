// Z: core\z_autobranch.js
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const ZAutoBranch = {
  /**
   * Creates a dated branch copy of a file before editing.
   * Keeps last 5 copies per file.
   */
  backup(file) {
    const name = path.basename(file);
    const branchDir = `./data/branches/${name}`;
    fs.mkdirSync(branchDir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const target = `${branchDir}/${stamp}_${name}`;
    fs.copyFileSync(file, target);
    console.log(`🌿 Auto-branch saved: ${target}`);

    // cleanup old backups
    const files = fs.readdirSync(branchDir).sort().slice(0, -5);
    for (const f of files) fs.unlinkSync(path.join(branchDir, f));
  },

  /**
   * Generates a hash so the system knows if the file really changed.
   */
  hash(file) {
    return crypto.createHash('sha256').update(fs.readFileSync(file, 'utf8')).digest('hex');
  },
};
