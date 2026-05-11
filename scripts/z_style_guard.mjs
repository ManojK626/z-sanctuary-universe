import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../');
const IGNORED_DIRS = new Set(['node_modules', '.git', '.vscode', 'safe_pack', 'docs']);
const TARGET_EXTENSIONS = new Set(['.html', '.css']);

const driftPatterns = [
  { label: 'hard-coded background', regex: /background\s*:\s*#/i },
  { label: 'hard-coded color', regex: /color\s*:\s*#/i },
  { label: '.panel/.card class', regex: /class="[^"]*\b(panel|card)\b[^"]*"/i },
  { label: 'inline <style>', regex: /<style[\s>]/i },
];

function walk(dir, callback) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, callback);
    } else if (TARGET_EXTENSIONS.has(path.extname(entry.name))) {
      callback(fullPath);
    }
  }
}

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = driftPatterns
      .filter((pattern) => pattern.regex.test(content))
      .map((pattern) => pattern.label);

    if (issues.length) {
      console.warn(`⚠ Style drift detected in ${filePath}: ${issues.join(', ')}`);
    }
  } catch (error) {
    console.error(`⚠ Unable to read ${filePath}: ${error.message}`);
  }
}

function main() {
  console.log('🚦 Running Z Style Guard...');
  walk(ROOT, scanFile);
  console.log('✅ Z Style Guard complete.');
}

main();
