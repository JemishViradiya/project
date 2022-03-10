// dependencies
import { useEffect, useState } from 'react'

// types
export interface UseServerTableParams<TData extends Record<string, unknown>> {
  tableData: TData[]
  dataDispatch: (params: unknown) => void
  page?: number
  rowsPerPage?: number
  sort?: string
  sortDirection?: string
  setSelected?: (selected: string[]) => void
}

export type UseServerTable<TData> = {
  data: TData[]
}

function useServerTable<TData extends Record<string, unknown>>({
  tableData,
  dataDispatch,
  page,
  rowsPerPage,
  sort,
  sortDirection,
  setSelected = () => undefined,
}: UseServerTableParams<TData>): UseServerTable<TData> {
  // state
  const [data, setData] = useState([])

  const updateTableData = () => {
    const params = {
      ...(page >= 0 && { page }),
      ...(rowsPerPage >= 0 && { rowsPerPage }),
      ...(sort && { sort }),
      ...(sortDirection && { sortDirection }),
    }

    setSelected([])
    dataDispatch(params)
  }

  // effects

  useEffect(updateTableData, [page, rowsPerPage, sort, sortDirection, dataDispatch, setSelected])
  useEffect(() => setData(tableData), [tableData]) // keep data state in sync with tableData

  // hook interface
  return { data }
}

export default useServerTable
