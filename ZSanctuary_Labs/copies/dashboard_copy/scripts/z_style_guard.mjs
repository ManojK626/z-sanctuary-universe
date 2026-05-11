import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(new URL(import.meta.url).pathname, '../');
const IGNORED_DIRS = new Set(['node_modules', '.git', '.vscode', 'safe_pack', 'docs']);
const FILE_PATTERNS = ['.html', '.css'];

const driftPatterns = [
  { label: 'hard-coded background', regex: /background\s*:\s*#/i },
  { label: 'hard-coded color', regex: /color\s*:\s*#/i },
  { label: '.panel/.card class', regex: /class="[^"]*\b(panel|card)\b[^"]*"/i },
  { label: 'inline <style>', regex: /<style[\s>]/i },
];

function walk(dir, callback) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    if (IGNORED_DIRS.has(entry.name)) return;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, callback);
    } else if (FILE_PATTERNS.includes(path.extname(entry.name))) {
      callback(fullPath);
    }
  });
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = driftPatterns
    .map((pattern) => {
      if (pattern.regex.test(content)) {
        return pattern.label;
      }
      return null;
    })
    .filter(Boolean);

  if (issues.length) {
    console.warn(`⚠ Style drift detected in ${filePath}: ${issues.join(', ')}`);
  }
}

function main() {
  console.log('🚦 Running Z Style Guard...');
  walk(ROOT, scanFile);
  console.log('✅ Z Style Guard complete.');
}

main();
