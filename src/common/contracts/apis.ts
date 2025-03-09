import { ListServiceParams, ListServiceResult } from './services'

export interface ApiServiceParams<RequestData> {
  resource: string
  method: 'delete' | 'get' | 'patch' | 'post' | 'put'
  url: string
  baseURL?: string
  params?: RequestData
  body?: RequestData
  headers?: Record<string, unknown>
  ignoreRefreshing?: boolean
}

export interface ListApiParams extends ListServiceParams {}

export interface ListApiResult<Model = any> extends ListServiceResult<Model> {}
