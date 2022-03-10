//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

export interface UsersBase {
  userId: string
  name: string
  email: string
  deviceCount: number
}

export type UsersQueryUrl = {
  sortBy?: string
  max?: number
  offset?: number
  name?: string
}

export type DevicesDetails = {
  deviceModel?: string
  deviceName?: string
  deviceType?: string
  dlpVersion?: string
  enrollmentDate?: string
  eosVersion?: string
  osName?: string
  osVersion?: string
  manufacturerName?: string
  platform?: string
}

export interface DevicesBase {
  deviceId: string
  activationTime: string
  lastAccessedTime: string
  devicesInfo?: DevicesDetails
}

export interface DevicesInfo {
  [key: string]: string
}
