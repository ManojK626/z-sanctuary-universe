import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const POLICY_PATH = path.join(ROOT, 'config', 'z_extension_guard_policy.json');
const SETTINGS_PATH = path.join(ROOT, '.vscode', 'settings.json');
const EXTENSIONS_PATH = path.join(ROOT, '.vscode', 'extensions.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_extension_guard.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_extension_guard.md');

const APPLY = process.argv.includes('--apply');

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
}

function runCmd(bin, args) {
  const isCmdScript = process.platform === 'win32' && /\.(cmd|bat)$/i.test(String(bin));
  if (isCmdScript) {
    const quotedBin = `"${String(bin).replace(/"/g, '\\"')}"`;
    const quotedArgs = args.map((a) => `"${String(a).replace(/"/g, '\\"')}"`).join(' ');
    const command = `${quotedBin}${quotedArgs ? ` ${quotedArgs}` : ''}`;
    return spawnSync('cmd.exe', ['/d', '/s', '/c', command], {
      cwd: ROOT,
      encoding: 'utf8',
      windowsHide: true,
      shell: false,
    });
  }
  return spawnSync(bin, args, { cwd: ROOT, encoding: 'utf8', windowsHide: true, shell: false });
}

function setByPath(obj, key, value) {
  obj[key] = value;
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function getCodeBinary() {
  const candidates = ['code.cmd', 'code'];
  if (process.platform === 'win32') {
    const userLocal = process.env.LOCALAPPDATA
      ? path.join(process.env.LOCALAPPDATA, 'Programs', 'Microsoft VS Code', 'bin', 'code.cmd')
      : null;
    const userHomeFallback = path.join(
      os.homedir(),
      'AppData',
      'Local',
      'Programs',
      'Microsoft VS Code',
      'bin',
      'code.cmd'
    );
    const progFiles = process.env.ProgramFiles
      ? path.join(process.env.ProgramFiles, 'Microsoft VS Code', 'bin', 'code.cmd')
      : null;
    const progFilesX86 = process.env['ProgramFiles(x86)']
      ? path.join(process.env['ProgramFiles(x86)'], 'Microsoft VS Code', 'bin', 'code.cmd')
      : null;
    for (const p of [userLocal, userHomeFallback, progFiles, progFilesX86]) {
      if (p && fs.existsSync(p)) {
        candidates.unshift(p);
      }
    }
    const whereRes = runCmd('where.exe', ['code']);
    if (whereRes.status === 0) {
      const fromWhere = String(whereRes.stdout || '')
        .split(/\r?\n/)
        .map((x) => x.trim())
        .filter(Boolean);
      for (const p of fromWhere) {
        candidates.unshift(p);
      }
    }
  }
  for (const c of candidates) {
    const probe = runCmd(c, ['--version']);
    if (probe.status === 0) return c;
  }
  return null;
}

function listInstalledExtensions(codeBin) {
  const res = runCmd(codeBin, ['--list-extensions', '--show-versions']);
  if (res.status !== 0) return [];
  return String(res.stdout || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split('@')[0].trim().toLowerCase());
}

function normalizeExtId(id) {
  return String(id || '').trim().toLowerCase();
}

function run() {
  const generatedAt = new Date().toISOString();
  const policy = readJson(POLICY_PATH, {});
  const requiredSettings = policy.required_settings || {};
  const requiredRecommendations = Array.isArray(policy.required_recommendations)
    ? policy.required_recommendations
    : [];

  const settings = readJson(SETTINGS_PATH, {});
  const extensions = readJson(EXTENSIONS_PATH, {});
  const recommendations = Array.isArray(extensions.recommendations) ? extensions.recommendations : [];
  const checks = [];
  const actions = [];

  // Settings enforcement
  for (const [key, expected] of Object.entries(requiredSettings)) {
    const actual = settings[key];
    const pass = deepEqual(actual, expected);
    checks.push({
      id: `setting_${key.replaceAll('.', '_')}`,
      pass,
      note: `expected=${JSON.stringify(expected)} actual=${JSON.stringify(actual)}`,
    });
    if (!pass && APPLY) {
      setByPath(settings, key, expected);
      actions.push(`set ${key}=${JSON.stringify(expected)}`);
    }
  }

  // Recommendations manifest check
  const recLc = recommendations.map(normalizeExtId);
  const missingInRecommendations = requiredRecommendations
    .filter((id) => !recLc.includes(normalizeExtId(id)));

  checks.push({
    id: 'required_recommendations_manifested',
    pass: missingInRecommendations.length === 0,
    note:
      missingInRecommendations.length === 0
        ? `count=${requiredRecommendations.length}`
        : `missing=${missingInRecommendations.join(', ')}`,
  });

  if (missingInRecommendations.length > 0 && APPLY) {
    const next = Array.from(new Set([...recommendations, ...missingInRecommendations]));
    extensions.recommendations = next;
    actions.push(`added recommendations: ${missingInRecommendations.join(', ')}`);
  }

  // Installed extensions check (best effort)
  const codeBin = getCodeBinary();
  let installedMissing = [];
  let installedMissingFinal = [];
  if (codeBin) {
    const installedBefore = listInstalledExtensions(codeBin);
    installedMissing = requiredRecommendations.filter(
      (id) => !installedBefore.includes(normalizeExtId(id))
    );

    if (APPLY && installedMissing.length > 0) {
      for (const extId of installedMissing) {
        const installRes = runCmd(codeBin, ['--install-extension', extId]);
        const ok = installRes.status === 0;
        actions.push(`${ok ? 'installed' : 'failed'} ${extId}`);
      }
    }

    const installedAfter = APPLY ? listInstalledExtensions(codeBin) : installedBefore;
    installedMissingFinal = requiredRecommendations.filter(
      (id) => !installedAfter.includes(normalizeExtId(id))
    );
    checks.push({
      id: 'required_recommendations_installed',
      pass: installedMissingFinal.length === 0,
      note:
        installedMissingFinal.length === 0
          ? `installed=${requiredRecommendations.length}`
          : `missing=${installedMissingFinal.join(', ')}`,
    });
  } else {
    checks.push({
      id: 'code_cli_available',
      pass: true,
      note: 'VS Code CLI not found; installation audit skipped (settings/recommendations still enforced).',
    });
  }

  if (APPLY) {
    fs.writeFileSync(SETTINGS_PATH, `${JSON.stringify(settings, null, 2)}\n`);
    fs.writeFileSync(EXTENSIONS_PATH, `${JSON.stringify(extensions, null, 2)}\n`);
  }

  const failed = checks.filter((c) => !c.pass);
  const status = failed.length === 0 ? 'green' : 'hold';

  const payload = {
    generated_at: generatedAt,
    status,
    mode: APPLY ? 'apply' : 'audit',
    checks,
    actions,
    policy_version: policy.version || '1.0.0',
    metrics: {
      required_settings: Object.keys(requiredSettings).length,
      required_recommendations: requiredRecommendations.length,
      missing_recommendations_manifest: missingInRecommendations.length,
      missing_recommendations_installed: installedMissingFinal.length || installedMissing.length,
    },
    note:
      status === 'green'
        ? 'Extension/tool posture aligned with Z-SSWS guard policy.'
        : 'Extension/tool posture drift detected. Run apply mode or manual correction.',
  };

  writeJson(OUT_JSON, payload);
  const md = [
    '# Z Extension Guard',
    '',
    `Generated: ${generatedAt}`,
    `Status: ${status.toUpperCase()}`,
    `Mode: ${payload.mode}`,
    '',
    '## Checks',
    ...checks.map((c) => `- [${c.pass ? 'x' : ' '}] ${c.id}: ${c.note}`),
    '',
    '## Actions',
    ...(actions.length ? actions.map((a) => `- ${a}`) : ['- none']),
    '',
    `Note: ${payload.note}`,
    '',
  ];
  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
  fs.writeFileSync(OUT_MD, md.join('\n'));

  console.log(`✅ Extension guard written: ${OUT_JSON}`);
}

run();
