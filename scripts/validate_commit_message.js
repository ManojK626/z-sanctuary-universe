// Z: scripts\validate_commit_message.js
import { execSync } from 'child_process';

function readCommitMessage() {
  const msg = execSync('git log -1 --pretty=%B', { encoding: 'utf8' }).trim();
  return msg;
}

function listChangedFiles() {
  try {
    const output = execSync('git diff --cached --name-only', { encoding: 'utf8' }).trim();
    if (output) return output.split(/\r?\n/);
  } catch {
    // ignore and fall back to last commit
  }
  const output = execSync('git diff --name-only HEAD~1..HEAD', { encoding: 'utf8' }).trim();
  return output ? output.split(/\r?\n/) : [];
}

function hasTag(message, tag) {
  const re = new RegExp(`^${tag}:\\s*.+$`, 'im');
  return re.test(message);
}

function requiresEthicsTags(files) {
  return files.some(
    (file) =>
      file.startsWith('rules/') ||
      file.startsWith('schemas/') ||
      file.includes('/governance/') ||
      file.includes('SKK_RAINBOW_CLOUD')
  );
}

function main() {
  const message = readCommitMessage();
  if (!message) {
    console.error('commit-message: empty commit message');
    process.exit(1);
  }

  const header = message.split(/\r?\n/)[0];
  const conventional =
    /^(feat|fix|chore|refactor|docs|test|build|ci|perf|revert|style)(\([^)]+\))?: .+/;
  if (!conventional.test(header)) {
    console.error('commit-message: first line must follow Conventional Commits');
    process.exit(1);
  }

  const files = listChangedFiles();
  if (requiresEthicsTags(files)) {
    const missing = [];
    if (!hasTag(message, 'Risk')) missing.push('Risk');
    if (!hasTag(message, 'Consent')) missing.push('Consent');
    if (!hasTag(message, 'Ethical-Intent')) missing.push('Ethical-Intent');

    if (missing.length) {
      console.error(`commit-message: missing required tags: ${missing.join(', ')}`);
      process.exit(1);
    }
  }

  console.log('commit-message: ok');
}

main();
