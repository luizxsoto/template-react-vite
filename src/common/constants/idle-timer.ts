import { MILLISECONDS_IN_A_SECOND, SECONDS_IN_A_MINUTE } from './date'

export const IDLE_TIMER_THROTTLE = 60000 // DOCS: 1 minute in milliseconds

export const IDLE_TIMER_TIMEOUT_IN_MS =
  Number(import.meta.env.VITE_IDLE_TIMEOUT_IN_MINUTES) *
  SECONDS_IN_A_MINUTE *
  MILLISECONDS_IN_A_SECOND
