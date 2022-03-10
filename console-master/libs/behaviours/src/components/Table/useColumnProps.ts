import { useMemo } from 'react'

import type { TableColumn } from './types'
import { useBasicTable } from './types'

/**
 * useColumnProps hook allows to get properties of the specific table column.
 * Should be used inside children of the BasicTableProvider.
 * @param {string} columnKey The key of the table column.
 * @returns {TableColumn} table column properties.
 */
export const useColumnProps = (columnKey: string): TableColumn => {
  const { columns } = useBasicTable()

  return useMemo(() => {
    return columns.find(column => column.dataKey === columnKey)
  }, [columnKey, columns])
}
