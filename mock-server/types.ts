import { StatusCodes } from '@/common/contracts/http'

export interface Request {
  headers: Record<string, string>
  queryParams: Record<string, string>
  pathParams: Record<string, string>
  body: any
}

export interface Response {
  status: StatusCodes
  headers: Record<string, string>
  body: any
}

export interface Route {
  path: string
  method: 'delete' | 'get' | 'patch' | 'post' | 'put'
  handle: (request: Request) => Response
}
