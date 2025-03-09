import { TELEPHONE_LENGTH } from '@/common/constants/phone'
import { numberUnmask } from '@/common/helpers/number'

export function phoneMask(value?: string | null): string {
  const valueSanitized = numberUnmask(value)

  if (valueSanitized.length <= TELEPHONE_LENGTH) {
    return valueSanitized
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  }

  return valueSanitized
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1')
}
