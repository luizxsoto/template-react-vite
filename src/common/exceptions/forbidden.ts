import { StatusCodes } from '@/common/contracts/http'
import { i18n } from '@/common/i18n'

import { ApplicationException } from './application'

export class ForbiddenException extends ApplicationException {
  constructor(props: Partial<ForbiddenException>) {
    super({
      name: 'ForbiddenException',
      statusCode: StatusCodes.FORBIDDEN,
      message: i18n().common.exceptions.forbiddenException,
      ...props,
    })
  }
}
