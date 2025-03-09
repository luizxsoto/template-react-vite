import { StatusCodes } from '@/common/contracts/http'
import { ApplicationException } from '@/common/exceptions/application'
import { ForbiddenException } from '@/common/exceptions/forbidden'
import { NotFoundException } from '@/common/exceptions/not-found'
import { UnauthorizedException } from '@/common/exceptions/unauthorized'
import { UnprocessableEntityException } from '@/common/exceptions/unprocessable-entity'
import { ValidationException } from '@/common/exceptions/validation'

export function getParsedException(error?: ApplicationException): ApplicationException {
  if (!error) {
    return new ApplicationException({ originalError: error })
  }
  Reflect.deleteProperty(error, 'message')
  if (error.name === 'ForbiddenException' || error.statusCode === StatusCodes.FORBIDDEN) {
    return new ForbiddenException({ ...error, originalError: error })
  }
  if (error.name === 'NotFoundException' || error.statusCode === StatusCodes.NOT_FOUND) {
    return new NotFoundException({ ...error, originalError: error })
  }
  if (error.name === 'UnauthorizedException' || error.statusCode === StatusCodes.UNAUTHORIZED) {
    return new UnauthorizedException({ ...error, originalError: error })
  }
  if (
    error.name === 'UnprocessableEntityException' ||
    error.statusCode === StatusCodes.UNPROCESSABLE_ENTITY
  ) {
    return new UnprocessableEntityException({ ...error, originalError: error })
  }
  if (error.name === 'ValidationException') {
    const validationException = error as ValidationException
    return new ValidationException({ ...validationException, originalError: error })
  }
  return new ApplicationException({ code: error.code, originalError: error })
}
