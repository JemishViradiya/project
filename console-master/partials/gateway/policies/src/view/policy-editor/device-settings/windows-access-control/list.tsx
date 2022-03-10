//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Box, Typography } from '@material-ui/core'

import { Config, Data, Types } from '@ues-gateway/shared'
import { BasicTable, TableProvider } from '@ues/behaviours'

import { useDeviceSettings } from '../hooks'
import WindowsAccessControlDialog from './dialog'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { getPolicyTask, getWindowsControlListItems } = Data
const { DeviceType } = Types

const WindowsAccessControlList: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const listItems = useSelector(getWindowsControlListItems)
  const policyTask = useSelector(getPolicyTask)
  const { columns, windowsAccessControlDialogState } = useDeviceSettings(DeviceType.Windows)

  const idFunction = rowData => rowData.value

  const basicProps = {
    columns,
    idFunction,
    loading: policyTask?.loading,
  }

  return (
    <>
      <TableProvider basicProps={basicProps}>
        <BasicTable data={listItems ?? []} noDataPlaceholder={t('common.noData')} />
        <Box mt={2}>
          <Typography variant="caption">{t('policies.appIdsTableHelpMessage')}</Typography>
        </Box>
      </TableProvider>

      <WindowsAccessControlDialog {...windowsAccessControlDialogState} />
    </>
  )
}
export default WindowsAccessControlList
