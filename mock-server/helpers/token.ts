import { MILLISECONDS_IN_A_SECOND } from '@/common/constants/date'

export function makeToken({ uid }: { uid: number }): string {
  const now = new Date()
  const expires = new Date()
  expires.setHours(now.getHours() + 1)
  const accessToken = `header.${btoa(
    JSON.stringify({ uid, exp: expires.getTime() / MILLISECONDS_IN_A_SECOND }),
  )}.verify_signature`

  return accessToken
}
