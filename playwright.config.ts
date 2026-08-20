import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;

/**
 * Some environments ship a Chromium that this Playwright version did not
 * download — a preinstalled build under PLAYWRIGHT_BROWSERS_PATH whose revision
 * does not match, or a headless shell that was never fetched. Pointing at the
 * binary by path uses whatever is actually there instead of failing with
 * "Executable doesn't exist". Where PLAYWRIGHT_CHROMIUM_PATH is unset, Playwright
 * resolves its own download as usual.
 */
const chromiumPath = process.env['PLAYWRIGHT_CHROMIUM_PATH'];
const CHROMIUM =
  chromiumPath === undefined ? {} : { launchOptions: { executablePath: chromiumPath } };

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env['CI']),
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], ...CHROMIUM } },
    { name: 'mobile', use: { ...devices['Pixel 7'], ...CHROMIUM } },
  ],
  webServer: {
    // A plain static server rather than `astro preview`: that command keeps a
    // background daemon, and a second invocation exits immediately, which
    // Playwright reports as the web server having died. See scripts/serve-dist.mjs.
    command: `node scripts/serve-dist.mjs ${PORT}`,
    port: PORT,
    reuseExistingServer: !process.env['CI'],
    timeout: 180_000,
  },
});
