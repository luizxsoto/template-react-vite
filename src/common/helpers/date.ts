import {
  DATE_LENGTH,
  DATE_PT_REGEX_COMPLETE,
  DATE_PT_REGEX_INCOMPLETE,
  DATE_STANDARD,
} from '@/common/constants/date'

import { numberUnmask } from './number'

export function isoDateTimeToStandard(date: string): string {
  return new Date(date).toLocaleString(undefined, DATE_STANDARD)
}

export function isoDateToStandard(date: string, hour = '10', minute = '00', second = '00'): string {
  const [year, month, day] = date.split('T')[0].split('-')

  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`)
    .toLocaleDateString(undefined, DATE_STANDARD)
    .slice(0, DATE_LENGTH)
}

export function standardDateToIso(date: string, hour = '10', minute = '00', second = '00'): string {
  const [day, month, year] = date.split('/')

  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`).toISOString()
}

export function standardDateToNewDate(
  date: string,
  hour = '10',
  minute = '00',
  second = '00',
): Date {
  const [day, month, year] = date.split('/')

  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`)
}

export function ptBrDateToIso(date: string): string {
  if (DATE_PT_REGEX_COMPLETE.test(date)) {
    const parsedDate = date.replace(/' '/g, '')
    const [day, month, year] = parsedDate.split('/')
    return `${year}-${month}-${day}`
  }

  if (DATE_PT_REGEX_INCOMPLETE.test(date)) {
    const parsedDate = date.replace(/' '/g, '')
    const [day, month] = parsedDate.split('/')
    return `${month}-${day}`
  }

  return date
}

export function standardDateMask(value: string): string {
  const unmaskedValue = numberUnmask(value)

  return unmaskedValue
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\/\d{4})\d+?$/, '$1')
}
