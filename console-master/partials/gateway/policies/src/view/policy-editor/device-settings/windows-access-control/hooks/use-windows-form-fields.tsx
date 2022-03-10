//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import { isEmpty } from 'lodash-es'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Box, Typography } from '@material-ui/core'

import type { FormFieldInterface } from '@ues-behaviour/hook-form'
import { FormFieldType } from '@ues-behaviour/hook-form'
import { PlatformAccessControlType } from '@ues-data/gateway'
import { FeatureName, useFeatures } from '@ues-data/shared'
import { Components, Config, Data } from '@ues-gateway/shared'

import WindowsAccessControlList from '../list'

const { getLocalPolicyData } = Data
const { EntityDetailsViewContext } = Components
const { GATEWAY_TRANSLATIONS_KEY } = Config

const WINDOWS_PER_APP_TUNNEL_FIELD_LOCALIZATION_LABEL_KEYS = {
  [PlatformAccessControlType.Inclusive]: 'policies.allowedApps',
  [PlatformAccessControlType.Exclusive]: 'policies.restrictedApps',
}

export const useWindowsFormFields = (): FormFieldInterface[] => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const features = useFeatures()
  const { shouldDisableFormField } = useContext(EntityDetailsViewContext)

  const localPolicyData = useSelector(getLocalPolicyData)

  const windowsTunnelEnabled = features.isEnabled(FeatureName.UESBigWindowsTunnelEnabled)

  return [
    {
      type: FormFieldType.Switch,
      name: 'otherUserMode',
      label: t('policies.windowsOtherUsersLabel'),
      helpLabel: t('policies.windowsOtherUsersHelpLabel'),
      disabled: shouldDisableFormField,
      hidden: !windowsTunnelEnabled,
    },
    {
      type: FormFieldType.Switch,
      name: 'windowsPerAppVpn',
      label: t('policies.perAppTunnel'),
      helpLabel: t('policies.windowsPerAppTunnelHelpLabel'),
      disabled: shouldDisableFormField,
      hidden: !windowsTunnelEnabled,
    },
    {
      type: FormFieldType.RadioGroup,
      name: 'windowsPerAppVpnType',
      options: Object.values(PlatformAccessControlType).map(value => ({
        label: t(WINDOWS_PER_APP_TUNNEL_FIELD_LOCALIZATION_LABEL_KEYS[value]),
        value,
        disabled: shouldDisableFormField,
      })),
      secondary: true,
      hidden: !windowsTunnelEnabled || isEmpty(localPolicyData.platforms?.Windows?.perAppVpn),
      renderComponent: ({ fieldComponent }) => (
        <>
          {fieldComponent}
          <WindowsAccessControlList />
        </>
      ),
    },
    {
      type: FormFieldType.Switch,
      name: 'authorizedAppInterfaceMode',
      label: windowsTunnelEnabled
        ? t('policies.windowsForceAllowedToUseTunnelLabel')
        : t('policies.windowsForceApplicationsToUseTunnelLabel'),
      helpLabel: windowsTunnelEnabled
        ? t('policies.windowsForceAllowedToUseTunnelHelpLabel')
        : t('policies.windowsForceApplicationsToUseTunnelHelpLabel'),
      disabled: shouldDisableFormField,
    },
    {
      type: FormFieldType.Switch,
      name: 'unauthorizedAppInterfaceMode',
      label: t('policies.windowsBlockFromUnallowedApps'),
      helpLabel: t('policies.windowsBlockFromUnallowedAppsHelpLabel'),
      disabled: shouldDisableFormField,
      hidden: !windowsTunnelEnabled,
    },
    {
      type: FormFieldType.Switch,
      name: 'incomingConnections',
      label: t('policies.windowsIncomingConnectionsLabel'),
      helpLabel: t('policies.windowsIncomingConnectionsHelpLabel'),
      disabled: shouldDisableFormField,
      renderComponent: ({ fieldComponent }) => (
        <>
          <Box my={6}>
            <Typography variant="subtitle1" color="textPrimary">
              {t('policies.windowsIncomingConnections')}
            </Typography>
          </Box>

          {fieldComponent}
        </>
      ),
    },
    {
      type: FormFieldType.Switch,
      name: 'protectRequired',
      label: t('policies.protectRequiredFieldLabel'),
      disabled: shouldDisableFormField,
      renderComponent: ({ fieldComponent }) => (
        <>
          <Box my={6}>
            <Typography variant="subtitle1" color="textPrimary">
              {t('policies.windowsBlackBerryProtect')}
            </Typography>
          </Box>

          {fieldComponent}
        </>
      ),
    },
  ]
}
