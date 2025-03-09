const lastActionAtKey = '@template-react-vite/idleTimer:lastActionAt'

export function saveLastActionAtRepository(time: number): void {
  localStorage.setItem(lastActionAtKey, JSON.stringify(time))
}

export function getLastActionAtRepository(): number | null {
  const lastActionAt = localStorage.getItem(lastActionAtKey)
  return lastActionAt ? Number(lastActionAt) : null
}

export function removeLastActionAtRepository(): void {
  localStorage.removeItem(lastActionAtKey)
}
