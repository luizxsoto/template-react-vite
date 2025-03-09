import { StatusCodes } from '@/common/contracts/http'
import { i18n } from '@/common/i18n'

import { ApplicationException } from './application'

export class NotFoundException extends ApplicationException {
  constructor(props?: Partial<NotFoundException>) {
    super({
      ...props,
      name: 'NotFoundException',
      statusCode: StatusCodes.NOT_FOUND,
      message: i18n().common.exceptions.notFound,
    })
  }
}
