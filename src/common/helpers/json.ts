export function safetyJSONParse<TReturn>(value?: string | null): TReturn | undefined {
  if (!value) {
    return undefined
  }

  try {
    return JSON.parse(value) as TReturn
  } catch {
    return undefined
  }
}
