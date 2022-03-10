/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Typography } from '@material-ui/core'

import { XGrid } from '@ues-behaviour/x-grid'
import { DashboardData } from '@ues-data/dlp'
import { Permission, useStatefulReduxQuery } from '@ues-data/shared'
import { AppliedFilterPanel, TableProvider, TableToolbar, useSecuredContent, useSnackbar } from '@ues/behaviours'

import makeStyles from '../styles'
import { useBytesConverter } from '../utils'
import { useEvidenceLockerTableProps } from './useEvidenceLockerTableProps'

const EvidenceLockerList = () => {
  useSecuredContent(Permission.BIP_FILESUMMARY_READ)
  const { t } = useTranslation(['dlp/common'])
  const snackbar = useSnackbar()
  const classes = makeStyles()

  const { tableProps, providerProps, filterPanelProps, toolbarProps } = useEvidenceLockerTableProps()
  const { data: fileStorageData, error: fileStorageError } = useStatefulReduxQuery(DashboardData.queryEvidenceLockerInfo)
  useEffect(() => {
    if (fileStorageError) {
      snackbar.enqueueMessage(t('evidenceLocker.sensitiveFilesStorage.serverError', { error: fileStorageError }), 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileStorageError, t])

  return (
    <Box className={classes.container}>
      <Typography variant="body2" align="right">
        {t('evidenceLocker.memoryUsed', {
          totals: fileStorageData?.totalFilesCount,
          used: useBytesConverter(+fileStorageData?.spaceUsed, true),
          remains: useBytesConverter(+fileStorageData?.spaceRemaining, true),
        })}
      </Typography>
      <TableToolbar {...toolbarProps} bottom={<AppliedFilterPanel {...filterPanelProps} />} />
      <TableProvider {...providerProps}>
        <XGrid {...tableProps} />
      </TableProvider>
    </Box>
  )
}

export default EvidenceLockerList
