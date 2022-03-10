//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import {
  Acl,
  AclMock,
  NetworkProtection,
  NetworkProtectionMock,
  NetworkServicesV2,
  NetworkServicesV3,
  Policies,
  PoliciesMock,
} from './policy-service'
import { Connectors, ConnectorsMock, Tenants, TenantsMock } from './tenant-service'

const GatewayApi = {
  Acl: Acl,
  Connectors: Connectors,
  NetworkProtection: NetworkProtection,
  NetworkServicesV2: NetworkServicesV2.NetworkServices,
  NetworkServicesV3: NetworkServicesV3.NetworkServices,
  Policies: Policies,
  Tenants: Tenants,
}

const GatewayApiMock = {
  Acl: AclMock,
  Connectors: ConnectorsMock,
  NetworkProtection: NetworkProtectionMock,
  NetworkServicesV2: NetworkServicesV2.NetworkServicesMock,
  NetworkServicesV3: NetworkServicesV3.NetworkServicesMock,
  Policies: PoliciesMock,
  Tenants: TenantsMock,
}

// rest services
export { GatewayApi, GatewayApiMock }
export * from './policy-service'
export * from './tenant-service'

// graphql services
export * from './reporting-service'
export * from './config.graphql'

export type { ReconciliationEntityId } from '@ues-data/shared'
export { ReconciliationEntityType } from '@ues-data/shared'
