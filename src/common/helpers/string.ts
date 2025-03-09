export function compareStrings(value: string, valueToIncludes: string): boolean {
  const valueNormalized = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  const valueToIncludesNormalized = valueToIncludes
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  return valueNormalized.includes(valueToIncludesNormalized)
}

export function getFirstFilledStringOrDefault(
  strings: Array<string | null | undefined>,
  defaultString: string,
): string {
  return strings.find((str) => !!str) ?? defaultString
}

export function removeSpaces(value?: string): string {
  const parsedValue = (value ?? '').replace(/\s\s+/g, ' ')

  return parsedValue.trim()
}

export function safetyAtoB(value?: string | null): string | undefined {
  if (!value) {
    return undefined
  }

  try {
    return atob(value)
  } catch {
    return undefined
  }
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
    const r = (Math.random() * 16) | 0,
      v = char === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
