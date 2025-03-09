import { MILLISECONDS_IN_A_SECOND } from '@/common/constants/date'

import { safetyAtoB, safetyJSONParse } from './json'

export function isTokenOverdue(token: string): boolean {
  const [, encodedPayload] = token.split('.')
  const decodedPayload = safetyAtoB(encodedPayload)
  const parsedToken = safetyJSONParse<{ exp?: number }>(decodedPayload)

  return !parsedToken?.exp || parsedToken.exp * MILLISECONDS_IN_A_SECOND < new Date().getTime()
}
