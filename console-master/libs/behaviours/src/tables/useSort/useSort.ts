// dependencies
import cond from 'lodash/cond'
import { useCallback, useState } from 'react'

// constants
import { DEFAULT_SORT, DEFAULT_SORT_DIRECTION, SORT_DIRECTION } from './useSort.constants'

export type { SORT_DIRECTION }

export type UseSort<TSortKey extends string = string> = {
  sort: TSortKey
  sortDirection: SORT_DIRECTION
  onSort: (_: string) => void
  setSort: React.Dispatch<React.SetStateAction<string>>
  setSortDirection: React.Dispatch<React.SetStateAction<string>>
}

function useSort<TSortKey extends string = string>(
  defaultSort: TSortKey = DEFAULT_SORT as TSortKey,
  defaultSortDirection: SORT_DIRECTION = DEFAULT_SORT_DIRECTION,
): UseSort<TSortKey> {
  // state
  const [sort, setSort] = useState<TSortKey>(defaultSort)
  const [sortDirection, setSortDirection] = useState(defaultSortDirection)

  // actions

  const onSort = useCallback(
    (property: TSortKey) => {
      const newSortDirection = cond<unknown, SORT_DIRECTION>([
        [
          // new sort => default to asc
          () => sort !== property,
          () => defaultSortDirection,
        ],
        [
          // else toggle sort order
          () => true,
          () => (sortDirection === SORT_DIRECTION.ASC ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC),
        ],
      ])(undefined)

      setSort(property)
      setSortDirection(newSortDirection)
    },
    [sort, sortDirection, defaultSortDirection],
  )

  // hook interface
  return {
    sort,
    sortDirection,
    onSort,
    setSort,
    setSortDirection,
  }
}

export default useSort
