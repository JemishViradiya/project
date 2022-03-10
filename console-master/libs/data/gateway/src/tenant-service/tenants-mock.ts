//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params, sonarjs/no-duplicate-string */

import type { Response } from '@ues-data/shared-types'

import type TenantsInterface from './tenants-interface'
import type { TenantConfiguration, TenantHealthEntity } from './tenants-types'
import { TenantHealth } from './tenants-types'

const is = 'TenantsMock'

export const tenantConfigurationMock: TenantConfiguration = {
  privateNetworkIpV4Ranges: ['192.168.0.0/24', '192.168.3.1-192.168.3.24', '192.168.2.1'],
  privateNetworkIpV6Ranges: ['fd12:3456:789a:1::/64', 'fdf8:f53b:82e4::53'],
  healthCheckUrl: 'https://health.check.url',
  dnsSuffixEnabled: true,
  dnsSuffix: ['blackberry.com'],
  privateDnsZones: {
    forwardZones: [{ name: ['blackberry.com', 'cylance.com'], forward: ['192.168.0.1', '192.168.0.2'] }],
    reverseZones: [{ name: ['10.0.0.0/24', '192.0.0.0/16'], forward: ['192.168.0.1', '192.168.0.2'] }],
  },
  sourceIPAnchoredEnabled: true,
  sourceIPAnchoredIPs: ['192.168.2.1', '10.32.18.2', '10.100.100.100', '10.105.105.100', 'fdf8:f53b:82e4::53'],
  egressSourceIPRestrictionEnabled: true,
  egressSourceIPRestrictionIPs: ['10.0.0.1/15', '10.105.105.100', 'fdf8:f53b:82e4::53', '10.100.100.100-10.100.100.125'],
  tunnelPrivateIpV4Range: '10.0.0.1/15',
}

export const tenantHealthMock = { health: TenantHealth.Red }

class TenantsClass implements TenantsInterface {
  readConfig(_tenantId: string): Response<TenantConfiguration> {
    console.log(`${is}: read(${[...arguments]})`)
    return Promise.resolve({ data: tenantConfigurationMock })
  }

  updateConfig(_tenantId: string, data: Partial<TenantConfiguration>): Response<Partial<TenantConfiguration>> {
    console.log(`${is}: update(${[...arguments]})`)
    return Promise.resolve({ data })
  }

  readHealth(_tenantId: string): Response<TenantHealthEntity> {
    console.log(`${is}: readHealth(${[...arguments]})`)
    return Promise.resolve({ data: tenantHealthMock })
  }
}

const TenantsMock = new TenantsClass()

export { TenantsMock }
