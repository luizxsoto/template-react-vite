import { chromium } from 'playwright'
import { playAudit } from 'playwright-lighthouse'

import {
  LIGHTHOUSE_CONFIGS,
  LIGHTHOUSE_PORT,
  LIGHTHOUSE_THRESHOLDS,
} from '@tests/constants/lighthouse'
import { test } from '@tests/fixtures'
import { user01TokenMock } from '@tests/mocks/auth'

test.beforeEach(async ({ context }) => {
  await context.addInitScript(
    ({ tokenMock }) => {
      if (window.location.hostname === 'localhost') {
        localStorage.setItem(tokenMock.key, JSON.stringify(tokenMock.value))
      }
    },
    { tokenMock: user01TokenMock },
  )
})

test('home', async ({ page }) => {
  const browser = await chromium.launch({
    args: [`--remote-debugging-port=${LIGHTHOUSE_PORT}`],
  })

  await page.goto('/')

  await playAudit({
    page,
    thresholds: LIGHTHOUSE_THRESHOLDS,
    config: LIGHTHOUSE_CONFIGS,
    port: LIGHTHOUSE_PORT,
  })

  await browser.close()
})
