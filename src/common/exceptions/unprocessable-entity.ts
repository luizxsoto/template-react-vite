import { StatusCodes } from '@/common/contracts/http'
import { i18n } from '@/common/i18n'

import { ApplicationException } from './application'

export class UnprocessableEntityException extends ApplicationException {
  constructor(props?: Partial<UnprocessableEntityException>) {
    super({
      name: 'UnprocessableEntityException',
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      message: i18n().common.exceptions.unprocessableEntityException,
      ...props,
    })
  }
}
