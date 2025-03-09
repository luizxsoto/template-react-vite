import { IDLE_TIMER_TIMEOUT_IN_MS } from '@/common/constants/idle-timer'
import {
  getLastActionAtRepository,
  saveLastActionAtRepository,
} from '@/common/repositories/idle-timer'

export function checkIsIdle(): boolean {
  const now = new Date().getTime()
  saveLastActionAtRepository(now)
  const lastActionAt = getLastActionAtRepository()
  return lastActionAt ? lastActionAt < now - IDLE_TIMER_TIMEOUT_IN_MS : false
}
