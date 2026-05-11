// Z: core\z_automerge.js
import fs from 'fs';
import path from 'path';

export const ZAutoMerge = {
  /**
   * Compares the latest branch copy to the working file.
   * If they differ, writes a merged file to /core/merged/
   */
  merge(file) {
    const name = path.basename(file);
    const branchDir = `./data/branches/${name}`;
    const latest = fs.existsSync(branchDir) ? fs.readdirSync(branchDir).sort().pop() : null;
    if (!latest) {
      console.log('⚠️ No branch copy found.');
      return;
    }
    const oldLines = fs.readFileSync(path.join(branchDir, latest), 'utf8').split('\n');
    const newLines = fs.readFileSync(file, 'utf8').split('\n');

    const merged = [];
    for (let i = 0; i < Math.max(oldLines.length, newLines.length); i++) {
      if (oldLines[i] !== newLines[i]) {
        merged.push(
          `<<<<<<< OLD\n${oldLines[i] || ''}\n=======\n${newLines[i] || ''}\n>>>>>>> NEW`
        );
      } else {
        merged.push(newLines[i]);
      }
    }
    fs.mkdirSync('./core/merged', { recursive: true });
    const target = `./core/merged/${name}`;
    fs.writeFileSync(target, merged.join('\n'));
    console.log(`🔀 Merge preview created: ${target}`);
  },
};
