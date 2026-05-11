// Z: scripts\safe_pack_runner.js
const { execSync } = require('child_process');
const allow = new Set(['lint', 'markdown_format', 'docs_format']);
function run(cmd) {
  execSync(cmd, { stdio: 'inherit' });
}
const pack = process.argv[2];
if (!pack) {
  console.log('Safe pack runner commands: lint, markdown_format, docs_format');
  process.exit(0);
}
if (!allow.has(pack)) {
  console.error(`Pack "${pack}" not allowed.`);
  process.exit(1);
}
switch (pack) {
  case 'lint':
    run('npm run lint');
    break;
  case 'markdown_format':
    run('npx markdownlint-cli2 "**/*.md" --fix');
    break;
  case 'docs_format':
    run('npx prettier --write docs/**/*.md');
    break;
}
