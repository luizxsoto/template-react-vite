import { StatusCodes } from '@/common/contracts/http'

import { ApplicationException } from './application'

export class UnprocessableEntityException extends ApplicationException {
  constructor(props?: Pick<UnprocessableEntityException, 'code' | 'message'>) {
    super({
      ...props,
      name: 'UnprocessableEntityException',
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
    })
  }
}
