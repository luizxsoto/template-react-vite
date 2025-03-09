export function ptBrCurrencyMask(value: number | string): string {
  return Number(value).toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function ptBrCurrencyToNumberString(value: string): string {
  const parsedValue = value
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
    .replace('R$', '')

  if (parsedValue.includes('.')) {
    const splittedValue = parsedValue.split('.')
    return Number(splittedValue[1]) > 0 ? parsedValue : splittedValue[0]
  }

  return parsedValue
}

export function numberUnmask(value?: string | null): string {
  return (value ?? '').replace(/[^\d]/g, '')
}
