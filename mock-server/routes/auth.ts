import { StatusCodes } from '@/common/contracts/http'
import { safetyAtoB, safetyJSONParse } from '@/common/helpers/json'
import {
  CreateSessionApiParams,
  ShowSessionApiResult,
  TokenApi,
} from '@/domain/auth/contracts/apis'
import { findBy } from '@mock-server/database'
import { makeToken } from '@mock-server/helpers/token'
import { Request, Response, Route } from '@mock-server/types'

export const authRoutes: Route[] = [
  {
    path: '/auth/v1/session',
    method: 'post',
    handle: (request: Request): Response => {
      const { username } = request.body as CreateSessionApiParams
      const [model] = findBy({
        table: 'sessions',
        where: [{ 'usuario.nome_de_usuario': username }],
      }) as ShowSessionApiResult[] | undefined[]

      if (!model) {
        return {
          status: StatusCodes.UNAUTHORIZED,
          headers: {},
          body: { code: 'AUTH.INVALID_CREDENTIALS', message: 'Invalid username or password' },
        }
      }

      const token = makeToken({ uid: model.usuario.id_usuario })
      const tokenApi: TokenApi = { access_token: token, refresh_token: token }

      return {
        status: StatusCodes.OK,
        headers: {},
        body: {
          ...model,
          token: tokenApi,
        },
      }
    },
  },
  {
    path: '/auth/v1/session',
    method: 'get',
    handle: (request: Request): Response => {
      const [, encodedPayload] = request.headers.token.split('.')
      const decodedPayload = safetyAtoB(encodedPayload)
      const parsedToken = safetyJSONParse<{ uid?: number }>(decodedPayload)
      const models = findBy({
        table: 'sessions',
        where: [{ 'usuario.id_usuario': parsedToken?.uid }],
      })

      return {
        status: StatusCodes.OK,
        headers: {},
        body: models[0],
      }
    },
  },
]
