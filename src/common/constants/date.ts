export const MILLISECONDS_IN_A_SECOND = 1000

export const SECONDS_IN_A_MINUTE = 60

export const MINUTES_IN_A_HOUR = 60

export const HOURS_IN_A_DAY = 24

export const DAYS_IN_A_WEEK = 7

export const MAX_HOUR = 23

export const MAX_MINUTE = 59

export const MAX_SECOND = 59

export const MAX_MILLISECOND = 999

export const PLACES_TO_REMOVE_SECOND = 3

export const DATE_LENGTH = 10

export const MONTH_YEAR_SIZE = 7

export const PAD_LEFT_ISO_2_PLACES = 2

export const DATE_STANDARD: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}

export const DATE_PT_REGEX_COMPLETE = /^\d{2}\/\d{2}\/\d{4}$/

export const DATE_PT_REGEX_INCOMPLETE = /^\d{2}\/\d{2}/
