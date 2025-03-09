import _Get from 'lodash.get'

import { compareStrings } from '@/common/helpers/string'

type PrimitiveTypes = boolean | number | string | undefined

export interface MountWhereProps<Model> {
  model: Model
  where?: Array<Record<string, PrimitiveTypes | undefined>>
  whereNot?: Array<Record<string, PrimitiveTypes | undefined>>
  whereBiggerOrEqual?: Array<Record<string, PrimitiveTypes | undefined>>
  whereLessOrEqual?: Array<Record<string, PrimitiveTypes | undefined>>
  whereLike?: Array<Record<string, PrimitiveTypes | undefined>>
  whereIn?: Array<Record<string, PrimitiveTypes[] | undefined>>
  whereNotIn?: Array<Record<string, PrimitiveTypes[] | undefined>>
}

export function sortArray<Model>({
  models,
  order,
  orderBy,
  page,
  perPage,
}: {
  models: Model[]
  order: string
  orderBy: keyof Model
  page: number
  perPage: number
}): Model[] {
  return models
    .sort((prevRegister, currRegister) => {
      if (
        (order === 'desc' && prevRegister[orderBy] < currRegister[orderBy]) ||
        (order === 'asc' && prevRegister[orderBy] > currRegister[orderBy])
      ) {
        return 1
      }
      if (
        (order === 'desc' && prevRegister[orderBy] > currRegister[orderBy]) ||
        (order === 'asc' && prevRegister[orderBy] < currRegister[orderBy])
      ) {
        return -1
      }
      return 0
    })
    .slice((page - 1) * perPage, page * perPage)
}

export function mountWhere<Model>({
  model,
  where,
  whereNot,
  whereBiggerOrEqual,
  whereLessOrEqual,
  whereLike,
  whereIn,
  whereNotIn,
}: MountWhereProps<Model>): boolean {
  const whereMatch = !where
    ? true
    : where.some((whr) =>
        Object.keys(whr).every((key) => {
          if (whr[key] !== undefined && _Get(model, key) !== whr[key]) {
            return false
          }
          return true
        }),
      )

  const whereNotMatch = !whereNot
    ? true
    : whereNot.some((whr) =>
        Object.keys(whr).every((key) => {
          if (whr[key] !== undefined && _Get(model, key) === whr[key]) {
            return false
          }
          return true
        }),
      )

  const whereBiggerOrEqualMatch = !whereBiggerOrEqual
    ? true
    : whereBiggerOrEqual.some((whr) =>
        Object.keys(whr).every((key) => {
          const value = whr[key]
          if (value !== undefined && _Get(model, key) < value) {
            return false
          }
          return true
        }),
      )

  const whereLessOrEqualMatch = !whereLessOrEqual
    ? true
    : whereLessOrEqual.some((whr) =>
        Object.keys(whr).every((key) => {
          const value = whr[key]
          if (value !== undefined && _Get(model, key) > value) {
            return false
          }
          return true
        }),
      )

  const whereLikeMatch = !whereLike
    ? true
    : whereLike.some((whr) =>
        Object.keys(whr).every((key) => {
          if (
            whr[key] !== undefined &&
            !compareStrings(String(_Get(model, key)), String(whr[key]))
          ) {
            return false
          }
          return true
        }),
      )

  const whereInMatch = !whereIn
    ? true
    : whereIn.some((whr) =>
        Object.keys(whr).every((key) => {
          const whrValue = whr[key]
          if (
            whrValue !== undefined &&
            (!whrValue.length || !whrValue.includes(_Get(model, key) as string))
          ) {
            return false
          }
          return true
        }),
      )

  const whereNotInMatch = !whereNotIn
    ? true
    : whereNotIn.some((whr) =>
        Object.keys(whr).every((key) => {
          const whrValue = whr[key]
          if (
            whrValue !== undefined &&
            (!whrValue.length || whrValue.includes(_Get(model, key) as string))
          ) {
            return false
          }
          return true
        }),
      )

  return (
    whereMatch &&
    whereNotMatch &&
    whereBiggerOrEqualMatch &&
    whereLessOrEqualMatch &&
    whereLikeMatch &&
    whereInMatch &&
    whereNotInMatch
  )
}
