import { numberUnmask } from '@/common/helpers/number'

export function isValidCpf(cpf: string): boolean {
  const cpfSanitized = numberUnmask(cpf)

  if (cpfSanitized.length !== 11 || /^(\d)\1+$/.test(cpfSanitized)) {
    return false
  }

  let sum = 0

  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpfSanitized.charAt(i)) * (10 - i)
  }

  const digitOne = 11 - (sum % 11)
  const digitOneCorrect = digitOne > 9 ? 0 : digitOne

  if (parseInt(cpfSanitized.charAt(9)) !== digitOneCorrect) {
    return false
  }

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpfSanitized.charAt(i)) * (11 - i)
  }

  const digitTwo = 11 - (sum % 11)
  const digitTwoCorrect = digitTwo > 9 ? 0 : digitTwo

  if (parseInt(cpfSanitized.charAt(10)) !== digitTwoCorrect) {
    return false
  }

  return true
}

export function isValidCnpj(cnpj: string): boolean {
  const cnpjSanitized = numberUnmask(cnpj)

  if (cnpjSanitized.length !== 14 || /^(\d)\1+$/.test(cnpjSanitized)) {
    return false
  }

  let sum = 0
  let weight = 2

  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cnpjSanitized.charAt(i)) * weight
    weight = weight === 9 ? 2 : weight + 1
  }

  const digitOne = 11 - (sum % 11)
  const digitOneCorrect = digitOne > 9 ? 0 : digitOne

  if (parseInt(cnpjSanitized.charAt(12)) !== digitOneCorrect) {
    return false
  }

  sum = 0
  weight = 2

  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cnpjSanitized.charAt(i)) * weight
    weight = weight === 9 ? 2 : weight + 1
  }

  const digitTwo = 11 - (sum % 11)
  const digitTwoCorrect = digitTwo > 9 ? 0 : digitTwo

  if (parseInt(cnpjSanitized.charAt(13)) !== digitTwoCorrect) {
    return false
  }

  return true
}

export function isValidDocument(document?: string): boolean {
  if (!document) {
    return true
  }
  return isValidCpf(document) || isValidCnpj(document)
}
