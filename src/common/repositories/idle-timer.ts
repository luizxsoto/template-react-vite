import { safetyJSONParse } from '@/common/helpers/json'

const lastActionAtKey = '@backoffice/idleTimer:lastActionAt'

interface LastActionAt {
  userId: string
  time: number
}

export function saveLastActionAtRepository(lastActionAt: LastActionAt): void {
  localStorage.setItem(lastActionAtKey, JSON.stringify(lastActionAt))
}

export function getLastActionAtRepository(): LastActionAt | null {
  const lastActionAt = localStorage.getItem(lastActionAtKey)
  return safetyJSONParse<LastActionAt>(lastActionAt) ?? null
}

export function removeLastActionAtRepository(): void {
  localStorage.removeItem(lastActionAtKey)
}
