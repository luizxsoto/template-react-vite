import { useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { MANAGER_PERMISSION_KEYS } from '@/common/constants/permission-keys'
import { ApplicationException } from '@/common/exceptions/application'
import { useErrorHandler } from '@/common/hooks/error-handler'
import { i18n } from '@/common/i18n'
import { consumeQueue, setIsRefreshing } from '@/common/services/api'
import {
  CreateSessionContextParams,
  ForgotPasswordContextParams,
  ResetPasswordContextParams,
  SaveLoggedUserContextParams,
  ShowSessionContextParams,
} from '@/domain/auth/contracts/contexts'
import { getTokenRepository } from '@/domain/auth/repositories'
import {
  createSessionService,
  forgotPasswordService,
  logoutSessionService,
  resetPasswordService,
  showSessionService,
} from '@/domain/auth/services'
import { UserRole, UserWithoutPasswordFormatted } from '@/domain/user/contracts/models'

interface AuthStateProps {
  isLoading: boolean
  isSigned: boolean
  loggedUser?: UserWithoutPasswordFormatted
}

interface HasPermissionProps {
  permissionKey?: string
  role?: UserRole
}

interface AuthContextProps extends AuthStateProps {
  createSession: (params: CreateSessionContextParams) => Promise<void>
  showSession: (params: ShowSessionContextParams) => Promise<void>
  saveLoggedUser: (params: SaveLoggedUserContextParams) => void
  forgotPassword: (params: ForgotPasswordContextParams) => void
  resetPassword: (params: ResetPasswordContextParams) => void
  hasPermission: (params: HasPermissionProps) => boolean
  logout: () => void
}

const INITIAL_STATE: AuthStateProps = {
  isLoading: false,
  isSigned: false,
  loggedUser: undefined,
}
const AuthContext = createContext<AuthContextProps>(INITIAL_STATE as AuthContextProps)

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const { handleError } = useErrorHandler({ ignoreLogout: true })
  const { enqueueSnackbar } = useSnackbar()

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [state, setState] = useState<AuthStateProps>(() => {
    const isSigned = Boolean(getTokenRepository())
    if (isSigned) {
      setIsRefreshing(true)
    }
    return { ...INITIAL_STATE, isSigned }
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

  const createSession = useCallback(
    async ({ model, onSuccess, onError }: CreateSessionContextParams) => {
      try {
        setStateSafety({ isLoading: true })

        const serviceResult = await createSessionService(model)

        setStateSafety({
          loggedUser: serviceResult.user,
          isSigned: true,
          isLoading: false,
        })
        onSuccess?.(serviceResult)
      } catch (error) {
        setStateSafety({ isLoading: false })
        const parsedError = error as ApplicationException

        if (parsedError.code === 'WRONG_DOCUMENT_OR_PASSWORD') {
          parsedError.message = i18n().modules.auth.pages.login.toast.wrongDocumentOrPassword
        }

        handleError({
          error: parsedError,
          setValidations: (validations) => onError?.({ error: parsedError, validations }),
        })
      }
    },
    [handleError, setStateSafety],
  )

  const logout = useCallback(() => {
    logoutSessionService()

    setStateSafety({
      loggedUser: undefined,
      isSigned: false,
      isLoading: false,
    })

    queryClient.removeQueries()

    setTimeout(() => {
      void navigate('/', { replace: true })
    }, 0)
  }, [navigate, queryClient, setStateSafety])

  const showSession = useCallback(
    async ({ onSuccess, onError }: ShowSessionContextParams) => {
      try {
        setStateSafety({ isLoading: true })

        const serviceResult = await showSessionService()
        consumeQueue()

        onSuccess?.(serviceResult)
        setStateSafety({ loggedUser: serviceResult.user, isLoading: false })
      } catch (error) {
        const parsedError = error as ApplicationException
        logout()
        consumeQueue(true)
        handleError({ error: parsedError })
        onError?.({ error: parsedError })
      }
    },
    [handleError, setStateSafety, logout],
  )

  const saveLoggedUser = useCallback(
    ({ model, onSuccess, onError }: SaveLoggedUserContextParams) => {
      try {
        onSuccess?.(model)
        setStateSafety({ loggedUser: model })
      } catch (error) {
        const parsedError = error as ApplicationException
        handleError({ error: parsedError })
        onError?.({ error: parsedError })
      }
    },
    [handleError, setStateSafety],
  )

  const forgotPassword = useCallback(
    async ({ model, onSuccess, onError }: ForgotPasswordContextParams) => {
      try {
        setStateSafety({ isLoading: true })

        await forgotPasswordService(model)
        enqueueSnackbar(i18n().modules.auth.pages.forgotPassword.toast.emailSent, {
          variant: 'success',
        })

        setStateSafety({ isLoading: false })
        onSuccess?.()
      } catch (error) {
        setStateSafety({ isLoading: false })
        const parsedError = error as ApplicationException

        if (parsedError.code === 'CODE_LIMIT_REACHED') {
          parsedError.message = i18n().modules.auth.pages.forgotPassword.toast.codeLimitReached
        }

        handleError({
          error: parsedError,
          setValidations: (validations) => onError?.({ error: parsedError, validations }),
        })
      }
    },
    [enqueueSnackbar, handleError, setStateSafety],
  )

  const resetPassword = useCallback(
    async ({ model, onSuccess, onError }: ResetPasswordContextParams) => {
      try {
        setStateSafety({ isLoading: true })

        await resetPasswordService(model)
        enqueueSnackbar(i18n().modules.auth.pages.resetPassword.toast.updatedPassword, {
          variant: 'success',
        })

        setStateSafety({ isLoading: false })
        onSuccess?.()
      } catch (error) {
        setStateSafety({ isLoading: false })
        const parsedError = error as ApplicationException

        if (parsedError.code === 'INVALID_CODE') {
          parsedError.message = i18n().modules.auth.pages.resetPassword.toast.invalidCode
        }

        handleError({
          error: parsedError,
          setValidations: (validations) => onError?.({ error: parsedError, validations }),
        })
      }
    },
    [enqueueSnackbar, handleError, setStateSafety],
  )

  const hasPermission = useCallback(
    ({ permissionKey, role }: HasPermissionProps) => {
      const loggedUser = state.loggedUser

      if (role && role === loggedUser?.role) {
        return true
      }

      if (permissionKey) {
        if (loggedUser?.role === UserRole.ADMIN) {
          return true
        }

        if (
          loggedUser?.role === UserRole.MANAGER &&
          MANAGER_PERMISSION_KEYS.includes(permissionKey)
        ) {
          return true
        }
      }

      return false
    },
    [state.loggedUser],
  )

  useEffect(() => {
    if (state.isSigned) {
      void showSession({})
    }
    // This useEffect can only run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider
      value={{
        ...state,
        createSession,
        showSession,
        saveLoggedUser,
        forgotPassword,
        resetPassword,
        hasPermission,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextProps {
  return useContext(AuthContext)
}
