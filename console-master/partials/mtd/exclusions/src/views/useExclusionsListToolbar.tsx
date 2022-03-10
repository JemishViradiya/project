import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Typography } from '@material-ui/core'

import type { ExportActionResult } from '@ues-behaviour/export'
import { ExportAction, exportFileName } from '@ues-behaviour/export'
import { useExportAsyncQuery } from '@ues-data/export'
import type { EntitiesPageableResponse } from '@ues-data/mtd'
import type { AsyncQuery } from '@ues-data/shared'
import { Permission, usePermissions } from '@ues-data/shared'
import { BasicAdd, BasicDelete } from '@ues/assets'
import type { TableColumn, ToolbarProps } from '@ues/behaviours'

export interface ExportItem {
  [key: string]: string
}

type ListToolbarProps<Entity, Result extends EntitiesPageableResponse<Entity>, Args> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedItems?: any[]
  loadedItems?: number
  totalItems?: number
  onAddActionClick: () => void
  onDeleteActionClick: (ids: string[]) => void
  addBtnText: string
  exportFileNamePrefix?: string
  exportColumns?: TableColumn<Entity>[]
  exportQuery?: AsyncQuery<Result, Args>
  exportQueryArgs?: any
}

const PAGE_SIZE = 25

export function useExclusionsListToolbar<Entity, Args>({
  selectedItems = [],
  loadedItems = 0,
  totalItems = 0,
  onAddActionClick,
  onDeleteActionClick,
  addBtnText,
  exportFileNamePrefix,
  exportColumns,
  exportQuery,
  exportQueryArgs,
}: ListToolbarProps<Entity, EntitiesPageableResponse<Entity>, Args>): ToolbarProps {
  const { t } = useTranslation(['mtd/common'])
  const { hasPermission, hasAnyPermission } = usePermissions()

  exportQuery.iterator = (exportQueryArgs, previousResult) => {
    if (previousResult) {
      const max = exportQueryArgs['max']
      const offset = exportQueryArgs['offset']

      const total = previousResult.totals.elements
      const newOffset = offset + max

      if (newOffset >= total) return null

      const newExportQueryArgs = { ...exportQueryArgs }
      newExportQueryArgs['offset'] = newOffset

      return newExportQueryArgs
    }
    return exportQueryArgs
  }

  const exportSource = useExportAsyncQuery(exportQuery, { variables: { offset: 0, max: PAGE_SIZE, ...exportQueryArgs } })

  const exportAction = useCallback(
    async (opts): ExportActionResult<ExportItem> => ({
      source: await exportSource({
        selector: response =>
          response?.elements?.map((value, index) => {
            const exportItem = {} as ExportItem
            for (const column of exportColumns) {
              exportItem[column.label] = column.exportValue ? column.exportValue(value, index) : value[column.dataKey]
            }
            return exportItem
          }),
      }),
      fileName: exportFileName(exportFileNamePrefix, opts),
    }),
    [exportFileNamePrefix, exportColumns, exportSource],
  )

  return {
    begin: (
      <>
        {selectedItems.length > 0 && <Typography variant="body2">{selectedItems.length} selected</Typography>}
        {hasPermission(Permission.VENUE_SETTINGSGLOBALLIST_CREATE) && (
          <Button startIcon={<BasicAdd />} variant="contained" color="secondary" onClick={onAddActionClick}>
            {addBtnText}
          </Button>
        )}
        {selectedItems.length > 0 && hasPermission(Permission.VENUE_SETTINGSGLOBALLIST_DELETE) && (
          <Button
            startIcon={<BasicDelete />}
            variant="contained"
            color="primary"
            onClick={() => onDeleteActionClick(selectedItems)}
          >
            {t('common.delete')}
          </Button>
        )}
      </>
    ),
    end: (
      <>
        {hasAnyPermission(
          Permission.VENUE_SETTINGSGLOBALLIST_READ,
          Permission.VENUE_SETTINGSGLOBALLIST_CREATE,
          Permission.VENUE_SETTINGSGLOBALLIST_UPDATE,
          Permission.VENUE_SETTINGSGLOBALLIST_DELETE,
        ) && (
          <Typography component="span" variant="body2">
            {t('exclusion.list.results', { viewing: loadedItems, total: totalItems })}
          </Typography>
        )}
        {hasAnyPermission(
          Permission.VENUE_SETTINGSGLOBALLIST_READ,
          Permission.VENUE_SETTINGSGLOBALLIST_CREATE,
          Permission.VENUE_SETTINGSGLOBALLIST_UPDATE,
        ) && <ExportAction exportAction={exportAction} DialogProps={{ isFilterable: false }} />}
      </>
    ),
  }
}
