//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import type { AccessControlBlockType, AccessControlType } from '@ues-data/gateway'

export interface PolicyEditorListItem {
  indexInParentArray: number
  name: string
  value: string
}

export interface AccessControlListItem extends PolicyEditorListItem {
  type: AccessControlBlockType
  parentType: AccessControlType
}

export enum WindowsPerAppVpnItemsType {
  AppIds = 'appIds',
  Paths = 'paths',
}

export interface DeviceSettingsListItem extends PolicyEditorListItem {
  parentType?: WindowsPerAppVpnItemsType
}

export enum DeviceType {
  Android = 'Android',
  Windows = 'Windows',
}
