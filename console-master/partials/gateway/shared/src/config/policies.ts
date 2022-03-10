//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Policy } from '@ues-data/gateway'
import {
  AccessControlType,
  AuthorizedAppInterfaceModeType,
  IncomingConnectionsType,
  OtherUserModeType,
  ReconciliationEntityType,
  UnauthorizedAppInterfaceModeType,
} from '@ues-data/gateway'
import { HelpLinks } from '@ues/assets'

import { BigService } from '../hooks'

export const SUPPORTED_ENTITY_TYPES = [ReconciliationEntityType.NetworkAccessControl, ReconciliationEntityType.GatewayApp]

export const MAX_MOBILE_DEVICE_APP_ID_LENGTH = 256
export const MAX_MOBILE_DEVICE_APP_ID_COUNT = 200

export const MAX_WINDOWS_PATH_LENGTH = 256
export const MAX_WINDOWS_APPS_COUNT = 200

export const ALLOWED_ENVIRONMENT_VARIABLES = [
  '%AppData%',
  '%HomePath%',
  '%LocalAppData%',
  '%ProgramData%',
  '%ProgramFiles%',
  '%ProgramFiles(x86)%',
  '%SystemDrive%',
  '%SystemRoot%',
]

export const WINDOWS_PATH_RESERVED_CHARACTERS = ['<', '>', ':', '"', '/', '|', '?', '*', '%']

export const POLICY_VIEWS_PERMISSIONS_MAP = {
  [ReconciliationEntityType.NetworkAccessControl]: BigService.NetworkAccessControlPolicy,
  [ReconciliationEntityType.GatewayApp]: BigService.GatewayAppPolicy,
}

export const POLICY_LOCALIZATION_TITLE_KEY = {
  [ReconciliationEntityType.NetworkAccessControl]: 'policies.networkAccessControl',
  [ReconciliationEntityType.GatewayApp]: 'policies.gatewayAppAccess',
}

export const POLICY_HELP_ID = {
  [ReconciliationEntityType.NetworkAccessControl]: HelpLinks.NetworkAccessControl,
  [ReconciliationEntityType.GatewayApp]: HelpLinks.GatewayService,
}
export const NETWORK_ACCESS_RULE_LOCALIZATION_TITLE_KEY = {
  [AccessControlType.Allowed]: 'policies.allowedNetworkConnections',
  [AccessControlType.Blocked]: 'policies.blockedNetworkConnections',
}

export const DEFAULT_SPLIT_TUNNEL_ENABLED = false

export const DEFAULT_LOCAL_POLICY_DATA: Record<
  ReconciliationEntityType.GatewayApp | ReconciliationEntityType.NetworkAccessControl,
  Partial<Policy>
> = {
  [ReconciliationEntityType.GatewayApp]: {
    platforms: {
      Android: null,
      Windows: {
        authorizedAppInterfaceMode: AuthorizedAppInterfaceModeType.AnyInterface,
        incomingConnections: IncomingConnectionsType.Allow,
        protectRequired: false,
        otherUserMode: OtherUserModeType.Never,
        perAppVpn: null,
        unauthorizedAppInterfaceMode: UnauthorizedAppInterfaceModeType.ForceBearer,
      },
    },
    splitTunnelEnabled: DEFAULT_SPLIT_TUNNEL_ENABLED,
  },
  [ReconciliationEntityType.NetworkAccessControl]: {},
}
