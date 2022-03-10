import { useCallback, useState } from 'react'

type TColumn = { id: string; show: boolean }

export type UseColumns<T extends TColumn> = {
  columns: T[]
  setVisibility: (index: number) => void
  isColumnVisible: (id: string) => T
}

const useColumns = <T extends TColumn>(cols: T[] = []): UseColumns<T> => {
  const [columns, setCols] = useState(cols)

  const setVisibility = useCallback(
    index => {
      const newCols = [...columns]
      newCols[index].show = !newCols[index].show
      setCols(newCols)
    },
    [columns],
  )

  const isColumnVisible = useCallback((id: string) => columns.find(c => c.id === id && c.show), [columns])

  return {
    columns,
    setVisibility,
    isColumnVisible,
  }
}

export default useColumns
