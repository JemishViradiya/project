//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import { isNil, pick } from 'lodash-es'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Typography } from '@material-ui/core'

import { Form } from '@ues-behaviour/hook-form'
import {
  AuthorizedAppInterfaceModeType,
  IncomingConnectionsType,
  OtherUserModeType,
  PlatformAccessControlType,
  UnauthorizedAppInterfaceModeType,
} from '@ues-data/gateway'
import { FeatureName, useFeatures } from '@ues-data/shared'
import { ReconciliationEntityType } from '@ues-data/shared-types'
import { Config, Data } from '@ues-gateway/shared'

import { useMakeInitialValues, useWindowsFormFields } from './hooks'
import SplitTunnelAlert from './split-tunnel-alert'

const { DEFAULT_LOCAL_POLICY_DATA, GATEWAY_TRANSLATIONS_KEY } = Config
const { getLocalPolicyData, updateLocalPolicyData } = Data

const WINDOWS_TUNNEL_NOT_ENABLED_FIELDS = ['authorizedAppInterfaceMode', 'incomingConnections', 'protectRequired']

const WindowsAccessControl: React.FC = () => {
  const localPolicyData = useSelector(getLocalPolicyData)
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const dispatch = useDispatch()
  const features = useFeatures()
  const formFields = useWindowsFormFields()

  const initialValues = useMakeInitialValues()

  const windowsTunnelEnabled = features.isEnabled(FeatureName.UESBigWindowsTunnelEnabled)

  const makeWindowsData = ({
    authorizedAppInterfaceMode,
    unauthorizedAppInterfaceMode,
    incomingConnections,
    protectRequired,
    otherUserMode,
    windowsPerAppVpn,
    windowsPerAppVpnType,
  }) => {
    const data = {
      ...(localPolicyData?.platforms?.Windows ?? {}),
      authorizedAppInterfaceMode:
        authorizedAppInterfaceMode === false
          ? AuthorizedAppInterfaceModeType.AnyInterface
          : AuthorizedAppInterfaceModeType.ForceTunnel,
      incomingConnections: incomingConnections === false ? IncomingConnectionsType.Block : IncomingConnectionsType.Allow,
      protectRequired,
      otherUserMode: otherUserMode === false ? OtherUserModeType.Never : OtherUserModeType.Conditional,
      perAppVpn:
        windowsPerAppVpn === false
          ? DEFAULT_LOCAL_POLICY_DATA[ReconciliationEntityType.GatewayApp].platforms.Windows.perAppVpn
          : {
              ...(localPolicyData?.platforms?.Windows?.perAppVpn ?? {}),
              type: windowsPerAppVpnType ?? PlatformAccessControlType.Inclusive,
            },
      unauthorizedAppInterfaceMode:
        unauthorizedAppInterfaceMode === false
          ? UnauthorizedAppInterfaceModeType.ForceBearer
          : UnauthorizedAppInterfaceModeType.Block,
    }

    return windowsTunnelEnabled ? data : pick(data, WINDOWS_TUNNEL_NOT_ENABLED_FIELDS)
  }

  return (
    <>
      <SplitTunnelAlert />
      <Typography variant="subtitle1" color="textPrimary">
        {t('policies.windowsTunnelUse')}
      </Typography>
      <Form
        initialValues={initialValues}
        fields={formFields}
        onChange={({ formValues }) => {
          dispatch(
            updateLocalPolicyData({
              platforms: {
                ...(localPolicyData?.platforms ?? {}),
                Windows: {
                  ...(localPolicyData?.platforms?.Windows ?? {}),
                  ...makeWindowsData(formValues),
                },
              },
            }),
          )
        }}
        hideButtons
      />
    </>
  )
}

export default WindowsAccessControl
