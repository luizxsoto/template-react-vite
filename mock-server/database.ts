import { MountWhereProps, mountWhere } from './helpers/query'
import { tables } from './seeds'

export function findBy<Key extends keyof typeof tables>({
  table,
  ...queryProps
}: Omit<MountWhereProps<(typeof tables)[Key][number]>, 'model'> & {
  table: Key
}): (typeof tables)[Key] {
  return tables[table].filter((model) =>
    mountWhere({ model, ...queryProps }),
  ) as (typeof tables)[Key]
}
