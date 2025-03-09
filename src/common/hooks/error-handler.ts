import { useSnackbar } from 'notistack'

import { ApplicationException } from '@/common/exceptions/application'
import { ForbiddenException } from '@/common/exceptions/forbidden'
import { NotFoundException } from '@/common/exceptions/not-found'
import { UnauthorizedException } from '@/common/exceptions/unauthorized'
import { UnprocessableEntityException } from '@/common/exceptions/unprocessable-entity'
import { ValidationException } from '@/common/exceptions/validation'
import { useAuth } from '@/domain/auth/contexts'

interface HandleErrorProps {
  error: ApplicationException
  setValidations?: (validations: Record<string, string>) => void
}
interface ErrorHandlerHookProps {
  ignoreLogout?: boolean
}
interface ErrorHandlerHook {
  handleError: (data: HandleErrorProps) => void
}

export function useErrorHandler(props?: ErrorHandlerHookProps): ErrorHandlerHook {
  const { logout } = useAuth()
  const { enqueueSnackbar } = useSnackbar()

  function handleError({ error, setValidations }: HandleErrorProps): void {
    switch (error.constructor) {
      case ValidationException:
        setValidations?.(
          (error as ValidationException).validations.reduce(
            (accumulatedValidations, currentValidation) => ({
              ...accumulatedValidations,
              [currentValidation.field]: currentValidation.message,
            }),
            {},
          ) as Record<string, string>,
        )
        break
      case UnauthorizedException:
        enqueueSnackbar({
          key: error.code ?? error.name,
          message: error.message,
          variant: 'warning',
        })
        if (props?.ignoreLogout !== true) {
          logout()
        }
        break
      case NotFoundException:
        enqueueSnackbar({
          key: error.code ?? error.name,
          message: error.message,
          variant: 'warning',
        })
        break
      case UnprocessableEntityException:
        enqueueSnackbar({
          key: error.code ?? error.name,
          message: error.message,
          variant: 'warning',
        })
        break
      case ForbiddenException:
        enqueueSnackbar({
          key: error.code ?? error.name,
          message: error.message,
          variant: 'warning',
        })
        break
      default: {
        const parsedError = new ApplicationException({ ...error, originalError: error })
        enqueueSnackbar({
          key: parsedError.code ?? parsedError.name,
          message: parsedError.message,
          variant: 'warning',
        })
        break
      }
    }
  }

  return { handleError }
}
