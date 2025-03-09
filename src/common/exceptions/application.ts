import { StatusCodes } from '@/common/contracts/http'
import { i18n } from '@/common/i18n'

export class ApplicationException extends Error {
  public name = 'ApplicationException'

  public message = i18n().common.exceptions.applicationException

  public statusCode = StatusCodes.INTERNAL

  public details?: Record<string, unknown> | string

  public originalError?: Error

  public code?: string

  constructor({
    originalError,
    ...error
  }: Partial<ApplicationException> & { originalError?: Error }) {
    super(i18n().common.exceptions.applicationException)
    const details =
      import.meta.env.MODE === 'production'
        ? undefined
        : {
            ...(typeof error.details === 'string' ? {} : error.details),
            name: originalError?.name,
            message: originalError?.message,
            stack: originalError?.stack?.split('\n').map((line: string) => line.trim()),
          }

    const fullError = error
    Object.assign(
      fullError,
      {
        originalError: import.meta.env.MODE === 'production' ? undefined : originalError,
      },
      Object.values(details ?? {}).filter((value) => !!value).length ? { details } : {},
    )
    Object.assign(this, fullError)

    if (import.meta.env.MODE !== 'production') {
      console.error(this, fullError)
    }
  }
}
