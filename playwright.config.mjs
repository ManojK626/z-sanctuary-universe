/**
 * Z-SANCTUARY-UI-E2E-PLAYWRIGHT-CHARTER-1
 * Localhost-only browser reality validation. No production bind.
 */
import { defineConfig, devices } from '@playwright/test';

const HOST = '127.0.0.1';
const PORT = 5519;
const BASE = `http://${HOST}:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  timeout: 90_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/e2e-playwright-report.json' }],
  ],
  outputDir: 'test-results/artifacts',
  use: {
    baseURL: BASE,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 8_000,
    navigationTimeout: 20_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `node scripts/z_local_static_server.mjs --host=${HOST} --port=${PORT}`,
    url: `${BASE}/dashboard/index.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});

export { HOST, PORT, BASE };
