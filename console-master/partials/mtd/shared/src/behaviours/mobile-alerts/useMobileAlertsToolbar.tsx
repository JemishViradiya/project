/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Button, CircularProgress, Typography } from '@material-ui/core'

import { ExportAction } from '@ues-behaviour/export'
import { useQueryParams } from '@ues-behaviour/react'
import { Permission, usePermissions } from '@ues-data/shared'
import type { GroupBy } from '@ues-mtd/alert-types'
import { QueryStringParamKeys } from '@ues-mtd/alert-types'
import type { ToolbarProps } from '@ues/behaviours'

import GroupBySelect from './groupBySelect'

type MobileAlertsToolbarProps = {
  t: (a: string, v?: any) => string
  selectedIds?: string[]
  loadedItems?: number
  totalItems?: number
  onIgnore?: (ids: string[]) => void
  selectionModel?: any
  showGroupBy?: boolean
  exportAction?: any
}

export function useMobileAlertsToolbar({
  selectedIds = [],
  loadedItems = 0,
  totalItems = 0,
  onIgnore,
  selectionModel,
  showGroupBy = true,
  exportAction,
}: MobileAlertsToolbarProps): ToolbarProps {
  const { t } = useTranslation(['mtd/common'])
  const ignoreButtonText = t('mobileAlert.ignoreButton')
  const groupBy: GroupBy = useQueryParams().get(QueryStringParamKeys.GROUP_BY) as GroupBy
  const { hasPermission } = usePermissions()
  const updatable: boolean = hasPermission(Permission.MTD_EVENTS_UPDATE)

  return {
    begin: (
      <>
        {onIgnore && selectedIds.length > 0 && (
          <>
            <Typography variant="h4">
              {!selectionModel.allSelected && selectedIds.length}{' '}
              {selectionModel.allSelected && totalItems - selectionModel.selected.length} {t('mobileAlert.list.selected')}
            </Typography>
            {updatable && (
              <Button variant="contained" color="primary" onClick={() => onIgnore(selectedIds)}>
                {ignoreButtonText}
              </Button>
            )}
          </>
        )}
      </>
    ),
    end: (
      <Box display="flex" alignItems="center">
        {totalItems !== null && (
          <Box mb={6}>
            <Typography component="span" variant="body2">
              {t('mobileAlert.list.results', { viewing: loadedItems, total: totalItems })}
            </Typography>
          </Box>
        )}
        {totalItems == null && (
          <Box mb={6}>
            <Typography component="span" variant="body2">
              {t('mobileAlert.list.resultsSimple', { viewing: loadedItems })}
            </Typography>
          </Box>
        )}
        {showGroupBy && (
          <Box ml={3}>
            <GroupBySelect groupBy={groupBy} />
          </Box>
        )}
        {exportAction && (
          <Box mb={6} ml={3}>
            <ExportAction exportAction={exportAction} />
          </Box>
        )}
      </Box>
    ),
  }
}
