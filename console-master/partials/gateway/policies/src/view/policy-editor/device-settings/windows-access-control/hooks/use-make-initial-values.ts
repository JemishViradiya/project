//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import { isEmpty } from 'lodash-es'
import { useSelector } from 'react-redux'

import type { PlatformProfileWindows, Policy } from '@ues-data/gateway'
import {
  AuthorizedAppInterfaceModeType,
  IncomingConnectionsType,
  OtherUserModeType,
  UnauthorizedAppInterfaceModeType,
} from '@ues-data/gateway'
import { ReconciliationEntityType } from '@ues-data/shared-types'
import { Config, Data } from '@ues-gateway/shared'

const { DEFAULT_LOCAL_POLICY_DATA } = Config
const { getLocalPolicyData } = Data

export const useMakeInitialValues = () => {
  const localPolicyData = useSelector(getLocalPolicyData)

  const getDefaultFieldValue = (propertyName: keyof PlatformProfileWindows) =>
    localPolicyData?.platforms?.Windows?.[propertyName] ??
    DEFAULT_LOCAL_POLICY_DATA[ReconciliationEntityType.GatewayApp].platforms.Windows?.[propertyName]

  const getDefaultTypeFieldValue = (data: Partial<Policy>) => data.platforms?.Windows?.perAppVpn?.type

  return {
    authorizedAppInterfaceMode: getDefaultFieldValue('authorizedAppInterfaceMode') === AuthorizedAppInterfaceModeType.ForceTunnel,
    incomingConnections: getDefaultFieldValue('incomingConnections') === IncomingConnectionsType.Allow,
    otherUserMode: getDefaultFieldValue('otherUserMode') === OtherUserModeType.Conditional,
    windowsPerAppVpn: !isEmpty(getDefaultFieldValue('perAppVpn')),
    windowsPerAppVpnType:
      getDefaultTypeFieldValue(localPolicyData) ??
      getDefaultTypeFieldValue(DEFAULT_LOCAL_POLICY_DATA[ReconciliationEntityType.GatewayApp]),
    protectRequired: getDefaultFieldValue('protectRequired'),
    unauthorizedAppInterfaceMode: getDefaultFieldValue('unauthorizedAppInterfaceMode') === UnauthorizedAppInterfaceModeType.Block,
  }
}
