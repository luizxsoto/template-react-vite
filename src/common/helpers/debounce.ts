import { DEBOUNCE_DEFAULT_WAIT_MS } from '@/common/constants/debounce'

let time!: NodeJS.Timeout

export function debounceEvent<TArgs = unknown, TReturn = unknown>(
  fn: (...args: TArgs[]) => Promise<TReturn> | TReturn,
  wait = DEBOUNCE_DEFAULT_WAIT_MS,
) {
  return (...args: TArgs[]): void => {
    clearTimeout(time)
    time = setTimeout(async () => fn(...args), wait)
  }
}

export async function sleepEvent(wait = DEBOUNCE_DEFAULT_WAIT_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, wait))
}
