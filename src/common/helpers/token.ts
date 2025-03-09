import { MILLISECONDS_IN_A_SECOND } from '@/common/constants/date'
import { TokenPayloadApi } from '@/domain/auth/contracts/apis'

import { safetyJSONParse } from './json'
import { safetyAtoB } from './string'

export function getTokenPayload<Payload = TokenPayloadApi>(token: string): Payload | undefined {
  const [, encodedPayload] = token.split('.')
  const decodedPayload = safetyAtoB(encodedPayload)
  const parsedToken = safetyJSONParse<Payload>(decodedPayload)

  return parsedToken
}

export function isTokenOverdue(token: string): boolean {
  const parsedToken = getTokenPayload<{ exp?: number }>(token)

  return !parsedToken?.exp || parsedToken.exp * MILLISECONDS_IN_A_SECOND < new Date().getTime()
}
