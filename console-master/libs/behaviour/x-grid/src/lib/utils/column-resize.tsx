import { useCallback, useEffect, useMemo, useState } from 'react'

import type { GridColumnResizeParams } from '@material-ui/x-grid'

import { useUesSession } from '@ues-data/shared'
import type { TableColumn } from '@ues/behaviours'

export type ColumnsWidthConfig = Record<string, number>
const COLUMNS_WIDTH_PREFIX = 'columnsWidth_'

export const restoreColumnsWidth = (tableName: string): ColumnsWidthConfig => {
  if (!tableName) return {}

  const storedConfig = localStorage.getItem(COLUMNS_WIDTH_PREFIX + tableName)
  if (storedConfig) {
    try {
      return JSON.parse(storedConfig)
    } catch (e) {
      console.warn("Unable to load column's width config")
      return {}
    }
  } else {
    return {}
  }
}

export const saveColumnsWidth = (tableName: string, config: ColumnsWidthConfig): void => {
  if (!tableName) return

  if (config) {
    try {
      localStorage.setItem(COLUMNS_WIDTH_PREFIX + tableName, JSON.stringify(config))
    } catch (e) {
      console.warn("Unable to save column's width config")
    }
  }
}

export const useColumnResizer = (tableName: string, columns: TableColumn[]) => {
  const { userId = 'general' } = useUesSession() // per user config
  const resolvedTableName = useMemo(() => (tableName ? tableName : columns.map(c => c.dataKey).join('_')), [tableName, columns])

  const [columnsWidth, setColumnsWidth] = useState({})

  useEffect(() => {
    const savedWidth = restoreColumnsWidth(`${userId}_${resolvedTableName}`)
    setColumnsWidth(savedWidth)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onWidthChanges = useCallback(
    (params: GridColumnResizeParams) => {
      const config = { ...columnsWidth, [params.colDef.field]: params.width }
      setColumnsWidth(config)
      saveColumnsWidth(`${userId}_${resolvedTableName}`, config)
    },
    [columnsWidth, resolvedTableName, userId],
  )

  return { columnsWidth, onWidthChanges }
}
