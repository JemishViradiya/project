import { useCallback, useState } from 'react'

import type { TableColumn } from './../../components/Table'

export type UseTableColumns = {
  columns: TableColumn[]
  setVisibility: (index: number) => void
  isColumnVisible: (dataKey: string) => boolean
}

const useTableColumns = (cols: TableColumn[] = []): UseTableColumns => {
  const [columns, setCols] = useState<TableColumn[]>(cols)

  const setVisibility = useCallback(
    index => {
      const newCols = [...columns]
      newCols[index].show = !newCols[index].show
      setCols(newCols)
    },
    [columns],
  )

  const isColumnVisible = useCallback((dataKey: string) => !!columns.find(c => c.dataKey === dataKey && c.show), [columns])

  return {
    columns,
    setVisibility,
    isColumnVisible,
  }
}

export default useTableColumns
