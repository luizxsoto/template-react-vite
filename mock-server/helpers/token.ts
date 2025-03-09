import { HOURS_IN_A_DAY, MILLISECONDS_IN_A_SECOND } from '@/common/constants/date'
import { Token } from '@/domain/auth/contracts/models'

export function makeToken({ userId }: { userId: string }): Token {
  const now = new Date()
  const accessTokenExp = new Date()
  accessTokenExp.setHours(now.getHours() + 1)
  const accessToken = `header.${btoa(
    JSON.stringify({ userId, exp: accessTokenExp.getTime() / MILLISECONDS_IN_A_SECOND }),
  )}.verify_signature`
  const refreshTokenExp = new Date()
  refreshTokenExp.setHours(now.getHours() + HOURS_IN_A_DAY)
  const refreshToken = `header.${btoa(
    JSON.stringify({ userId, exp: refreshTokenExp.getTime() / MILLISECONDS_IN_A_SECOND }),
  )}.verify_signature`

  return { accessToken, refreshToken }
}
