import { StatusCodes } from '@/common/contracts/http'
import { FilterType, OperatorType } from '@/common/contracts/services'
import { generateUUID } from '@/common/helpers/string'
import { getTokenPayload } from '@/common/helpers/token'
import { User, UserWithoutPassword } from '@/domain/user/contracts/models'
import { findBy } from '@mock-server/database'
import { sortArray } from '@mock-server/helpers/query'
import { Request, Response, Route } from '@mock-server/types'

function removePassword(users: User[]): UserWithoutPassword[] {
  return users.map(({ password: _password, ...user }) => user)
}

export const userRoutes: Route[] = [
  {
    path: '/user/v1/user',
    method: 'post',
    handle: (request: Request): Response => {
      const body = {
        ...request.body,
        id: generateUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: null,
      } as User

      return {
        status: StatusCodes.CREATED,
        headers: {},
        body: removePassword([body])[0],
      }
    },
  },

  {
    path: '/user/v1/user',
    method: 'get',
    handle: (request: Request): Response => {
      const page = Number(request.queryParams.page) || 1
      const perPage = Number(request.queryParams.perPage) || 10
      const orderBy = (request.queryParams.orderBy || 'createdAt') as 'createdAt'
      const order = request.queryParams.order || 'desc'
      const filters = JSON.parse(request.queryParams.filters || '[]') as OperatorType
      const searchFilter = filters.find((filter) => filter[0] === '|')
      const whereLikeFields = ['name', 'email', 'document']
      if ((searchFilter as FilterType[] | undefined)?.find((filter) => filter[1] === 'role')) {
        whereLikeFields.push('role')
      }

      const models = findBy({
        table: 'user',
        whereLike: whereLikeFields.map((whereLikeField) => ({
          [whereLikeField]: (searchFilter as FilterType[] | undefined)?.find(
            (item) => item[1] === whereLikeField,
          )?.[2] as string,
        })),
      })
      const registers = sortArray({ models, order, orderBy, page, perPage })
      const total = models.length
      const lastPage = total / perPage

      return {
        status: StatusCodes.OK,
        headers: {},
        body: {
          page,
          perPage,
          lastPage,
          total,
          orderBy,
          order,
          registers: removePassword(registers),
        },
      }
    },
  },

  {
    path: '/user/v1/user/:id',
    method: 'get',
    handle: (request: Request): Response => {
      const models = findBy({
        table: 'user',
        where: [{ id: request.pathParams.id }],
      })

      if (!models.length) {
        return {
          status: StatusCodes.NOT_FOUND,
          headers: {},
          body: { code: 'USER.NOT_FOUND', message: 'User not found' },
        }
      }

      return {
        status: StatusCodes.OK,
        headers: {},
        body: removePassword(models)[0],
      }
    },
  },

  {
    path: '/user/v1/user/:id',
    method: 'patch',
    handle: (request: Request): Response => {
      const models = findBy({
        table: 'user',
        where: [{ id: request.pathParams.id }],
      })

      if (!models.length) {
        return {
          status: StatusCodes.NOT_FOUND,
          headers: {},
          body: { code: 'USER.NOT_FOUND', message: 'User not found' },
        }
      }

      const body = {
        ...models[0],
        ...request.body,
        updatedAt: new Date().toISOString(),
      } as User

      return {
        status: StatusCodes.OK,
        headers: {},
        body: removePassword([body])[0],
      }
    },
  },

  {
    path: '/user/v1/user/:id',
    method: 'delete',
    handle: (request: Request): Response => {
      const models = findBy({
        table: 'user',
        where: [{ id: request.pathParams.id }],
      })

      if (!models.length) {
        return {
          status: StatusCodes.NOT_FOUND,
          headers: {},
          body: { code: 'USER.NOT_FOUND', message: 'User not found' },
        }
      }

      return {
        status: StatusCodes.NO_CONTENT,
        headers: {},
        body: null,
      }
    },
  },

  {
    path: '/user/v1/profile',
    method: 'patch',
    handle: (request: Request): Response => {
      const tokenPayload = getTokenPayload(request.headers.authorization)
      const models = findBy({
        table: 'user',
        where: [{ id: tokenPayload?.userId }],
      })

      if (!models.length) {
        return {
          status: StatusCodes.NOT_FOUND,
          headers: {},
          body: { code: 'USER.NOT_FOUND', message: 'User not found' },
        }
      }

      const body = {
        ...models[0],
        ...request.body,
        updatedAt: new Date().toISOString(),
      } as User

      return {
        status: StatusCodes.OK,
        headers: {},
        body: removePassword([body])[0],
      }
    },
  },
]
