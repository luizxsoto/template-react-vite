import { useQueryClient } from '@tanstack/react-query'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ApplicationException } from '@/common/exceptions/application'
import { useErrorHandler } from '@/common/hooks/error-handler'
import { checkIsIdle } from '@/common/services/idle-timer'

import { CreateSessionHookParams, ShowSessionHookParams } from './contracts/hooks'
import { Session, Token } from './contracts/models'
import { getTokenRepository } from './repositories'
import {
  createSessionService,
  loadTemplateReactViteApiClientService,
  logoutService,
  showSessionService,
} from './services'

interface AuthStateProps {
  isLoading: boolean
  isSigned: boolean
  session?: Session
}

type AuthContextProps = AuthStateProps & {
  getToken: () => Token | null
  createSession: (params: CreateSessionHookParams) => Promise<void>
  showSession: (params: ShowSessionHookParams) => Promise<void>
  logout: () => void
}

const INITIAL_STATE: AuthStateProps = {
  isLoading: false,
  isSigned: false,
  session: undefined,
}
const AuthContext = createContext<AuthContextProps>(INITIAL_STATE as AuthContextProps)

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const { handleError } = useErrorHandler({ ignoreLogout: true })
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [state, setState] = useState<AuthStateProps>(() => {
    const token = loadTemplateReactViteApiClientService()?.token
    const isSigned = !!token && !checkIsIdle()

    if (isSigned) {
      return { ...INITIAL_STATE, isSigned: true, isLoading: true }
    }

    return INITIAL_STATE
  })

  const setStateSafety = useCallback(
    (newData: Partial<AuthStateProps> | ((oldData: AuthStateProps) => Partial<AuthStateProps>)) => {
      if (typeof newData === 'function') {
        setState((oldData) => ({ ...oldData, ...newData(oldData) }))
      } else {
        setState((oldData) => ({ ...oldData, ...newData }))
      }
    },
    [setState],
  )

  const getToken = useCallback(() => {
    return getTokenRepository()
  }, [])

  const logout = useCallback(() => {
    void navigate('/', { replace: true })
    queryClient.clear()
    void queryClient.invalidateQueries()
    logoutService()
    setStateSafety(INITIAL_STATE)
  }, [navigate, queryClient, setStateSafety])

  const createSession = useCallback(
    async ({ params, onError, onSuccess }: CreateSessionHookParams): Promise<void> => {
      try {
        setStateSafety({ isLoading: true })

        const session = await createSessionService(params)

        setStateSafety({ isLoading: false, isSigned: true, session })
        onSuccess?.(session)
      } catch (error) {
        logout()
        const parsedError = error as ApplicationException
        onError?.({ error: parsedError })
        throw parsedError
      }
    },
    [logout, setStateSafety],
  )

  const showSession = useCallback(
    async ({ onError, onSuccess }: ShowSessionHookParams): Promise<void> => {
      try {
        setStateSafety({ isLoading: true })

        const session = await showSessionService()

        queryClient.clear()
        await queryClient.invalidateQueries()

        setStateSafety({ isLoading: false, isSigned: true, session })
        onSuccess?.(session)
      } catch (error) {
        logout()
        const parsedError = error as ApplicationException
        handleError({ error: parsedError })
        onError?.({ error: parsedError })
        throw parsedError
      }
    },
    [handleError, logout, queryClient, setStateSafety],
  )

  useEffect(() => {
    if (state.isSigned && !state.session) {
      void showSession({})
    }
    // DOCS: This useEffect can only run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, getToken, createSession, showSession, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextProps {
  return useContext(AuthContext)
}
