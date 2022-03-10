/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { useCallback } from 'react'

import type { ExportActionResult } from '@ues-behaviour/export'
import { exportFileName } from '@ues-behaviour/export'
import { useExportApolloQuery } from '@ues-data/export'
import { formatFilters, mobileAlertsQuery } from '@ues-mtd/shared'

const EXPORT_BATCH_SIZE = 1000
const EXPORT_FILE_NAME = 'MobileAlerts'

interface ExportItem {
  [key: string]: string
}

export const useExportMobileAlerts = (columns, filterProps, sortingProps) => {
  const defaultExportVariables = {
    max: EXPORT_BATCH_SIZE,
    sortBy: sortingProps.sort?.toUpperCase(),
    sortDirection: sortingProps.sortDirection?.toUpperCase(),
    isExport: true,
  }
  const exportVariablesFilteredData = { ...defaultExportVariables, filter: formatFilters(true, filterProps?.activeFilters) }
  const exportVariablesAllData = { ...defaultExportVariables, filter: formatFilters(false, null) }

  const exportSource = useExportApolloQuery(mobileAlertsQuery)
  const exportAction = useCallback(
    async (opts): ExportActionResult<ExportItem> => ({
      source: await exportSource({
        variables: opts.filtered ? exportVariablesFilteredData : exportVariablesAllData,
        selector: ({ mobileAlerts: { elements } }) =>
          elements.map(element => {
            const exportItem = {} as ExportItem
            for (const column of columns) {
              exportItem[column.label] = column.exportValue ? column.exportValue(element) : element[column.dataKey]
            }
            return exportItem
          }),
        exportFetchPolicy: 'no-cache',
      }),
      fileName: exportFileName(EXPORT_FILE_NAME, opts),
    }), // eslint-disable-next-line react-hooks/exhaustive-deps
    [columns, exportSource],
  )

  return { exportAction }
}
