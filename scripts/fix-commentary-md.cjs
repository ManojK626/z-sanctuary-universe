const fs = require('fs');
const path = require('path');

const rootArg = process.argv[2];
const root = path.join(
  __dirname,
  '..',
  rootArg ? rootArg : 'Amk_Goku Worldwide Loterry'
);
const pattern = /\.md$/;

const report = {};

function fixFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  let text = raw;

  text = text.replace(/(^|\n)(#{1,6}\s+)/g, '\n$2');
  text = text.replace(/\n([*-]\s+)/g, '\n\n$1');
  text = text.replace(/\n{3,}/g, '\n\n');

  const normalized = text.trimEnd() + '\n';
  fs.writeFileSync(filePath, normalized, 'utf8');
  report[filePath] = (report[filePath] || 0) + 1;
}

function walk(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '.git' || entry.name === 'node_modules') return;
      walk(full);
      return;
    }
    if (entry.isFile() && pattern.test(entry.name)) fixFile(full);
  });
}

if (!fs.existsSync(root)) {
  console.error(`Workspace path not found: ${root}`);
  process.exit(1);
}

walk(root);

const entries = Object.entries(report);
if (!entries.length) {
  console.log('No Markdown files needed adjustment.');
} else {
  console.log('Fixed Markdown files:');
  entries.forEach(([file, count]) => {
    console.log(` - ${path.relative(process.cwd(), file)} (${count} rewrite${count > 1 ? 's' : ''})`);
  });
}
