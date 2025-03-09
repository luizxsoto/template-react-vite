import { resolve } from 'path'

import { Config, defineConfig, devices } from '@playwright/test'

export const playwrightBaseConfig: Config = {
  testDir: resolve(process.cwd(), 'tests'),
  timeout: 120000,
  expect: { timeout: 10000 },
  outputDir: resolve(process.cwd(), 'reports/test-results'),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 2,
  maxFailures: 5,
  reporter: [
    ['list', { printSteps: true }],
    ['html', { outputFolder: resolve(process.cwd(), 'reports/playwright'), open: 'never' }],
    [
      'junit',
      { outputFolder: resolve(process.cwd(), 'reports/coverage/result.xml'), open: 'never' },
    ],
  ],
  use: {
    baseURL: 'http://localhost:8000',
    trace: 'on-first-retry',
    locale: 'pt-BR',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run test:mock',
    url: 'http://localhost:8000',
    reuseExistingServer: !process.env.CI,
  },
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
// eslint-disable-next-line import/no-default-export
export default defineConfig(playwrightBaseConfig)
