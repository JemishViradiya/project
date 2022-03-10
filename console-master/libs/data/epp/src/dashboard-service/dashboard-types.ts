type ThreatStats = {
  TotalRunningThreats: number
  RecentRunningThreats: number
  TotalAutoRunThreats: number
  RecentAutoRunThreats: number
  TotalQuarantinedThreats: number
  RecentQuarantinedThreats: number
  TotalUniqueThreats: number
  RecentUniqueThreats: number
  txtThreats: string
  txtDevices: string
  txtZones: string
  txtLoading: string
}

type TotalFilesAnalyzed = {
  fileCount: number
}

type PriorityThreats = {
  ThreatCount: number
  PercentageFromTotal: number
  AffectedDevices: number
}

type ThreatsByPriority = {
  TotalInstances: number
  HighPriorityThreats: PriorityThreats
  MediumPriorityThreats: PriorityThreats
  LowPriorityThreats: PriorityThreats
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

type TopTenListsDataType = {
  Ranking: number
  RankingId: number
  ItemId: string
  ItemCaption: string
}

type TopTenLists = {
  Threats: TopTenListsDataType[]
  Devices: TopTenListsDataType[]
  Zones: TopTenListsDataType[]
}

type ThreatEvents = {
  ThreatEventsDate: string
  UnsafeCount: number
  QuarantinedCount: number
  WaivedCount: number
  AbnormalCount: number
  RemovedCount: number
  ThreatId: string
  ThreatDateString: string
}

export { ThreatStats, TotalFilesAnalyzed, ThreatsByPriority, ThreatEvents, TopTenLists }
