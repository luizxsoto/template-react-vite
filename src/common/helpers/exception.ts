import { StatusCodes } from '@/common/contracts'
import {
  ApplicationException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
  ValidationException,
} from '@/common/exceptions'

export function getParsedException(
  resource: string,
  error?: ApplicationException,
): ApplicationException {
  if (!error) {
    return new ApplicationException({ originalError: error })
  }
  if (error.name === 'ForbiddenException' || error.statusCode === StatusCodes.FORBIDDEN) {
    return new ForbiddenException({ ...error, resource })
  }
  if (error.name === 'NotFoundException' || error.statusCode === StatusCodes.NOT_FOUND) {
    return new NotFoundException(error)
  }
  if (error.name === 'UnauthorizedException' || error.statusCode === StatusCodes.UNAUTHORIZED) {
    return new UnauthorizedException(error)
  }
  if (
    error.name === 'UnprocessableEntityException' ||
    error.statusCode === StatusCodes.UNPROCESSABLE_ENTITY
  ) {
    return new UnprocessableEntityException(error)
  }
  if (error.name === 'ValidationException') {
    const validationException = error as ValidationException
    return new ValidationException(validationException.validations)
  }
  return new ApplicationException({ originalError: error })
}
