//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { DATA_TYPES, DataEntity, STATUS } from '../types'

export enum TEMPLATE_FIELDS {
  NAME = 'name',
  DESCRIPTION = 'description',
  TYPE = 'type',
  STATUS = 'status',
  REGIONS = 'regionTags',
  INFO_TYPES = 'infoTypeTags',
  DATA_ENTITIES = 'dataEntities',
  UPDATED = 'updated',
  CREATED = 'created',
}

export type Template = {
  guid: string
  name: string
  description: string
  type: DATA_TYPES
  // status: STATUS
  regions: string
  infoTypes: string
  dataEntities: DataEntity[]
  created: string
  updated: string
  condition?: any
}

export type AssociateTemplates = {
  add?: string[]
  remove?: string[]
}
