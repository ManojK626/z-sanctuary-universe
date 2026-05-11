#!/bin/sh
# Pre-commit hook: Run Z-Commit Scribe for ethics-tagged commit messages
FILES=$(git diff --cached --name-only | grep -E 'zflow/|core/|extensions/|config/')
if [ -n "$FILES" ]; then
  npx node scripts/z_commit_scribe.js --files $FILES || true
fi
