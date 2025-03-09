let time!: NodeJS.Timeout

export function debounceEvent<TArgs = unknown, TReturn = unknown>(
  fn: (...args: TArgs[]) => Promise<TReturn> | TReturn,
  wait = 500,
) {
  return (...args: TArgs[]): void => {
    clearTimeout(time)
    time = setTimeout(async () => fn(...args), wait)
  }
}
