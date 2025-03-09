import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'

import { test as baseTest } from '@playwright/test'

const istanbulCLIOutput = path.join(process.cwd(), '.nyc_output')

export function generateUUID(): string {
  return crypto.randomBytes(16).toString('hex')
}

export const test = baseTest.extend({
  context: async ({ context }, use) => {
    await context.addInitScript(() =>
      window.addEventListener('beforeunload', () =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        (window as any).collectIstanbulCoverage(JSON.stringify((window as any).__coverage__)),
      ),
    )
    await fs.promises.mkdir(istanbulCLIOutput, { recursive: true })
    await context.exposeFunction('collectIstanbulCoverage', (coverageJSON: string) => {
      if (coverageJSON) {
        fs.writeFileSync(
          path.join(istanbulCLIOutput, `coverage_${generateUUID()}.json`),
          coverageJSON,
        )
      }
    })
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(context)
    for (const page of context.pages()) {
      await page.evaluate(() =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        (window as any).collectIstanbulCoverage(JSON.stringify((window as any).__coverage__)),
      )
    }
  },
})

export const describe = test.describe

export const expect = test.expect
