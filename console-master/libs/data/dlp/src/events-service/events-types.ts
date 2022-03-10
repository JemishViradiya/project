//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

export enum EventsDlpColumnDataKey {
  DetectionTime = 'violationTime',
  Device = 'clientName',
  User = 'userName',
  Activity = 'eventType',
  Location = 'locations',
  File = 'fileNames',
  Policy = 'policyNames',
  DataType = 'dataEntityNames',
}

export interface EventBase {
  eventUUID: string
  eventType: string
  userName: string
  userId: string
  clientName: string
  violationTime: number
  locations: string[]
  policyGuids?: string[]
  fileCount?: number
  policyCount?: number
  dataEntityCount?: number
}

export interface EventDetails extends EventBase {
  userEmail: string
  userTitle: string
  userDepartment: string
  clientId: string
  fileDetails: FileDetails[]
  policyDetails: PolicyDetails[]
}

export type SnippetDetails = {
  evidenceStart: number
  evidenceLength: number
  content: string
}

export type DataEntityDetails = {
  dataEntityGuid: string
  dataEntityName: string
  numberOfOccurrence: number
  snippetDetails: SnippetDetails[]
}

export type FileDetails = {
  fileHash: string
  fileName: string
  fileType: string
  fileSize: number
  dataEntityDetails: DataEntityDetails[]
}

export type PolicyDetails = {
  policyName: string
  policyGuid: string
}
export enum EVENT_TYPES_VALUES {
  Browser = 'BROWSER',
  Email = 'EMAIL',
  RemovableMedia = 'REMOVABLE_MEDIA',
}

export enum EVENTS_SORT_BY {
  violationTime = 'EVENT_TIME',
  clientName = 'DEVICE_NAME',
  userName = 'USER_NAME',
  eventType = 'ACTIVITY',
  locations = 'DESTINATION',
}

export type EventTypes = Partial<EVENT_TYPES_VALUES>[]

export type EventsListRequestBody = {
  fileHashes?: string[]
  userIds?: string[]
  deviceIds?: string[]
}

export interface ExfiltrationEventsQueryFilters {
  startTime: string
  stopTime: string
  type?: string[]
  userName?: string
  locations?: string
  policyGuid?: string
  policyName?: string
  clientName?: string
  fileName?: string
  fileType?: string
  dataEntityGuid?: string
  dataEntityName?: string
}

export interface SensitiveDataQueryFilters {
  offset?: number
  max?: number
  policyGuid?: string
  dataEntityGuid?: string
  infoTypes?: string
  type?: string
}
