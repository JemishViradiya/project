//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

export interface ComplianceInfo {
  policyId: string
  policyName: string
  complianceList: ComplianceType[]
}

export interface ComplianceType {
  threatType: string
  remediationTime: number
  threats: Threat[]
  notifications?: Notifications
}

export interface Notifications {
  totalCount: number
  sentCount: number
  lastSentTime?: number
  nextSentTime?: number
}

export interface Threat {
  id: string
  eventValues?: EventValue[]
}

export interface EventValue {
  key: string
  value: string
}
