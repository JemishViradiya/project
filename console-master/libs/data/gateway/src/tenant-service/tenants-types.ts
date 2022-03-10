//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

export enum TenantPrivateDnsZonesType {
  DnsServers = 'dnsServers',
  ForwardZones = 'forwardZones',
  ReverseZones = 'reverseZones',
}

export interface TenantDnsZone {
  name: string[]
  forward: string[]
}

interface TenantPrivateDnsZones {
  forwardZones: TenantDnsZone[]
  reverseZones: TenantDnsZone[]
}

export enum TenantHealth {
  Green = 'GREEN',
  Yellow = 'YELLOW',
  Red = 'RED',
}

export interface TenantConnectionInformation {
  bcpUrl: string
  apiGatewayUri: string
  idpDiscoveryUri: string
}

export interface TenantHealthEntity {
  health: TenantHealth | `${TenantHealth}`
}

export interface TenantConfiguration {
  tunnelClientIpV4Ranges?: string[]
  tunnelClientIpV6Ranges?: string[]
  privateNetworkIpV4Ranges?: string[]
  privateNetworkIpV6Ranges?: string[]
  healthCheckUrl?: string
  dnsSuffix?: string[]
  dnsSuffixEnabled?: boolean
  privateDnsZones?: TenantPrivateDnsZones
  sourceIPAnchoredEnabled?: boolean
  sourceIPAnchoredIPs?: string[]
  egressSourceIPRestrictionEnabled?: boolean
  egressSourceIPRestrictionIPs?: string[]
  tunnelPrivateIpV4Range?: string
}
