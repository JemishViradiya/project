//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Typography } from '@material-ui/core'

import { Form } from '@ues-behaviour/hook-form'
import type { Policy } from '@ues-data/gateway'
import { PlatformAccessControlType } from '@ues-data/gateway'
import { ReconciliationEntityType } from '@ues-data/shared-types'
import { Components, Config, Data, Utils } from '@ues-gateway/shared'

import AndroidAccessControlList from './list'

const { EntityDetailsViewContext } = Components
const { DEFAULT_LOCAL_POLICY_DATA, GATEWAY_TRANSLATIONS_KEY } = Config
const { getLocalPolicyData, updateLocalPolicyData } = Data
const { isAndroidEnabled } = Utils

const ANDROID_ACCESS_CONTROL_FIELD_LOCALIZATION_LABEL_KEYS = {
  [PlatformAccessControlType.Inclusive]: 'common.allowedApplications',
  [PlatformAccessControlType.Exclusive]: 'common.disallowedApplications',
}

const AndroidAccessControl: React.FC = () => {
  const localPolicyData = useSelector(getLocalPolicyData)
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const dispatch = useDispatch()
  const { shouldDisableFormField } = useContext(EntityDetailsViewContext)

  const getDefaultTypeFieldValue = (data: Partial<Policy>) => data.platforms?.Android?.perAppVpn?.type

  const isEnabled = isAndroidEnabled(localPolicyData)

  const updatePlatformAndroidField = (payload: Policy['platforms']['Android']['perAppVpn'], shouldDisableAndroidField?: boolean) =>
    dispatch(
      updateLocalPolicyData({
        platforms: {
          ...(localPolicyData?.platforms ?? {}),
          Android: shouldDisableAndroidField
            ? DEFAULT_LOCAL_POLICY_DATA[ReconciliationEntityType.GatewayApp].platforms.Android
            : {
                ...(localPolicyData?.platforms?.Android ?? {}),
                perAppVpn: {
                  ...(localPolicyData?.platforms?.Android?.perAppVpn ?? {}),
                  ...payload,
                },
              },
        },
      }),
    )

  return (
    <>
      <Typography>{t('policies.gatewayAppPolicyInfoDescription')}</Typography>
      <Form
        initialValues={{
          androidPerAppVpnEnabled: isEnabled,
          androidType:
            getDefaultTypeFieldValue(localPolicyData) ??
            getDefaultTypeFieldValue(DEFAULT_LOCAL_POLICY_DATA[ReconciliationEntityType.GatewayApp]),
        }}
        fields={[
          {
            type: 'switch',
            label: t('policies.perAppTunnel'),
            name: 'androidPerAppVpnEnabled',
            disabled: shouldDisableFormField,
          },
          {
            type: 'radioGroup',
            name: 'androidType',
            options: Object.values(PlatformAccessControlType).map(value => ({
              label: t(ANDROID_ACCESS_CONTROL_FIELD_LOCALIZATION_LABEL_KEYS[value]),
              value,
              disabled: shouldDisableFormField,
            })),
            secondary: true,
            hidden: !isEnabled,
            renderComponent: ({ fieldComponent }) => (
              <>
                {fieldComponent}
                <AndroidAccessControlList />
              </>
            ),
          },
        ]}
        onChange={({ formValues: { androidPerAppVpnEnabled, androidType } }) =>
          updatePlatformAndroidField({ type: androidType ?? PlatformAccessControlType.Inclusive }, !androidPerAppVpnEnabled)
        }
        hideButtons
      />
    </>
  )
}

export default AndroidAccessControl
