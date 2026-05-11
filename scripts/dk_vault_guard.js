// Z: scripts\dk_vault_guard.js
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import readline from 'readline';

const repoRoot = process.cwd();
const vaultDir = path.join(repoRoot, 'safe_pack', 'z_sanctuary_vault');
const configPath = path.join(vaultDir, 'DK_VAULT_CONFIG.json');
const unlockPath = path.join(vaultDir, '.unlock');

function sha256(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function prompt(question, { silent = false } = {}) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    if (!silent) {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer.trim());
      });
      return;
    }

    const onData = (char) => {
      char = char + '';
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          process.stdin.pause();
          break;
        default:
          process.stdout.clearLine(0);
          process.stdout.cursorTo(0);
          process.stdout.write(question + '*'.repeat(rl.line.length));
          break;
      }
    };

    process.stdin.on('data', onData);
    rl.question(question, (answer) => {
      process.stdin.removeListener('data', onData);
      rl.close();
      process.stdout.write('\n');
      resolve(answer.trim());
    });
  });
}

function ensureVault() {
  if (!fs.existsSync(vaultDir)) {
    throw new Error('Vault directory not found.');
  }
}

function writeConfig(config) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function readConfig() {
  if (!fs.existsSync(configPath)) {
    throw new Error('DK_VAULT_CONFIG.json not found. Run init first.');
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

async function init() {
  ensureVault();

  const usbPath = await prompt('USB path (e.g., E:\\\\Z_VAULT_KEY): ');
  const phone = await prompt('Phone number (hash only, not stored): ');
  const pin = await prompt('PIN (6 digits): ', { silent: true });
  const phrase = await prompt('Phrase (3–6 words): ', { silent: true });

  if (!/^\d{6}$/.test(pin)) {
    throw new Error('PIN must be exactly 6 digits.');
  }

  const deviceKey = crypto.randomBytes(32).toString('hex');
  const deviceKeyPath = path.join(usbPath, 'Z_DEVICE.key');
  fs.mkdirSync(usbPath, { recursive: true });
  fs.writeFileSync(deviceKeyPath, deviceKey);

  const config = {
    status: 'sealed',
    mode: 'dk-vault',
    device_key: {
      location: 'usb-only',
      path_hint: deviceKeyPath,
      hash: sha256(deviceKey),
    },
    phone_hash: sha256(phone),
    pin_hash: sha256(pin),
    phrase_hash: sha256(phrase.toLowerCase()),
    created_at_utc: new Date().toISOString(),
  };

  writeConfig(config);
  console.log('DK-Vault initialized. Device key written to USB.');
}

async function unlock() {
  ensureVault();
  const config = readConfig();

  const usbPath = await prompt('USB path (contains Z_DEVICE.key): ');
  const deviceKeyPath = path.join(usbPath, 'Z_DEVICE.key');
  if (!fs.existsSync(deviceKeyPath)) {
    throw new Error('Device key not found on USB path.');
  }
  const deviceKey = fs.readFileSync(deviceKeyPath, 'utf8').trim();
  if (sha256(deviceKey) !== config.device_key.hash) {
    throw new Error('Device key does not match vault hash.');
  }

  const phone = await prompt('Phone number: ');
  const pin = await prompt('PIN (6 digits): ', { silent: true });
  const phrase = await prompt('Phrase (3–6 words): ', { silent: true });

  if (
    sha256(phone) !== config.phone_hash ||
    sha256(pin) !== config.pin_hash ||
    sha256(phrase.toLowerCase()) !== config.phrase_hash
  ) {
    throw new Error('Key verification failed.');
  }

  fs.writeFileSync(
    unlockPath,
    JSON.stringify({ unlocked_at_utc: new Date().toISOString() }, null, 2)
  );
  console.log('Vault unlocked.');
}

function lock() {
  ensureVault();
  if (fs.existsSync(unlockPath)) fs.unlinkSync(unlockPath);
  console.log('Vault locked.');
}

function status() {
  ensureVault();
  const configExists = fs.existsSync(configPath);
  const unlocked = fs.existsSync(unlockPath);
  console.log(`Config: ${configExists ? 'present' : 'missing'}`);
  console.log(`Status: ${unlocked ? 'unlocked' : 'locked'}`);
}

async function main() {
  const command = process.argv[2];
  if (!command) {
    console.log('Usage: node scripts/dk_vault_guard.js <init|unlock|lock|status>');
    process.exit(1);
  }

  if (command === 'init') return init();
  if (command === 'unlock') return unlock();
  if (command === 'lock') return lock();
  if (command === 'status') return status();

  console.log('Unknown command.');
  process.exit(1);
}

main().catch((err) => {
  console.error(`DK-Vault error: ${err.message}`);
  process.exit(1);
});
