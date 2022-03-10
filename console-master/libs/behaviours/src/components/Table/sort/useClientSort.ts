import { useMemo } from 'react'

import type { ClientSortableDataAccessor, TableSort } from '../types'
import { sortHandler } from './client-sorter'

export const useClientSort = <TDataEntry>(props: {
  data: TDataEntry[]
  sort: TableSort
  dataAccessor?: ClientSortableDataAccessor
}): TDataEntry[] => {
  const { data, sort, dataAccessor } = props

  return useMemo(() => {
    if (!sort || !data || data.length < 2) {
      return data
    }
    return sortHandler([...data], sort, dataAccessor)
  }, [data, dataAccessor, sort])
}
