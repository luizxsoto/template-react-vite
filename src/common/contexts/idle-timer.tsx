import { useSnackbar } from 'notistack'
import { createContext, useEffect } from 'react'
import { useIdleTimer } from 'react-idle-timer'

import { IDLE_TIMER_THROTTLE, IDLE_TIMER_TIMEOUT_IN_MS } from '@/common/constants/idle-timer'
import { i18n } from '@/common/i18n'
import {
  removeLastActionAtRepository,
  saveLastActionAtRepository,
} from '@/common/repositories/idle-timer'
import { checkIsIdle } from '@/common/services/idle-timer'
import { useAuth } from '@/domain/auth/contexts'

interface IdleTimerProviderProps {
  children: React.ReactNode
}

export const IdleTimerContext = createContext({})

export function IdleTimerProvider({ children }: IdleTimerProviderProps): JSX.Element {
  const { isSigned, logout, loggedUser } = useAuth()
  const { enqueueSnackbar } = useSnackbar()

  function onIdle(): void {
    enqueueSnackbar(i18n().common.exceptions.unauthorizedException, {
      variant: 'warning',
    })
    logout()
  }

  function onAction(): void {
    if (loggedUser) {
      saveLastActionAtRepository({ userId: loggedUser.roleFormatted, time: new Date().getTime() })
    }
  }

  const idleTimer = useIdleTimer({
    onIdle,
    onAction,
    disabled: !isSigned,
    crossTab: true,
    timeout: IDLE_TIMER_TIMEOUT_IN_MS,
    throttle: IDLE_TIMER_THROTTLE,
  })

  useEffect(() => {
    if (!isSigned) {
      idleTimer.pause()
      removeLastActionAtRepository()
    } else {
      if (loggedUser?.id) {
        if (checkIsIdle(loggedUser.id)) {
          logout()
        } else {
          idleTimer.reset()
          onAction()
        }
      }
    }
    // DOCS: this useEffect can only run if isSigned or loggedUser?.id changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSigned, loggedUser?.id])

  return <IdleTimerContext.Provider value={{}}>{children}</IdleTimerContext.Provider>
}
