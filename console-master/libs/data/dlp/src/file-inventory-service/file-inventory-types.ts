//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

export enum FileInventoryColumnDataKey {
  FileName = 'name',
  FileSize = 'size',
  InfoTypes = 'infoTypes',
  DataTypes = 'dataEntitiesCount',
  Users = 'userCount',
  Devices = 'deviceCount',
  Policies = 'policiesCount',
}

export interface FileInventoryBase {
  hash: string
  name: string
  size: number
  infoTypes: string[]
  policyGuids: string[]
  dataEntityGuids: string[]
  dataEntitiesCount: number
  policiesCount: number
}

export interface UserDeviceCountsItem {
  userCount: number
  deviceCount: number
}

export interface MetadataItem {
  filename: string
  createdby: string
  lastmodified: string
  lastuploadeddate: string
}

export interface dataEntitiesItem {
  guid: string
  occurrences: number
}

export interface policiesItem {
  guid: string
}

export interface FileInventoryDetails {
  hash: string
  name: string
  size: number
  type: string
  dataEntities: dataEntitiesItem[]
  policies: policiesItem[]
}

export enum FILE_INVENTORY_SORT_BY {
  name = 'FILE_NAME',
  size = 'FILE_SIZE',
  infoTypes = 'INFO_TYPE',
  dataEntitiesCount = 'DATA_ENTITY_COUNT',
  policiesCount = 'POLICY_COUNT',
}
