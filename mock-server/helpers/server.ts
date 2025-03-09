import { match } from 'path-to-regexp'

import { MOCK_SERVER_RESPONSE_DELAY } from '@mock-server/constants'
import { Request } from '@mock-server/types'

export async function delay(time = MOCK_SERVER_RESPONSE_DELAY): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time))
}

export function matchRouteAndNormalize(
  routePath: string,
  requestUrl: string,
): Pick<Request, 'pathParams' | 'queryParams'> | null {
  const [url, queryParams] = requestUrl.split('?')

  const matched = match<Record<string, string>>(routePath)(url)

  if (!matched) {
    return null
  }

  return {
    pathParams: matched.params,
    queryParams: Object.fromEntries(new URLSearchParams(queryParams).entries()),
  }
}
