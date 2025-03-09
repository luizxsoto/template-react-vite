import { StatusCodes } from '@/common/contracts/http'
import { i18n } from '@/common/i18n'

import { ApplicationException } from './application'

export interface ValidationItem {
  field: string
  rule: string
  message: string
}

export class ValidationException extends ApplicationException {
  constructor(public readonly validations: ValidationItem[]) {
    super({
      name: 'ValidationException',
      statusCode: StatusCodes.BAD_REQUEST,
      message: i18n().common.exceptions.validationException,
    })
  }
}
