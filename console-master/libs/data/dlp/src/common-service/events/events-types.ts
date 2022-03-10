export type EventsCountData = {
  item: string
  count: number
}

export interface EventsCountDataByParam {
  fileHashes?: EventsCountData[]
  userIds?: EventsCountData[]
  deviceIds?: EventsCountData[]
}

export interface EventCountByDetails {
  items: EventsCountDataByParam
}
