//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { ConnectorConfigInfo, NetworkServiceEntityPartial, TargetSet } from '@ues-data/gateway'
import { NetworkServiceTenantId } from '@ues-data/gateway'

export const isConnectorNotEnrolled = (connector: Partial<ConnectorConfigInfo>): boolean => !connector?.enrolled?.value

export const isDestinationsValid = (data: { networkServices?: NetworkServiceEntityPartial[]; targetSet?: TargetSet[] }): boolean =>
  data?.networkServices?.length > 0 || data?.targetSet?.length > 0

export const isSystemNetworkService = (tenantId: string) => tenantId === NetworkServiceTenantId.System
