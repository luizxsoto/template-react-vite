import { useSnackbar } from 'notistack'

import { ApplicationException, ValidationException } from '@/common/exceptions'
import { i18n } from '@/common/i18n'
import { useAuth } from '@/domain/auth'

interface HandleErrorProps {
  error: ApplicationException
  setValidations?: (validations: Record<string, string>) => void
}
interface ErrorHandlerHookProps {
  ignoreSignOut?: boolean
}
interface ErrorHandlerHook {
  handleError: (data: HandleErrorProps) => void
}

export function useErrorHandler(props?: ErrorHandlerHookProps): ErrorHandlerHook {
  const { enqueueSnackbar } = useSnackbar()
  const { signOut } = useAuth()

  function handleError({ error, setValidations }: HandleErrorProps): void {
    const parseValidationMessage = (field: string): string => {
      const parsedValidators: Record<string, string> = i18n().common.stringValidators
      return parsedValidators[field]
    }

    switch (error.name || '') {
      case 'ValidationException':
        setValidations?.(
          (error as ValidationException).validations.reduce(
            (accumulatedValidations, currentValidation) => ({
              ...accumulatedValidations,
              [currentValidation.field]:
                parseValidationMessage(currentValidation.rule) || currentValidation.message,
            }),
            {},
          ) as Record<string, string>,
        )

        enqueueSnackbar(i18n().common.exceptions.validationException, { variant: 'warning' })
        break
      case 'UnauthorizedException':
        enqueueSnackbar(error.message, { variant: 'warning' })
        if (props?.ignoreSignOut !== true) {
          signOut()
        }
        break
      case 'NotFoundException':
      case 'UnprocessableEntityException':
        enqueueSnackbar(error.message, { variant: 'warning' })
        break
      default:
        enqueueSnackbar(i18n().common.exceptions.applicationException, { variant: 'warning' })
        break
    }
  }

  return { handleError }
}
