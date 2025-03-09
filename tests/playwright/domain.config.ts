import { resolve } from 'path'

import { defineConfig } from '@playwright/test'

import { playwrightBaseConfig } from './base.config'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
// eslint-disable-next-line import/no-default-export
export default defineConfig({
  ...playwrightBaseConfig,
  testDir: resolve(process.cwd(), 'tests/e2e/domain'),
  reporter: [
    ['list', { printSteps: true }],
    ['html', { outputFolder: resolve(process.cwd(), 'reports/playwright'), open: 'never' }],
    [
      'junit',
      {
        outputFile: resolve(process.cwd(), 'reports/coverage/result-domain.xml'),
        open: 'never',
      },
    ],
  ],
})
