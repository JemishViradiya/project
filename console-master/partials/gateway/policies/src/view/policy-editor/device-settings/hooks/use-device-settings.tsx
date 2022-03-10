//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Box, IconButton, Tooltip } from '@material-ui/core'

import { Components, Config, Data, Types } from '@ues-gateway/shared'
import { BasicAddRound, BasicDelete, BasicEdit } from '@ues/assets'
import { AriaElementLabel } from '@ues/assets-e2e'

import type { AndroidAccessControlDialogProps } from '../android-access-control/dialog'
import type { WindowsAccessControlDialogProps } from '../windows-access-control/dialog'

const { GATEWAY_TRANSLATIONS_KEY, MAX_MOBILE_DEVICE_APP_ID_COUNT, MAX_WINDOWS_APPS_COUNT } = Config
const { EntityDetailsViewContext, Dropdown } = Components
const { getAndroidAccessControlListItems, getWindowsControlListItems, getLocalPolicyData, updateLocalPolicyData } = Data
const { DeviceType, WindowsPerAppVpnItemsType } = Types

export const useDeviceSettings = (deviceType: Types.DeviceType) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const localPolicyData = useSelector(getLocalPolicyData)
  const androidlistItems = useSelector(getAndroidAccessControlListItems)
  const windowslistItems = useSelector(getWindowsControlListItems)
  const { writable } = useContext(EntityDetailsViewContext)
  const dispatch = useDispatch()

  const [androidAccessControlDialogState, setAndroidAccessControlDialogState] = useState<AndroidAccessControlDialogProps>()
  const [windowsAccessControlDialogState, setWindowsAccessControlDialogState] = useState<WindowsAccessControlDialogProps>()

  const isAndroidDevice = deviceType === DeviceType.Android
  const listItems = isAndroidDevice ? androidlistItems : windowslistItems
  const maxCount = isAndroidDevice ? MAX_MOBILE_DEVICE_APP_ID_COUNT : MAX_WINDOWS_APPS_COUNT
  const shouldDisableAdd = listItems.length >= maxCount
  const tooltipTitleTranslationKey = isAndroidDevice ? 'policies.appIdsMaxAmount' : 'policies.windowsApplicationsCountMessage'

  const openDeviceSettingsDialog = ({
    rowData,
    type,
  }: {
    rowData?: Types.DeviceSettingsListItem
    type?: Types.WindowsPerAppVpnItemsType
  }) =>
    isAndroidDevice
      ? setAndroidAccessControlDialogState({
          dialogId: Symbol('dialog-id'),
          rowData,
        })
      : setWindowsAccessControlDialogState({
          dialogId: Symbol('dialog-id'),
          rowData,
          type,
        })

  const deleteBlock = ({ rowDataIndex, rowData }: { rowDataIndex: number; rowData: Types.DeviceSettingsListItem }): void => {
    const type = rowData.parentType ?? WindowsPerAppVpnItemsType.AppIds
    let update = [...(localPolicyData?.platforms?.[deviceType]?.perAppVpn?.[type] ?? [])]

    if (isAndroidDevice) {
      update.splice(rowDataIndex, 1)
    } else {
      update = update.filter(record => record !== rowData?.value)
    }

    dispatch(
      updateLocalPolicyData({
        platforms: {
          ...(localPolicyData?.platforms ?? {}),
          [deviceType]: {
            ...(localPolicyData?.platforms?.[deviceType] ?? {}),
            perAppVpn: {
              ...(localPolicyData?.platforms?.[deviceType]?.perAppVpn ?? {}),
              [type]: update,
            },
          },
        },
      }),
    )
  }

  const makeAndroidAddAction = () => (
    <Box>
      <IconButton
        size="small"
        onClick={() => openDeviceSettingsDialog({})}
        disabled={shouldDisableAdd}
        aria-label={AriaElementLabel.AddApplicationIdIconButton}
      >
        <BasicAddRound />
      </IconButton>
    </Box>
  )

  const makeWindowsAddAction = () => (
    <Dropdown
      disabled={shouldDisableAdd}
      items={[
        {
          label: t('policies.windowsAddPath'),
          onClick: () => openDeviceSettingsDialog({ type: WindowsPerAppVpnItemsType.Paths }),
        },
        {
          label: t('policies.windowsAddPFN'),
          onClick: () => openDeviceSettingsDialog({ type: WindowsPerAppVpnItemsType.AppIds }),
        },
      ]}
    />
  )

  const columns = [
    {
      label: `${t(isAndroidDevice ? 'common.applicationId' : 'common.application')} *`,
      dataKey: 'name',
      persistent: true,
    },
    {
      dataKey: 'action',
      renderLabel: () => (
        <Box display="flex" justifyContent="flex-end" width="100%">
          {writable && (
            <Tooltip title={shouldDisableAdd ? t(tooltipTitleTranslationKey, { value: maxCount }) : ''}>
              {isAndroidDevice ? makeAndroidAddAction() : makeWindowsAddAction()}
            </Tooltip>
          )}
        </Box>
      ),
      renderCell: (rowData, rowDataIndex) => (
        <Box display="flex" justifyContent="flex-end">
          {writable && (
            <>
              <IconButton
                aria-label={t('common.buttonEdit')}
                onClick={() => openDeviceSettingsDialog({ rowData, type: rowData.parentType })}
                size="small"
              >
                <BasicEdit />
              </IconButton>
              <IconButton aria-label={t('common.buttonDelete')} onClick={() => deleteBlock({ rowDataIndex, rowData })} size="small">
                <BasicDelete />
              </IconButton>
            </>
          )}
        </Box>
      ),
    },
  ]

  return { columns, androidAccessControlDialogState, windowsAccessControlDialogState }
}
