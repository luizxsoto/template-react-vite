export interface ApiServiceParams<RequestData> {
  method: 'delete' | 'get' | 'patch' | 'post' | 'put'
  url: string
  baseURL?: string
  params?: RequestData
  body?: RequestData
  headers?: Record<string, unknown>
  ignoreRefreshing?: boolean
}

export interface ApiServiceResult<ResponseData> {
  data: ResponseData
  headers: Record<string, string>
}
