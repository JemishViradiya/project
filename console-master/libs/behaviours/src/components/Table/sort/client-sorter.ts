// //******************************************************************************
// // Copyright 2020 BlackBerry. All Rights Reserved.

import type { ClientSortableDataAccessor, TableSort } from '../types'
import { TableSortDirection } from '../types'

const sortString = (x1: string, x2: string) => x1.toString().localeCompare(x2)
const sortNumber = (x1: number, x2: number) => x1 - x2
const sortDate = (x1: Date, x2: Date) => x1.getTime() - x2.getTime()

export const sortHandler = <TDataEntry>(
  data: TDataEntry[],
  { sortBy, sortDir }: TableSort,
  dataAccessor?: ClientSortableDataAccessor,
): TDataEntry[] => {
  // eslint-disable-next-line sonarjs/cognitive-complexity
  const sortValues = (x1: TDataEntry, x2: TDataEntry) => {
    const v1 = dataAccessor ? dataAccessor(x1) : x1[sortBy]
    const v2 = dataAccessor ? dataAccessor(x2) : x2[sortBy]

    if (v1 === undefined) {
      if (v2 === undefined) return 0
      return sortDir === TableSortDirection.Asc ? 1 : -1
    } else if (v2 === undefined) {
      return sortDir === TableSortDirection.Asc ? -1 : 1
    } else {
      switch (typeof v1) {
        case 'string':
          return sortDir === TableSortDirection.Asc ? sortString(v1, v2) : sortString(v2, v1)
        case 'number':
          return sortDir === TableSortDirection.Asc ? sortNumber(v1, v2) : sortNumber(v2, v1)
        case 'object':
          if (v1 instanceof Date) {
            return sortDir === TableSortDirection.Asc ? sortDate(v1, v2) : sortDate(v2, v1)
          } else return 0
        default:
          return 0
      }
    }
  }

  return data.sort((a, b) => sortValues(a, b))
}
