export interface ColumnInfo {
  key: string
  label: string
  /** @default true */
  isSortable?: boolean
}

export interface CheckBoxProps<Model = Record<string, unknown>> {
  rowKey: keyof Model
  checkedRows: Model[]
  onCheck: (model: Model) => void
  onCheckAll: (checked: Model[]) => void
  maxCheckLength?: number
}

export interface ActionFunction<Model = Record<string, unknown>> {
  key: string
  label: string
  handle: (model: Model) => void
  confirmMessage?: string
}

export interface FilterParams
  extends Record<string, string[] | boolean | number | string | undefined> {
  page: number
  perPage: number
  orderBy: string
  order: 'asc' | 'desc'
}

export type FilterByFormat = 'date' | 'integer' | 'string'

export type FilterByType = 'normal' | 'range'

export interface FilterByParams {
  filterBy?: string
  filterValue?: string
  filterValueRange?: string
}

export interface FilterByOption {
  key: string
  label: string
  format: FilterByFormat
  type?: FilterByType
  mask?: (value: string) => string
}
