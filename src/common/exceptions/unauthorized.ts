import { StatusCodes } from '@/common/contracts/http'
import { i18n } from '@/common/i18n'

import { ApplicationException } from './application'

export class UnauthorizedException extends ApplicationException {
  constructor(props?: Partial<UnauthorizedException>) {
    super({
      ...props,
      name: 'UnauthorizedException',
      statusCode: StatusCodes.UNAUTHORIZED,
      message: i18n().common.exceptions.unauthorizedException,
    })
  }
}
