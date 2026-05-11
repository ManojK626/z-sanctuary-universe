// Z: scripts\fix_md031.js
import fs from 'fs';
import path from 'path';

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.git') continue;
      walk(full);
    } else if (e.isFile() && full.endsWith('.md')) {
      fixFile(full);
    }
  }
}

function fixFile(file) {
  let text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  let changed = false;
  // Ensure blank line before opening fence and after closing fence
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^```/.test(line)) {
      // before
      if (i > 0 && lines[i - 1].trim() !== '') {
        lines.splice(i, 0, '');
        changed = true;
        i++; // skip the inserted blank
      }
      // after - check next line index (closing fence case will be handled when encountered)
      // if this is an opening fence, we don't need to ensure blank after here; we'll ensure blank after any closing fence when seen
    }
  }
  // Ensure blank line after closing fences
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^```/.test(line)) {
      // closing fence if next non-empty token is not code (we'll treat any fence as needing a blank after)
      if (i + 1 < lines.length && lines[i + 1].trim() !== '') {
        lines.splice(i + 1, 0, '');
        changed = true;
        i++;
      }
    }
  }
  if (changed) {
    fs.writeFileSync(file, lines.join('\n'));
    console.log('Fixed:', file);
  }
}

walk(process.cwd());
console.log('Done');
