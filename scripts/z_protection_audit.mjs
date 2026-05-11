import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORT_PATH = path.join(ROOT, 'data', 'reports', 'z_protection_audit.json');

const targets = [
  { file: 'Amk_Goku Worldwide Loterry/ui/public_trust/index.html', required: true },
  { file: 'core/index.html', required: false },
];

function readFile(relPath) {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) return null;
  return fs.readFileSync(full, 'utf8');
}

function hasProtectionScript(text) {
  return (
    text.includes('/core/z_content_protection.js') ||
    text.includes('./z_content_protection.js') ||
    text.includes('../core/z_content_protection.js') ||
    text.includes('../../core/z_content_protection.js')
  );
}

function run() {
  const results = targets.map((target) => {
    const text = readFile(target.file);
    if (text === null) {
      return { file: target.file, required: target.required, exists: false, protected: false, note: 'missing' };
    }
    const protectedScript = hasProtectionScript(text);
    return {
      file: target.file,
      required: target.required,
      exists: true,
      protected: protectedScript,
      note: protectedScript ? 'ok' : 'missing content protection script',
    };
  });

  const required = results.filter((r) => r.required);
  const requiredProtected = required.filter((r) => r.protected).length;

  const report = {
    generated_at: new Date().toISOString(),
    protected_count: requiredProtected,
    checked_count: required.length,
    optional_checked_count: results.length - required.length,
    results,
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`Protection audit complete. ${report.protected_count}/${report.checked_count} protected.`);
  console.log(`Report: ${REPORT_PATH}`);
}

run();
