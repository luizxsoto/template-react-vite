import { CPF_LENGTH } from '@/common/constants/document'
import { numberUnmask } from '@/common/helpers/number'

export function documentMask(value?: string | null): string {
  const unmaskedValue = numberUnmask(value)

  if (unmaskedValue.length <= CPF_LENGTH) {
    return unmaskedValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  return unmaskedValue
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}
