const fs = require('fs');
const glob = require('glob');

function ensureBlankLines(content) {
  const lines = content.split(/\r?\n/);
  const result = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const prev = result[result.length - 1] || '';
    const next = lines[i + 1] || '';

    const isHeading = /^#{1,6}\s/.test(line);
    const isList = /^\s*[-*+]\s/.test(line) || /^\s*\d+\.\s/.test(line);

    if ((isHeading || isList) && prev !== '') {
      if (result[result.length - 1] !== '') {
        result.push('');
      }
    }

    result.push(line);

    if ((isHeading || isList) && next !== '') {
      result.push('');
    }

    while (result.length >= 2 && result[result.length - 1] === '' && result[result.length - 2] === '') {
      result.pop();
    }
  }

  return result.join('\n').replace(/\n{3,}/g, '\n\n');
}

function cleanFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  const normalized = ensureBlankLines(content);
  if (normalized !== content) {
    fs.writeFileSync(file, normalized);
    console.log('Normalized', file);
  }
}

const targets = process.argv.slice(2);
if (!targets.length) {
  targets.push('Amk_Goku Worldwide Loterry/data/_snapshots/**/commentary/*.md');
  targets.push('Amk_Goku Worldwide Loterry/data/reports/commentary/*.md');
  targets.push('Amk_Goku Worldwide Loterry/roadmap/README.md');
}

targets.forEach(pattern => {
  glob.sync(pattern, { nodir: true }).forEach(file => cleanFile(file));
});
