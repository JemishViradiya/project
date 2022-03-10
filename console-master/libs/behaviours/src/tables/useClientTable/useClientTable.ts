import { useEffect, useState } from 'react'

import type { TableColumn } from './../../components/Table'
import type { SORT_DIRECTION } from './../useSort'
import { applyFilter, applyMultiColumnSearch, applySortAndPagination } from './utils'

export interface UseClientTableParams<TData> {
  // --TODO: better typing for these props...
  tableData: TData[]
  columns: TableColumn[]
  page?: number
  rowsPerPage?: number
  sort?: string
  sortDirection?: SORT_DIRECTION
  setSelected?: (selected: string[]) => void
  activeFilters?: Record<string, any>
  multiColumnSearch?: any
}

export type UseClientTable<TData> = {
  data: TData[]
  total: number
}

function useClientTable<TData>({
  tableData,
  columns,
  page,
  rowsPerPage,
  sort,
  sortDirection,
  activeFilters,
  multiColumnSearch,
}: UseClientTableParams<TData>): UseClientTable<TData> {
  const [data, setData] = useState<UseClientTable<TData>>({
    data: [],
    total: 0,
  })

  const updateTableData = () => {
    const filteredData = applyFilter(tableData, columns!, activeFilters)
    const searchedData = applyMultiColumnSearch(filteredData, columns!, multiColumnSearch)
    const sortedAndPaginatedData = applySortAndPagination(searchedData, sort!, sortDirection!, page!, rowsPerPage!)

    setData({ data: sortedAndPaginatedData, total: searchedData.length })
  }

  useEffect(updateTableData, [tableData, page, rowsPerPage, sort, sortDirection, activeFilters, columns, multiColumnSearch])

  return data
}

export default useClientTable
