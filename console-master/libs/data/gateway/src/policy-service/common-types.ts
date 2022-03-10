//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

export enum RequestError {
  NameAlreadyUsed = 'NameAlreadyUsed',
}

export interface NetworkServiceEntityPartial {
  id: string
  name?: string
}

export type PageableRequestParams<TRequestParams = unknown> = {
  max?: number
  offset?: number
  query?: string
  sortBy?: string
} & TRequestParams

export enum TargetSetPortProtocol {
  TCP = 'TCP',
  UDP = 'UDP',
  TCPorUDP = 'TCP or UDP',
}

export interface TargetSetPort {
  protocol: TargetSetPortProtocol
  min: number
  max?: number
}

export interface TargetSet {
  addressSet: string[]
  portSet: TargetSetPort[]
}

export enum NetworkServiceTenantId {
  System = 'system',
}
