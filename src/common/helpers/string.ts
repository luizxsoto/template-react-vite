export function compareStrings(value: string, valueToIncludes: string): boolean {
  const valuesNormalized = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(' ')

  const valuesToIncludesNormalized = valueToIncludes
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(' ')

  return valuesToIncludesNormalized.every(
    (valueToIncludesNormalized) =>
      !valueToIncludesNormalized ||
      valuesNormalized.some((valueNormalized) =>
        valueNormalized.includes(valueToIncludesNormalized),
      ),
  )
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
    const r = (Math.random() * 16) | 0,
      v = char === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
