import { useCallback } from 'react'

import type { ExportActionResult } from '@ues-behaviour/export'
import { exportFileName } from '@ues-behaviour/export'
import { useExportApolloQuery } from '@ues-data/export'
import { EXPORT_BATCH_SIZE, queryEndpoints } from '@ues-data/platform'
import { useSort } from '@ues/behaviours'

import { buildDevicesQuery } from './utils'

const EXPORT_FILE_NAME = 'MobileDevices'
interface ExportItem {
  [key: string]: string
}

export const useExport = (columns, filterProps) => {
  const { sort: exportSortBy, sortDirection: exportSortDirection } = useSort()
  const defaultExportVariables = { sortBy: exportSortBy, sortDirection: exportSortDirection, offset: 0, limit: EXPORT_BATCH_SIZE }

  const exportSource = useExportApolloQuery(queryEndpoints, {
    variables: defaultExportVariables,
    fetchPolicy: 'no-cache',
    nextFetchPolicy: 'no-cache',
  })

  const exportAction = useCallback(
    async (opts): ExportActionResult<ExportItem> => ({
      source: await exportSource({
        variables: {
          ...defaultExportVariables,
          offset: 0,
          query: buildDevicesQuery(opts.filtered ? filterProps.activeFilters : []),
        },
        selector: data =>
          data.platformEndpoints?.elements.map((event, index) => {
            const exportItem = {} as ExportItem
            for (const column of columns) {
              exportItem[column.label] = column.exportValue ? column.exportValue(event, index) : event[column.dataKey]
            }
            return exportItem
          }),
        exportFetchPolicy: 'no-cache',
      }),
      fileName: exportFileName(EXPORT_FILE_NAME, opts),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exportSource, columns],
  )

  return { exportAction }
}
