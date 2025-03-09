import { IDLE_TIMER_TIMEOUT_IN_MS } from '@/common/constants/idle-timer'
import { getLastActionAtRepository } from '@/common/repositories/idle-timer'

export function checkIsIdle(userId: string): boolean {
  const now = new Date().getTime()
  const lastActionAt = getLastActionAtRepository()
  return lastActionAt
    ? lastActionAt.userId === userId && lastActionAt.time < now - IDLE_TIMER_TIMEOUT_IN_MS
    : false
}
