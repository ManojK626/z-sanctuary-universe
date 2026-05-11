// Z: scripts\z_commit_scribe.js
import { execSync } from 'child_process';
import http from 'http';
import https from 'https';
import { URL } from 'url';

function getStagedDiff() {
  try {
    return execSync('git diff --cached', { encoding: 'utf8' }).trim();
  } catch (err) {
    throw new Error(`git diff --cached failed: ${err.message}`);
  }
}

function postJson(targetUrl, payload) {
  const url = new URL(targetUrl);
  const body = JSON.stringify(payload);
  const transport = url.protocol === 'https:' ? https : http;

  const options = {
    method: 'POST',
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname + url.search,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  return new Promise((resolve, reject) => {
    const req = transport.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`LLM server error ${res.statusCode}: ${data}`));
          return;
        }
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(new Error(`Invalid JSON response: ${err.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function buildPrompt(diff) {
  return [
    'You are Z-Commit Scribe.',
    'Return a Conventional Commit message with a risk tag and ethics tags when relevant.',
    'Format:',
    '  <type>(<scope>): <summary> [risk:low|medium|high|sacred]',
    '  ',
    '  Risk: <low|medium|high|sacred>',
    '  Consent: <auto|notify|require_human|n/a>',
    '  Ethical-Intent: <short reason>',
    '  ',
    'Summarize what changed and why. Keep it concise.',
    'Diff:',
    diff,
  ].join('\n');
}

async function main() {
  const diff = getStagedDiff();
  if (!diff) {
    console.error('z_commit_scribe: no staged changes');
    process.exit(1);
  }

  const url = process.env.Z_SCRIBE_URL || 'http://127.0.0.1:11434/api/generate';
  const model = process.env.Z_SCRIBE_MODEL || 'qwen2.5-coder:7b';

  const payload = {
    model,
    prompt: buildPrompt(diff),
    stream: false,
  };

  try {
    const response = await postJson(url, payload);
    const text = response.response || response.output || '';
    if (!text.trim()) {
      throw new Error('empty response');
    }
    console.log(text.trim());
  } catch (err) {
    console.error(`z_commit_scribe: ${err.message}`);
    console.error('Tip: set Z_SCRIBE_URL and Z_SCRIBE_MODEL for your local LLM runtime.');
    process.exit(1);
  }
}

main();
