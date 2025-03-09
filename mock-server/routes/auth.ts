import { StatusCodes } from '@/common/contracts/http'
import { getTokenPayload } from '@/common/helpers/token'
import { CreateSessionApiParams } from '@/domain/auth/contracts/apis'
import { findBy } from '@mock-server/database'
import { makeToken } from '@mock-server/helpers/token'
import { Request, Response, Route } from '@mock-server/types'

export const authRoutes: Route[] = [
  {
    path: '/auth/v1/session',
    method: 'post',
    handle: (request: Request): Response => {
      const { document, password } = request.body as CreateSessionApiParams
      const models = findBy({ table: 'user', where: [{ document, password }] })

      if (!models.length) {
        return {
          status: StatusCodes.UNAUTHORIZED,
          headers: {},
          body: { code: 'AUTH.INVALID_CREDENTIALS', message: 'Invalid username or password' },
        }
      }

      const user = { ...models[0] }
      Reflect.deleteProperty(user, 'password')

      return {
        status: StatusCodes.CREATED,
        headers: {},
        body: { user, token: makeToken({ userId: user.id }) },
      }
    },
  },

  {
    path: '/auth/v1/session',
    method: 'get',
    handle: (request: Request): Response => {
      const parsedToken = getTokenPayload(request.headers.authorization)
      const models = findBy({ table: 'user', where: [{ id: parsedToken?.userId }] })

      if (!models.length) {
        return {
          status: StatusCodes.NOT_FOUND,
          headers: {},
          body: { code: 'AUTH.USER_NOT_FOUND', message: 'User not found' },
        }
      }

      const user = { ...models[0] }
      Reflect.deleteProperty(user, 'password')

      return {
        status: StatusCodes.OK,
        headers: {},
        body: { user },
      }
    },
  },

  {
    path: '/auth/v1/refresh-token',
    method: 'post',
    handle: (request: Request): Response => {
      const parsedToken = getTokenPayload(request.headers.authorization)

      if (!parsedToken) {
        return {
          status: StatusCodes.UNAUTHORIZED,
          headers: {},
          body: { code: 'AUTH.INVALID_TOKEN', message: 'Invalid token' },
        }
      }

      return {
        status: StatusCodes.CREATED,
        headers: {},
        body: { token: makeToken({ userId: parsedToken.userId }) },
      }
    },
  },

  {
    path: '/auth/v1/forgot-password',
    method: 'post',
    handle: (): Response => {
      return {
        status: StatusCodes.CREATED,
        headers: {},
        body: {},
      }
    },
  },

  {
    path: '/auth/v1/reset-password',
    method: 'post',
    handle: (): Response => {
      return {
        status: StatusCodes.CREATED,
        headers: {},
        body: {},
      }
    },
  },
]
