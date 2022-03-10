//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { ReconciliationEntityType } from '@ues-data/shared'

import type { NetworkServiceEntityPartial } from './common-types'

export enum PlatformAccessControlType {
  Inclusive = 'inclusive',
  Exclusive = 'exclusive',
}

export enum AccessControlType {
  Blocked = 'blocked',
  Allowed = 'allowed',
}

export enum AccessControlBlockType {
  NetworkServices = 'networkServices',
  Fqdns = 'fqdns',
  IpRanges = 'ipRanges',
}

export enum AuthorizedAppInterfaceModeType {
  AnyInterface = 'anyInterface',
  ForceTunnel = 'forceTunnel',
}

export enum UnauthorizedAppInterfaceModeType {
  ForceBearer = 'forceBearer',
  Block = 'block',
}

export enum OtherUserModeType {
  Conditional = 'conditional',
  Never = 'never',
}

export enum IncomingConnectionsType {
  Block = 'block',
  Allow = 'allow',
}

export interface AccessControlBlock {
  fqdns?: string[]
  ipRanges?: string[]
  networkServices?: NetworkServiceEntityPartial[]
}

export interface PlatformProfileDesktopCommon {
  protectRequired?: boolean
}

export interface PlatformProfileAndroid {
  perAppVpn?: {
    type?: PlatformAccessControlType | `${PlatformAccessControlType}`
    appIds?: string[]
  }
}

export interface PlatformProfileWindows extends PlatformProfileDesktopCommon {
  authorizedAppInterfaceMode?: AuthorizedAppInterfaceModeType
  incomingConnections?: IncomingConnectionsType
  unauthorizedAppInterfaceMode?: UnauthorizedAppInterfaceModeType
  otherUserMode?: OtherUserModeType
  perAppVpn?: {
    description?: string
    type?: PlatformAccessControlType | `${PlatformAccessControlType}`
    appIds?: string[]
    paths?: string[]
  }
}

export interface Policy {
  id?: string
  name: string
  entityType: ReconciliationEntityType | `${ReconciliationEntityType}`
  description?: string
  created?: number
  modified?: number
  // Available only for ReconciliationEntityType.NetworkAccessControl
  allowed?: AccessControlBlock
  blocked?: AccessControlBlock
  // Available only for ReconciliationEntityType.GatewayApp
  splitTunnelEnabled?: boolean
  splitIpRanges?: string[]
  platforms?: {
    Android?: PlatformProfileAndroid
    Windows?: PlatformProfileWindows
    macOS?: PlatformProfileDesktopCommon
  }
}
