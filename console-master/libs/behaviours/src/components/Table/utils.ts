//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { ColumnsVisibility, FilterOptions, TableColumn } from './types'

export const filterOutHiddenColumns = (columns: TableColumn[]) => columns.filter(column => !column.hidden)

const COLUMNS_VISIBILITY_PREFIX = 'columnsVisibility_'

export const restoreColumnsVisibility = (tableName: string): ColumnsVisibility => {
  if (!tableName) return {}

  const storedConfig = localStorage.getItem(COLUMNS_VISIBILITY_PREFIX + tableName)
  if (storedConfig) {
    try {
      return JSON.parse(storedConfig)
    } catch (e) {
      console.warn("Unable to load column's visibility")
      return {}
    }
  } else {
    return {}
  }
}

export const saveColumnsVisibility = (tableName: string, config: ColumnsVisibility): void => {
  if (!tableName) return

  if (config) {
    try {
      localStorage.setItem(COLUMNS_VISIBILITY_PREFIX + tableName, JSON.stringify(config))
    } catch (e) {
      console.warn("Unable to save column's visibility")
    }
  }
}

export const getCheckboxItemsAndLabelsFromOptions = (options: FilterOptions[]) => {
  const labels = {}

  const items = options.map(({ value, label }) => {
    labels[value] = label || value
    return value
  })

  return {
    labels,
    items,
  }
}
