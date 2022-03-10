//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { NetworkProtectionConfig, TenantConfiguration } from '@ues-data/gateway'

export const PICK_TENANT_CONFIG_PROPERTIES: Record<string, Array<keyof TenantConfiguration>> = {
  dnsSuffix: ['dnsSuffix', 'dnsSuffixEnabled'],
  healthCheckUrl: ['healthCheckUrl'],
  privateNetworkRouting: ['privateNetworkIpV4Ranges', 'privateNetworkIpV6Ranges'],
  privateNetworkDns: ['privateDnsZones'],
  privateNetworkIps: ['tunnelPrivateIpV4Range'],
  sourceIpValidation: ['egressSourceIPRestrictionEnabled', 'egressSourceIPRestrictionIPs'],
}

export const PICK_NETWORK_PROTECTION_CONFIG_PROPERTIES: Array<keyof NetworkProtectionConfig> = [
  'intrusionProtectionEnabled',
  'notify',
  'ipRep',
]
