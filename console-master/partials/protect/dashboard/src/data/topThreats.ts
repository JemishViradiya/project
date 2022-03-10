//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

// POST Dashboard/TotalFilesAnalyzed <empty>

import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

const getThreatsByPriorityGql = gql`
  query GeTotalFilesAnalyzed {
    threatsByPriority @rest(type: "ThreatsByPriorityStats", path: "/Dashboard/GetThreatsByPriorityStats") {
      TotalInstances: Int
      HighPriorityThreats @type(name: "ThreatsByPriorityStatH") {
        ThreatCount: Int
        PercentageFromTotal: Float
        AffectedDevices: Int
      }
      MediumPriorityThreats @type(name: "ThreatsByPriorityStatM") {
        ThreatCount: Int
        PercentageFromTotal: Float
        AffectedDevices: Int
      }
      LowPriorityThreats @type(name: "ThreatsByPriorityStatL") {
        ThreatCount: Int
        PercentageFromTotal: Float
        AffectedDevices: Int
      }
      IsAssetFeatureEnabled: Boolean
    }
  }
`
export interface ThreatsByPriority {
  TotalInstances: number
  HighPriorityThreats: { ThreatCount: number; PercentageFromTotal: number; AffectedDevices: number }
  MediumPriorityThreats: { ThreatCount: number; PercentageFromTotal: number; AffectedDevices: number }
  LowPriorityThreats: { ThreatCount: number; PercentageFromTotal: number; AffectedDevices: number }
  TotalFilesText: string
  AffectedText: string
  DevicesText: string
  txtTotal: string
  txtHigh: string
  txtOfTotalFiles: string
  txtAffectedDevices: string
  txtMedium: string
  txtLow: string
  IsAssetFeatureEnabled: boolean
}

export const getThreatsByPriority: ApolloQuery<{ threatsByPriority: ThreatsByPriority }, void> = {
  permissions: NoPermissions,
  query: getThreatsByPriorityGql,
  mockQueryFn: () => ({
    threatsByPriority: {
      TotalInstances: 27,
      HighPriorityThreats: { ThreatCount: 2, PercentageFromTotal: 7.41, AffectedDevices: 1 },
      MediumPriorityThreats: { ThreatCount: 25, PercentageFromTotal: 92.59, AffectedDevices: 2 },
      LowPriorityThreats: { ThreatCount: 0, PercentageFromTotal: 0, AffectedDevices: 0 },
      TotalFilesText: 'Total Files',
      AffectedText: 'Affected',
      DevicesText: 'Devices',
      txtTotal: 'Total',
      txtHigh: 'High',
      txtOfTotalFiles: 'of total files',
      txtAffectedDevices: 'affected devices',
      txtMedium: 'Medium',
      txtLow: 'Low',
      IsAssetFeatureEnabled: false,
    },
  }),
  context: getApolloQueryContext(APOLLO_DESTINATION.VENUE_API),
}

const getThreatClassificationsGql = gql`
  query getThreatClassifications($className: String!) {
    threatClassifications(className: $className)
      @rest(type: "ThreatClassifications", path: "/Dashboard/GetThreatClassifications?className={args.className}") {
      Name: String
      ThreatCount: Int
      ClassId: Int
      Items @type(name: "ThreatClassification") {
        Name: String
        ThreatCount: Int
        ClassId: Int
        SubClassId: Int
      }
    }
  }
`

interface ThreatClassification {
  Name: string
  ThreatCount: number
  ClassId: number
  SubClassId: number
}
export interface ThreatClassifications {
  Name: string
  ThreatCount: number
  ClassId: number
  Items: ThreatClassification[]
}

export const getThreatClassifications: ApolloQuery<
  { threatClassifications: ThreatClassifications[] },
  { className: 'Malware' | 'PUP' }
> = {
  permissions: NoPermissions,
  query: getThreatClassificationsGql,
  mockQueryFn: () => ({
    threatClassifications: [
      {
        Name: 'Malware',
        ThreatCount: 27,
        ClassId: 3,
        Items: [
          { Name: 'Backdoor', ThreatCount: 1, ClassId: 3, SubClassId: 7 },
          { Name: 'Infostealer', ThreatCount: 1, ClassId: 3, SubClassId: 8 },
          { Name: 'Trojan', ThreatCount: 9, ClassId: 3, SubClassId: 9 },
          { Name: 'Worm', ThreatCount: 7, ClassId: 3, SubClassId: 10 },
          { Name: 'Virus', ThreatCount: 4, ClassId: 3, SubClassId: 11 },
          { Name: 'Bot', ThreatCount: 1, ClassId: 3, SubClassId: 12 },
          { Name: 'Exploit', ThreatCount: 1, ClassId: 3, SubClassId: 13 },
          { Name: 'Downloader', ThreatCount: 2, ClassId: 3, SubClassId: 14 },
          { Name: 'Other', ThreatCount: 1, ClassId: 3, SubClassId: 15 },
        ],
      },
    ],
  }),
  context: getApolloQueryContext(APOLLO_DESTINATION.VENUE_API),
}
