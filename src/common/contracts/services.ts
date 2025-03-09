export type PrimitiveType = number | string

export type FilterType = [PrimitiveType, PrimitiveType, PrimitiveType | PrimitiveType[]]

// eslint-disable-next-line @typescript-eslint/array-type
export type OperatorType = [string, ...(FilterType | OperatorType)[]]

export interface ListServiceParams {
  page?: number
  perPage?: number
  order?: 'asc' | 'desc'
  orderBy?: string
  filters?: string
}

export interface ListServiceResult<Model = any> {
  page: number
  perPage: number
  lastPage: number
  total: number
  orderBy: string
  order: 'asc' | 'desc'
  registers: Model[]
}
