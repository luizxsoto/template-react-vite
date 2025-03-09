import { expect, test } from '@tests/fixtures'
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

test('should has correct title', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle('Template React Vite 📝')
})
