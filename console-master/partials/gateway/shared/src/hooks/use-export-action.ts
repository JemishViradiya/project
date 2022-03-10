//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.
import { useCallback } from 'react'

import type { ExportActionResult } from '@ues-behaviour/export'
import { exportFileName } from '@ues-behaviour/export'
import { useExportAsyncQuery } from '@ues-data/export'
import type { TenantConfiguration } from '@ues-data/gateway'
import type { AsyncQuery } from '@ues-data/shared'

import type { BigService } from '.'
import { BIG_SERVICES_PERMISSIONS_DICTIONARY } from '.'

interface ExportItem {
  id: number
}

interface ExportData<TItem> {
  items: Array<TItem>
}
interface ExportVariables {
  start?: number
  count?: number
  fetchDelay?: number
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const useExportAction = <TItem extends ExportItem, TData extends TenantConfiguration>(
  data: TData,
  dataFormatter: (iterator: number, data: TData) => TItem,
  fileName: string,
  itemsCount: number,
  permission: BigService,
) => {
  const exportQuery: AsyncQuery<ExportData<TItem>, ExportVariables> = {
    permissions: new Set([BIG_SERVICES_PERMISSIONS_DICTIONARY[permission].canRead]),
    query: async ({ start, count, fetchDelay }) => {
      if (fetchDelay) await delay(fetchDelay)
      const itemsData = { items: [] }
      const end = start + count

      for (let i = start; i < end; i++) {
        itemsData.items.push(dataFormatter(i, data))
      }

      return itemsData
    },
    mockQueryFn: null,
    iterator: ({ start, count, fetchDelay, ...rest }) => {
      const newStart = start + count
      if (newStart >= itemsCount) return null

      return { start: newStart, count, ...rest }
    },
  }

  exportQuery.mockQueryFn = exportQuery.query

  const exportSource = useExportAsyncQuery(exportQuery)

  return useCallback(
    async (opts): ExportActionResult<TItem> => ({
      source: await exportSource({
        variables: { count: itemsCount, fetchDelay: 0, start: 0 },
        selector: ({ items }) => items,
      }),
      fileName: exportFileName(fileName, opts),
      contentType: 'text/csv',
      preferredImplementation: 'workerMessage',
    }),
    [fileName, exportSource, itemsCount],
  )
}
